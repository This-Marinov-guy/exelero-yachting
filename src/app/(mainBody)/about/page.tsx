import AboutPage from "@/components/pages/about/AboutPage";
import type { Metadata } from "next";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { publicText } from "@/lib/publicText";
import { publicPageMetadata } from "@/lib/publicSeo";
import { HTML_LANG, localizedPath } from "@/lib/publicLocale";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";
const path = "/about";
const title = "About Exelero Yachting";
const description = "Discover Exelero Yachting's personalised approach, trusted partners, yacht services, and the experience of founder Krasimir Naumov.";

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
        { "@type": "ListItem", position: 2, name: publicText(locale, "About"), item: url },
      ] },
      { "@type": "AboutPage", name: publicText(locale, title), description: publicText(locale, description), url, inLanguage: HTML_LANG[locale] },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <AboutPage />
  </>;
}
