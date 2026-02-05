import CharterPage from "@/components/pages/charters/CharterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yacht Charters",
  description:
    "Book luxury yacht charters with Exelero. Cruiser, power boat, racer and yacht charters — tailor-made experiences.",
  openGraph: {
    title: "Yacht Charters | Exelero Yachting",
    description: "Book luxury yacht charters — cruiser, power boat, racer and yacht experiences.",
    url: "/services/charters",
    type: "website",
  },
  alternates: { canonical: "/services/charters" },
  robots: { index: true, follow: true },
};

const Charters = () => {
  return <CharterPage />;
};

export default Charters;
