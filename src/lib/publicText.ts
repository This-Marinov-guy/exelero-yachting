import ro from "@/app/i18n/locales/ro/common.json";
import bg from "@/app/i18n/locales/bg/common.json";
import sr from "@/app/i18n/locales/sr/common.json";
import type { PublicLocale } from "./publicLocale";

const dictionaries: Record<Exclude<PublicLocale, "en">, Record<string, string>> = { ro, bg, sr };

export function publicText(locale: PublicLocale, english: string): string {
  return locale === "en" ? english : dictionaries[locale][english] || english;
}
