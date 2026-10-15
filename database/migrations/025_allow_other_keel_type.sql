-- Legacy SQL Editor migration for installations using database/migrations.
begin;

alter table public.boat_data
  drop constraint if exists boat_data_keel_type_check;
alter table public.boat_data
  add constraint boat_data_keel_type_check
  check (keel_type in ('Fin Keel', 'Bulb Keel', 'Winged keel', 'Long keel', 'Bilge Keel', 'Keel Sword', 'Canting Keel', 'Swiveling Keel', 'Lifting Keel', 'Other'));

alter table public.boat_drafts
  drop constraint if exists boat_drafts_keel_type_check;
alter table public.boat_drafts
  add constraint boat_drafts_keel_type_check
  check (keel_type is null or keel_type in ('Fin Keel', 'Bulb Keel', 'Winged keel', 'Long keel', 'Bilge Keel', 'Keel Sword', 'Canting Keel', 'Swiveling Keel', 'Lifting Keel', 'Other')) not valid;

commit;
