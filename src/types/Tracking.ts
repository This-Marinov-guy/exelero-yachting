export type ClaritySummary = {
  sessions: number | null;
  visitors: number | null;
  pagesPerSession: number | null;
  scrollDepth: number | null;
  botSessions: number | null;
  deadClicks: number | null;
  rageClicks: number | null;
  scriptErrors: number | null;
};

export type ClarityExport =
  | { status: "ready"; summary: ClaritySummary; fetchedAt: string; refreshAfter: string }
  | { status: "unavailable"; reason: "credentials" | "quota" | "connection" | "response"; refreshAfter: string };

export type TrackingReport = ({ dashboardUrl: string } & ClarityExport)
  | { status: "not_configured"; dashboardUrl: string };
