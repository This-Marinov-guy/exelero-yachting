import { NextRequest, NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { driveImageId, MAX_BOAT_IMAGE_BYTES, uploadBoatImage } from "@/lib/boatDriveImages";
import { queueBoatDriveCleanup } from "@/lib/boatDriveCleanup";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > MAX_BOAT_IMAGE_BYTES + 100_000) {
    return NextResponse.json({ error: "Images must be smaller than 20 MB." }, { status: 413 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const listingKey = form?.get("listingKey");
  if (!(file instanceof File) || typeof listingKey !== "string") return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  try {
    const image = await uploadBoatImage(file, listingKey);
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Boat image upload failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not upload this image. Try again." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });
  const url = new URL(request.url);
  const singleUrl = url.searchParams.get("url");
  const body = singleUrl ? null : await request.json().catch(() => null);
  const urls = singleUrl ? [singleUrl] : body?.urls;
  if (!Array.isArray(urls) || !urls.length || urls.length > 25
    || urls.some(value => typeof value !== "string" || !driveImageId(value))
    || new Set(urls).size !== urls.length) {
    return NextResponse.json({ error: "Choose up to 25 Drive images to remove." }, { status: 400 });
  }
  try {
    const { data, error } = await client.from("boat_images").select("id").in("link", urls).limit(1);
    if (error) throw error;
    if (data?.length) return NextResponse.json({ error: "Remove this image from the listing before deleting its Drive file." }, { status: 409 });
    queueBoatDriveCleanup(client, urls);
    return NextResponse.json({ queued: true }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not remove this image. Try again." }, { status: 502 });
  }
}
