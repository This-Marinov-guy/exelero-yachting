# Exelero Yachting

## Run locally

### Use the existing website accounts and database

Keep `.env.local` configured with the hosted project's `NEXT_PUBLIC_SUPABASE_URL` and public client key in `NEXT_PUBLIC_SUPABASE_ANON_KEY` (this variable also accepts a publishable key). Then run:

```sh
npm ci
npm run dev -- --port 3001
```

Open <http://localhost:3001/sign-in> and use an existing account. Restart the dev server after changing the Supabase connection. The site runs locally and uses the hosted project's data; admin edits affect that project. For email-link login, the hosted Auth redirect allow-list must include `http://localhost:3001/auth/callback`.

### Use a separate local Supabase database

From this directory, use Node.js 24 or newer, npm, Docker, and the Supabase CLI:

```sh
npm ci
supabase start -x realtime,imgproxy,studio,logflare,vector,supavisor,postgres-meta,edge-runtime
supabase db reset --local --no-seed
npm run env:local
npm run dev -- --port 3001
```

Open <http://localhost:3001>. `supabase db reset` applies the checked-in local schema and **erases existing local database data**, so run it only for a fresh setup or when you intend to reset.

`npm run env:local` writes the generated local Supabase API URL, public anon key, and server-only service-role key to Git-ignored `.env.local`. This allows the local inquiry routes to save records while keeping the elevated key out of source control and browser code. The local database starts empty, so the listing page initially shows zero boats. The email notification variables in `.env.example` are optional; without them, email notifications cannot be sent.

The command refuses to overwrite an existing hosted connection. Use `npm run env:local -- --force` only when intentionally switching to the separate local database.

To stop the local services, stop the Next.js process and run `supabase stop`. To restart later, run `supabase start -x realtime,imgproxy,studio,logflare,vector,supavisor,postgres-meta,edge-runtime`, then `npm run dev -- --port 3001`. The public key can change if the local stack is recreated; run `npm run env:local` again in that case.

### Local admin login

Open `/sign-in` directly. Local Supabase accounts are separate from production accounts, and public signup is disabled. A local account must be provisioned through the Supabase admin API before password or email-link login can work. Every authenticated account has admin access.

Local sign-in emails are captured at <http://localhost:54324>; they are not delivered to a real mailbox. Keep the `inbucket` service running for email-link login. The local auth Site URL and callback allow-list include port 3001. The older local Auth server does not support passkeys; use password or email-link login locally.

The homepage, partner navigation, New Yachts, listings, accounts, and forms require Supabase settings and the checked-in migrations. Never put a service-role or secret key in a `NEXT_PUBLIC_` variable or commit `.env.local`.

See [Partners and New Yachts administration](docs/partners-admin.md) for admin access, migration, form configuration, sitemap automation, and local verification.

See [Tracking administration](docs/tracking-admin.md) to connect GA4 traffic and Search Console reports at `/account?tab=tracking`.

See [Form tests](docs/form-tests.md) for browser checks with mocked writes and rollback-only database checks.
