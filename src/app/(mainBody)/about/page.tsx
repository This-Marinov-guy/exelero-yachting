import AboutPage from "@/components/pages/about/AboutPage";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "About Exelero Yachting",
  description:
    "Discover Exelero Yachting's personalised approach, trusted partners, yacht services, and the experience of founder Krasimir Naumov.",
  openGraph: {
    title: "About Exelero Yachting | Premium Yachting Experience",
    description:
      "Discover our personalised approach, yacht services, trusted partners, and the experience of founder Krasimir Naumov.",
    url: "/about",
    type: "website",
    images: [breadcrumbOpenGraphImage("About Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Exelero Yachting | Premium Yachting Experience",
    description:
      "Discover our personalised approach, yacht services, trusted partners, and the experience of founder Krasimir Naumov.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

const About = () => {
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
        "name": "About",
        "item": `${siteUrl}/about`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutPage />
    </>
  );
};

export default About;

