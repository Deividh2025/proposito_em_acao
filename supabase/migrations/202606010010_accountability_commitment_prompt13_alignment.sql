-- Proposito em Acao - Prompt 13 accountability, commitment and notification alignment.
-- This migration extends the Prompt 4 accountability foundation without opening
-- partner access to sensitive base tables.

alter table public.accountability_partners
  add column if not exists relationship_label text,
  add column if not exists invite_token_hash text,
  add column if not exists invite_expires_at timestamptz,
  add column if not exists last_invite_previewed_at timestamptz;

alter table public.accountability_grants
  add column if not exists tracking_level text not null default 'balanced'
    check (tracking_level in ('light', 'balanced', 'firm')),
  add column if not exists notification_frequency text not null default 'weekly'
    check (notification_frequency in ('milestones_only', 'weekly', 'important_events', 'paused')),
  add column if not exists consent_version text not null default 'accountability_prompt13_v1',
  add column if not exists consent_recorded_at timestamptz,
  add column if not exists last_previewed_at timestamptz,
  add column if not exists sharing_permissions jsonb not null default '[]'::jsonb;

alter table public.accountability_notifications
  add column if not exists provider_status text not null default 'pending_provider_config'
    check (provider_status in ('pending_provider_config', 'queued', 'sent', 'blocked', 'cancelled')),
  add column if not exists template_key text,
  add column if not exists template_version text,
  add column if not exists scheduled_for timestamptz,
  add column if not exists blocked_reason text,
  add column if not exists privacy_check jsonb not null default '{}'::jsonb;

alter table public.commitment_documents
  add column if not exists schema_version text not null default 'commitment_document_output_v1',
  add column if not exists structured_content jsonb not null default '{}'::jsonb,
  add column if not exists sharing_permissions jsonb not null default '[]'::jsonb,
  add column if not exists privacy_check jsonb not null default '{}'::jsonb,
  add column if not exists reviewed_at timestamptz,
  add column if not exists shared_at timestamptz,
  add column if not exists consent_version text;

alter table public.commitment_levers
  add column if not exists lever_subtype text,
  add column if not exists safety_status text not null default 'safe'
    check (safety_status in ('safe', 'needs_review', 'blocked')),
  add column if not exists safety_notes jsonb not null default '[]'::jsonb,
  add column if not exists reviewed_at timestamptz;

create unique index if not exists idx_accountability_partners_invite_token_hash
  on public.accountability_partners (invite_token_hash)
  where invite_token_hash is not null;

alter table public.accountability_partners
  drop constraint if exists accountability_partners_token_requires_expiry;

alter table public.accountability_partners
  add constraint accountability_partners_token_requires_expiry
  check (invite_token_hash is null or invite_expires_at is not null);

create index if not exists idx_accountability_grants_prompt13_scope
  on public.accountability_grants (user_id, goal_id, tracking_level, notification_frequency, status, revoked_at);

create index if not exists idx_accountability_notifications_provider_status
  on public.accountability_notifications (user_id, provider_status, status, scheduled_for);

alter table public.accountability_notifications
  drop constraint if exists accountability_notifications_no_private_payload_keys;

alter table public.accountability_notifications
  add constraint accountability_notifications_no_private_payload_keys
  check (
    not (
      preview_payload ?| array[
        'raw_prompt',
        'raw_response',
        'raw_thought',
        'metacognition',
        'full_calling',
        'health',
        'family',
        'finances',
        'emotions',
        'private_weekly_review',
        'raw_inbox',
        'full_calendar'
      ]
    )
  );

alter table public.accountability_events
  drop constraint if exists accountability_events_no_private_metadata_keys;

alter table public.accountability_events
  add constraint accountability_events_no_private_metadata_keys
  check (
    not (
      metadata_minimal ?| array[
        'raw_prompt',
        'raw_response',
        'raw_thought',
        'metacognition',
        'full_calling',
        'health',
        'family',
        'finances',
        'emotions',
        'private_weekly_review',
        'raw_inbox',
        'full_calendar'
      ]
    )
  );

alter table public.commitment_documents
  drop constraint if exists commitment_documents_no_private_structured_keys;

alter table public.commitment_documents
  add constraint commitment_documents_no_private_structured_keys
  check (
    not (
      structured_content ?| array[
        'raw_prompt',
        'raw_response',
        'raw_thought',
        'metacognition',
        'full_calling',
        'health',
        'family',
        'finances',
        'emotions',
        'private_weekly_review',
        'raw_inbox',
        'full_calendar'
      ]
    )
  );

alter table public.commitment_documents
  drop constraint if exists commitment_documents_shared_requires_review;

alter table public.commitment_documents
  add constraint commitment_documents_shared_requires_review
  check (
    shared_with_atalaias = false
    or (
      status = 'active'
      and reviewed_at is not null
      and shared_at is not null
      and consent_version is not null
    )
  );

-- Partner policies remain limited to accountability rows and shared commitment
-- rows from the baseline migration. No policy is added for goals, tasks,
-- habits, scoreboard raw tables, weekly_reviews, garden, metacognition,
-- calendar_blocks, inbox_items or focus_distractions.

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

drop policy if exists accountability_partners_invitee_accept_pending on public.accountability_partners;
create policy accountability_partners_invitee_accept_pending
  on public.accountability_partners for update
  to authenticated
  using (
    status = 'invited'
    and partner_user_id is null
    and revoked_at is null
    and invite_token_hash is not null
    and invite_expires_at > now()
    and lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (
    status = 'active'
    and partner_user_id = (select auth.uid())
    and revoked_at is null
    and accepted_at is not null
    and invite_token_hash is null
    and lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists accountability_grants_invitee_accept_pending on public.accountability_grants;
create policy accountability_grants_invitee_accept_pending
  on public.accountability_grants for update
  to authenticated
  using (
    status = 'invited'
    and revoked_at is null
    and exists (
      select 1
      from public.accountability_partners partners
      where partners.id = accountability_grants.accountability_partner_id
        and partners.user_id = accountability_grants.user_id
        and partners.partner_user_id = (select auth.uid())
        and partners.status = 'active'
        and partners.revoked_at is null
    )
  )
  with check (
    status = 'active'
    and accepted_at is not null
    and revoked_at is null
    and exists (
      select 1
      from public.accountability_partners partners
      where partners.id = accountability_grants.accountability_partner_id
        and partners.user_id = accountability_grants.user_id
        and partners.partner_user_id = (select auth.uid())
        and partners.status = 'active'
        and partners.revoked_at is null
    )
  );
