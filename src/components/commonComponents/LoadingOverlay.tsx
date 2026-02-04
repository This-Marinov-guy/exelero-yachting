"use client";

import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const READY_DELAY_MS = 900;
const EXIT_ANIMATION_MS = 500;

const LoadingOverlay = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    const pathChanged = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;

    if (pathChanged) {
      setVisible(true);
      setExiting(false);
    }

    readyTimerRef.current = setTimeout(() => {
      setExiting(true);
      hideTimerRef.current = setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, EXIT_ANIMATION_MS);
    }, READY_DELAY_MS);

    return () => {
      if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`loader-wrapper ${exiting ? "loader-exit" : ""}`}
      aria-hidden="true"
    >
      <div className="text-center exelero-loader-wrapper">
        <ExceleroLoader />
      </div>
    </div>
  );
};

export default LoadingOverlay;
