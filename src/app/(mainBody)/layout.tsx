import { getPublishedPartners } from "@/lib/partners";
import MainBodyLayoutClient from "./MainBodyLayoutClient";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const partners = await getPublishedPartners();
  return <MainBodyLayoutClient partners={partners.map(({ slug, name }) => ({ slug, name }))}>{children}</MainBodyLayoutClient>;
}
