import { NextRequest, NextResponse } from "next/server";
import { getPartnerAdminClient, validatePartnerInput } from "@/lib/partnerAdmin";
import { revalidatePartnerPages } from "@/lib/partnerRevalidate";
import type { PartnerInput } from "@/types/Partner";

type Context = { params: Promise<{ id: string }> };
export async function PUT(request: NextRequest, { params }: Context) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { id } = await params;
  const parsed = validatePartnerInput(await request.json().catch(() => null));
  if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data: old } = await client.from("partners").select("slug").eq("id", id).maybeSingle();
  if (!old) return NextResponse.json({ error: "Partner not found." }, { status: 404 });
  const changes: Partial<PartnerInput> = { ...parsed.data };
  delete changes.slug;
  delete changes.sort_order;
  const { data, error } = await client.from("partners").update(changes).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already in use." : error.message }, { status: error.code === "23505" ? 409 : 500 });
  revalidatePartnerPages(old.slug, data.slug);
  return NextResponse.json({ partner: data });
}
