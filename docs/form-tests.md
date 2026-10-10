# Form persistence tests

The form tests cover the records written by the Contact, Charter request,
Transportation request, Boat inquiry, Partner inquiry, Upload boat, Add partner,
Charter content, and Transportation content forms. They also upload a tiny image
to the boat, partner, and service-page Storage buckets.

The tests use direct database writes instead of submitting through the website.
They therefore check persistence and media storage, but do not check browser
interaction or HTTP route behavior. They never call the application's mail,
notification, analytics, or sitemap code.

`npm run test:forms:validation` runs the Boat and Partner inquiry field checks
without a database or test credentials.

`npm run test:forms:browser` runs the Contact, Charter, Transportation, Boat
inquiry, and Partner inquiry forms in Chrome against a local dev server at
`http://127.0.0.1:3001`. The browser tests need one active boat and one
published partner to be visible on the site.
Start the server first with `npm run dev -- --port 3001`. The browser tests
intercept every form write and `/api/notify`; they assert the submitted payload
but create no database entry and send no email. Set `FORM_TEST_BASE_URL` if the
server uses another port.

## Setup

1. Create a separate Supabase test project with the current application schema,
   migrations, and the `boat_images`, `partner-assets`, and `service-page-media`
   Storage buckets. The hosted project's older schema has some legacy changes
   outside the current Supabase migration history, so a schema clone is safer
   than replaying only the checked-in migrations.
2. Create an account in that project for the boat listing foreign key.
3. Copy `.env.form-test.example` to `.env.form-test.local` and fill in the test
   project's database URL, API URL, service-role key, and account UUID. The file
   is Git-ignored. The runner checks that the database and API URL refer to the
   same project. If it matches the website's linked project, the runner refuses
   to run unless `FORM_TEST_ALLOW_LINKED_PROJECT=yes` is set explicitly.
4. Run `npm run test:forms` with Node.js 24 or newer.

Each database case runs in a transaction that is **always rolled back**, even
when an assertion fails. After the rollback, the test verifies that its records
are absent. The page-editor cases verify that the original content and
`updated_at` were restored. Storage objects cannot be rolled back by Postgres;
the tests remove them in `finally` and verify that they are gone. If a process
is killed during a Storage upload, check the `form-tests/` folders in the three
buckets for an orphaned object.

The tests are intentionally not part of `npm run build` or `npm run lint`; they
write temporary data and require an explicitly configured test project.
