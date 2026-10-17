"use client";

import { usePublicLocale } from "@/app/i18n/i18n-context";
import { publicText } from "./publicText";

export function usePublicText() {
  const locale = usePublicLocale();
  return (english: string) => publicText(locale, english);
}

export function usePublicError() {
  const locale = usePublicLocale();
  return (message: string, fallback: string) => {
    const translated = publicText(locale, message);
    return locale !== "en" && translated === message ? publicText(locale, fallback) : translated;
  };
}
