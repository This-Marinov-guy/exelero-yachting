-- Accounts are invitation-only; every authenticated account manages inquiries.
-- Anonymous visitors retain only their existing submission policies.
begin;
grant select, update, delete on public.charter_requests, public.transportation_requests to authenticated;
drop policy if exists "Account users view charter inquiries" on public.charter_requests;
create policy "Account users view charter inquiries" on public.charter_requests for select to authenticated using (true);
drop policy if exists "Account users update charter inquiries" on public.charter_requests;
create policy "Account users update charter inquiries" on public.charter_requests for update to authenticated using (true) with check (true);
drop policy if exists "Account users delete charter inquiries" on public.charter_requests;
create policy "Account users delete charter inquiries" on public.charter_requests for delete to authenticated using (true);
drop policy if exists "Account users view transportation inquiries" on public.transportation_requests;
create policy "Account users view transportation inquiries" on public.transportation_requests for select to authenticated using (true);
drop policy if exists "Account users update transportation inquiries" on public.transportation_requests;
create policy "Account users update transportation inquiries" on public.transportation_requests for update to authenticated using (true) with check (true);
drop policy if exists "Account users delete transportation inquiries" on public.transportation_requests;
create policy "Account users delete transportation inquiries" on public.transportation_requests for delete to authenticated using (true);
commit;
