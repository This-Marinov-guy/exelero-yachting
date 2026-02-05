import ContactContainer from "@/components/pages/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Exelero Yachting. Contact us for yacht brokerage, charters, transportation and marine services.",
  openGraph: {
    title: "Contact | Exelero Yachting",
    description: "Contact Exelero Yachting for yacht brokerage, charters and marine services.",
    url: "/contact",
    type: "website",
  },
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

const Contact1Page = () => {
  return <ContactContainer />;
};

export default Contact1Page;
