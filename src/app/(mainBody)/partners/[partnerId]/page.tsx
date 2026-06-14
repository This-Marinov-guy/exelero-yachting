import PartnerPage from "@/components/pages/partners/PartnerPage";
import { Partners } from "@/data/partners";
import type { Metadata } from "next";

type Props = { params: Promise<{ partnerId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partnerId } = await params;
  const partner = partnerId ? Partners[partnerId] : undefined;

  if (!partner) {
    return { title: "Partner Not Found" };
  }

  return {
    title: `${partner.name} | Exelero Yachting Partners`,
    description: partner.description || `Learn more about our partnership with ${partner.name}.`,
    openGraph: {
      title: `${partner.name} | Exelero Yachting Partners`,
      description: partner.description,
      url: `/partners/${partnerId}`,
      type: "website",
      images: partner.heroImage ? [
        {
          url: partner.heroImage,
          width: 1200,
          height: 630,
          alt: partner.name,
        },
      ] : [],
    },
    alternates: { canonical: `/partners/${partnerId}` },
    robots: { index: true, follow: true },
  };
}

const PartnerDetailPage = async ({ params }: Props) => {
  const { partnerId } = await params;
  const partner = partnerId ? Partners[partnerId] : undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://exelero.com";

  if (!partner) {
    return <PartnerPage />;
  }

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
        "name": "Partners",
        "item": `${siteUrl}/partners`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": partner.name,
        "item": `${siteUrl}/partners/${partnerId}`
      }
    ]
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": partner.name,
    "description": partner.description,
    "logo": partner.logoImage ? `${siteUrl}${partner.logoImage}` : undefined,
    "url": partner.website
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <PartnerPage />
    </>
  );
};

export default PartnerDetailPage;
