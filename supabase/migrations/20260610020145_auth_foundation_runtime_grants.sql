-- Proposito em Acao - Auth foundation runtime grants.
-- Additive grant alignment for tables created after the initial RLS baseline.
-- Do not apply remotely without explicit approval and preview RLS validation.

grant select, insert, update, delete on public.energy_checkins to authenticated;

grant select, insert on public.account_deletion_requests to authenticated;
revoke update, delete on public.account_deletion_requests from anon, authenticated;

revoke all on public.energy_checkins, public.account_deletion_requests from anon;
