-- Prompt 6 - onboarding/calling metadata.
-- Adds audit-friendly metadata for provisional Calling hypotheses without
-- enabling AI calls or changing Atalaia access.

alter table public.callings
  add column if not exists schema_version text not null default 'calling_draft_v1',
  add column if not exists confidence_level text not null default 'low'
    check (confidence_level in ('low', 'medium', 'high')),
  add column if not exists guardrail_status text not null default 'review_required'
    check (guardrail_status in ('passed', 'blocked', 'review_required')),
  add column if not exists pastoral_safety_note text,
  add column if not exists accepted_at timestamptz,
  add column if not exists reviewed_at timestamptz;

alter table public.calling_session_entries
  add column if not exists prompt_version text not null default 'calling_onboarding_v1',
  add column if not exists position integer not null default 0;

create index if not exists idx_calling_session_entries_user_calling
  on public.calling_session_entries (user_id, calling_id, position);
