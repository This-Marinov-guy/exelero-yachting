import CharterPage from "@/components/pages/charters/CharterPage";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
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
    images: [breadcrumbOpenGraphImage("Luxury Yacht Charters")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Charters | Luxury Boat Rental & Experiences",
    description: "Book luxury yacht charters with Exelero Yachting. Explore our fleet of cruiser, power boat, and racer yachts.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
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
