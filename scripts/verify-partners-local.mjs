import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

process.loadEnvFile(".env.local");
const site = process.env.PARTNER_TEST_SITE_URL || "http://localhost:3001";
assert.match(site, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const local = Object.fromEntries(execFileSync("supabase", ["status", "-o", "env"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).split(/\r?\n/).filter((line) => line.includes("=")).map((line) => {
  const at = line.indexOf("="); return [line.slice(0, at), line.slice(at + 1).replace(/^"|"$/g, "")];
}));
assert.match(local.API_URL, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL, local.API_URL, "Run these tests only against the local Supabase stack.");
const admin = createClient(local.API_URL, local.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const anon = createClient(local.API_URL, local.ANON_KEY, { auth: { persistSession: false } });
const createdUsers = [];
let partnerId;
let uploadedPath;
let signedAdmin;
const tag = `partner-test-${Date.now()}`;
const request = async (path, options = {}, cookies = "") => {
  const response = await fetch(`${site}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(cookies ? { Cookie: cookies } : {}), ...options.headers } });
  const body = await response.text();
  return { status: response.status, body, json: () => JSON.parse(body) };
};
const authUser = async (role) => {
  const email = `${tag}-${role}@example.invalid`, password = randomUUID();
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: role === "admin" ? { role } : {} });
  assert.ifError(error); createdUsers.push(data.user.id);
  let jar = [];
  const client = createServerClient(local.API_URL, local.ANON_KEY, { cookies: { getAll: () => jar, setAll: (values) => { jar = values; } } });
  const result = await client.auth.signInWithPassword({ email, password });
  assert.ifError(result.error);
  return { client, cookie: jar.map(({ name, value }) => `${name}=${value}`).join("; ") };
};
let payload = {
  slug: tag, name: "Verification partner", logo_url: "", breadcrumb_image_url: "", hero_image_url: null,
  content: "", website_url: null, primary_color: "#123456", secondary_color: "#ffffff",
  form_type: "custom", custom_fields: [{ id: "interest", label: "", type: "select", required: true, options: [] }],
  status: "draft", show_on_home: true, show_on_new_yachts: true, sort_order: 99,
};
try {
  const settings = await fetch(`${local.API_URL}/auth/v1/settings`, { headers: { apikey: local.ANON_KEY } }).then((response) => response.json());
  assert.equal(settings.disable_signup, true, "Public signup must stay disabled for the invitation-only admin area.");
  signedAdmin = await authUser("member");
  assert.equal((await request("/api/admin/partners")).status, 403);
  assert.equal((await request("/api/admin/partners", {}, signedAdmin.cookie)).status, 200);
  const denied = await anon.from("partners").insert({ name: "Denied", slug: `${tag}-denied` });
  assert(denied.error, "RLS must deny anonymous visitors access to partner writes.");
  const saved = await request("/api/admin/partners", { method: "POST", body: JSON.stringify(payload) }, signedAdmin.cookie);
  assert.equal(saved.status, 201, saved.body); partnerId = saved.json().partner.id;
  assert.deepEqual((await anon.from("partners").select("id").eq("id", partnerId)).data, []);
  const draftPage = await request(`/partners/${tag}`);
  // Next can stream the not-found boundary with HTTP 200; it must stay noindex and never expose draft content.
  assert(draftPage.status === 404 || draftPage.body.includes('name="robots" content="noindex"'));
  assert(!draftPage.body.includes("Verification partner"));
  assert(!(await request("/new-yachts")).body.includes(tag), "Draft must not appear in New Yachts.");
  const incomplete = await request(`/api/admin/partners/${partnerId}`, { method: "PUT", body: JSON.stringify({ ...payload, status: "published" }) }, signedAdmin.cookie);
  assert.equal(incomplete.status, 400);
  const duplicate = await request("/api/admin/partners", { method: "POST", body: JSON.stringify(payload) }, signedAdmin.cookie);
  assert.equal(duplicate.status, 409);
  uploadedPath = `${tag}.png`;
  const image = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jC1YAAAAASUVORK5CYII=", "base64");
  const deniedUpload = await anon.storage.from("partner-assets").upload(`${tag}-denied.png`, image, { contentType: "image/png" });
  assert(deniedUpload.error, "Anonymous visitors must not upload partner assets.");
  assert.ifError((await signedAdmin.client.storage.from("partner-assets").upload(uploadedPath, image, { contentType: "image/png" })).error);
  payload = { ...payload, status: "published", logo_url: "/assets/images/logo/udeck.png", breadcrumb_image_url: "/assets/images/breadcrumbs/udeck.jpg", content: "Verification content for the selected yacht brand.", custom_fields: [{ id: "interest", label: "Interest", type: "select", required: true, options: ["Sailing", "Motor"] }] };
  const standard = await request(`/api/admin/partners/${partnerId}`, { method: "PUT", body: JSON.stringify({ ...payload, form_type: "standard", custom_fields: [{ id: "unfinished", label: "", type: "select", required: false, options: [] }] }) }, signedAdmin.cookie);
  assert.equal(standard.status, 200, "Unused custom fields must not block publishing a standard form.");
  const published = await request(`/api/admin/partners/${partnerId}`, { method: "PUT", body: JSON.stringify(payload) }, signedAdmin.cookie);
  assert.equal(published.status, 200, published.body);
  assert.equal((await anon.from("partners").select("id").eq("id", partnerId)).data.length, 1);
  assert((await request("/")).body.includes(`/partners/${tag}`));
  assert((await request("/new-yachts")).body.includes(`/partners/${tag}`));
  const detail = await request(`/partners/${tag}`); assert.equal(detail.status, 200); assert(detail.body.includes("Interest"));
  assert((await request("/sitemap.xml")).body.includes(`/partners/${tag}`));
  const invalidInquiry = await request(`/api/partners/${tag}/inquiries`, { method: "POST", body: JSON.stringify({ request_id: randomUUID(), name: "Local verification", email: "verify@example.invalid", phone: "+31 20 123 4567", message: "Local inquiry verification.", interest: "Invalid" }) });
  assert.equal(invalidInquiry.status, 400);
  if (!process.env.GMAIL_PASSWORD) {
    const submitted = await request(`/api/partners/${tag}/inquiries`, { method: "POST", body: JSON.stringify({ request_id: randomUUID(), name: "Local verification", email: "verify@example.invalid", phone: "+31 20 123 4567", message: "Local inquiry verification.", interest: "Sailing" }) });
    assert.equal(submitted.status, 202, submitted.body);
    assert.equal(submitted.json().notification, "pending", "Missing SMTP configuration must keep the saved inquiry visible while email is pending.");
    const rows = await admin.from("partner_inquiries").select("answers").eq("partner_id", partnerId);
    assert.equal(rows.data?.[0]?.answers.interest, "Sailing");
  }
  const hidden = await request(`/api/admin/partners/${partnerId}`, { method: "PUT", body: JSON.stringify({ ...payload, status: "draft" }) }, signedAdmin.cookie);
  assert.equal(hidden.status, 200);
  assert(!(await request("/new-yachts")).body.includes(tag));
  assert(!(await request("/sitemap.xml")).body.includes(tag));
  assert.equal((await request(`/api/partners/${tag}/inquiries`, { method: "POST", body: "{}" })).status, 404);
  assert.equal((await request("/api/refresh-sitemap", { method: "POST" })).status, 401);
  console.log("PASS: invitation-only account access, RLS, image upload, draft/publish, slug uniqueness, server-rendered listings, custom form validation, sitemap inclusion and unpublish.");
} finally {
  if (partnerId) {
    if (signedAdmin) await request(`/api/admin/partners/${partnerId}`, { method: "PUT", body: JSON.stringify({ ...payload, status: "draft" }) }, signedAdmin.cookie);
    await admin.from("partner_inquiries").delete().eq("partner_id", partnerId);
    await admin.from("partners").delete().eq("id", partnerId);
  }
  if (uploadedPath) await admin.storage.from("partner-assets").remove([uploadedPath]);
  for (const id of createdUsers) await admin.auth.admin.deleteUser(id);
}
