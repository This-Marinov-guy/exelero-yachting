import CharterPage from "@/components/pages/charters/CharterPage";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { getPublicServicePageContent } from "@/lib/servicePagePublic";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { banner, gallery } = (await getPublicServicePageContent("charters")).media;
  const firstAsset = gallery[0];
  const preview = banner ?? (firstAsset ? { src: firstAsset.type === "video" ? firstAsset.poster : firstAsset.src, alt: firstAsset.alt } : null);
  return {
  title: "Yacht Charters | Luxury Boat Rental & Experiences",
  description:
    "Book luxury yacht charters with Exelero Yachting. We offer cruiser, power boat, racer and luxury yacht charters for tailor-made marine experiences.",
  openGraph: {
    title: "Yacht Charters | Luxury Boat Rental & Experiences",
    description: "Book luxury yacht charters with Exelero Yachting. Explore our fleet of cruiser, power boat, and racer yachts.",
    url: "/services/charters",
    type: "website",
    images: preview ? [{ url: preview.src, alt: preview.alt }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Charters | Luxury Boat Rental & Experiences",
    description: "Book luxury yacht charters with Exelero Yachting. Explore our fleet of cruiser, power boat, and racer yachts.",
    images: preview ? [preview.src] : undefined,
  },
  alternates: { canonical: "/services/charters" },
  robots: { index: true, follow: true },
  };
}

const Charters = async () => {
  const siteUrl = getSiteUrl();
  const content = await getPublicServicePageContent("charters");

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
      <CharterPage content={content} />
    </>
  );
};

export default Charters;
