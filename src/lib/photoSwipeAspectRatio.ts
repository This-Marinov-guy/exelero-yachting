import type PhotoSwipe from "photoswipe";
import { retryOptimizedImageUrl } from "@/lib/retryListingImage";

const RETRY_DELAYS_MS = [1500, 3000, 6000];

/** PhotoSwipe needs each image's dimensions before it lays out a slide. */
export function preservePhotoSwipeAspectRatio(photoswipe: PhotoSwipe): void {
  const slides = photoswipe.options.dataSource;
  if (Array.isArray(slides)) {
    for (const slide of slides) {
      const thumbnail = slide.element?.querySelector("img");
      if (thumbnail?.naturalWidth && thumbnail.naturalHeight) {
        slide.w = thumbnail.naturalWidth;
        slide.h = thumbnail.naturalHeight;
      }
    }
  }

  const unavailable = new Set<number>();
  const attempts = new Map<number, number>();
  const pending = new Map<number, { timer?: number; image?: HTMLImageElement }>();
  let destroyed = false;

  const nextAvailable = (index: number): number | null => {
    for (let offset = 1; offset < photoswipe.getNumItems(); offset++) {
      const next = (index + offset) % photoswipe.getNumItems();
      if (!unavailable.has(next)) return next;
    }
    return null;
  };

  const retry = (index: number) => {
    if (pending.has(index) || (attempts.get(index) || 0) >= RETRY_DELAYS_MS.length) return;
    const original = photoswipe.getItemData(index).src;
    if (!original) return;
    const attempt = (attempts.get(index) || 0) + 1;
    attempts.set(index, attempt);
    const timer = window.setTimeout(() => {
      if (destroyed) return;
      const candidate = retryOptimizedImageUrl(original, attempt);
      const image = new Image();
      pending.set(index, { image });
      image.onload = () => {
        pending.delete(index);
        if (destroyed) return;
        if (!image.naturalWidth || !image.naturalHeight) {
          retry(index);
          return;
        }
        const data = photoswipe.getItemData(index);
        data.src = candidate;
        data.w = image.naturalWidth;
        data.h = image.naturalHeight;
        unavailable.delete(index);
        photoswipe.refreshSlideContent(index);
      };
      image.onerror = () => {
        pending.delete(index);
        if (!destroyed) retry(index);
      };
      image.src = candidate;
    }, RETRY_DELAYS_MS[attempt - 1]);
    pending.set(index, { timer });
  };

  photoswipe.on("change", () => {
    if (!unavailable.has(photoswipe.currIndex)) return;
    const next = nextAvailable(photoswipe.currIndex);
    if (next !== null) photoswipe.goTo(next);
  });

  photoswipe.on("destroy", () => {
    destroyed = true;
    for (const request of pending.values()) {
      if (request.timer !== undefined) window.clearTimeout(request.timer);
      if (request.image) {
        request.image.onload = null;
        request.image.onerror = null;
      }
    }
    pending.clear();
  });

  // A thumbnail may still be loading when the gallery opens. Correct the slide
  // from the full image once it arrives, including slides reached by swiping.
  photoswipe.on("loadComplete", ({ content, slide, isError }) => {
    if (isError && slide) {
      unavailable.add(slide.index);
      retry(slide.index);
      if (photoswipe.currIndex === slide.index) {
        const next = nextAvailable(slide.index);
        if (next === null) photoswipe.close();
        else photoswipe.goTo(next);
      }
      return;
    }
    const image = content.element;
    if (!slide || !(image instanceof HTMLImageElement)) return;
    if (!image.naturalWidth || !image.naturalHeight) return;
    if (slide.width === image.naturalWidth && slide.height === image.naturalHeight) return;

    slide.data.w = image.naturalWidth;
    slide.data.h = image.naturalHeight;
    content.width = slide.width = image.naturalWidth;
    content.height = slide.height = image.naturalHeight;
    slide.resize();
  });
}
