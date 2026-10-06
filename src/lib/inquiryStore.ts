import "server-only";
import { createClient } from "@supabase/supabase-js";
import postgres, { type Sql } from "postgres";

export type InquirySourceType = "boat" | "partner";

export type InquiryValues = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  answers: Record<string, string>;
};

export type InquiryRecord = InquiryValues & {
  id: string;
  boat_id?: string | null;
  partner_id?: string | null;
  context_name: string;
  context_path: string;
  notification_delivered_to: string[];
  notification_sent_at: string | null;
  notification_lock_until: string | null;
};

type SavedInquiry = InquiryValues & {
  id: string;
  sourceId: string;
  contextName: string;
  contextPath: string;
};

export interface InquiryStore {
  save(inquiry: SavedInquiry): Promise<void>;
  read(id: string): Promise<InquiryRecord | null>;
  claimDelivery(id: string, previousLock: string | null, lock: string): Promise<string[] | null>;
  recordDelivery(id: string, lock: string, delivered: string[]): Promise<void>;
  completeDelivery(id: string, lock: string, sentAt: string): Promise<void>;
  releaseDelivery(id: string, lock: string): Promise<void>;
  close(): Promise<void>;
}

export function inquiryStoreConfigured() {
  const hasApiCredentials = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
      && (process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  );
  return hasApiCredentials || Boolean(process.env.SUPABASE_DB_URL?.trim());
}

export function createInquiryStore(sourceType: InquirySourceType): InquiryStore {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (url && key) return createSupabaseStore(sourceType, url, key);

  const connectionString = process.env.SUPABASE_DB_URL?.trim();
  if (connectionString) return createPostgresStore(sourceType, connectionString);

  throw new Error("Inquiry storage is not configured.");
}

function createSupabaseStore(sourceType: InquirySourceType, url: string, key: string): InquiryStore {
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const table = sourceType === "boat" ? "boat_inquiries" : "partner_inquiries";
  const sourceColumn = sourceType === "boat" ? "boat_id" : "partner_id";

  return {
    async save(inquiry) {
      const { id, sourceId, contextName, contextPath, ...values } = inquiry;
      const { error } = await db.from(table).upsert({
        id,
        [sourceColumn]: sourceId,
        ...values,
        context_name: contextName,
        context_path: contextPath,
      }, { onConflict: "id", ignoreDuplicates: true });
      if (error) throw databaseError(error.code, error.message);
    },
    async read(id) {
      const { data, error } = await db.from(table).select("*").eq("id", id).single();
      if (error) throw databaseError(error.code, error.message);
      return data as InquiryRecord;
    },
    async claimDelivery(id, previousLock, lock) {
      const claim = db.from(table)
        .update({ notification_lock_until: lock })
        .eq("id", id)
        .is("notification_sent_at", null);
      const { data, error } = await (previousLock
        ? claim.eq("notification_lock_until", previousLock)
        : claim.is("notification_lock_until", null))
        .select("notification_delivered_to")
        .maybeSingle();
      if (error) throw databaseError(error.code, error.message);
      return data ? data.notification_delivered_to ?? [] : null;
    },
    async recordDelivery(id, lock, delivered) {
      const { error } = await db.from(table)
        .update({ notification_delivered_to: delivered })
        .eq("id", id)
        .eq("notification_lock_until", lock);
      if (error) throw databaseError(error.code, error.message);
    },
    async completeDelivery(id, lock, sentAt) {
      const { error } = await db.from(table)
        .update({ notification_sent_at: sentAt, notification_lock_until: null })
        .eq("id", id)
        .eq("notification_lock_until", lock);
      if (error) throw databaseError(error.code, error.message);
    },
    async releaseDelivery(id, lock) {
      const { error } = await db.from(table)
        .update({ notification_lock_until: null })
        .eq("id", id)
        .eq("notification_lock_until", lock);
      if (error) throw databaseError(error.code, error.message);
    },
    async close() {},
  };
}

