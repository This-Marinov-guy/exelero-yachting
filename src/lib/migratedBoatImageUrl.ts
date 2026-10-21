import migratedBoatImages from "@/data/migratedBoatImages.json";

const SOURCE = "https://zzdtbblgbgfzzsntfbur.supabase.co/storage/v1/object/public/boat_images/";
const imageUrls = migratedBoatImages as Record<string, string>;

export function migratedBoatImagePath(path: string): string | null {
  return imageUrls[path] || null;
}

export function migratedBoatImageUrl(url: string): string {
  if (!url.startsWith(SOURCE)) return url;
  const path = url.slice(SOURCE.length).split(/[?#]/, 1)[0];
  return migratedBoatImagePath(path) || url;
}
