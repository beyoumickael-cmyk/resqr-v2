create type public.resqr_role as enum (
  'owner',
  'structure_admin',
  'checker',
  'field_user',
  'guest_pin',
  'read_only'
);

create type public.asset_type as enum (
  'vehicle',
  'equipment',
  'bag',
  'kit',
  'device',
  'custom_container'
);

create type public.led_status as enum ('black', 'green', 'yellow', 'red');

create table public.structures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  structure_id uuid not null references public.structures(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.resqr_role not null,
  invited_email text,
  activated_at timestamptz,
  suspended_at timestamptz,
  created_at timestamptz not null default now(),
  unique (structure_id, user_id)
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  structure_id uuid not null references public.structures(id) on delete cascade,
  parent_asset_id uuid references public.assets(id),
  type public.asset_type not null,
  name text not null,
  internal_identifier text,
  qr_slug text not null unique,
  current_status public.led_status not null default 'black',
  status_causes jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  structure_id uuid references public.structures(id),
  actor_user_id uuid references auth.users(id),
  actor_label text not null,
  action text not null,
  target_table text,
  target_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.structures enable row level security;
alter table public.memberships enable row level security;
alter table public.assets enable row level security;
alter table public.audit_events enable row level security;

create function public.is_structure_member(target_structure_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where memberships.structure_id = target_structure_id
      and memberships.user_id = auth.uid()
      and memberships.suspended_at is null
      and memberships.activated_at is not null
  );
$$;

create policy "members can read their structures"
on public.structures
for select
to authenticated
using (public.is_structure_member(id));

create policy "members can read memberships in their structures"
on public.memberships
for select
to authenticated
using (public.is_structure_member(structure_id));

create policy "members can read assets in their structures"
on public.assets
for select
to authenticated
using (public.is_structure_member(structure_id));

create policy "members can read audit in their structures"
on public.audit_events
for select
to authenticated
using (structure_id is not null and public.is_structure_member(structure_id));

grant usage on schema public to anon, authenticated;
grant select on public.structures, public.memberships, public.assets, public.audit_events to authenticated;
