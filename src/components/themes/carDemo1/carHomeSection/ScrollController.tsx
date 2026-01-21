"use client";
import { useEffect, useMemo, useRef } from "react";

interface ScrollControllerProps {
  currentIndex: number;
  totalSections: number;
  onSectionChange: (index: number) => void;
}

export const ScrollController = ({
  currentIndex,
  totalSections,
  onSectionChange,
}: ScrollControllerProps) => {
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const handleSectionChange = (newIndex: number) => {
      isAnimatingRef.current = true;
      onSectionChange(newIndex);
      
      setTimeout(() => {
        isAnimatingRef.current = false;
        accumulatedDeltaRef.current = 0;
      }, prefersReducedMotion ? 100 : 700);
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow normal scrolling if at last section
      if (currentIndex === totalSections - 1 && e.deltaY > 0) {
        return;
      }

      // If animating, prevent all scrolling
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const now = Date.now();

      // Reset accumulated delta if too much time has passed
      if (now - lastScrollTimeRef.current > 150) {
        accumulatedDeltaRef.current = 0;
      }
      lastScrollTimeRef.current = now;

      // Accumulate delta
      accumulatedDeltaRef.current += e.deltaY;

      // Threshold for triggering section change
      const DELTA_THRESHOLD = 250;

      // Scrolling down
      if (accumulatedDeltaRef.current > DELTA_THRESHOLD) {
        // If at last section, allow normal scroll
        if (currentIndex === totalSections - 1) {
          return;
        }

        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, totalSections - 1);
        handleSectionChange(nextIndex);
      }
      // Scrolling up
      else if (accumulatedDeltaRef.current < -DELTA_THRESHOLD) {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        handleSectionChange(prevIndex);
      }
      // Within threshold - prevent default to stop native scroll
      else if (Math.abs(e.deltaY) > 0 && currentIndex < totalSections - 1) {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;

      const endY = e.changedTouches[0]?.clientY ?? 0;
      const delta = touchStartY - endY;
      const SWIPE_THRESHOLD = 100;

      if (Math.abs(delta) < SWIPE_THRESHOLD) return;

      // Swipe up (scroll down)
      if (delta > 0) {
        if (currentIndex === totalSections - 1) return;
        const nextIndex = Math.min(currentIndex + 1, totalSections - 1);
        handleSectionChange(nextIndex);
      }
      // Swipe down (scroll up)
      else {
        const prevIndex = Math.max(currentIndex - 1, 0);
        handleSectionChange(prevIndex);
      }
    };

    // Event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel as any);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, totalSections, onSectionChange, prefersReducedMotion]);

  return null;
};