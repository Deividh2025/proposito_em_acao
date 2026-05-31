-- Proposito em Acao - initial Supabase schema
-- Prompt 4 foundation: Auth-linked profile, V1 breadth tables, Atalaia grants,
-- consent records, minimal audit, and private-by-default sensitive modules.

create extension if not exists pgcrypto;

create schema if not exists app_private;

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  timezone text not null default 'America/Sao_Paulo',
  locale text not null default 'pt-BR',
  onboarding_status text not null default 'not_started'
    check (onboarding_status in ('not_started', 'in_progress', 'completed')),
  ai_tone text not null default 'encouraging'
    check (ai_tone in ('encouraging', 'direct', 'gentle', 'structured')),
  christian_layer_intensity text not null default 'balanced'
    check (christian_layer_intensity in ('off', 'light', 'balanced', 'strong')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  next_action_style text not null default 'micro'
    check (next_action_style in ('micro', 'standard', 'detailed')),
  focus_default_minutes integer not null default 25 check (focus_default_minutes > 0),
  low_energy_mode boolean not null default false,
  notifications jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id),
  unique (id, user_id)
);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null,
  version text not null,
  scope text not null,
  subject_type text,
  subject_id uuid,
  accepted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (id, user_id),
  check (revoked_at is null or revoked_at >= accepted_at)
);

create table if not exists public.life_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  current_score integer check (current_score between 0 and 10),
  color text,
  icon text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug),
  unique (id, user_id)
);

create table if not exists public.life_map_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_date date not null default current_date,
  answers jsonb not null default '{}'::jsonb,
  ai_summary text,
  status text not null default 'draft' check (status in ('draft', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.life_map_area_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid not null,
  life_area_id uuid not null,
  score integer not null check (score between 0 and 10),
  note text,
  created_at timestamptz not null default now(),
  unique (assessment_id, life_area_id),
  unique (id, user_id),
  foreign key (assessment_id, user_id) references public.life_map_assessments(id, user_id) on delete cascade,
  foreign key (life_area_id, user_id) references public.life_areas(id, user_id) on delete cascade
);

create table if not exists public.callings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft', 'in_discernment', 'active', 'archived')),
  statement text,
  hypothesis text,
  values jsonb not null default '[]'::jsonb,
  burdens jsonb not null default '[]'::jsonb,
  gifts jsonb not null default '[]'::jsonb,
  people_to_serve text,
  contribution text,
  privacy_level text not null default 'private' check (privacy_level in ('private', 'limited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.calling_session_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calling_id uuid not null,
  prompt_key text not null,
  answer text,
  ai_reflection text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (calling_id, user_id) references public.callings(id, user_id) on delete cascade
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calling_id uuid,
  life_area_id uuid,
  title text not null,
  description text,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'paused', 'completed', 'abandoned', 'in_review')),
  specific text,
  measurable text,
  achievable text,
  relevant text,
  time_bound date,
  ecological_analysis text,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (calling_id, user_id) references public.callings(id, user_id),
  foreign key (life_area_id, user_id) references public.life_areas(id, user_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null,
  title text not null,
  description text,
  phase text,
  status text not null default 'active'
    check (status in ('draft', 'active', 'paused', 'completed', 'archived')),
  risks jsonb not null default '[]'::jsonb,
  resources jsonb not null default '[]'::jsonb,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (goal_id, user_id) references public.goals(id, user_id) on delete cascade
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid,
  goal_id uuid,
  title text not null,
  description text,
  task_type text not null default 'task'
    check (task_type in ('task', 'milestone', 'routine', 'admin')),
  status text not null default 'pending'
    check (status in ('pending', 'scheduled', 'in_focus', 'completed', 'postponed', 'blocked', 'cancelled')),
  energy_level text check (energy_level in ('low', 'medium', 'high')),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  due_date date,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  next_action text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (project_id, user_id) references public.projects(id, user_id),
  foreign key (goal_id, user_id) references public.goals(id, user_id),
  check (scheduled_end is null or scheduled_start is null or scheduled_end > scheduled_start)
);

create table if not exists public.microtasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null,
  title text not null,
  position integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'skipped')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (task_id, user_id) references public.tasks(id, user_id) on delete cascade
);

