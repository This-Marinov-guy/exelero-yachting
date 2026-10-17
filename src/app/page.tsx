import type { Metadata } from "next";
import Layout from "./(mainBody)/layout";
import CarDemo1Container from "@/components/themes/carDemo1/Index";
import { getSiteUrl } from "@/lib/siteUrl";
import { publicPageMetadata } from "@/lib/publicSeo";
import { publicText } from "@/lib/publicText";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { HTML_LANG, localizedPath } from "@/lib/publicLocale";
import {
  LINKEDIN_URL,
  MAIN_CONTACT_EMAIL,
  MAIN_CONTACT_NUMBER,
} from "@/utils/defines/CONTACTS";

export const dynamic = "force-dynamic";

const homeTitle = "Exelero Yachting | Luxury Yachts, Brokerage & Charters";
const homeDescription = "Explore yachts for sale, brokerage, charters, and marine services with Exelero Yachting in Southeast Europe.";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerPublicLocale();
  return { ...publicPageMetadata(locale, "/", homeTitle, homeDescription), title: { absolute: publicText(locale, homeTitle) } };
}

const siteUrl = getSiteUrl();

export default async function Home() {
  const locale = await getServerPublicLocale();
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Exelero Yachting",
    url: `${siteUrl}${localizedPath(locale, "/")}`,
    inLanguage: HTML_LANG[locale],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Exelero Yachting",
    url: siteUrl,
    logo: `${siteUrl}/assets/images/logo/1.png`,
    description: publicText(locale, homeDescription),
    telephone: MAIN_CONTACT_NUMBER,
    email: MAIN_CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Burgas",
      addressCountry: "BG",
    },
    sameAs: [LINKEDIN_URL],
    areaServed: [{ "@type": "Country", name: "Romania" }, { "@type": "Country", name: "Bulgaria" }, { "@type": "Country", name: "Serbia" }],
    knowsLanguage: ["en", "ro", "bg", "sr-Latn"],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": publicText(locale, "Home"),
        "item": `${siteUrl}${localizedPath(locale, "/")}`
      }
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <Layout>
        <CarDemo1Container />
      </Layout>
    </main>
  );
}