function createPostgresStore(sourceType: InquirySourceType, connectionString: string): InquiryStore {
  const sql = postgres(connectionString, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 10,
  });

  return {
    async save(inquiry) {
      await saveWithPostgres(sql, sourceType, inquiry);
    },
    async read(id) {
      const rows = sourceType === "boat"
        ? await sql<InquiryRecord[]>`select * from public.boat_inquiries where id = ${id} limit 1`
        : await sql<InquiryRecord[]>`select * from public.partner_inquiries where id = ${id} limit 1`;
      return rows[0] ?? null;
    },
    async claimDelivery(id, previousLock, lock) {
      const rows = await claimWithPostgres(sql, sourceType, id, previousLock, lock);
      return rows[0]?.notification_delivered_to ?? (rows.length ? [] : null);
    },
    async recordDelivery(id, lock, delivered) {
      const rows = sourceType === "boat"
        ? await sql`update public.boat_inquiries set notification_delivered_to = ${sql.array(delivered)} where id = ${id} and notification_lock_until = ${lock} returning id`
        : await sql`update public.partner_inquiries set notification_delivered_to = ${sql.array(delivered)} where id = ${id} and notification_lock_until = ${lock} returning id`;
      if (rows.length !== 1) throw databaseError("LOCK_LOST", "The inquiry delivery lock was lost.");
    },
    async completeDelivery(id, lock, sentAt) {
      const rows = sourceType === "boat"
        ? await sql`update public.boat_inquiries set notification_sent_at = ${sentAt}, notification_lock_until = null where id = ${id} and notification_lock_until = ${lock} returning id`
        : await sql`update public.partner_inquiries set notification_sent_at = ${sentAt}, notification_lock_until = null where id = ${id} and notification_lock_until = ${lock} returning id`;
      if (rows.length !== 1) throw databaseError("LOCK_LOST", "The inquiry delivery lock was lost.");
    },
    async releaseDelivery(id, lock) {
      if (sourceType === "boat") {
        await sql`update public.boat_inquiries set notification_lock_until = null where id = ${id} and notification_lock_until = ${lock}`;
      } else {
        await sql`update public.partner_inquiries set notification_lock_until = null where id = ${id} and notification_lock_until = ${lock}`;
      }
    },
    async close() {
      await sql.end({ timeout: 5 });
    },
  };
}

async function saveWithPostgres(sql: Sql, sourceType: InquirySourceType, inquiry: SavedInquiry) {
  const { id, sourceId, contextName, contextPath, name, email, phone, message, answers } = inquiry;
  if (sourceType === "boat") {
    await sql`
      insert into public.boat_inquiries
        (id, boat_id, name, email, phone, message, answers, context_name, context_path)
      values
        (${id}, ${sourceId}, ${name}, ${email}, ${phone}, ${message}, ${sql.json(answers)}, ${contextName}, ${contextPath})
      on conflict (id) do nothing
    `;
  } else {
    await sql`
      insert into public.partner_inquiries
        (id, partner_id, name, email, phone, message, answers, context_name, context_path)
      values
        (${id}, ${sourceId}, ${name}, ${email}, ${phone}, ${message}, ${sql.json(answers)}, ${contextName}, ${contextPath})
      on conflict (id) do nothing
    `;
  }
}

async function claimWithPostgres(sql: Sql, sourceType: InquirySourceType, id: string, previousLock: string | null, lock: string) {
  if (sourceType === "boat") {
    return previousLock
      ? sql<Pick<InquiryRecord, "notification_delivered_to">[]>`update public.boat_inquiries set notification_lock_until = ${lock} where id = ${id} and notification_sent_at is null and notification_lock_until = ${previousLock} returning notification_delivered_to`
      : sql<Pick<InquiryRecord, "notification_delivered_to">[]>`update public.boat_inquiries set notification_lock_until = ${lock} where id = ${id} and notification_sent_at is null and notification_lock_until is null returning notification_delivered_to`;
  }
  return previousLock
    ? sql<Pick<InquiryRecord, "notification_delivered_to">[]>`update public.partner_inquiries set notification_lock_until = ${lock} where id = ${id} and notification_sent_at is null and notification_lock_until = ${previousLock} returning notification_delivered_to`
    : sql<Pick<InquiryRecord, "notification_delivered_to">[]>`update public.partner_inquiries set notification_lock_until = ${lock} where id = ${id} and notification_sent_at is null and notification_lock_until is null returning notification_delivered_to`;
}

function databaseError(code: string, message: string) {
  return Object.assign(new Error(message), { code });
}
