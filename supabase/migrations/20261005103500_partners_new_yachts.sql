alter table public.partners
  add column show_on_new_yachts boolean not null default false;

update public.partners set show_on_new_yachts = true
where slug in ('x-yachts', 'omaya-yachts');

create index partners_new_yachts_order_idx on public.partners (sort_order, name)
  where status = 'published' and show_on_new_yachts;
