import { Metadata } from "next";
import GalleryPage from "@/components/pages/gallery/GalleryPage";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";

export const metadata: Metadata = {
  title: "Gallery | Exelero Yachting",
  description: "Exelero Yachting - Gallery - luxury yachts, brokerage, charters and marine services.",
  openGraph: {
    title: "Gallery | Exelero Yachting",
    description: "Exelero Yachting - Gallery - luxury yachts, brokerage, charters and marine services.",
    url: "/pages/gallery",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting Gallery")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Exelero Yachting",
    description: "Exelero Yachting - Gallery - luxury yachts, brokerage, charters and marine services.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
};

const Gallery = () => {
  return <GalleryPage />;
};

export default Gallery;
