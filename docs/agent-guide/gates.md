# Gates and CI

Loaded on demand, named by plain path from `CLAUDE.md`. Moved from the root instruction files on 26 Oct 2026; no rule changed.

- This repo carries a large `check:*` script family in `package.json` (terminology, contrast, type scale, a11y, motion, taxonomy, Yallo casing, crawler access, robots policy, prose rules, gate coverage, assistant grounding, refusal and links, among others), each backed by a script in `scripts/`.
- Run the gates a change plausibly touches; `pnpm check:gate-coverage` reports coverage. Never claim a gate passed without seeing its exit code.
- `pnpm check:yallo-case` enforces "Yallo", never "YALLO".
- Pre-commit (`.husky/pre-commit`): Biome on the staged set only, `.claude/hooks/check-colours.js`, orbs, type scale, taxonomy, asset case. Commit messages: `.husky/commit-msg` runs Commitlint.
- CI: `.github/workflows/`: `ci.yml`, `a11y-exhaustive.yml`, `crawler-access.yml`, `phase8.yml`, `robots-policy.yml`, `purge-transcripts.yml`.

## Enumerating guards

- **A new page template joins every enumerating guard in the same commit that introduces it.** Twice in round 3 the list failed, not the rule: `/ai-talent` shipped six classes under the A4 type floor and `check-rendered-type` would have caught every one, but the page was not on its list.
- Run `node scripts/check-gate-coverage.mjs`: it reads the route tree from the filesystem and each guard's list from source, and fails when a rendering unit is visited by no guard at all. Adding the route is the fix; silencing the guard is not.
