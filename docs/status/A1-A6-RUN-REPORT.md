# Overnight run — canon amendments A1–A6 and the 11-step order

**30 July 2026 · Project GTM.01 · `main` @ `9b5987d` · four PRs, all merged on green CI**

Canon was amended and committed **before** any code, as instructed. Everything
below was then built against it.

---

## 1. Status

| Step | State |
|---|---|
| Canon A1–A6 + amendment log | **Done** — `8a530bc`, before any build work |
| 1 · Dark comfort | **Done** |
| 2 · Readability per A4 | **Done** |
| 3 · Logo lockup | **Done** |
| 4 · Role chips | **Done** |
| 5 · Mega menu | **Done** |
| 6 · Four-ways master-detail | **Done** |
| 7 · L1 composition | **Partly** — sections and headings done, plateau not reached |
| 8 · L2 grammar | **Partly** — jumble and headings done, plateau not reached |
| 9 · Hue plumbing deleted | **Done** — closes Q6 |
| 10 · A2 gradients / A3 glass | **Glass done. Gradients not applied** |
| 11 · Client rail | **Done** — closes Q4 |

**PRs:** [#6](https://github.com/yallo-talent/yallo-talent-website/pull/6) ·
[#7](https://github.com/yallo-talent/yallo-talent-website/pull/7) ·
[#8](https://github.com/yallo-talent/yallo-talent-website/pull/8) ·
[#9](https://github.com/yallo-talent/yallo-talent-website/pull/9)

### What is NOT claimed

**No page reached plateau.** The exit criteria ask for two consecutive critique
passes with no score gain, per touched page. This run changed seven surfaces and
scored none of them afterwards, so the criterion is unmet on every one. That is
the largest gap in the run and the next session's first job.

**A2 gradient text is ratified but unapplied.** The utility conditions are
written into canon (§5, gold-anchored, AA at the *lightest* stop, headline
emphasis spans only) but no surface uses it yet. Nothing regressed — the ban
simply became a permission that has not been taken up.

---

## 2. Before and after, measured

| Surface | Before | After |
|---|---|---|
| Dark peak text on the lightest dark ground | 13.62:1 | **12.94:1** |
| Dark hairline | 1.24:1 | **1.17:1** |
| Gold on the lightest dark ground | 7.07:1 | **7.41:1** |
| Strong boundary, dark | 3.24:1 | **3.40:1** |
| Retail L1 height at 1280 | 10,933px | **7,740px** (−29%) |
| Retail CX L2 height at 1280 | 5,576px | **5,117px** |
| Client rail cell sizes | 15 different | **1** (156×56) |
| Client rail cap heights | uncontrolled | **1** (26px) |
| Client rail blend modes | 2, per theme | **0** |
| Mega-menu icon tiles | 20 | **0** |
| `--card-hue*` consumers | 139 | **0** |
| `--hue-*` shim declarations | 30 | **0** |

Contrast held at **32/32** through every change, verified after each.

---

## 3. The A4 conflict — needs your word

**QUESTIONS.md Q7.** A4 enumerates 13px, 14px and 15px as required sizes. Canon's
adjacency rule says no two adjacent fixed steps sit closer than 1.125. But
14/13 = **1.077** and 15.5/14 = **1.107**. No ramp satisfies both.

**I let A4 win** as the later and more specific ratification, and narrowed
adjacency to `--fs-body-sm` (15.5px) and above, where its ratios still hold. The
argument: adjacency exists so a reader never meets two heading steps they cannot
tell apart, and in the small-text band the roles are separated by family, case,
tracking, weight and colour as well as size — mono uppercase 13px against sans
14px is not a size comparison at all.

That is me trimming a ratified rule, so it needs confirming or reversing. The
alternative is dropping one of A4's three sizes, most likely collapsing meta and
nav onto a single 15px step.

---

## 4. Glass, with readings

One token-governed `.glass` utility. The guard changed **from banning
`backdrop-filter` to enforcing A3's allow-list**, which is a stricter contract
than the ban it replaced: the ban had a blanket file exception, and this has none.
It caught the nav authoring its own blur immediately.

| Surface | Shipped | Reading |
|---|---|---|
| Nav on scroll | **Glass** | ground 88% of the register's own; blur confirmed applying in both themes |
| Mega panel | **Opaque — glass skipped** | labels 14.11:1, column headings 5.77:1 |
| Hero instrument · sticky CTA · four-ways media | Allow-listed, not yet applied | — |

**Two findings, both measured.**

The utility is `.glass.glass`, not `.glass`. CSS module stylesheets load after
`globals.css`, so at equal specificity a component's own `background` beats the
utility — both allow-listed surfaces carried the class and rendered fully opaque
until the class was doubled.

**The mega panel cannot have glass, even though A3 allow-lists it.** It is a
descendant of the header, which is itself glass once scrolled, and a
`backdrop-filter` inside an element that already has one is a no-op: the
ancestor's filter establishes the backdrop root. Measured, the panel took the
translucent ground and reported `backdrop-filter: none` — translucency with no
blur, the one combination that actively harms legibility. **A3 bans stacked blurs
for exactly this reason, so the rule caught its own case.** Logged as Q8 with the
portal change it would need.

---

## 5. The client rail

Uniform 156×56 cells · one 26px cap height · one filter per theme (`none` light,
`invert(1)` dark) · **no blend mode at all** · one opacity (0.82) · even 51.2px
spacing · 0 broken images. Every one measured in the browser.

The old treatment was a flattened white tile shown through `grayscale()` plus a
per-theme `mix-blend-mode`. A blend mode composites against each asset's **own
baked background**, so it could never give one tone across a pack where some
grounds are white, some off-white and some dark — which is precisely what read as
illegible dark blobs.

Fixed at the source. `scripts/build-logos.mjs` now keys the ground out and emits
true-alpha silhouettes. **Two attempts failed first and the failures are the
useful part:**

1. *Greyscale, normalise, invert.* Assumes dark ink on a light ground.
   `marks-and-spencer` measured **96.5% partial alpha, 0.1% transparent** —
   inverting a white-on-dark mark makes the ground opaque and the ink vanish.
2. *Border-ring sample.* 9 of 15 clean; six stayed under 6% transparent because
   their grounds are gradients or brand colours.
3. *Otsu's method.* Ships. Finds the luminance split between ink and ground; the
   border ring only decides which class is which, so either polarity works.

**Eleven key cleanly. Six ship as their NAME** — canon §8's own rule, applied by
measurement. The build refuses to emit an asset it cannot vouch for:

| Mark | Reason |
|---|---|
| Landmark Group | 21.3% transparent, 70.8% partial |
| Chalhoub Group | 16.8% transparent, 74.4% partial |
| Al Othaim Markets | 19.4% transparent, 70.5% partial |
| Sephora | 3.8% transparent, 50.4% partial |
| Oracle Consulting | 2.2% transparent, 67.4% partial |
| Richemont | cap height 10.7px at the rail cell |

Worth commissioning: monochrome SVGs for those six. Nothing is broken without
them — a name is a legitimate treatment, not a placeholder.

---

## 6. The lockup, and two alternates

**Shipped.** One `Lockup` component, one stylesheet, rendered with no props in
header and footer. Measured identical: **183px** wide in both at 1280, **159.6px**
in both at 360. The divider is gone; separation is optical, from the gap before
TALENT being wider than the gap after the mark (**13.5px against 7.6px**), the
0.3em tracking opening its own space, and TALENT sitting a step down in size and
weight against `--fg-muted` while the wordmark holds the accent.

The favicon was on `#f59e0b` — a different amber from the brand gold `#d4a843`,
so the browser tab never matched the mark in the header. Now the same gold.

**Alternate A — stacked baseline.** TALENT set at the wordmark's *cap* height
rather than its baseline, tucked under the final "o" instead of following it.
Tighter overall width (useful at 360, where the bar is width-critical), but it
reads as two lines at small sizes and canon §5 explicitly rules TALENT to the
right, never beneath.

**Alternate B — mark-only below 400px.** Drop the wordmark entirely on the
narrowest phones and show the four-petal mark alone, which is the favicon
derivation canon already sanctions. Buys ~120px of bar. Rejected for now because
it makes the brand name absent on the smallest screens, where a first-time
visitor is most likely to arrive from search — but it is the cleanest answer if
the bar ever needs more room than padding can give.

---

## 7. Disagreements and corrections

**I dropped three L1 sections and one L2 section on my own critique's finding**,
not on an explicit instruction to remove those specific ones. Each has its reason
recorded at the deletion site. The L2 "Roles we deploy" wall in particular was a
*duplicate* — it unioned every role from the tool cards below it, so seventeen
names appeared twice, once with no context and once inside the tool that explains
them.

**A mistake I made and fixed.** A `git add -A` swept in `old_wordpress/`, a 5.1GB
WordPress archive that was untracked at session start. The pack went to 4.8GB and
the push failed outright with HTTP 500. Removed from history with `filter-branch`
and added to `.gitignore`.

**A near-miss worth recording.** `clientLogoFor` promised in its own docstring to
return undefined when a client had no logo file, and instead returned the path
from the register — a path, not proof. Harmless until the build began declining to
emit marks, at which point three case-study cards rendered broken images. **CI
caught it and my local run did not**, because Next's image cache still held the
deleted files. Verified after `rm -rf .next`.

---

## 8. Open in QUESTIONS.md

| # | Item |
|---|---|
| Q1 | Ambient intensity inside PetalPlates |
| Q2 | Six source defects in the case-study bodies |
| Q3 | Canon §5's register line still awaits ratification |
| Q4 | **Resolved** — alpha pipeline shipped; six marks ship as names |
| Q5 | **Resolved** by A6 |
| Q6 | **Resolved** — hue plumbing deleted, ban now structural |
| Q7 | **A4 vs the 1.125 adjacency rule — needs your word** |
| Q8 | Mega panel cannot have glass while it is a child of the header |

Nothing on the site is invented. Where something was missing, the component
renders nothing and the gap is named.
