import CharterPage from "@/components/pages/charters/CharterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yacht Charters | Luxury Boat Rental & Experiences",
  description:
    "Book luxury yacht charters with Exelero Yachting. We offer cruiser, power boat, racer and luxury yacht charters for tailor-made marine experiences.",
  openGraph: {
    title: "Yacht Charters | Luxury Boat Rental & Experiences",
    description: "Book luxury yacht charters with Exelero Yachting. Explore our fleet of cruiser, power boat, and racer yachts.",
    url: "/services/charters",
    type: "website",
    images: [
      {
        url: "/assets/images/hero/charters.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury Yacht Charters",
      },
    ],
  },
  alternates: { canonical: "/services/charters" },
  robots: { index: true, follow: true },
};

const Charters = () => {
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
        "name": "Charters",
        "item": `${siteUrl}/services/charters`
      }
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Yacht Charters",
    "description": "Luxury yacht charters and tailor-made marine experiences.",
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
      <CharterPage />
    </>
  );
};

export default Charters;
