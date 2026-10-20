import { bg, enUS, ro, srLatn } from "date-fns/locale";
import type { PublicLocale } from "./publicLocale";

export const BOOKING_DATE_LOCALES = {
  en: { code: "en", dateFns: enUS },
  ro: { code: "ro", dateFns: ro },
  bg: { code: "bg", dateFns: bg },
  sr: { code: "sr-Latn", dateFns: srLatn },
} satisfies Record<PublicLocale, { code: string; dateFns: typeof enUS }>;
