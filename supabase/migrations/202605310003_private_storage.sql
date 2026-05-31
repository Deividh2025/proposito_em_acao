-- Proposito em Acao - private storage buckets and object RLS.
-- Buckets are private by default. Atalaia file access must be mediated later
-- by server-side signed URLs tied to explicit grants and previews.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'user-uploads',
    'user-uploads',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
  ),
  (
    'inbox-attachments',
    'inbox-attachments',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
  ),
  (
    'commitment-documents',
    'commitment-documents',
    false,
    10485760,
    array['application/pdf', 'text/plain']
  )
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists storage_private_owner_select on storage.objects;
create policy storage_private_owner_select
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('user-uploads', 'inbox-attachments', 'commitment-documents')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists storage_private_owner_insert on storage.objects;
create policy storage_private_owner_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('user-uploads', 'inbox-attachments', 'commitment-documents')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists storage_private_owner_update on storage.objects;
create policy storage_private_owner_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('user-uploads', 'inbox-attachments', 'commitment-documents')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id in ('user-uploads', 'inbox-attachments', 'commitment-documents')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists storage_private_owner_delete on storage.objects;
create policy storage_private_owner_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('user-uploads', 'inbox-attachments', 'commitment-documents')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
