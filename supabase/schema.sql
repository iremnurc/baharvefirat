create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  attending boolean not null,
  name text not null,
  guest_count smallint check (guest_count is null or guest_count between 1 and 4),
  guest_names text[],
  dietary_restrictions text,
  phone_country_code text,
  phone_number text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
