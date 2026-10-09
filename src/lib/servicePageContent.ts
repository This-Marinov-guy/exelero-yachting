import defaults from "@/content/servicePageContent.json";

export const SERVICE_PAGE_KEYS = ["charters", "transportation"] as const;
export type ServicePageKey = (typeof SERVICE_PAGE_KEYS)[number];

export type LabeledText = { label: string; text: string };
export type CharterInfoTab = { id: string; label: string; paragraphs: string[]; items: LabeledText[] };
export type SkipperOption = { id: string; label: string; description: string };
export type ServiceImage = { src: string; alt: string };
export type CharterGalleryItem =
  | { id: string; type: "image"; src: string; alt: string; label: string; fit: "cover" | "contain" }
  | { id: string; type: "video"; src: string; poster: string; alt: string; label: string };
export type CharterPageContent = {
  infoTabs: CharterInfoTab[];
  skipperOptions: SkipperOption[];
  media: { banner: ServiceImage | null; gallery: CharterGalleryItem[] };
};
export type TransportationParagraph = { lead: string; text: string };
export type TransportationSection = { id: string; heading: string; paragraphs: TransportationParagraph[] };
export type TransportationPageContent = { sections: TransportationSection[]; media: { gallery: CharterGalleryItem[] } };
export type ServicePageContentMap = {
  charters: CharterPageContent;
  transportation: TransportationPageContent;
};

export const DEFAULT_SERVICE_PAGE_CONTENT = defaults as ServicePageContentMap;

const CHARTER_TAB_IDS = ["why", "who", "when-where", "models"];
const SKIPPER_IDS = ["full-time", "day-one", "ghost", "bareboat"];
const TRANSPORT_SECTION_IDS = ["road", "sea"];
const MAX_GALLERY_ITEMS = 12;

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const text = (value: unknown, maxLength: number, allowEmpty = false): string | null => {
  if (typeof value !== "string" || value.length > maxLength) return null;
  const trimmed = value.trim();
  return trimmed || allowEmpty ? trimmed : null;
};

const invalid = (message: string) => ({ error: message });

const assetUrl = (value: unknown, kind: "image" | "video"): string | null => {
  if (typeof value !== "string" || value.length > 2048) return null;
  const extension = kind === "image" ? "(?:jpe?g|png|webp)" : "mp4";
  if (new RegExp(`^/assets/images/[a-zA-Z0-9/_-]+\\.${extension}$`).test(value)) return value;

  const origin = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!origin) return null;
  try {
    const url = new URL(value);
    const storage = new URL(origin);
    if (url.origin !== storage.origin || url.search || url.hash) return null;
    if (new RegExp(`^/storage/v1/object/public/service-page-media/(?:charters|transportation)/[a-zA-Z0-9/_-]+\\.${extension}$`).test(url.pathname)) return url.href;
  } catch { /* Invalid URLs are rejected below. */ }
  return null;
};

const serviceImage = (value: unknown, label: string): { image: ServiceImage; error?: never } | { image?: never; error: string } => {
  if (!record(value)) return { error: `${label} is missing. Reload the editor and try again.` };
  const src = assetUrl(value.src, "image");
  const alt = text(value.alt, 180);
  if (!src || !alt) return { error: `${label} needs an uploaded image and a description (up to 180 characters).` };
  return { image: { src, alt } };
};

function serviceGallery(value: unknown, page: ServicePageKey): { gallery: CharterGalleryItem[]; error?: never } | { gallery?: never; error: string } {
  if (!Array.isArray(value) || value.length > MAX_GALLERY_ITEMS) return { error: "Use no more than 12 photos or videos on this page." };
  const gallery: CharterGalleryItem[] = [];
  const ids = new Set<string>();
  for (const [index, raw] of value.entries()) {
    const label = `Media item ${index + 1}`;
    if (!record(raw) || (raw.type !== "image" && raw.type !== "video")) return { error: `${label} needs a photo or video type.` };
    const id = raw.id === undefined ? `${page}-legacy-${index}` : raw.id;
    if (typeof id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(id) || id.endsWith("-poster") || ids.has(id)) return { error: `${label} has an invalid ID. Reload the editor and try again.` };
    ids.add(id);
    const src = assetUrl(raw.src, raw.type);
    const alt = text(raw.alt, 180);
    const itemLabel = text(raw.label, 120);
    if (!src || !alt || !itemLabel) return { error: `${label} needs a file, a description and a gallery label.` };
    if (raw.type === "video") {
      const poster = assetUrl(raw.poster, "image");
      if (!poster) return { error: `${label} needs a poster image for the video.` };
      gallery.push({ id, type: "video", src, poster, alt, label: itemLabel });
    } else {
      if (raw.fit !== "cover" && raw.fit !== "contain") return { error: `${label} has an invalid image fit.` };
      gallery.push({ id, type: "image", src, alt, label: itemLabel, fit: raw.fit });
    }
  }
  return { gallery };
}

export function isServicePageKey(value: string): value is ServicePageKey {
  return SERVICE_PAGE_KEYS.includes(value as ServicePageKey);
}

