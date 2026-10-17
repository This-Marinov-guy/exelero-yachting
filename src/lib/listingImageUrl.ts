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
