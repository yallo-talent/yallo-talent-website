create extension if not exists pgcrypto;

-- One append-only row per submission from either capture surface (the brief
-- form or, later, the assistant). Email is a route off this record, never
-- the only copy of it — see docs/design/context-round13-chatbot.md §2.1.
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  -- Which endpoint received it: "brief" or "cv".
  endpoint text not null,
  -- The raw, schema-validated payload as submitted.
  payload jsonb not null,
  -- The payload's own `source` discriminator ("form" | "assistant"), where
  -- the endpoint's schema carries one.
  origin_source text,
  transcript_ref text,
  referrer text,
  campaign jsonb,
  -- Per-downstream delivery outcome, e.g. {"email": {"delivered": true, ...}}.
  -- Never used to decide whether the submission itself was captured.
  delivery_status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists submissions_endpoint_idx on submissions (endpoint);
create index if not exists submissions_created_at_idx on submissions (created_at);
