# Relay — Code to Chat, v14.0

**Round 7 close-out, session E · 2 August 2026 · main repository, branch `fix/round7-integration`**
Closes relay v13.0 (Session D). Three new changes landed, the full gate set was re-run, and `main` is merged and pushed. Branch deletion and worktree removal (§6, §7 of the dispatch) could not be carried out as specified: their named targets do not exist in this repository. Detail in §4.

---

## 1. TL;DR

The three changes are done, gated and merged. Movement item groups under every case study's four sections (Context, Challenge, The approach, The outcome) compile from markdown into real `<ul><li>` already; nothing had restored the marker Tailwind's preflight strips, so all ten studies read as unmarked indents. Fixed with a `currentColor` dot, not gold: a structural marker is not the interactive/decorative accent gold is reserved for. The homepage rail's 4-of-10 cap (`HOMEPAGE_CASE_STUDY_COUNT`) is deleted rather than raised; the rail now carries all ten in `order.yaml` order, plus a "See all case studies" link to `/case-studies` matching the existing arrow-link treatment.

Typecheck and all sixteen gates ran serially on a production build at port 3107: every one green. LCP measured, not assumed: 188ms, the hero H1, unchanged by the rail's expansion because its marks are `loading="lazy"` and the rail sits below the fold regardless of card count. `main` fast-forwarded cleanly onto this branch's single commit and is pushed.

**Not done: branch deletion and worktree removal.** The four branches and the two worktrees the dispatch names to remove are not present in this repository as described. See §4 before assuming this is a gap versus something already closed.

---

## 2. The three changes

| # | What | Where |
|---|---|---|
| 1 | List markers restored on every movement's bulleted item groups | `CaseStudyDetail.module.css` — `currentColor` dot via `::before`, matching the design system's dot-marker mechanic (used elsewhere with `--sector-accent`) but on a neutral token, not gold |
| 2 | Homepage rail cap removed | `HOMEPAGE_CASE_STUDY_COUNT` deleted from `case-study-order.ts` (not raised to 10); `Evidence.tsx` now maps every study `orderedCaseStudies()` returns |
| 3 | "See all case studies" link | New optional `action` slot on `SectionHead`, wired in `Evidence.tsx` to `/case-studies`, styled with the same `.btnSecondary` + `ArrowGlyph` pair as "Read the case study" |

**Diagnosis before styling, per the dispatch's own instruction.** The rendered DOM (accessibility tree, both via a script scan and via manual inspection) showed real `list`/`listitem` nodes, not `<div>`s carrying a bullet glyph — the markdown's own `- item` lines were already compiling to semantic `<ul><li>` through `MDXRemote`. The defect was CSS only: Tailwind's preflight sets `list-style: none` globally and `CaseStudyDetail.module.css` never restored a marker. No markup change was needed or made.

**New Playwright coverage**, `e2e/case-study-movements.spec.ts`, asserts across all ten studies that movement item groups are `<ul>`/`<li>` and carry a `::before` with non-zero computed width. Watched red before being trusted: reverted the CSS via `git stash`, confirmed the assertion fails (`Expected: > 0, Received: 0`) on the very case study it now passes, then restored and re-confirmed green. `playwright.config.ts` gained a `PORT` env var (default 3000, matching the convention `check:motion`/`check:reflow` already use) so this suite can run against the gate's own production build rather than only against a dev server on 3000.

The "See all case studies" link is covered by the existing `e2e/dead-hrefs.spec.ts` assertion (run as part of the full Playwright suite below, not one of the sixteen named gates but exercised anyway since the dispatch calls it out directly).

---

## 3. Gate results, all on a production build at port 3107

Run serially, one gate per invocation, per the dispatch's instruction.

