-- Public page media is readable by visitors; only signed-in account users can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-page-media', 'service-page-media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
)
on conflict (id) do nothing;

create policy "Account users upload service page media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'service-page-media'
    and (storage.foldername(name))[1] in ('charters', 'transportation')
    and coalesce(auth.jwt() ->> 'is_anonymous', 'false') <> 'true'
  );
