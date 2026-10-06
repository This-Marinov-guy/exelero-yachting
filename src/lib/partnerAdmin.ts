import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { PartnerFormField, PartnerInput } from "@/types/Partner";

export async function getPartnerAdminClient() {
  const cookieStore = await cookies();
  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => {
      try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Components cannot set cookies. */ }
    } },
  });
  const { data, error } = await client.auth.getClaims();
  return error || !data?.claims?.sub ? null : client;
}

export function validatePartnerInput(value: unknown): { data?: PartnerInput; error?: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { error: "Partner details are required." };
  const input = value as Record<string, unknown>;
  const text = (key: string) => typeof input[key] === "string" ? (input[key] as string).trim() : "";
  const slug = text("slug");
  const name = text("name");
  const status = input.status;
  const formType = input.form_type;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return { error: "Use a lowercase slug with letters, numbers and hyphens." };
  if (!name || name.length > 120) return { error: "Name is required and must be at most 120 characters." };
  if (status !== "draft" && status !== "published") return { error: "Choose draft or published." };
  if (formType !== "standard" && formType !== "custom") return { error: "Choose a standard or custom form." };
  const validAsset = (url: string) => !url || url.startsWith("/assets/images/") || url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/partner-assets/`);
  const logo = text("logo_url"), breadcrumb = text("breadcrumb_image_url"), hero = text("hero_image_url"), content = text("content"), website = text("website_url");
  if (![logo, breadcrumb, hero].every(validAsset)) return { error: "Upload images to partner assets or choose a site image." };
  if (status === "published" && (!logo || !breadcrumb || !content)) return { error: "Name, logo, breadcrumb image and content are required to publish." };
  if (content.length > 20000) return { error: "Content must be at most 20,000 characters." };
  if (website) { try { if (new URL(website).protocol !== "https:") throw new Error(); } catch { return { error: "Website must be an HTTPS URL." }; } }
  const colors = [text("primary_color") || "#1a1a1a", text("secondary_color") || "#ffffff"];
  if (colors.some((color) => !/^#[0-9a-fA-F]{6}$/.test(color))) return { error: "Use six-digit hexadecimal colors." };
  if (!Array.isArray(input.custom_fields) || input.custom_fields.length > 8) return { error: "Add at most eight custom fields." };
  const fields: PartnerFormField[] = [];
  const ids = new Set<string>();
  const requireCompleteFields = status === "published" && formType === "custom";
  for (const value of input.custom_fields) {
    if (!value || typeof value !== "object") return { error: "Each custom field needs a label and type." };
    const field = value as Record<string, unknown>;
    const id = typeof field.id === "string" ? field.id.trim() : "";
    const label = typeof field.label === "string" ? field.label.trim() : "";
    const type = field.type;
    if (!/^[a-z0-9_-]{1,40}$/.test(id) || ["name", "email", "phone", "message", "request_id", "website_check", "__proto__", "constructor", "prototype"].includes(id) || ids.has(id) || (requireCompleteFields && !label) || label.length > 80 || !["text", "tel", "textarea", "select"].includes(String(type))) return { error: "Check the custom field labels, types and unique IDs." };
    const options = Array.isArray(field.options) ? field.options.map((option) => String(option).trim()) : [];
    if (type === "select" && (options.length > 20 || options.some((option) => option.length > 100) || (requireCompleteFields && (!options.length || options.some((option) => !option) || new Set(options).size !== options.length)))) return { error: `Add 1–20 unique options for ${label || "this dropdown"}.` };
    ids.add(id);
    fields.push({ id, label, type: type as PartnerFormField["type"], required: field.required === true, ...(type === "select" ? { options } : {}) });
  }
  const order = Number(input.sort_order);
  if (!Number.isInteger(order) || order < -10000 || order > 10000) return { error: "Sort order must be a whole number between -10000 and 10000." };
  return { data: {
    slug, name, logo_url: logo, breadcrumb_image_url: breadcrumb, hero_image_url: hero || null, content,
    website_url: website || null, primary_color: colors[0], secondary_color: colors[1], form_type: formType,
    custom_fields: fields, status, show_on_home: input.show_on_home === true,
    show_on_new_yachts: input.show_on_new_yachts === true, sort_order: order,
  } };
}
