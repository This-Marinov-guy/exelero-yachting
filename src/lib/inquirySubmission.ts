import "server-only";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { PartnerFormField } from "@/types/Partner";
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[inquiry] Server database credentials are missing.");
    return NextResponse.json({ error: "We couldn't save your inquiry. Please try again shortly." }, { status: 503 });
  }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const table = source.type === "boat" ? "boat_inquiries" : "partner_inquiries";
  const sourceColumn = source.type === "boat" ? "boat_id" : "partner_id";
  const id = body.request_id;
  const values = { ...details, phone: details.phone || null };
  const { error: saveError } = await db.from(table).upsert({
    id, [sourceColumn]: source.id, ...values,
    context_name: source.name, context_path: source.path,
  }, { onConflict: "id", ignoreDuplicates: true });
  if (saveError) {
    console.error("[inquiry] Save failed:", saveError.code);
    return NextResponse.json({ error: "We couldn't save your inquiry. Please try again." }, { status: 500 });
  }
  const { data: saved, error: readError } = await db.from(table).select("*").eq("id", id).single();
  if (readError || !saved) return NextResponse.json({ error: "We couldn't confirm your inquiry. Please try again." }, { status: 500 });
  // A request ID is a retry token, never permission to replace an earlier inquiry.
  if (saved[sourceColumn] !== source.id || ["name", "email", "phone", "message"].some(field => saved[field] !== values[field as keyof typeof values]) ||
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
  const claim = db.from(table)
    .update({ notification_lock_until: lock })
    .eq("id", id).is("notification_sent_at", null);
  const { data: claimed, error: claimError } = await (saved.notification_lock_until
    ? claim.eq("notification_lock_until", saved.notification_lock_until)
    : claim.is("notification_lock_until", null))
    .select("notification_delivered_to").maybeSingle();
  if (claimError) {
    console.error("[inquiry] Delivery claim failed:", claimError.code, claimError.message);
    return NextResponse.json({ error: "Your inquiry is saved, but we couldn't finish sending it. Please try again.", saved: true }, { status: 500 });
  }
  if (!claimed) return NextResponse.json({ error: "Your inquiry is being sent. Please wait a moment before trying again.", saved: true }, { status: 409 });
  const delivered: string[] = claimed.notification_delivered_to ?? [];
  try {
    const answers = Object.fromEntries(inquiryExtraFields(source.fields ?? [])
      .filter(field => details.answers[field.id]).map(field => [field.label, details.answers[field.id]]));
    for (const recipient of getNotificationRecipients()) {
      if (delivered.includes(recipient)) continue;
      await sendInquiryNotification({ ...details, answers, id, type: source.type, subject: saved.context_name, path: saved.context_path }, recipient);
      delivered.push(recipient);
      const { error } = await db.from(table).update({ notification_delivered_to: delivered }).eq("id", id).eq("notification_lock_until", lock);
      if (error) throw new Error("Could not record notification delivery.");
    }
    const { error } = await db.from(table).update({ notification_sent_at: new Date().toISOString(), notification_lock_until: null }).eq("id", id).eq("notification_lock_until", lock);
    if (error) throw new Error("Could not record notification completion.");
    return NextResponse.json({ ok: true });
  } catch {
    console.error(`[inquiry] Notification delivery incomplete for ${source.type} inquiry ${id}.`);
    await db.from(table).update({ notification_lock_until: null }).eq("id", id).eq("notification_lock_until", lock);
    return NextResponse.json({ error: "Your inquiry is saved, but we couldn't finish sending it. Please try again.", saved: true }, { status: 502 });
  }
}
