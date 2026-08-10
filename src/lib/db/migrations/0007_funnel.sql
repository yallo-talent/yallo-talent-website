-- The funnel sidecar — round 26 item B, cockpit-v3 §11.
--
-- A SIDECAR, NOT COLUMNS ON `submissions`. Round 26 §5 forbids a schema change
-- to `submissions` itself, and the reason is older than the ruling: that table
-- is the capture backstop. Its whole job is that a row lands before any
-- downstream is attempted, so a lead survives Resend being down. Adding
-- pipeline state to it would put a column that changes many times a week on a
-- table whose value is that it is written once and never lost, and it would put
-- the capture path and the sales path in contention for the same row.
--
-- So capture integrity and pipeline state never contend: `submissions` is
-- append-only and this table is the mutable half, keyed one-to-one.
--
-- A ROW APPEARS WHEN SOMEBODY FIRST TOUCHES A LEAD, not when the lead arrives.
-- An absent row means New, which is the state every submission starts in. The
-- alternative -- a trigger inserting a sidecar row per capture -- would put a
-- second write in the path of the capture the backstop exists to protect.
create table if not exists submission_funnel (
  submission_id uuid primary key references submissions (id) on delete cascade,

  -- New, Contacted, Qualified, Won, Lost. Text with a check rather than an
  -- enum: an enum needs a migration to add a state, and the pipeline of a
  -- business two months old will gain one. The check is still a check.
  state text not null default 'new'
    check (state in ('new', 'contacted', 'qualified', 'won', 'lost')),

  -- The cockpit account that owns following this up. Free text holding an
  -- email rather than a foreign key to `users`: an owner who leaves should not
  -- take the history of who owned what with them, and ON DELETE SET NULL would
  -- do exactly that. Nullable, because unassigned is a real state.
  owner_email text,

  -- One free-text note, so an operator can record what happened without a
  -- second table. Not a thread: a conversation about a lead belongs in email,
  -- and a half-built comment system is worse than none.
  note text,

  updated_at timestamptz not null default now(),
  updated_by text
);

-- The default view is actionable-first, filtered by state, so the state is the
-- index. Owner is the second filter anybody reaches for.
create index if not exists submission_funnel_state_idx
  on submission_funnel (state);
create index if not exists submission_funnel_owner_idx
  on submission_funnel (owner_email);

-- Every state change, recorded. `content_audit` already exists and already
-- holds who did what to which row, and a second audit table would be a second
-- place to look when somebody asks who marked a lead lost.
--
-- ITS content_id COLUMN TAKES A SUBMISSION ID, which is why this comment is
-- here rather than nothing: `content_type` is free text and 'submission' joins
-- 'article', 'case_study' and 'media' as a value it carries.
