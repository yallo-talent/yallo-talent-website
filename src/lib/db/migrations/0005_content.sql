-- Articles, case studies, revisions and media — round 25 §2, and the schema
-- that makes canon A1 true: the database becomes the source of truth for these
-- two content types and the repository stops being one.
--
-- ADDITIVE ONLY. Nothing here drops, alters or reads an existing table. The
-- live database carries submissions, assistant_transcripts and users, and this
-- migration runs against it before the code that uses it merges, per the
-- standing rule that a migration lands before or with its deploy, never after.
--
-- CHECK CONSTRAINTS, NOT POSTGRES ENUM TYPES, and 0004 already argued this:
-- adding a value to an enum type is its own migration with its own locking
-- behaviour, and widening a check constraint is a one-line alter. The design
-- document says "status is an enum" meaning the value set is closed, which a
-- check constraint closes just as firmly. The application does not trust either
-- for authorisation or for validation; publish-time enforcement is in the
-- publish action, and this is a data-integrity backstop.
--
-- NOTHING IS EVER HARD DELETED. `archived` is the terminal status, so a URL
-- that ever published can always be resolved or redirected. There is no delete
-- path in this schema and no cascade that would create one: content_revisions
-- and content_audit both reference their subject by a plain uuid rather than by
-- a foreign key with ON DELETE, because a revision that vanishes with its
-- article is not a revision record.
--
-- BODY IS jsonb, NOT text. TipTap document JSON is the canonical body format
-- and it is rendered server-side through an allow-list of node types. jsonb so
-- a future query can reach inside a body without parsing it in application
-- code; the allow-list renderer is what keeps arbitrary markup out, not the
-- column type.
--
-- TAXONOMY AS text[], NOT A JOIN TABLE. The values are read from the live
-- taxonomy indexes in src/data and validated at publish; they are slugs from a
-- closed set that ships in the repository, so a second table would be a copy of
-- something the code already holds, and copies drift. Postgres arrays index
-- with GIN, which is what the single-facet landing pages need.

-- ── The fourth role ───────────────────────────────────────────────────────
-- Canon A4 puts `owner` above `admin`, and 0004's check constraint knows three
-- roles. Widening a check constraint is the one-line alter 0004 said it would
-- be. It ships here rather than in its own migration because the four-role
-- change and the content engine are one round and one deploy: a database that
-- accepts `owner` before the code that issues it exists is harmless, and the
-- reverse is a sign-in that fails on a constraint.
alter table users drop constraint if exists users_role_check;
alter table users add constraint users_role_check
  check (role in ('owner', 'admin', 'editor', 'ops'));

