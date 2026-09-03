-- BANGKOK SOUNDSCAPE — Supabase setup
-- Run this entire script in Supabase SQL Editor.

create table if not exists public.site_stats (
  id integer primary key,
  total_visits bigint not null default 0
);

insert into public.site_stats (id, total_visits)
values (1, 0)
on conflict (id) do nothing;

alter table public.site_stats enable row level security;

-- The website only needs to read the single public counter.
grant select on public.site_stats to anon;

drop policy if exists "Public can read site stats" on public.site_stats;
create policy "Public can read site stats"
on public.site_stats
for select
to anon
using (id = 1);

-- Only the server-side Vercel function uses the service role to increment.
create or replace function public.increment_site_visit()
returns bigint
language sql
security definer
set search_path = public
as $$
  update public.site_stats
  set total_visits = total_visits + 1
  where id = 1
  returning total_visits;
$$;

revoke all on function public.increment_site_visit() from public;
revoke all on function public.increment_site_visit() from anon;
revoke all on function public.increment_site_visit() from authenticated;
grant execute on function public.increment_site_visit() to service_role;

-- Enable Realtime for the public counter row.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'site_stats'
  ) then
    alter publication supabase_realtime add table public.site_stats;
  end if;
end $$;
