create extension if not exists pgcrypto;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.facts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  submitted_by text not null default 'Anonymous Scout',
  created_at timestamptz not null default now()
);

create table if not exists public.encounters (
  id uuid primary key default gen_random_uuid(),
  scenario text not null,
  submitted_by text not null default 'Anonymous Scout',
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_reactions (
  id uuid primary key default gen_random_uuid(),
  image_id text not null,
  reaction_type text not null check (reaction_type in ('applause', 'crown', 'mythic')),
  submitted_by text not null default 'Anonymous Scout',
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  submitted_by text not null default 'Anonymous Scout',
  created_at timestamptz not null default now()
);

create table if not exists public.stats_votes (
  id uuid primary key default gen_random_uuid(),
  stat_name text not null check (stat_name in ('charisma', 'athleticism', 'intelligence', 'aura', 'clutch')),
  vote integer not null check (vote between 1 and 3),
  submitted_by text not null default 'Anonymous Scout',
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;
alter table public.facts enable row level security;
alter table public.encounters enable row level security;
alter table public.gallery_reactions enable row level security;
alter table public.timeline_entries enable row level security;
alter table public.stats_votes enable row level security;

drop policy if exists "comments public read" on public.comments;
create policy "comments public read" on public.comments for select to anon using (true);
drop policy if exists "comments public insert" on public.comments;
create policy "comments public insert" on public.comments for insert to anon with check (true);

drop policy if exists "facts public read" on public.facts;
create policy "facts public read" on public.facts for select to anon using (true);
drop policy if exists "facts public insert" on public.facts;
create policy "facts public insert" on public.facts for insert to anon with check (true);

drop policy if exists "encounters public read" on public.encounters;
create policy "encounters public read" on public.encounters for select to anon using (true);
drop policy if exists "encounters public insert" on public.encounters;
create policy "encounters public insert" on public.encounters for insert to anon with check (true);

drop policy if exists "gallery reactions public read" on public.gallery_reactions;
create policy "gallery reactions public read" on public.gallery_reactions for select to anon using (true);
drop policy if exists "gallery reactions public insert" on public.gallery_reactions;
create policy "gallery reactions public insert" on public.gallery_reactions for insert to anon with check (true);

drop policy if exists "timeline public read" on public.timeline_entries;
create policy "timeline public read" on public.timeline_entries for select to anon using (true);
drop policy if exists "timeline public insert" on public.timeline_entries;
create policy "timeline public insert" on public.timeline_entries for insert to anon with check (true);

drop policy if exists "stats votes public read" on public.stats_votes;
create policy "stats votes public read" on public.stats_votes for select to anon using (true);
drop policy if exists "stats votes public insert" on public.stats_votes;
create policy "stats votes public insert" on public.stats_votes for insert to anon with check (true);

alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.facts;
alter publication supabase_realtime add table public.encounters;
alter publication supabase_realtime add table public.gallery_reactions;
alter publication supabase_realtime add table public.timeline_entries;
alter publication supabase_realtime add table public.stats_votes;
