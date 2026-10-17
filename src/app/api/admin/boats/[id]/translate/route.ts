import { after, NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { translateSavedBoat } from "@/lib/translateSavedContent";

export const maxDuration = 120;

type Context = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Context) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  const { data: boat, error: boatError } = await client.from("boats").select("id").eq("id", id).maybeSingle();
  if (boatError || !boat) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  const { data: source, error } = await client.from("boat_data")
    .select("title, description, location, additional_details, updated_at")
    .eq("boat_id", id).maybeSingle();
  if (error || !source) return NextResponse.json({ error: "Listing details not found." }, { status: 404 });
  after(() => translateSavedBoat(client, id, source));
  return NextResponse.json({ queued: true }, { status: 202 });
}
