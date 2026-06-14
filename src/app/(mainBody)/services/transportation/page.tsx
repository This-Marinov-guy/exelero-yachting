import TransportationPage from "@/components/pages/transportation/TransportationPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yacht Transportation & Logistics | Global Boat Delivery",
  description:
    "Professional yacht and boat transportation services by Exelero Yachting. We handle delivery by land and sea — safe, insured, and worldwide.",
  openGraph: {
    title: "Yacht Transportation & Logistics | Global Boat Delivery",
    description: "Professional yacht and boat transportation services by Exelero Yachting. land and sea delivery, safe and insured.",
    url: "/services/transportation",
    type: "website",
    images: [
      {
        url: "/assets/images/hero/transportation.jpg",
        width: 1200,
        height: 630,
        alt: "Yacht Transportation",
      },
    ],
  },
  alternates: { canonical: "/services/transportation" },
  robots: { index: true, follow: true },
};

const Transportation = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://exelero.com";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": `${siteUrl}/services`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Transportation",
        "item": `${siteUrl}/services/transportation`
      }
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Yacht Transportation",
    "description": "Professional yacht and boat transportation services by land and sea.",
    "provider": {
      "@type": "Organization",
      "name": "Exelero Yachting",
      "url": siteUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <TransportationPage />
    </>
  );
};

export default Transportation;
