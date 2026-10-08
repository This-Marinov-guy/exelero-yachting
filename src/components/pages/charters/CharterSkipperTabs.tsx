"use client";

import { useEffect, useRef, useState } from "react";

const AUTO_ADVANCE_MS = 7000;

const SKIPPER_TABS = [
  {
    id: "full-time",
    label: "Full-Time Skipper",
    description:
      "A professional skipper remains on board throughout your trip, providing safe handling, local knowledge, and an effortless, stress-free vacation.",
  },
  {
    id: "day-one",
    label: "Day-One Skipper",
    description:
      "A skipper joins you for the first day to familiarize you with the yacht’s systems, rig, and handling before handing over full command for your self-guided voyage.",
  },
  {
    id: "ghost",
    label: "Ghost Skipper",
    description:
      "A skipper stays on board in a discreet, supportive role—giving you hands-on control with expert guidance and skill refinement whenever you need it.",
  },
  {
    id: "bareboat",
    label: "Bareboat",
    description:
      "For experienced sailors with valid certifications who wish to take full command of the yacht, charting their own course and sailing at their own pace alongside family and friends.",
  },
];

const CharterSkipperTabs = () => {
  const [activeSkipperTab, setActiveSkipperTab] = useState<string>("full-time");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = SKIPPER_TABS.find((tab) => tab.id === activeSkipperTab) ?? SKIPPER_TABS[0];

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
        const nextIndex = (SKIPPER_TABS.findIndex((tab) => tab.id === current) + 1) % SKIPPER_TABS.length;
        return SKIPPER_TABS[nextIndex].id;
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [hasInteracted, isVisible, prefersReducedMotion]);

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
        {SKIPPER_TABS.map((tab) => (
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
