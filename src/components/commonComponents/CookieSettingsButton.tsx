"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/clarity";
import { useTranslation } from "react-i18next";

export default function CookieSettingsButton() {
  const { t } = useTranslation("common");
  return (
    <button
      type="button"
      className="cookie-settings-button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
    >
      {t("Cookie settings")}
    </button>
  );
}
