# Exelero Yachting

## Run locally

From this directory, use Node.js 20 or newer, npm, Docker, and the Supabase CLI:

```sh
npm ci
supabase start -x realtime,imgproxy,studio,logflare,vector,inbucket,supavisor,postgres-meta,edge-runtime
supabase db reset --local --no-seed
npm run env:local
npm run dev -- --port 3003
```

Open <http://localhost:3003>. Ports 3000–3002 were already in use on this machine. `supabase db reset` applies the checked-in local schema and **erases existing local database data**, so run it only for a fresh setup or when you intend to reset.

`npm run env:local` writes only the generated local Supabase API URL and public anon key to Git-ignored `.env.local`. It does not copy the service-role key. The local database starts empty, so the listing page initially shows zero boats. The email notification variables in `.env.example` are optional; without them, email notifications cannot be sent.

To stop the local services, stop the Next.js process and run `supabase stop`. To restart later, run `supabase start -x realtime,imgproxy,studio,logflare,vector,inbucket,supavisor,postgres-meta,edge-runtime`, then `npm run dev -- --port 3003`. The public key can change if the local stack is recreated; run `npm run env:local` again in that case.

The homepage can render without Supabase settings, but listings, accounts, and forms need them. Never put a service-role or secret key in a `NEXT_PUBLIC_` variable or commit `.env.local`.
