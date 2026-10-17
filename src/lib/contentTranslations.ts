import type { PublicLocale } from "./publicLocale";

export function translatedFields<T extends object>(source: T, locale: PublicLocale): T {
  if (locale === "en") return source;
  const translations = (source as { translations?: Record<string, unknown> }).translations;
  const patch = translations?.[locale];
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return source;
  return { ...source, ...(patch as Partial<T>) };
}
