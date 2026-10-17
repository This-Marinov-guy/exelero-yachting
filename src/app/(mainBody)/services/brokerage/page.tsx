import BoatsPage from "@/components/pages/boats/BoatsPage";
import type { Metadata } from "next";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { publicText } from "@/lib/publicText";
import { publicPageMetadata } from "@/lib/publicSeo";
import { HTML_LANG, localizedPath } from "@/lib/publicLocale";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";
const path = "/services/brokerage";
const title = "Yachts for Sale";
const description = "Explore our exclusive collection of high-performance yachts and boats for sale. Find your perfect vessel from top manufacturers with expert dealer support.";

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadata(await getServerPublicLocale(), path, title, description);
}

export default async function PublicPage() {
  const locale = await getServerPublicLocale();
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${localizedPath(locale, path)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: publicText(locale, "Home"), item: `${siteUrl}${localizedPath(locale, "/")}` },
        { "@type": "ListItem", position: 2, name: publicText(locale, "Brokerage"), item: url },
      ] },
      { "@type": "CollectionPage", name: publicText(locale, title), description: publicText(locale, description), url, inLanguage: HTML_LANG[locale] },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <BoatsPage />
  </>;
}
