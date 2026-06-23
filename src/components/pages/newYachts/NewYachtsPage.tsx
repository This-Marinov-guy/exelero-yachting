import TopFilter from "@/components/commonComponents/TopFilter";
import { Partners } from "@/data/partners";
import { RouteList } from "@/utils/RouteList";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const yachtBrands = [
  {
    ...Partners["x-yachts"],
    eyebrow: "Performance sailing yachts",
    logo: "/assets/images/logo/x-yachts-transparant.png",
    href: RouteList.Pages.Partners.XYachts,
  },
  {
    ...Partners["omaya-yachts"],
    eyebrow: "Luxury power catamarans",
    logo: "/assets/images/logo/omaya-transparent.png",
    href: RouteList.Pages.Partners.OmayaYachts,
  },
];

const NewYachtsPage = () => {
  return (
    <>
      <TopFilter
        title="New Yachts"
        description="Discover performance sailing yachts from X‑Yachts and refined multihull luxury from Omaya."
      />
      <main className="new-yachts-page">
        <section className="new-yachts-panels" aria-label="New yacht brands">
          {yachtBrands.map((brand, index) => (
            <Link
              key={brand.id}
              href={brand.href}
              className="new-yachts-panel"
              aria-label={`Explore ${brand.name}`}
            >
              <Image
                src={brand.heroImage}
                alt={`${brand.name} yacht`}
                fill
                priority={index === 0}
                sizes="(max-width: 991px) 100vw, 50vw"
                quality={82}
                className="new-yachts-panel__image"
              />
              <div className="new-yachts-panel__overlay" />

              <div className="new-yachts-panel__content">
                <div className="new-yachts-panel__logo-wrap">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={220}
                    height={90}
                    className="new-yachts-panel__logo"
                  />
                </div>
                <div className="new-yachts-panel__text">
                  <p>{brand.eyebrow}</p>
                  <h2>{brand.name}</h2>
                  <span>
                    Explore the range <ArrowUpRight aria-hidden size={22} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
};

export default NewYachtsPage;
