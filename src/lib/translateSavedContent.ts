import "server-only";
import { autoTranslateObject } from "./autoTranslate";
import { getPartnerAdminClient } from "./partnerAdmin";
import { revalidatePartnerPages } from "./partnerRevalidate";
import { revalidatePath } from "next/cache";
import { validateServicePageContent, type ServicePageKey } from "./servicePageContent";

type Client = NonNullable<Awaited<ReturnType<typeof getPartnerAdminClient>>>;

export async function translateSavedPartner(client: Client, partner: { id: string; slug: string; updated_at: string; content: string; custom_fields: unknown }) {
  try {
    const translations = await autoTranslateObject(
      { content: partner.content, custom_fields: partner.custom_fields },
      ["content", "label", "options"],
    );
    if (!translations) return;
    const { error } = await client.from("partners").update({ translations }).eq("id", partner.id).eq("updated_at", partner.updated_at);
    if (error) throw error;
    revalidatePartnerPages(partner.slug);
  } catch (error) {
    console.error("Partner translation failed:", error instanceof Error ? error.message : error);
  }
}

export async function translateSavedServicePage(client: Client, page: ServicePageKey, content: object, updatedAt: string) {
  try {
    const translations = await autoTranslateObject(content, ["label", "text", "heading", "lead", "description", "paragraphs", "alt"]);
    if (!translations) return;
    const valid = Object.fromEntries(Object.entries(translations).filter(([, value]) => validateServicePageContent(page, value).content));
    if (Object.keys(valid).length !== 3) throw new Error("Generated service content did not pass validation.");
    const wrapped = Object.fromEntries(Object.entries(valid).map(([locale, value]) => [locale, { content: value }]));
    const { error } = await client.from("service_page_content").update({ translations: wrapped }).eq("page_key", page).eq("updated_at", updatedAt);
    if (error) throw error;
    revalidatePath(`/services/${page}`);
    revalidatePath("/sitemap.xml");
  } catch (error) {
    console.error("Service translation failed:", error instanceof Error ? error.message : error);
  }
}

export async function translateSavedBoat(client: Client, boatId: string, source: { title: string; description: string; location: string; additional_details: string | null; updated_at: string }) {
  try {
    const { updated_at, ...english } = source;
    const translations = await autoTranslateObject(english, ["title", "description", "location", "additional_details"]);
    if (!translations) return;
    const { error } = await client.from("boat_data").update({ translations }).eq("boat_id", boatId).eq("updated_at", updated_at);
    if (error) throw error;
    revalidatePath("/services/brokerage");
    revalidatePath("/sitemap.xml");
  } catch (error) {
    console.error("Boat translation failed:", error instanceof Error ? error.message : error);
  }
}
