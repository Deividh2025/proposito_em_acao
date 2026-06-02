-- Proposito em Acao - Prompt 14 mobile/PWA complementary alignment.
-- Adds private energy check-ins for quick mobile state without opening any
-- shared, offline or Atalaia access path.

create table if not exists public.energy_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  energy_level text not null,
  note text,
  source text not null default 'mobile',
  captured_at timestamptz not null default now(),
  client_created_at timestamptz,
  client_mutation_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint energy_checkins_level_check
    check (energy_level in ('low', 'medium', 'high')),
  constraint energy_checkins_source_check
    check (source in ('mobile', 'focus', 'daily_checkin', 'manual')),
  constraint energy_checkins_note_length_check
    check (note is null or char_length(note) <= 500),
  constraint energy_checkins_client_mutation_length_check
    check (client_mutation_id is null or char_length(client_mutation_id) between 8 and 120)
);

alter table public.energy_checkins enable row level security;
alter table public.energy_checkins force row level security;

drop policy if exists energy_checkins_owner_select on public.energy_checkins;
drop policy if exists energy_checkins_owner_insert on public.energy_checkins;
drop policy if exists energy_checkins_owner_update on public.energy_checkins;
drop policy if exists energy_checkins_owner_delete on public.energy_checkins;

create policy energy_checkins_owner_select
  on public.energy_checkins for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy energy_checkins_owner_insert
  on public.energy_checkins for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy energy_checkins_owner_update
  on public.energy_checkins for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy energy_checkins_owner_delete
  on public.energy_checkins for delete
  to authenticated
  using (user_id = (select auth.uid()));

create index if not exists idx_energy_checkins_user_captured
  on public.energy_checkins (user_id, captured_at desc);

create unique index if not exists idx_energy_checkins_user_client_mutation
  on public.energy_checkins (user_id, client_mutation_id)
  where client_mutation_id is not null;
