import { NextRequest, NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { revalidatePartnerPages } from "@/lib/partnerRevalidate";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PUT(request: NextRequest) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const ids = body && typeof body === "object" && !Array.isArray(body) ? body.ids : null;
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 10000 || !ids.every((id) => typeof id === "string" && uuid.test(id)) || new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: "Send each partner exactly once in the desired order." }, { status: 400 });
  }

  const { error } = await client.rpc("reorder_partners", { partner_ids: ids });
  if (error) return NextResponse.json({ error: error.code === "P0001" ? error.message : "Could not save partner order. Try again." }, { status: error.code === "P0001" ? 409 : 500 });

  revalidatePartnerPages();
  return NextResponse.json({ saved: true });
}
