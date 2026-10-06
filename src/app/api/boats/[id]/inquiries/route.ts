import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { submitInquiry } from "@/lib/inquirySubmission";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Boat not found." }, { status: 404 });
    const db = getSupabaseServerClient();
    const { data: boat, error } = await db.from("boats").select("id, slug").eq("id", id).eq("active", true).eq("bought", false).maybeSingle();
    if (error) throw error;
    if (!boat) return NextResponse.json({ error: "This boat is no longer available for inquiries." }, { status: 404 });
    const { data: details, error: detailsError } = await db.from("boat_data").select("title").eq("boat_id", id).single();
    if (detailsError) throw detailsError;
    return await submitInquiry(await request.json().catch(() => null), {
      type: "boat", id, name: details.title, path: `/services/brokerage/${boat.slug}`,
    });
  } catch {
    console.error("[boat-inquiry] Request failed.");
    return NextResponse.json({ error: "We couldn't send your inquiry. Please try again." }, { status: 500 });
  }
}
