-- Public editorial translations. English remains in the existing columns.
-- Each locale stores an object with translated text fields from that row.
alter table public.boat_data
  add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.partners
  add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.service_page_content
  add column if not exists translations jsonb not null default '{}'::jsonb;

comment on column public.boat_data.translations is 'Locale objects (ro, bg, sr) for title, description, location and additional_details.';
comment on column public.partners.translations is 'Locale objects (ro, bg, sr) for content and custom_fields.';
comment on column public.service_page_content.translations is 'Locale objects (ro, bg, sr), each containing translated content.';
