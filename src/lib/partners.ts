import "server-only";
import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { Partner } from "@/types/Partner";

const PARTNER_COLUMNS = "id, slug, name, logo_url, breadcrumb_image_url, hero_image_url, content, website_url, primary_color, secondary_color, form_type, custom_fields, status, show_on_home, show_on_new_yachts, sort_order, created_at, updated_at";

export const getPublishedPartners = cache(async (): Promise<Partner[]> => {
  const { data, error } = await getSupabaseServerClient()
    .from("partners")
    .select(PARTNER_COLUMNS)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(`Unable to load partners: ${error.message}`);
  return (data ?? []) as Partner[];
});

export const getPublishedPartnerBySlug = cache(async (slug: string): Promise<Partner | null> => {
  const { data, error } = await getSupabaseServerClient()
    .from("partners")
    .select(PARTNER_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Unable to load partner: ${error.message}`);
  return (data as Partner | null) ?? null;
});

export function absolutePartnerAssetUrl(siteUrl: string, url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/") ? `${siteUrl}${url}` : url;
}
