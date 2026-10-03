import type { Metadata, Viewport } from "next";
import "../index.scss";
import { I18nProvider } from "./i18n/i18n-context";
import { Providers } from "./MainProvider";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap' rel='stylesheet' />
      </head>
      <body suppressHydrationWarning={true}>
        <I18nProvider language="en">
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
