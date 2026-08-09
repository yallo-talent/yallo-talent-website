# Context — Round 25: the publishing engine

**v1.1 · 9 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` as amended by `canon-amendment-2026-08-09.md`; design in `context-cockpit-v3.md`; `DESIGN.md` governs every rendered surface. Standing rules: `context-round13-scope.md` §8 as amended (R-A9). The site is LIVE on yallo.co. Single session; this round is large, so stop cleanly between numbered items and leave the rest for 25b rather than half-finishing anything.

*v1.1 adds §0a (relay v33 adjudication and rulings) and §9b (hygiene), and widens §0's preconditions. The specification in `context-cockpit-v3.md` is unchanged and remains the bar: nothing in this revision reduces the editor, publishing, SEO, media or roles scope.*

This round is the first of two. Round 26 rebuilds briefs and conversations; nothing in this file touches them beyond the role guards.

## 0a. Relay v33 — adjudicated, with rulings

**Accepted in its entirety.** All seven items verified as reported; the production checklist, the 72-second auto-merge proof, the twice-red-proven `check:sources`, the append-not-replace edge rule and the Spaces appendix are all ratified. Both retractions are ratified, and the second is the model of the discipline: **`check:interaction` is right and the site is wrong.** The capture-the-log-before-re-running instruction is now standing practice.

Rulings, each under delegated authority and logged for Sumeet's veto:

- **R-25.1, the FAB occlusion defect (v33 §13, open item 7):** move `.railPause` to the rail's LEFT edge below 640px. Of the three candidates it is the only one that fixes touch as well as keyboard. The FAB itself is canon A3 allow-listed and does not move. Fix it as the class it is: assert in the gate that no fixed overlay's horizontal range contains an interactive control's at any tested width, so the next `right: 12px` twin cannot ship.
- **R-25.2 (open item 3):** rename the local `module` variable in `src/data/platforms/derive.ts`; close the last eslint error.
- **R-25.3 (open item 4):** once R-25.2 lands, add `pnpm lint` (eslint) to the FULL CI lane only. Biome stays everywhere it runs. The retire-eslint question stays open for Sumeet; this simply stops the drift.
- **R-25.4 (open item 5):** the two pre-existing untracked documents (`docs/gtm/platform-employer-signals-2026-08-02.md`, `docs/relay/chat-handover-2026-08-08-post-cutover.md`) join this round's ground commit as historical record. They are documentation, not code.
- **R-25.5 (open item 6):** confirmed intended: the three round-25 documents commit at THIS round's ground, and the canon amendment stays unfolded until this round's item 1 folds it.
- **Ratified without change:** squash as the merge convention; `round23` and `proof/` branches stay undeleted; the `dev.yallo.co` droplet question (open item 9) stays with Sumeet and Raphy and is not a build item.

## 0. Before anything — the preconditions, in order

1. **Merge PR #22** (round 24), watch the deploy to ACTIVE, smoke `/` and `/admin` posture. The four signature banners must then answer 200 at `https://yallo.co/images/email/signature-light-72h-shortlist.png` (spot one).
2. **Fix R-25.1 on a short branch cut from `main`**, red-to-green through `check:interaction` with the widened assertion, and merge it. This unblocks PR #23, which is deliberately RED on that defect.
3. **Bring PR #23 green and merge it** (it carries the Spaces CDN host that item 7 needs). Green must come from the fix, never from re-running until the probe misses.
4. Then cut `round25` from that `main`. Ground commit on the branch: `context-cockpit-v3.md`, `canon-amendment-2026-08-09.md`, this file, and the two R-25.4 documents.

**Read `context-cockpit-v3.md` in full before writing code.** It is the specification; this file is the order of work and the constraints. Where they appear to disagree, the design document wins on what, this file wins on how far.

## 1. Canon first

Fold `canon-amendment-2026-08-09.md` into canon in canon's own voice and numbering: A1 and A2 into §9, A3 into §5, A4 into §8, A5 into §3. Preserve surrounding text; the amendment file stays in the repository as the record. Then update `/privacy` to the exact wording in A4. That wording is ratified and is not to be improved, softened or extended.

## 2. Schema and import

`0005_content.sql`, applied to the live database before the code merges, per the standing rule. Tables per the design document §3: `articles`, `case_studies`, `content_revisions`, `media_assets`, with a status enum and no hard delete anywhere.

