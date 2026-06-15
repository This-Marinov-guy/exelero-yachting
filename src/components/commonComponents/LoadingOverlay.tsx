"use client";

import { useEffect, useState } from "react";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";

const EXIT_ANIMATION_MS = 600;

const LoadingOverlay = () => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const startExit = () => {
      setExiting(true);
      setTimeout(() => setVisible(false), EXIT_ANIMATION_MS);
    };

    if (typeof window === "undefined") return;

    const id = window.setTimeout(startExit, 120);
    return () => window.clearTimeout(id);
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
