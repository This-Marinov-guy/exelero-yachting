import React from "react";
import CarHomeFilter from "./filterSection";
import ExceleroHero from "./ExceleroHero";
import ServiceSection from "./ServiceSection";
import BoatListingCTA from "./BoatListingCTA";
import { RouteList } from "@/utils/RouteList";

const CarHomeSection = () => {
  return (
    <>
      <div className="exelero-hero-scroll">
        <ExceleroHero
          title="X‑Yachts & Elvstrom Sails"
          subtitle="Performance yachts & premium sails"
          backgroundVideo="/assets/video/hero/1.mp4"
          backgroundPoster="/assets/images/hero/x-yachts.jpg"
          overlayVariant="dark"
          separator
          panels={[
            {
              eyebrow: "Brand Partner",
              name: "X‑Yachts",
              description: "Performance sailing yachts built with Scandinavian precision.",
              thumbImage: "/assets/images/hero/x-yachts.jpg",
              logoImage: "/assets/images/logo/x-yachts.png",
              href: RouteList.Pages.Partners.XYachts,
              variant: "a",
            },
            {
              eyebrow: "Service",
              name: "Elvstrom Sails",
              description: "Premium sails and sail solutions for cruising and racing.",
              thumbImage: "/assets/images/hero/elvstrom.jpg",
              logoImage: "/assets/images/logo/elvstrom.jpg",
              href: RouteList.Pages.Services.Sails,
              variant: "b",
            },
          ]}
        />

        <ExceleroHero
          title="Brokerage & Charters"
          description="Browse listings, request brokerage support, or list your boat for charter — we handle it end‑to‑end."
          backgroundVideo="/assets/video/hero/2.mp4"
          backgroundPoster="/assets/images/hero/boats.jpg"
          overlayVariant="darker"
          single
          separator
          panels={[
            {
              kind: "composite",
              eyebrow: "Marketplace",
              name: "Brokerage & Charters",
              description: "Find your next boat or get your boat listed with Excelero.",
              thumbImage: "/assets/images/hero/boats.jpg",
              logos: [
                { src: "/assets/images/favicons/favicon.ico", alt: "Excelero" },
                { src: "/assets/images/logo/x-yachts.png", alt: "X‑Yachts" },
              ],
              actions: [
                { href: RouteList.Pages.Boats, label: "Brokerage" },
                { href: RouteList.Pages.Services.Charters, label: "Charters" },
              ],
              variant: "b",
            },
          ]}
        />

        <ExceleroHero
          title="Elvstrom SailWear & Zhik"
          description="Technical apparel and gear for all conditions — from coastal cruising to offshore racing."
          backgroundVideo="/assets/video/hero/3.mp4"
          backgroundPoster="/assets/images/hero/zhik.jpg"
          overlayVariant="dark"
          panels={[
            {
              eyebrow: "Partner",
              name: "Elvstrom SailWear",
              description: "Premium sailing apparel designed for performance and comfort.",
              thumbImage: "/assets/images/hero/elvstrom.jpg",
              logoImage: "/assets/images/logo/elvstrom-sailwear.webp",
              href: RouteList.Pages.Partners.ElvstromSailWear,
              variant: "a",
            },
            {
              eyebrow: "Partner",
              name: "Zhik",
              description: "Technical gear trusted by sailors worldwide — engineered to perform.",
              thumbImage: "/assets/images/hero/zhik.jpg",
              logoImage: "/assets/images/logo/zhik.svg",
              href: RouteList.Pages.Partners.Zhik,
              variant: "b",
            },
          ]}
        />
      </div>

      {/* <ServiceSection />
      <BoatListingCTA /> */}
      {/* <CarHomeFilter />     */}
    </>
  );
};

export default CarHomeSection;