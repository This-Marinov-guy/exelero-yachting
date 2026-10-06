-- Public inquiries are submitted through server routes. Contact details must
-- never be readable or writable directly by anonymous API clients.
create table public.boat_inquiries (
  id uuid primary key default gen_random_uuid(),
  boat_id uuid references public.boats(id) on delete set null,
  name text not null check (length(trim(name)) between 1 and 120),
  email text not null check (length(email) between 3 and 254),
  phone text check (phone is null or length(phone) <= 50),
  message text not null check (length(trim(message)) between 1 and 3000),
  answers jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object'),
  context_name text not null,
  context_path text not null,
  notification_delivered_to text[] not null default '{}',
  notification_sent_at timestamptz,
  notification_lock_until timestamptz,
  created_at timestamptz not null default now()
);

create index boat_inquiries_boat_created_idx on public.boat_inquiries (boat_id, created_at desc);
alter table public.boat_inquiries enable row level security;
revoke all on public.boat_inquiries from anon, authenticated;
grant select on public.boat_inquiries to authenticated;
grant all on public.boat_inquiries to service_role;
-- Accounts are invitation-only; every authenticated account manages the site.
create policy "Account users view boat inquiries" on public.boat_inquiries
  for select to authenticated using (true);

alter table public.partner_inquiries
  add column context_name text,
  add column context_path text,
  add column notification_delivered_to text[] not null default '{}',
  add column notification_sent_at timestamptz,
  add column notification_lock_until timestamptz;

-- Keep historical custom answers intact. Future submissions always store the
-- four contact fields separately, with any additional answers in answers.
revoke insert on public.partner_inquiries from anon, authenticated;
drop policy if exists "Visitors submit partner inquiries" on public.partner_inquiries;
grant all on public.partner_inquiries to service_role;
