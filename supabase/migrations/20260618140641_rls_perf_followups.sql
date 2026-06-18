-- RLS and FK performance follow-ups from the Supabase Performance Advisor.
--
-- Rollback:
-- - Restore accountability_partners_invitee_select_pending with direct
--   auth.jwt() if needed.
-- - Drop the indexes created below by name.

alter policy accountability_partners_invitee_select_pending
  on public.accountability_partners
  using (
    status = 'invited'
    and partner_user_id is null
    and revoked_at is null
    and invite_token_hash is not null
    and invite_expires_at > now()
    and lower(coalesce(email, '')) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
  );

create index if not exists idx_fk_accountability_events_grant_user
  on public.accountability_events (accountability_grant_id, user_id);

create index if not exists idx_fk_accountability_events_partner_user
  on public.accountability_events (accountability_partner_id, user_id);

create index if not exists idx_fk_accountability_events_goal_user
  on public.accountability_events (goal_id, user_id);

create index if not exists idx_fk_accountability_grants_partner_user
  on public.accountability_grants (accountability_partner_id, user_id);

create index if not exists idx_fk_accountability_grants_goal_user
  on public.accountability_grants (goal_id, user_id);

create index if not exists idx_fk_accountability_notifications_grant_user
  on public.accountability_notifications (accountability_grant_id, user_id);

create index if not exists idx_fk_accountability_notifications_partner_user
  on public.accountability_notifications (accountability_partner_id, user_id);

create index if not exists idx_fk_accountability_notifications_goal_user
  on public.accountability_notifications (goal_id, user_id);

create index if not exists idx_fk_action_unblock_calendar_user
  on public.action_unblock_sessions (calendar_block_id, user_id);

create index if not exists idx_fk_action_unblock_goal_user
  on public.action_unblock_sessions (related_goal_id, user_id);

create index if not exists idx_fk_action_unblock_inbox_user
  on public.action_unblock_sessions (inbox_item_id, user_id);

create index if not exists idx_fk_action_unblock_project_user
  on public.action_unblock_sessions (related_project_id, user_id);

create index if not exists idx_fk_action_unblock_task_user
  on public.action_unblock_sessions (task_id, user_id);

create index if not exists idx_fk_calendar_blocks_habit_user
  on public.calendar_blocks (habit_id, user_id);

create index if not exists idx_fk_calendar_blocks_recurrence_user
  on public.calendar_blocks (recurrence_parent_id, user_id);

create index if not exists idx_fk_calendar_blocks_task_user
  on public.calendar_blocks (task_id, user_id);

create index if not exists idx_fk_calling_entries_calling_user
  on public.calling_session_entries (calling_id, user_id);

create index if not exists idx_fk_commitment_documents_goal_user
  on public.commitment_documents (goal_id, user_id);

create index if not exists idx_fk_commitment_levers_document_user
  on public.commitment_levers (commitment_document_id, user_id);

create index if not exists idx_fk_commitment_levers_goal_user
  on public.commitment_levers (goal_id, user_id);

create index if not exists idx_fk_discipline_scoreboards_goal_user
  on public.discipline_scoreboards (goal_id, user_id);

create index if not exists idx_fk_focus_distractions_session_user
  on public.focus_distractions (focus_session_id, user_id);

create index if not exists idx_fk_focus_distractions_inbox_user
  on public.focus_distractions (routed_to_inbox_item_id, user_id);

create index if not exists idx_fk_focus_sessions_action_unblock_user
  on public.focus_sessions (action_unblock_session_id, user_id);

create index if not exists idx_fk_focus_sessions_calendar_user
  on public.focus_sessions (calendar_block_id, user_id);

create index if not exists idx_fk_focus_sessions_task_user
  on public.focus_sessions (task_id, user_id);

create index if not exists idx_fk_garden_events_state_user
  on public.garden_events (garden_state_id, user_id);

create index if not exists idx_fk_garden_events_life_area_user
  on public.garden_events (life_area_id, user_id);

create index if not exists idx_fk_garden_events_weekly_review_user
  on public.garden_events (weekly_review_id, user_id);

create index if not exists idx_fk_garden_states_weekly_review_user
  on public.garden_states (derived_from_weekly_review_id, user_id);

create index if not exists idx_fk_goals_calling_user
  on public.goals (calling_id, user_id);

create index if not exists idx_fk_goals_life_area_user
  on public.goals (life_area_id, user_id);

create index if not exists idx_fk_habit_logs_habit_user
  on public.habit_logs (habit_id, user_id);

create index if not exists idx_fk_habits_goal_user
  on public.habits (goal_id, user_id);

create index if not exists idx_fk_life_map_scores_assessment_user
  on public.life_map_area_scores (assessment_id, user_id);

create index if not exists idx_fk_life_map_scores_life_area_user
  on public.life_map_area_scores (life_area_id, user_id);

create index if not exists idx_fk_metacognition_goal_user
  on public.metacognition_sessions (related_goal_id, user_id);

create index if not exists idx_fk_metacognition_project_user
  on public.metacognition_sessions (related_project_id, user_id);

create index if not exists idx_fk_metacognition_task_user
  on public.metacognition_sessions (related_task_id, user_id);

create index if not exists idx_fk_microtasks_task_user
  on public.microtasks (task_id, user_id);

create index if not exists idx_fk_projects_goal_user
  on public.projects (goal_id, user_id);

create index if not exists idx_fk_scoreboard_entries_scoreboard_user
  on public.scoreboard_entries (scoreboard_id, user_id);

create index if not exists idx_fk_scoreboard_entries_item_user
  on public.scoreboard_entries (scoreboard_item_id, user_id);

create index if not exists idx_fk_scoreboard_items_goal_user
  on public.scoreboard_items (linked_goal_id, user_id);

create index if not exists idx_fk_scoreboard_items_habit_user
  on public.scoreboard_items (linked_habit_id, user_id);

create index if not exists idx_fk_scoreboard_items_scoreboard_user
  on public.scoreboard_items (scoreboard_id, user_id);

create index if not exists idx_fk_scoreboard_items_task_user
  on public.scoreboard_items (linked_task_id, user_id);

create index if not exists idx_fk_tasks_goal_user
  on public.tasks (goal_id, user_id);

create index if not exists idx_fk_tasks_project_user
  on public.tasks (project_id, user_id);
