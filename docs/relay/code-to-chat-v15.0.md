# Relay — Code to Chat, v15.0

**Round 8 hygiene, session A (solo) · 2 August 2026 · main repository, branch `fix/round8-hygiene`**
Closes relay v14.0. No worktrees this round. Branch pushed to origin, not merged — this round's dispatch carried no merge step, unlike round 7's.

---

## 1. What shipped

| # | What | Reversible? |
|---|---|---|
| 1 | `.gitignore` rule for `docs/lti-reports/` (candidate personal data) | Yes — one line |
| 2 | Insights markdown (`/insights/[slug]`) preflight fix: `styles.prose` wired to the MDXRemote render, extended with h4, list markers, blockquote, hr, table | Yes — code only, no content touched |
| 3 | `scripts/check-prose-rules.mjs`, a new static gate for #2 | Yes |
| 4 | CI: the round 7 marker spec's step renamed and documented (was bare "Tests"); `check:prose` joins it | Yes |
| 5 | Three gates (`check-rendered-type`, `check-yallo-case`, `check-reflow`) stopped hand-copying a case-study slug; now derive it from `order.yaml` via new `scripts/lib/case-study-sample.mjs` | Yes |
| 6 | `check-taxonomy.mjs` Rule 4b: a permanent lint against the next hand-copied case-study slug in `scripts/` | Yes |
| 7 | `check-gate-coverage.mjs` taught to resolve the new derived-slug pattern, after item 5 broke its own coverage report (caught before push, not shipped broken — see §5) | Yes |

Four commits on `fix/round8-hygiene`, pushed to origin. Nothing here touches `main`, content, or published state.

---

## 2. Item 1 — candidate data

```
$ git log --all --diff-filter=A -- 'docs/lti-reports/*'
```
returned nothing (confirmed three ways: with the glob, without it, and with `--full-history`). Never committed, on any ref. `.gitignore` now carries an explicit rule, matching the existing convention for two other categories of local-only, never-committed material already documented there (`old_wordpress/`, `prototype/L1, L2 Details/`). Files not opened, moved or deleted.

---

## 3. Item 2 — the preflight sweep

**Enumerated every route rendering markdown or rich text.** `grep -rl "MDXRemote" src/` returns exactly two: `src/app/case-studies/[slug]/page.tsx` (via `Movements.tsx`, fixed round 7) and `src/app/insights/[slug]/page.tsx`. Nothing else in the codebase parses markdown into rendered HTML.

**Case studies (10 published, all checked):** no `<ol>`, no `<blockquote>`, no `<table>`, no nested lists, no raw headings anywhere in the content (`##` is consumed as a movement divider and never reaches the rendered body; `###`, where present, is lifted out as the movement subhead template element, never rendered as a literal heading tag). Round 7's fix is the whole surface. Confirmed by grep across all ten `.mdx` files, not assumed.

