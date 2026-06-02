-- Prompt 12 - Weekly Review and Life Garden alignment.
-- Additive migration. Remote application requires Supabase CLI/credentials and RLS validation.

alter table public.weekly_reviews
  add column if not exists schema_version text not null default 'weekly_review_output_v1',
  add column if not exists status text not null default 'completed',
  add column if not exists wins jsonb not null default '[]'::jsonb,
  add column if not exists stuck_points jsonb not null default '[]'::jsonb,
  add column if not exists adjustments jsonb not null default '[]'::jsonb,
  add column if not exists overload_warning boolean not null default false,
  add column if not exists user_review_required boolean not null default true,
  add column if not exists reviewed_at timestamptz,
  add column if not exists completed_at timestamptz;

alter table public.weekly_reviews
  drop constraint if exists weekly_reviews_status_check;

alter table public.weekly_reviews
  add constraint weekly_reviews_status_check
  check (status in ('draft', 'completed', 'needs_review'));

alter table public.weekly_reviews
  drop constraint if exists weekly_reviews_schema_version_check;

alter table public.weekly_reviews
  add constraint weekly_reviews_schema_version_check
  check (schema_version = 'weekly_review_output_v1');

alter table public.garden_states
  add column if not exists schema_version text not null default 'garden_state_output_v1',
  add column if not exists weekly_growth_summary text,
  add column if not exists derived_from_weekly_review_id uuid,
  add column if not exists derived_at timestamptz,
  add column if not exists privacy_level text not null default 'private';

alter table public.garden_states
  drop constraint if exists garden_states_schema_version_check;

alter table public.garden_states
  add constraint garden_states_schema_version_check
  check (schema_version = 'garden_state_output_v1');

alter table public.garden_states
  drop constraint if exists garden_states_privacy_level_check;

alter table public.garden_states
  add constraint garden_states_privacy_level_check
  check (privacy_level = 'private');

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'garden_states_weekly_review_owner_fk'
      and conrelid = 'public.garden_states'::regclass
  ) then
    alter table public.garden_states
      add constraint garden_states_weekly_review_owner_fk
      foreign key (derived_from_weekly_review_id, user_id)
      references public.weekly_reviews(id, user_id);
  end if;
end $$;

alter table public.garden_events
  add column if not exists weekly_review_id uuid,
  add column if not exists source_type text,
  add column if not exists source_id uuid,
  add column if not exists impact integer not null default 1,
  add column if not exists metadata_minimal jsonb not null default '{}'::jsonb;

alter table public.garden_events
  drop constraint if exists garden_events_event_type_check;

alter table public.garden_events
  add constraint garden_events_event_type_check
  check (
    event_type in (
      'area_progressed',
      'area_neglected',
      'area_care_needed',
      'weekly_review_completed',
      'goal_progressed',
      'project_progressed',
      'task_completed',
      'focus_completed',
      'habit_logged',
      'habit_restarted',
      'metacognition_action_completed',
      'protected_rest'
    )
  );

alter table public.garden_events
  drop constraint if exists garden_events_source_type_check;

alter table public.garden_events
  add constraint garden_events_source_type_check
  check (
    source_type is null or source_type in (
      'weekly_review',
      'goal',
      'project',
      'task',
      'focus',
      'habit',
      'scoreboard',
      'metacognition',
      'calendar',
      'manual'
    )
  );

alter table public.garden_events
  drop constraint if exists garden_events_impact_check;

alter table public.garden_events
  add constraint garden_events_impact_check
  check (impact between 0 and 5);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'garden_events_weekly_review_owner_fk'
      and conrelid = 'public.garden_events'::regclass
  ) then
    alter table public.garden_events
      add constraint garden_events_weekly_review_owner_fk
      foreign key (weekly_review_id, user_id)
      references public.weekly_reviews(id, user_id);
  end if;
end $$;

create index if not exists idx_garden_events_user_life_area_created
  on public.garden_events (user_id, life_area_id, created_at desc);

create index if not exists idx_garden_events_user_weekly_review
  on public.garden_events (user_id, weekly_review_id);

create index if not exists idx_weekly_reviews_user_status_week
  on public.weekly_reviews (user_id, status, week_start desc);

alter table public.weekly_reviews enable row level security;
alter table public.garden_states enable row level security;
alter table public.garden_events enable row level security;

alter table public.weekly_reviews force row level security;
alter table public.garden_states force row level security;
alter table public.garden_events force row level security;

-- Existing owner-only policies from 202605310002_rls_policies.sql continue to apply.
-- No Atalaia policy, public view, or raw AI log table is created in Prompt 12.
