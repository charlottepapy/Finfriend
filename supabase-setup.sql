-- Finfriend: paste this whole file in Supabase > SQL Editor > New query > Run.
create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  client_updated bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "own row select" on public.app_state;
drop policy if exists "own row insert" on public.app_state;
drop policy if exists "own row update" on public.app_state;
drop policy if exists "own row delete" on public.app_state;

create policy "own row select" on public.app_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "own row insert" on public.app_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own row update" on public.app_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own row delete" on public.app_state for delete to authenticated using ((select auth.uid()) = user_id);
