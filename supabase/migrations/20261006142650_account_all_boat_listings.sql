begin;

-- The account is an invitation-only site admin. Public visitors still see
-- only active, available boats through the existing public policy.
create policy "Account users view all boats" on public.boats
  for select to authenticated using (true);
create policy "Account users update all boats" on public.boats
  for update to authenticated using (true) with check (true);
create policy "Account users delete all boats" on public.boats
  for delete to authenticated using (true);

-- Keep listing ownership stable even when another account edits visibility.
revoke update on public.boats from authenticated;
grant update (active, bought, slug, dealer_id) on public.boats to authenticated;

create policy "Account users update all boat details" on public.boat_data
  for update to authenticated using (true) with check (true);
create policy "Account users add boat media" on public.boat_images
  for insert to authenticated with check (true);
create policy "Account users update boat media" on public.boat_images
  for update to authenticated using (true) with check (true);
create policy "Account users delete boat media" on public.boat_images
  for delete to authenticated using (true);

-- Deleting a boat detaches its dealer first so the dealer record survives.
create policy "Account users view all listing dealers" on public.broker_data
  for select to authenticated using (true);
create policy "Account users unlink listing dealers" on public.broker_data
  for update to authenticated using (true) with check (true);

commit;
