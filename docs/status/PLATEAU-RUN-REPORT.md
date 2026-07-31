# Plateau run — report

**31 July 2026 · branch `plateau-run` · Code**
Four surfaces to plateau: the homepage, `/platforms/sap`,
`/capabilities/data-analytics`, `/industries/retail`. Plateau is defined as two
consecutive critique passes with **no gain and no critical/high finding**.

---

## 1. Plateau status — and why the loop cannot reach it as run

| Surface | P1 | P2 | P3 | P4 | Open P1s after P4 fixes |
|---|---|---|---|---|---|
| Homepage | 25/36 | 25/36 | 27/36 | **28/36** | 0 |
| `/industries/retail` | 22/32 | 21/32 | 23/32 | **20/32*** | 0 |
| `/capabilities/data-analytics` | 23/36 | 22/36 | 29/36 | **25/36** | 0 |
| `/platforms/sap` | 67% | 71% | 64% | — | **1, blocked on Q17** |

\* Pass 4 rebuilt the rubric (16 criteria × 2) rather than reusing the earlier
shape, so 20/32 is not comparable with 23/32. Its own note: treat the direction
as indicative and the findings as the signal.

**0 of 4 plateaued, and the reason is structural.** Pass 4's retail critique
named it exactly:

> A plateau is a claim about two consecutive passes over the **same** artefact.
> Pass 4 did not have one.

It is right. The loop as run has been *critique → fix → critique → fix*, with
commits landing while a pass was still measuring — twice during pass 4, once
inside the very component under review. Under that loop the plateau condition is
**unreachable by construction**: every pass scores a different build, so "no gain
over the previous pass" compares two different artefacts, and each round's fixes
guarantee the next pass has something new to find.

Three rounds of evidence say the same thing from the other direction. Every pass
verified the previous round's fixes as real — Data & Analytics 3 of 3, Retail 7 of
7, SAP 6 of 6, homepage 5 of 5 — and then found its P1s in **categories no earlier
pass had instrumented**:

| Pass | New ground it opened |
|---|---|
| 2 | A4 role minimums; canon §5's blurred-orb clause; the mobile clamp |
| 3 | keyboard traversal of shared chrome; fixed-overlay occlusion; heading tag vs role; copy repetition |
| 4 | drawer modality; target geometry under flex; effective-vs-declared hover cues; disclosure-control truthfulness |

That is not a page failing to converge. It is a measurement frontier moving. The
**design system has plateaued** — type ramp, contrast, glass, motion, register,
terminology and target size all hold under adversarial measurement, and both
passes that hand-composed every one of axe's abstentions (64 and 143 nodes)
found nothing hiding in them.

**What would actually produce a plateau call, and it needs a decision:**

1. **Freeze the build.** Tag a commit, run two consecutive passes against that
   tag with no commits in between, and score those. This is the only version of
   the exercise that satisfies the condition as written.
2. **Close the four uninstrumented classes first**, so a frozen pass is not just
   measuring the next unguarded category. Pass 4 proposed them and none needs a
   canon amendment: assert `aria-expanded` returns to false on Escape for every
   `aria-haspopup` trigger and cap tab stops to the header CTA; probe
   `elementsFromPoint` under every `position: fixed` overlay and fail on occluded
   interactive content; assert the first heading of each `<section>` matches its
   peers' level; flag any ≥4-word string rendered more than twice in a document.
3. **Accept the current state** as the ratification point for Sumeet's review,
   which was the goal's stated purpose — "Sumeet reviews, then we replicate."

My recommendation is 2 then 1: build the four gates, freeze, and run the paired
passes. Guards are what convert a one-off fix into a property of the build, and
every round so far has proved that the class outlives the instance.

---

## 2. What the round changed

Three commits, all gates green, axe clean across 6 routes × 2 themes × 2 widths.

### `2c15d4d` — the site was synthesising every bold on it

The single highest-value finding of the round, and **two independent passes
nominated it as fix-first**. `layout.tsx` loads Newsreader 400/500/600, Inter
400/500/600 and Plex Mono 400/500. The modules declared 300, 550, 700, 800 and
900 — **92 of 181 declarations named a face that never arrives**. A browser does
not fail on that; it synthesises, smearing the nearest real face. The H1, every
H2 and every card title were affected.

