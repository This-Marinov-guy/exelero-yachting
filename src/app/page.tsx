import type { Metadata } from "next";
import Layout from "./(mainBody)/layout";
import CarDemo1Container from "@/components/themes/carDemo1/Index";
import { getSiteUrl } from "@/lib/siteUrl";
import {
  LINKEDIN_URL,
  MAIN_CONTACT_EMAIL,
  MAIN_CONTACT_NUMBER,
} from "@/utils/defines/CONTACTS";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Exelero Yachting | Luxury Yachts, Brokerage & Charters" },
  description:
    "Explore yachts for sale, brokerage, charters, and marine services with Exelero Yachting in Southeast Europe.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Exelero Yachting | Luxury Yachts, Brokerage & Charters",
    description:
      "Yachts for sale, brokerage, charters, and marine services across Southeast Europe.",
    url: "/",
    siteName: "Exelero Yachting",
    type: "website",
    images: [
      {
        url: "/assets/images/hero/x-yachts.jpg",
        width: 1200,
        height: 630,
        alt: "Exelero Yachting — Luxury Yachts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exelero Yachting | Luxury Yachts, Brokerage & Charters",
    description:
      "Yachts for sale, brokerage, charters, and marine services across Southeast Europe.",
    images: ["/assets/images/hero/x-yachts.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const siteUrl = getSiteUrl();

export default function Home() {
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Exelero Yachting",
    url: siteUrl,
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Exelero Yachting",
    url: siteUrl,
    logo: `${siteUrl}/assets/images/logo/1.png`,
    description:
      "Exelero Yachting — yacht sales, brokerage, charters, and marine services across Southeast Europe.",
    telephone: MAIN_CONTACT_NUMBER,
    email: MAIN_CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Burgas",
      addressCountry: "BG",
    },
    sameAs: [LINKEDIN_URL],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Layout>
        <CarDemo1Container />
      </Layout>
    </main>
  );
}
