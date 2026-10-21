function optimizedListingImageUrl(source: string, width: number, quality: number): string {
  const query = new URLSearchParams({ url: source, w: String(width), q: String(quality) });
  return `/_next/image?${query.toString()}`;
}

/** Serve opened listing photos through the same image cache as page thumbnails. */
export function listingImageViewUrl(source: string): string {
  return optimizedListingImageUrl(source, 1920, 75);
}

export function listingImageThumbnailUrl(source: string): string {
  return optimizedListingImageUrl(source, 640, 72);
}

/** Keep social crawlers on the site's image cache instead of repeatedly fetching full-size Storage files. */
export function socialPreviewImageUrl(source: string, siteUrl: string): string {
  try {
    const url = new URL(source, siteUrl);
    const isSupabaseImage = url.hostname.endsWith(".supabase.co")
      && url.pathname.startsWith("/storage/v1/object/public/")
      && /\.(?:jpe?g|png|webp)$/i.test(url.pathname);
    const isDriveListingImage = url.origin === siteUrl && url.pathname.startsWith("/api/boat-images/");

    if (!isSupabaseImage && !isDriveListingImage) return url.toString();

    const imageSource = isDriveListingImage ? `${url.pathname}${url.search}` : url.toString();
    return new URL(optimizedListingImageUrl(imageSource, 1200, 70), siteUrl).toString();
  } catch {
    return source;
  }
}
