import { Metadata } from "next";
import About1Container from "@/components/pages/others/about1";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";

export const metadata: Metadata = {
  title: "About-1 | Exelero Yachting",
  description: "Exelero Yachting - About-1 - luxury yachts, brokerage, charters and marine services.",
  openGraph: {
    title: "About-1 | Exelero Yachting",
    description: "Exelero Yachting - About-1 - luxury yachts, brokerage, charters and marine services.",
    url: "/pages/other/about-1",
    type: "website",
    images: [breadcrumbOpenGraphImage("About Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "About-1 | Exelero Yachting",
    description: "Exelero Yachting - About-1 - luxury yachts, brokerage, charters and marine services.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
};

const About1Page = () => {
  return <About1Container />;
};

export default About1Page;
