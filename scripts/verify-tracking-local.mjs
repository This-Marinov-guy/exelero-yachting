import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { parseClaritySummary } from "../src/lib/clarityReport.ts";

// Numeric strings, real zeros, and absent metrics must remain distinguishable.
const fixture = [
  { metricName: "Traffic", information: [{ totalSessionCount: "123", distinctUserCount: 115, totalBotSessionCount: "1", pagesPerSessionPercentage: 1.47 }] },
  { metricName: "ScrollDepth", information: [{ averageScrollDepth: "75.84" }] },
  { metricName: "DeadClickCount", information: [{ sessionsCount: 123, subTotal: 17, sessionsWithMetricPercentage: 6.5 }] },
  { metricName: "RageClickCount", information: [{ sessionsWithMetricPercentage: 0 }] },
];
assert.deepEqual(parseClaritySummary(fixture), {
  sessions: 123, visitors: 115, botSessions: 1, pagesPerSession: 1.47, scrollDepth: 75.84,
  deadClicks: 6.5, rageClicks: 0, scriptErrors: null,
});
assert.equal(parseClaritySummary([{ metricName: "Traffic", information: [{ distantUserCount: "8", PagesPerSessionPercentage: 1.2 }] }]).visitors, 8);
assert.equal(parseClaritySummary([{ metricName: "Traffic", information: [{ totalSessionCount: 0 }] }]).sessions, 0);
assert(Object.values(parseClaritySummary([])).every((value) => value === null));
assert.throws(() => parseClaritySummary({ error: "Unexpected object" }));
assert.throws(() => parseClaritySummary([{ metricName: "Unknown", information: [{}] }]));
assert.equal(parseClaritySummary([...fixture, { metricName: "ScriptErrorCount", information: [{ sessionsWithMetricPercentage: "" }] }]).scriptErrors, null);
assert.equal(parseClaritySummary([...fixture, { metricName: "ScriptErrorCount", information: [{ sessionsWithMetricPercentage: 101 }] }]).scriptErrors, null);
assert.equal(parseClaritySummary([...fixture, { metricName: "ScriptErrorCount", information: [{ sessionsWithMetricPercentage: 2 }, { sessionsWithMetricPercentage: 3 }] }]).scriptErrors, null);

process.loadEnvFile(".env.local");
const site = process.env.TRACKING_TEST_SITE_URL || "http://localhost:3001";
assert.match(site, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const local = Object.fromEntries(execFileSync("supabase", ["status", "-o", "env"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).split(/\r?\n/).filter((line) => line.includes("=")).map((line) => {
  const at = line.indexOf("="); return [line.slice(0, at), line.slice(at + 1).replace(/^"|"$/g, "")];
}));
assert.match(local.API_URL, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL, local.API_URL);
const admin = createClient(local.API_URL, local.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
let userId;
try {
  const denied = await fetch(`${site}/api/admin/tracking`);
  assert.equal(denied.status, 401, "Anonymous visitors must not read analytics reports.");
  assert.match(denied.headers.get("cache-control"), /private.*no-store/);
  const deniedBody = await denied.text();
  assert(!deniedBody.includes("clarityUrl"), "Anonymous responses must not reveal reporting configuration.");
  const email = `tracking-test-${Date.now()}@example.invalid`, password = randomUUID();
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  assert.ifError(error); userId = data.user.id;
  let jar = [];
  const client = createServerClient(local.API_URL, local.ANON_KEY, { cookies: { getAll: () => jar, setAll: (values) => { jar = values; } } });
  assert.ifError((await client.auth.signInWithPassword({ email, password })).error);
  const headers = { Cookie: jar.map(({ name, value }) => `${name}=${value}`).join("; ") };
  const response = await fetch(`${site}/api/admin/tracking`, { headers });
  assert.equal(response.status, 200, "All signed-in accounts can view Tracking without a separate admin role.");
  assert.match(response.headers.get("cache-control"), /private.*no-store/);
  const body = await response.text();
  assert(!process.env.CLARITY_API_TOKEN || !body.includes(process.env.CLARITY_API_TOKEN), "Never expose the Clarity token.");
  const report = JSON.parse(body);
  assert(["ready", "not-connected", "error"].includes(report.analytics.status));
  assert(["ready", "not-connected", "error"].includes(report.search.status));
  assert.equal(report.period.kind, "month");
  assert(!body.includes("private_key"));
  assert(!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !body.includes(process.env.GOOGLE_SERVICE_ACCOUNT_JSON));
  const repeated = await fetch(`${site}/api/admin/tracking`, { headers }).then((res) => res.json());
  if (report.analytics.status !== "error" && report.search.status !== "error") assert.deepEqual(repeated, report, "Reloads must share cached reports.");
  const invalid = await fetch(`${site}/api/admin/tracking?period=day&date=2099-12-31`, { headers });
  assert.equal(invalid.status, 400);
  console.log("Provider states:", report.analytics.status, report.search.status);
  const page = await fetch(`${site}/account?tab=tracking`, { headers });
  assert.equal(page.status, 200);
  assert.equal(new URL(page.url).pathname, "/account", "Authenticated direct links must not redirect to sign-in.");
  console.log("PASS: legacy Clarity parser, authenticated report access, input validation, private responses, credential privacy, caching and account direct URL.");
} finally {
  if (userId) assert.ifError((await admin.auth.admin.deleteUser(userId)).error);
}
