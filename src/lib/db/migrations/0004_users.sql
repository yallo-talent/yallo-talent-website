-- Cockpit accounts — round 23 §3. Additive, and deliberately so.
--
-- WHY A TABLE AT ALL, having ruled against one in round 17. That ruling said no
-- second account until one is actually needed. One is now needed: article
-- authoring goes to an editor who must not see briefs or conversations, and a
-- shared login cannot express that. The ruling was about not building ahead of
-- the need, not about the shape of the answer.
--
-- THE ENV PAIR IS NOT REPLACED. ADMIN_EMAIL / ADMIN_PASSWORD_HASH stay as
-- break-glass and keep mapping to admin. A users table that is the ONLY way in
-- is a table whose first bad migration locks the owner out of the live cockpit
-- overnight, which is the worst failure available here. This migration
-- therefore adds a lookup that runs BEFORE the env pair and falls through to it,
-- never a lookup that replaces it.
--
-- EMAIL IS LOWERCASED AT THE BOUNDARY, NOT BY citext. citext is an extension,
-- and an extension is a privilege this connection may not have on a managed
-- Postgres. A unique index on lower(email) needs nothing installed and gives the
-- same guarantee: two rows differing only in case cannot both exist. The
-- application lowercases before it reads or writes, so the index is enforcing an
-- invariant the code already holds rather than papering over one it does not.
--
-- ROLE AS A CHECK CONSTRAINT, NOT AN ENUM TYPE. Adding a value to a Postgres
-- enum is its own migration with its own locking behaviour; widening a check
-- constraint is a one-line alter. Three roles today (admin, editor, ops) and the
-- cockpit v2 roadmap has more, so the cheaper-to-change form is the right one.
-- The application does not trust this constraint for authorisation — it is a
-- data-integrity backstop, and every server action re-checks the role itself.
--
-- disabled RATHER THAN DELETE. There is no delete path anywhere in this cockpit
-- (round 17 §3), and an account is not an exception: disabling leaves the row
-- that a future audit log will need to attribute past actions to.
--
-- NO SEED ROW. This migration creates no user. Real accounts are Sumeet's to
-- create in the Users pane; a session that invents a person invents a person
-- whether the person is a byline or a login.
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text        not null,
  name          text        not null,
  role          text        not null check (role in ('admin', 'editor', 'ops')),
  password_hash text        not null,
  disabled      boolean     not null default false,
  created_at    timestamptz not null default now()
);

-- The uniqueness that matters is case-insensitive: Raphy@yallo.co and
-- raphy@yallo.co are one person, and two rows for one person is two passwords
-- for one person.
create unique index if not exists users_email_lower_idx
  on users (lower(email));