create table if not exists public.calendar_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid,
  habit_id uuid,
  block_type text not null default 'task'
    check (block_type in ('task', 'habit', 'focus', 'rest', 'review', 'manual')),
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'missed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (task_id, user_id) references public.tasks(id, user_id),
  check (end_time > start_time)
);

create table if not exists public.inbox_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  content_type text not null default 'text' check (content_type in ('text', 'voice_note', 'file', 'link')),
  ai_classification jsonb not null default '{}'::jsonb,
  status text not null default 'captured'
    check (status in ('captured', 'triaged', 'converted', 'discarded', 'archived')),
  destination_type text,
  destination_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid,
  duration_minutes integer not null check (duration_minutes > 0),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status text not null default 'active'
    check (status in ('active', 'completed', 'cancelled', 'interrupted')),
  completion_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (task_id, user_id) references public.tasks(id, user_id),
  check (ended_at is null or ended_at >= started_at)
);

create table if not exists public.focus_distractions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  focus_session_id uuid not null,
  content text not null,
  captured_at timestamptz not null default now(),
  routed_to_inbox_item_id uuid,
  unique (id, user_id),
  foreign key (focus_session_id, user_id) references public.focus_sessions(id, user_id) on delete cascade,
  foreign key (routed_to_inbox_item_id, user_id) references public.inbox_items(id, user_id)
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid,
  title text not null,
  identity text,
  trigger text,
  minimum_version text not null,
  ideal_version text,
  reward text,
  frequency jsonb not null default '{}'::jsonb,
  metric text,
  status text not null default 'active'
    check (status in ('draft', 'active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (goal_id, user_id) references public.goals(id, user_id)
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null,
  log_date date not null default current_date,
  status text not null check (status in ('done_minimum', 'done_ideal', 'skipped', 'missed', 'restarted')),
  value numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, log_date),
  unique (id, user_id),
  foreign key (habit_id, user_id) references public.habits(id, user_id) on delete cascade
);

create table if not exists public.discipline_scoreboards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  period text not null default 'weekly' check (period in ('daily', 'weekly', 'monthly')),
  visibility text not null default 'private' check (visibility in ('private', 'atalaias_limited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.scoreboard_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scoreboard_id uuid not null,
  item_type text not null check (item_type in ('task', 'habit', 'focus', 'restart', 'manual')),
  item_id uuid,
  title text not null,
  weight integer not null default 1 check (weight > 0),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (scoreboard_id, user_id) references public.discipline_scoreboards(id, user_id) on delete cascade
);

create table if not exists public.scoreboard_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scoreboard_id uuid not null,
  scoreboard_item_id uuid,
  entry_date date not null default current_date,
  value numeric not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (scoreboard_id, user_id) references public.discipline_scoreboards(id, user_id) on delete cascade,
  foreign key (scoreboard_item_id, user_id) references public.scoreboard_items(id, user_id)
);

create table if not exists public.metacognition_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  related_task_id uuid,
  related_goal_id uuid,
  related_project_id uuid,
  emotional_state text,
  intensity integer check (intensity is null or intensity between 1 and 10),
  raw_thought text,
  fact text,
  interpretation text,
  feeling text,
  impulse text,
  cognitive_patterns jsonb not null default '[]'::jsonb,
  ai_reframe text,
  confrontation_question text,
  next_action text,
  privacy_level text not null default 'private' check (privacy_level in ('private', 'manual_summary_only')),
  crisis_flag boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (related_task_id, user_id) references public.tasks(id, user_id),
  foreign key (related_goal_id, user_id) references public.goals(id, user_id),
  foreign key (related_project_id, user_id) references public.projects(id, user_id)
);

