-- Tabla para guardar el progreso del quiz de cada usuario.
-- Ejecutar una vez en Supabase: SQL Editor > New query > pegar > Run.

create table if not exists public.progreso (
    user_id    uuid primary key references auth.users (id) on delete cascade,
    datos      jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

-- Seguridad por fila: cada usuario solo ve y modifica su propia fila.
alter table public.progreso enable row level security;

drop policy if exists "progreso_select_propio" on public.progreso;
drop policy if exists "progreso_insert_propio" on public.progreso;
drop policy if exists "progreso_update_propio" on public.progreso;
drop policy if exists "progreso_delete_propio" on public.progreso;

create policy "progreso_select_propio" on public.progreso
    for select to authenticated using (auth.uid() = user_id);
create policy "progreso_insert_propio" on public.progreso
    for insert to authenticated with check (auth.uid() = user_id);
create policy "progreso_update_propio" on public.progreso
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progreso_delete_propio" on public.progreso
    for delete to authenticated using (auth.uid() = user_id);
