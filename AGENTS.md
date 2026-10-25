# AGENTS.md — yallo-co runtime contract
> Customised for `yallo-co` on 2026-10-26 from the saasinator template. Thin pointer: canon wins on conflict, and the group baseline's rules are never restated here. Old clause map: `docs/agent-guide/MIGRATION-2026-10-26.md`.
## 1. Project Context
- **Engagement:** `yallo-co` · **Archetype:** pending: not recorded in this repo · **Sandbox:** No: live site, real production database · **Deliverable:** the Yallo Talent website at yallo.co, replacing WordPress; domain ruling (chat, round 14): yallo.co is Yallo Talent's own domain, `talent.yallo.co` only a pre-cutover noindex placeholder (`robots.ts`), so any repo text treating it as permanent is stale.
## 2. Autonomy Level
- **pending: not recorded**; publishing decisions are Sumeet's (R-A9, `docs/agent-guide/ownership-and-publishing.md`): execute, never editorialise; one factual concern, once, in the relay after the work.
## 3. Mandatory Reading (in this order)
- `PRODUCT.md`, `DESIGN.md` (records ratified decisions; where it disagrees with `globals.css` or canon it is the stale one), `docs/agent-guide/canon-and-phases.md`, then the `docs/design/context-*.md` the dispatch names; no `STRUCTURE.md`, brief or ODPA instance exists yet.
## 4. Source-of-truth hierarchy
- Method canon (group baseline, Source of truth) beats engagement canon (`docs/architecture/`, `spec/`, `PRODUCT.md`, `DESIGN.md`), which beats this file, the runtime contract; operational canon is the latest ratified `docs/design/context-*.md`.
## 5. Five-Lens model (engagement-instantiated)
- Two lenses and the Build lens's roles: `~/Claude/yallo-knowledge/saif-methodology/OPERATING_MODEL.md` §4; who writes, commits and pushes, `~/Claude/yallo-knowledge/saif-methodology/RELAY_HEADER_PROTOCOL.md` §5. Sponsor: Sumeet Goenka. Spec author's design duty: in scope.
## 6. Mandatory Skills (snapshotted from user-global registry 2026-10-26)
- Each role loads its card's `skills:`; repo subagents in `.claude/agents/` (architect, uiux-emil, content-strategist, seo-geo-aeo, performance-qa), one per discipline in `docs/architecture/teamand tools_v2.html`. Project-specific skills in `./skills/`: none.
## 7. Project-Specific Rules
- A load-bearing mirror or template gets both R-B5 checks (section list and per-section content), then `~/Claude/yallo-knowledge/saif-methodology/scripts/check-owned-facts.mjs` against `~/Claude/yallo-knowledge/saif-methodology/RELAY_HEADER_PROTOCOL.md` §10b.
### Branch + commit format
- **Trunk:** `main`; declared departure from the solo regime: merges by pull request only, Raphy Varghese reviews and operates after deployment. **Remote:** Yes: push the branch after the local gate.
- **Commit message:** Conventional Commits, `<type>(<scope>): <subject>`, types per `commitlint.config.js`; `src/data/**` changes use `data:`; stage explicit paths, never `git add -A`, and never a session-rewritten `tsconfig.json`.
### Forbidden imports / patterns
- No hex colour outside `src/app/globals.css` Layer 1 (`.claude/hooks/check-colours.js`, pre-commit); semantic tokens everywhere else.
### File hygiene
- Drift scan, atomic archive and scratch sweep apply; handovers are stamped consumed, never moved (`~/Claude/yallo-knowledge/saif-methodology/OPERATING_MODEL.md` §8.23.4). A per-session dist directory is deleted at the end of its round; every `docs/design/context-*.md` in the tree is committed in a run's first commit.
### Visual reference path
- `docs/deisgns/home/` (homepage sections, build order), `docs/architecture/l1_page_plan.html`, `l2_page_plan.html`.
## 8. Hard Rules for This Engagement
1. A new page template joins every enumerating guard in the commit that introduces it; `node scripts/check-gate-coverage.mjs` must pass; adding the route is the fix, silencing a guard never is.
2. The deploy runs no migrations: apply a migration to production with `pnpm db:migrate` and verify its `_migrations` row BEFORE opening its pull request; migrations are idempotent (`.claude/rules/db-migrations.md`).
3. Phase order 0 to 6 is fixed and the performance gate binds before DNS switch (`docs/agent-guide/canon-and-phases.md`); check which server is on a port (`lsof -ti:PORT`) before trusting any measurement.
