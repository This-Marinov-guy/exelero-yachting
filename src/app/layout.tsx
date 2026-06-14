/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import Script from "next/script";
import "../index.scss";
import { I18nProvider } from "./i18n/i18n-context";
import { detectLanguage } from "./i18n/server";
import { Providers } from "./MainProvider";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "vekv1ut2zw";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://exelero.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Exelero Yachting",
    template: "%s | Exelero Yachting",
  },
  description:
    "Exelero Yachting — luxury yachts, brokerage, charters, sailing gear and marine services. Find your perfect vessel.",
  keywords: [
    "yachting",
    "yacht brokerage",
    "boat charter",
    "yacht for sale",
    "marine services",
    "sailing",
    "luxury yacht",
    "Exelero",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/images/favicons/favicon.ico",
    apple: "/assets/images/favicons/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "Exelero Yachting",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/images/hero/x-yachts.jpg",
        width: 1200,
        height: 630,
        alt: "Exelero Yachting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "de": "/?lng=ge",
      "fr": "/?lng=fr",
      "es": "/?lng=sp",
      "ko": "/?lng=ko",
    },
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lng = await detectLanguage();

  return (
    <html lang={lng}>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap' rel='stylesheet' />
      </head>
      <body suppressHydrationWarning={true}>
        <I18nProvider language={lng}>
          <Providers>{children}</Providers>
        </I18nProvider>
        {IS_PRODUCTION && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
