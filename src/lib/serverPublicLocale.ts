import "server-only";
import { headers } from "next/headers";
import { isPublicLocale, LOCALE_HEADER, type PublicLocale } from "./publicLocale";

export async function getServerPublicLocale(): Promise<PublicLocale> {
  const locale = (await headers()).get(LOCALE_HEADER);
  return isPublicLocale(locale) ? locale : "en";
}
