import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { PUBLIC_LOCALES, type PublicLocale } from "@/lib/publicLocale";
import {
  DEFAULT_SERVICE_PAGE_CONTENT,
  type ServicePageContentMap,
  type ServicePageKey,
  validateServicePageContent,
} from "@/lib/servicePageContent";

export async function getPublicServicePageContent<K extends ServicePageKey>(
  page: K,
): Promise<ServicePageContentMap[K]> {
  try {
    const { data, error } = await getSupabaseServerClient()
      .from("service_page_content")
      .select("content, translations")
      .eq("page_key", page)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      const locale = await getServerPublicLocale();
      const translated = locale === "en" ? null : (data.translations as Record<string, { content?: unknown }> | null)?.[locale]?.content;
      const parsed = validateServicePageContent(page, translated ?? data.content);
      if (parsed.content) return parsed.content;
      if (translated) {
        const english = validateServicePageContent(page, data.content);
        if (english.content) return english.content;
      }
      throw new Error(`Invalid ${page} page content in the database.`);
    }
  } catch (error) {
    console.error(`Could not load ${page} page content:`, error);
  }

  return DEFAULT_SERVICE_PAGE_CONTENT[page];
}

export async function availableServiceLocales(page: ServicePageKey): Promise<PublicLocale[]> {
  const { data } = await getSupabaseServerClient().from("service_page_content")
    .select("translations").eq("page_key", page).maybeSingle();
  const translations = data?.translations as Record<string, { content?: unknown }> | null;
  return PUBLIC_LOCALES.filter((locale) => locale === "en" || Boolean(translations?.[locale]?.content && validateServicePageContent(page, translations[locale].content).content));
}
