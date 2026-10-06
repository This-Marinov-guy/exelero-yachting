export const CLARITY_CONSENT_KEY = "excelero_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "exelero:open-cookie-settings";
const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

type ClarityCommand = (...args: unknown[]) => void;

function clarityWindow(): (Window & { clarity?: ClarityCommand }) | null {
  return typeof window === "undefined" ? null : window;
}

export function getAnalyticsConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CLARITY_CONSENT_KEY);
    if (!stored) return null;
    const choice = JSON.parse(stored) as { all?: unknown; timestamp?: unknown };
    const savedAt = typeof choice?.timestamp === "string" ? Date.parse(choice.timestamp) : NaN;
    if (!Number.isFinite(savedAt) || Date.now() - savedAt > CONSENT_MAX_AGE_MS) return null;
    return typeof choice?.all === "boolean" ? choice.all : null;
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(allowed: boolean): void {
  try {
    window.localStorage.setItem(
      CLARITY_CONSENT_KEY,
      JSON.stringify({ mandatory: true, all: allowed, timestamp: new Date().toISOString() })
    );
  } catch {
    // Keep the current choice for this page when storage is unavailable.
  }
}

export function isClarityPublicPath(path: string): boolean {
  return path === "/" || ["/about", "/contact", "/new-yachts", "/services/charters", "/services/transportation", "/services/brokerage"].includes(path)
    || path.startsWith("/services/brokerage/")
    || path.startsWith("/partners/");
}

export function isClarityProductionHost(): boolean {
  return ["www.exeleroyachting.com", "exeleroyachting.com"].includes(clarityWindow()?.location.hostname || "");
}

export function getClarityPageType(path: string): string {
  if (path.startsWith("/services/brokerage/")) return "boat_detail";
  if (path === "/services/brokerage") return "brokerage";
  if (path === "/services/charters") return "charters";
  if (path === "/services/transportation") return "transportation";
  if (path.startsWith("/partners/")) return "partner";
  if (path === "/") return "home";
  return "information";
}

export function trackClarityEvent(name: string): void {
  const browser = clarityWindow();
  if (!browser || !isClarityProductionHost() || !isClarityPublicPath(browser.location.pathname) || getAnalyticsConsent() !== true) return;
  browser.clarity?.("event", name);
}
