export const ACCOUNT_TAB_QUERY_PARAM = "tab";

export const ACCOUNT_TAB_IDS = [
  "dealer-info",
  "account-settings",
  "upload-boat",
  "boats-listing",
  "boat-inquiries",
  "partner-inquiries",
  "charter-requests",
  "transportation-requests",
  "partners",
  "charter-content",
  "transportation-content",
  "tracking",
] as const;

export type AccountTabId = (typeof ACCOUNT_TAB_IDS)[number];

export const DEFAULT_ACCOUNT_TAB: AccountTabId = "tracking";

export const isAccountTabId = (tab: string | null): tab is AccountTabId =>
  !!tab && ACCOUNT_TAB_IDS.includes(tab as AccountTabId);

export const normalizeAccountTab = (tab: string | null): AccountTabId =>
  tab === "page-content" ? "charter-content" : isAccountTabId(tab) ? tab : DEFAULT_ACCOUNT_TAB;
