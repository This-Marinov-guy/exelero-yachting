import { NextRequest, NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { MAX_BOAT_IMAGE_BYTES, uploadBoatImage } from "@/lib/boatDriveImages";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Sign in to upload an image." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > MAX_BOAT_IMAGE_BYTES + 100_000) {
    return NextResponse.json({ error: "Choose an image under 20 MB." }, { status: 413 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind");
  const scope = form?.get("scope");
  if (!(file instanceof File) || typeof kind !== "string" || typeof scope !== "string") {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(scope)) return NextResponse.json({ error: "Invalid image folder." }, { status: 400 });

  let folders: string[];
  if (kind === "partner") folders = ["Partners", "New uploads"];
  else if (kind === "service" && ["charters", "transportation"].includes(scope)) folders = ["Services", scope];
  else if (kind === "profile" || kind === "dealer") {
    const { data, error } = await client.auth.getClaims();
    if (error || data?.claims?.sub !== scope) return NextResponse.json({ error: "You can only upload your own account image." }, { status: 403 });
    folders = [kind === "profile" ? "Profiles" : "Dealers", scope];
  } else return NextResponse.json({ error: "Invalid image category." }, { status: 400 });

  try {
    return NextResponse.json(await uploadBoatImage(file, scope, folders), { status: 201 });
  } catch (error) {
    console.error("Site image upload failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not upload this image. Try again." }, { status: 502 });
  }
}
