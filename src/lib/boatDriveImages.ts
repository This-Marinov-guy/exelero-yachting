import "server-only";
import { createSign, randomUUID } from "node:crypto";
import sharp from "sharp";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";
const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";
const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const MAX_BOAT_IMAGE_BYTES = 20 * 1024 * 1024;

type Credentials = { client_email: string; private_key: string };
type OwnerOAuthCredentials = { client_id: string; client_secret: string; refresh_token: string };
type DriveIdentity = "service-account" | "owner";
const cachedTokens: Partial<Record<DriveIdentity, { token: string; expires: number }>> = {};

function credentials(): Credentials {
  const raw = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Google Drive image uploads are not configured.");
  let parsed: Partial<Credentials>;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Google Drive credentials are invalid."); }
  if (!parsed.client_email || !parsed.private_key) throw new Error("Google Drive credentials are invalid.");
  return { client_email: parsed.client_email, private_key: parsed.private_key.replaceAll("\\n", "\n") };
}

function ownerOAuthCredentials(): OwnerOAuthCredentials | null {
  const raw = process.env.GOOGLE_DRIVE_OWNER_OAUTH_JSON;
  if (!raw) return null;
  let parsed: Partial<OwnerOAuthCredentials>;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Google Drive owner authorization is invalid."); }
  if (!parsed.client_id || !parsed.client_secret || !parsed.refresh_token) throw new Error("Google Drive owner authorization is invalid.");
  return { client_id: parsed.client_id, client_secret: parsed.client_secret, refresh_token: parsed.refresh_token };
}

function folderId(): string {
  const id = process.env.GOOGLE_DRIVE_BOAT_IMAGES_FOLDER_ID || "";
  if (!/^[a-zA-Z0-9_-]{10,}$/.test(id)) throw new Error("Google Drive image folder is not configured.");
  return id;
}

async function accessToken(identity: DriveIdentity): Promise<string> {
  const cached = cachedTokens[identity];
  if (cached && cached.expires > Date.now()) return cached.token;
  let body: URLSearchParams;
  if (identity === "owner") {
    const creds = ownerOAuthCredentials();
    if (!creds) throw new Error("Google Drive owner authorization is not configured.");
    body = new URLSearchParams({ grant_type: "refresh_token", ...creds });
  } else {
    const creds = credentials();
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const issued = Math.floor(Date.now() / 1000);
    const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iss: creds.client_email, scope: DRIVE_SCOPE, aud: "https://oauth2.googleapis.com/token", iat: issued, exp: issued + 3600 })}`;
    const assertion = `${unsigned}.${createSign("RSA-SHA256").update(unsigned).sign(creds.private_key, "base64url")}`;
    body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion });
  }
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(identity === "owner" ? "Google Drive owner authorization needs reconnection." : `Google Drive authentication failed (${response.status}).`);
  const result = await response.json();
  if (typeof result.access_token !== "string") throw new Error("Google Drive authentication returned no access token.");
  cachedTokens[identity] = { token: result.access_token, expires: Date.now() + (Math.min(Number(result.expires_in) || 3600, 3600) - 60) * 1000 };
  return result.access_token;
}

async function driveFetch(url: string, init: RequestInit = {}, forWrite = false): Promise<Response> {
  const identity: DriveIdentity = forWrite && ownerOAuthCredentials() ? "owner" : "service-account";
  const token = await accessToken(identity);
  const response = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });
  if (response.status === 401) delete cachedTokens[identity];
  return response;
}

export function driveImageId(url: string): string | null {
  const match = /^\/api\/boat-images\/([a-zA-Z0-9_-]{10,})$/.exec(url);
  return match?.[1] || null;
}

export async function uploadBoatImage(file: File, listingKey: string): Promise<{ id: string; url: string }> {
  if (!IMAGE_MIME_TYPES.has(file.type)) throw new Error("Choose a JPEG, PNG or WebP image.");
  if (file.size > MAX_BOAT_IMAGE_BYTES) throw new Error("Images must be smaller than 20 MB.");
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(listingKey)) throw new Error("The listing upload session is invalid.");

  let optimized: Buffer;
  try {
    optimized = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 100_000_000 })
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toBuffer();
  } catch { throw new Error("This image could not be processed. Choose another JPEG, PNG or WebP file."); }

  const boundary = `exelero-${randomUUID()}`;
  const metadata = JSON.stringify({ name: `${listingKey}-${randomUUID()}.webp`, mimeType: "image/webp", parents: [folderId()] });
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: image/webp\r\n\r\n`),
    optimized,
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const response = await driveFetch(`${DRIVE_UPLOAD_API}?uploadType=multipart&supportsAllDrives=true&fields=id`, {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  }, true);
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const reason = error?.error?.errors?.[0]?.reason;
    const ownerConfigured = Boolean(ownerOAuthCredentials());
    if (reason === "storageQuotaExceeded") throw new Error(ownerConfigured
      ? "The Google Drive owner account has no available storage for this image."
      : "This My Drive folder needs owner OAuth access for uploads. A service account has no Drive storage quota.");
    if (response.status === 403 || response.status === 404) throw new Error(ownerConfigured
      ? "The authorized Google Drive account cannot add images to the configured folder."
      : "The service account cannot add images to the configured Drive folder.");
    throw new Error(`Google Drive could not save this image (${response.status}). Try again.`);
  }
  const result = await response.json();
  if (!/^[a-zA-Z0-9_-]{10,}$/.test(result.id || "")) throw new Error("Google Drive returned no image ID.");
  return { id: result.id, url: `/api/boat-images/${result.id}` };
}

export async function getBoatImage(id: string): Promise<Response> {
  const info = await driveFetch(`${DRIVE_API}/${id}?fields=parents,mimeType&supportsAllDrives=true`);
  if (!info.ok) return info;
  const metadata = await info.json();
  if (!Array.isArray(metadata.parents) || !metadata.parents.includes(folderId()) || metadata.mimeType !== "image/webp") {
    return new Response(null, { status: 404 });
  }
  return driveFetch(`${DRIVE_API}/${id}?alt=media&supportsAllDrives=true`);
}

export async function deleteBoatImage(id: string): Promise<void> {
  const info = await driveFetch(`${DRIVE_API}/${id}?fields=parents&supportsAllDrives=true`, {}, true);
  if (!info.ok) throw new Error("Could not find this image in Drive.");
  const metadata = await info.json();
  if (!Array.isArray(metadata.parents) || !metadata.parents.includes(folderId())) throw new Error("This image is outside the listing image folder.");
  const response = await driveFetch(`${DRIVE_API}/${id}?supportsAllDrives=true`, { method: "DELETE" }, true);
  if (!response.ok) throw new Error("Could not remove this image from Drive.");
}
