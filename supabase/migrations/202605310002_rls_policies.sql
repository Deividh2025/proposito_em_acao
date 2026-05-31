-- Proposito em Acao - RLS baseline and Atalaia access boundaries.
-- Owner access is explicit. Atalaia access is limited to accountability-specific
-- tables and active grants, never to the full account or sensitive base tables.

grant usage on schema public to authenticated;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

create or replace function app_private.has_active_accountability_grant(
  target_user_id uuid,
  target_goal_id uuid,
  required_permission text default null
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.accountability_grants grants
    join public.accountability_partners partners
      on partners.id = grants.accountability_partner_id
     and partners.user_id = grants.user_id
    where grants.user_id = target_user_id
      and grants.goal_id = target_goal_id
      and grants.status = 'active'
      and grants.revoked_at is null
      and (grants.expires_at is null or grants.expires_at > now())
      and partners.status = 'active'
      and partners.revoked_at is null
      and partners.partner_user_id = (select auth.uid())
      and (
        required_permission is null
        or grants.permissions @> jsonb_build_object(required_permission, true)
      )
  );
$$;

revoke all on function app_private.has_active_accountability_grant(uuid, uuid, text) from public;
grant execute on function app_private.has_active_accountability_grant(uuid, uuid, text) to authenticated;

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'profiles',
    'user_preferences',
    'consent_records',
    'life_areas',
    'life_map_assessments',
    'life_map_area_scores',
    'callings',
    'calling_session_entries',
    'goals',
    'projects',
    'tasks',
    'microtasks',
    'calendar_blocks',
    'inbox_items',
    'focus_sessions',
    'focus_distractions',
    'habits',
    'habit_logs',
    'discipline_scoreboards',
    'scoreboard_items',
    'scoreboard_entries',
    'metacognition_sessions',
    'action_unblock_sessions',
    'weekly_reviews',
    'accountability_partners',
    'accountability_grants',
    'accountability_events',
    'accountability_notifications',
    'commitment_documents',
    'commitment_levers',
    'garden_states',
    'garden_events',
    'audit_events',
    'ai_run_audits'
  ]
  loop
    execute format('alter table public.%I enable row level security', target_table);
    execute format('alter table public.%I force row level security', target_table);
  end loop;
end $$;

drop policy if exists profiles_owner_select on public.profiles;
create policy profiles_owner_select
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists profiles_owner_insert on public.profiles;
create policy profiles_owner_insert
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

drop policy if exists profiles_owner_update on public.profiles;
create policy profiles_owner_update
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'user_preferences',
    'life_areas',
    'life_map_assessments',
    'life_map_area_scores',
    'callings',
    'calling_session_entries',
    'goals',
    'projects',
    'tasks',
    'microtasks',
    'calendar_blocks',
    'inbox_items',
    'focus_sessions',
    'focus_distractions',
    'habits',
    'habit_logs',
    'discipline_scoreboards',
    'scoreboard_items',
    'scoreboard_entries',
    'metacognition_sessions',
    'action_unblock_sessions',
    'weekly_reviews',
    'commitment_documents',
    'commitment_levers',
    'garden_states',
    'garden_events'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', target_table || '_owner_select', target_table);
    execute format(
      'create policy %I on public.%I for select to authenticated using (user_id = (select auth.uid()))',
      target_table || '_owner_select',
      target_table
    );

    execute format('drop policy if exists %I on public.%I', target_table || '_owner_insert', target_table);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (user_id = (select auth.uid()))',
      target_table || '_owner_insert',
      target_table
    );

    execute format('drop policy if exists %I on public.%I', target_table || '_owner_update', target_table);
    execute format(
      'create policy %I on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',
      target_table || '_owner_update',
      target_table
    );

    execute format('drop policy if exists %I on public.%I', target_table || '_owner_delete', target_table);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (user_id = (select auth.uid()))',
      target_table || '_owner_delete',
      target_table
    );
  end loop;
end $$;

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'accountability_partners',
    'accountability_grants',
    'accountability_notifications'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', target_table || '_owner_select', target_table);
    execute format(
      'create policy %I on public.%I for select to authenticated using (user_id = (select auth.uid()))',
      target_table || '_owner_select',
      target_table
    );

    execute format('drop policy if exists %I on public.%I', target_table || '_owner_insert', target_table);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (user_id = (select auth.uid()))',
      target_table || '_owner_insert',
      target_table
    );

    execute format('drop policy if exists %I on public.%I', target_table || '_owner_update', target_table);
    execute format(
      'create policy %I on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',
      target_table || '_owner_update',
      target_table
    );
  end loop;
end $$;

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'consent_records',
    'accountability_events',
    'audit_events',
    'ai_run_audits'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', target_table || '_owner_select', target_table);
    execute format(
      'create policy %I on public.%I for select to authenticated using (user_id = (select auth.uid()))',
      target_table || '_owner_select',
      target_table
    );
  end loop;
end $$;

drop policy if exists accountability_grants_partner_select_active on public.accountability_grants;
create policy accountability_grants_partner_select_active
  on public.accountability_grants for select
  to authenticated
  using (
    app_private.has_active_accountability_grant(user_id, goal_id, null)
  );

drop policy if exists accountability_events_partner_select_active on public.accountability_events;
create policy accountability_events_partner_select_active
  on public.accountability_events for select
  to authenticated
  using (
    goal_id is not null
    and app_private.has_active_accountability_grant(user_id, goal_id, null)
  );

drop policy if exists accountability_notifications_partner_select_active on public.accountability_notifications;
create policy accountability_notifications_partner_select_active
  on public.accountability_notifications for select
  to authenticated
  using (
    status in ('approved', 'queued', 'sent')
    and app_private.has_active_accountability_grant(user_id, goal_id, null)
  );

drop policy if exists commitment_documents_partner_select_explicit on public.commitment_documents;
create policy commitment_documents_partner_select_explicit
  on public.commitment_documents for select
  to authenticated
  using (
    shared_with_atalaias = true
    and app_private.has_active_accountability_grant(user_id, goal_id, 'commitment_document')
  );

-- No partner policy is created for callings, metacognition_sessions,
-- weekly_reviews, inbox_items, calendar_blocks, focus_distractions, or raw
-- AI/audit payloads. Those remain owner-only by design.
