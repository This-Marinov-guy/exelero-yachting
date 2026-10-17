import { getPublishedPartners } from "@/lib/partners";
import { cookies } from "next/headers";
import { LOCALE_SWITCH_COOKIE } from "@/lib/publicLocale";
import MainBodyLayoutClient from "./MainBodyLayoutClient";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [partners, cookieStore] = await Promise.all([getPublishedPartners(), cookies()]);
  return <MainBodyLayoutClient initialLanguageLoading={cookieStore.get(LOCALE_SWITCH_COOKIE)?.value === "1"} partners={partners.map(({ slug, name }) => ({ slug, name }))}>{children}</MainBodyLayoutClient>;
}
