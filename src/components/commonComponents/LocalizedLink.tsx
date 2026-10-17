"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePublicLocale } from "@/app/i18n/i18n-context";
import { localizedPath } from "@/lib/publicLocale";

export default function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = usePublicLocale();
  return <Link {...props} href={typeof href === "string" ? localizedPath(locale, href) : href} />;
}
