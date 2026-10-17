export const PUBLIC_LOCALES = ["en", "ro", "bg", "sr"] as const;
export type PublicLocale = (typeof PUBLIC_LOCALES)[number];

export const LOCALE_SWITCH_COOKIE = "site_locale_switching";
export const LOCALE_HEADER = "x-site-locale";

export const LANGUAGE_NAMES: Record<PublicLocale, string> = {
  en: "English",
  ro: "Română",
  bg: "Български",
  sr: "Srpski",
};

export const OPEN_GRAPH_LOCALES: Record<PublicLocale, string> = {
  en: "en_US",
  ro: "ro_RO",
  bg: "bg_BG",
  sr: "sr_RS",
};

export const HREFLANG_LOCALES: Record<PublicLocale, string> = {
  en: "en",
  ro: "ro-RO",
  bg: "bg-BG",
  sr: "sr-Latn-RS",
};

export const HTML_LANG: Record<PublicLocale, string> = {
  en: "en",
  ro: "ro",
  bg: "bg",
  sr: "sr-Latn",
};

export function isPublicLocale(value: unknown): value is PublicLocale {
  return typeof value === "string" && PUBLIC_LOCALES.includes(value as PublicLocale);
}

export function localeFromPath(pathname: string): PublicLocale | null {
  const firstSegment = pathname.split("/")[1];
  return isPublicLocale(firstSegment) ? firstSegment : null;
}

export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (!locale) return pathname;
  return pathname.slice(locale.length + 1) || "/";
}

export function isAccountPath(pathname: string): boolean {
  return ["/account", "/sign-in", "/sign-up", "/auth"].some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
}

export function localizedPath(locale: PublicLocale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  if (!match) return href;
  const path = stripLocale(match[1] || "/");
  if (isAccountPath(path) || path.startsWith("/api/") || path.startsWith("/assets/")) return href;
  if (locale === "en") return `${path}${match[2]}`;
  return `/${locale}${path === "/" ? "" : path}${match[2]}`;
}

