import TransportationPage from "@/components/pages/transportation/TransportationPage";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { publicText } from "@/lib/publicText";
import { fallbackContentMetadata } from "@/lib/publicSeo";
import { localizedPath } from "@/lib/publicLocale";
import { getPublicServicePageContent, availableServiceLocales } from "@/lib/servicePagePublic";

export const dynamic = "force-dynamic";
const path = "/services/transportation";
const title = "Yacht Transportation";
const description = "Ask Exelero Yachting about yacht and boat transportation by land and sea, including planning and delivery options.";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerPublicLocale();
  const content = await getPublicServicePageContent("transportation");
  const first = content.media.gallery.find((item) => item.type === "image") ?? content.media.gallery[0];
  const image = first ? (first.type === "video" ? first.poster : first.src) : undefined;
  const available = await availableServiceLocales("transportation");
  return fallbackContentMetadata(locale, path, title, description, available.includes(locale), image, available);
}

export default async function PublicServicePage() {
  const locale = await getServerPublicLocale();
  const siteUrl = getSiteUrl();
  const content = await getPublicServicePageContent("transportation");
  const url = `${siteUrl}${localizedPath(locale, path)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: publicText(locale, "Home"), item: `${siteUrl}${localizedPath(locale, "/")}` },
        { "@type": "ListItem", position: 2, name: publicText(locale, title), item: url },
      ] },
      { "@type": "Service", name: publicText(locale, title), description: publicText(locale, description), url,
        provider: { "@type": "Organization", name: "Exelero Yachting", url: siteUrl },
        areaServed: [{ "@type": "Country", name: "Romania" }, { "@type": "Country", name: "Bulgaria" }, { "@type": "Country", name: "Serbia" }] },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <TransportationPage content={content} />
  </>;
}
