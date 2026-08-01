-- Public image bucket for CMS uploads (run in Supabase SQL Editor)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = true;

create policy "cms_media_public_read"
on storage.objects for select
using (bucket_id = 'cms-media');

create policy "cms_media_auth_upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'cms-media');

create policy "cms_media_auth_update"
on storage.objects for update
to authenticated
using (bucket_id = 'cms-media');

create policy "cms_media_auth_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'cms-media');
