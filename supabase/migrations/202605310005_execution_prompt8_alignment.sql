-- Proposito em Acao - Prompt 8 execution alignment.
-- Aligns goals/projects/tasks/microtasks with SMART-E -> projects -> tasks
-- -> microtasks, without enabling calendar, Atalaia, or OpenAI real flows.

alter table public.goals
  drop constraint if exists goals_status_check;

update public.goals
set status = 'needs_review'
where status = 'in_review';

alter table public.goals
  add constraint goals_status_check
  check (status in ('draft', 'active', 'paused', 'completed', 'abandoned', 'needs_review'));

alter table public.goals
  alter column ecological_analysis type jsonb
  using case
    when ecological_analysis is null or ecological_analysis = '' then null
    else jsonb_build_object('legacy_note', ecological_analysis)
  end;

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check
  check (status in ('draft', 'active', 'paused', 'completed', 'archived', 'needs_review'));

alter table public.tasks
  drop constraint if exists tasks_task_type_check,
  drop constraint if exists tasks_status_check;

update public.tasks
set task_type = case task_type
  when 'task' then 'one_off'
  when 'milestone' then 'project_task'
  when 'routine' then 'recurring_work'
  when 'admin' then 'one_off'
  else task_type
end;

update public.tasks
set status = case status
  when 'postponed' then 'deferred'
  when 'blocked' then 'stuck'
  else status
end;

alter table public.tasks
  add column if not exists priority text not null default 'medium',
  add column if not exists reason text;

alter table public.tasks
  add constraint tasks_task_type_check
  check (task_type in ('one_off', 'project_task', 'recurring_work', 'microtask', 'restart_task')),
  add constraint tasks_status_check
  check (status in ('pending', 'scheduled', 'in_focus', 'completed', 'deferred', 'stuck', 'cancelled')),
  add constraint tasks_priority_check
  check (priority in ('low', 'medium', 'high'));

alter table public.microtasks
  add column if not exists estimated_minutes integer;

alter table public.microtasks
  drop constraint if exists microtasks_estimated_minutes_check;

alter table public.microtasks
  add constraint microtasks_estimated_minutes_check
  check (estimated_minutes is null or estimated_minutes between 1 and 30);

create or replace function app_private.ensure_task_project_goal_alignment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.project_id is not null and new.goal_id is not null then
    if not exists (
      select 1
      from public.projects projects
      where projects.id = new.project_id
        and projects.user_id = new.user_id
        and projects.goal_id = new.goal_id
    ) then
      raise exception 'task project_id and goal_id must belong to the same owner and goal';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function app_private.ensure_task_project_goal_alignment() from public;
revoke all on function app_private.ensure_task_project_goal_alignment() from anon;
revoke all on function app_private.ensure_task_project_goal_alignment() from authenticated;

drop trigger if exists ensure_task_project_goal_alignment on public.tasks;
create trigger ensure_task_project_goal_alignment
  before insert or update of project_id, goal_id, user_id on public.tasks
  for each row execute function app_private.ensure_task_project_goal_alignment();
