-- Proposito em Acao - AI audit persistence contract.
-- Additive hardening for ai_run_audit_v1 states. Do not apply remotely without explicit approval.

alter table public.ai_run_audits
  drop constraint if exists ai_run_audits_status_check,
  add constraint ai_run_audits_status_check
    check (status in ('success', 'fallback', 'blocked', 'error'));

alter table public.ai_run_audits
  drop constraint if exists ai_run_audits_guardrail_status_check,
  add constraint ai_run_audits_guardrail_status_check
    check (guardrail_status in ('passed', 'blocked', 'failed'));
