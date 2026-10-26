# CLAUDE.md — yallo-talent-website runtime contract
@AGENTS.md
## 0. Source of truth — read first
- Thin pointer, never a duplicator: if this file and canon disagree, canon wins; `AGENTS.md` (imported above) outranks this file.
- Product canon: `PRODUCT.md`, `DESIGN.md`, `QUESTIONS.md`, `docs/`, `spec/`; detail named in `docs/agent-guide/`. Work items: none in-repo, scope arrives by `/goal` dispatch.
- Schema: `src/lib/db/migrations/`; code is canonical for what is implemented.
## 1. Identity
- **Project:** the Yallo Talent website at yallo.co: contract-first, statically generated, no CMS at launch; UK, ME, India · **Pillar:** Yallo Talent
- **Owner:** Sumeet Goenka builds and commits (Operator ruling, 17 Aug 2026); Raphy Varghese takes deployment and operations · **Status:** active build
## 2. Stack and commands
- **Stack:** Next.js 16 App Router, TypeScript 5 strict, Tailwind 4, Framer Motion 12, pnpm 10, Node 22, Biome, Husky, Commitlint
- **Install / dev / build / test:** `pnpm install` · `pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint` · `pnpm test` (Playwright, `e2e/`); the `check:*` family and CI: `docs/agent-guide/gates.md`
- **Deploy:** DigitalOcean App Platform behind Cloudflare, Raphy's lane: `docs/status/CUTOVER-RUNBOOK.md`
## 3. Layout
- App in `src/`; scripts behind every `check:*` in `scripts/`; Playwright specs in `e2e/`
- Content in `content/` and `src/data/`; static and generated media in `assets/`, `public/`
- Generated, never hand-edited: `.next*/`, `test-results/`, `tsconfig.tsbuildinfo`
- Read-only: `prototype/` is exploratory, never shipped, never canon
## 4. Session rules
- Group rules (UK English, casing, non-fabrication, secrets, push and merge) come from the baseline; never restate them here.
- Brand: Yallo Talent aligns with yallo.co's own design (`DESIGN.md`, `src/app/globals.css`), never the saasinator system; prevents off-brand surfaces.
- Merges to `main` by pull request only, never direct; Sumeet's departure from the solo regime, since Raphy reviews and operates.
- Never claim a `check:*` gate passed without its exit code; run the gates a change plausibly touches, `pnpm check:gate-coverage` reports coverage.
- Sessions, worktrees, dist directories and ports: `docs/agent-guide/sessions-and-worktrees.md`, before starting a server or a second branch.
## 5. Directory rules
- Detail that governs one area lives in `.claude/rules/*.md` with `paths:` globs, never here: `db-migrations.md` (`src/lib/db/migrations/**`).
- A rules file loads only when a session touches a path its globs match; after writing one, confirm it loads on a path it names.
