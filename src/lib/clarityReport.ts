import type { ClaritySummary } from "@/types/Tracking";

type Row = Record<string, unknown>;

function isRow(value: unknown): value is Row {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function number(row: Row | undefined, keys: string[], percentage = false): number | null {
  for (const key of keys) {
    const value = row?.[key];
    if (typeof value !== "number" && (typeof value !== "string" || value.trim() === "")) continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0 && (!percentage || parsed <= 100)) return parsed;
  }
  return null;
}

// Only undimensioned exports are supported. Summing distinct users or averaging
// percentages across dimension rows would produce misleading site totals.
export function parseClaritySummary(payload: unknown): ClaritySummary {
  if (!Array.isArray(payload) || payload.some((entry) => !isRow(entry) || typeof entry.metricName !== "string" || !Array.isArray(entry.information))) {
    throw new Error("Unexpected Clarity export shape.");
  }
  const metrics = new Map<string, Row | undefined>();
  for (const entry of payload) {
    const rows = entry.information;
    metrics.set(entry.metricName.replace(/\s/g, "").toLowerCase(), rows.length === 1 && isRow(rows[0]) ? rows[0] : undefined);
  }
  const traffic = metrics.get("traffic");
  const summary: ClaritySummary = {
    sessions: number(traffic, ["totalSessionCount"]),
    // Microsoft's documentation contains both spellings/capitalizations.
    visitors: number(traffic, ["distinctUserCount", "distantUserCount"]),
    pagesPerSession: number(traffic, ["pagesPerSessionPercentage", "PagesPerSessionPercentage"]),
    scrollDepth: number(metrics.get("scrolldepth"), ["averageScrollDepth"], true),
    botSessions: number(traffic, ["totalBotSessionCount"]),
    deadClicks: number(metrics.get("deadclickcount"), ["sessionsWithMetricPercentage"], true),
    rageClicks: number(metrics.get("rageclickcount"), ["sessionsWithMetricPercentage"], true),
    scriptErrors: number(metrics.get("scripterrorcount"), ["sessionsWithMetricPercentage"], true),
  };
  if (payload.length > 0 && Object.values(summary).every((value) => value === null)) {
    throw new Error("No recognized Clarity summary metrics.");
  }
  return summary;
}
