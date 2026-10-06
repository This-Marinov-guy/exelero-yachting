-- Accounts are invitation-only. Every authenticated account can manage the site.
-- Supabase permits CREATE/DROP POLICY on managed Storage tables, but policy
-- renames still require table ownership. Replace both possible names so this
-- also works after a partially applied SQL Editor run or an earlier local run.
-- The DO block makes the replacements atomic even outside the migration CLI.
do $migration$
begin
  drop policy if exists "Admins view all partners" on public.partners;
  drop policy if exists "Account users view all partners" on public.partners;
  create policy "Account users view all partners" on public.partners
    for select to authenticated using (true);

  drop policy if exists "Admins create partners" on public.partners;
  drop policy if exists "Account users create partners" on public.partners;
  create policy "Account users create partners" on public.partners
    for insert to authenticated with check (true);

  drop policy if exists "Admins update partners" on public.partners;
  drop policy if exists "Account users update partners" on public.partners;
  create policy "Account users update partners" on public.partners
    for update to authenticated using (true) with check (true);

  drop policy if exists "Admins view partner inquiries" on public.partner_inquiries;
  drop policy if exists "Account users view partner inquiries" on public.partner_inquiries;
  create policy "Account users view partner inquiries" on public.partner_inquiries
    for select to authenticated using (true);

  drop policy if exists "Admins upload partner assets" on storage.objects;
  drop policy if exists "Account users upload partner assets" on storage.objects;
  create policy "Account users upload partner assets" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'partner-assets');
end
$migration$;
