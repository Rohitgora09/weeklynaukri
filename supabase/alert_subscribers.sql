-- Job alert subscribers table.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists alert_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  categories text[] not null default '{latestJobs}',
  unsubscribe_token text unique not null,
  created_at timestamptz not null default now(),
  last_sent_at timestamptz
);

-- The app talks to this table with the service-role key from the server
-- only, so lock it down for anonymous clients.
alter table alert_subscribers enable row level security;
