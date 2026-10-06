import { NextRequest, NextResponse } from "next/server";
import { getPartnerAdminClient, validatePartnerInput } from "@/lib/partnerAdmin";
import { revalidatePartnerPages } from "@/lib/partnerRevalidate";

export async function GET() {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { data, error } = await client.from("partners").select("*").order("sort_order").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ partners: data });
}

export async function POST(request: NextRequest) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const parsed = validatePartnerInput(await request.json().catch(() => null));
  if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data, error } = await client.from("partners").insert(parsed.data).select("*").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already in use." : error.message }, { status: error.code === "23505" ? 409 : 500 });
  revalidatePartnerPages(data.slug);
  return NextResponse.json({ partner: data }, { status: 201 });
}
