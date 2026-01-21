
"use client";
import React, { useRef } from "react";
import { ScrollController } from "./ScrollController";

interface HeroScrollWrapperProps {
  children: React.ReactNode;
}

export const HeroScrollWrapper = ({ children }: HeroScrollWrapperProps) => {
  // Use non-null generic so it matches ScrollController's expected ref type.
  // It's still null until the div mounts (normal React behavior).
  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    <>
      <ScrollController containerRef={containerRef} />
      <div className="exelero-hero-scroll" ref={containerRef}>
        {children}
      </div>
    </>
  );
};