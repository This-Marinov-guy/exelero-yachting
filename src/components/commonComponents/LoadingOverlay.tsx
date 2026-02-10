"use client";

import { useEffect, useState } from "react";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";

const EXIT_ANIMATION_MS = 600;

const LoadingOverlay = () => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // When the app is ready (window load) start the slide-down exit animation,
    // then unmount the overlay to reveal the page.
    const startExit = () => {
      setExiting(true);
      setTimeout(() => setVisible(false), EXIT_ANIMATION_MS);
    };

    if (typeof window === "undefined") return;

    if (document.readyState === "complete") {
      // If the page is already loaded, exit immediately.
      startExit();
    } else {
      window.addEventListener("load", startExit);
      return () => window.removeEventListener("load", startExit);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className={`loader-wrapper ${exiting ? "loader-exit" : ""}`} aria-hidden="true">
      <div className="text-center exelero-loader-wrapper">
        <ExceleroLoader />
      </div>
    </div>
  );
};

export default LoadingOverlay;
