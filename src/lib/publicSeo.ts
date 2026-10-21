import type { Metadata } from "next";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import { publicText } from "./publicText";
import { getSiteUrl } from "./siteUrl";
import { socialPreviewImageUrl } from "./listingImageUrl";
import {
  HREFLANG_LOCALES,
  OPEN_GRAPH_LOCALES,
  PUBLIC_LOCALES,
  localizedPath,
  type PublicLocale,
} from "./publicLocale";

export function languageAlternates(path: string) {
  const base = getSiteUrl();
  return {
    canonical: `${base}${localizedPath("en", path)}`,
    languages: Object.fromEntries([
      ...PUBLIC_LOCALES.map((locale) => [HREFLANG_LOCALES[locale], `${base}${localizedPath(locale, path)}`]),
      ["x-default", `${base}${localizedPath("en", path)}`],
    ]),
  };
}

export function localizedAlternates(locale: PublicLocale, path: string): Metadata["alternates"] {
  const alternates = languageAlternates(path);
  return { ...alternates, canonical: `${getSiteUrl()}${localizedPath(locale, path)}` };
}

export function publicPageMetadata(locale: PublicLocale, path: string, englishTitle: string, englishDescription: string, image?: string): Metadata {
  const title = publicText(locale, englishTitle);
  const description = publicText(locale, englishDescription);
  const preview = image ? socialPreviewImageUrl(image, getSiteUrl()) : breadcrumbOpenGraphImage(englishTitle).url;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${getSiteUrl()}${localizedPath(locale, path)}`,
      siteName: "Exelero Yachting",
      type: "website",
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: PUBLIC_LOCALES.filter((other) => other !== locale).map((other) => OPEN_GRAPH_LOCALES[other]),
      images: [{ url: preview, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image ? preview : DEFAULT_BREADCRUMB_IMAGE, alt: title }] },
    robots: { index: true, follow: true },
  };
}

export function fallbackContentMetadata(locale: PublicLocale, path: string, englishTitle: string, englishDescription: string, translated: boolean, image?: string, availableLocales: PublicLocale[] = ["en"]): Metadata {
  const base = publicPageMetadata(locale, path, englishTitle, englishDescription, image);
  if (translated || locale === "en") {
    const site = getSiteUrl();
    return {
      ...base,
      alternates: {
        canonical: `${site}${localizedPath(locale, path)}`,
        languages: Object.fromEntries([
          ...availableLocales.map((value) => [HREFLANG_LOCALES[value], `${site}${localizedPath(value, path)}`]),
          ["x-default", `${site}${localizedPath("en", path)}`],
        ]),
      },
    };
  }
  return {
    ...base,
    alternates: { canonical: `${getSiteUrl()}${localizedPath("en", path)}` },
    robots: { index: false, follow: true },
  };
}
