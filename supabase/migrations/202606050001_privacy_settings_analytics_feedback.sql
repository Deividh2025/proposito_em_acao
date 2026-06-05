-- Proposito em Acao - Etapa 7 privacy settings, analytics, feedback and retention.
-- Additive only. Do not apply remotely without explicit approval and preview RLS validation.

alter table public.user_preferences
  add column if not exists ai_provider_preference text not null default 'automatic'
    check (ai_provider_preference in ('automatic', 'openai', 'deepseek')),
  add column if not exists analytics_opt_in boolean not null default false;

alter table public.ai_run_audits
  add column if not exists expires_at timestamptz;

update public.ai_run_audits
set expires_at = created_at + interval '90 days'
where expires_at is null;

alter table public.ai_run_audits
  alter column expires_at set default (now() + interval '90 days'),
  alter column expires_at set not null;

create table if not exists public.product_analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null
    check (
      event_name in (
        'module_navigation',
        'action_created',
        'action_completed',
        'local_fallback_used',
        'flow_error',
        'feedback_submitted'
      )
    ),
  schema_version text not null default 'product_analytics_event_v1'
    check (schema_version = 'product_analytics_event_v1'),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  consent_version text not null check (consent_version = 'product_analytics_v1'),
  occurred_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now(),
  unique (id, user_id),
  check (expires_at >= occurred_at)
);

create table if not exists public.beta_feedback_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null
    check (
      module in (
        'onboarding',
        'dashboard',
        'calling',
        'goals',
        'projects',
        'tasks',
        'calendar',
        'inbox',
        'action-unblocker',
        'metacognition',
        'focus',
        'habits',
        'scoreboard',
        'weekly-review',
        'garden',
        'accountability',
        'mobile',
        'support',
        'other'
      )
    ),
  worked text not null check (char_length(worked) between 2 and 500),
  confused text not null check (char_length(confused) between 2 and 500),
  blocked text not null check (char_length(blocked) between 2 and 500),
  clarity_score integer not null check (clarity_score between 1 and 5),
  usefulness_score integer not null check (usefulness_score between 1 and 5),
  friction_score integer not null check (friction_score between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 800),
  has_sensitive_hint boolean not null default false,
  status text not null default 'submitted'
    check (status in ('submitted', 'blocked_sensitive', 'deleted')),
  consent_version text not null check (consent_version = 'beta_feedback_v1'),
  submitted_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now(),
  unique (id, user_id),
  check (expires_at >= submitted_at),
  check (status <> 'submitted' or has_sensitive_hint = false)
);

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending_manual_review'
    check (status in ('pending_manual_review', 'pending_admin_deletion', 'cancelled', 'completed')),
  requested_at timestamptz not null default now(),
  confirmation_phrase_matched boolean not null default false
    check (confirmation_phrase_matched = true),
  reason text check (reason is null or char_length(reason) <= 500),
  admin_deletion_allowed boolean not null default false,
  processing_restriction text not null default 'block_nonessential_processing'
    check (processing_restriction = 'block_nonessential_processing'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create index if not exists idx_user_preferences_user_privacy
  on public.user_preferences (user_id, ai_provider_preference, analytics_opt_in);

create index if not exists idx_product_analytics_events_user_occurred
  on public.product_analytics_events (user_id, occurred_at);
create index if not exists idx_product_analytics_events_expires
  on public.product_analytics_events (expires_at);
create index if not exists idx_product_analytics_events_event
  on public.product_analytics_events (event_name);

create index if not exists idx_beta_feedback_items_user_submitted
  on public.beta_feedback_items (user_id, submitted_at);
create index if not exists idx_beta_feedback_items_expires
  on public.beta_feedback_items (expires_at);
create index if not exists idx_beta_feedback_items_status
  on public.beta_feedback_items (status);

create index if not exists idx_account_deletion_requests_user_status
  on public.account_deletion_requests (user_id, status, requested_at);

create index if not exists idx_ai_run_audits_expires
  on public.ai_run_audits (expires_at);

alter table public.product_analytics_events enable row level security;
alter table public.product_analytics_events force row level security;
alter table public.beta_feedback_items enable row level security;
alter table public.beta_feedback_items force row level security;
alter table public.account_deletion_requests enable row level security;
alter table public.account_deletion_requests force row level security;

drop policy if exists product_analytics_events_owner_select on public.product_analytics_events;
create policy product_analytics_events_owner_select
  on public.product_analytics_events for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists product_analytics_events_owner_insert on public.product_analytics_events;
create policy product_analytics_events_owner_insert
  on public.product_analytics_events for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.consent_records consent
      where consent.user_id = (select auth.uid())
        and consent.consent_type = 'product_analytics'
        and consent.version = 'product_analytics_v1'
        and consent.revoked_at is null
    )
  );

drop policy if exists beta_feedback_items_owner_select on public.beta_feedback_items;
create policy beta_feedback_items_owner_select
  on public.beta_feedback_items for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists beta_feedback_items_owner_insert on public.beta_feedback_items;
create policy beta_feedback_items_owner_insert
  on public.beta_feedback_items for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'submitted'
    and has_sensitive_hint = false
    and exists (
      select 1
      from public.consent_records consent
      where consent.user_id = (select auth.uid())
        and consent.consent_type = 'beta_feedback'
        and consent.version = 'beta_feedback_v1'
        and consent.revoked_at is null
    )
  );

drop policy if exists account_deletion_requests_owner_select on public.account_deletion_requests;
create policy account_deletion_requests_owner_select
  on public.account_deletion_requests for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists account_deletion_requests_owner_insert on public.account_deletion_requests;
create policy account_deletion_requests_owner_insert
  on public.account_deletion_requests for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending_manual_review'
    and confirmation_phrase_matched = true
    and admin_deletion_allowed = false
    and processing_restriction = 'block_nonessential_processing'
  );

drop trigger if exists set_account_deletion_requests_updated_at on public.account_deletion_requests;
create trigger set_account_deletion_requests_updated_at
  before update on public.account_deletion_requests
  for each row execute function app_private.set_updated_at();

create or replace function app_private.prune_operational_retention(dry_run boolean default true)
returns table(table_name text, deleted_count bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if dry_run then
    return query
      select 'product_analytics_events'::text, count(*)::bigint
      from public.product_analytics_events
      where expires_at <= now();
    return query
      select 'beta_feedback_items'::text, count(*)::bigint
      from public.beta_feedback_items
      where expires_at <= now();
    return query
      select 'ai_run_audits'::text, count(*)::bigint
      from public.ai_run_audits
      where expires_at <= now();
    return;
  end if;

  return query
    with deleted as (
      delete from public.product_analytics_events
      where expires_at <= now()
      returning 1
    )
    select 'product_analytics_events'::text, count(*)::bigint from deleted;

  return query
    with deleted as (
      delete from public.beta_feedback_items
      where expires_at <= now()
      returning 1
    )
    select 'beta_feedback_items'::text, count(*)::bigint from deleted;

  return query
    with deleted as (
      delete from public.ai_run_audits
      where expires_at <= now()
      returning 1
    )
    select 'ai_run_audits'::text, count(*)::bigint from deleted;
end;
$$;

revoke all on function app_private.prune_operational_retention(boolean) from public;
revoke all on function app_private.prune_operational_retention(boolean) from anon;
revoke all on function app_private.prune_operational_retention(boolean) from authenticated;
grant execute on function app_private.prune_operational_retention(boolean) to service_role;
