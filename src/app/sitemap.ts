import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Partners } from "@/data/partners";
import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

const generateNumericId = (uuid: string): number =>
  parseInt(uuid.replace(/-/g, "").substring(0, 8), 16) % 10000000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const partnerSlugs = Object.keys(Partners);
  const partnerRoutes: MetadataRoute.Sitemap = partnerSlugs.map((slug) => ({
    url: `${baseUrl}/partners/${slug}`,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/new-yachts` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/services/brokerage` },
    { url: `${baseUrl}/services/charters` },
    { url: `${baseUrl}/services/transportation` },
    ...partnerRoutes,
  ];

  const supabase = getSupabaseServerClient();
  const { data: boats, error } = await supabase
      .from("boats")
      .select("id, slug, updated_at")
      .eq("active", true)
      .eq("bought", false);

  if (error) {
    throw new Error(`Failed to build boat sitemap: ${error.message}`);
  }

  const boatUrls: MetadataRoute.Sitemap = (boats || []).map((boat) => ({
    url: `${baseUrl}/services/brokerage/${boat.slug || generateNumericId(boat.id)}`,
    ...(boat.updated_at ? { lastModified: new Date(boat.updated_at) } : {}),
  }));

  return [...staticRoutes, ...boatUrls];
}
