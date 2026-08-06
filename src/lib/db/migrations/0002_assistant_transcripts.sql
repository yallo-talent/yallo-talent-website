-- One append-only row per assistant chat turn. Deliberately not part of the
-- `submissions` family: `submissions` is the durable capture backstop and
-- must never lose a row, while a transcript has a stated 12-month retention
-- and must be purged on a schedule. Folding a purgeable row type into an
-- append-only table forces the purge to distinguish row types inside the
-- one store meant to be immutable — see docs/design/context-round14-scope.md
-- §2.1. Each row carries the full running conversation as of that turn, so
-- the newest row per `transcript_id` is the complete transcript; older rows
-- for the same id are earlier snapshots, never updated in place.
create table if not exists assistant_transcripts (
  id uuid primary key default gen_random_uuid(),
  -- Client-generated per conversation (crypto.randomUUID() in
  -- AssistantPanel.tsx). The same value `submissions.transcript_ref` joins
  -- against when an assistant-sourced brief is captured.
  transcript_id text not null,
  messages jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists assistant_transcripts_transcript_id_idx
  on assistant_transcripts (transcript_id);
create index if not exists assistant_transcripts_created_at_idx
  on assistant_transcripts (created_at);
