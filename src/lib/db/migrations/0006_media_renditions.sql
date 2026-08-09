-- Media renditions — design §9, round 25c item 2.
--
-- ADDITIVE ONLY, like 0005. Nothing here drops or rewrites a column, and the
-- default makes every existing row valid the moment it lands.
--
-- WHY A COLUMN RATHER THAN A SECOND TABLE. One upload produces a fixed, small
-- set of renditions that are only ever read together, written once and never
-- queried across assets. A join table would buy a query nobody issues and cost
-- a join every list render. The set is closed by MEDIA_WIDTHS in
-- src/lib/media/config.ts, so this is not an open bag of keys.
--
-- WHY THE WIDTHS ARE NOT IN THE SCHEMA. They are a fact about the templates,
-- not about the data: `.prose` is 72ch, and the widths follow from it. Putting
-- them in a check constraint would mean a CSS change needing a migration.
alter table media_assets
  add column if not exists renditions jsonb not null default '[]'::jsonb;

-- The original's intrinsic size, so a rendition set can never be upscaled past
-- it and the editor can reserve the right box before the image loads. Nullable:
-- rows imported before this migration have no measurement, and inventing one
-- would be worse than admitting it is unknown.
alter table media_assets
  add column if not exists source_width integer;
alter table media_assets
  add column if not exists source_height integer;

-- Who archived it and when. `archived_at` already exists; without the actor
-- the audit trail has a gap exactly where the only destructive-looking act in
-- the library is.
alter table media_assets
  add column if not exists archived_by text;

create index if not exists media_assets_archived_idx on media_assets (archived_at);
