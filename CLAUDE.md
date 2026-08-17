@AGENTS.md

# CLAUDE.md — yallo-talent-website runtime contract

Thin pointer, never a duplicator. `AGENTS.md` (imported above) holds the domain
ruling, ownership and ground rules for this repo and outranks this file on conflict.
Group baseline loads from the workspace-root CLAUDE.md; canonical copy lives at
`~/Claude/yallo-knowledge/saif-methodology/templates/claude-md/GROUP-BASELINE.md`.

## 0. Source of truth — read first

| Domain | Canonical surface |
|---|---|
| Repo runtime contract | `AGENTS.md` — read it first, every session |
| Product | `PRODUCT.md` |
| Design | `DESIGN.md` |
| Open questions | `QUESTIONS.md` |
| Longer-form canon | `docs/`, `spec/` |
| Group baseline | Workspace-root CLAUDE.md → `saif-methodology/templates/claude-md/GROUP-BASELINE.md` |
| Work items | none in-repo — sessions receive scope via `/goal` dispatch |
| Schema / structure | code is canonical for what is implemented |

## 1. Identity

- **Project:** the Yallo Talent website at **yallo.co** — contract-first, statically
  generated, no CMS at launch. UK · ME · India.
- **Pillar:** Yallo Talent.
- **Owner:** **Sumeet Goenka** builds and commits (Operator ruling, 17 Aug 2026:
  Sumeet owns the build of all public-facing Yallo websites). **Raphy Varghese**
  takes ownership at deployment — DNS cutover and post-launch operations — and
  inherits maintenance thereafter via PR review. See `AGENTS.md` § Ownership.
- **Status:** active build (redesign in flight).

## 2. Stack and commands

- **Stack:** Next.js 16 App Router · TypeScript 5 strict · Tailwind 4 · Framer
  Motion 12 · pnpm 10 · Node 22. Statically generated.
- **Install:** `pnpm install` · **Dev:** `pnpm dev` · **Build:** `pnpm build`
- **Typecheck:** `pnpm typecheck` · **Lint:** `pnpm lint` · **Test:** `pnpm test`
  (Playwright, `e2e/`)
- **Gates:** this repo carries a large `check:*` script family (terminology,
  contrast, type scale, a11y, motion, taxonomy, Yallo casing, crawler access,
  robots policy, prose rules, gate coverage, assistant grounding/refusal/links).
  Run the gates a change plausibly touches — `pnpm check:gate-coverage` reports
  coverage. Never claim a gate passed without seeing its exit code.
- **CI:** `.github/workflows/` — `ci.yml`, `a11y-exhaustive.yml`,
  `crawler-access.yml`, `phase8.yml`, `robots-policy.yml`, `purge-transcripts.yml`.
- **Deploy:** `TBC — no deploy config measured in this repo; Raphy owns DNS cutover.`

## 3. Layout

- `src/` — the Next.js application. `content/` — site copy. `assets/`, `public/` —
  static and generated media.
- `scripts/` — the gate scripts behind every `check:*` command.
- `e2e/` — Playwright specs. `test-results/` is generated output: never hand-edit.
- `prototype/` — exploratory work, not shipped. Do not treat it as canon.
- `.next/`, `tsconfig.tsbuildinfo` — build output: never hand-edit.

## 4. Session rules

1. Read `AGENTS.md` then this file at the start of every session.
2. UK English. **"Yallo", never "YALLO"** — `pnpm check:yallo-case` enforces it.
3. **yallo.co is Yallo Talent's own domain.** `talent.yallo.co` is a pre-cutover
   noindex placeholder only; treat any reference to it as a permanent address as
   stale. Prevents shipping copy and links that break at cutover.
4. No fabricated people, clients, metrics, quotations or dates. Placeholder copy
   that reads as real is the defect this rule prevents.
5. Never commit secrets; `.env*` stays gitignored.
6. Merges to `main` via pull request — never direct.

## 5. Worktrees

`../yallo-talent-sig` is a **git worktree of this repo**, not a separate project —
same `.git`, same remote, branch `feat/email-signature-gif`. Changes there land in
this repo. Never open a second competing branch for the same file across the two
worktrees; check `git worktree list` before branching.

## 6. Directory rules

Directory-scoped conventions live in `.claude/rules/*.md`, path-scoped via `paths:`
frontmatter globs. None yet — create the folder when the first rule earns its place.
