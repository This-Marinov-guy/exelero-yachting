import PartnerPage from "@/components/pages/partners/PartnerPage";
import { absolutePartnerAssetUrl, getPublishedPartnerBySlug } from "@/lib/partners";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ partnerId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partnerId } = await params;
  const partner = await getPublishedPartnerBySlug(partnerId);
  if (!partner) return { title: "Partner Not Found", robots: { index: false } };
  const description = partner.content.slice(0, 160);
  const image = absolutePartnerAssetUrl(getSiteUrl(), partner.breadcrumb_image_url);
  return {
    title: partner.name,
    description,
    openGraph: { title: `${partner.name} | Exelero Yachting Partners`, description, url: `/partners/${partner.slug}`, type: "website", images: image ? [{ url: image, alt: partner.name }] : [] },
    twitter: { card: "summary_large_image", title: `${partner.name} | Exelero Yachting Partners`, description, images: image ? [image] : [] },
    alternates: { canonical: `/partners/${partner.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function PartnerDetailPage({ params }: Props) {
  const { partnerId } = await params;
  const partner = await getPublishedPartnerBySlug(partnerId);
  if (!partner) notFound();
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: partner.name, item: `${siteUrl}/partners/${partner.slug}` },
  ] };
  const orgJsonLd = { "@context": "https://schema.org", "@type": "Organization", name: partner.name, description: partner.content.slice(0, 160), logo: absolutePartnerAssetUrl(siteUrl, partner.logo_url), url: partner.website_url || `${siteUrl}/partners/${partner.slug}` };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
    <PartnerPage partner={partner} />
  </>;
}
