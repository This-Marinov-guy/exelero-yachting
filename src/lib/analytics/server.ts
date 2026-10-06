import "server-only";
import { createHash, createSign } from "node:crypto";
import type { AnalyticsReport, ProviderReport, SearchData, ReportPeriod } from "@/types/Analytics";
import type { TrackingReport } from "@/types/Tracking";
import { getTrackingReport } from "@/lib/clarityServer";
import { DEFAULT_ANALYTICS_TIME_ZONE, parseAnalytics, resolvePeriod, searchPageExpression, validatePage, type GoogleReport } from "./report";

type Credentials = { client_email: string; private_key: string };
class GoogleError extends Error { constructor(public status: number) { super("Google reporting request failed."); } }
let tokenCache: { fingerprint: string; token: string; expires: number } | undefined;
let tokenPending: { fingerprint: string; promise: Promise<string> } | undefined;
const reports = new Map<string, { expires: number; report: AnalyticsReport }>();
const pending = new Map<string, Promise<AnalyticsReport>>();
function credentials(): Credentials | null {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed.client_email !== "string" || typeof parsed.private_key !== "string") return null;
    return { client_email: parsed.client_email, private_key: parsed.private_key.replaceAll("\\n", "\n") };
  } catch { return null; }
}
async function accessToken(creds: Credentials) {
  const fingerprint = createHash("sha256").update(JSON.stringify(creds)).digest("hex");
  if (tokenCache?.fingerprint === fingerprint && tokenCache.expires > Date.now()) return tokenCache.token;
  if (tokenPending?.fingerprint === fingerprint) return tokenPending.promise;
  const promise = (async () => {
    const issued = Math.floor(Date.now() / 1000);
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iss: creds.client_email, scope: "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: issued, exp: issued + 3600 })}`;
    const assertion = `${unsigned}.${createSign("RSA-SHA256").update(unsigned).sign(creds.private_key, "base64url")}`;
    const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }), cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new GoogleError(response.status);
    const result = await response.json();
    if (typeof result.access_token !== "string") throw new Error("Missing access token.");
    tokenCache = { fingerprint, token: result.access_token, expires: Date.now() + Math.max(0, Math.min(Number(result.expires_in) || 3600, 3600) - 60) * 1000 };
    return tokenCache.token;
  })();
  tokenPending = { fingerprint, promise };
  try { return await promise; } finally { if (tokenPending?.promise === promise) tokenPending = undefined; }
}
async function googlePost(url: string, body: object, creds: Credentials) {
  const token = await accessToken(creds);
  const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!response.ok) { if (response.status === 401) tokenCache = undefined; throw new GoogleError(response.status); }
  return response.json();
}
function providerError<T>(error: unknown, name: string): ProviderReport<T> {
  const status = error instanceof GoogleError ? error.status : 0;
  const message = status === 403 ? `${name} access is unavailable. Check the service account's property access and enable its Google API.` : status === 401 || status === 400 ? `${name} could not connect. Check the reporting credentials and property settings.` : status === 429 ? `${name} has reached its reporting limit. Try again shortly.` : `${name} could not load this report. Try again.`;
  return { status: "error", message };
}
function analyticsHosts() {
  return (process.env.ANALYTICS_HOSTNAMES || "exeleroyachting.com,www.exeleroyachting.com").split(",").map(host => host.trim().toLowerCase()).filter(host => /^[a-z0-9.-]+$/.test(host));
}
function clarityFallback(): TrackingReport {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || "vekv1ut2zw";
  return {
    status: "unavailable",
    reason: "connection",
    refreshAfter: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    dashboardUrl: `https://clarity.microsoft.com/projects/view/${encodeURIComponent(projectId)}/dashboard`,
  };
}
async function ga4(period: ReportPeriod, page: string | null, creds: Credentials | null): Promise<AnalyticsReport["analytics"]> {
  const property = process.env.GA4_PROPERTY_ID;
  if (!property) return { status: "not-connected", message: "Set the numeric GA4_PROPERTY_ID in the server environment to connect traffic reports." };
  if (!/^\d+$/.test(property)) return { status: "not-connected", message: "GA4_PROPERTY_ID must be the numeric property ID, not a G- measurement ID." };
  if (!creds) return { status: "not-connected", message: "Add a valid GOOGLE_SERVICE_ACCOUNT_JSON and grant that service account Viewer access to the GA4 property." };
  try {
    const expressions: object[] = [
      { filter: { fieldName: "hostName", inListFilter: { values: analyticsHosts(), caseSensitive: false } } },
      { notExpression: { filter: { fieldName: "pagePath", stringFilter: { matchType: "FULL_REGEXP", value: "/(account|sign-in|sign-up|login|api)(/.*)?", caseSensitive: false } } } },
    ];
    if (page) expressions.push({ filter: { fieldName: "pagePath", stringFilter: { matchType: "EXACT", value: page, caseSensitive: true } } });
    const request = (dimensions: string[], metrics: string[], limit: number, order: string, dimensionOrder = false) => ({
      dateRanges: [{ startDate: period.start, endDate: period.end }], dimensions: dimensions.map(name => ({ name })), metrics: metrics.map(name => ({ name })),
      dimensionFilter: { andGroup: { expressions } }, limit: String(limit),
      orderBys: [{ ...(dimensionOrder ? { dimension: { dimensionName: order }, desc: false } : { metric: { metricName: order }, desc: true }) }],
    });
    const timeDimension = period.kind === "month" ? "date" : "dateHour";
    const requests = [
      request([], ["sessions", "totalUsers", "screenPageViews", "engagementRate"], 1, "sessions"),
      request([timeDimension], ["sessions", "totalUsers", "screenPageViews"], 1000, timeDimension, true),
      request(["pagePath"], ["screenPageViews", "totalUsers", "sessions"], 100, "screenPageViews"),
      request(["sessionSource", "sessionMedium"], ["sessions"], 10000, "sessions"),
      request(["sessionDefaultChannelGroup"], ["sessions"], 10000, "sessions"),
      request(["region", "country"], ["sessions"], 10000, "sessions"),
    ];
    const batches = await Promise.all([requests.slice(0, 5), requests.slice(5)].map(batch => googlePost(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:batchRunReports`, { requests: batch }, creds)));
    const data = parseAnalytics(batches.flatMap(batch => batch.reports || []) as GoogleReport[], period);
    return { status: "ready", data };
  } catch (error) { return providerError(error, "Google Analytics"); }
}
async function searchConsole(period: ReportPeriod, page: string | null, creds: Credentials | null): Promise<AnalyticsReport["search"]> {
  const site = process.env.SEARCH_CONSOLE_SITE_URL;
  if (!creds || !site) return { status: "not-connected", message: "Connect Search Console to see the searches that bring visitors to your website." };
  try {
    const result = await googlePost(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      startDate: period.start, endDate: period.end, dimensions: ["query"], type: "web", dataState: "all", rowLimit: 100,
      ...(page ? { dimensionFilterGroups: [{ groupType: "and", filters: [{ dimension: "page", operator: "includingRegex", expression: searchPageExpression(page, analyticsHosts()) }] }] } : {}),
    }, creds);
    const numeric = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : 0;
    const data: SearchData = {
      queries: (result.rows || []).map((row: { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }) => ({ query: row.keys?.[0] || "Unknown", clicks: numeric(row.clicks), impressions: numeric(row.impressions), ctr: numeric(row.ctr), position: numeric(row.position) })),
      incompleteFrom: result.metadata?.first_incomplete_date || null,
    };
    return { status: "ready", data };
  } catch (error) { return providerError(error, "Search Console"); }
}
export async function getAnalyticsReport(params: URLSearchParams): Promise<AnalyticsReport> {
  const period = resolvePeriod(params.get("period"), params.get("date"), process.env.ANALYTICS_TIME_ZONE || DEFAULT_ANALYTICS_TIME_ZONE);
  const page = validatePage(params.get("page"));
  const creds = credentials();
  const fingerprint = createHash("sha256").update(JSON.stringify([creds, process.env.GA4_PROPERTY_ID, process.env.SEARCH_CONSOLE_SITE_URL, process.env.CLARITY_API_TOKEN, process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID, analyticsHosts()])).digest("hex");
  const key = JSON.stringify([fingerprint, period, page]);
  const cached = reports.get(key);
  if (cached && cached.expires > Date.now()) return cached.report;
  if (pending.has(key)) return pending.get(key)!;
  const promise = (async () => {
    const results = await Promise.allSettled([ga4(period, page, creds), searchConsole(period, page, creds), getTrackingReport()]);
    const report: AnalyticsReport = {
      period, page, fetchedAt: new Date().toISOString(),
      analytics: results[0].status === "fulfilled" ? results[0].value : providerError(results[0].reason, "Google Analytics"),
      search: results[1].status === "fulfilled" ? results[1].value : providerError(results[1].reason, "Search Console"),
      clarity: results[2].status === "fulfilled" ? results[2].value : clarityFallback(),
    };
    if (report.analytics.status !== "error" && report.search.status !== "error") {
      if (reports.size >= 100) reports.delete(reports.keys().next().value!);
      reports.set(key, { report, expires: Date.now() + (period.end < period.today ? 3600000 : 300000) });
    }
    return report;
  })();
  pending.set(key, promise);
  try { return await promise; } finally { pending.delete(key); }
}
