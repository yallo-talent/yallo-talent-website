# Canon, phase order and the pre-launch gate

Loaded on demand, named by plain path from `AGENTS.md`. Moved from the root instruction files on 26 Oct 2026; no rule changed.

## Source of truth

| Domain | Canonical surface |
|---|---|
| Phase-by-phase execution plan | `docs/architecture/exicution.html` |
| System architecture, data model, routes | `docs/architecture/arc_v10.html` |
| Page template mockups | `docs/architecture/l1_page_plan.html`, `docs/architecture/l2_page_plan.html` |
| Homepage | `docs/deisgns/home/`: 11 sections, numbered in build order |
| Product | `PRODUCT.md` |
| Design | `DESIGN.md`: records ratified design decisions, does not propose them; where it disagrees with `src/app/globals.css` or the canon, it is the stale one and gets corrected |
| Open questions | `QUESTIONS.md` |
| Longer-form canon | `docs/`, `spec/` |
| Team | `.claude/agents/`: architect, uiux-emil, content-strategist, seo-geo-aeo, performance-qa, one subagent per discipline in `docs/architecture/teamand tools_v2.html` |
| Group baseline | workspace-root `CLAUDE.md`, canonical copy `~/Claude/yallo-knowledge/saif-methodology/templates/claude-md/GROUP-BASELINE.md` |

## Phase order (fixed)

0 Scaffold, 1 Design System/TS, 2 Homepage, 3 Service Pages/Templates, 4 Industry/Platform Taxonomy, 5 Capabilities/Knowledge Hub, 6 Jobs Portal/QA/Perf Gate. Full detail in `docs/architecture/exicution.html`.

## Performance gate before DNS switch

Lighthouse Mobile 90+, LCP under 2.5s, CLS under 0.1, INP under 200ms, WCAG 2.2 AA. `pnpm check:phase8` measures it (`scripts/check-phase8.mjs`).