Import every existing article and case study from `content/**` into the database: 21 insights (all unpublished, and they stay unpublished) and 9 case studies (all published, and they stay published in exactly the order `order.yaml` currently holds). Convert MDX bodies to TipTap document JSON. **Verify the import by rendering: every published case study must render byte-comparable prose to what production serves today, and any divergence stops the import rather than being accepted.** Only when that holds, retire the `content/**` files for these two types in the same commit, along with the gates and scripts that read them. Git history keeps them; nothing new is written back to git.

## 3. Roles and privacy enforcement

Four roles per canon A4, replacing three. `owner` is a new role above `admin`; the environment break-glass maps to `owner`. Neither an admin nor an owner may demote or disable the owner. `admin` now reaches conversations and briefs, which is a widening, so the `/privacy` wording from item 1 must already be live before this ships. Extend the role gates and red-prove each one, as round 23 did.

Create no real accounts. Sumeet creates his own, Raphy's and the team's.

## 4. The editor

TipTap, the node set in design document §4, autosave with a visible saved state, revision history with preview and restore, side-by-side preview in the real template at both themes and both widths, full-screen mode, computed reading time and word count. The editing surface obeys `DESIGN.md`: this is the writer's workshop and it should look like the publication it produces, not like a form.

Three taxonomy dropdowns plus category per design §5, sourced from the live indexes and never retyped. At least one taxonomy value is mandatory to publish.

## 5. Publish, instantly, with validation that bites

Publishing writes the row in one transaction and revalidates the article route, the index, the affected taxonomy routes, the homepage rail, the sitemap and `llms.txt`. No PR, no build, no wait.

Every rule in canon A2 is enforced in the publish action and refuses the publish with a message naming the field and the fault. Saving a draft is never blocked. **Red-prove all eight refusals**, each with a fixture the test creates and removes. A validation that has never been watched refusing is not a validation. The figure-sourcing rule keeps ONE detector: `src/lib/unsourced-figures.mjs` moves with the content, it is never reimplemented.

Sitemap and `llms.txt` become dynamic and read the database. Their route counts must match the published rows, asserted by a gate.

## 6. SEO and GEO fields

Per design §6, all of it: meta title and description with counters and derived defaults, canonical, OG and Twitter, OG image from an uploaded hero or PetalPlate, `BlogPosting` or `Article` schema with `Organization` as author, `BreadcrumbList`, `FAQPage` where an FAQ block exists, slug frozen after first publish with an automatic redirect row on change, automatic desk links from taxonomy, a related rail from shared taxonomy, and the answer-first warning.

## 7. Media

Uploads to the `yallo-talent-media` Space, whose five `SPACES_*` variables are live on the app (v33 appendix) and whose CDN host lands in `next.config.ts` when PR #23 merges at precondition 3. Server-side uploads only, resizing to template widths, modern formats, required alt text, a media library that refuses to delete anything in use. The key is bucket-scoped read/write; nothing touches `yallo-lms-assets`.

## 8. Public surfaces

`/insights` gains the filter controls and search per design §5; the three single-facet taxonomy families become real indexable pages with their own copy; multi-facet views canonicalise to `/insights` and carry `noindex`. The article template renders the TipTap node allow-list under `DESIGN.md`, both themes, 360px and 1280px, AA — and clear of the R-25.1 class by construction.

Case-study ordering becomes drag and drop with an integer position and one save; the homepage rail and `/case-studies` both read it. The staged-order cookie, its PR path and the case-study PR machinery are removed, not left dormant.

## 9. Gates and cleanup

Every gate that read `content/**` for these two types is either retired with its removal explained in the relay, or repointed at the database (`check:sources --selftest` in particular repoints, it does not retire: publish-time enforcement and the nightly sweep both keep using the one detector). Nothing is left failing or vacuously passing. `check:gate-coverage` must still see every rendering unit. Run the full suite and the accessibility gate over every new and changed surface, and report real exit codes.

## 9b. Hygiene, after the numbered items

R-25.2 (the `derive.ts` rename) and R-25.3 (eslint into the full lane) land as their own commits. Neither blocks the publishing engine; both close v33 open items.

## 10. Forbidden

No real user accounts. No article or case-study content authored, published or invented; the import moves what exists and nothing else; validation fixtures create and remove themselves. No changes to briefs or conversations beyond role guards. No edits to the `www.yallo.co` Caddy block, the Volcanic path or the dev droplet. No credential entry. No performance work against the Phase 8 baseline. UK English, no em dashes, canon vocabulary, explicit commit paths. Relay v34 at `docs/relay/v34.md`, standard shape, RETRACTIONS required even if empty, every gate with a watched exit code, the import verification evidence in full, the eight red-proofs individually, and the R-25.1 fix evidence (before and after occlusion measurements at 390px). End with the PR open and green, unmerged; merges are Sumeet's.
