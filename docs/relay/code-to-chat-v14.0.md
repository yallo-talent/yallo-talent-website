# Relay — Code to Chat, v14.0

**Round 7 close-out, session E · 2 August 2026 · main repository, branch `fix/round7-integration`**
Closes relay v13.0 (Session D). Three new changes landed, the full gate set was re-run, and `main` is merged and pushed. Branches and worktrees are confirmed already gone rather than deleted by this session; the proof is in §4.

---

## 1. TL;DR

The three changes are done, gated and merged. Movement item groups under every case study's four sections (Context, Challenge, The approach, The outcome) compile from markdown into real `<ul><li>` already; nothing had restored the marker Tailwind's preflight strips, so all ten studies read as unmarked indents. Fixed with a `currentColor` dot, not gold: a structural marker is not the interactive/decorative accent gold is reserved for. The homepage rail's 4-of-10 cap (`HOMEPAGE_CASE_STUDY_COUNT`) is deleted rather than raised; the rail now carries all ten in `order.yaml` order, plus a "See all case studies" link to `/case-studies` matching the existing arrow-link treatment.

Typecheck and all sixteen gates ran serially on a production build at port 3107: every one green. LCP measured, not assumed: 188ms, the hero H1, unchanged by the rail's expansion because its marks are `loading="lazy"` and the rail sits below the fold regardless of card count. `main` fast-forwarded cleanly onto this branch's single commit and is pushed.

**Branches and worktrees: already gone, confirmed rather than assumed.** All four round 7 branches and both named worktrees were removed before this session started. §4 gives the commit-hash proof, because "not present" needed evidence, not a shrug.

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

## 4. Branches and worktrees: the proof, not the shrug

First pass at this section wrongly reported the four branches as unidentifiable and stopped. They are identifiable, from the merge structure itself, and they are already deleted. Corrected below.

**The merge commit names them.** `main`'s round 7 merge (`4b3829b`, second parent `2c373da`) is a normal two-parent merge, but its ancestry contains three further merge commits with their own names:

```
f6a320f chore(merge): round 7 case studies (C) into the integration branch   (tip 9f58c33a)
1b644e7 chore(merge): round 7 content (B) into the integration branch        (tip 30295d84)
0fd6e65 chore(merge): round 7 system (A) into the integration branch        (tip 97b23cca)
```

That is A ("round 7 system"), B ("round 7 content"), C ("round 7 case studies"), and the integration branch itself that carried all three, `2c373da` — session D's `fix/round7-integration`. Four branches.

**All four are already gone, locally and on origin.** `git fetch --all --prune` first, then for each of the four commit hashes above:

```
git for-each-ref --format='%(refname) -> %(objectname)' | grep -F <sha>
```

returned nothing, for all four. No local branch, no remote-tracking branch, no ref of any kind anywhere points at any of them. They remain reachable only as ancestors inside `main`'s merge history, which is exactly what a deleted-but-merged branch looks like. `fix/round6-system` was checked too, since it still carries one unpushed commit: its tip (`8703205`) is a **round 6** merge parent (`chore(merge): round 6 system into main`, second parent `8703205`), not one of round 7's four, and it is out of scope here.

**The two named worktrees are also already gone.** `../yallo-talent-website-B` and `../yallo-talent-website-C` do not exist as paths. `git worktree prune -v` found nothing stale to clean, meaning even the administrative metadata was already removed, not just the directories. `git worktree list` shows this checkout plus two unrelated entries, `.claude/worktrees/cranky-satoshi-0218bc` and `.claude/worktrees/heuristic-golick-919afe`, both detached at `11c0cb7` (a 31 July "relay v3.0" commit, nothing to do with round 7) and at a path convention the dispatch never names. Given the hook context earlier in this session noting another chat's dev server active in this folder, these two most likely belong to that concurrent, unrelated session and were left untouched.

Conclusion: steps 6 and 7 were already complete before this session began. Nothing was deleted by this session because there was nothing left to delete; `git worktree prune` is the only command this session ran that touches either.

---

## 5. Confirmed state

- `main` at `f44ecfb` (this relay's own commit, on top of `1517150`), `origin/main` at the same commit, pushed.
- One worktree with round 7 content (this one) plus two unrelated, untouched `.claude/worktrees/*` entries belonging to a different, currently-active session.
- All four round 7 branches (A, B, C, and D's integration branch) confirmed absent from every ref, local and origin, after a full `--prune` fetch.
- `git worktree prune -v` run; nothing stale found.
- `git status` clean but for `docs/lti-reports/`, an untracked directory of talent-pool spreadsheet exports unrelated to this build — left alone.
