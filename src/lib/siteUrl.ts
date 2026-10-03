const PRODUCTION_SITE_URL = "https://www.exeleroyachting.com";

/** Canonical origin shared by metadata, structured data, robots, and sitemap. */
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === "production") return PRODUCTION_SITE_URL;

  const configured = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003";

  const url = new URL(configured);
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside local development.");
  }
  return url.origin;
}