| Gate | Result |
|---|---|
| `typecheck` | Green |
| `check:terms` | Green. 238 files |
| `check:contrast` | Green. 32 token pairs, 6 composites, WCAG 2.2 AA |
| `check:type` | Green |
| `check:a11y` | Green. 6 routes x 2 themes x 2 widths, 1 clause-carrying exemption |
| `check:motion` | Green. Reduced motion honoured on every animated route |
| `check:type-render` | Green. 14 templates x 4 widths, 376 family/weight pairs |
| `check:interaction` | Green. 450 focused stops, none obscured. 14 advisory repetition notes (not failing) on the homepage — "Read the case study", "Managed Delivery" etc. now repeat across ten cards instead of four, which is the intended effect of removing the cap |
| `check:reflow` | Green. 22 routes x 2 themes at 320 and 360 |
| `check:visual` | Green, including the JS-disabled and reduced-motion assertions |
| `check:taxonomy` | Green. 204 files |
| `check:yallo-case` | Green. 19 pages, 131 internal links resolve |
| `check:estate` | Green |
| `check:marks` | Green. axis 0.8%, card 0.4%, rail **12.8%** against the ratified ±13%, identical to v13.0's own figure — unaffected by the rail's card count, as expected |
| `check:crawlers` | Green. Live `yallo.co`, fourteen crawlers plus the control served the real page |
| `check:cs-excerpts` | Green. 10 case studies |
| `check-gate-coverage` | Green. Every rendering unit with a live URL is visited, 6 lists none stale |
| `pnpm test` (Playwright, not one of the sixteen but run per §2 above) | Green. 12 tests: smoke, dead-hrefs, and the new 10-study movement-marker spec |

LCP: 188ms, `H1.heroHeadline`, measured directly via a `PerformanceObserver` against the same production build. Unaffected by the rail change, since `ClientMark` in `CaseRail.tsx` renders every card's logo with `loading="lazy"` and the rail sits at section 11 of 13, well below the fold.

`tsconfig.json` confirmed clean before every stage. One `next dev` verification server was run on a scratch port to prove the marker assertion fails without the fix (§2); its `tsconfig.json` rewrite was reverted with `git checkout -- tsconfig.json` before anything was staged, and its scratch dist dir removed.

---

## 4. Why §6 (branch deletion) and §7 (worktree removal) did not run

The dispatch names four round 7 branches (unspecified by exact name in the text I received) and two worktrees, `../yallo-talent-website-B` and `../yallo-talent-website-C`, to remove. Checked before touching anything:

- **The two worktree paths do not exist.** `git worktree list` shows only this checkout plus `.claude/worktrees/cranky-satoshi-0218bc` and `.claude/worktrees/heuristic-golick-919afe`, both detached at `11c0cb7` — a "relay v3.0" commit from 31 July, unrelated to round 7. Neither matches the named paths or looks like a round 7 artefact.
- **No branch named `fix/round7-integration` exists on `origin`.** `git ls-remote --heads origin` lists 24 branches; that name is not among them. Session D's own branch of that name (per v13.0's header) was either never pushed or already deleted before this session started.
- **`main` was already at the round 7 merge commit before this session began.** Grounding (§0) found `main` at `4b3829b`, `"chore(merge): round 7 into main, three sessions integrated and every gate green"` — matching what v13.0 describes as pending, not done. The merge, and apparently the branch/worktree cleanup the dispatch assumes is still outstanding, appear to have already happened between v13.0 being filed and this session starting, by a path I have no visibility into.
- **The one branch still carrying round 7 content, `fix/round6-system`, is fully merged into `main`** (`git merge-base --is-ancestor` confirms it) but carries one commit not yet pushed to `origin/fix/round6-system` (a doc plus a client logo asset). Its content is safe either way since it already lives in `main`'s history, but it is not obviously "one of the four" and deleting it was not attempted without a clearer signal that it is in scope.

Guessing at four branches to delete risked either doing nothing useful or destroying something outside this dispatch's authority to remove. Per the dispatch's own stop condition, a signal like this gets named rather than forced past. Nothing was deleted; no worktree was touched.

**What Chat can confirm or correct:** whether branch/worktree cleanup already happened in a session or manual step this relay has no visibility into, and if not, the actual four branch names so a session can target them precisely rather than by inference.

---

## 5. Confirmed state

- `main` at `1517150`, `origin/main` at the same commit, pushed.
- One worktree (this one) plus the two unrelated `.claude/worktrees/*` entries, untouched.
- `git status` clean but for `docs/lti-reports/`, an untracked directory of talent-pool spreadsheet exports unrelated to this build — left alone.
