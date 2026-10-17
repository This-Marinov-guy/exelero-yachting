import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { cache } from "react";
import "server-only";
import { getOptions } from "./settings";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";

const initServerI18next = async (language: string, ns: string) => {
  const instance = createInstance();
  await instance
    .use(initReactI18next)
    .use(resourcesToBackend((locale: string, namespace: string) => import(`./locales/${locale}/${namespace}.json`)))
    .init(getOptions(language, ns));
  return instance;
};

export const getServerTranslations = cache(async (ns: string, options: { keyPrefix?: string } = {}) => {
  const language = await getServerPublicLocale();
  const i18n = await initServerI18next(language, ns);
  return { t: i18n.getFixedT(language, ns, options.keyPrefix), i18n };
});
