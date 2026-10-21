import "server-only";
import { cache } from "react";
import { getSupabasePublicClient, logPublicDataError } from "@/lib/supabaseServer";
import type { Partner } from "@/types/Partner";

const PARTNER_COLUMNS = "id, slug, name, logo_url, breadcrumb_image_url, hero_image_url, content, translations, website_url, primary_color, secondary_color, form_type, custom_fields, status, show_on_home, show_on_new_yachts, sort_order, created_at, updated_at";

export const getPublishedPartners = cache(async (): Promise<Partner[]> => {
  try {
    const { data, error } = await getSupabasePublicClient()
      .from("partners")
      .select(PARTNER_COLUMNS)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Partner[];
  } catch (error) {
    logPublicDataError("Unable to load partners", error);
    return [];
  }
});

export const getPublishedPartnerBySlug = cache(async (slug: string): Promise<Partner | null> => {
  try {
    const { data, error } = await getSupabasePublicClient()
      .from("partners")
      .select(PARTNER_COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    return (data as Partner | null) ?? null;
  } catch (error) {
    logPublicDataError(`Unable to load partner ${slug}`, error);
    return null;
  }
});

export function absolutePartnerAssetUrl(siteUrl: string, url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/") ? `${siteUrl}${url}` : url;
}
