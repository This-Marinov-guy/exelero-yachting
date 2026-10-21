#!/usr/bin/env node
// Copy a staged, byte-checked Supabase image inventory into the configured Drive folder.
// Usage: node scripts/migrate-supabase-images.mjs --manifest=/path/staged-manifest.json --files=/path/Migrated\ Supabase\ images --output=/path/migration --upload
// Omit --upload to inspect/verify existing Drive files without changing Drive.
import { createHash, createSign, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [key, ...parts] = arg.replace(/^--/, "").split("=");
  return [key, parts.length ? parts.join("=") : true];
}));
if (!args.manifest || !args.files || !args.output) {
  console.error("Required: --manifest=... --files=... --output=... [--upload] [--site=https://production.site]");
  process.exit(2);
}
const rootId = process.env.GOOGLE_DRIVE_BOAT_IMAGES_FOLDER_ID;
const serviceJson = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON;
if (!args["verify-local"] && (!rootId || !serviceJson)) throw new Error("Drive root folder ID and service account JSON are required.");
if (!args["verify-local"] && rootId !== "1xV0PloKc59cPNKM_4JXlxV9XaQHkT5BB") throw new Error("This migration is only for the verified Website Storage folder.");
const service = serviceJson ? JSON.parse(serviceJson) : null;
const needsOwner = Boolean(args.upload || args["organize-existing"]);
const owner = needsOwner ? JSON.parse(process.env.GOOGLE_DRIVE_OWNER_OAUTH_JSON || "null") : null;
if (needsOwner && (!owner?.client_id || !owner?.client_secret || !owner?.refresh_token)) {
  throw new Error("Existing Drive owner OAuth credentials are required for uploads or folder moves.");
}
if (args["organize-existing"] && !args.site) throw new Error("--organize-existing requires --site to verify the deployed nested image route first.");

const API = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";
const FOLDER = "application/vnd.google-apps.folder";
const mime = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };
const tokens = {};
const hash = (bytes, algorithm) => createHash(algorithm).update(bytes).digest("hex");
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function token(identity) {
  if (tokens[identity]?.expiry > Date.now()) return tokens[identity].value;
  let body;
  if (identity === "owner") {
    body = new URLSearchParams({ grant_type: "refresh_token", ...owner });
  } else {
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iss: service.client_email, scope: "https://www.googleapis.com/auth/drive", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
    const assertion = `${unsigned}.${createSign("RSA-SHA256").update(unsigned).sign(service.private_key.replaceAll("\\n", "\n"), "base64url")}`;
    body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion });
  }
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${identity} Drive authentication failed (${response.status}).`);
  const result = await response.json();
  tokens[identity] = { value: result.access_token, expiry: Date.now() + (Number(result.expires_in || 3600) - 60) * 1000 };
  return result.access_token;
}

async function drive(url, options = {}, identity = "reader") {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${await token(identity === "owner" ? "owner" : "reader")}` },
      signal: AbortSignal.timeout(60000),
    });
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 4) return response;
    await sleep(1000 * 2 ** attempt);
  }
  throw new Error("Drive retries exhausted.");
}

async function children(parentId, identity = "reader") {
  const files = [];
  let pageToken;
  do {
    const params = new URLSearchParams({ q: `'${parentId}' in parents and trashed = false`, fields: "nextPageToken,files(id,name,mimeType,size,md5Checksum)", pageSize: "1000", supportsAllDrives: "true", includeItemsFromAllDrives: "true" });
    if (pageToken) params.set("pageToken", pageToken);
    const response = await drive(`${API}?${params}`, {}, identity);
    if (!response.ok) throw new Error(`Could not list Drive folder ${parentId} (${response.status}).`);
    const result = await response.json();
    files.push(...result.files);
    pageToken = result.nextPageToken;
  } while (pageToken);
  return files;
}

