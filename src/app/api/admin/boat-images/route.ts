import { NextRequest, NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { deleteBoatImage, driveImageId, MAX_BOAT_IMAGE_BYTES, uploadBoatImage } from "@/lib/boatDriveImages";

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
  const id = driveImageId(url.searchParams.get("url") || "");
  if (!id) return NextResponse.json({ error: "Choose a Drive image to remove." }, { status: 400 });
  try {
    const { data, error } = await client.from("boat_images").select("id").eq("link", `/api/boat-images/${id}`).limit(1);
    if (error) throw error;
    if (data?.length) return NextResponse.json({ error: "Remove this image from the listing before deleting its Drive file." }, { status: 409 });
    await deleteBoatImage(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not remove this image. Try again." }, { status: 502 });
  }
}
