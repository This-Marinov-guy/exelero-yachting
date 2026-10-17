import GalleryPage from "@/components/pages/gallery/GalleryPage";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { publicPageMetadata } from "@/lib/publicSeo";
import { publicText } from "@/lib/publicText";
import { HTML_LANG, localizedPath } from "@/lib/publicLocale";
import { getSiteUrl } from "@/lib/siteUrl";
import { getSoldYachts } from "@/lib/soldYachts";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const path = "/gallery";
const title = "Sold Yacht Gallery";
const description = "Explore yachts sold by Exelero Yachting and browse photographs from completed sales.";

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadata(await getServerPublicLocale(), path, title, description);
}

export default async function Gallery() {
  const locale = await getServerPublicLocale();
  const yachts = await getSoldYachts(locale);
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${localizedPath(locale, path)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: publicText(locale, "Home"), item: `${siteUrl}${localizedPath(locale, "/")}` },
        { "@type": "ListItem", position: 2, name: publicText(locale, "Gallery"), item: url },
      ] },
      {
        "@type": "CollectionPage",
        name: publicText(locale, title),
        description: publicText(locale, description),
        url,
        inLanguage: HTML_LANG[locale],
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: yachts.length,
          itemListElement: yachts.map((yacht, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: yacht.title,
            ...(yacht.images[0] ? { image: yacht.images[0] } : {}),
          })),
        },
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <GalleryPage yachts={yachts} />
  </>;
}
