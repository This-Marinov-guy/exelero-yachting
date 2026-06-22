export const DEFAULT_BREADCRUMB_IMAGE = "/assets/images/hero/main2.png";

export const breadcrumbOpenGraphImage = (alt = "Exelero Yachting") => ({
  url: DEFAULT_BREADCRUMB_IMAGE,
  width: 1200,
  height: 630,
  alt,
});

export const openGraphImage = (url: string, alt = "Exelero Yachting") => ({
  url,
  width: 1200,
  height: 630,
  alt,
});
