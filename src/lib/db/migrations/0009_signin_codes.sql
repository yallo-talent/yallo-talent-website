-- One-time sign-in codes for database accounts — R-28a.1.
--
-- WHY THIS EXISTS. Round 23 §7 ruled that a generated password is shown once on
-- screen and never emailed, and the reasoning behind that ruling is not being
-- contradicted: a plaintext password must never travel by email. What changed is
-- that there is no longer a password to travel. A one-time code expires, is
-- single use, and grants nothing once used.
--
-- The failure that forced it: four accounts were created on 13 Aug 2026, their
-- one-time passwords were shown once, were not captured, and four people were
-- locked out of a cockpit they need daily. A credential flow whose only recovery
-- is "generate another and read it off a screen again" fails exactly when
-- somebody needs it.
--
-- HASHED, NOT STORED. `code_hash` takes the same scrypt primitive as
-- `users.password_hash` (src/lib/admin/password.ts) rather than a second one. A
-- readable code column is a readable credential for the ten minutes it lives,
-- and the `dev-raphy` branch is a full copy of production data on a second
-- machine.
--
-- NO DELETE PATH. `consumed_at` is set; the row stays. Round 17 §3's
-- no-second-delete-path rule holds, and a sweep of consumed rows belongs to the
-- existing purge rather than to a new one.
--
-- `attempts` LIVES ON THE ROW, not in memory, or it resets on every deploy and
-- a six-digit code becomes a million guesses against one target.
--
-- APPLIED BY HAND AGAINST PRODUCTION BEFORE THIS MERGES, per AGENTS.md
-- R-27.3(a), then again by `pnpm db:migrate` on a fresh database. Every
-- statement is therefore written to survive being applied twice.
create table if not exists signin_codes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references users (id) on delete cascade,
  code_hash   text        not null,
  attempts    integer     not null default 0,
  consumed_at timestamptz,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

-- The lookup every verification does: the newest code for one account. The
-- rate-limit count reads the same index from the other direction.
create index if not exists signin_codes_user_created_idx
  on signin_codes (user_id, created_at desc);
