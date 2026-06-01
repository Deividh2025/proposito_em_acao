-- Proposito em Acao - Prompt 10 action unblocker and metacognition alignment.
-- Adds structured fields and relationship hooks while preserving owner-only RLS.

alter table public.action_unblock_sessions
  add column if not exists related_project_id uuid,
  add column if not exists related_goal_id uuid,
  add column if not exists calendar_block_id uuid,
  add column if not exists inbox_item_id uuid,
  add column if not exists schema_version text not null default 'action_unblocker_output_v1',
  add column if not exists obstacle_type text,
  add column if not exists obstacle_key text,
  add column if not exists first_step text,
  add column if not exists minimum_viable_action text,
  add column if not exists recommended_focus_minutes integer,
  add column if not exists next_route text,
  add column if not exists suggest_metacognition boolean not null default false,
  add column if not exists reason_to_suggest_metacognition text,
  add column if not exists crisis_flag boolean not null default false,
  add column if not exists human_help_recommended boolean not null default false,
  add column if not exists safety_note text,
  add column if not exists confidence_level text,
  add column if not exists user_review_required boolean not null default true;

alter table public.action_unblock_sessions
  drop constraint if exists action_unblock_sessions_prompt10_schema_check,
  drop constraint if exists action_unblock_sessions_prompt10_obstacle_type_check,
  drop constraint if exists action_unblock_sessions_prompt10_obstacle_key_check,
  drop constraint if exists action_unblock_sessions_prompt10_next_route_check,
  drop constraint if exists action_unblock_sessions_prompt10_focus_minutes_check,
  drop constraint if exists action_unblock_sessions_prompt10_confidence_check,
  drop constraint if exists action_unblock_sessions_prompt10_crisis_route_check,
  drop constraint if exists action_unblock_sessions_prompt10_text_length_check;

alter table public.action_unblock_sessions
  add constraint action_unblock_sessions_prompt10_schema_check
  check (schema_version = 'action_unblocker_output_v1'),
  add constraint action_unblock_sessions_prompt10_obstacle_type_check
  check (
    obstacle_type is null
    or obstacle_type in ('operational', 'emotional', 'energy', 'unclear', 'crisis')
  ),
  add constraint action_unblock_sessions_prompt10_obstacle_key_check
  check (
    obstacle_key is null
    or obstacle_key in ('clarity', 'fear', 'energy', 'time', 'perfectionism', 'overload', 'avoidance', 'other')
  ),
  add constraint action_unblock_sessions_prompt10_next_route_check
  check (next_route is null or next_route in ('focus', 'metacognition', 'rest', 'human_help', 'manual_plan')),
  add constraint action_unblock_sessions_prompt10_focus_minutes_check
  check (recommended_focus_minutes is null or recommended_focus_minutes between 2 and 25),
  add constraint action_unblock_sessions_prompt10_confidence_check
  check (confidence_level is null or confidence_level in ('low', 'medium', 'high')),
  add constraint action_unblock_sessions_prompt10_crisis_route_check
  check (
    crisis_flag = false
    or (
      obstacle_type = 'crisis'
      and next_route = 'human_help'
      and human_help_recommended = true
    )
  ),
  add constraint action_unblock_sessions_prompt10_text_length_check
  check (
    (state is null or char_length(state) <= 240)
    and (obstacle is null or char_length(obstacle) <= 500)
    and (first_step is null or char_length(first_step) <= 2000)
    and (minimum_viable_action is null or char_length(minimum_viable_action) <= 2000)
    and (reason_to_suggest_metacognition is null or char_length(reason_to_suggest_metacognition) <= 2000)
    and (safety_note is null or char_length(safety_note) <= 2000)
  );

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'action_unblock_sessions_project_user_fk'
  ) then
    alter table public.action_unblock_sessions
      add constraint action_unblock_sessions_project_user_fk
      foreign key (related_project_id, user_id)
      references public.projects(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'action_unblock_sessions_goal_user_fk'
  ) then
    alter table public.action_unblock_sessions
      add constraint action_unblock_sessions_goal_user_fk
      foreign key (related_goal_id, user_id)
      references public.goals(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'action_unblock_sessions_calendar_block_user_fk'
  ) then
    alter table public.action_unblock_sessions
      add constraint action_unblock_sessions_calendar_block_user_fk
      foreign key (calendar_block_id, user_id)
      references public.calendar_blocks(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'action_unblock_sessions_inbox_item_user_fk'
  ) then
    alter table public.action_unblock_sessions
      add constraint action_unblock_sessions_inbox_item_user_fk
      foreign key (inbox_item_id, user_id)
      references public.inbox_items(id, user_id);
  end if;