The correction was to the declarations, not the loader. Canon §5 reads *"Display
Newsreader 500/600"*, so 800 was never sanctioned and loading it would have been
amending a ratified clause to match a bug.

| Was | Now | Where |
|---|---|---|
| 300, 400 | `--fw-body` (400) | body copy, blurbs |
| 500, 550 | `--fw-medium` (500) | h3, meta |
| 600, 700, 800, 900 | `--fw-strong` (600) | h1, h2, card titles, CTAs |
| mono at 600 | `--fw-mono-strong` (500) | Plex Mono ships no 600 |

**New gate:** `scripts/check-font-weights.mjs`. It has to run in a browser —
source analysis sees a literal but not which real face it resolves to. It
enumerates every rendered family/weight/style pair and requires each to exist in
`document.fonts`. **46 pairs across 7 templates, every one real.**

It immediately caught a second class of the same bug: `<cite>` is italic by UA
default and Plex Mono ships no italic, so both citation styles were slanted
romans. Reset globally — one instance had already been hand-fixed and the other
was missed, which is the argument for the global reset over the per-class one.

### The phantom third display size

`--fs-numeral` was `clamp(38px, 4.6vw, 62px)` and `--fs-headline` is
`clamp(32px, 4.4vw, 54px)`. Their **maxima are correctly ordered**, so reading
the tokens tells you nothing is wrong. But headline caps at 1227px while numeral
kept growing to 1348px, so across that span a third display size existed that no
token declared:

| Width | display | numeral | headline | |
|---|---|---|---|---|
| 1024 | 57.34 | 47.10 | 45.06 | numeral 1.045 over headline |
| 1280 | 62.00 | **58.88** | **54.00** | metric figures louder than every H2 |
| 1348+ | 62.00 | 62.00 | 54.00 | numeral collapses onto display |

Re-pitched to `clamp(28px, 3.85vw, 47px)` — a real step *below* the headline,
which also fills the 54 → 27 hole. `check-type-scale.mjs` now evaluates the
clamps across a nine-width sweep, because that is the only way to see it. Roles
that share a step collapse rather than reporting a false 1.000 ratio.

The tracking check was widened from `--fs-label` to **both** 13px mono roles.
That gap is how `.statL` — the four canon §6 metric labels — shipped uppercase
at 0.06em against A4's 0.12em floor. Six real breaches, on the homepage, the
brief form, both L1s and the nav.

### The two held fixes, both root-caused

**A3 glass had never rendered.** Not a stylesheet fault: Lightning CSS treats an
author-written prefix pair as one property and re-emits from its own targets,
and given both forms it kept **only** `-webkit-backdrop-filter`. Tailwind's own
backdrop utilities emit both because Tailwind generates the pair internally.
Dropping the hand-written prefix lets the build prefix it correctly. The scrolled
header now measures `backdrop-filter: saturate(1.35) blur(14px)`.

**The sticky CTA** read `scrollYProgress.get()` inside a `scrollY` handler — two
motion values updated by the same frame with no ordering guarantee. Progress is
now derived from the same `y`, so the two cannot disagree.

### `8290812` — a real tablist, and two dead affordances deleted

The segment switcher activated on **focus** and carried `aria-pressed`, modelling
thirteen independent toggles rather than a thirteen-way single select. A keyboard
user tabbing towards the CTA swapped the panel thirteen times; a screen reader
was told nothing when 400px of content changed. **axe cannot see any of it.**

Now `role=tablist` / `tab` / `tabpanel` with roving tabindex and arrow, Home and
End keys. Verified: **13 tabs, 1 tab stop**, focusing a distant trigger no longer
changes the panel, arrows move focus and selection together.

The markup is `div`/`div` rather than `ul`/`li`. `role=tablist` requires
`role=tab` **children** — that relationship is the `aria-required-children`
failure that made Engage use disclosure instead of tabs — so every item had to
become presentational, at which point the list semantics were already gone.

The Expertise section's only exit was a `<div>` carrying the link's class: same
gold, same arrow, same hover translate, `href: null`. It renders nothing now. The
href is additionally gated on `routeExists`, because `tools` only says the *data*
could support an L2 and **there is no `/capabilities/[cap]/[fn]` route at all** —
the template was composing a URL that would 404 if the field were populated.

