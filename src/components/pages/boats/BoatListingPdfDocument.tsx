"use client";

import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ProductType } from "@/types/Product";

type Props = {
  boat: ProductType;
  /** Absolute base url like https://example.com (for converting /assets/... to absolute). */
  baseUrl: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
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
    height: 100,
    borderRadius: 8,
    objectFit: "cover",
    border: "1px solid #e2e8f0",
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

function formatPrice(price: number | undefined) {
  const value = Number(price || 0);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
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

function buildSpecs(boat: ProductType) {
  const specs: Array<[string, string]> = [];

  const add = (k: string, v: string | number | undefined | null) => {
    if (v === undefined || v === null || v === "" || (typeof v === "number" && !Number.isFinite(v))) return;
    specs.push([k, String(v)]);
  };

  add("Manufacturer", boat.manufacturer);
  add("Designer", boat.designer);
  add("Build year", boat.buildYear || (boat.year ? String(boat.year) : ""));
  add("Build number", boat.buildNumber);
  add("Boat type", boat.boatType);
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

export default function BoatListingPdfDocument({ boat, baseUrl }: Props) {
  const photoUrls = (boat.image || [])
    .filter(Boolean)
    .slice(0, MAX_PHOTOS)
    .map((u) => toAbsoluteUrl(u, baseUrl));
  const specs = buildSpecs(boat);

  const chips: string[] = [
    boat.boatType ? `Type: ${boat.boatType}` : "",
    boat.manufacturer ? `Manufacturer: ${boat.manufacturer}` : "",
    boat.buildYear ? `Year: ${boat.buildYear}` : boat.year ? `Year: ${boat.year}` : "",
  ].filter(Boolean);

  const brokerLines = [
    boat.brokerEmail ? `Email: ${boat.brokerEmail}` : "",
    boat.brokerPhone ? `Phone: ${boat.brokerPhone}` : "",
  ].filter(Boolean);

  const avatarUrl = boat.brokerProfileImage ? toAbsoluteUrl(boat.brokerProfileImage, baseUrl) : "";

  return (
    <Document
      title={`${boat.title || "Boat"} - Exelero Yachting`}
      author="Exelero Yachting"
      subject="Boat listing"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>EXELERO YACHTING</Text>
            <Text style={styles.title}>{boat.title || "Untitled Boat"}</Text>
            <Text style={styles.subtitle}>{boat.location || "Location TBD"}</Text>
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
              {formatPrice(boat.price)} €
            </Text>
            <Text style={styles.vat}>{boat.vatIncluded ? "VAT Included" : "VAT not included"}</Text>
          </View>
        </View>

        {photoUrls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
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
              <Text style={styles.sectionTitle}>Listing details</Text>
              <View style={styles.kvTable}>
                {specs.length ? (
                  specs.map(([k, v], idx) => (
                    <View key={`${k}-${idx}`} style={[styles.kvRow, idx === specs.length - 1 ? { borderBottom: "none" } : null]}>
                      <Text style={styles.kvKey}>{k}</Text>
                      <Text style={styles.kvValue}>{v}</Text>
                    </View>
                  ))
                ) : (
                  <View style={[styles.kvRow, { borderBottom: "none" }]}>
                    <Text style={styles.kvKey}>Details</Text>
                    <Text style={styles.kvValue}>No additional specs provided.</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.col, { maxWidth: 220 }]}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <View style={styles.contactCard}>
                <View style={styles.contactTop}>
                  {avatarUrl ? <Image src={avatarUrl} style={styles.avatar} /> : null}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{boat.brokerName || "Broker / Dealer"}</Text>
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
                  <Text style={styles.contactLine}>Contact details not provided.</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {(boat.description || boat.exteriorDescription || boat.additionalDetails) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            {!!boat.description && (
              <Text style={styles.paragraph}>{stripHtml(boat.description)}</Text>
            )}
            {!!boat.exteriorDescription && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Exterior</Text>
                <Text style={styles.paragraph}>{stripHtml(boat.exteriorDescription)}</Text>
              </>
            )}
            {!!boat.additionalDetails && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Additional details</Text>
                <Text style={styles.paragraph}>{stripHtml(boat.additionalDetails)}</Text>
              </>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated {new Date().toLocaleDateString()}</Text>
          <Text>{toAbsoluteUrl(`/services/brokerage/${boat.id}`, baseUrl)}</Text>
        </View>
      </Page>
    </Document>
  );
}

