"use client";

import React from "react";
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ProductType } from "@/types/Product";
import type { PublicLocale } from "@/lib/publicLocale";
import { publicText } from "@/lib/publicText";

type Props = {
  boat: ProductType;
  /** Absolute base url like https://example.com (for converting /assets/... to absolute). */
  baseUrl: string;
  locale: PublicLocale;
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Source Sans 3 PDF",
    color: "#0b1220",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14,
  },
  brand: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#475569",
  },
  price: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "right",
  },
  vat: {
    fontSize: 9,
    color: "#475569",
    textAlign: "right",
    marginTop: 2,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
    color: "#0f172a",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
  },
  chipText: {
    fontSize: 9,
    color: "#0f172a",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photo: {
    width: "32%",
    maxHeight: 150,
    borderRadius: 8,
    objectFit: "contain",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  kvTable: {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  kvRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e2e8f0",
  },
  kvKey: {
    width: "42%",
    padding: 8,
    backgroundColor: "#f8fafc",
    color: "#334155",
    fontSize: 9,
  },
  kvValue: {
    width: "58%",
    padding: 8,
    fontSize: 9,
    color: "#0f172a",
  },
  paragraph: {
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.5,
  },
  contactCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  contactTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    objectFit: "cover",
    border: "1px solid #e2e8f0",
  },
  contactName: {
    fontSize: 11,
    fontWeight: 700,
  },
  contactMeta: {
    fontSize: 9,
    color: "#475569",
    marginTop: 2,
  },
  contactLine: {
    fontSize: 9,
    color: "#0f172a",
    marginTop: 3,
  },
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 18,
    fontSize: 8,
    color: "#64748b",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function formatPrice(price: number | undefined, locale: PublicLocale) {
  if (price == null) return publicText(locale, "Price upon inquiry");
  return new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : locale, { maximumFractionDigits: 0 }).format(price);
}

/** Strip HTML tags for plain text in PDF. */
function stripHtml(html: string | undefined): string {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(url: string, baseUrl: string) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  return `${baseUrl}/${url}`;
}

function buildSpecs(boat: ProductType, tr: (value: string) => string) {
  const specs: Array<[string, string]> = [];

  const add = (k: string, v: string | number | undefined | null) => {
    if (v === undefined || v === null || v === "" || (typeof v === "number" && !Number.isFinite(v))) return;
    specs.push([tr(k), typeof v === "string" ? tr(v) : String(v)]);
  };

  add("Manufacturer", boat.manufacturer);
  add("Build year", boat.buildYear || (boat.year ? String(boat.year) : ""));
  add("Build number", boat.buildNumber);
  add("Boat type", boat.boatType);
  add("Condition", boat.condition === "new" ? "New" : boat.condition === "pre-owned" ? "Pre-owned" : boat.condition);
  add("Keel type", boat.keelType);
  add("CE design category", boat.ceDesignCategory);
  add("Material", boat.material);
  add("Hull length (m)", boat.hullLength);
  add("Waterline length (m)", boat.waterlineLength);
  add("Beam (m)", boat.beam);
  add("Draft (m)", boat.draft);
  add("Ballast (kg)", boat.ballast);
  add("Displacement (kg)", boat.displacement);
  add("Engine power (kW)", boat.enginePower);
  add("Fuel tank (L)", boat.fuelTank);
  add("Water tank (L)", boat.waterTank);
  add("Location", boat.location);
  add("Dealer", boat.dealer);

  return specs;
}

const MAX_PHOTOS = 9;

