import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPartnerAdminClient } from "@/lib/partnerAdmin";
import {
  DEFAULT_SERVICE_PAGE_CONTENT,
  isServicePageKey,
  type ServicePageContentMap,
  type ServicePageKey,
  validateServicePageContent,
} from "@/lib/servicePageContent";

type SavedPage<K extends ServicePageKey = ServicePageKey> = {
  content: ServicePageContentMap[K];
  updated_at: string | null;
};

export async function GET() {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });

  const { data, error } = await client.from("service_page_content").select("page_key, content, updated_at");
  if (error) return NextResponse.json({ error: "Could not load page content. Try again." }, { status: 500 });

  const pages: Record<ServicePageKey, SavedPage> = {
    charters: { content: DEFAULT_SERVICE_PAGE_CONTENT.charters, updated_at: null },
    transportation: { content: DEFAULT_SERVICE_PAGE_CONTENT.transportation, updated_at: null },
  };
  for (const row of data) {
    if (!isServicePageKey(row.page_key)) continue;
    const parsed = validateServicePageContent(row.page_key, row.content);
    if (!parsed.content) return NextResponse.json({ error: `The saved ${row.page_key} content is invalid. Contact the site administrator.` }, { status: 500 });
    pages[row.page_key] = { content: parsed.content, updated_at: row.updated_at };
  }
  return NextResponse.json({ pages });
}

export async function PUT(request: NextRequest) {
  const client = await getPartnerAdminClient();
  if (!client) return NextResponse.json({ error: "Account access required." }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || typeof body.page !== "string" || !isServicePageKey(body.page)) {
    return NextResponse.json({ error: "Choose a page to update." }, { status: 400 });
  }
  const page: ServicePageKey = body.page;
  const parsed = validateServicePageContent(page, body.content);
  if (!parsed.content) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (body.updated_at !== null && typeof body.updated_at !== "string") {
    return NextResponse.json({ error: "Reload this page before saving." }, { status: 400 });
  }

  const query = body.updated_at
    ? client.from("service_page_content").update({ content: parsed.content }).eq("page_key", page).eq("updated_at", body.updated_at)
    : client.from("service_page_content").insert({ page_key: page, content: parsed.content });
  const { data, error } = await query.select("page_key, content, updated_at").maybeSingle();
  if (error?.code === "23505" || (!error && !data)) {
    return NextResponse.json({ error: "This page changed elsewhere. Copy any important draft text, then reload to see the latest version." }, { status: 409 });
  }
  if (error || !data) {
    return NextResponse.json({ error: "Could not save page content. Check your connection and try again." }, { status: 500 });
  }

  revalidatePath(`/services/${page}`);
  return NextResponse.json({ page: { content: data.content, updated_at: data.updated_at } });
}
