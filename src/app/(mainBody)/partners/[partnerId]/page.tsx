import PartnerPage from "@/components/pages/partners/PartnerPage";
import { absolutePartnerAssetUrl, getPublishedPartnerBySlug } from "@/lib/partners";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { notFound } from "next/navigation";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { translatedFields } from "@/lib/contentTranslations";
import { fallbackContentMetadata } from "@/lib/publicSeo";
import { localizedPath } from "@/lib/publicLocale";
import { publicText } from "@/lib/publicText";
import { PUBLIC_LOCALES } from "@/lib/publicLocale";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ partnerId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partnerId } = await params;
  const partner = await getPublishedPartnerBySlug(partnerId);
  const locale = await getServerPublicLocale();
  if (!partner) return { title: publicText(locale, "Partner Not Found"), robots: { index: false } };
  const localized = translatedFields(partner, locale);
  const description = localized.content.slice(0, 160);
  const image = absolutePartnerAssetUrl(getSiteUrl(), partner.breadcrumb_image_url);
  const available = PUBLIC_LOCALES.filter((value) => value === "en" || Boolean(partner.translations?.[value]?.content));
  return fallbackContentMetadata(locale, `/partners/${partner.slug}`, partner.name, description, available.includes(locale), image, available);
}

export default async function PartnerDetailPage({ params }: Props) {
  const { partnerId } = await params;
  const partner = await getPublishedPartnerBySlug(partnerId);
  if (!partner) notFound();
  const locale = await getServerPublicLocale();
  const localized = translatedFields(partner, locale);
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: publicText(locale, "Home"), item: `${siteUrl}${localizedPath(locale, "/")}` },
    { "@type": "ListItem", position: 2, name: partner.name, item: `${siteUrl}${localizedPath(locale, `/partners/${partner.slug}`)}` },
  ] };
  const orgJsonLd = { "@context": "https://schema.org", "@type": "Organization", name: partner.name, description: localized.content.slice(0, 160), logo: absolutePartnerAssetUrl(siteUrl, partner.logo_url), url: partner.website_url || `${siteUrl}${localizedPath(locale, `/partners/${partner.slug}`)}` };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
    <PartnerPage partner={localized} englishFields={partner.custom_fields} />
  </>;
}
