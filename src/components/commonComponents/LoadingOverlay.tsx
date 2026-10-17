"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";
import { LOCALE_SWITCH_COOKIE } from "@/lib/publicLocale";

const SHOW_DELAY_MS = 150;
const EXIT_ANIMATION_MS = 600;
const MAX_WAIT_MS = 10000;

// A full navigation starts a new JavaScript runtime; client-side route changes do not.
let initialPageLoadFinished = false;

const LoadingOverlay = ({ initialVisible = false }: { initialVisible?: boolean }) => {
  const [phase, setPhase] = useState<"hidden" | "visible" | "exiting">(initialVisible ? "visible" : "hidden");
  const { t } = useTranslation("common");

  useEffect(() => {
    if (initialPageLoadFinished && !initialVisible) return;

    if (document.readyState === "complete" && !initialVisible) {
      initialPageLoadFinished = true;
      return;
    }

    let visible = initialVisible;
    let finished = false;
    let exitTimer: number | undefined;

    const finish = () => {
      if (finished) return;

      finished = true;
      initialPageLoadFinished = true;
      if (initialVisible) document.cookie = `${LOCALE_SWITCH_COOKIE}=; Path=/; Max-Age=0`;
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
    }, initialVisible ? 0 : SHOW_DELAY_MS);
    const maxWaitTimer = window.setTimeout(finish, MAX_WAIT_MS);

    window.addEventListener("load", finish, { once: true });
    if (document.readyState === "complete") finish();

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(maxWaitTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", finish);
    };
  }, [initialVisible]);

  // Ordinary page loads start with visible page content; language changes
  // server-render this loader so the destination never flashes blank.
  if (phase === "hidden") return null;

  return (
    <div className={`loader-wrapper ${phase === "exiting" ? "loader-exit" : ""}`} role="status" aria-live="polite" aria-busy="true" aria-label={t("Loading...")}>
      <div className="text-center exelero-loader-wrapper">
        <ExceleroLoader />
      </div>
    </div>
  );
};

export default LoadingOverlay;
