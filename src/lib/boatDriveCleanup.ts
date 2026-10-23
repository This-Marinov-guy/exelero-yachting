import "server-only";
import { after } from "next/server";
import { deleteBoatImage, driveImageId } from "@/lib/boatDriveImages";
import type { getPartnerAdminClient } from "@/lib/partnerAdmin";

type AdminClient = NonNullable<Awaited<ReturnType<typeof getPartnerAdminClient>>>;

/** Run Drive cleanup after the database mutation has been sent to the browser. */
export function queueBoatDriveCleanup(client: AdminClient, urls: string[], allowMigrated = false): number {
  const ids = [...new Set(urls.map(driveImageId).filter((id): id is string => Boolean(id)))];
  if (!ids.length) return 0;

  after(async () => {
    // Keep Drive requests bounded when a listing has the full 25 photos.
    for (let offset = 0; offset < ids.length; offset += 4) {
      await Promise.all(ids.slice(offset, offset + 4).map(async (id) => {
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const url = `/api/boat-images/${id}`;
            const { data, error } = await client.from("boat_images").select("id").eq("link", url).limit(1);
            if (error) throw error;
            if (data?.length) return; // Another listing still uses the image.
            await deleteBoatImage(id, allowMigrated);
            return;
          } catch (error) {
            if (attempt === 2) console.error(`Drive image cleanup failed for ${id}:`, error);
            else await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 500));
          }
        }
      }));
    }
  });

  return ids.length;
}