export function validateServicePageContent<K extends ServicePageKey>(
  page: K,
  value: unknown,
): { content: ServicePageContentMap[K]; error?: never } | { content?: never; error: string } {
  if (!record(value) || JSON.stringify(value).length > 100_000) return invalid("This page contains too much content. Shorten the text and try again.");

  if (page === "charters") {
    if (!Array.isArray(value.infoTabs) || value.infoTabs.length !== CHARTER_TAB_IDS.length ||
        !Array.isArray(value.skipperOptions) || value.skipperOptions.length !== SKIPPER_IDS.length) return invalid("The charter sections have changed unexpectedly. Reload the editor and try again.");

    const infoTabs: CharterInfoTab[] = [];
    for (const [index, raw] of value.infoTabs.entries()) {
      if (!record(raw) || raw.id !== CHARTER_TAB_IDS[index] ||
          !Array.isArray(raw.paragraphs) || raw.paragraphs.length > 10 ||
          !Array.isArray(raw.items) || raw.items.length > 20 ||
          raw.paragraphs.length + raw.items.length === 0) return invalid(`Add content to the ${CHARTER_TAB_IDS[index]} section before saving.`);
      const label = text(raw.label, 120);
      if (!label) return invalid(`Enter a heading for the ${CHARTER_TAB_IDS[index]} section (up to 120 characters).`);
      const paragraphs: string[] = [];
      for (const [paragraphIndex, paragraph] of raw.paragraphs.entries()) {
        const value = text(paragraph, 3000);
        if (!value) return invalid(`${label}: paragraph ${paragraphIndex + 1} needs text (up to 3,000 characters).`);
        paragraphs.push(value);
      }
      const items: LabeledText[] = [];
      for (const [itemIndex, item] of raw.items.entries()) {
        if (!record(item)) return invalid(`${label}: item ${itemIndex + 1} is incomplete.`);
        const itemLabel = text(item.label, 120);
        const itemText = text(item.text, 2000);
        if (!itemLabel || !itemText) return invalid(`${label}: item ${itemIndex + 1} needs a label and description.`);
        items.push({ label: itemLabel, text: itemText });
      }
      infoTabs.push({ id: CHARTER_TAB_IDS[index], label, paragraphs, items });
    }

    const skipperOptions: SkipperOption[] = [];
    for (const [index, raw] of value.skipperOptions.entries()) {
      if (!record(raw) || raw.id !== SKIPPER_IDS[index]) return invalid("The skipper options have changed unexpectedly. Reload the editor and try again.");
      const label = text(raw.label, 120);
      const description = text(raw.description, 2000);
      if (!label || !description) return invalid(`Skipper option ${index + 1} needs a label and description.`);
      skipperOptions.push({ id: SKIPPER_IDS[index], label, description });
    }
    const media = value.media === undefined ? DEFAULT_SERVICE_PAGE_CONTENT.charters.media : value.media;
    if (!record(media)) return invalid("The charter media is missing. Reload the editor and try again.");
    const banner = media.banner === null ? null : serviceImage(media.banner, "The charter banner");
    if (banner && !banner.image) return invalid(banner.error);
    const gallery = serviceGallery(media.gallery, page);
    if (!gallery.gallery) return invalid(gallery.error);
    return { content: { infoTabs, skipperOptions, media: { banner: banner?.image ?? null, gallery: gallery.gallery } } as ServicePageContentMap[K] };
  }

  if (!Array.isArray(value.sections) || value.sections.length !== TRANSPORT_SECTION_IDS.length) return invalid("The transportation sections have changed unexpectedly. Reload the editor and try again.");
  const sections: TransportationSection[] = [];
  for (const [index, raw] of value.sections.entries()) {
    if (!record(raw) || raw.id !== TRANSPORT_SECTION_IDS[index] ||
        !Array.isArray(raw.paragraphs) || raw.paragraphs.length < 1 || raw.paragraphs.length > 12) return invalid(`Add 1–12 paragraphs to the ${TRANSPORT_SECTION_IDS[index]} section.`);
    const heading = text(raw.heading, 120);
    if (!heading) return invalid(`Enter a heading for the ${TRANSPORT_SECTION_IDS[index]} section (up to 120 characters).`);
    const paragraphs: TransportationParagraph[] = [];
    for (const [paragraphIndex, paragraph] of raw.paragraphs.entries()) {
      if (!record(paragraph)) return invalid(`${heading}: paragraph ${paragraphIndex + 1} is incomplete.`);
      const lead = text(paragraph.lead, 120, true);
      const paragraphText = text(paragraph.text, 3000);
      if (lead === null || !paragraphText) return invalid(`${heading}: paragraph ${paragraphIndex + 1} needs text; the bold lead-in is optional.`);
      paragraphs.push({ lead, text: paragraphText });
    }
    sections.push({ id: TRANSPORT_SECTION_IDS[index], heading, paragraphs });
  }
  const media = value.media === undefined ? DEFAULT_SERVICE_PAGE_CONTENT.transportation.media : value.media;
  if (!record(media)) return invalid("The transportation media is missing. Reload the editor and try again.");
  const legacyPhoto = media.photo === undefined ? null : serviceImage(media.photo, "The transportation photo");
  if (legacyPhoto && !legacyPhoto.image) return invalid(legacyPhoto.error);
  const galleryInput = media.gallery ?? (legacyPhoto?.image ? [{ id: "transportation-legacy-0", type: "image", ...legacyPhoto.image, label: "Yacht transportation", fit: "cover" }] : undefined);
  const gallery = serviceGallery(galleryInput, page);
  if (!gallery.gallery) return invalid(gallery.error);
  return { content: { sections, media: { gallery: gallery.gallery } } as ServicePageContentMap[K] };
}
