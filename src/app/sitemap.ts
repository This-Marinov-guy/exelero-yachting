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

  const partnerSlugs = Object.keys(Partners);
  const partnerRoutes: MetadataRoute.Sitemap = partnerSlugs.map((slug) => ({
    url: `${baseUrl}/partners/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/services/brokerage`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/services/charters`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/services/transportation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
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
      boatUrls = boats.map((b) => ({
        url: `${baseUrl}/services/brokerage/${generateNumericId(b.id)}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }
  } catch {
    // omit boat URLs if DB unavailable (e.g. build time)
  }

  return [...staticRoutes, ...boatUrls];
}
