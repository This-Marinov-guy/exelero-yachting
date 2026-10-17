"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { usePathname } from "next/navigation";
import { localeFromPath, type PublicLocale } from "@/lib/publicLocale";
import en from "./locales/en/common.json";
import ro from "./locales/ro/common.json";
import bg from "./locales/bg/common.json";
import sr from "./locales/sr/common.json";

const LocaleContext = createContext<PublicLocale>("en");
const resources = { en: { common: en }, ro: { common: ro }, bg: { common: bg }, sr: { common: sr } };

export function usePublicLocale() {
  return useContext(LocaleContext);
}

export function I18nProvider({ children, language }: { children: React.ReactNode; language: PublicLocale }) {
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [i18n] = useState(() => {
    const instance = createInstance();
    void instance.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: "en",
      ns: ["common"],
      defaultNS: "common",
      keySeparator: false,
      initImmediate: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    return instance;
  });

  useEffect(() => {
    const routeLanguage = localeFromPath(window.location.pathname) ?? "en";
    setCurrentLanguage(routeLanguage);
    if (i18n.language !== routeLanguage) void i18n.changeLanguage(routeLanguage);
  }, [i18n, pathname, language]);

  return <LocaleContext.Provider value={currentLanguage}><I18nextProvider i18n={i18n}>{children}</I18nextProvider></LocaleContext.Provider>;
}
