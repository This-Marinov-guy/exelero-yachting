import NewYachtsPage from "@/components/pages/newYachts/NewYachtsPage";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Yachts | Exelero Yachting",
  description:
    "Explore our new yacht brands, discover their ranges, and contact the Exelero Yachting team.",
  openGraph: {
    title: "New Yachts | Exelero Yachting",
    description:
      "Select a yacht brand to discover more and contact our team.",
    url: "/new-yachts",
    type: "website",
    images: ["/assets/images/hero/x-yachts.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Yachts | Exelero Yachting",
    description:
      "Select a yacht brand to discover more and contact our team.",
    images: ["/assets/images/hero/x-yachts.jpg"],
  },
  alternates: { canonical: "/new-yachts" },
  robots: { index: true, follow: true },
};

const NewYachts = () => {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "New Yachts",
        url: `${siteUrl}/new-yachts`,
        description: metadata.description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "New Yachts",
            item: `${siteUrl}/new-yachts`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NewYachtsPage />
    </>
  );
};

export default NewYachts;
