import "server-only";
import { NextResponse } from "next/server";
import type { PartnerFormField } from "@/types/Partner";
import { createInquiryStore, inquiryStoreConfigured } from "./inquiryStore";
import { inquiryExtraFields, validateInquiry } from "./inquiryValidation";
import { getNotificationRecipients, sendInquiryNotification } from "./notificationService";

type Source = {
  type: "boat" | "partner";
  id: string;
  name: string;
  path: string;
  fields?: PartnerFormField[];
};

export async function submitInquiry(raw: unknown, source: Source) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return NextResponse.json({ error: "Enter your contact details and message." }, { status: 400 });
  const body = raw as Record<string, unknown>;
  if (body.website_check) return NextResponse.json({ ok: true });
  if (typeof body.request_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.request_id)) {
    return NextResponse.json({ error: "Please reload the page and send your inquiry again." }, { status: 400 });
  }
  const validation = validateInquiry(body, source.fields);
  if (!validation.data) return NextResponse.json({ error: validation.error, field: validation.field }, { status: 400 });
  const details = validation.data;
  if (!inquiryStoreConfigured()) {
    console.error("[inquiry] Server database credentials are missing. Configure SUPABASE_SECRET_KEY (preferred), SUPABASE_SERVICE_ROLE_KEY, or SUPABASE_DB_URL.");
    const error = process.env.NODE_ENV === "development"
      ? "Inquiry saving is not configured locally. Add SUPABASE_SECRET_KEY or SUPABASE_DB_URL to .env.local and restart the server."
      : "We couldn't save your inquiry. Please try again shortly.";
    return NextResponse.json({ error }, { status: 503 });
  }
  const sourceColumn = source.type === "boat" ? "boat_id" : "partner_id";
  const id = body.request_id;
  const values = { ...details, phone: details.phone || null };
  const store = createInquiryStore(source.type);
  try {
    try {
      await store.save({ id, sourceId: source.id, ...values, contextName: source.name, contextPath: source.path });
    } catch (error) {
      console.error("[inquiry] Save failed:", databaseErrorCode(error));
      return NextResponse.json({ error: "We couldn't save your inquiry. Please try again." }, { status: 500 });
    }
    let saved;
    try {
      saved = await store.read(id);
    } catch (error) {
      console.error("[inquiry] Read failed:", databaseErrorCode(error));
      return NextResponse.json({ error: "We couldn't confirm your inquiry. Please try again." }, { status: 500 });
    }
    if (!saved) return NextResponse.json({ error: "We couldn't confirm your inquiry. Please try again." }, { status: 500 });
    // A request ID is a retry token, never permission to replace an earlier inquiry.
    if (saved[sourceColumn] !== source.id || ["name", "email", "phone", "message"].some(field => saved[field as keyof typeof saved] !== values[field as keyof typeof values]) ||
        JSON.stringify(Object.entries(saved.answers).sort()) !== JSON.stringify(Object.entries(details.answers).sort())) {
      return NextResponse.json({ error: "This inquiry has already been saved. Reload the page to send a new message." }, { status: 409 });
    }
    if (saved.notification_sent_at) return NextResponse.json({ ok: true });

    // Only one request can deliver this inquiry at a time, including concurrent retries.
    const now = new Date();
    if (saved.notification_lock_until && new Date(saved.notification_lock_until) > now) {
      return NextResponse.json({ error: "Your inquiry is being sent. Please wait a moment before trying again.", saved: true }, { status: 409 });
    }
    const lock = new Date(now.getTime() + 5 * 60_000).toISOString();
    let delivered: string[] | null;
    try {
      delivered = await store.claimDelivery(id, saved.notification_lock_until, lock);
    } catch (error) {
      console.error("[inquiry] Delivery claim failed:", databaseErrorCode(error));
      return NextResponse.json({ error: "Your inquiry is saved, but we couldn't finish sending it. Please try again.", saved: true }, { status: 500 });
    }
    if (!delivered) return NextResponse.json({ error: "Your inquiry is being sent. Please wait a moment before trying again.", saved: true }, { status: 409 });
    try {
      const answers = Object.fromEntries(inquiryExtraFields(source.fields ?? [])
        .filter(field => details.answers[field.id]).map(field => [field.label, details.answers[field.id]]));
      for (const recipient of getNotificationRecipients()) {
        if (delivered.includes(recipient)) continue;
        await sendInquiryNotification({ ...details, answers, id, type: source.type, subject: saved.context_name, path: saved.context_path }, recipient);
        delivered.push(recipient);
        await store.recordDelivery(id, lock, delivered);
      }
      await store.completeDelivery(id, lock, new Date().toISOString());
      return NextResponse.json({ ok: true });
    } catch {
      console.error(`[inquiry] Notification delivery incomplete for ${source.type} inquiry ${id}.`);
      try {
        await store.releaseDelivery(id, lock);
      } catch (error) {
        console.error("[inquiry] Delivery lock release failed:", databaseErrorCode(error));
      }
      return NextResponse.json({ error: "Your inquiry is saved, but we couldn't finish sending it. Please try again.", saved: true }, { status: 502 });
    }
  } finally {
    await store.close();
  }
}

function databaseErrorCode(error: unknown) {
  return typeof error === "object" && error && "code" in error ? String(error.code) : "UNKNOWN";
}
