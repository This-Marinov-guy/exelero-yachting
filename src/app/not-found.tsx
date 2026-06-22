import Error404Container from "@/components/pages/others/error404";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  openGraph: {
    title: "Page Not Found | Exelero Yachting",
    description: "The page you are looking for could not be found.",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Not Found | Exelero Yachting",
    description: "The page you are looking for could not be found.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <Error404Container />;
}
