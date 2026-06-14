import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { ArrowRight } from "lucide-react";
import { RouteList } from "@/utils/RouteList";

const brands = [
  {
    id: "x-yachts",
    name: "X-Yachts",
    description: "Performance yachts built with Scandinavian precision.",
    image: "/assets/images/hero/x-yachts.jpg",
    logo: "/assets/images/logo/x-yachts-transparant.png",
    href: RouteList.Pages.Partners.XYachts,
  },
  {
    id: "omaya-yachts",
    name: "Omaya Yachts",
    description: "Luxury yachts crafted for exceptional sailing experiences.",
    image: "/assets/images/hero/omaya-yachts.jpg",
    logo: "/assets/images/logo/omaya-transparent.png",
    href: RouteList.Pages.Partners.OmayaYachts,
  },
  {
    id: "elvstrom",
    name: "Elvstrom",
    description: "Premium sails and sailing hardware built for performance.",
    image: "/assets/images/hero/elvstrom.jpg",
    logo: "/assets/images/logo/elvstrom.png",
    href: RouteList.Pages.Partners.Elvstrom,
  },
  {
    id: "zhik",
    name: "Zhik",
    description: "Technical apparel and gear trusted by sailors worldwide.",
    image: "/assets/images/hero/zhik.jpg",
    logo: "/assets/images/logo/zhik.svg",
    logoStyle: { filter: "brightness(0)" },
    href: RouteList.Pages.Partners.Zhik,
  },
];

const HomeBrandsSection = () => {
  return (
    <section className="exelero-brands-section">
      <div className="brands-header" data-aos="fade-up" data-aos-duration={500}>
        <Container>
          {/* <p className="brands-eyebrow">Our Partners</p> */}
          <h2 className="brands-title">World-Class Brands</h2>
        </Container>
      </div>

      <div className="brands-grid">
        {brands.map((brand, idx) => (
          <Link
            key={brand.id}
            href={brand.href}
            className="brand-block"
            data-aos="fade-up"
            data-aos-duration={500 + idx * 100}
          >
            <div className="brand-block-img">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="brand-block-photo"
                style={{ objectFit: "cover" }}
              />
              <div className="brand-block-overlay" />
            </div>

            <div className="brand-block-content">
              <div className="brand-block-logo-wrap">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={60}
                  height={60}
                  className="brand-block-logo"
                  style={{ ...brand.logoStyle, objectFit: "contain" }}
                />
              </div>
              <h3 className="brand-block-name">{brand.name}</h3>
              {/* <p className="brand-block-desc">{brand.description}</p> */}
              <span className="brand-block-cta">
                Explore <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeBrandsSection;
