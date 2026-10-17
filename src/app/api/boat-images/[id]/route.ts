import { NextRequest, NextResponse } from "next/server";
import { getBoatImage } from "@/lib/boatDriveImages";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[a-zA-Z0-9_-]{10,}$/.test(id)) return new NextResponse(null, { status: 404 });
  try {
    const source = await getBoatImage(id);
    if (!source.ok || !source.body) return new NextResponse(null, { status: source.status === 404 ? 404 : 502 });
    return new NextResponse(source.body, {
      headers: {
        "Content-Type": source.headers.get("content-type") || "image/webp",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
