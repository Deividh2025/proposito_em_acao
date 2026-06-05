-- Proposito em Acao - analytics/feedback server-only persistence hardening.
-- Follow-up to 202606050001. Do not apply remotely without explicit approval and preview RLS validation.

drop policy if exists product_analytics_events_owner_insert on public.product_analytics_events;
drop policy if exists beta_feedback_items_owner_insert on public.beta_feedback_items;

grant select on public.product_analytics_events, public.beta_feedback_items to authenticated;
revoke insert, update, delete on public.product_analytics_events, public.beta_feedback_items from anon, authenticated;
