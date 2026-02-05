-- 009_create_transportation_requests.sql
-- Transportation lead form storage

begin;

create table if not exists public.transportation_requests (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  name           text not null,
  email          text not null,
  phone          text,

  date_start     date not null,
  deadline_date  date not null,

  start_point    text,
  end_point      text,

  boat_weight_kg numeric,
  boat_length_m  numeric,
  boat_beam_m    numeric,
  boat_draft_m   numeric,
  boat_height_m  numeric,

  note           text,
  status         text not null default 'new'
);

alter table public.transportation_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'transportation_requests'
      and policyname = 'transportation_requests_insert_anon'
  ) then
    create policy transportation_requests_insert_anon
      on public.transportation_requests
      for insert
      to anon
      with check (true);
  end if;
end
$$;

commit;

