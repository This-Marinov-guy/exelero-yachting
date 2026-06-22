import BoatsPage from "@/components/pages/boats/BoatsPage";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yachts & Boats for Sale | Exelero Yachting",
  description: "Explore our exclusive collection of high-performance yachts and boats for sale. Find your perfect vessel from top manufacturers with expert dealer support.",
  openGraph: {
    title: "Yachts & Boats for Sale | Exelero Yachting",
    description: "Explore our exclusive collection of high-performance yachts and boats for sale. Find your perfect vessel from top manufacturers with expert dealer support.",
    url: "/boats",
    siteName: "Exelero Yachting",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting Boats")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yachts & Boats for Sale | Exelero Yachting",
    description: "Explore our exclusive collection of high-performance yachts and boats for sale.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  alternates: {
    canonical: "/boats",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Boats = async () => {
  return <BoatsPage />;
};

export default Boats;
