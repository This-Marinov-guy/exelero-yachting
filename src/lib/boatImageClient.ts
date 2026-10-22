import { boatImageLongEdgeLimit } from "@/lib/boatImageResolution";

const MAX_REQUEST_IMAGE_BYTES = 3_500_000;
const UPLOAD_DIMENSIONS = [3200, 2560, 1920];
const UPLOAD_QUALITIES = [0.92, 0.90, 0.88];
export const MAX_LISTING_IMAGES = 25;
export const MAX_LISTING_VIDEOS = 15;

export async function optimizeListingImage(file: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPEG, PNG or WebP image.");
  if (file.size > 20 * 1024 * 1024) throw new Error(`${file.name} is larger than 20 MB.`);
  // Send small originals unchanged so they only go through one encoder on the server.
  if (file.size <= MAX_REQUEST_IMAGE_BYTES) return file;
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error(`${file.name} could not be opened as an image.`); }
  try {
    const attemptedDimensions = new Set<number>();
    for (const maxDimension of UPLOAD_DIMENSIONS) {
      const longEdgeLimit = boatImageLongEdgeLimit(bitmap.width, bitmap.height, maxDimension);
      const renderedLongEdge = Math.min(longEdgeLimit, Math.max(bitmap.width, bitmap.height));
      if (attemptedDimensions.has(renderedLongEdge)) continue;
      attemptedDimensions.add(renderedLongEdge);
      const scale = renderedLongEdge / Math.max(bitmap.width, bitmap.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not prepare this image.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of UPLOAD_QUALITIES) {
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
        if (blob && blob.type === "image/webp" && blob.size <= MAX_REQUEST_IMAGE_BYTES) {
          return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
        }
      }
    }
    throw new Error(`${file.name} cannot fit within the upload limit at the minimum image quality and resolution. Choose a smaller file.`);
  } finally { bitmap.close(); }
}

export async function uploadListingImage(file: File, listingKey: string): Promise<{ id: string; url: string }> {
  const optimized = await optimizeListingImage(file);
  const body = new FormData();
  body.set("file", optimized);
  body.set("listingKey", listingKey);
  const response = await fetch("/api/admin/boat-images", { method: "POST", body });
  const result = await response.json().catch(() => null);
  if (!response.ok || typeof result?.url !== "string") throw new Error(result?.error || `Could not upload ${file.name}. Try again.`);
  return result;
}

export async function removeListingImage(url: string): Promise<void> {
  const response = await fetch(`/api/admin/boat-images?url=${encodeURIComponent(url)}`, { method: "DELETE" });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error || "Could not remove this Drive image. Try again.");
}
