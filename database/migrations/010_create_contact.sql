-- 010_create_contact.sql
-- Contact form submissions (website contact form)

begin;

create table if not exists public.contact (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text not null,
  last_name  text not null,
  email      text not null,
  phone      text not null,
  message    text not null
);

-- Optional: index for listing by date
create index if not exists contact_created_at_idx on public.contact (created_at desc);

alter table public.contact enable row level security;

-- Allow anonymous inserts from the contact form (via API using anon key)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact'
      and policyname = 'contact_insert_anon'
  ) then
    create policy contact_insert_anon
      on public.contact
      for insert
      to anon
      with check (true);
  end if;
end
$$;

commit;
