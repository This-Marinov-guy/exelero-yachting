import GalleryPage from "@/components/pages/gallery/GalleryPage";
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
  },
  alternates: { canonical: "/gallery" },
  robots: { index: true, follow: true },
};

const Gallery = () => {
  return <GalleryPage />;
};

export default Gallery;