A job title had **three** treatments on one page. `.segRolePill` was deleted
rather than restyled: it set the product Yallo sells in the machine face at 13px
and spent `--accent-label` on an inert `<span>`.

### `141ef0b` — three published figures with nothing behind them

The most serious category. See **QUESTIONS.md Q12**.

| Figure | Page | Problem | Action |
|---|---|---|---|
| 72% | data-analytics | **Miscited** — the source says 72% of employers cannot find skilled talent *in general*, with AI/IT/data among the hardest categories. The page narrowed it to a data-specific claim. | Restated to the wording already ratified in `home/personas.ts` |
| 68% | cloud-infrastructure | **Untraceable** — the string appears exactly once in the whole repository, with ManpowerGroup's name attached | Deleted |
| "4–6 wks" | both | **Unsourced** — no source in the repo or the legacy corpus | Deleted |

The root cause is structural: `L1IntroStatCard` had **no `source` field**, so the
only way to cite a figure was to append "(ManpowerGroup, 2026)" to the claim
text. A citation that reads as prose is not doing a citation's job — and inlining
it is exactly how the miscitation survived, because the source's name lent
authority to wording the source does not support. The field exists now and
renders as a citation, so an uncited figure is a visible omission.

Nothing was invented to fill the gaps.

---

## 3. Findings I investigated and did **not** act on

Recorded because "I checked and it was fine" is worth as much as a fix.

| Reported | Verdict |
|---|---|
| JSON-LD ships absolute `http://localhost:3000` URLs | **Not a defect.** `src/lib/seo.ts:7` reads `NEXT_PUBLIC_SITE_URL` with a localhost fallback for local builds. The critique measured a local build. |
| "Every rail mark is upscaled, up to 3.22×" | **Diagnosis wrong, symptom real.** Every source PNG is 112px tall and **down**scales 0.66× at DPR 2. The fault is that `LogoRail` passed `width={120} height={26}` to `next/image` while the mark displays at up to 208×37, so the optimiser served a variant sized for the pre-resize box. Fixed at the request, not the asset. |
| Detector `broken-image` at `HeroAtmosphere.tsx:35` | **False positive** — the regex matched `<img>` inside a JSDoc sentence saying the component deliberately does not use one. |
| `--fs-display` and `--fs-numeral` equal at the mobile floor | **Not a violation.** Two roles on one step are one step; my first draft of the adjacency guard reported it as a 1.000 ratio and was wrong. |

---

## 4. Still open

**Homepage, P1.** Rail ink density spans 9× — `wickes` 59.5% of pixels above 75%
alpha against `wipro` 6.3%. The box-lockups silhouette as the *box*, so they read
as solid slabs, and on dark as near-white cards, which canon §8 forbids. The
`RENDER_HEIGHT`/`RAIL_CELL`/`RAIL_CAP` constants in `build-logos.mjs` have been
corrected to the enlarged geometry (156 → 208, 26 → 37), which changes the
mark-versus-typeset-name decision; **the pack has not yet been regenerated.**

**Homepage, P1.** Platform marks in `#place` still render in full brand colour on
light tiles, eight sections below a client rail that was just taken to zero
chroma — two logo treatments under opposite rules on one page.

**Homepage.** `Hero.tsx` does not use `HeroAtmosphere`, so the 90s drift added in
`1e9a49d` never landed on the homepage. The earlier claim that it was "verified
in both modes" was verified on a different template.

**Retail.** The 20-card taxonomy has a ~1.3% clickable area; the scarce-role list
carries 16 chips worth roughly half a bit; the closing card has 444px of dead
width and six inert chips dressed as buttons.

**Q11** (new) — "Active bench across 3 markets" against canon §2's supply/demand
ban. Flagged for adjudication, not changed.
**Q12** (new) — the three removed figures, and what is needed to bring them back.

---

## 5. Evidence

Screenshots for this checkpoint: `docs/status/shots/plateau-r2/` — four surfaces
× two themes × 1280 and 390, full-page, sixteen files.

Gates, all green on `141ef0b`: `check:terms`, `check:contrast`, `check:type`,
`check:motion`, `check:reflow`, `check:weights`, `check:a11y`.