create table if not exists public.action_unblock_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid,
  state text,
  energy text check (energy is null or energy in ('low', 'medium', 'high')),
  time_available_minutes integer check (time_available_minutes is null or time_available_minutes > 0),
  obstacle text,
  ai_plan jsonb not null default '{}'::jsonb,
  started_focus boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (task_id, user_id) references public.tasks(id, user_id)
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  answers jsonb not null default '{}'::jsonb,
  ai_summary text,
  patterns jsonb not null default '[]'::jsonb,
  next_week_focus text,
  privacy_level text not null default 'private' check (privacy_level in ('private', 'manual_summary_only')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start),
  unique (id, user_id),
  check (week_end >= week_start)
);

create table if not exists public.accountability_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  partner_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  status text not null default 'invited'
    check (status in ('invited', 'active', 'revoked', 'expired')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  check (revoked_at is null or accepted_at is null or revoked_at >= accepted_at)
);

create table if not exists public.accountability_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  accountability_partner_id uuid not null,
  goal_id uuid not null,
  permissions jsonb not null default '{}'::jsonb,
  status text not null default 'invited'
    check (status in ('invited', 'active', 'revoked', 'expired')),
  accepted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (accountability_partner_id, user_id) references public.accountability_partners(id, user_id) on delete cascade,
  foreign key (goal_id, user_id) references public.goals(id, user_id) on delete cascade,
  check (revoked_at is null or accepted_at is null or revoked_at >= accepted_at)
);

create table if not exists public.accountability_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  accountability_partner_id uuid,
  accountability_grant_id uuid,
  goal_id uuid,
  event_type text not null,
  actor_type text not null check (actor_type in ('owner', 'partner', 'system')),
  actor_id uuid,
  metadata_minimal jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (accountability_partner_id, user_id) references public.accountability_partners(id, user_id),
  foreign key (accountability_grant_id, user_id) references public.accountability_grants(id, user_id),
  foreign key (goal_id, user_id) references public.goals(id, user_id)
);

create table if not exists public.accountability_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  accountability_partner_id uuid not null,
  accountability_grant_id uuid not null,
  goal_id uuid not null,
  notification_type text not null,
  channel text not null default 'email' check (channel in ('email', 'in_app', 'push')),
  status text not null default 'draft'
    check (status in ('draft', 'previewed', 'approved', 'queued', 'sent', 'cancelled', 'blocked')),
  preview_payload jsonb not null default '{}'::jsonb,
  sent_payload_redacted jsonb not null default '{}'::jsonb,
  approved_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (accountability_partner_id, user_id) references public.accountability_partners(id, user_id) on delete cascade,
  foreign key (accountability_grant_id, user_id) references public.accountability_grants(id, user_id) on delete cascade,
  foreign key (goal_id, user_id) references public.goals(id, user_id) on delete cascade
);

create table if not exists public.commitment_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null,
  title text not null,
  content text not null,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  version integer not null default 1 check (version > 0),
  shared_with_atalaias boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (goal_id, user_id) references public.goals(id, user_id) on delete cascade
);

create table if not exists public.commitment_levers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  commitment_document_id uuid,
  goal_id uuid not null,
  lever_type text not null check (lever_type in ('progress_reward', 'completion_reward', 'healthy_repair')),
  description text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (commitment_document_id, user_id) references public.commitment_documents(id, user_id),
  foreign key (goal_id, user_id) references public.goals(id, user_id) on delete cascade
);

create table if not exists public.garden_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  area_states jsonb not null default '{}'::jsonb,
  unlocked_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id),
  unique (id, user_id)
);

create table if not exists public.garden_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  garden_state_id uuid,
  life_area_id uuid,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (garden_state_id, user_id) references public.garden_states(id, user_id),
  foreign key (life_area_id, user_id) references public.life_areas(id, user_id)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  resource_type text,
  resource_id uuid,
  actor_type text not null default 'system' check (actor_type in ('user', 'partner', 'system')),
  actor_id uuid,
  status text not null default 'recorded',
  metadata_minimal jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.ai_run_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  schema_name text not null,
  schema_version text not null,
  agent_name text not null,
  status text not null check (status in ('success', 'blocked', 'failed')),
  guardrail_status text not null check (guardrail_status in ('passed', 'blocked', 'review_required')),
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  error_code text,
  metadata_minimal jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'calendar_blocks_habit_user_fk'
  ) then
    alter table public.calendar_blocks
      add constraint calendar_blocks_habit_user_fk
      foreign key (habit_id, user_id)
      references public.habits(id, user_id)
      on delete no action;
  end if;
