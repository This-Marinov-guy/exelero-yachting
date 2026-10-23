import { NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { queueBoatDriveCleanup } from "@/lib/boatDriveCleanup";

export const runtime = "nodejs";
export const maxDuration = 120;

type Context = { params: Promise<{ id: string }> };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(request: Request, { params }: Context) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });
  const { id: boatId } = await params;
  if (!UUID.test(boatId)) return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  const body = await request.json().catch(() => null);
  const ids = body?.imageIds;
  if (!Array.isArray(ids) || !ids.length || ids.length > 100 || ids.some(value => typeof value !== "string" || !UUID.test(value)) || new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: "Choose up to 100 listing media items to remove." }, { status: 400 });
  }

  const { data: rows, error: readError } = await client.from("boat_images")
    .select("id,link").eq("boat_id", boatId).in("id", ids);
  if (readError) return NextResponse.json({ error: "Could not check listing photos." }, { status: 502 });
  if (rows?.length !== ids.length) return NextResponse.json({ error: "Some photos are no longer on this listing. Reload and try again." }, { status: 409 });

  const { data: deleted, error: deleteError } = await client.from("boat_images")
    .delete().eq("boat_id", boatId).in("id", ids).select("id");
  if (deleteError || deleted?.length !== ids.length) return NextResponse.json({ error: "Could not remove all selected photos." }, { status: 502 });

  const driveCleanupQueued = queueBoatDriveCleanup(client, rows.map(row => row.link), true);
  return NextResponse.json({ ok: true, driveCleanupQueued });
}
