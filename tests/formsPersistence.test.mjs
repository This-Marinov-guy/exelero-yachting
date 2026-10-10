import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

// These are database contract tests, not HTTP submissions. No application route,
// notification service, analytics event, or Storage upload is called.
const databaseUrl = process.env.FORM_TEST_DATABASE_URL;
const userId = process.env.FORM_TEST_USER_ID;
const storageUrl = process.env.FORM_TEST_SUPABASE_URL;
const serviceKey = process.env.FORM_TEST_SERVICE_ROLE_KEY;
if (!databaseUrl || !userId || !storageUrl || !serviceKey) {
  throw new Error("Set FORM_TEST_DATABASE_URL, FORM_TEST_USER_ID, FORM_TEST_SUPABASE_URL, and FORM_TEST_SERVICE_ROLE_KEY for a dedicated test Supabase project.");
}
if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(userId)) throw new Error("FORM_TEST_USER_ID must be a UUID.");
const apiHost = new URL(storageUrl).hostname;
const database = new URL(databaseUrl);
const projectRef = apiHost.endsWith(".supabase.co") ? apiHost.split(".")[0] : null;
if (projectRef && !database.hostname.includes(projectRef) && !decodeURIComponent(database.username).includes(projectRef)) {
  throw new Error("The database URL and Supabase API URL do not appear to point at the same project.");
}
const localEnvPath = new URL("../.env.local", import.meta.url);
const localEnv = existsSync(localEnvPath) ? readFileSync(localEnvPath, "utf8") : "";
const linkedUrl = localEnv.match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)?.[1]?.replace(/^['"]|['"]$/g, "");
if (linkedUrl && new URL(linkedUrl).origin === new URL(storageUrl).origin && process.env.FORM_TEST_ALLOW_LINKED_PROJECT !== "yes") {
  throw new Error("The test URL matches the website's linked project. Use a separate test project, or explicitly set FORM_TEST_ALLOW_LINKED_PROJECT=yes.");
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
const storage = createClient(storageUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }).storage;
const rollback = Symbol("form test rollback");
const emailFor = id => `form-test-${id}@example.invalid`;
const slugFor = id => `form-test-${id}`;
const allowedTables = new Set(["public.contact", "public.charter_requests", "public.transportation_requests", "public.boats", "public.partners"]);
const defaultPages = JSON.parse(readFileSync(new URL("../src/content/servicePageContent.json", import.meta.url), "utf8"));

test.after(async () => { await sql.end(); });

async function temporaryRecord(write, verifyRemoved) {
  const id = randomUUID();
  let failure;
  try {
    await sql.begin(async tx => {
      await write(tx, id);
      // postgres.js rolls back the whole transaction when its callback throws.
      throw rollback;
    });
  } catch (error) {
    if (error !== rollback) failure = error;
  }

  // Run this even when an assertion or insert fails, so failed tests also
  // prove that no temporary row survived the rollback.
  try {
    await verifyRemoved(sql, id);
  } catch (cleanupError) {
    if (failure) throw new AggregateError([failure, cleanupError], "Form test failed and cleanup could not be verified");
    throw cleanupError;
  }
  if (failure) throw failure;
}

async function assertMissing(db, table, id) {
  if (!allowedTables.has(table)) throw new Error(`Unexpected table: ${table}`);
  const rows = await db.unsafe(`select id from ${table} where id = $1`, [id]);
  assert.equal(rows.length, 0, `${table} retained test row ${id}`);
}

const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=", "base64");
async function temporaryAsset(bucket, folder) {
  const name = `${randomUUID()}.png`;
  const path = `${folder}/form-tests/${name}`;
  try {
    const { error: uploadError } = await storage.from(bucket).upload(path, tinyPng, { contentType: "image/png", upsert: false });
    assert.ifError(uploadError);
    const { data, error: downloadError } = await storage.from(bucket).download(path);
    assert.ifError(downloadError);
    assert.ok(data && data.size > 0);
  } finally {
    const { error: removeError } = await storage.from(bucket).remove([path]);
    assert.ifError(removeError);
  }
  const { data: remaining, error: listError } = await storage.from(bucket).list(`${folder}/form-tests`, { search: name });
  assert.ifError(listError);
  assert.equal(remaining?.some(item => item.name === name), false, `${bucket} retained ${path}`);
}

async function createBoat(tx, id) {
  const [boat] = await tx`
    insert into public.boats (id, user_id, active, bought, slug)
    values (${id}, ${userId}, false, false, ${slugFor(id)})
    returning id, slug
  `;
  return boat;
}

async function createPartner(tx, id, status = "draft") {
  const [partner] = await tx`
    insert into public.partners (
      id, slug, name, logo_url, breadcrumb_image_url, content,
      form_type, custom_fields, status, show_on_home, show_on_new_yachts
    ) values (
      ${id}, ${slugFor(id)}, 'Form test partner',
      '/assets/images/logo/1.png', '/assets/images/hero/main2.png',
      '<p>Temporary form test partner.</p>', 'standard', '[]'::jsonb,
      ${status}, false, false
    ) returning id, slug, status
  `;
  return partner;
}

test("the test account exists", async () => {
  const rows = await sql`select id from auth.users where id = ${userId}`;
  assert.equal(rows.length, 1, "FORM_TEST_USER_ID must be an account in the test project");
});

test("boat image upload removes its temporary Storage object", async () => {
  await temporaryAsset("boat_images", "form-tests");
});

test("partner image upload removes its temporary Storage object", async () => {
  await temporaryAsset("partner-assets", "form-tests");
});

test("charter and transportation media uploads remove their temporary Storage objects", async () => {
  await temporaryAsset("service-page-media", "charters");
  await temporaryAsset("service-page-media", "transportation");
});

test("contact form saves a message and leaves no entry", async () => {
  await temporaryRecord(async (tx, id) => {
    const [row] = await tx`
      insert into public.contact (id, first_name, last_name, email, phone, message)
      values (${id}, 'Form', 'Test', ${emailFor(id)}, '1234567890', 'Temporary contact message')
      returning id, email, message
    `;
    assert.equal(row.email, emailFor(id));
    assert.equal(row.message, "Temporary contact message");
  }, (db, id) => assertMissing(db, "public.contact", id));
});

test("charter request form saves dates and model and leaves no entry", async () => {
  await temporaryRecord(async (tx, id) => {
    const [row] = await tx`
      insert into public.charter_requests
        (id, name, email, phone, charter_type, date_from, date_to, group_size, note)
      values
        (${id}, 'Form Test', ${emailFor(id)}, '1234567890', 'X-Yachts Xc 47',
         '2027-06-01', '2027-06-08', 4, 'Temporary charter request')
      returning id, charter_type, group_size
    `;
    assert.equal(row.charter_type, "X-Yachts Xc 47");
    assert.equal(row.group_size, 4);
  }, (db, id) => assertMissing(db, "public.charter_requests", id));
});

test("transportation request form saves route and dimensions and leaves no entry", async () => {
  await temporaryRecord(async (tx, id) => {
    const [row] = await tx`
      insert into public.transportation_requests
        (id, name, email, phone, date_start, deadline_date, start_point,
         end_point, boat_weight_kg, boat_length_m, boat_beam_m, boat_draft_m,
         boat_height_m, note)
      values
        (${id}, 'Form Test', ${emailFor(id)}, '1234567890', '2027-06-01',
         '2027-06-08', 'Athens', 'Amsterdam', 5000, 12, 4, 2, 5,
         'Temporary transport request')
      returning id, start_point, end_point, boat_length_m
    `;
    assert.equal(row.start_point, "Athens");
    assert.equal(row.end_point, "Amsterdam");
    assert.equal(Number(row.boat_length_m), 12);
  }, (db, id) => assertMissing(db, "public.transportation_requests", id));
});

test("boat contact form saves its inquiry and leaves no entry", async () => {
  await temporaryRecord(async (tx, id) => {
    await createBoat(tx, id);
    const inquiryId = randomUUID();
    const [row] = await tx`
      insert into public.boat_inquiries
        (id, boat_id, name, email, phone, message, answers, context_name, context_path)
      values
        (${inquiryId}, ${id}, 'Form Test', ${emailFor(id)}, '1234567890',
         'Is this yacht available?', '{}'::jsonb, 'Test yacht', ${`/services/brokerage/${slugFor(id)}`})
      returning boat_id, notification_sent_at
    `;
    assert.equal(row.boat_id, id);
    assert.equal(row.notification_sent_at, null);
  }, async (db, id) => {
    await assertMissing(db, "public.boats", id);
    const rows = await db`select id from public.boat_inquiries where boat_id = ${id}`;
    assert.equal(rows.length, 0);
  });
});

test("partner contact form saves its inquiry and leaves no entry", async () => {
  await temporaryRecord(async (tx, id) => {
    await createPartner(tx, id, "published");
    const inquiryId = randomUUID();
    const [row] = await tx`
      insert into public.partner_inquiries
        (id, partner_id, name, email, phone, message, answers, context_name, context_path)
      values
        (${inquiryId}, ${id}, 'Form Test', ${emailFor(id)}, '1234567890',
         'Please contact me.', '{}'::jsonb, 'Form test partner', ${`/partners/${slugFor(id)}`})
      returning partner_id, notification_sent_at
    `;
    assert.equal(row.partner_id, id);
    assert.equal(row.notification_sent_at, null);
  }, async (db, id) => {
    await assertMissing(db, "public.partners", id);
    const rows = await db`select id from public.partner_inquiries where partner_id = ${id}`;
    assert.equal(rows.length, 0);
  });
});

test("boat upload saves listing details and media records and leaves no entries", async () => {
  await temporaryRecord(async (tx, id) => {
    const brokerId = randomUUID();
    await tx`
      insert into public.broker_data (id, user_id, name, email, dealer)
      values (${brokerId}, ${userId}, 'Test broker', ${emailFor(id)}, 'Form tests')
    `;
    await tx`
      insert into public.boats (id, user_id, active, bought, slug, dealer_id)
      values (${id}, ${userId}, false, false, ${slugFor(id)}, ${brokerId})
    `;
    await tx`
      insert into public.boat_data (
        boat_id, type, condition, keel_type, ce_design_category, material,
        title, manufacturer, build_year, location, description, hull_length,
        beam, draft, displacement, engine_power
      ) values (
        ${id}, 'cruiser', 'pre-owned', 'Fin Keel', 'A - Ocean', 'GRP',
        'Form test yacht', 'Test yard', '2026', 'Athens',
        'Temporary boat upload', 12, 4, 2, 8000, 45
      )
    `;
    await tx`
      update public.broker_data set boat_id = ${id} where id = ${brokerId}
    `;
    await tx`
      insert into public.boat_images (boat_id, link, media_type, is_cover, display_order)
      values (${id}, '/assets/images/charter/xc47-aegean-bay.webp', 'image', true, 0)
    `;
    const [row] = await tx`
      select b.slug, d.title, count(i.id)::int as images
      from public.boats b
      join public.boat_data d on d.boat_id = b.id
      join public.boat_images i on i.boat_id = b.id
      where b.id = ${id}
      group by b.slug, d.title
    `;
    assert.equal(row.slug, slugFor(id));
    assert.equal(row.title, "Form test yacht");
    assert.equal(row.images, 1);
  }, async (db, id) => {
    await assertMissing(db, "public.boats", id);
    const rows = await db`
      select (select count(*)::int from public.boat_data where boat_id = ${id}) as details,
             (select count(*)::int from public.boat_images where boat_id = ${id}) as images,
             (select count(*)::int from public.broker_data where email = ${emailFor(id)}) as brokers
    `;
    assert.deepEqual([rows[0].details, rows[0].images, rows[0].brokers], [0, 0, 0]);
  });
});

test("add partner form saves a draft and leaves no entry", async () => {
  await temporaryRecord(async (tx, id) => {
    const partner = await createPartner(tx, id);
    assert.equal(partner.status, "draft");
    assert.equal(partner.slug, slugFor(id));
  }, (db, id) => assertMissing(db, "public.partners", id));
});

for (const page of ["charters", "transportation"]) {
  test(`${page} page editor saves copy and media changes, then restores the page`, async () => {
    let original;
    await temporaryRecord(async (tx, id) => {
      const [row] = await tx`
        select content, updated_at from public.service_page_content
        where page_key = ${page} for update
      `;
      assert.ok(row, `${page} content must be seeded in the test project`);
      original = row;
      const changed = structuredClone(row.content);
      changed.media ??= structuredClone(defaultPages[page].media);
      if (page === "charters") {
        changed.infoTabs[0].paragraphs[0] += ` Form test ${id}.`;
        changed.media.banner = null;
        changed.media.gallery = [];
      } else {
        changed.sections[0].heading += ` Form test ${id}`;
        changed.media.gallery = [];
      }
      const [saved] = await tx`
        update public.service_page_content set content = ${tx.json(changed)}
        where page_key = ${page} returning content, updated_at
      `;
      assert.deepEqual(saved.content, changed);
      assert.notEqual(saved.updated_at.getTime(), row.updated_at.getTime());
    }, async db => {
      const [row] = await db`
        select content, updated_at from public.service_page_content where page_key = ${page}
      `;
      assert.deepEqual(row.content, original.content, `${page} content was not restored`);
      assert.equal(row.updated_at.getTime(), original.updated_at.getTime());
    });
  });
}
