import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import ro from "./i18n/locales/ro/common.json";
import bg from "./i18n/locales/bg/common.json";
import sr from "./i18n/locales/sr/common.json";

const labels = { en: "Loading...", ro: ro["Loading..."], bg: bg["Loading..."], sr: sr["Loading..."] };

export default async function Loading() {
  const locale = await getServerPublicLocale();
  return <div className="loader-wrapper" role="status" aria-busy="true" aria-label={labels[locale]}>
    <div className="text-center exelero-loader-wrapper"><ExceleroLoader /></div>
  </div>;
}
