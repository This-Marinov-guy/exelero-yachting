export interface Partner {
  id: string;
  name: string;
  heroImage: string;
  logoImage: string;
  affiliateLink: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  website?: string;
}

export const Partners: Record<string, Partner> = {
  "x-yachts": {
    id: "x-yachts",
    name: "X-Yachts",
    heroImage: "/assets/images/hero/x-yachts.jpg",
    logoImage: "/assets/images/logo/x-yachts.png",
    affiliateLink: "https://www.x-yachts.com",
    primaryColor: "#1a1a1a",
    secondaryColor: "#ffffff",
    description: "X-Yachts is a Danish yacht manufacturer known for producing high-performance sailing yachts. With over 40 years of experience, X-Yachts combines Scandinavian design with cutting-edge technology to create exceptional sailing vessels.",
    website: "https://www.x-yachts.com",
  },
  "elvstrom": {
    id: "elvstrom",
    name: "Elvstrom",
    heroImage: "/assets/images/hero/elvstrom.jpg",
    logoImage: "/assets/images/logo/elvstrom.jpg",
    affiliateLink: "https://www.elvstrom.com",
    primaryColor: "#003366",
    secondaryColor: "#ffffff",
    description: "Elvstrom is a leading manufacturer of premium sailing equipment and hardware. With a legacy of innovation and quality, Elvstrom provides sailors worldwide with top-tier products for optimal performance on the water.",
    website: "https://www.elvstrom.com",
  },
  "omaya-yachts": {
    id: "omaya-yachts",
    name: "Omaya Yachts",
    heroImage: "/assets/images/hero/omaya-yachts.jpg",
    logoImage: "/assets/images/logo/omaya-yachts.jpg",
    affiliateLink: "https://www.omayayachts.com",
    primaryColor: "#0a4d68",
    secondaryColor: "#ffffff",
    description: "Omaya Yachts specializes in luxury yacht design and manufacturing, creating bespoke vessels that combine elegance with exceptional performance. Each yacht is crafted with meticulous attention to detail and the finest materials.",
    website: "https://www.omayayachts.com",
  },
};
