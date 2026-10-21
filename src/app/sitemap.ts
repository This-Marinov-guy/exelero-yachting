import { getSupabasePublicClient, logPublicDataError } from "@/lib/supabaseServer";
import { getPublishedPartners } from "@/lib/partners";
import { availableServiceLocales } from "@/lib/servicePagePublic";
import { HREFLANG_LOCALES, PUBLIC_LOCALES, localizedPath, type PublicLocale } from "@/lib/publicLocale";
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export const revalidate = 3600;
const generateNumericId = (uuid: string): number =>
  parseInt(uuid.replace(/-/g, "").substring(0, 8), 16) % 10000000;

function localizedEntries(path: string, locales: PublicLocale[], lastModified?: Date): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const languages = Object.fromEntries([
    ...locales.map((locale) => [HREFLANG_LOCALES[locale], `${base}${localizedPath(locale, path)}`]),
    ["x-default", `${base}${localizedPath("en", path)}`],
  ]);
  return locales.map((locale) => ({
    url: `${base}${localizedPath(locale, path)}`,
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["/", "/about", "/new-yachts", "/contact", "/services/brokerage", "/gallery"];
  const staticEntries = staticPaths.flatMap((path) => localizedEntries(path, [...PUBLIC_LOCALES]));
  const serviceEntries = (await Promise.all(["charters", "transportation"].map(async (page) => {
    return localizedEntries(`/services/${page}`, await availableServiceLocales(page as "charters" | "transportation"));
  }))).flat();

  const partners = await getPublishedPartners();
  const partnerEntries = partners.flatMap((partner) => localizedEntries(
    `/partners/${partner.slug}`,
    PUBLIC_LOCALES.filter((locale) => locale === "en" || Boolean(partner.translations?.[locale]?.content)),
    new Date(partner.updated_at),
  ));

  let boatEntries: MetadataRoute.Sitemap = [];
  try {
    const db = getSupabasePublicClient();
    const { data: boats, error } = await db.from("boats")
      .select("id, slug, updated_at").eq("active", true).eq("bought", false);
    if (error) throw error;
    const boatIds = (boats || []).map((boat) => boat.id);
    const { data: details, error: detailsError } = boatIds.length
      ? await db.from("boat_data").select("boat_id, translations, updated_at").in("boat_id", boatIds)
      : { data: [] as { boat_id: string; translations: unknown; updated_at: string | null }[], error: null };
    if (detailsError) throw detailsError;
    const detailsByBoat = new Map((details || []).map((row) => [row.boat_id, row]));
    boatEntries = (boats || []).flatMap((boat) => {
      const detail = detailsByBoat.get(boat.id);
      const translations = detail?.translations as Record<string, { description?: string }> | null;
      const modified = [boat.updated_at, detail?.updated_at].filter(Boolean).map((value) => new Date(value!).getTime());
      return localizedEntries(
        `/services/brokerage/${boat.slug || generateNumericId(boat.id)}`,
        PUBLIC_LOCALES.filter((locale) => locale === "en" || Boolean(translations?.[locale]?.description)),
        modified.length ? new Date(Math.max(...modified)) : undefined,
      );
    });
  } catch (error) {
    logPublicDataError("Failed to build boat sitemap", error);
  }
  return [...staticEntries, ...serviceEntries, ...partnerEntries, ...boatEntries];
}
