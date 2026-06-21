create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  guest_count smallint not null check (guest_count between 1 and 4),
  dietary_restrictions text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
