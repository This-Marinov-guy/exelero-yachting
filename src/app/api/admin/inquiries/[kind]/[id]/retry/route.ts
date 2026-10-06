import { NextRequest, NextResponse } from "next/server";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import { createInquiryStore, inquiryStoreConfigured, type InquirySourceType } from "@/lib/inquiryStore";
import { deliverSavedInquiry, type InquirySource } from "@/lib/inquirySubmission";
import type { PartnerFormField } from "@/types/Partner";

export const runtime = "nodejs";

type Context = { params: Promise<{ kind: string; id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "This request must come from the account page." }, { status: 403 });
  }
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });

  const { kind, id } = await params;
  if ((kind !== "boat" && kind !== "partner") || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  }
  if (!inquiryStoreConfigured()) {
    return NextResponse.json({ error: "Email retry is unavailable. The inquiry remains visible in this account." }, { status: 503 });
  }

  const store = createInquiryStore(kind as InquirySourceType);
  try {
    const saved = await store.read(id);
    if (!saved) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    if (!saved.context_path) return NextResponse.json({ error: "This older inquiry has no email delivery record." }, { status: 409 });

    let fields: PartnerFormField[] = [];
    if (kind === "partner" && saved.partner_id) {
      const { data, error } = await client.from("partners").select("custom_fields").eq("id", saved.partner_id).maybeSingle();
      if (!error && Array.isArray(data?.custom_fields)) fields = data.custom_fields as PartnerFormField[];
    }
    const source: InquirySource = {
      type: kind,
      id: kind === "boat" ? saved.boat_id ?? "" : saved.partner_id ?? "",
      name: saved.context_name,
      path: saved.context_path,
      fields,
    };
    const result = await deliverSavedInquiry(store, source, saved);
    if (result === "busy") return NextResponse.json({ error: "Another email attempt is in progress. Try again shortly." }, { status: 409 });
    if (result === "failed") return NextResponse.json({ error: "Email is still unavailable. The inquiry remains saved in the account inbox." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[inquiry] Account retry failed:", typeof error === "object" && error && "code" in error ? String(error.code) : "UNKNOWN");
    return NextResponse.json({ error: "Email retry could not be completed. The inquiry remains saved in the account inbox." }, { status: 500 });
  } finally {
    await store.close();
  }
}
