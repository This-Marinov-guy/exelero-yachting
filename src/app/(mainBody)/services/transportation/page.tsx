import TransportationPage from "@/components/pages/transportation/TransportationPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yacht Transportation",
  description:
    "Professional yacht and boat transportation services. Exelero handles delivery by land and sea — safe, insured and on schedule.",
  openGraph: {
    title: "Yacht Transportation | Exelero Yachting",
    description: "Professional yacht and boat transportation — land and sea delivery, safe and insured.",
    url: "/services/transportation",
    type: "website",
  },
  alternates: { canonical: "/services/transportation" },
  robots: { index: true, follow: true },
};

const Transportation = () => {
  return <TransportationPage />;
};

export default Transportation;
