import "server-only";
import { NextResponse } from "next/server";
import type { PartnerFormField } from "@/types/Partner";
import { createInquiryStore, inquiryStoreConfigured, type InquiryRecord, type InquiryStore } from "./inquiryStore";
import { inquiryExtraFields, validateInquiry } from "./inquiryValidation";
import { getNotificationRecipients, sendInquiryNotification } from "./notificationService";

export type InquirySource = {
  type: "boat" | "partner";
  id: string;
  name: string;
  path: string;
  fields?: PartnerFormField[];
};

export async function submitInquiry(raw: unknown, source: InquirySource) {
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
    const delivery = await deliverSavedInquiry(store, source, saved);
    // The account inbox is the source of truth. A delayed email must not ask
    // the visitor to submit the same inquiry again.
    return NextResponse.json({ ok: true, notification: delivery === "sent" ? "sent" : "pending" }, { status: delivery === "sent" ? 200 : 202 });
  } finally {
    await store.close();
  }
}

export async function deliverSavedInquiry(store: InquiryStore, source: InquirySource, saved: InquiryRecord): Promise<"sent" | "busy" | "failed"> {
  if (saved.notification_sent_at) return "sent";

  // Only one request can deliver this inquiry at a time, including concurrent retries.
  const now = new Date();
  if (saved.notification_lock_until && new Date(saved.notification_lock_until) > now) return "busy";
  const lock = new Date(now.getTime() + 5 * 60_000).toISOString();
  let delivered: string[] | null;
  try {
    delivered = await store.claimDelivery(saved.id, saved.notification_lock_until, lock);
  } catch (error) {
    console.error("[inquiry] Delivery claim failed:", databaseErrorCode(error));
    return "failed";
  }
  if (!delivered) return "busy";

  try {
    const labels = new Map(inquiryExtraFields(source.fields ?? []).map(field => [field.id, field.label]));
    const answers = Object.fromEntries(Object.entries(saved.answers ?? {}).map(([key, value]) => [
      labels.get(key) || key,
      value,
    ]));
    for (const recipient of getNotificationRecipients()) {
      if (delivered.includes(recipient)) continue;
      await sendInquiryNotification({
        id: saved.id, name: saved.name, email: saved.email, phone: saved.phone ?? "", message: saved.message,
        answers, type: source.type, subject: saved.context_name, path: saved.context_path,
      }, recipient);
      delivered.push(recipient);
      await store.recordDelivery(saved.id, lock, delivered);
    }
    await store.completeDelivery(saved.id, lock, new Date().toISOString());
    return "sent";
  } catch (error) {
    console.error(`[inquiry] Notification delivery incomplete for ${source.type} inquiry ${saved.id}:`, notificationErrorCode(error));
    try {
      await store.releaseDelivery(saved.id, lock);
    } catch (releaseError) {
      console.error("[inquiry] Delivery lock release failed:", databaseErrorCode(releaseError));
    }
    return "failed";
  }
}

function databaseErrorCode(error: unknown) {
  return typeof error === "object" && error && "code" in error ? String(error.code) : "UNKNOWN";
}

function notificationErrorCode(error: unknown) {
  if (!(error instanceof Error)) return "UNKNOWN";
  if (/Missing Gmail config|NOTIFICATION_TO_EMAIL/.test(error.message)) return "MAIL_CONFIG_MISSING";
  const smtpError = error as Error & { code?: string; responseCode?: number; command?: string };
  return [smtpError.code || "SMTP_ERROR", smtpError.responseCode, smtpError.command].filter(Boolean).join("/");
}
