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

## Source of truth
- `docs/architecture/exicution.html` — phase-by-phase execution plan
- `docs/architecture/arc_v10.html` — system architecture, data model, routes
- `docs/architecture/l1_page_plan.html` / `l2_page_plan.html` — page template mockups
- `docs/deisgns/home/` — 11 homepage sections, numbered in build order

## Team (see .claude/agents/)
architect, uiux-emil, content-strategist, seo-geo-aeo, performance-qa —
one subagent per discipline in docs/architecture/teamand tools_v2.html.
