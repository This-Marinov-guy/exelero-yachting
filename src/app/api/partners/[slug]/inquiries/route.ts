import { NextRequest, NextResponse } from "next/server";
import { getPublishedPartnerBySlug } from "@/lib/partners";
import { submitInquiry } from "@/lib/inquirySubmission";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const partner = await getPublishedPartnerBySlug(slug);
    if (!partner) return NextResponse.json({ error: "Partner not found." }, { status: 404 });
    return await submitInquiry(await request.json().catch(() => null), {
      type: "partner", id: partner.id, name: partner.name, path: `/partners/${partner.slug}`,
      fields: partner.form_type === "custom" ? partner.custom_fields : [],
    });
  } catch {
    console.error("[partner-inquiry] Request failed.");
    return NextResponse.json({ error: "We couldn't send your inquiry. Please try again." }, { status: 500 });
  }
}
