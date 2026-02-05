"use client";

import { useEffect, useRef, useState } from "react";

const PARALLAX_FACTOR = 0.4; // background moves at 40% of scroll speed

type HeroParallaxSectionProps = {
  heroClass: string;
  children: React.ReactNode;
};

export default function HeroParallaxSection({ heroClass, children }: HeroParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const sectionTop = rect.top;

      let offset = 0;
      if (sectionTop <= 0 && sectionTop > -sectionHeight) {
        offset = -sectionTop * PARALLAX_FACTOR;
      } else if (sectionTop <= -sectionHeight) {
        offset = sectionHeight * PARALLAX_FACTOR;
      }

      setParallaxOffset(offset);
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    return () => {
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return (
    <section ref={sectionRef} className={heroClass}>
      <div
        ref={bgRef}
        className={`${heroClass}__bg`}
        aria-hidden
        style={{ ["--hero-parallax-y" as string]: parallaxOffset ? `${parallaxOffset}px` : "0" }}
      />
      <div className={`${heroClass}__noise`} aria-hidden />
      {children}
    </section>
  );
}