end $$;

alter table public.metacognition_sessions
  add column if not exists schema_version text not null default 'metacognition_output_v1',
  add column if not exists category text,
  add column if not exists intensity_observed text,
  add column if not exists dominant_automatic_thought text,
  add column if not exists logical_deconstruction text,
  add column if not exists recommended_route text,
  add column if not exists christian_anchor text,
  add column if not exists safety_flags jsonb not null default '[]'::jsonb,
  add column if not exists privacy_note text,
  add column if not exists user_review_required boolean not null default true,
  add column if not exists share_with_accountability_allowed boolean not null default false;

alter table public.metacognition_sessions
  drop constraint if exists metacognition_sessions_prompt10_schema_check,
  drop constraint if exists metacognition_sessions_prompt10_category_check,
  drop constraint if exists metacognition_sessions_prompt10_intensity_check,
  drop constraint if exists metacognition_sessions_prompt10_route_check,
  drop constraint if exists metacognition_sessions_prompt10_private_check,
  drop constraint if exists metacognition_sessions_prompt10_crisis_route_check,
  drop constraint if exists metacognition_sessions_prompt10_text_length_check;

alter table public.metacognition_sessions
  add constraint metacognition_sessions_prompt10_schema_check
  check (schema_version = 'metacognition_output_v1'),
  add constraint metacognition_sessions_prompt10_category_check
  check (
    category is null
    or category in (
      'anxiety',
      'anguish',
      'procrastination',
      'paralysis',
      'perfectionism',
      'rumination',
      'guilt',
      'victimization',
      'anger',
      'fear',
      'confusion',
      'avoidance',
      'overload',
      'low_energy',
      'other'
    )
  ),
  add constraint metacognition_sessions_prompt10_intensity_check
  check (intensity_observed is null or intensity_observed in ('low', 'medium', 'high')),
  add constraint metacognition_sessions_prompt10_route_check
  check (
    recommended_route is null
    or recommended_route in (
      'action_unblocker',
      'focus',
      'rest',
      'prayer_reflection',
      'human_support',
      'emergency_support'
    )
  ),
  add constraint metacognition_sessions_prompt10_private_check
  check (
    privacy_level = 'private'
    and share_with_accountability_allowed = false
    and user_review_required = true
  ),
  add constraint metacognition_sessions_prompt10_crisis_route_check
  check (crisis_flag = false or recommended_route = 'emergency_support'),
  add constraint metacognition_sessions_prompt10_text_length_check
  check (
    (raw_thought is null or char_length(raw_thought) <= 1000)
    and (fact is null or char_length(fact) <= 2000)
    and (interpretation is null or char_length(interpretation) <= 2000)
    and (feeling is null or char_length(feeling) <= 240)
    and (impulse is null or char_length(impulse) <= 1000)
    and (ai_reframe is null or char_length(ai_reframe) <= 2000)
    and (confrontation_question is null or char_length(confrontation_question) <= 1000)
    and (next_action is null or char_length(next_action) <= 1000)
    and (dominant_automatic_thought is null or char_length(dominant_automatic_thought) <= 1000)
    and (logical_deconstruction is null or char_length(logical_deconstruction) <= 2000)
    and (christian_anchor is null or char_length(christian_anchor) <= 1000)
    and (privacy_note is null or char_length(privacy_note) <= 1000)
  );

create index if not exists idx_action_unblock_sessions_user_created
  on public.action_unblock_sessions (user_id, created_at desc);

create index if not exists idx_action_unblock_sessions_user_route
  on public.action_unblock_sessions (user_id, next_route, created_at desc);

create index if not exists idx_metacognition_sessions_user_route
  on public.metacognition_sessions (user_id, recommended_route, created_at desc);

create index if not exists idx_metacognition_sessions_user_crisis
  on public.metacognition_sessions (user_id, crisis_flag, created_at desc);