async function createFolder(parentId, name) {
  const response = await drive(`${API}?fields=id&supportsAllDrives=true`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: FOLDER, parents: [parentId] }),
  }, "owner");
  if (!response.ok) throw new Error(`Could not create Drive folder ${name} (${response.status}).`);
  return (await response.json()).id;
}

async function uploadImage(parentId, name, bytes, imageMime) {
  const boundary = `exelero-${randomUUID()}`;
  const metadata = JSON.stringify({ name, mimeType: imageMime, parents: [parentId] });
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${imageMime}\r\n\r\n`),
    bytes, Buffer.from(`\r\n--${boundary}--`),
  ]);
  const response = await drive(`${UPLOAD_API}?uploadType=multipart&supportsAllDrives=true&fields=id`, {
    method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body,
  }, "owner");
  if (!response.ok) throw new Error(`Could not upload ${name} (${response.status}).`);
  return (await response.json()).id;
}

async function metadata(id) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await drive(`${API}/${id}?fields=id,name,mimeType,size,md5Checksum,trashed,parents&supportsAllDrives=true`);
    if (response.ok) return response.json();
    if (![403, 404].includes(response.status) || attempt === 4) throw new Error(`The service account cannot read Drive image ${id} (${response.status}).`);
    await sleep(1000 * 2 ** attempt);
  }
  throw new Error(`The service account cannot read Drive image ${id}.`);
}

const rows = JSON.parse(await readFile(args.manifest, "utf8"));
if (!Array.isArray(rows) || !rows.length) throw new Error("The staged image manifest is empty.");
const sourceKeys = new Set();
for (const row of rows) {
  const key = `${row.bucket_id}/${row.name}`;
  if (sourceKeys.has(key)) throw new Error(`Duplicate source image: ${key}`);
  sourceKeys.add(key);
  if (!row.drive_path || path.isAbsolute(row.drive_path) || row.drive_path.split("/").includes("..") || !mime[path.extname(row.name).toLowerCase()]) throw new Error(`Invalid staged path: ${key}`);
  const bytes = await readFile(path.join(args.files, row.drive_path));
  if (bytes.length !== Number(row.bytes) || hash(bytes, "sha256") !== row.sha256) throw new Error(`Staged source has changed: ${key}`);
}
if (args["verify-local"]) {
  console.log(`Verified ${rows.length} staged images (${rows.reduce((sum, row) => sum + Number(row.bytes), 0)} bytes)`);
  process.exit(0);
}
await mkdir(args.output, { recursive: true });
const mappingPath = path.join(args.output, "verified-drive-mapping.json");
let mapping = {};
try { mapping = JSON.parse(await readFile(mappingPath, "utf8")); } catch { /* First run. */ }
const folderCache = new Map();
const childCache = new Map();
async function getChildren(id) {
  if (!childCache.has(id)) childCache.set(id, await children(id, args.upload ? "owner" : "reader"));
  return childCache.get(id);
}
async function folder(parentId, name) {
  const cacheKey = `${parentId}/${name}`;
  if (folderCache.has(cacheKey)) return folderCache.get(cacheKey);
  const matches = (await getChildren(parentId)).filter(file => file.name === name && file.mimeType === FOLDER);
  if (matches.length > 1) throw new Error(`Ambiguous Drive folder: ${cacheKey}`);
  let id = matches[0]?.id;
  if (!id && needsOwner) {
    id = await createFolder(parentId, name);
    childCache.delete(parentId);
  }
  if (!id) throw new Error(`Drive folder is missing: ${cacheKey}`);
  folderCache.set(cacheKey, id);
  return id;
}

const destination = await folder(rootId, "Migrated Supabase images");
let verified = 0;
for (const row of rows) {
  const segments = row.drive_path.split("/");
  let parentId = destination;
  for (const name of segments.slice(0, -1)) parentId = await folder(parentId, name);
  const name = segments.at(-1);
  const sourceKey = `${row.bucket_id}/${row.name}`;
  const bytes = await readFile(path.join(args.files, row.drive_path));
  const expectedMd5 = hash(bytes, "md5");
  let id = mapping[sourceKey]?.id;
  if (!id) {
    const matches = (await getChildren(parentId)).filter(file => file.name === name && file.mimeType === mime[path.extname(name).toLowerCase()]);
    const identical = matches.filter(file => file.md5Checksum === expectedMd5 && Number(file.size) === bytes.length);
    if (identical.length > 1) throw new Error(`Ambiguous Drive image: ${row.drive_path}`);
    id = identical[0]?.id;
    if (!id && args.upload) {
      if (matches.length) throw new Error(`Different Drive file already exists: ${row.drive_path}`);
      id = await uploadImage(parentId, name, bytes, mime[path.extname(name).toLowerCase()]);
      childCache.delete(parentId);
    }
  }
  if (!id) throw new Error(`Drive image is missing: ${row.drive_path}`);
  const file = await metadata(id);
  if (file.trashed || !file.parents?.includes(parentId) || file.mimeType !== mime[path.extname(name).toLowerCase()] || Number(file.size) !== bytes.length || file.md5Checksum !== expectedMd5) {
    throw new Error(`Drive verification failed: ${row.drive_path}`);
  }
  mapping[sourceKey] = { id, drive_path: row.drive_path, sha256: row.sha256, bytes: bytes.length };
  await writeFile(mappingPath, JSON.stringify(mapping, null, 2) + "\n");
  verified++;
  if (verified % 25 === 0 || verified === rows.length) console.log(`Verified ${verified}/${rows.length} Drive images`);
}
if (new Set(rows.map(row => mapping[`${row.bucket_id}/${row.name}`].id)).size !== rows.length) {
  throw new Error("Two staged images mapped to the same Drive file; database URLs were not changed.");
}

if (args.site) {
  const site = new URL(args.site);
  if (site.protocol !== "https:") throw new Error("--site must be an HTTPS site URL.");
  for (const row of rows) {
    const id = mapping[`${row.bucket_id}/${row.name}`].id;
    const response = await fetch(new URL(`/api/boat-images/${id}`, site), { signal: AbortSignal.timeout(30000) });
    if (!response.ok || hash(Buffer.from(await response.arrayBuffer()), "sha256") !== row.sha256) {
      throw new Error(`The deployed image route is not ready for ${row.drive_path}. Database URLs were not changed.`);
    }
  }
  console.log(`Verified ${rows.length} images through ${site.origin}`);
  if (args["organize-existing"]) {
    const listings = await folder(rootId, "Listings");
    const existingFolder = await folder(listings, "Existing Drive uploads");
    const rootImages = (await children(rootId)).filter(file => file.mimeType === "image/webp");
    for (const file of rootImages) {
      const params = new URLSearchParams({ addParents: existingFolder, removeParents: rootId, supportsAllDrives: "true", fields: "id,parents" });
      const moved = await drive(`${API}/${file.id}?${params}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: "{}" }, "owner");
      if (!moved.ok) throw new Error(`Could not organize existing Drive image ${file.name} (${moved.status}).`);
      const checked = await metadata(file.id);
      const response = await fetch(new URL(`/api/boat-images/${file.id}`, site), { signal: AbortSignal.timeout(30000) });
      const bytes = response.ok ? Buffer.from(await response.arrayBuffer()) : null;
      if (!checked.parents?.includes(existingFolder) || !bytes || hash(bytes, "md5") !== file.md5Checksum) {
        const undo = new URLSearchParams({ addParents: rootId, removeParents: existingFolder, supportsAllDrives: "true", fields: "id" });
        await drive(`${API}/${file.id}?${undo}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: "{}" }, "owner");
        throw new Error(`The deployed image route failed after moving ${file.name}; its original location was restored.`);
      }
    }
    console.log(`Organized ${rootImages.length} existing root Drive images`);
  }
  const values = rows.map(row => {
    const oldUrl = `https://zzdtbblgbgfzzsntfbur.supabase.co/storage/v1/object/public/${row.bucket_id}/${row.name}`;
    return `  (${quote(oldUrl)}, ${quote(`/api/boat-images/${mapping[`${row.bucket_id}/${row.name}`].id}`)})`;
  }).join(",\n");
  const tempTable = `CREATE TEMP TABLE image_migration (old_url text PRIMARY KEY, drive_url text NOT NULL) ON COMMIT DROP;
INSERT INTO image_migration (old_url, drive_url) VALUES
${values};`;
  const update = `-- Run only after this script verifies every Drive file and the deployed image route.
-- Originals in Supabase Storage are intentionally retained.
BEGIN;
${tempTable}
UPDATE public.boat_images AS b SET link = m.drive_url FROM image_migration AS m WHERE b.link = m.old_url;
UPDATE public.profile_image AS p SET image_url = m.drive_url FROM image_migration AS m WHERE p.image_url = m.old_url;
UPDATE public.partners AS p SET
  logo_url = COALESCE((SELECT drive_url FROM image_migration WHERE old_url = p.logo_url), p.logo_url),
  breadcrumb_image_url = COALESCE((SELECT drive_url FROM image_migration WHERE old_url = p.breadcrumb_image_url), p.breadcrumb_image_url),
  hero_image_url = COALESCE((SELECT drive_url FROM image_migration WHERE old_url = p.hero_image_url), p.hero_image_url)
WHERE p.logo_url IN (SELECT old_url FROM image_migration) OR p.breadcrumb_image_url IN (SELECT old_url FROM image_migration) OR p.hero_image_url IN (SELECT old_url FROM image_migration);
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM public.boat_images WHERE media_type = 'image' AND link LIKE '%/storage/v1/object/public/boat_images/%')
  OR EXISTS (SELECT 1 FROM public.profile_image WHERE image_url LIKE '%/storage/v1/object/public/profile_images/%')
  OR EXISTS (SELECT 1 FROM public.partners WHERE logo_url LIKE '%/storage/v1/object/public/partner-assets/%' OR breadcrumb_image_url LIKE '%/storage/v1/object/public/partner-assets/%' OR hero_image_url LIKE '%/storage/v1/object/public/partner-assets/%')
  THEN RAISE EXCEPTION 'Some Supabase image references were not in the verified mapping. Transaction rolled back.'; END IF;
END $$;
COMMIT;
`;
  const restore = `-- Restore original Supabase Storage URLs if the Drive route needs rollback.
-- Updates only rows that still point to this migration's Drive file IDs.
BEGIN;
${tempTable}
UPDATE public.boat_images AS b SET link = m.old_url FROM image_migration AS m WHERE b.link = m.drive_url;
UPDATE public.profile_image AS p SET image_url = m.old_url FROM image_migration AS m WHERE p.image_url = m.drive_url;
UPDATE public.partners AS p SET
  logo_url = COALESCE((SELECT old_url FROM image_migration WHERE drive_url = p.logo_url), p.logo_url),
  breadcrumb_image_url = COALESCE((SELECT old_url FROM image_migration WHERE drive_url = p.breadcrumb_image_url), p.breadcrumb_image_url),
  hero_image_url = COALESCE((SELECT old_url FROM image_migration WHERE drive_url = p.hero_image_url), p.hero_image_url)
WHERE p.logo_url IN (SELECT drive_url FROM image_migration) OR p.breadcrumb_image_url IN (SELECT drive_url FROM image_migration) OR p.hero_image_url IN (SELECT drive_url FROM image_migration);
COMMIT;
`;
  await writeFile(path.join(args.output, "update-image-urls.sql"), update);
  await writeFile(path.join(args.output, "restore-image-urls.sql"), restore);
  console.log("Wrote update-image-urls.sql and restore-image-urls.sql; no database changes were made.");
}
