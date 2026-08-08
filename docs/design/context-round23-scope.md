# Context — Round 23: the order fix, RBAC live, the articles pane, the fast lane

**v1.0 · 8 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`, `DESIGN.md`, `AGENTS.md`. Standing rules: `context-round13-scope.md` §8 as amended by round 17 §1.1 (R-A9). Companion: `context-cockpit-v2.md` (Phase 1 is this round). Single session, overnight, unattended. Port 3115, dist `.next` — unless the checkout is not exclusively yours, in which case isolate in a worktree and say so in the relay.

Every premise below is tagged measured / expected / inferred. The site is live on yallo.co; treat every deploy-affecting step accordingly.

## 1. Rulings — adjudicated 8 August evening, none reopens

- **PRs #14–#18 cannot compose** (measured from the cockpit and Actions screenshots): each carries one move against the same stale base, so the survivor would encode one move, not the order Sumeet built. He has cancelled the CI runs. Close all five unmerged, delete their `admin/` branches, and say in each closing comment that round 23 supersedes them.
- **The final case-study order is ratified** (Sumeet, annotated screenshot, 8 Aug). Slug mapping below is **measured** against `content/case-studies/` and `order.yaml`'s client comments — verify each file's frontmatter agrees before committing; if any mapping disagrees with frontmatter, stop that item and relay it rather than guessing.
- **`optimising-enterprise-it-delivery-through-a-unified-partner-model` (MAF) is DELETED, files entirely** — Sumeet's explicit ruling tonight; it supersedes the unpublish-only default for this one study. Same commit removes its `order.yaml` line (the file's own rule), its MDX, any assets only it references, and adds one redirect row `/case-studies/optimising-enterprise-it-delivery-through-a-unified-partner-model` → `/case-studies` in `src/data/redirects.mjs` (one hop, never the homepage). Regenerate the published manifest; `check:redirects`, `check:yallo-case`, `check:cs-excerpts` all green.
- **Footer: Yallo AI Academy joins the Yallo Group names, linked to `https://academy.yallo.co`, now.** Sumeet's instruction, reconfirmed tonight against the measured fact that the host answered 503 at 18:48 GST on 8 Aug. Ship as instructed; note the measurement once in the relay and nowhere else. Match the existing sibling-link treatment exactly.
- **RBAC ships fully live tonight** (Sumeet's ruling, offered spec-first and declined). §3.
- **Delegated, logged for veto:** CI content-fast lane (§5), batch publish (§4), and the ordering of work in this file.

## 2. Final order for `content/case-studies/order.yaml`

1. `engineering-a-custom-planning-platform` — Alshaya
2. `oracle-hyperion-financial-management-hfm-implementation` — MAF
3. `enabling-sap-s-4hana-transformation-for-al-tayer-group` — Al Tayer
4. `enabling-supply-chain-transformation-through-targeted-delivery-expertise` — Chalhoub
5. `building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets` — Al Othaim
6. `defining-a-target-operating-model-for-sephora-middle-easts-digital-carve-out` — Sephora ME
7. `enabling-azure-data-platform-delivery-at-enterprise-scale` — Alshaya
8. `unlocking-cost-efficiency-across-multi-platform-enterprise-it-landscape` — MAF
9. `driving-consistent-it-delivery-across-a-complex-retail-technology-landscape` — Alshaya

Keep the file's header comments and per-slug client comments (the write-path invariant `check:write-path` already asserts this).

## 3. RBAC — the spec

**Data.** Migration `0004_users.sql`, additive: `users` (id, email unique citext or lower-indexed, name, role in ('admin','editor','ops'), password_hash, disabled boolean default false, created_at). Scrypt via the existing `password.ts` (the `maxmem` and unescape lessons already live there — reuse, do not fork). **Migration runs against the live database before the code merges** — the 0003 standing rule; the failure mode is sign-in code querying a column that does not exist, on the live site.

**Auth.** Auth.js credentials provider looks up `users` first; if no row matches, fall through to the env `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH` pair, which maps to role admin. **The env break-glass is the rule that must never regress: locking the owner out of the live cockpit overnight is the worst available failure, so prove env sign-in green in `check:admin-render` both before and after the change.** Session JWT carries `role`.

**Enforcement, two layers** (a UI that hides a link is not access control): middleware/layout guard per route group, and every server action re-checks role. Pane map per `context-cockpit-v2.md` §2 — conversations and briefs-write and users are admin-only; articles and case studies admin+editor; briefs read admin+ops. The `/privacy` constraint is load-bearing: conversations stay admin-only and `/privacy` copy is untouched.

**Users pane** (admin only): list, create (generated temp password displayed once, never logged, never emailed), reset password, disable. No self-disable for the last enabled admin. **Create no real user rows** — a test fixture inside the gate teardown only. Sumeet creates real accounts tomorrow.

**Gates.** Extend `check:admin-isolation` to role reach: an editor session reaching `/admin/conversations` or `/admin/users` must fail it — red-prove by temporarily granting, watch it fail, revert. Extend `check:admin-render` to render each pane under each permitted role using fixture users created and removed by the gate itself.

## 4. Articles pane — enabled, full lifecycle, content forbidden

The pane ships; article content does not. All existing insights stay `published: false`; create and publish **no** articles; the template/visual work is Raphy's per the handover brief.

Lifecycle on `content/insights/*.mdx` through the existing PR path: list with published state · create from a frontmatter template (schema enforced client and server; slug from title, lowercase-hyphen) · edit frontmatter and body · publish toggle · validation before any PR opens, refusing: schema violations, unknown taxonomy slugs, any number in the body without a matching `sources` entry (the build's own rule, surfaced in the form) · byline fixed to "Yallo Talent", not an input (canon §8). Editor role has full access here. Batch semantics per §5 apply to article ordering if ordering exists; otherwise per-article PRs are correct because each is one editorial act.

## 5. Batch publish and the CI fast lane

**Batch publish.** Order changes stage in the pane (optimistic UI, clearly marked unpublished-state), one "Publish order" action diffs staged against committed and opens ONE PR. The per-move PR path is removed for ordering. An abandoned staged state survives refresh or is plainly discarded — either, but visibly.

**Fast lane.** In `ci.yml`: if the diff touches only `content/**`, run the content gates (schema, excerpts, headings, redirects table static check, manifest, write-path, taxonomy static) — minutes, not 22. Any change under `src/`, `scripts/`, config or workflows runs the full suite. **Both paths must conclude in the same required context `checks`** — use a gate job that `needs:` whichever branch ran; verify by API that branch protection still lists exactly `["checks"]`, because a renamed context leaves auto-merge queued forever and every cockpit publish silently stops. Then prove the lane: one throwaway `content/**` PR, watch it auto-merge on the fast path, and revert it in the same session.

## 6. Documentation and measures (after 1–5, none optional)

- **Relay v31:** if it exists uncommitted in the tree, commit it; if not, write it from the post-cutover git log — facts and SHAs only, no reconstruction of reasoning you do not have.
- **Runbook v1.2** (`docs/status/CUTOVER-RUNBOOK.md`): fold the four amendments from the 8 Aug handover — the www job-board clause, SSL still `full` deliberately with the grey-cloud window note, Phase 4 (WordPress teardown) voided pending CORE.03, the 18 vanity redirects now in `redirects.mjs`. Canon itself is not edited; propose any canon-touching wording in `QUESTIONS.md`.
- **Phase 8, measured where it matters at last:** Lighthouse mobile against `https://yallo.co` production routes (the round 20 set). Report per-route numbers in the relay; change nothing on the strength of them.
- **`dev.yallo.co`:** identify where it is served from (Cloudflare DNS read with the existing token). If it is the droplet: `noindex` header plus a 403 or auth wall in Caddy, without touching the `www` job-board block. If it is anywhere else: report only.

## 7. Forbidden this round

No invented people, users, articles, clients, metrics or dates. No edits to `/privacy`, canon, or `DESIGN.md`. No credential entry; generated temp passwords are displayed by the running app to its signed-in admin, never written to logs, relays or files. No changes to the `www.yallo.co` Caddy block or anything on the Volcanic path. No em dashes, UK English, canon vocabulary. Explicit commit paths, never `git add -A`. Migration before merge. If you stop early, stop between numbered items with everything behind you finished and pushed.
