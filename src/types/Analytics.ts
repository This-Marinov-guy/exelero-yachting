import type { TrackingReport } from "@/types/Tracking";

export type ReportPeriod = { kind: "month" | "day"; date: string; start: string; end: string; today: string; timeZone: string };
export type TrafficPoint = { date: string; label: string; visits: number; visitors: number; views: number };
export type Breakdown = { name: string; value: number };
export type PageTraffic = { path: string; views: number; visitors: number; visits: number };
export type AnalyticsData = {
  totals: { visits: number; visitors: number; views: number; engagementRate: number };
  traffic: TrafficPoint[]; pages: PageTraffic[]; pageCount: number;
  sources: Breakdown[]; channels: Breakdown[]; regions: Breakdown[];
  timeZone: string; limited: boolean;
};
export type SearchData = { queries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[]; incompleteFrom: string | null };
export type ProviderReport<T> = { status: "ready"; data: T } | { status: "not-connected" | "error"; message: string };
export type AnalyticsReport = {
  period: ReportPeriod; page: string | null; fetchedAt: string; clarity: TrackingReport;
  analytics: ProviderReport<AnalyticsData>; search: ProviderReport<SearchData>;
};