**Insights: the actual finding.** All 21 insight articles carry `published: false` — none are live. But the code defect is real regardless: `EditorialLayout.module.css` has carried a `.prose` class with h2/h3/p/ul/ol/li/strong rules since case studies were first ported, and `insights/[slug]/page.tsx` never applied it to the `MDXRemote` render — it wrapped the render in `.sectionInner`, which declares nothing beyond `position: relative`. Verified against real content: rendered `wrong-it-hire-cost.mdx` (h4 headings, plain list) and `retail-technology-investment-2025.mdx` (the corpus's only blockquote, an internal "stub — held for rewrite" marker) through a temporary route using the exact `MDXRemote` + `styles.sectionInner` path, deleted before committing anything. Before the fix: `h4` computed at 16px/500 weight against body `p` at 16px/400 — same size, one weight step, no real hierarchy. `<ul>`/`<ol>` had `list-style: none` (Tailwind preflight) and `padding-left: 0`, i.e. worse than case studies were: no marker AND no indent. `<blockquote>` had no border, no italic, no colour shift — invisible as a quotation.

**A blocked shortcut, and why it was right to block it.** The first instinct was to flip one article's `published: false` to `true` locally to get a reachable route for testing. The classifier declined the `sed` call — correctly: toggling a real article's publish flag is an editorial decision even when local and reverted, not a diagnostic. Built a temporary scratch route instead (`getInsight()` called directly, bypassing the page's own `notFound()` gate, using real unmodified MDX bodies) — proved the defect and the fix, then deleted the route. `git diff --stat` on both `.mdx` files confirmed empty throughout.

**Fix.** `.prose` applied to the MDXRemote wrapper and to the "Sources" citation list (same file, same root cause, found in passing while wiring the fix — not left for later). `.prose` extended: `h4` (Newsreader serif, 600 weight, distinct from body's Inter 400 even at a smaller px, matching the ramp's existing h3 convention of carrying hierarchy through family+weight rather than size alone); list markers via the identical `currentColor` `::before` dot round 7 used for case studies (never gold — checked and re-confirmed, not relitigated); `<ol>` gets `counter()`-based numbering, same neutral colour; `blockquote` gets a plain `border-left: 2px solid var(--border-strong)` and italic, muted colour — deliberately NOT the testimonial callout's gold-accented card treatment (`Home.module.css`'s own comment records that a gold left border was already flagged once as "the AI-slop tell that it is" and removed; a body-copy blockquote is a lower-key element and doesn't need the callout's weight); `hr` restores a hairline rule; `table`/`th`/`td` get borders and padding, tested only synthetically (see below) since no real content uses one.

**No live route, so no live Playwright spec — a static gate instead.** `scripts/check-prose-rules.mjs` fails if `styles.prose` stops being applied to the MDXRemote render, or if the h4/marker/blockquote/hr/table rules disappear, or if a marker rule ever references `--gold`. Proven to fail red (stashed the wiring change, confirmed the exact failure message, restored). This is a floor, not the full proof a live browser test gives — the honest gap is that nothing currently exercises the *rendered, computed* CSS in CI for this route, because there is no route to visit.

**`<ol>` and `<table>` specifically: no real content exists anywhere to test against.** Verified via `getComputedStyle` in the same temporary route with three synthetic (non-editorial, no invented facts — just `<ol><li>first</li>...</ol>` structure) fixtures: numbering renders via `counter()`, table borders render, `hr` renders. This is CSS-only verification, not a claim that any real page shows these — none does yet.

**Route list checked, for the record:** `/`, `/case-studies` (hub), all 10 `/case-studies/[slug]`, `/insights` (hub, empty — zero published), `/insights/[slug]` (no live slugs). Every other route on the site (platforms, capabilities, industries, L1/L2 shells) is JSX-authored, not markdown, and out of this sweep's scope by construction — confirmed via the same `MDXRemote` grep, not assumed.

---

## 4. Item 3 — gate honesty

**3a.** The round 7 marker spec (`e2e/case-study-movements.spec.ts`) was already running in CI — inside a bare `- name: Tests / run: pnpm test` step with no comment, unlike every other step in `ci.yml`. Given a documented name (`Playwright (case-study markers, smoke, dead hrefs)`) with the same why-this-exists framing the rest of the file uses. `check:prose` joins as its own named step.

**3b, derive vs enumerate — audited all sixteen:**

| Derives (walks `src`/`content`, or hits production directly) | Enumerates (hand-maintained route/page list) |
|---|---|
| `check:terms`, `check:type`, `check:taxonomy`, `check:cs-excerpts`, `check:crawlers`, `check-gate-coverage` | `check:contrast` (fixed token-pair matrix; values read live from `globals.css`), `check:a11y`, `check:motion`, `check:type-render`, `check:interaction`, `check:reflow`, `check:visual` (single route, not a list), `check:yallo-case`, `check:estate`, `check:marks` |

The enumerating gates' route-level lists (industries, platforms, capabilities pages) are a lower-risk category than order.yaml drift: a route is a code artefact the author is already touching when it changes, not a published-content row that can be silently retired out from under a gate. The real, actionable risk named in the dispatch — a *case-study slug* hand-copied and liable to outlive the study — turned up in three gates, not one: `check-rendered-type.mjs`, `check-yallo-case.mjs`, `check-reflow.mjs`, each hardcoding `oracle-hyperion-financial-management-hfm-implementation` as their "one page per template" sample. Fixed by deriving that slug from `order.yaml` (`scripts/lib/case-study-sample.mjs`), and added `check-taxonomy.mjs` Rule 4b as the permanent lint, scanning `scripts/*.mjs` for any hand-typed slug from `order.yaml`'s own list.

Rule 4b surfaced one false positive (`scripts/extract-case-studies.mjs`, a one-time WordPress-export migration register that legitimately names every study — allow-listed, not a "current sample" pattern) and proved itself by being run against a deliberately reintroduced hand-copied slug in a scratch copy of `check-estate-interaction.mjs`, confirmed red, reverted.

**A regression this same fix introduced, caught before it shipped.** `check-gate-coverage.mjs` reads each gate's `PAGES`/`ROUTES` list as source *text* and regex-matches quoted string literals — the new `` `/case-studies/${sampleCaseStudySlug()}` `` template literal is invisible to that regex. Running the full gate set before pushing (not skipped) found `/case-studies/[slug]` reported as "visited by no enumerating gate at all" — a real, if short-lived, regression. Resolved by teaching `listOf()` to also recognise that exact pattern and resolve it via the same shared helper, rather than reverting the derive-not-enumerate fix. Confirmed green afterward, matching round 7's own coverage numbers exactly (`check-reflow` 17/21, `check-rendered-type` 13/21, `check-yallo-case` 15/21).

**A finding beyond what item 3 literally asked, worth naming plainly.** CI (`.github/workflows/ci.yml`) runs Lint, Types, Terminology, Contrast, Type scale, Build, the Playwright suite, Visual, Accessibility, Rendered type, Reduced motion, and Reflow — nine of the sixteen named gates, plus `pnpm test`. **Seven are not wired into CI at all**: `check:taxonomy`, `check:yallo-case`, `check:estate`, `check:marks`, `check:crawlers`, `check:cs-excerpts`, `check-gate-coverage`. `eslint src scripts` (the fuller invocation round 7's own relay used as a bonus signal, versus CI's `biome check .`) isn't wired either. This is the same "gate was green while the page was wrong" risk class item 3 exists to name, one layer up — a gate that's green on every manual run but never runs on a PR is not a safety net, it's a report someone has to remember to ask for. Left unfixed this round (adding ~7 CI steps, several needing a running server, is a real scope decision, not a one-line hygiene fix) and logged as an open item below rather than silently expanded into.

---

## 5. Item 4 — rail/index parity

`/case-studies` (`src/app/case-studies/page.tsx:30`) and the homepage rail (`Evidence.tsx:24`) both call the identical `orderedCaseStudies(getAllCaseStudies())` — same function, same data, parity by construction, not by convention. `HOMEPAGE_CASE_STUDY_COUNT` and any similarly-named constant: absent from `src/` entirely, re-confirmed fresh. `"See all case studies"` appears exactly once in the codebase (`Evidence.tsx:80`) — no duplicate label/href pair exists to derive from a shared export; nothing to fix here, checked and clean.

---

## 6. Item 5 — performance budget, measured on the production build

Built at `.next-round8` (own `NEXT_DIST_DIR`), served on port 3107, measured directly via a `PerformanceObserver` in headless Chromium (not Lighthouse — matches the project's own established method).

| Metric | 1440×900 | 375×812 | Budget | Result |
|---|---|---|---|---|
| LCP | 196ms (`H1.heroHeadline`) | 80ms (`P.heroLede`) | <250ms | Pass, large margin |
| CLS, full page settle | 0.000057 | 0 | <0.02 | Pass |
| CLS, scrolled to the rail specifically (lazy images loading) | 0.00045 | 0.00162 | <0.02 | Pass |

The LCP element differs by viewport (H1 desktop, lede paragraph mobile) — a legitimate reflow difference, not a regression; both are above-the-fold hero content, neither is the rail. Rail-induced shift is real but three orders of magnitude under budget at both widths. Round 7's 188ms LCP figure and this round's 196ms are within normal run-to-run noise on the same unchanged hero.

---

## 7. Item 6 — accepted, not re-verified

Round 7's `currentColor`-not-gold ruling, the deleted (not raised) homepage cap, and the branch/worktree evidence trail: taken as given, not re-run.

---

## 8. What did not happen, and why

- **No live Playwright spec for `/insights/[slug]`.** Blocked structurally, not by choice: 0 of 21 articles are published, so there is no route for a browser test to hold down in CI. Unblocks the moment one article is published — an editorial decision, not a code one, and outside this round's authority. `check:prose` (§3, item 2) is the static floor until then; the live spec belongs beside `case-study-movements.spec.ts` once it can run.
- **Seven named gates still absent from CI**, per §4. Not fixed this round because wiring seven more steps (several requiring a running server, matching the `PORT=3100`/`--base` pattern the nine already-wired gates use) is a deliberate CI-scope decision, not a one-line fix folded into "put the marker spec in." Logged as an open item.
- **No merge to `main`, no push of `main`.** This round's dispatch carries no merge step, unlike round 7's. `fix/round8-hygiene` is pushed to origin and stops there, pending direction.
- **The two `.claude/worktrees/*` entries** (a concurrent, unrelated session) were never entered, checked out, or pruned, per the round's own rule.
- **Pre-existing findings surfaced repeatedly but not touched:** the 11 "additive duplicate class declaration" notes `check:type` reports every run, the two "inert" platform/discipline labels `check:taxonomy` reports in `src/data`, and three pre-existing `border-radius: 999px` findings in `EditorialLayout.module.css` unrelated to this round's edits. All pre-existing, all out of scope, none touched.

---

## 9. Open items

| Item | Unblocked by |
|---|---|
| Live Playwright coverage for insights markdown | Publishing at least one insight article (editorial decision) |
| Seven named gates absent from CI (`check:taxonomy`, `check:yallo-case`, `check:estate`, `check:marks`, `check:crawlers`, `check:cs-excerpts`, `check-gate-coverage`) | A deliberate decision to wire them, several needing a server step added to `ci.yml` |
| `eslint src scripts` not run in CI (only `biome check .` is) | Same, a CI-scope decision |
| `fix/round8-hygiene` not merged to `main` | Direction from Sumeet/Chat — no merge step in this round's dispatch |

---

## 10. Risks

- The three gates now derive their "one representative case-study" sample from `order.yaml`'s first entry rather than a pinned slug. Intended (that's the fix), but worth naming: if editorial reranks `order.yaml`, these three gates' sample silently follows, rather than staying pinned to a slug someone chose deliberately. Drift-proof was judged worth more than pinned-but-fragile, matching the round's own instruction, not a unilateral call.
- No other content, data, or `main`-branch state was touched. Every change this round is code (components, CSS, scripts, CI config) or `.gitignore`.

---

## 11. HEAD and gate state, real exit codes

`git log --oneline main..HEAD`:
```
6d49dd3 fix(gates): teach check-gate-coverage the derived case-study slug pattern
f418bd6 fix(gates): name the marker spec's CI presence, and stop three hand-copied slugs
b757062 fix(preflight): insights markdown had zero prose styling, not just dead bullets
f3798a2 fix(hygiene): ignore docs/lti-reports, candidate data with no business in git
```
Pushed to `origin/fix/round8-hygiene`. `main` untouched at `8f53759`.

All run serially, one per invocation, on the production build at port 3107:

| Check | Exit |
|---|---|
| `pnpm typecheck` | 0 |
| `check:terms` | 0 |
| `check:contrast` | 0 |
| `check:type` | 0 |
| `check:a11y --base http://localhost:3107` | 0 |
| `PORT=3107 check:motion` | 0 |
| `check:type-render http://localhost:3107` | 0 |
| `check:interaction http://localhost:3107` | 0 |
| `PORT=3107 check:reflow` | 0 |
| `PORT=3107 check:visual` | 0 |
| `check:taxonomy` | 0 |
| `BASE_URL=http://localhost:3107 check:yallo-case` | 0 |
| `check:estate http://localhost:3107` | 0 |
| `check:marks http://localhost:3107` | 0 |
| `check:crawlers` | 0 |
| `check:cs-excerpts` | 0 |
| `check:prose` | 0 |
| `check:gate-coverage http://localhost:3107` | 0 (red once, mid-round, before the fix in §4 — not shipped red) |
| `PORT=3107 pnpm exec playwright test` (12 tests) | 0 |

`git status`: clean.
