"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";
import { LOCALE_SWITCH_COOKIE } from "@/lib/publicLocale";

const EXIT_ANIMATION_MS = 600;
const MAX_WAIT_MS = 10000;

const LoadingOverlay = ({ initialVisible = false }: { initialVisible?: boolean }) => {
  const [phase, setPhase] = useState<"hidden" | "visible" | "exiting">(initialVisible ? "visible" : "hidden");
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!initialVisible) return;

    let finished = false;
    let exitTimer: number | undefined;

    const finish = () => {
      if (finished) return;

      finished = true;
      document.cookie = `${LOCALE_SWITCH_COOKIE}=; Path=/; Max-Age=0`;
      window.clearTimeout(maxWaitTimer);
      window.removeEventListener("load", finish);
      setPhase("exiting");
      exitTimer = window.setTimeout(() => setPhase("hidden"), EXIT_ANIMATION_MS);
    };

    const maxWaitTimer = window.setTimeout(finish, MAX_WAIT_MS);

    window.addEventListener("load", finish, { once: true });
    if (document.readyState === "complete") finish();

    return () => {
      window.clearTimeout(maxWaitTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", finish);
    };
  }, [initialVisible]);

  // Route loading is handled by Next.js. Only language changes server-render
  // this overlay so a hydrated page cannot reveal content and cover it again.
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