-- ── Articles ──────────────────────────────────────────────────────────────
create table if not exists articles (
  id                  uuid primary key default gen_random_uuid(),
  slug                text        not null,
  title               text        not null,
  summary             text        not null default '',
  category            text        not null default '',
  body                jsonb       not null default '{"type":"doc","content":[]}'::jsonb,
  status              text        not null default 'draft'
                        check (status in ('draft','review','scheduled','published','archived')),

  industry            text[]      not null default '{}',
  platform            text[]      not null default '{}',
  discipline          text[]      not null default '{}',

  -- Every figure in the body needs a matching entry here before it publishes.
  sources             jsonb       not null default '[]'::jsonb,

  -- SEO and GEO. Nullable rather than defaulted: null means "derive it", and an
  -- empty string means "the author cleared it", which are different intents.
  meta_title          text,
  meta_description    text,
  canonical_url       text,
  og_image_url        text,

  -- Computed, never asserted by hand — canon and design §4 both say so.
  reading_time_minutes integer    not null default 0,
  word_count          integer     not null default 0,

  -- The slug freezes at first publish; a change after that writes a redirect.
  first_published_at  timestamptz,
  published_at        timestamptz,
  scheduled_for       timestamptz,

  created_by          uuid,
  updated_by          uuid,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- One slug, one article, case-insensitively — the same reasoning as users'
-- email index in 0004, and for the same reason: a URL is not case-sensitive to
-- the person typing it, so two rows differing only in case is one broken route.
create unique index if not exists articles_slug_lower_idx on articles (lower(slug));
create index if not exists articles_status_idx on articles (status);
create index if not exists articles_published_at_idx on articles (published_at desc);
create index if not exists articles_industry_idx on articles using gin (industry);
create index if not exists articles_platform_idx on articles using gin (platform);
create index if not exists articles_discipline_idx on articles using gin (discipline);

-- ── Case studies ──────────────────────────────────────────────────────────
-- Everything an article has, plus the consent discipline canon §8 requires and
-- the integer position the homepage rail and /case-studies both read.
create table if not exists case_studies (
  id                  uuid primary key default gen_random_uuid(),
  slug                text        not null,
  title               text        not null,
  summary             text        not null default '',
  category            text        not null default '',
  body                jsonb       not null default '{"type":"doc","content":[]}'::jsonb,
  status              text        not null default 'draft'
                        check (status in ('draft','review','scheduled','published','archived')),

  industry            text[]      not null default '{}',
  platform            text[]      not null default '{}',
  discipline          text[]      not null default '{}',
  sources             jsonb       not null default '[]'::jsonb,

  -- A study may not publish naming a client until consent is recorded, and the
  -- recorder and the date are captured rather than implied. client_public false
  -- is the honest default: it renders the study without the name.
  client              text        not null default '',
  client_public       boolean     not null default false,
  consent_recorded_by text,
  consent_recorded_at timestamptz,
  logo_consent        boolean     not null default false,

  -- The free-text platform DESCRIPTOR, which is not the platform taxonomy and
  -- must not be confused with it. Existing values are "SAP S/4HANA", "Oracle
  -- Hyperion", "Multi-platform", "Custom planning platform", "Target operating
  -- model" — sentences a reader sees on the card, and the string the platform
  -- module pages substring-match to decide which studies to show. The taxonomy
  -- arrays above are slugs from the live indexes. Two different things that both
  -- want to be called "platform", so both are named for what they are.
  platform_label      text,
  engagement          text,
  region              text,
  deck                text,
  source_url          text,
  card_title          text,
  excerpt             text,
  outcome             text,
  -- Each metric carries its own source; the publish action refuses one without.
  metrics             jsonb       not null default '[]'::jsonb,

  -- Drag and drop writes this. Lower sorts first. Not unique: a reorder that
  -- had to keep every row distinct mid-transaction is a reorder that needs a
  -- deferred constraint to work at all, and the read path only needs an order.
  position            integer     not null default 0,

  meta_title          text,
  meta_description    text,
  canonical_url       text,
  og_image_url        text,

  reading_time_minutes integer    not null default 0,
  word_count          integer     not null default 0,

  first_published_at  timestamptz,
  published_at        timestamptz,
  scheduled_for       timestamptz,

  created_by          uuid,
  updated_by          uuid,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create unique index if not exists case_studies_slug_lower_idx on case_studies (lower(slug));
create index if not exists case_studies_status_idx on case_studies (status);
create index if not exists case_studies_position_idx on case_studies (position);
create index if not exists case_studies_platform_idx on case_studies using gin (platform);
create index if not exists case_studies_industry_idx on case_studies using gin (industry);

-- ── Revisions ─────────────────────────────────────────────────────────────
-- This is what replaces git history, and it is the reason "no git copy" is
-- safe. Every save writes one. The body is stored whole rather than as a diff:
-- a diff chain is only as good as its oldest link, and restoring a revision has
-- to be a single read that cannot fail halfway.
create table if not exists content_revisions (
  id            uuid primary key default gen_random_uuid(),
  content_type  text        not null check (content_type in ('article','case_study')),
  content_id    uuid        not null,
  title         text        not null default '',
  summary       text        not null default '',
  body          jsonb       not null,
  -- Denormalised on purpose. An account can be disabled and a break-glass
  -- session has no row at all, and "who wrote this" must still answer.
  author_id     uuid,
  author_name   text        not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists content_revisions_subject_idx
  on content_revisions (content_type, content_id, created_at desc);

-- ── Media ─────────────────────────────────────────────────────────────────
-- Objects live in the yallo-talent-media Space; this table is the index and the
-- alt text. `alt` is not null and not defaulted to empty, because an image that
-- publishes without alt text is canon A2 rule 7 broken, and the cheapest place
-- to make that impossible is here.
create table if not exists media_assets (
  id            uuid primary key default gen_random_uuid(),
  object_key    text        not null,
  url           text        not null,
  alt           text        not null,
  caption       text,
  mime_type     text        not null default '',
  width         integer,
  height        integer,
  byte_size     integer,
  -- Archive, never delete. The library refuses to archive anything in use.
  archived_at   timestamptz,
  created_by    uuid,
  created_at    timestamptz not null default now()
);

create unique index if not exists media_assets_object_key_idx on media_assets (object_key);

-- ── Redirects written by a slug change ────────────────────────────────────
-- src/data/redirects.mjs stays the source of truth for the structural estate.
-- This table holds only what a slug change generates, which cannot live in the
-- repository once content does not.
create table if not exists content_redirects (
  id          uuid primary key default gen_random_uuid(),
  from_path   text        not null,
  to_path     text        not null,
  created_at  timestamptz not null default now()
);

create unique index if not exists content_redirects_from_idx on content_redirects (from_path);

-- ── Audit ─────────────────────────────────────────────────────────────────
-- Design §10: required rather than deferred. With four roles and a growing
-- team, "who published that" must have an answer.
create table if not exists content_audit (
  id            uuid primary key default gen_random_uuid(),
  content_type  text        not null,
  content_id    uuid,
  action        text        not null,
  actor_id      uuid,
  actor_email   text        not null default '',
  actor_role    text        not null default '',
  detail        jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists content_audit_subject_idx
  on content_audit (content_type, content_id, created_at desc);
create index if not exists content_audit_created_idx on content_audit (created_at desc);
