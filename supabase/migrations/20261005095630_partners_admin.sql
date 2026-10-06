create table public.partners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(trim(name)) > 0),
  logo_url text not null default '',
  breadcrumb_image_url text not null default '',
  hero_image_url text,
  content text not null default '',
  website_url text,
  primary_color text not null default '#1a1a1a',
  secondary_color text not null default '#ffffff',
  form_type text not null default 'standard' check (form_type in ('standard', 'custom')),
  custom_fields jsonb not null default '[]'::jsonb check (jsonb_typeof(custom_fields) = 'array'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  show_on_home boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_partner_complete check (
    status = 'draft' or (
      length(trim(logo_url)) > 0 and
      length(trim(breadcrumb_image_url)) > 0 and
      length(trim(content)) > 0
    )
  )
);

create index partners_public_order_idx on public.partners (sort_order, name)
  where status = 'published';
create index partners_home_order_idx on public.partners (sort_order, name)
  where status = 'published' and show_on_home;

create function public.touch_partner_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger partners_updated_at before update on public.partners
for each row execute function public.touch_partner_updated_at();

alter table public.partners enable row level security;
grant select on public.partners to anon, authenticated;
grant insert, update on public.partners to authenticated;

create policy "Public views published partners" on public.partners
  for select to anon, authenticated using (status = 'published');
create policy "Admins view all partners" on public.partners
  for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins create partners" on public.partners
  for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins update partners" on public.partners
  for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table public.partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete restrict,
  name text not null,
  email text not null,
  phone text,
  message text,
  answers jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object'),
  created_at timestamptz not null default now()
);

create index partner_inquiries_partner_created_idx
  on public.partner_inquiries (partner_id, created_at desc);

alter table public.partner_inquiries enable row level security;
grant insert on public.partner_inquiries to anon, authenticated;
grant select on public.partner_inquiries to authenticated;

create policy "Visitors submit partner inquiries" on public.partner_inquiries
  for insert to anon, authenticated
  with check (exists (
    select 1 from public.partners p
    where p.id = partner_id and p.status = 'published'
  ));
create policy "Admins view partner inquiries" on public.partner_inquiries
  for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'partner-assets', 'partner-assets', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Public reads partner assets" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'partner-assets');
create policy "Admins upload partner assets" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'partner-assets' and
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

insert into public.partners (
  slug, name, logo_url, breadcrumb_image_url, hero_image_url, content,
  website_url, primary_color, secondary_color, status, show_on_home, sort_order
) values
  ('x-yachts', 'X-Yachts', '/assets/images/logo/x-yachts-transparant.png', '/assets/images/breadcrumbs/x-yachts.jpg', '/assets/images/hero/x-yachts.jpg', 'X-Yachts is a Danish yacht manufacturer known for producing high-performance sailing yachts. With over 40 years of experience, X-Yachts combines Scandinavian design with cutting-edge technology to create exceptional sailing vessels.', 'https://www.x-yachts.com', '#1a1a1a', '#ffffff', 'published', true, 1),
  ('omaya-yachts', 'Omaya Yachts', '/assets/images/logo/omaya-transparent.png', '/assets/images/breadcrumbs/omaya-yachts.jpg', '/assets/images/hero/omaya-yachts.jpg', 'Omaya Yachts specializes in luxury yacht design and manufacturing, creating bespoke vessels that combine elegance with exceptional performance. Each yacht is crafted with meticulous attention to detail and the finest materials.', 'https://www.omaya-yachts.com', '#0a4d68', '#ffffff', 'published', true, 2),
  ('elvstrom', 'Elvstrom', '/assets/images/logo/elvstrom.png', '/assets/images/breadcrumbs/elvstrom.jpg', '/assets/images/hero/elvstrom.jpg', 'Elvstrom is a leading manufacturer of premium sailing equipment and hardware. With a legacy of innovation and quality, Elvstrom provides sailors worldwide with top-tier products for optimal performance on the water.', 'https://www.elvstrom.com', '#003366', '#ffffff', 'published', true, 3),
  ('zhik', 'Zhik', '/assets/images/logo/zhik.svg', '/assets/images/breadcrumbs/zhik.jpg', '/assets/images/hero/zhik.jpg', 'Zhik designs high-performance sailing apparel and technical gear trusted by sailors worldwide — engineered for comfort, durability, and speed in all conditions.', 'https://zhik.com', '#000000', '#ffffff', 'published', true, 4),
  ('spinlock', 'Spinlock', '/assets/images/logo/spinlock.svg', '/assets/images/breadcrumbs/spinklock.jpg', '/assets/images/breadcrumbs/spinklock.jpg', 'Spinlock designs sailing hardware and safety equipment, including clutches, cleats, lifejackets and harnesses for life on the water.', 'https://www.spinlock.co.uk/en-GB/uk', '#231f20', '#ffffff', 'published', true, 5),
  ('u-dek', 'U-DEK', '/assets/images/logo/udeck.png', '/assets/images/breadcrumbs/udeck.jpg', '/assets/images/breadcrumbs/udeck.jpg', 'U-DEK creates custom marine foam decking for sailing yachts, motor yachts and smaller craft, combining comfort underfoot with grip and easy care.', 'https://udek.com/eu/', '#006f9d', '#ffffff', 'published', true, 6),
  ('elvstrom-sailwear', 'Elvstrom SailWear', '/assets/images/logo/elvstrom-sailwear.webp', '/assets/images/breadcrumbs/evs-sailwear.jpg', '/assets/images/hero/elvstrom.jpg', 'Elvstrom SailWear offers premium sailing apparel and gear designed for performance and comfort. Combining technical innovation with stylish design, Elvstrom SailWear provides sailors with high-quality clothing that stands up to the demands of competitive sailing and cruising.', 'https://www.elvstrom.com', '#003366', '#ffffff', 'published', false, 7)
on conflict (slug) do nothing;
