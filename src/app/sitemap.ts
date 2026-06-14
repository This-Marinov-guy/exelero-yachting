import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Partners } from "@/data/partners";
import { MetadataRoute } from "next";

const generateNumericId = (uuid: string): number =>
  parseInt(uuid.replace(/-/g, "").substring(0, 8), 16) % 10000000;

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://exelero.com";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const getAlternates = (path: string) => ({
    languages: {
      en: `${baseUrl}${path}`,
      de: `${baseUrl}${path}?lng=ge`,
      fr: `${baseUrl}${path}?lng=fr`,
      es: `${baseUrl}${path}?lng=sp`,
      ko: `${baseUrl}${path}?lng=ko`,
    },
  });

  const partnerSlugs = Object.keys(Partners);
  const partnerRoutes: MetadataRoute.Sitemap = partnerSlugs.map((slug) => ({
    url: `${baseUrl}/partners/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: getAlternates(`/partners/${slug}`),
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1, alternates: getAlternates("/") },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9, alternates: getAlternates("/about") },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9, alternates: getAlternates("/contact") },
    { url: `${baseUrl}/services/brokerage`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95, alternates: getAlternates("/services/brokerage") },
    { url: `${baseUrl}/services/charters`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9, alternates: getAlternates("/services/charters") },
    { url: `${baseUrl}/services/transportation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9, alternates: getAlternates("/services/transportation") },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8, alternates: getAlternates("/gallery") },
    ...partnerRoutes,
  ];

  let boatUrls: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseServerClient();
    const { data: boats } = await supabase
      .from("boats")
      .select("id, updated_at")
      .eq("active", true);

    if (boats?.length) {
      boatUrls = boats.map((b) => {
        const boatId = generateNumericId(b.id);
        const path = `/services/brokerage/${boatId}`;
        return {
          url: `${baseUrl}${path}`,
          lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.85,
          alternates: getAlternates(path),
        };
      });
    }
  } catch {
    // omit boat URLs if DB unavailable (e.g. build time)
  }

  return [...staticRoutes, ...boatUrls];
}
