-- Run this if the rsvps table already exists with the old schema.

alter table public.rsvps
  add column if not exists attending boolean,
  add column if not exists guest_names text[],
  add column if not exists dietary_restrictions text,
  add column if not exists phone_country_code text,
  add column if not exists phone_number text;

alter table public.rsvps
  alter column guest_count drop not null;

alter table public.rsvps
  drop constraint if exists rsvps_guest_count_check;

alter table public.rsvps
  add constraint rsvps_guest_count_check
  check (guest_count is null or guest_count between 1 and 4);

-- Backfill existing rows before enforcing NOT NULL on new columns.
update public.rsvps
set
  attending = coalesce(attending, true),
  phone_country_code = coalesce(phone_country_code, '+90'),
  phone_number = coalesce(phone_number, '0000000000')
where attending is null
   or phone_country_code is null
   or phone_number is null;

alter table public.rsvps
  alter column attending set not null;

alter table public.rsvps
  alter column phone_country_code drop not null,
  alter column phone_number drop not null;
