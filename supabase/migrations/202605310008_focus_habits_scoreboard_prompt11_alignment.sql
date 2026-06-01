-- Proposito em Acao - Prompt 11 focus, habits and scoreboard alignment.
-- Adds daily execution fields while preserving owner-only RLS and no Atalaia
-- direct access to focus, habit or scoreboard base tables.

alter table public.focus_sessions
  add column if not exists calendar_block_id uuid,
  add column if not exists action_unblock_session_id uuid,
  add column if not exists post_energy_level text,
  add column if not exists pause_count integer not null default 0;

alter table public.focus_sessions
  drop constraint if exists focus_sessions_prompt11_duration_check,
  drop constraint if exists focus_sessions_prompt11_energy_check,
  drop constraint if exists focus_sessions_prompt11_pause_count_check,
  drop constraint if exists focus_sessions_prompt11_text_length_check;

alter table public.focus_sessions
  add constraint focus_sessions_prompt11_duration_check
  check (duration_minutes between 1 and 120),
  add constraint focus_sessions_prompt11_energy_check
  check (post_energy_level is null or post_energy_level in ('low', 'medium', 'high')),
  add constraint focus_sessions_prompt11_pause_count_check
  check (pause_count >= 0),
  add constraint focus_sessions_prompt11_text_length_check
  check (completion_note is null or char_length(completion_note) <= 1000);

alter table public.focus_distractions
  add column if not exists distraction_type text not null default 'thought',
  add column if not exists routed_to_inbox boolean not null default false;

alter table public.focus_distractions
  drop constraint if exists focus_distractions_prompt11_type_check,
  drop constraint if exists focus_distractions_prompt11_text_length_check;

alter table public.focus_distractions
  add constraint focus_distractions_prompt11_type_check
  check (distraction_type in ('thought', 'idea', 'reminder', 'parallel_task', 'concern', 'link', 'note')),
  add constraint focus_distractions_prompt11_text_length_check
  check (char_length(content) between 2 and 500);

alter table public.habits
  add column if not exists schema_version text not null default 'habit_plan_output_v1',
  add column if not exists identity_statement text,
  add column if not exists why_it_matters text,
  add column if not exists life_area text,
  add column if not exists schedule_suggestion text,
  add column if not exists likely_obstacle text,
  add column if not exists if_then_plan text,
  add column if not exists environment_design text,
  add column if not exists restart_plan text,
  add column if not exists risk_of_overload text,
  add column if not exists adjustments jsonb not null default '[]'::jsonb,
  add column if not exists scoreboard_items jsonb not null default '[]'::jsonb,
  add column if not exists user_review_required boolean not null default true;

alter table public.habits
  drop constraint if exists habits_prompt11_schema_check,
  drop constraint if exists habits_prompt11_frequency_check,
  drop constraint if exists habits_prompt11_risk_check,
  drop constraint if exists habits_prompt11_review_check,
  drop constraint if exists habits_prompt11_text_length_check;

alter table public.habits
  add constraint habits_prompt11_schema_check
  check (schema_version = 'habit_plan_output_v1'),
  add constraint habits_prompt11_frequency_check
  check ((frequency ->> 'type') is null or (frequency ->> 'type') in ('daily', 'weekly', 'custom')),
  add constraint habits_prompt11_risk_check
  check (risk_of_overload is null or risk_of_overload in ('low', 'medium', 'high')),
  add constraint habits_prompt11_review_check
  check (user_review_required = true),
  add constraint habits_prompt11_text_length_check
  check (
    char_length(title) between 2 and 160
    and char_length(minimum_version) between 2 and 500
    and (ideal_version is null or char_length(ideal_version) <= 500)
    and (identity_statement is null or char_length(identity_statement) <= 240)
    and (why_it_matters is null or char_length(why_it_matters) <= 2000)
    and (life_area is null or char_length(life_area) <= 80)
    and (trigger is null or char_length(trigger) <= 240)
    and (schedule_suggestion is null or char_length(schedule_suggestion) <= 240)
    and (likely_obstacle is null or char_length(likely_obstacle) <= 240)
    and (if_then_plan is null or char_length(if_then_plan) <= 2000)
    and (environment_design is null or char_length(environment_design) <= 2000)
    and (restart_plan is null or char_length(restart_plan) <= 2000)
  );

alter table public.habit_logs
  drop constraint if exists habit_logs_status_check;

alter table public.habit_logs
  add constraint habit_logs_status_check
  check (status in ('done_minimum', 'done_ideal', 'skipped', 'missed', 'restarted', 'paused_consciously'));

