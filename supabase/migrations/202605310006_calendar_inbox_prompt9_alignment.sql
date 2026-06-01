-- Proposito em Acao - Prompt 9 calendar and inbox alignment.
-- Expands calendar block and inbox classification constraints for the
-- execution calendar + GTD inbox stage without changing owner-only RLS.

alter table public.calendar_blocks
  drop constraint if exists calendar_blocks_block_type_check;

alter table public.calendar_blocks
  add constraint calendar_blocks_block_type_check
  check (
    block_type in (
      'task',
      'focus',
      'habit_placeholder',
      'recurring_work',
      'rest',
      'family',
      'spirituality',
      'health',
      'learning',
      'service',
      'appointment',
      'buffer'
    )
  );

alter table public.calendar_blocks
  add column if not exists energy_level text,
  add column if not exists recurrence_rule text,
  add column if not exists recurrence_parent_id uuid;

alter table public.calendar_blocks
  drop constraint if exists calendar_blocks_energy_level_check;

alter table public.calendar_blocks
  add constraint calendar_blocks_energy_level_check
  check (energy_level is null or energy_level in ('low', 'medium', 'high'));

alter table public.calendar_blocks
  drop constraint if exists calendar_blocks_prompt9_text_length_check;

alter table public.calendar_blocks
  add constraint calendar_blocks_prompt9_text_length_check
  check (
    char_length(title) between 2 and 140
    and (notes is null or char_length(notes) <= 1000)
  );

alter table public.calendar_blocks
  add constraint calendar_blocks_recurrence_parent_fk
  foreign key (recurrence_parent_id, user_id)
  references public.calendar_blocks(id, user_id)
  on delete no action;

alter table public.inbox_items
  drop constraint if exists inbox_items_content_type_check,
  drop constraint if exists inbox_items_status_check;

alter table public.inbox_items
  add constraint inbox_items_content_type_check
  check (content_type in ('text', 'voice_note', 'image_placeholder', 'file', 'link')),
  add constraint inbox_items_status_check
  check (status in ('captured', 'triaged', 'converted', 'discarded', 'archived'));

alter table public.inbox_items
  add column if not exists classification text,
  add column if not exists recommended_action text,
  add column if not exists confidence_level text,
  add column if not exists suggested_title text,
  add column if not exists summary text,
  add column if not exists life_area text,
  add column if not exists estimated_minutes integer,
  add column if not exists energy_level text,
  add column if not exists due_date_suggestion text,
  add column if not exists clarifying_question text,
  add column if not exists safety_note text,
  add column if not exists processing_note text,
  add column if not exists processed_at timestamptz;

alter table public.inbox_items
  drop constraint if exists inbox_items_classification_check,
  drop constraint if exists inbox_items_recommended_action_check,
  drop constraint if exists inbox_items_confidence_level_check,
  drop constraint if exists inbox_items_energy_level_check,
  drop constraint if exists inbox_items_estimated_minutes_check;

alter table public.inbox_items
  add constraint inbox_items_classification_check
  check (
    classification is null
    or classification in (
      'task',
      'project',
      'calendar_event',
      'habit',
      'reference',
      'future_idea',
      'concern',
      'discard',
      'needs_clarification'
    )
  ),
  add constraint inbox_items_recommended_action_check
  check (
    recommended_action is null
    or recommended_action in (
      'do_now',
      'schedule',
      'create_task',
      'create_project',
      'create_habit',
      'archive',
      'discard',
      'clarify',
      'reflect',
      'unblock'
    )
  ),
  add constraint inbox_items_confidence_level_check
  check (confidence_level is null or confidence_level in ('low', 'medium', 'high')),
  add constraint inbox_items_energy_level_check
  check (energy_level is null or energy_level in ('low', 'medium', 'high')),
  add constraint inbox_items_estimated_minutes_check
  check (estimated_minutes is null or estimated_minutes between 1 and 480);

alter table public.inbox_items
  drop constraint if exists inbox_items_prompt9_text_length_check;

alter table public.inbox_items
  add constraint inbox_items_prompt9_text_length_check
  check (
    char_length(content) between 2 and 2000
    and (suggested_title is null or char_length(suggested_title) <= 240)
    and (summary is null or char_length(summary) <= 2000)
    and (life_area is null or char_length(life_area) <= 80)
    and (due_date_suggestion is null or char_length(due_date_suggestion) <= 80)
    and (clarifying_question is null or char_length(clarifying_question) <= 500)
    and (safety_note is null or char_length(safety_note) <= 500)
    and (processing_note is null or char_length(processing_note) <= 1000)
  );

create index if not exists idx_calendar_blocks_user_status_time
  on public.calendar_blocks (user_id, status, start_time, end_time);

create index if not exists idx_calendar_blocks_user_task
  on public.calendar_blocks (user_id, task_id);

create index if not exists idx_inbox_items_user_status_created
  on public.inbox_items (user_id, status, created_at desc);

create index if not exists idx_inbox_items_user_destination
  on public.inbox_items (user_id, destination_type, destination_id);
