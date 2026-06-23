import NewYachtsPage from "@/components/pages/newYachts/NewYachtsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Yachts | X-Yachts & Omaya Yachts",
  description:
    "Explore new yachts from X-Yachts and Omaya Yachts, exclusively represented by Exelero Yachting.",
  openGraph: {
    title: "New Yachts | X-Yachts & Omaya Yachts",
    description:
      "Discover performance sailing yachts from X-Yachts and luxury power catamarans from Omaya Yachts.",
    url: "/new-yachts",
    type: "website",
    images: ["/assets/images/hero/x-yachts.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Yachts | X-Yachts & Omaya Yachts",
    description:
      "Discover performance sailing yachts from X-Yachts and luxury power catamarans from Omaya Yachts.",
    images: ["/assets/images/hero/x-yachts.jpg"],
  },
  alternates: { canonical: "/new-yachts" },
  robots: { index: true, follow: true },
};

const NewYachts = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://exelero.com";
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
