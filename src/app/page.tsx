import type { Metadata } from "next";
import Layout from "./(mainBody)/layout";
import CarDemo1Container from "@/components/themes/carDemo1/Index";

export const metadata: Metadata = {
  title: "Exelero Group — Yachting and more",
  description:
    "Exelero Yachting: performance and luxury yachts, brokerage & charters, and sailing gear. Explore our partners and services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Exelero Group — Yachting and more",
    description:
      "Performance and luxury yachts, brokerage & charters, and sailing gear. Explore partners and services with Exelero Yachting.",
    url: "/",
    siteName: "Exelero Yachting",
    type: "website",
    images: [
      {
        url: "/assets/images/hero/x-yachts.jpg",
        width: 1200,
        height: 630,
        alt: "Exelero Yachting — hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exelero Group — Yachting and more",
    description:
      "Performance and luxury yachts, brokerage & charters, and sailing gear. Explore partners and services with Exelero Yachting.",
    images: ["/assets/images/hero/x-yachts.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://exelero.com");

export default function Home() {
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Exelero Yachting",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/services/brokerage?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Exelero Yachting",
    url: siteUrl,
    description:
      "Exelero Yachting — luxury yachts, brokerage, charters, sailing gear and marine services.",
    sameAs: [],
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
      <Layout>
        <CarDemo1Container />
      </Layout>
    </main>
  );
}
