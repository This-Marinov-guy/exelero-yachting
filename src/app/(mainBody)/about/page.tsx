import AboutPage from "@/components/pages/about/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Exelero Yachting — our story, expertise in yacht brokerage, charters and marine services, and commitment to excellence.",
  openGraph: {
    title: "About Us | Exelero Yachting",
    description:
      "Learn about Exelero Yachting — our story, expertise in yacht brokerage, charters and marine services.",
    url: "/about",
    type: "website",
  },
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

const About = () => {
  return <AboutPage />;
};

export default About;

