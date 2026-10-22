import type PhotoSwipe from "photoswipe";

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

  // A thumbnail may still be loading when the gallery opens. Correct the slide
  // from the full image once it arrives, including slides reached by swiping.
  photoswipe.on("loadComplete", ({ content, slide, isError }) => {
    const image = content.element;
    if (isError || !slide || !(image instanceof HTMLImageElement)) return;
    if (!image.naturalWidth || !image.naturalHeight) return;
    if (slide.width === image.naturalWidth && slide.height === image.naturalHeight) return;

    slide.data.w = image.naturalWidth;
    slide.data.h = image.naturalHeight;
    content.width = slide.width = image.naturalWidth;
    content.height = slide.height = image.naturalHeight;
    slide.resize();
  });
}
