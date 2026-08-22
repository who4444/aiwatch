-- Run in Supabase SQL editor. Idempotent.
-- Breaking-change-first schema for aiwatch

create table if not exists sources (
  id text primary key,
  provider text not null,
  label text not null,
  url text not null,
  kind text not null,
  check_interval_hours int not null default 4,
  last_checked_at timestamptz,
  last_hash text,
  created_at timestamptz default now()
);

create table if not exists snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id text references sources(id) on delete cascade,
  url text not null,
  hash text not null,
  body text not null,
  fetched_at timestamptz default now()
);
create index if not exists snapshots_source_fetched_idx on snapshots(source_id, fetched_at desc);

create table if not exists model_events (
  id text primary key,
  provider text not null,
  model_name text not null,
  event_type text not null,
  severity text not null,
  title text not null,
  before jsonb,
  after jsonb,
  source_url text not null,
  detected_at timestamptz not null,
  effective_date date,
  why_it_matters text not null,
  fix text not null,
  created_at timestamptz default now()
);
create index if not exists model_events_detected_idx on model_events(detected_at desc);
create index if not exists model_events_provider_idx on model_events(provider);
create index if not exists model_events_severity_idx on model_events(severity);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  providers text[] not null default '{}',
  severities text[] not null default '{high,medium}',
  channel text not null default 'email',
  webhook_url text,
  referrer text,
  created_at timestamptz default now(),
  unique(email, channel)
);

create table if not exists checkout_intents (
  id uuid primary key default gen_random_uuid(),
  email text,
  plan text not null,
  price text not null,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  event_id text references model_events(id) on delete cascade,
  subscriber_id uuid references subscribers(id) on delete cascade,
  channel text not null,
  status text not null default 'pending',
  sent_at timestamptz,
  error text
);

-- Seed sources (upsert)
-- Run after: insert from src/lib/providers.ts SOURCES
