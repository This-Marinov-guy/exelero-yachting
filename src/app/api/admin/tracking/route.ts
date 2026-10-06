import { NextResponse } from "next/server";
import { getAuthenticatedClaims } from "@/lib/supabaseAuthServer";
import { getAnalyticsReport } from "@/lib/analytics/server";
import { resolvePeriod, validatePage } from "@/lib/analytics/report";

const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: Request) {
  try {
    if (!await getAuthenticatedClaims()) {
      return NextResponse.json({ error: "Sign in to view tracking." }, { status: 401, headers });
    }
    const params = new URL(request.url).searchParams;
    try {
      resolvePeriod(params.get("period"), params.get("date"), process.env.ANALYTICS_TIME_ZONE || "Europe/Amsterdam");
      validatePage(params.get("page"));
    } catch {
      return NextResponse.json({ error: "Choose a valid month, day and page path. Future dates are unavailable." }, { status: 400, headers });
    }
    return NextResponse.json(await getAnalyticsReport(params), { headers });
  } catch {
    return NextResponse.json({ error: "Tracking is temporarily unavailable. Please try again." }, { status: 503, headers });
  }
}
