begin;

-- Workflow fields belong to the account inbox, not to visitor submissions.
alter table public.boat_inquiries
  add column status text not null default 'pending'
    check (status in ('pending', 'completed', 'rejected')),
  add column internal_note text
    check (internal_note is null or length(internal_note) <= 5000);

alter table public.partner_inquiries
  add column status text not null default 'pending'
    check (status in ('pending', 'completed', 'rejected')),
  add column internal_note text
    check (internal_note is null or length(internal_note) <= 5000);

alter table public.charter_requests
  add column internal_note text
    check (internal_note is null or length(internal_note) <= 5000);
alter table public.transportation_requests
  add column internal_note text
    check (internal_note is null or length(internal_note) <= 5000);

-- Preserve the meaning of the earlier workflow values.
update public.charter_requests set status = case
  when status in ('confirmed', 'completed') then 'completed'
  when status in ('cancelled', 'rejected') then 'rejected'
  else 'pending'
end;
update public.transportation_requests set status = case
  when status in ('confirmed', 'completed') then 'completed'
  when status in ('cancelled', 'rejected') then 'rejected'
  else 'pending'
end;
alter table public.charter_requests
  alter column status set default 'pending',
  add constraint charter_requests_status_check check (status in ('pending', 'completed', 'rejected'));
alter table public.transportation_requests
  alter column status set default 'pending',
  add constraint transportation_requests_status_check check (status in ('pending', 'completed', 'rejected'));

-- Boat and partner inquiries are inserted by server routes. Client accounts
-- can update only the workflow fields, never contact or delivery data.
revoke all on public.boat_inquiries, public.partner_inquiries from anon;
revoke insert, update, delete on public.boat_inquiries, public.partner_inquiries from authenticated;
grant select on public.boat_inquiries, public.partner_inquiries to authenticated;
grant update (status, internal_note) on public.boat_inquiries, public.partner_inquiries to authenticated;
create policy "Account users update boat inquiry workflow" on public.boat_inquiries
  for update to authenticated using (true) with check (true);
create policy "Account users update partner inquiry workflow" on public.partner_inquiries
  for update to authenticated using (true) with check (true);

-- Charter and transportation forms write directly with the public client.
-- Column grants allow their visitor fields while withholding workflow fields.
revoke all on public.charter_requests, public.transportation_requests from anon;
revoke insert on public.charter_requests, public.transportation_requests from authenticated;
grant insert (name, email, phone, charter_type, date_from, date_to, group_size, note)
  on public.charter_requests to anon, authenticated;
grant insert (name, email, phone, date_start, deadline_date, start_point, end_point,
  boat_weight_kg, boat_length_m, boat_beam_m, boat_draft_m, boat_height_m, note)
  on public.transportation_requests to anon, authenticated;
create policy "Signed-in visitors submit charter inquiries" on public.charter_requests
  for insert to authenticated with check (true);
create policy "Signed-in visitors submit transportation inquiries" on public.transportation_requests
  for insert to authenticated with check (true);

commit;
