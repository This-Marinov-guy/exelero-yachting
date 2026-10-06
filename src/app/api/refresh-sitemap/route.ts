import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = process.env.SITEMAP_REVALIDATE_TOKEN;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true });
}
