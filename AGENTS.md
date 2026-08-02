# AGENTS.md — talent.yallo.co (yallo-co)

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
- Two sessions in one repository use two branches, two worktrees and two
  build directories. `NEXT_DIST_DIR` is honoured by `next.config.ts`;
  `.claude/launch.json` carries `session-a` on 3001 and `session-b` on
  3002. Sharing `.next` is how a whole measurement pass came to describe
  a stale build. Stage explicit paths, never `git add -A`. `next dev`
  rewrites `tsconfig.json` to add its dist dir's types and reformats the
  file while it is there — revert it, never stage it.
- Before trusting any measurement, check WHICH server is on the port.
  `next start` on a stale build answers 200 and never shows your edits,
  and a job killed in one shell does not die in the next. `lsof -ti:PORT`.

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