end $$;

create index if not exists idx_consent_records_user_active
  on public.consent_records (user_id, consent_type, scope, revoked_at);
create index if not exists idx_life_areas_user_id on public.life_areas (user_id);
create index if not exists idx_life_map_assessments_user_id on public.life_map_assessments (user_id);
create index if not exists idx_callings_user_id on public.callings (user_id);
create index if not exists idx_goals_user_status on public.goals (user_id, status);
create index if not exists idx_goals_user_calling on public.goals (user_id, calling_id);
create index if not exists idx_projects_user_goal on public.projects (user_id, goal_id);
create index if not exists idx_tasks_user_goal on public.tasks (user_id, goal_id);
create index if not exists idx_tasks_user_project on public.tasks (user_id, project_id);
create index if not exists idx_tasks_user_status on public.tasks (user_id, status);
create index if not exists idx_microtasks_user_task on public.microtasks (user_id, task_id);
create index if not exists idx_calendar_blocks_user_time on public.calendar_blocks (user_id, start_time, end_time);
create index if not exists idx_inbox_items_user_status on public.inbox_items (user_id, status);
create index if not exists idx_focus_sessions_user_task on public.focus_sessions (user_id, task_id);
create index if not exists idx_habits_user_goal on public.habits (user_id, goal_id);
create index if not exists idx_habit_logs_user_date on public.habit_logs (user_id, log_date);
create index if not exists idx_scoreboard_entries_user_date on public.scoreboard_entries (user_id, entry_date);
create index if not exists idx_metacognition_sessions_user_created on public.metacognition_sessions (user_id, created_at);
create index if not exists idx_action_unblock_sessions_user_task on public.action_unblock_sessions (user_id, task_id);
create index if not exists idx_weekly_reviews_user_week on public.weekly_reviews (user_id, week_start);
create index if not exists idx_accountability_partners_user on public.accountability_partners (user_id, status);
create index if not exists idx_accountability_partners_partner_user on public.accountability_partners (partner_user_id, status);
create index if not exists idx_accountability_grants_user_goal on public.accountability_grants (user_id, goal_id, status, revoked_at);
create index if not exists idx_accountability_grants_partner on public.accountability_grants (accountability_partner_id, status, revoked_at);
create index if not exists idx_accountability_events_user_goal on public.accountability_events (user_id, goal_id, created_at);
create index if not exists idx_accountability_notifications_user_status on public.accountability_notifications (user_id, status);
create index if not exists idx_commitment_documents_user_goal on public.commitment_documents (user_id, goal_id);
create index if not exists idx_garden_events_user_created on public.garden_events (user_id, created_at);
create index if not exists idx_audit_events_user_created on public.audit_events (user_id, created_at);
create index if not exists idx_ai_run_audits_user_created on public.ai_run_audits (user_id, created_at);

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'profiles',
    'user_preferences',
    'life_areas',
    'life_map_assessments',
    'calling_session_entries',
    'callings',
    'goals',
    'projects',
    'tasks',
    'microtasks',
    'calendar_blocks',
    'inbox_items',
    'focus_sessions',
    'habits',
    'habit_logs',
    'discipline_scoreboards',
    'scoreboard_items',
    'scoreboard_entries',
    'metacognition_sessions',
    'action_unblock_sessions',
    'weekly_reviews',
    'accountability_partners',
    'accountability_grants',
    'accountability_notifications',
    'commitment_documents',
    'commitment_levers',
    'garden_states'
  ]
  loop
    execute format(
      'drop trigger if exists set_%1$s_updated_at on public.%1$I',
      target_table
    );
    execute format(
      'create trigger set_%1$s_updated_at before update on public.%1$I for each row execute function app_private.set_updated_at()',
      target_table
    );
  end loop;
end $$;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', ''), '')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app_private.handle_new_user();
