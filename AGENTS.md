# AGENTS.md — yallo.co (yallo-co)

Domain, ratified: **yallo.co is Yallo Talent's own domain — there is no
permanent talent.yallo.co subdomain.** talent.yallo.co exists only as a
pre-cutover placeholder (noindex, per `robots.ts`); direct instruction,
chat, round 14. Any reference elsewhere in this repo to talent.yallo.co
as a live, permanent address is stale.

Contract-first Yallo Talent site. UK · ME · India. Next.js 16.2.12 / TS5
strict / Tailwind 4 / pnpm 10.x / Framer Motion 12. Static-generated, no
CMS at launch.

## Ownership
- **Sumeet Goenka** owns the codebase for the duration of the redesign
  and drives all commits during that window.
- **Handback to Raphy Varghese** at deployment: once the redesign is
  ratified and the DNS switch is scheduled, Raphy takes over ownership
  for deployment, DNS cutover and post-launch operations.

## Ground rules
- Zero hardcoded hex colours outside `src/app/globals.css` Layer 1 —
  enforced by `.claude/hooks/check-colours.js` on every commit.
- Data-file changes (src/data/**) use the `data:` commit type.
- Phase order is fixed: 0 Scaffold → 1 Design System/TS → 2 Homepage →
  3 Service Pages/Templates → 4 Industry/Platform Taxonomy → 5
  Capabilities/Knowledge Hub → 6 Jobs Portal/QA/Perf Gate. See
  docs/architecture/exicution.html for full detail.
- Performance gate before DNS switch: Lighthouse Mobile 90+, LCP <2.5s,
  CLS <0.1, INP <200ms, WCAG 2.2 AA.
- **A new page template joins every enumerating guard in the same commit
  that introduces it.** Twice in round 3 the list failed, not the rule:
  `/ai-talent` shipped six classes under the A4 type floor and
  `check-rendered-type` would have caught every one, but the page was
  not on its list. Run `node scripts/check-gate-coverage.mjs` — it reads
  the route tree from the filesystem and each guard's list from source,
  and fails when a rendering unit is visited by no guard at all. Adding
  the route is the fix; silencing the guard is not.
- **A single-session round uses one dist directory and one port.** The
  default is plain `.next`; do not invent a per-session name when there
  is no second session to collide with.
- Two sessions in one repository use two branches, two worktrees and two
  build directories. `NEXT_DIST_DIR` is honoured by `next.config.ts`;
  `.claude/launch.json` carries `session-a` on 3001 and `session-b` on
  3002. Sharing `.next` is how a whole measurement pass came to describe
  a stale build. **Any session that creates a per-session dist directory
  deletes it at the end of its round.** The convention was never wrong;
  nothing ever required the cleanup, and that omission is the whole
  cause. Round 16 swept what was left of it. Stage explicit paths, never
  `git add -A`. `next dev`
  rewrites `tsconfig.json` to add its dist dir's types and reformats the
  file while it is there. Under a custom `NEXT_DIST_DIR` the rewrite
  names that directory, so the file becomes session-local and must never
  reach a commit: `git checkout -- tsconfig.json` before staging, and
  never include it in an explicit path list.
- **A context document is not in play until it is committed.** Chat writes
  `docs/design/context-*.md` into one session's working tree; a parallel
  worktree cannot see an uncommitted file and reads the absence as a
  blocked task. In round 4 a P0 was nearly reported blocked for exactly
  this. Every `docs/design/context-*.md` present in the tree is committed
  in the first commit of a run, before any work that depends on it.
- Before trusting any measurement, check WHICH server is on the port.
  `next start` on a stale build answers 200 and never shows your edits,
  and a job killed in one shell does not die in the next. `lsof -ti:PORT`.
- **R-A9, ratified round 17: publishing decisions are Sumeet's.** No lens
  editorialises on what appears on the site, softens or defers a ratified
  instruction, or asks him whether he is sure. Where a lens disagrees
  with a commercial, positioning, tone or taste decision, it executes and
  says nothing. **One carve-out:** where a lens believes a figure is
  factually wrong or unsourced, or that something is being written about a
  real named person which that person did not supply, it says so **once,
  in the relay, after the work is done** — never as a mid-task question,
  never as a reason to pause, soften or defer. This amends
  `context-round13-scope.md` §8.5: a factual concern about published
  content belongs in the relay, after the fact, stated once.

## Source of truth
- `docs/architecture/exicution.html` — phase-by-phase execution plan
- `docs/architecture/arc_v10.html` — system architecture, data model, routes
- `docs/architecture/l1_page_plan.html` / `l2_page_plan.html` — page template mockups
- `docs/deisgns/home/` — 11 homepage sections, numbered in build order
- `DESIGN.md` — records ratified design decisions. It does not propose
  them: where it disagrees with `globals.css` or the canon, it is the
  stale one and gets corrected.

## Team (see .claude/agents/)
architect, uiux-emil, content-strategist, seo-geo-aeo, performance-qa —
one subagent per discipline in docs/architecture/teamand tools_v2.html.
