-- Proposito em Acao - Fix accountability RLS policy infinite recursion.
-- Creates a security definer helper to query accountability_grants, breaking the circular dependency.

create or replace function app_private.has_active_grant_for_partner(
  target_partner_id uuid,
  target_user_id uuid
)
returns boolean
language sql
security definer
stable
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.accountability_grants grants
    where grants.accountability_partner_id = target_partner_id
      and grants.user_id = target_user_id
      and grants.status = 'active'
      and grants.revoked_at is null
      and (grants.expires_at is null or grants.expires_at > now())
  );
$$;

revoke all on function app_private.has_active_grant_for_partner(uuid, uuid) from public;
grant execute on function app_private.has_active_grant_for_partner(uuid, uuid) to authenticated;

-- Drop and recreate the SELECT policy on accountability_partners to use the helper.
drop policy if exists accountability_partners_partner_select_active on public.accountability_partners;
create policy accountability_partners_partner_select_active
  on public.accountability_partners for select
  to authenticated
  using (
    status = 'active'
    and revoked_at is null
    and accepted_at is not null
    and partner_user_id = (select auth.uid())
    and app_private.has_active_grant_for_partner(id, user_id)
  );
