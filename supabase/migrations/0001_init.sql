-- Enable required extension for UUID generation (Supabase usually has this)
create extension if not exists pgcrypto;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone not null default now()
);

-- Prompts
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Triggers to keep updated_at fresh
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_public_prompts_updated_at on public.prompts;
create trigger set_public_prompts_updated_at
before update on public.prompts
for each row execute procedure public.set_current_timestamp_updated_at();

-- RLS
alter table public.prompts enable row level security;
alter table public.categories enable row level security;

-- Prompts policies: users can CRUD their own rows
drop policy if exists "Prompts select own" on public.prompts;
create policy "Prompts select own" on public.prompts
  for select using (auth.uid() = user_id);

drop policy if exists "Prompts insert own" on public.prompts;
create policy "Prompts insert own" on public.prompts
  for insert with check (auth.uid() = user_id);

drop policy if exists "Prompts update own" on public.prompts;
create policy "Prompts update own" on public.prompts
  for update using (auth.uid() = user_id);

drop policy if exists "Prompts delete own" on public.prompts;
create policy "Prompts delete own" on public.prompts
  for delete using (auth.uid() = user_id);

-- Categories: readable by everyone, writable by authenticated users (adjust as you need)
drop policy if exists "Categories read all" on public.categories;
create policy "Categories read all" on public.categories
  for select using (true);

drop policy if exists "Categories insert auth" on public.categories;
create policy "Categories insert auth" on public.categories
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Categories update auth" on public.categories;
create policy "Categories update auth" on public.categories
  for update using (auth.role() = 'authenticated');

drop policy if exists "Categories delete auth" on public.categories;
create policy "Categories delete auth" on public.categories
  for delete using (auth.role() = 'authenticated');

-- Seed some categories (adjust/expand based on your needs)
insert into public.categories (name, slug)
values
  ('Brainstorming', 'brainstorming'),
  ('Writing', 'writing'),
  ('Analysis', 'analysis'),
  ('Coding', 'coding'),
  ('Data', 'data'),
  ('Marketing', 'marketing'),
  ('Design', 'design'),
  ('Learning', 'learning'),
  ('Productivity', 'productivity'),
  ('Communication', 'communication')
on conflict (slug) do nothing;

