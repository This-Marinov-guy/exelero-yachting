"use client";

import { useEffect, useState } from "react";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";

const SHOW_DELAY_MS = 150;
const EXIT_ANIMATION_MS = 600;
const MAX_WAIT_MS = 10000;

// A full navigation starts a new JavaScript runtime; client-side route changes do not.
let initialPageLoadFinished = false;

const LoadingOverlay = () => {
  const [phase, setPhase] = useState<"hidden" | "visible" | "exiting">("hidden");

  useEffect(() => {
    if (initialPageLoadFinished) return;

    if (document.readyState === "complete") {
      initialPageLoadFinished = true;
      return;
    }

    let visible = false;
    let finished = false;
    let exitTimer: number | undefined;

    const finish = () => {
      if (finished) return;

      finished = true;
      initialPageLoadFinished = true;
      window.clearTimeout(showTimer);
      window.clearTimeout(maxWaitTimer);
      window.removeEventListener("load", finish);

      if (visible) {
        setPhase("exiting");
        exitTimer = window.setTimeout(() => setPhase("hidden"), EXIT_ANIMATION_MS);
      }
    };

    const showTimer = window.setTimeout(() => {
      if (document.readyState === "complete") {
        finish();
        return;
      }

      visible = true;
      setPhase("visible");
    }, SHOW_DELAY_MS);
    const maxWaitTimer = window.setTimeout(finish, MAX_WAIT_MS);

    window.addEventListener("load", finish, { once: true });

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(maxWaitTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", finish);
    };
  }, []);

  // The server render and first hydration both return null, leaving page content
  // in the HTML for crawlers and available to visitors without JavaScript.
  if (phase === "hidden") return null;

  return (
    <div className={`loader-wrapper ${phase === "exiting" ? "loader-exit" : ""}`} aria-hidden="true">
      <div className="text-center exelero-loader-wrapper">
        <ExceleroLoader />
      </div>
    </div>
  );
};

export default LoadingOverlay;
