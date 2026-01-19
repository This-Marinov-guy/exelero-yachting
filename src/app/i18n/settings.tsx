export const fallbackLng = "en";
export const languages = [fallbackLng, "ge", "fr", "ko", "sp"];
export const defaultNS = "translation";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLangs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
