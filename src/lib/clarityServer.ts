import "server-only";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { parseClaritySummary } from "@/lib/clarityReport";
import type { ClarityExport, TrackingReport } from "@/types/Tracking";

const CACHE_SECONDS = 6 * 60 * 60;
const EXPORT_URL = "https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3";
const pending = new Map<string, Promise<ClarityExport>>();
let recent: { fingerprint: string; report: ClarityExport } | undefined;

async function fetchExport(token: string): Promise<ClarityExport> {
  const now = Date.now();
  const fetchedAt = new Date(now).toISOString();
  const refreshAfter = new Date(now + CACHE_SECONDS * 1000).toISOString();
  try {
    const response = await fetch(EXPORT_URL, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      const reason = response.status === 401 || response.status === 403 ? "credentials"
        : response.status === 429 ? "quota" : "connection";
      return { status: "unavailable", reason, refreshAfter };
    }
    try {
      return { status: "ready", summary: parseClaritySummary(await response.json()), fetchedAt, refreshAfter };
    } catch {
      return { status: "unavailable", reason: "response", refreshAfter };
    }
  } catch {
    return { status: "unavailable", reason: "connection", refreshAfter };
  }
}

export async function getTrackingReport(): Promise<TrackingReport> {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || "vekv1ut2zw";
  const dashboardUrl = `https://clarity.microsoft.com/projects/view/${encodeURIComponent(projectId)}/dashboard`;
  const token = process.env.CLARITY_API_TOKEN?.trim();
  if (!token) return { status: "not_configured", dashboardUrl };

  const fingerprint = createHash("sha256").update(`${projectId}:${token}`).digest("hex");
  // Next's dev server bypasses its Data Cache on browser no-cache requests.
  // Keep the latest result in this process as well to protect the export quota.
  if (recent?.fingerprint === fingerprint && Date.parse(recent.report.refreshAfter) > Date.now()) {
    return { ...recent.report, dashboardUrl };
  }
  // Authentication happens in the route before this shared cache. Cache failures
  // too: repeated reloads must not exhaust Clarity's 10 exports/day allowance.
  const read = unstable_cache(async () => {
    let request = pending.get(fingerprint);
    if (!request) {
      request = fetchExport(token).then((report) => {
        recent = { fingerprint, report };
        return report;
      }).finally(() => pending.delete(fingerprint));
      pending.set(fingerprint, request);
    }
    return request;
  }, ["clarity-summary-v1", fingerprint], { revalidate: CACHE_SECONDS });

  const report = await read();
  if (Date.parse(report.refreshAfter) > Date.now()) recent = { fingerprint, report };
  return { ...report, dashboardUrl };
}
