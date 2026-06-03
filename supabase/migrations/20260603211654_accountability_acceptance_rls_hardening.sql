-- Proposito em Acao - Etapa 2 hardening for Atalaia invite acceptance.
-- The invitee may preview a pending invite by authenticated e-mail, but direct
-- RLS updates cannot activate grants or alter owner-reviewed scope. Acceptance
-- and revocation are handled by server-side actions that validate token, e-mail,
-- owner, partner and grant identity before using the service role.

alter table public.accountability_grants
  add column if not exists invite_token_hash text;

-- Backfill only unambiguous legacy invites: one pending grant for one pending
-- partner invite. Ambiguous legacy partner invites without grant hash must be
-- expired/reissued by an operator in preview before beta.
update public.accountability_grants grants
set invite_token_hash = partners.invite_token_hash
from public.accountability_partners partners
where partners.id = grants.accountability_partner_id
  and partners.user_id = grants.user_id
  and partners.status = 'invited'
  and partners.partner_user_id is null
  and partners.revoked_at is null
  and partners.invite_token_hash is not null
  and partners.invite_expires_at > now()
  and grants.status = 'invited'
  and grants.revoked_at is null
  and grants.invite_token_hash is null
  and not exists (
    select 1
    from public.accountability_grants sibling_grants
    where sibling_grants.accountability_partner_id = grants.accountability_partner_id
      and sibling_grants.user_id = grants.user_id
      and sibling_grants.id <> grants.id
      and sibling_grants.status = 'invited'
      and sibling_grants.revoked_at is null
      and sibling_grants.invite_token_hash is null
  );

create unique index if not exists idx_accountability_grants_invite_token_hash
  on public.accountability_grants (invite_token_hash)
  where invite_token_hash is not null;

alter table public.accountability_grants
  drop constraint if exists accountability_grants_token_only_while_invited;

alter table public.accountability_grants
  add constraint accountability_grants_token_only_while_invited
  check (invite_token_hash is null or status = 'invited');

create or replace function app_private.has_active_accountability_grant(
  target_user_id uuid,
  target_goal_id uuid,
  required_permission text default null
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
    join public.accountability_partners partners
      on partners.id = grants.accountability_partner_id
     and partners.user_id = grants.user_id
    where grants.user_id = target_user_id
      and grants.goal_id = target_goal_id
      and grants.status = 'active'
      and grants.revoked_at is null
      and (grants.expires_at is null or grants.expires_at > now())
      and partners.status = 'active'
      and partners.revoked_at is null
      and partners.partner_user_id = (select auth.uid())
      and (
        required_permission is null
        or grants.permissions @> jsonb_build_object(required_permission, true)
      )
  );
$$;

revoke all on function app_private.has_active_accountability_grant(uuid, uuid, text) from public;
grant execute on function app_private.has_active_accountability_grant(uuid, uuid, text) to authenticated;

create or replace function app_private.assert_accountability_partner_acceptance_scope_immutable()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if old.user_id = (select auth.uid()) then
    return new;
  end if;

  if not (old.status = 'invited' and new.status = 'active') then
    raise exception 'Atalaia can only accept a pending partner invite.';
  end if;

  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.email is distinct from old.email
    or new.relationship_label is distinct from old.relationship_label
    or new.invited_at is distinct from old.invited_at
    or new.invite_expires_at is distinct from old.invite_expires_at
    or new.revoked_at is distinct from old.revoked_at
    or new.created_at is distinct from old.created_at then
    raise exception 'Atalaia cannot alter invite scope during acceptance.';
  end if;

  if old.partner_user_id is not null
    or new.partner_user_id is distinct from (select auth.uid()) then
    raise exception 'Atalaia acceptance must bind the authenticated user.';
  end if;

  if old.invite_token_hash is null or new.invite_token_hash is not null then
    raise exception 'Atalaia acceptance must consume an existing invite token.';
  end if;

  if new.accepted_at is null then
    raise exception 'Atalaia acceptance must record accepted_at.';
  end if;

  if lower(coalesce(new.email, '')) <> lower(coalesce(auth.jwt() ->> 'email', '')) then
    raise exception 'Atalaia acceptance e-mail does not match the authenticated user.';
  end if;

  return new;
end;
$$;

create or replace function app_private.assert_accountability_grant_acceptance_scope_immutable()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if old.user_id = (select auth.uid()) then
    return new;
  end if;

  if not (old.status = 'invited' and new.status = 'active') then
    raise exception 'Atalaia can only activate a pending grant.';
  end if;

  if new.user_id is distinct from old.user_id
    or new.goal_id is distinct from old.goal_id
    or new.accountability_partner_id is distinct from old.accountability_partner_id
    or new.permissions is distinct from old.permissions
    or new.sharing_permissions is distinct from old.sharing_permissions
    or new.tracking_level is distinct from old.tracking_level
    or new.notification_frequency is distinct from old.notification_frequency
    or new.consent_version is distinct from old.consent_version
    or new.consent_recorded_at is distinct from old.consent_recorded_at
    or new.expires_at is distinct from old.expires_at then
    raise exception 'Atalaia cannot alter grant scope during acceptance.';
  end if;

  if old.invite_token_hash is null or new.invite_token_hash is not null then
    raise exception 'Atalaia acceptance must consume the reviewed grant token.';
  end if;

  if new.accepted_at is null
    or new.revoked_at is not null
    or new.revoked_reason is distinct from old.revoked_reason then
    raise exception 'Atalaia grant acceptance can only activate the reviewed grant.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_accountability_partner_acceptance_scope_immutable
  on public.accountability_partners;
create trigger trg_accountability_partner_acceptance_scope_immutable
  before update on public.accountability_partners
  for each row execute function app_private.assert_accountability_partner_acceptance_scope_immutable();

drop trigger if exists trg_accountability_grant_acceptance_scope_immutable
  on public.accountability_grants;
create trigger trg_accountability_grant_acceptance_scope_immutable
  before update on public.accountability_grants
  for each row execute function app_private.assert_accountability_grant_acceptance_scope_immutable();

drop policy if exists accountability_partners_invitee_select_pending on public.accountability_partners;
create policy accountability_partners_invitee_select_pending
  on public.accountability_partners for select
  to authenticated
  using (
    status = 'invited'
    and partner_user_id is null
    and revoked_at is null
    and invite_token_hash is not null
    and invite_expires_at > now()
    and lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists accountability_partners_partner_select_active on public.accountability_partners;
create policy accountability_partners_partner_select_active
  on public.accountability_partners for select
  to authenticated
  using (
    status = 'active'
    and revoked_at is null
    and accepted_at is not null
    and partner_user_id = (select auth.uid())
    and exists (
      select 1
      from public.accountability_grants grants
      where grants.accountability_partner_id = accountability_partners.id
        and grants.user_id = accountability_partners.user_id
        and grants.status = 'active'
        and grants.revoked_at is null
        and (grants.expires_at is null or grants.expires_at > now())
    )
  );

drop policy if exists accountability_partners_invitee_accept_pending on public.accountability_partners;

drop policy if exists accountability_grants_invitee_accept_pending on public.accountability_grants;

-- No Atalaia policy is added for callings, metacognition_sessions,
-- weekly_reviews, inbox_items, calendar_blocks, focus_distractions,
-- audit_events, ai_run_audits, or other private base tables.
