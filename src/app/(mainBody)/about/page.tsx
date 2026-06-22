import AboutPage from "@/components/pages/about/AboutPage";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Exelero Yachting | Our Story & Expertise",
  description:
    "Learn about Exelero Yachting — our story, deep expertise in yacht brokerage, charters, and marine services, and our unwavering commitment to excellence.",
  openGraph: {
    title: "About Exelero Yachting | Our Story & Expertise",
    description:
      "Learn about Exelero Yachting — our story, expertise in yacht brokerage, charters and marine services.",
    url: "/about",
    type: "website",
    images: [breadcrumbOpenGraphImage("About Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Exelero Yachting | Our Story & Expertise",
    description:
      "Learn about Exelero Yachting — our story, expertise in yacht brokerage, charters and marine services.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

const About = () => {
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

