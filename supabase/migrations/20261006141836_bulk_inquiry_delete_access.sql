begin;

-- Accounts are invitation-only. Keep visitor inquiry data inaccessible to anon.
grant delete on public.boat_inquiries, public.partner_inquiries to authenticated;

create policy "Account users delete boat inquiries" on public.boat_inquiries
  for delete to authenticated using (true);
create policy "Account users delete partner inquiries" on public.partner_inquiries
  for delete to authenticated using (true);

commit;
