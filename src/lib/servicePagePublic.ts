import { getSupabaseServerClient } from "@/lib/supabaseServer";
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
      .select("content")
      .eq("page_key", page)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      const parsed = validateServicePageContent(page, data.content);
      if (parsed.content) return parsed.content;
      throw new Error(`Invalid ${page} page content in the database.`);
    }
  } catch (error) {
    console.error(`Could not load ${page} page content:`, error);
  }

  return DEFAULT_SERVICE_PAGE_CONTENT[page];
}