export default function BoatListingPdfDocument({ boat, baseUrl, locale }: Props) {
  Font.register({ family: "Source Sans 3 PDF", src: `${baseUrl}/assets/fonts/SourceSans3-Regular.ttf` });
  const tr = (value: string) => publicText(locale, value);
  const photoUrls = (boat.image || [])
    .filter(Boolean)
    .slice(0, MAX_PHOTOS)
    .map((u) => toAbsoluteUrl(u, baseUrl));
  const specs = buildSpecs(boat, tr);

  const chips: string[] = [
    boat.boatType ? `${tr("Type")}: ${tr(boat.boatType)}` : "",
    boat.condition ? `${tr("Condition")}: ${tr(boat.condition === "new" ? "New" : boat.condition === "pre-owned" ? "Pre-owned" : boat.condition)}` : "",
    boat.manufacturer ? `${tr("Manufacturer")}: ${boat.manufacturer}` : "",
    boat.buildYear ? `${tr("Year")}: ${boat.buildYear}` : boat.year ? `${tr("Year")}: ${boat.year}` : "",
  ].filter(Boolean);

  const brokerLines = [
    boat.brokerEmail ? `${tr("Email")}: ${boat.brokerEmail}` : "",
    boat.brokerPhone ? `${tr("Phone")}: ${boat.brokerPhone}` : "",
  ].filter(Boolean);

  const avatarUrl = boat.brokerProfileImage ? toAbsoluteUrl(boat.brokerProfileImage, baseUrl) : "";

  return (
    <Document
      title={`${boat.title || tr("Boat")} - Exelero Yachting`}
      author="Exelero Yachting"
      subject={tr("Boat listing")}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>EXELERO YACHTING</Text>
            <Text style={styles.title}>{boat.title || tr("Untitled Boat")}</Text>
            <Text style={styles.subtitle}>{boat.location || tr("Location TBD")}</Text>
            {chips.length > 0 && (
              <View style={styles.chipsRow}>
                {chips.map((c) => (
                  <View key={c} style={styles.chip}>
                    <Text style={styles.chipText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={{ width: 190 }}>
            <Text style={styles.price}>
              {boat.price != null ? `${formatPrice(boat.price, locale)} €` : formatPrice(boat.price, locale)}
            </Text>
            <Text style={styles.vat}>{tr(boat.vatIncluded ? "VAT Included" : "VAT not included")}</Text>
          </View>
        </View>

        {photoUrls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tr("Photos")}</Text>
            <View style={styles.photosGrid}>
              {photoUrls.map((src, idx) => (
                <Image key={`${src}-${idx}`} src={src} style={styles.photo} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>{tr("Listing details")}</Text>
              <View style={styles.kvTable}>
                {specs.length ? (
                  specs.map(([k, v], idx) => (
                    <View key={`${k}-${idx}`} style={[styles.kvRow, idx === specs.length - 1 ? { borderBottom: "none" } : {}]}>
                      <Text style={styles.kvKey}>{k}</Text>
                      <Text style={styles.kvValue}>{v}</Text>
                    </View>
                  ))
                ) : (
                  <View style={[styles.kvRow, { borderBottom: "none" }]}>
                    <Text style={styles.kvKey}>{tr("Details")}</Text>
                    <Text style={styles.kvValue}>{tr("No additional specs provided.")}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.col, { maxWidth: 220 }]}>
              <Text style={styles.sectionTitle}>{tr("Contact")}</Text>
              <View style={styles.contactCard}>
                <View style={styles.contactTop}>
                  {avatarUrl ? <Image src={avatarUrl} style={styles.avatar} /> : null}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{boat.brokerName || tr("Broker / Dealer")}</Text>
                    <Text style={styles.contactMeta}>{boat.dealer || boat.company || "Exelero Yachting"}</Text>
                  </View>
                </View>
                {brokerLines.length ? (
                  brokerLines.map((line) => (
                    <Text key={line} style={styles.contactLine}>
                      {line}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.contactLine}>{tr("Contact details not provided.")}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {(boat.description || boat.exteriorDescription || boat.additionalDetails) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tr("Description")}</Text>
            {!!boat.description && (
              <Text style={styles.paragraph}>{stripHtml(boat.description)}</Text>
            )}
            {!!boat.exteriorDescription && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>{tr("Exterior")}</Text>
                <Text style={styles.paragraph}>{stripHtml(boat.exteriorDescription)}</Text>
              </>
            )}
            {!!boat.additionalDetails && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>{tr("Additional details")}</Text>
                <Text style={styles.paragraph}>{stripHtml(boat.additionalDetails)}</Text>
              </>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text>{tr("Generated")} {new Date().toLocaleDateString(locale === "sr" ? "sr-Latn-RS" : locale)}</Text>
          <Text>{toAbsoluteUrl(`/services/brokerage/${boat.slug || boat.id}`, baseUrl)}</Text>
        </View>
      </Page>
    </Document>
  );
}

