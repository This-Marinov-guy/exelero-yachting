import AboutPage from "@/components/pages/about/AboutPage";
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
    images: [
      {
        url: "/assets/images/other/about/general.jpg",
        width: 1200,
        height: 630,
        alt: "Exelero Yachting Team",
      },
    ],
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

