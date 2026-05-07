create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  access_level text not null default 'all',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint items_category_check check (
    category in ('Vedtægter', 'Referater', 'Anekdoter', 'Ture', 'Dokumenter', 'Nyheder', 'Andet')
  ),
  constraint items_access_level_check check (access_level in ('all', 'admins'))
);

create table if not exists public.item_versions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  version_number integer not null,
  file_path text,
  file_name text,
  file_size bigint,
  mime_type text,
  change_note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (item_id, version_number)
);

alter table public.profiles
add column if not exists email text,
add column if not exists phone text,
add column if not exists address text,
add column if not exists role text not null default 'member';

alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check check (role in ('super_admin', 'admin', 'member'));

update public.profiles p
set email = coalesce(p.email, u.email)
from auth.users u
where p.id = u.id;

alter table public.profiles
alter column email set not null;

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('super_admin', 'admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
  );
$$;

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

  insert into public.profiles (id, username, email, full_name, role)
  values (
    new.id,
    left(regexp_replace(desired_username, '[^a-zA-Z0-9_]', '', 'g'), 24),
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'member')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = coalesce(public.profiles.role, excluded.role);

  return new;
end;
$$;

alter table public.items enable row level security;
alter table public.item_versions enable row level security;

drop policy if exists "authenticated users can read allowed items" on public.items;
create policy "authenticated users can read allowed items"
on public.items
for select
to authenticated
using (
  access_level = 'all'
  or public.is_admin()
);

drop policy if exists "admins can create items" on public.items;
create policy "admins can create items"
on public.items
for insert
to authenticated
with check (
  public.is_admin()
  and auth.uid() = created_by
);

drop policy if exists "admins can update items" on public.items;
create policy "admins can update items"
on public.items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "authenticated users can read allowed item versions" on public.item_versions;
create policy "authenticated users can read allowed item versions"
on public.item_versions
for select
to authenticated
using (
  exists (
    select 1
    from public.items i
    where i.id = item_id
      and (i.access_level = 'all' or public.is_admin())
  )
);

drop policy if exists "admins can create item versions" on public.item_versions;
create policy "admins can create item versions"
on public.item_versions
for insert
to authenticated
with check (
  public.is_admin()
  and auth.uid() = created_by
);

drop policy if exists "super admins can update profiles" on public.profiles;
create policy "super admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "users can update their own profile" on public.profiles;
drop policy if exists "users can update their own basic profile" on public.profiles;
create policy "users can update their own basic profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select p.role from public.profiles p where p.id = auth.uid())
  and email = (select p.email from public.profiles p where p.id = auth.uid())
);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "authenticated users can read documents" on storage.objects;
create policy "authenticated users can read documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and exists (
    select 1
    from public.item_versions v
    join public.items i on i.id = v.item_id
    where v.file_path = storage.objects.name
      and (i.access_level = 'all' or public.is_admin())
  )
);

drop policy if exists "admins can upload documents" on storage.objects;
create policy "admins can upload documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and public.is_admin()
);

drop policy if exists "admins can update documents" on storage.objects;
create policy "admins can update documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documents'
  and public.is_admin()
)
with check (
  bucket_id = 'documents'
  and public.is_admin()
);
