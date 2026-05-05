create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text,
  bio text,
  avatar_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_length check (char_length(username) between 3 and 24),
  constraint profiles_username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

create table if not exists public.group_modules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  accent_color text default '#b6522f',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint group_modules_slug_format check (slug ~ '^[a-z0-9-]+$')
);

create table if not exists public.module_items (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.group_modules(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  details text not null default '',
  location text,
  starts_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists module_items_module_id_idx on public.module_items (module_id);
create index if not exists module_items_starts_at_idx on public.module_items (starts_at);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists group_modules_set_updated_at on public.group_modules;
create trigger group_modules_set_updated_at
before update on public.group_modules
for each row
execute function public.set_updated_at();

drop trigger if exists module_items_set_updated_at on public.module_items;
create trigger module_items_set_updated_at
before update on public.module_items
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  desired_username text;
begin
  desired_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    split_part(new.email, '@', 1),
    'member_' || substr(new.id::text, 1, 8)
  );

  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    left(regexp_replace(desired_username, '[^a-zA-Z0-9_]', '', 'g'), 24),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set
    username = excluded.username,
    full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.group_modules enable row level security;
alter table public.module_items enable row level security;

drop policy if exists "authenticated users can read profiles" on public.profiles;
create policy "authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "authenticated users can read modules" on public.group_modules;
create policy "authenticated users can read modules"
on public.group_modules
for select
to authenticated
using (true);

drop policy if exists "authenticated users can create modules" on public.group_modules;
create policy "authenticated users can create modules"
on public.group_modules
for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "module creators can update their modules" on public.group_modules;
create policy "module creators can update their modules"
on public.group_modules
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

drop policy if exists "authenticated users can read items" on public.module_items;
create policy "authenticated users can read items"
on public.module_items
for select
to authenticated
using (true);

drop policy if exists "authenticated users can create items" on public.module_items;
create policy "authenticated users can create items"
on public.module_items
for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "item creators can update items" on public.module_items;
create policy "item creators can update items"
on public.module_items
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "public can view avatars" on storage.objects;
create policy "public can view avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

drop policy if exists "authenticated users can upload their avatars" on storage.objects;
create policy "authenticated users can upload their avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "authenticated users can update their avatars" on storage.objects;
create policy "authenticated users can update their avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "authenticated users can delete their avatars" on storage.objects;
create policy "authenticated users can delete their avatars"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

insert into public.group_modules (name, slug, description, accent_color, sort_order)
values
  ('Trips', 'trips', 'Weekend runs, summer plans, logistics, and who is bringing what.', '#c75d2c', 1),
  ('Meetings', 'meetings', 'Monthly meetups, agendas, practical details, and follow-up notes.', '#1f546f', 2),
  ('Moments', 'moments', 'Stories, recaps, inside jokes, and memories worth keeping.', '#2f8f83', 3)
on conflict (slug) do nothing;
