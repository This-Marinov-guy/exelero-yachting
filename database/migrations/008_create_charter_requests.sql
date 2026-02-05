-- 008_create_charter_requests.sql
-- Charter lead form storage

begin;

create table if not exists public.charter_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  name         text not null,
  email        text not null,
  phone        text,

  charter_type text not null check (charter_type in ('cruiser', 'power_boat', 'racer', 'yacht')),
  date_from    date not null,
  date_to      date not null,

  group_size   integer not null check (group_size > 0),
  note         text,
  status       text not null default 'new'
);

alter table public.charter_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'charter_requests'
      and policyname = 'charter_requests_insert_anon'
  ) then
    create policy charter_requests_insert_anon
      on public.charter_requests
      for insert
      to anon
      with check (true);
  end if;
end
$$;

commit;

