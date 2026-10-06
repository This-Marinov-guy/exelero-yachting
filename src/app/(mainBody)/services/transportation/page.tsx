import TransportationPage from "@/components/pages/transportation/TransportationPage";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

const transportImage = "/assets/images/transportation/transport.jpg";

export const metadata: Metadata = {
  title: "Yacht Transportation",
  description:
    "Ask Exelero Yachting about yacht and boat transportation by land and sea, including planning and delivery options.",
  openGraph: {
    title: "Yacht Transportation",
    description: "Ask Exelero Yachting about yacht transportation by land and sea, including planning and delivery options.",
    url: "/services/transportation",
    type: "website",
    images: [{ url: transportImage, alt: "Yacht Transportation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Transportation",
    description: "Ask Exelero Yachting about yacht transportation by land and sea, including planning and delivery options.",
    images: [transportImage],
  },
  alternates: { canonical: "/services/transportation" },
  robots: { index: true, follow: true },
};

const Transportation = () => {
  const siteUrl = getSiteUrl();

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
        "name": "Yacht Transportation",
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
