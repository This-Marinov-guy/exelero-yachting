import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded/wght.css";
import "../index.scss";
import { I18nProvider } from "./i18n/i18n-context";
import { Providers } from "./MainProvider";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import { getSiteUrl } from "@/lib/siteUrl";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { HTML_LANG, OPEN_GRAPH_LOCALES } from "@/lib/publicLocale";
import { publicText } from "@/lib/publicText";
import type { PublicLocale } from "@/lib/publicLocale";

const siteUrl = getSiteUrl();
const defaultDescription = "Exelero Yachting — luxury yachts, brokerage, charters, sailing gear and marine services. Find your perfect vessel.";
const keywordsByLocale: Record<PublicLocale, string[]> = {
  en: ["yachting", "yacht brokerage", "boat charter", "yacht for sale", "marine services", "sailing", "luxury yacht", "Exelero"],
  ro: ["iahturi", "brokeraj de iahturi", "charter de iahturi", "iahturi de vânzare", "servicii nautice", "navigație", "iaht de lux", "Exelero"],
  bg: ["яхти", "яхтен брокераж", "чартър на яхти", "яхти за продажба", "морски услуги", "ветроходство", "луксозни яхти", "Exelero"],
  sr: ["jahte", "posredovanje u prodaji jahti", "čarter jahti", "jahte na prodaju", "nautičke usluge", "jedrenje", "luksuzne jahte", "Exelero"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Exelero Yachting",
    template: "%s | Exelero Yachting",
  },
  description: defaultDescription,
  keywords: keywordsByLocale.en,
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/images/favicons/favicon.ico",
    apple: "/assets/images/favicons/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "Exelero Yachting",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerPublicLocale();
  const description = publicText(locale, defaultDescription);
  return {
    ...baseMetadata,
    description,
    keywords: keywordsByLocale[locale],
    openGraph: { ...baseMetadata.openGraph, title: "Exelero Yachting", description, locale: OPEN_GRAPH_LOCALES[locale] },
    twitter: { ...baseMetadata.twitter, title: "Exelero Yachting", description },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerPublicLocale();
  return (
    <html lang={HTML_LANG[locale]} data-scroll-behavior="smooth">
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap' rel='stylesheet' />
      </head>
      <body suppressHydrationWarning={true}>
        <I18nProvider language={locale}>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
