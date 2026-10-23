import { NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { queueBoatDriveCleanup } from "@/lib/boatDriveCleanup";

export const runtime = "nodejs";
export const maxDuration = 120;

type Context = { params: Promise<{ id: string }> };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(_: Request, { params }: Context) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Invalid listing." }, { status: 400 });

  const { data: boat, error: boatError } = await client.from("boats").select("id").eq("id", id).maybeSingle();
  if (boatError) return NextResponse.json({ error: "Could not check this listing." }, { status: 502 });
  if (!boat) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  // Read links before the boat delete cascades to boat_images.
  const { data: media, error: mediaError } = await client.from("boat_images").select("link").eq("boat_id", id);
  if (mediaError) return NextResponse.json({ error: "Could not check listing photos." }, { status: 502 });

  const { error: unlinkError } = await client.from("broker_data").update({ boat_id: null }).eq("boat_id", id);
  if (unlinkError) return NextResponse.json({ error: "Could not unlink this listing's dealer." }, { status: 502 });

  const { data: deleted, error: deleteError } = await client.from("boats").delete().eq("id", id).select("id").maybeSingle();
  if (deleteError || !deleted) return NextResponse.json({ error: "Could not delete this listing." }, { status: 502 });

  const driveCleanupQueued = queueBoatDriveCleanup(client, (media || []).map(row => row.link), true);
  return NextResponse.json({ ok: true, driveCleanupQueued });
}
