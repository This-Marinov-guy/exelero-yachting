import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getPublishedPartners } from "@/lib/partners";
import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export const revalidate = 3600;
const generateNumericId = (uuid: string): number =>
  parseInt(uuid.replace(/-/g, "").substring(0, 8), 16) % 10000000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const partners = await getPublishedPartners();
  const partnerRoutes: MetadataRoute.Sitemap = partners.map((partner) => ({
    url: `${baseUrl}/partners/${partner.slug}`,
    lastModified: new Date(partner.updated_at),
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
  const { data: boats, error } = await getSupabaseServerClient()
    .from("boats").select("id, slug, updated_at").eq("active", true).eq("bought", false);
  if (error) throw new Error(`Failed to build boat sitemap: ${error.message}`);
  const boatUrls: MetadataRoute.Sitemap = (boats || []).map((boat) => ({
    url: `${baseUrl}/services/brokerage/${boat.slug || generateNumericId(boat.id)}`,
    ...(boat.updated_at ? { lastModified: new Date(boat.updated_at) } : {}),
  }));
  return [...staticRoutes, ...boatUrls];
}
