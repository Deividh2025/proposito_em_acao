-- Allows an authenticated Atalaia to read only their own active partner
-- relationship. Grant/event policies depend on this row-specific relationship
-- check, while sensitive product tables remain inaccessible to Atalaia.
drop policy if exists accountability_partners_partner_select_active on public.accountability_partners;

create policy accountability_partners_partner_select_active
  on public.accountability_partners for select
  to authenticated
  using (
    status = 'active'
    and revoked_at is null
    and accepted_at is not null
    and partner_user_id = (select auth.uid())
  );
