-- Staging table for notices detected on official government recruitment
-- sites. New notices land as drafts; publishing copies them into
-- scraper_cache, which the whole site already reads.
-- Run once in the Supabase SQL editor.

create table if not exists official_jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null,               -- 'upsc' | 'ibps' | 'rpsc' | ...
  title text not null,
  notice_url text not null unique,    -- official page or PDF
  category text not null default 'latestJobs',
  status text not null default 'draft',  -- draft | published | rejected
  url_slug text unique,
  org text,
  detected_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists official_jobs_status_idx on official_jobs (status, detected_at desc);

alter table official_jobs enable row level security;
