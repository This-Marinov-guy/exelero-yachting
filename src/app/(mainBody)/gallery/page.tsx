import GalleryPage from "@/components/pages/gallery/GalleryPage";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our gallery of luxury yachts, boats and marine imagery. Exelero Yachting — performance and elegance.",
  openGraph: {
    title: "Gallery | Exelero Yachting",
    description: "Browse our gallery of luxury yachts and marine imagery.",
    url: "/gallery",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting Gallery")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Exelero Yachting",
    description: "Browse our gallery of luxury yachts and marine imagery.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  alternates: { canonical: "/gallery" },
  robots: { index: true, follow: true },
};

const Gallery = () => {
  return <GalleryPage />;
};

export default Gallery;
