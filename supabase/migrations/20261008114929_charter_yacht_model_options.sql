-- Accept the yacht models offered in the charter form while retaining
-- category values already stored on historical inquiries.
alter table public.charter_requests
  drop constraint if exists charter_requests_charter_type_check;

alter table public.charter_requests
  add constraint charter_requests_charter_type_check
  check (charter_type in (
    'cruiser',
    'power_boat',
    'racer',
    'yacht',
    'X-Yachts Xc 47',
    'X-Yachts X4⁶',
    'X-Yachts X4³',
    'X-Yachts X4⁰',
    'X-Yachts XR 41',
    'X-Yachts Xp 44',
    'X-Power 33c'
  ));
