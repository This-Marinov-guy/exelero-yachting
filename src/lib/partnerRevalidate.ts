import { revalidatePath } from "next/cache";
export function revalidatePartnerPages(...slugs: string[]) {
  revalidatePath("/", "page");
  revalidatePath("/new-yachts");
  revalidatePath("/(mainBody)", "layout");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) if (slug) revalidatePath(`/partners/${slug}`);
}
