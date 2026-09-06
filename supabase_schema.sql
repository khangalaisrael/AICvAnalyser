-- TalentScan / AI CV Analyser — database schema
-- Run this once in the Supabase SQL editor of a fresh project.
-- Reconstructed from backend/services/database.py (no migration files were committed).

create table if not exists public.analyses (
    id                 uuid primary key default gen_random_uuid(),
    user_id            uuid not null references auth.users (id) on delete cascade,
    created_at         timestamptz not null default now(),

    candidate_name     text default '',
    role               text not null,

    -- scoring engine output
    score              numeric,
    verdict            text,
    component_scores   jsonb,

    -- AI result
    matched_skills     jsonb default '[]'::jsonb,
    missing_skills     jsonb default '[]'::jsonb,
    recommended_skills jsonb default '[]'::jsonb,
    years_experience   numeric default 0,
    match_score        numeric,
    keyword_alignment  numeric,
    ai_summary         text,
    researched_role    jsonb,
    coaching           jsonb,

    -- recruiter pipeline action
    pipeline_status    text check (pipeline_status in ('HIRE', 'HOLD', 'REJECT')) default null
);

create index if not exists analyses_user_id_created_at_idx
    on public.analyses (user_id, created_at desc);

-- The FastAPI backend connects with the publishable/anon key and does its own
-- per-user filtering (.eq("user_id", user_id)) after verifying the Supabase JWT,
-- so row-level security is left OFF to match the original project's behaviour.
alter table public.analyses disable row level security;
