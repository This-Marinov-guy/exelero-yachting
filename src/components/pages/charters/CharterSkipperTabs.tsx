"use client";

import { useEffect, useRef, useState } from "react";
import type { SkipperOption } from "@/lib/servicePageContent";

const AUTO_ADVANCE_MS = 7000;

const CharterSkipperTabs = ({ tabs }: { tabs: SkipperOption[] }) => {
  const [activeSkipperTab, setActiveSkipperTab] = useState<string>(tabs[0].id);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = tabs.find((tab) => tab.id === activeSkipperTab) ?? tabs[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasInteracted || !isVisible || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveSkipperTab((current) => {
        const nextIndex = (tabs.findIndex((tab) => tab.id === current) + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [hasInteracted, isVisible, prefersReducedMotion, tabs]);

  return (
    <div ref={containerRef} className="charter-skipper-tabs">
      <h3 className="charter-skipper-tabs__title">Skipper options</h3>
      <div
        className="charter-skipper-tabs__nav"
        role="group"
        aria-label="Skipper options"
        onFocusCapture={() => setHasInteracted(true)}
        onPointerEnter={() => setHasInteracted(true)}
        onPointerDownCapture={() => setHasInteracted(true)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`charter-skipper-tabs__nav-item ${
              activeSkipperTab === tab.id ? "charter-skipper-tabs__nav-item--active" : ""
            }`}
            aria-pressed={activeSkipperTab === tab.id}
            onClick={() => {
              setActiveSkipperTab(tab.id);
              setHasInteracted(true);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p key={active.id} className="charter-skipper-tabs__content">{active.description}</p>
    </div>
  );
};

export default CharterSkipperTabs;
