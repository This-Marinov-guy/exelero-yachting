import { Metadata } from "next";
import Contact3Container from '@/components/pages/others/contact3'
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";

export const metadata: Metadata = {
  title: "Contact-3 | Exelero Yachting",
  description: "Exelero Yachting - Contact-3 - luxury yachts, brokerage, charters and marine services.",
  openGraph: {
    title: "Contact-3 | Exelero Yachting",
    description: "Exelero Yachting - Contact-3 - luxury yachts, brokerage, charters and marine services.",
    url: "/pages/other/contact-3",
    type: "website",
    images: [breadcrumbOpenGraphImage("Contact Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact-3 | Exelero Yachting",
    description: "Exelero Yachting - Contact-3 - luxury yachts, brokerage, charters and marine services.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
};

const Contact3Page = () => {
  return <Contact3Container/>
}

export default Contact3Page
