import ContactContainer from "@/components/pages/contact";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Exelero Yachting | Get in Touch",
  description:
    "Get in touch with Exelero Yachting today. Contact us for expert advice on yacht brokerage, charters, transportation, and marine services.",
  openGraph: {
    title: "Contact Exelero Yachting | Get in Touch",
    description: "Contact Exelero Yachting for yacht brokerage, charters and marine services.",
    url: "/contact",
    type: "website",
    images: [breadcrumbOpenGraphImage("Contact Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Exelero Yachting | Get in Touch",
    description: "Contact Exelero Yachting for yacht brokerage, charters and marine services.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

const Contact1Page = () => {
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
        "name": "Contact",
        "item": `${siteUrl}/contact`
      }
    ]
  };

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Exelero Yachting",
    "description": "Contact us for yacht brokerage, charters and marine services.",
    "url": `${siteUrl}/contact`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactContainer />
    </>
  );
};

export default Contact1Page;
