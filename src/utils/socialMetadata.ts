export const DEFAULT_BREADCRUMB_IMAGE = "/assets/images/other/about/general.jpg";

export const breadcrumbOpenGraphImage = (alt = "Exelero Yachting") => ({
  url: DEFAULT_BREADCRUMB_IMAGE,
  width: 2048,
  height: 1371,
  alt,
});

export const openGraphImage = (url: string, alt = "Exelero Yachting") => ({
  url,
  width: 1200,
  height: 630,
  alt,
});
