import { optimizeListingImage } from "@/lib/boatImageClient";

export async function uploadSiteImage(file: File, kind: "partner" | "profile" | "dealer" | "service", scope: string): Promise<string> {
  const optimized = await optimizeListingImage(file);
  const body = new FormData();
  body.set("file", optimized);
  body.set("kind", kind);
  body.set("scope", scope);
  const response = await fetch("/api/admin/site-images", { method: "POST", body });
  const result = await response.json().catch(() => null);
  if (!response.ok || typeof result?.url !== "string") throw new Error(result?.error || `Could not upload ${file.name}. Try again.`);
  return result.url;
}
