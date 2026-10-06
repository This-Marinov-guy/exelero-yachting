import type { BoatUploadState, ImageMetadata, UploadedBrochure, UploadedImage } from "@/redux/reducers/BoatUploadSlice";

export const defaultBoatFormData: BoatUploadState["formData"] = {
  dealer_id: "",
  type: "",
  condition: "",
  keel_type: "Fin Keel",
  ce_design_category: "A - Ocean",
  material: "GRP",
  title: "",
  manufacturer: "",
  build_number: "",
  build_year: "",
  location: "",
  price: "",
  vat_included: false,
  description: "",
  hull_length: "",
  waterline_length: "",
  beam: "",
  draft: "",
  ballast: "",
  displacement: "",
  engine_power: "",
  fuel_tank: "",
  water_tank: "",
  additional_details: "",
};

const record = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;

const string = (value: unknown): string => value === null || value === undefined ? "" : String(value);

const firstString = (...values: unknown[]): string => {
  for (const value of values) if (typeof value === "string" && value.trim()) return value;
  return "";
};

const imageName = (url: string, index: number): string => {
  try { return decodeURIComponent(new URL(url).pathname.split("/").pop() || `Media ${index + 1}`); }
  catch { return `Media ${index + 1}`; }
};

const normalizeImages = (value: unknown): UploadedImage[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw, index): UploadedImage[] => {
    const item = record(raw);
    const url = typeof raw === "string" ? raw : firstString(item?.url, item?.link);
    if (!url) return [];
    const filePath = firstString(item?.filePath, item?.file_path);
    const mediaType = item?.mediaType === "video" || item?.media_type === "video" || /\.(mp4|webm|mov|m4v)(?:[?#]|$)/i.test(url) || /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url) ? "video" : "image";
    return [{ url, order: index, name: firstString(item?.name, item?.file_name) || imageName(url, index), filePath, mediaType, sourceType: item?.sourceType === "link" || item?.source_type === "link" || !filePath ? "link" : "upload" }];
  });
};

const normalizeBrochures = (value: unknown): UploadedBrochure[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw, index): UploadedBrochure[] => {
    const item = record(raw);
    const url = typeof raw === "string" ? raw : firstString(item?.url, item?.link);
    if (!url) return [];
    return [{ url, order: index, name: firstString(item?.name, item?.file_name) || imageName(url, index), filePath: firstString(item?.filePath, item?.file_path) }];
  });
};

export function normalizeBoatDraftSnapshot(raw: unknown): BoatUploadState {
  const source = record(raw) || {};
  const fields = record(source.formData) || source;
  const formData = { ...defaultBoatFormData };
  for (const field of Object.keys(defaultBoatFormData) as Array<keyof typeof formData>) {
    const value = fields[field];
    if (value === null || value === undefined) continue;
    if (field === "vat_included") formData.vat_included = value === true || value === "true" || value === 1;
    else (formData[field] as string) = string(value);
  }

  const uploadedImages = normalizeImages(Array.isArray(source.uploadedImages) && source.uploadedImages.length ? source.uploadedImages : source.images ?? source.uploadedImages);
  let uploadedBrochures = normalizeBrochures(Array.isArray(source.uploadedBrochures) && source.uploadedBrochures.length ? source.uploadedBrochures : source.brochures ?? source.uploadedBrochures);
  const legacyBrochureUrl = firstString(source.brochureUrl, source.brochure);
  const legacyBrochureName = firstString(source.brochureFileName, source.brochure_file_name);
  if (!uploadedBrochures.length && legacyBrochureUrl) uploadedBrochures = [{ url: legacyBrochureUrl, order: 0, name: legacyBrochureName || imageName(legacyBrochureUrl, 0), filePath: "" }];
  const storedMetadata = Array.isArray(source.imageMetadata) ? source.imageMetadata : [];
  const imageMetadata: ImageMetadata[] = uploadedImages.length
    ? uploadedImages.map((image, index) => ({ name: image.name, size: 0, type: image.mediaType === "video" ? "video" : "image", order: index }))
    : storedMetadata.flatMap((raw, index) => { const item = record(raw); return item ? [{ name: string(item.name), size: Number(item.size) || 0, type: string(item.type), order: index }] : []; });
  const rawMainIndex = Number(source.mainImageIndex ?? source.main_image_index ?? 0);
  const mainImageIndex = uploadedImages.length && Number.isInteger(rawMainIndex) && rawMainIndex >= 0 && rawMainIndex < uploadedImages.length ? rawMainIndex : 0;

  return {
    formData,
    imageMetadata,
    uploadedImages,
    uploadedBrochures,
    uploadFolderName: firstString(source.uploadFolderName, source.upload_folder_name) || null,
    mainImageIndex,
    brochureFileName: uploadedBrochures[0]?.name || legacyBrochureName || null,
    brochureUrl: uploadedBrochures[0]?.url || legacyBrochureUrl || null,
  };
}

export function hasBoatDraftContent(snapshot: BoatUploadState): boolean {
  return (Object.keys(defaultBoatFormData) as Array<keyof typeof snapshot.formData>).some(field => snapshot.formData[field] !== defaultBoatFormData[field])
    || snapshot.uploadedImages.length > 0
    || snapshot.uploadedBrochures.length > 0
    || snapshot.imageMetadata.length > 0
    || Boolean(snapshot.uploadFolderName || snapshot.brochureUrl);
}

export function mergeRecoveredImages(existing: UploadedImage[], recovered: UploadedImage[]): UploadedImage[] {
  const urlKey = (url: string) => url.split("?")[0];
  const recoveredByUrl = new Map(recovered.map(image => [urlKey(image.url), image]));
  let changed = false;
  const kept = existing.map(image => {
    const match = recoveredByUrl.get(urlKey(image.url));
    if (!image.filePath && match?.filePath) {
      changed = true;
      return { ...image, filePath: match.filePath, sourceType: "upload" as const };
    }
    return image;
  });
  const paths = new Set(kept.map(image => image.filePath).filter(Boolean));
  const urls = new Set(kept.map(image => urlKey(image.url)));
  const added = recovered.filter(image => image.filePath && !paths.has(image.filePath) && !urls.has(urlKey(image.url)));
  return changed || added.length ? [...kept, ...added].map((image, order) => ({ ...image, order })) : existing;
}
