# Instruction-file migration, 26 Oct 2026

The root budget ratified on 26 Oct 2026 caps what a session loads at start at 150 lines, imports counted: repo `CLAUDE.md` 30, `AGENTS.md` 30. Before: `CLAUDE.md` 81 lines, `AGENTS.md` 102. Every clause of the old files is mapped below to its new home. Files under `docs/agent-guide/` and `.claude/rules/` are loaded on demand, never `@`-imported.

No `BEGIN/END:yallo-group-baseline` block existed in either file, and the repo is not listed in the canon consumers registry; the group baseline reaches this repo through the workspace-root `CLAUDE.md` import.

## Old CLAUDE.md

| Old clause | New home |
|---|---|
| `@AGENTS.md` import | `CLAUDE.md` line 2 |
| Thin pointer; `AGENTS.md` outranks on conflict | `CLAUDE.md` §0 |
| Group baseline loads from workspace root; canonical copy path | `docs/agent-guide/canon-and-phases.md` table |
| §0 source-of-truth table (AGENTS, PRODUCT, DESIGN, QUESTIONS, docs, spec, work items, schema) | `CLAUDE.md` §0; full table `docs/agent-guide/canon-and-phases.md` |
| §1 project, pillar, status | `CLAUDE.md` §1 |
| §1 owner, Operator ruling 17 Aug 2026, Raphy at deployment | `CLAUDE.md` §1; detail `docs/agent-guide/ownership-and-publishing.md` |
| §2 stack and commands | `CLAUDE.md` §2 |
| §2 `check:*` gate family; run what a change touches; `check:gate-coverage`; never claim a pass without the exit code | `CLAUDE.md` §4; detail `docs/agent-guide/gates.md` |
| §2 CI workflow list | `docs/agent-guide/gates.md` |
| §2 Deploy "TBC" | Replaced by measured state: `CLAUDE.md` §2 (DigitalOcean App Platform, `docs/status/CUTOVER-RUNBOOK.md`) |
| §3 layout (src, content, assets/public, scripts, e2e, test-results, prototype, .next, tsbuildinfo) | `CLAUDE.md` §3 |
| §4.1 read `AGENTS.md` then this file | Satisfied mechanically by the `@AGENTS.md` import |
| §4.2 UK English; "Yallo", never "YALLO" | Dropped: baseline Language line ("UK English everywhere") and Identity casing line; enforcement noted in `docs/agent-guide/gates.md` |
| §4.3 yallo.co is Yallo Talent's domain; talent.yallo.co placeholder | `AGENTS.md` §1 (also baseline Domain architecture line) |
| §4.4 no fabricated people, clients, metrics, quotations, dates | Dropped: baseline Non-fabrication first line |
| §4.5 never commit secrets; `.env*` gitignored | Dropped: baseline Confidentiality first line |
| §4.6 merges to `main` via pull request, never direct | `CLAUDE.md` §4; `AGENTS.md` §7 Branch + commit format |
| §5 worktrees (`../yallo-talent-sig`, `git worktree list`) | `docs/agent-guide/sessions-and-worktrees.md` |
| §6 directory rules in `.claude/rules/*.md` | `CLAUDE.md` §5 (first rules file now exists: `db-migrations.md`) |

## Old AGENTS.md

| Old clause | New home |
|---|---|
| Domain ruling (round 14): yallo.co own domain; talent.yallo.co placeholder; references stale | `AGENTS.md` §1 |
| Contract-first, UK/ME/India, stack versions, static, no CMS | `CLAUDE.md` §1 and §2 (exact versions: `package.json`) |
| Ownership: Sumeet during redesign; handback to Raphy | `docs/agent-guide/ownership-and-publishing.md`; summary `CLAUDE.md` §1 |
| No hardcoded hex outside `globals.css` Layer 1, hook enforced | `AGENTS.md` §7 Forbidden patterns |
| `src/data/**` changes use `data:` | `AGENTS.md` §7 Branch + commit format |
| Phase order 0 to 6, `exicution.html` | `docs/agent-guide/canon-and-phases.md`; pointer `AGENTS.md` §8.3 |
| Performance gate before DNS switch | `docs/agent-guide/canon-and-phases.md`; pointer `AGENTS.md` §8.3 |
| Deploy runs no migrations; apply before merge; `_migrations` row; idempotent; 0008 worked example; open item | `.claude/rules/db-migrations.md` (verbatim); summary `AGENTS.md` §8.2 |
| New page template joins every enumerating guard; round 3 history; `check-gate-coverage.mjs` | `AGENTS.md` §8.1; full text `docs/agent-guide/gates.md` |
| Single-session round: one dist directory, one port | `docs/agent-guide/sessions-and-worktrees.md` |
| Two sessions: two branches, worktrees, build dirs; `NEXT_DIST_DIR`; launch.json sessions | `docs/agent-guide/sessions-and-worktrees.md` |
| Per-session dist directory deleted at round end | `AGENTS.md` §7 File hygiene; full text sessions file |
| Stage explicit paths, never `git add -A` | `AGENTS.md` §7 Branch + commit format; sessions file |
| `tsconfig.json` rewritten by `next dev`; never commit it | `AGENTS.md` §7 Branch + commit format; sessions file |
| Context document committed in a run's first commit | `AGENTS.md` §7 File hygiene; sessions file |
| Check which server is on the port; `lsof -ti:PORT` | `AGENTS.md` §8.3; sessions file |
| R-A9: publishing decisions are Sumeet's; carve-out; amends round 13 §8.5 | `docs/agent-guide/ownership-and-publishing.md` (verbatim); summary `AGENTS.md` §2 |
| Source of truth list (exicution, arc_v10, l1/l2, deisgns/home) | `docs/agent-guide/canon-and-phases.md`; `AGENTS.md` §3, §4, Visual reference path |
| `DESIGN.md` records, never proposes; stale on disagreement | `AGENTS.md` §3; `docs/agent-guide/canon-and-phases.md` |
| Team subagents in `.claude/agents/` | `AGENTS.md` §6; `docs/agent-guide/canon-and-phases.md` |

## Dropped as baseline duplicates: 3

UK English and casing, non-fabrication, secrets (rows marked "Dropped" above).

## Added

- Brand line in `CLAUDE.md` §4: Yallo Talent follows yallo.co's own design (`DESIGN.md`, `globals.css`), never the saasinator system (founder's standing rule).
- Fields the AGENTS template requires that this repo has never recorded (archetype, autonomy level) read "pending: not recorded".
