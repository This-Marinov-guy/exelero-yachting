export const MIN_BOAT_IMAGE_SHORT_EDGE = 1000;
export const MAX_BOAT_IMAGE_LONG_EDGE = 6400;

/** Keep the shorter side at its source size or at least 1000 px when resizing. */
export function boatImageLongEdgeLimit(width: number, height: number, preferredLongEdge: number): number {
  const longEdge = Math.max(width, height);
  const shortEdge = Math.min(width, height);
  if (!Number.isFinite(longEdge) || !Number.isFinite(shortEdge) || shortEdge <= 0) {
    throw new Error("This image has invalid dimensions.");
  }
  const minimumLongEdge = shortEdge < MIN_BOAT_IMAGE_SHORT_EDGE
    ? longEdge
    : Math.ceil(longEdge * MIN_BOAT_IMAGE_SHORT_EDGE / shortEdge);
  if (minimumLongEdge > MAX_BOAT_IMAGE_LONG_EDGE) {
    throw new Error("This image is too wide or tall to keep its shorter side at 1000 px. Choose another photo.");
  }
  return Math.min(longEdge, Math.max(preferredLongEdge, minimumLongEdge));
}
