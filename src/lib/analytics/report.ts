import type { AnalyticsData, Breakdown, ReportPeriod, TrafficPoint } from "../../types/Analytics";

export const DEFAULT_ANALYTICS_TIME_ZONE = "Europe/Sofia";

export function dateInZone(timeZone: string, now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function resolvePeriod(kind: string | null, date: string | null, timeZone = DEFAULT_ANALYTICS_TIME_ZONE, now = new Date(), from: string | null = null, to: string | null = null): ReportPeriod {
  if (kind !== null && kind !== "month" && kind !== "day" && kind !== "range") throw new Error("Choose a month, day or date range.");
  const mode = kind || "month";
  const today = dateInZone(timeZone, now);
  const validDay = (value: string | null): value is string => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value && value >= "2005-01-01" && value <= today;
  if (mode === "range") {
    if (!validDay(from) || !validDay(to) || from > to || Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`) > 365 * 86400000) {
      throw new Error("Choose a date range of up to 366 days ending today.");
    }
    return { kind: mode, date: from, start: from, end: to, today, timeZone };
  }
  const anchor = date || (mode === "month" ? today.slice(0, 7) : today);
  const first = mode === "month" ? `${anchor}-01` : anchor;
  if (!(mode === "month" ? /^\d{4}-\d{2}$/ : /^\d{4}-\d{2}-\d{2}$/).test(anchor) ||
      !Number.isFinite(Date.parse(`${first}T00:00:00Z`)) || new Date(`${first}T00:00:00Z`).toISOString().slice(0, 10) !== first || first < "2005-01-01" || first > today) {
    throw new Error("Choose a valid date between January 2005 and today.");
  }
  const end = mode === "month" ? new Date(Date.UTC(Number(anchor.slice(0, 4)), Number(anchor.slice(5, 7)), 0)).toISOString().slice(0, 10) : first;
  return { kind: mode, date: anchor, start: first, end: end > today ? today : end, today, timeZone };
}
export function validatePage(page: string | null) {
  if (!page) return null;
  if (!page.startsWith("/") || page.startsWith("//") || page.length > 1500 || /[?#\\]/.test(page) || [...page].some(char => char.charCodeAt(0) <= 32)) throw new Error("Choose a valid page path.");
  return page;
}
export type GoogleReport = {
  dimensionHeaders?: { name: string }[]; metricHeaders?: { name: string }[];
  rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[];
  rowCount?: number;
  metadata?: { timeZone?: string; subjectToThresholding?: boolean; dataLossFromOtherRow?: boolean; samplingMetadatas?: unknown[]; emptyReason?: string; dataTruncationReasons?: unknown[] };
};
export function reportRows(report: GoogleReport) {
  return (report.rows || []).map(row => ({
    dimensions: Object.fromEntries((report.dimensionHeaders || []).map((h, i) => [h.name, row.dimensionValues?.[i]?.value || "(not set)"])),
    metrics: Object.fromEntries((report.metricHeaders || []).map((h, i) => {
      const value = Number(row.metricValues?.[i]?.value || 0);
      return [h.name, Number.isFinite(value) ? value : 0];
    })),
  }));
}
export function parseAnalytics(reports: GoogleReport[], period: ReportPeriod, now = new Date()): AnalyticsData {
  if (reports.length !== 7) throw new Error("Incomplete analytics response.");
  const [summary, series, pages, countries, devices, channels, sources] = reports;
  const total = reportRows(summary)[0]?.metrics || {};
  const timeZone = summary.metadata?.timeZone || period.timeZone;
  const rows = new Map(reportRows(series).map(row => [row.dimensions[period.kind === "day" ? "dateHour" : "date"], row.metrics]));
  const traffic: TrafficPoint[] = [];
  const addPoint = (key: string, date: string, label: string) => {
    const metrics = rows.get(key) || {};
    traffic.push({ date, label, visits: metrics.sessions || 0, visitors: metrics.totalUsers || 0, views: metrics.screenPageViews || 0 });
  };
  if (period.kind !== "day") {
    const includeYear = period.start.slice(0, 4) !== period.end.slice(0, 4);
    for (let timestamp = Date.parse(`${period.start}T00:00:00Z`); timestamp <= Date.parse(`${period.end}T00:00:00Z`); timestamp += 86400000) {
      const date = new Date(timestamp).toISOString().slice(0, 10);
      addPoint(date.replaceAll("-", ""), date, new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", ...(includeYear ? { year: "2-digit" } : {}), timeZone: "UTC" }).format(timestamp));
    }
  } else {
    const today = dateInZone(timeZone, now);
    const lastHour = period.start === today ? Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone }).format(now)) : 23;
    for (let hour = 0; hour <= lastHour; hour++) {
      const label = `${String(hour).padStart(2, "0")}:00`;
      addPoint(`${period.start.replaceAll("-", "")}${label.slice(0, 2)}`, `${period.start}T${label}`, label);
    }
  }
  const breakdown = (report: GoogleReport, names: string[]): Breakdown[] => reportRows(report).map(row => ({ name: names.map(name => row.dimensions[name] === "(not set)" ? "Unknown" : row.dimensions[name]).join(" / "), value: row.metrics.sessions || 0 }));
  return {
    totals: { visits: total.sessions || 0, visitors: total.totalUsers || 0, views: total.screenPageViews || 0, engagementRate: total.engagementRate || 0 },
    traffic, pages: reportRows(pages).map(row => ({ path: row.dimensions.pagePath, visits: row.metrics.sessions || 0, views: row.metrics.screenPageViews || 0, visitors: row.metrics.totalUsers || 0 })),
    pageCount: pages.rowCount || 0,
    countries: breakdown(countries, ["country"]), devices: breakdown(devices, ["deviceCategory"]).map(item => ({ ...item, name: item.name === "Unknown" ? item.name : item.name.charAt(0).toUpperCase() + item.name.slice(1) })), channels: breakdown(channels, ["sessionDefaultChannelGroup"]), sources: breakdown(sources, ["sessionSource", "sessionMedium"]),
    timeZone, limited: reports.some(report => !!(report.metadata?.subjectToThresholding || report.metadata?.dataLossFromOtherRow || report.metadata?.samplingMetadatas?.length || report.metadata?.dataTruncationReasons?.length || report.metadata?.emptyReason)) || [countries, devices, channels, sources].some(report => (report.rowCount || 0) > (report.rows?.length || 0)),
  };
}
export function pieSegments(rows: Breakdown[], count = 6): Breakdown[] {
  const sorted = rows.filter(row => row.value > 0).sort((a, b) => b.value - a.value);
  const remainder = sorted.slice(count).reduce((sum, row) => sum + row.value, 0);
  return [...sorted.slice(0, count), ...(remainder ? [{ name: "Other", value: remainder }] : [])];
}
export function searchPageExpression(page: string, hosts: string[]) {
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `^https?://(${hosts.map(escape).join("|")})${escape(page)}(\\?.*)?$`;
}