alter table public.discipline_scoreboards
  add column if not exists goal_id uuid,
  add column if not exists restart_tracking boolean not null default true,
  add column if not exists visual_guidance text,
  add column if not exists risk_notes jsonb not null default '[]'::jsonb,
  add column if not exists user_review_required boolean not null default true;

alter table public.discipline_scoreboards
  drop constraint if exists discipline_scoreboards_period_check,
  drop constraint if exists discipline_scoreboards_prompt11_review_check,
  drop constraint if exists discipline_scoreboards_prompt11_text_length_check;

alter table public.discipline_scoreboards
  add constraint discipline_scoreboards_period_check
  check (period in ('daily', 'weekly', 'monthly', 'custom')),
  add constraint discipline_scoreboards_prompt11_review_check
  check (user_review_required = true),
  add constraint discipline_scoreboards_prompt11_text_length_check
  check (
    char_length(title) between 2 and 120
    and (visual_guidance is null or char_length(visual_guidance) <= 500)
  );

alter table public.scoreboard_items
  add column if not exists target_frequency text,
  add column if not exists minimum_success text,
  add column if not exists linked_goal_id uuid,
  add column if not exists linked_habit_id uuid,
  add column if not exists linked_task_id uuid;

alter table public.scoreboard_items
  drop constraint if exists scoreboard_items_item_type_check,
  drop constraint if exists scoreboard_items_prompt11_text_length_check;

alter table public.scoreboard_items
  add constraint scoreboard_items_item_type_check
  check (item_type in ('task', 'habit', 'focus', 'restart', 'behavior', 'commitment', 'manual')),
  add constraint scoreboard_items_prompt11_text_length_check
  check (
    char_length(title) between 2 and 140
    and (target_frequency is null or char_length(target_frequency) <= 120)
    and (minimum_success is null or char_length(minimum_success) <= 240)
  );

alter table public.scoreboard_entries
  add column if not exists status text not null default 'done';

alter table public.scoreboard_entries
  drop constraint if exists scoreboard_entries_prompt11_status_check,
  drop constraint if exists scoreboard_entries_prompt11_text_length_check;

alter table public.scoreboard_entries
  add constraint scoreboard_entries_prompt11_status_check
  check (status in ('done', 'partial', 'not_done', 'restarted', 'paused_consciously')),
  add constraint scoreboard_entries_prompt11_text_length_check
  check (note is null or char_length(note) <= 500);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'focus_sessions_calendar_block_user_fk'
  ) then
    alter table public.focus_sessions
      add constraint focus_sessions_calendar_block_user_fk
      foreign key (calendar_block_id, user_id)
      references public.calendar_blocks(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'focus_sessions_action_unblock_user_fk'
  ) then
    alter table public.focus_sessions
      add constraint focus_sessions_action_unblock_user_fk
      foreign key (action_unblock_session_id, user_id)
      references public.action_unblock_sessions(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'discipline_scoreboards_goal_user_fk'
  ) then
    alter table public.discipline_scoreboards
      add constraint discipline_scoreboards_goal_user_fk
      foreign key (goal_id, user_id)
      references public.goals(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'scoreboard_items_goal_user_fk'
  ) then
    alter table public.scoreboard_items
      add constraint scoreboard_items_goal_user_fk
      foreign key (linked_goal_id, user_id)
      references public.goals(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'scoreboard_items_habit_user_fk'
  ) then
    alter table public.scoreboard_items
      add constraint scoreboard_items_habit_user_fk
      foreign key (linked_habit_id, user_id)
      references public.habits(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'scoreboard_items_task_user_fk'
  ) then
    alter table public.scoreboard_items
      add constraint scoreboard_items_task_user_fk
      foreign key (linked_task_id, user_id)
      references public.tasks(id, user_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'scoreboard_entries_user_item_date_unique'
  ) then
    alter table public.scoreboard_entries
      add constraint scoreboard_entries_user_item_date_unique
      unique (user_id, scoreboard_item_id, entry_date);
  end if;
end $$;

create index if not exists idx_focus_sessions_user_calendar
  on public.focus_sessions (user_id, calendar_block_id);

create index if not exists idx_habits_user_status
  on public.habits (user_id, status);

create index if not exists idx_scoreboard_items_user_scoreboard
  on public.scoreboard_items (user_id, scoreboard_id, position);

create index if not exists idx_scoreboard_entries_user_item_date
  on public.scoreboard_entries (user_id, scoreboard_item_id, entry_date desc);
