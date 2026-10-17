import { translatedFields } from "@/lib/contentTranslations";
import type { PublicLocale } from "@/lib/publicLocale";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type SoldYacht = {
  id: string;
  title: string;
  manufacturer: string;
  buildYear: string;
  location: string;
  images: string[];
};

export async function getSoldYachts(locale: PublicLocale): Promise<SoldYacht[]> {
  const db = getSupabaseServerClient();
  const { data: boats, error: boatsError } = await db.from("boats")
    .select("id")
    .eq("bought", true)
    .order("updated_at", { ascending: false });
  if (boatsError) throw new Error(`Failed to load sold yachts: ${boatsError.message}`);
  if (!boats?.length) return [];

  const ids = boats.map((boat) => boat.id);
  const [detailsResult, imagesResult] = await Promise.all([
    db.from("boat_data")
      .select("boat_id, title, manufacturer, build_year, location, translations")
      .in("boat_id", ids),
    db.from("boat_images")
      .select("boat_id, link, is_cover, display_order")
      .in("boat_id", ids)
      .eq("media_type", "image")
      .order("display_order", { ascending: true }),
  ]);
  if (detailsResult.error) throw new Error(`Failed to load sold yacht details: ${detailsResult.error.message}`);
  if (imagesResult.error) throw new Error(`Failed to load sold yacht photos: ${imagesResult.error.message}`);

  const detailsById = new Map((detailsResult.data || []).map((detail) => [detail.boat_id, detail]));
  const imagesById = new Map<string, typeof imagesResult.data>();
  for (const image of imagesResult.data || []) {
    const images = imagesById.get(image.boat_id) || [];
    images.push(image);
    imagesById.set(image.boat_id, images);
  }

  return boats.flatMap((boat) => {
    const original = detailsById.get(boat.id);
    if (!original) return [];
    const detail = translatedFields(original, locale);
    const images = (imagesById.get(boat.id) || [])
      .sort((a, b) => Number(Boolean(b.is_cover)) - Number(Boolean(a.is_cover)))
      .map((image) => image.link)
      .filter(Boolean);
    return [{
      id: boat.id,
      title: detail.title,
      manufacturer: detail.manufacturer,
      buildYear: detail.build_year,
      location: detail.location,
      images,
    }];
  });
}
