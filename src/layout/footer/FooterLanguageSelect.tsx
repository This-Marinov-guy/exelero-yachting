"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import GB from "country-flag-icons/react/3x2/GB";
import RO from "country-flag-icons/react/3x2/RO";
import BG from "country-flag-icons/react/3x2/BG";
import RS from "country-flag-icons/react/3x2/RS";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePublicLocale } from "@/app/i18n/i18n-context";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";
import { LANGUAGE_NAMES, LOCALE_SWITCH_COOKIE, PUBLIC_LOCALES, isPublicLocale, localizedPath, stripLocale } from "@/lib/publicLocale";
import styles from "./FooterLanguageSelect.module.scss";

const FLAGS = { en: GB, ro: RO, bg: BG, sr: RS };

export default function FooterLanguageSelect() {
  const locale = usePublicLocale();
  const { t } = useTranslation("common");
  const CurrentFlag = FLAGS[locale];
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const restore = () => setSwitching(false);
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  const changeLanguage = (next: string) => {
    if (!isPublicLocale(next) || next === locale || switching) return;
    setSwitching(true);
    const cookieOptions = `Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.cookie = `${LOCALE_SWITCH_COOKIE}=1; Max-Age=30; ${cookieOptions}`;
    const target = `${localizedPath(next, stripLocale(location.pathname))}${location.search}${location.hash}`;

    // Give the full-screen loader a paint before starting the document navigation.
    requestAnimationFrame(() => requestAnimationFrame(() => location.assign(target)));
  };

  return <div className={styles.wrap}>
    {/* <span id="footer-language-label" className={styles.label}>{t("Language")}</span> */}
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={styles.trigger} aria-label={`${t("Language")}: ${LANGUAGE_NAMES[locale]}`} disabled={switching}>
        <CurrentFlag className={styles.flag} aria-hidden="true" />
        <span id="footer-language-value">{LANGUAGE_NAMES[locale]}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.menu} side="top" align="start" sideOffset={8}>
          <DropdownMenu.RadioGroup
            value={locale}
            onValueChange={changeLanguage}
          >
            {PUBLIC_LOCALES.map((code) => {
              const Flag = FLAGS[code];
              return <DropdownMenu.RadioItem key={code} value={code} className={styles.item}>
                <Flag className={styles.flag} aria-hidden="true" />
                <span>{LANGUAGE_NAMES[code]}</span>
                <DropdownMenu.ItemIndicator className={styles.check}><Check size={16} aria-hidden="true" /></DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>;
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
    {switching && <div className={`loader-wrapper ${styles.switchLoader}`} role="status" aria-live="polite" aria-busy="true" aria-label={t("Loading...")}>
      <div className="text-center exelero-loader-wrapper"><ExceleroLoader /></div>
    </div>}
  </div>;
}
