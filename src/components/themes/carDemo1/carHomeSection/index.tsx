"use client";
import React, { useEffect, useMemo, useRef } from "react";
import CarHomeFilter from "./filterSection";
import ExceleroHero from "./ExceleroHero";
import ServiceSection from "./ServiceSection";
import BoatListingCTA from "./BoatListingCTA";
import { RouteList } from "@/utils/RouteList";

const CarHomeSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSections = () =>
      Array.from(container.querySelectorAll<HTMLElement>(".exelero-hero-section"));

    const scrollToIndex = (nextIndex: number) => {
      const sections = getSections();
      if (nextIndex < 0 || nextIndex >= sections.length) return;

      const target = sections[nextIndex];
      const top = target.offsetTop;

      isAnimatingRef.current = true;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, prefersReducedMotion ? 150 : 650);
    };

    const getActiveIndex = () => {
      const sections = getSections();
      const y = window.scrollY;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      sections.forEach((s, idx) => {
        const top = s.offsetTop;
        const dist = Math.abs(top - y);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      return bestIdx;
    };

    const getNextIndex = () => {
      const sections = getSections();
      const y = window.scrollY;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop - 1 > y) return i;
      }
      return sections.length - 1;
    };

    const getPrevIndex = () => {
      const sections = getSections();
      const y = window.scrollY;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop + 1 < y) return i;
      }
      return 0;
    };

    const WHEEL_TRIGGER_THRESHOLD = 5; // almost any intentional scroll

    const onWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) return;

      // Only when the wheel target is within this hero stack
      const target = e.target as HTMLElement | null;
      if (!target || !container.contains(target)) return;

      if (Math.abs(e.deltaY) < WHEEL_TRIGGER_THRESHOLD) return;

      e.preventDefault();
      if (e.deltaY > 0) {
        // scrolling down → next section strictly below current scroll
        const nextIdx = getNextIndex();
        scrollToIndex(nextIdx);
      } else {
        // scrolling up → previous section strictly above current scroll
        const prevIdx = getPrevIndex();
        scrollToIndex(prevIdx);
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!container.contains(e.target as Node)) return;
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      if (!container.contains(e.target as Node)) return;
      const endY = (e.changedTouches[0]?.clientY ?? 0);
      const delta = touchStartY - endY;
      if (Math.abs(delta) < 40) return;
      if (delta > 0) {
        const nextIdx = getNextIndex();
        scrollToIndex(nextIdx);
      } else {
        const prevIdx = getPrevIndex();
        scrollToIndex(prevIdx);
      }
    };

    // non-passive so preventDefault works
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const updateHeaderTransparency = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // "in hero": the hero stack occupies the viewport (at least partially)
      const inHero = rect.top <= 0 && rect.bottom >= 80;
      document.body.classList.toggle("hero-header-transparent", inHero);
    };

    updateHeaderTransparency();
    window.addEventListener("scroll", updateHeaderTransparency, { passive: true });
    window.addEventListener("resize", updateHeaderTransparency, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("scroll", updateHeaderTransparency as any);
      window.removeEventListener("resize", updateHeaderTransparency as any);
      document.body.classList.remove("hero-header-transparent");
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <div className="exelero-hero-scroll" ref={containerRef}>
        <ExceleroHero
          title="Performance and luxury yachts"
          subtitle="From coastal cruising to offshore racing"
          backgroundVideo="/assets/video/hero/1.mp4"
          backgroundPoster="/assets/images/hero/x-yachts.jpg"
          overlayVariant="dark"
          separator
          panels={[
            {
              name: "X‑Yachts",
              description: "Performance yachts built with Scandinavian precision.",
              thumbImage: "/assets/images/hero/x-yachts.jpg",
              href: RouteList.Pages.Partners.XYachts,
              variant: "a",
            },
            {
              name: "Omaya Yachts",
              description: "Premium sails and sail solutions for cruising and racing.",
              thumbImage: "/assets/images/hero/omaya-yachts.jpg",
              href: RouteList.Pages.Partners.OmayaYachts,
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
          separator
          panels={[
            {
              name: "Brokerage & Charters",
              description: "Find your next boat or get your boat listed with Excelero.",
              thumbImage: "/assets/images/hero/boats.jpg",
              variant: "b",
              href: RouteList.Pages.Boats,
            },
          ]}
        />

        <ExceleroHero
          title="Sailing gear"
          description="Technical apparel and gear for all conditions — from coastal cruising to offshore racing."
          backgroundVideo="/assets/video/hero/3.mp4"
          backgroundPoster="/assets/images/hero/zhik.jpg"
          overlayVariant="dark"
          panels={[
            {
              name: "Elvstrom",
              description: "Sails and Premium sailwear designed for performance and comfort.",
              thumbImage: "/assets/images/hero/elvstrom.jpg",
              href: RouteList.Pages.Partners.ElvstromSailWear,
              variant: "a",
            },
            {
              name: "Zhik",
              description: "Technical gear trusted by sailors worldwide — engineered to perform.",
              thumbImage: "/assets/images/hero/zhik.jpg",
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