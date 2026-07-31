# Bolt-on run report — 1 August 2026

**Branch `main` · pushed · `8d83990` · nine CI gates 9/9 green**
Covers the bolt-on `/goal`: S1–S3, R6–R15 and the seven-item ORDER.

Canon, evidence tables and the change log are the authorities; this report does
not restate them. See `docs/design/yallo-talent-CANON.md`,
`docs/design/blue-yonder-evidence.md`, `docs/design/ia-change-log.md`,
`docs/design/case-study-removals.md`, `QUESTIONS.md`.

---

## 1. Headline

**One P0 and nine P1s found and closed.** The P0 was mine, and it was the one
class of defect canon calls the rule above all: an invented client attribution.

The exit condition S1 sets — zero P1 — is **met on the three surfaces scored in
this run** (SAP, Data & Analytics, Blue Yonder) against the frozen build
`bolton-freeze-1` = `96bf6bc`, with every finding fixed as a class and re-verified.

**R11 is now delivered, and I had over-reported it.** Earlier in the run I called
it shipped because its tokens resolved — which is precisely what its own wording
told me not to do ("iterate until visibly distinct, not until tokens resolve").
The class carrying the wash was applied to nothing. §4 has the cause and the
after figures.

ORDER 1–7 are all addressed. ORDER 7's four items were measured across seven
routes in three families: identity hue landed this session, and the other three
already held — including one density defect I reported and then disproved with a
better instrument.

---

## 2. The P0

`/platforms/blue-yonder/blue-yonder-wms` rendered the heading **"Blue Yonder
programmes we have staffed."** above three case-study cards naming **Majid Al
Futtaim** (×2) and **Alshaya Group**.

`grep -rli "blue yonder" content/case-studies/` returns **0**. No study is tagged
Blue Yonder. None mentions it.

All three arrived through the `platform === "multi-platform"` limb of the evidence
join **I wrote for R6**. My reasoning was that a multi-platform programme spans
suites by definition. That reasoning defends *showing* those studies; it does not
license a *heading that names the suite*. The page therefore converted "spanned
several suites" into "was a Blue Yonder programme" about two real, named clients.

It was worst on the one suite that has no corpus — the suite R13 built under a
hard rule specifically to avoid guessing. The page omitted six real Blue Yonder
products for want of a mapped role, then asserted three client programmes on
strictly less evidence than it had rejected.

**Fix (S3, least-overclaiming, no ruling needed):** the tag must NAME the suite.
Blue Yonder now renders **no** evidence section, which is the honest state. SAP
keeps its 1 genuinely `SAP S/4HANA`-tagged study; Oracle keeps 3. Verified.

---

## 3. P1 by surface

| # | Surface | Finding | Class-level fix | Scope |
|---|---|---|---|---|
| 1 | SAP L2 | Siblings block shipped as a bare `div` eyebrow above up to 13 links — no heading, no accessible name, no landmark. WCAG 1.3.1 **Level A** | `nav` + `h2`; the L1 had already solved it one level up | ~30 routes |
| 2 | Data & Analytics | `.subNav` pinned at a hardcoded `72px` against `--header-h` 80/65 — a 7px slot with live content scrolling through it below 430px; a 9px tuck above 600px | `top: var(--header-h)` — the 4th such offset, the only one never migrated | 18 domain pages |
| 3 | Data & Analytics | `.crumbLink` 4.36–4.41:1 against a 4.5 threshold below 1024 | `--gold-ink` re-derived | site-wide token |
| 4 | Data & Analytics | `.heroEmphasis` 2.78:1 at 1024, 2.91 at 1280, against 3.0 | `--gold-deep` re-derived | site-wide token |
| 5 | Data & Analytics | Hover ladder exactly **inverted**: the four largest lifts (6/4/4/2px) all on non-interactive cards, every real control 1–2px | Display cards no longer lift; primary action 1px → 2px | L1 shell |
| 6 | Blue Yonder | Module order came from `roles.length`, which `derive.ts:164` inflates by unioning an unrelated retail seed match — Luminate Planning, the module the homepage names **first**, rendered 7th of 8 | Sort by the authored sequence | all suites |
| 7 | Blue Yonder | Both spellings of one Fulfillment role shipped, rendering 4px apart on the same row | One role; product keeps the vendor's spelling, our prose stays UK | data |
| 8 | Blue Yonder | "Blue Yonder" set 81.5px of ink in a 76px slot, overhanging a visible border | Two-line small-caps lockup: 48.4×28.0 inside 76×40. **The A4 floor did not move** | homepage |
| 9 | Blue Yonder | Link announced "Blue Yonder \| Blue Yonder \| Luminate · WMS · planning" | Both mark variants `aria-hidden`; the comment I wrote defending this was factually wrong | homepage |

Items 3 and 4 were **caused by my own R11 change**. The gold grades were
calibrated when the lightest thing behind them was `--paper-3` (225); R11 moved
the real painted ground to 205–229, and a *darker* ground lowers contrast for
mid-dark ink. I wrote "AA held throughout" when I shipped R11. It did not.

Fixed by darkening the ink ~6% rather than weakening the wash, because the wash
**is** R11. Now 4.88–5.33:1 and 3.23–3.60:1 across five widths in both themes,
measured from ground pixels beside the glyphs.

---

## 4. R11 identity hues — DELIVERED, after I first over-reported it

R11's target was "SAP visibly distinct from Retail at a glance, both themes",
iterating "until visibly distinct, not until tokens resolve".

**I reported it shipped when the tokens resolved. That was the error the wording
warned against.** The tokens were correct all along — `--amb` resolved to plum on
Retail, teal on Data & Analytics, indigo on SAP, at the ratified alphas. What was
wrong is that **`.amb-wash`, the class carrying the gradient that consumes `--amb`,
appeared ZERO times in any `.tsx`.** The rule existed, was well tuned, and painted
nothing. Identity reached only the petal plates. That is why every page read the
same coffee-brown however the tokens resolved.

Three faults, all now fixed:

| Fault | Detail |
|---|---|
| No wash hosts | `.amb-1` sat on `.page` — the whole document, 7,235px on Retail. The gradient sizes in percentages of its host, so on a box that tall it scales to the document and reads as nothing at viewport scale. Canon §5 already said the wash "lives on bands and panel edges". It now sits on four L1 bands, plus the platform L1's hero and two bands — that template is bespoke on `Home.module.css` and never received anything the L1 shell got |
| `.band-dark` inherited the LIGHT ambient tuning | It restates grounds, text and the Layer 2c aliases but not `--amb-alpha`, so in light theme a permanently dark surface laid a 20% tint chosen against a 233 ground over a 15 ground. SAP's hero measured `rgb(15,15,15)` — no hue at all, so SAP had nothing to be distinct from Retail **with** |
| It could not restate the HUE either | The hue is per-domain and `data-identity` is on an ancestor, so `--id` arrives already resolved to the light variant. 18 domain-paired rules now hand `.band-dark` the dark variant. They outrank `[data-identity].amb-1` on specificity (0,4,0 against 0,2,0), not on source order |

Measured after, hero band mean, ΔE76 (2.3 just-noticeable, 5.0 distinct):

| Pair | Light | Dark | Note |
|---|---|---|---|
| **SAP vs Oracle** | **7.3** | **7.3** | The real identity test: same register, differing only by hue |
| SAP vs Retail | 73.2 | 5.7 | Light figure is mostly register, not hue |
| Retail vs Data & Analytics | 5.0 | 8.7 | |

Before the change, Retail and Data & Analytics separated by 3.8 on the hero and
**0.0** where the washes should have been, because there were none.

**AA held**: contrast and a11y both re-run after the washes darkened every ground.

I reached the wrong figure twice more before getting here, both times by comparing
a dark hero band against light ones (65.1, then 86.3 — meaningless). That is the
container-not-thing error, and this run has now made it four times.

## 5. Gates, and two phantom failures

9/9 green: terminology, contrast, type-scale, motion, reflow, rendered-type,
a11y, interaction, visual.

Two reported failures were **not defects**. `check-a11y` and `check-motion`
default to port **3000**, which I had left stale across several rebuilds while
diligently restarting 3100. A stale `next start` answers **200** and serves a
build whose CSS chunks are gone, so:

- `check-a11y` correctly refused to score an unstyled page, and
- `check-motion` reported "29 offsets tweened under reduced motion" on
  `/contract` — a phantom, because with no CSS there is no
  `prefers-reduced-motion` block to honour.

Restarting 3000 turned 7/9 into 9/9 with **no code change**. Restart every port a
gate can target, not only the one in use.

One genuine gate hole closed: `check-a11y` read computed styles at
`domcontentloaded` plus a fixed 400ms. A stylesheet is load-blocking, so that is
a race, and it failed a server that was verifiably serving correct CSS. It now
waits for `load` and polls the assertion. **The guard itself is unchanged** — it
still fails a genuinely unstyled page.

---

## 6. S3 decisions taken without Sumeet

Each is the least-overclaiming option available, per S3.

| Question | Decision | Why this is the floor |
|---|---|---|
| May a `multi-platform` study sit under a suite-named heading? | **No.** Tag must name the suite | Any other reading asserts an attribution the data does not carry. Applies to SAP and Oracle too, which had partial cover |
| Fulfillment vs Fulfilment | Product name keeps the vendor's **Fulfillment**; our own prose stays UK **fulfilment** | Renders one role instead of two; changes no claim |
| Blue Yonder name treatment | Two-line tracked small caps, fitted in the slot | Refusing to shrink below the A4 floor to hide a layout fault |
| Gold grades vs field strength | Darken the ink, keep the wash | The wash is R11; the ink carries no ratified value at a specific lightness |
| Non-interactive hover lift | Remove it | A lift promises a click. These cards have none |

---

## 7. Still needs Sumeet

| # | Question | Why I cannot close it |
|---|---|---|
| **Q11** | Bench depth across the three markets | A business fact I do not have. Cannot invent |
| **Q12** | The 68% figure and the "4–6 wks" claim need sources | Unsourced numbers on a public page |
| **Q19** | `data-ambient="spectrum"` + footer vs the two-dark-band ceiling | Now blocking R11 on SAP specifically — SAP's light-theme hero is near-black, so it has no hue to carry |
| **R11 scope** | Should section washes carry hue, or is hero + plates the intended limit? | Measured 1.1 ΔE on section fields. Either the target moves or the washes do |
| **A5 scope** | Does the hover-pairing rule extend to non-interactive elements? | I applied the strict reading; the looser one is defensible |
| **R7 scope** | Does "plays once then rests" cover `hero-drift`'s 90s infinite loop? | Two passes flagged it P2; R7's text names the hero instrument and the rail |

---

## 8. ORDER 5 — mega menu

Hover-intent (120ms), close-on-route-change and the `band-dark` panel tone were
already in. Two things were not, and both were measured rather than reasoned:

- **The flicker was a REMOUNT.** Every group owned its own `AnimatePresence`, so
  moving between triggers unmounted one panel and mounted another. Measured 60ms
  into a switch: **two** panels on screen at opacity 0.32 and 0.67, cross-fading
  at two different x positions. `.megaPanel` is `position: fixed; left: 0;
  right: 0` and is never positioned by its group wrapper, so the panel hoists out
  of the loop for free. One panel now renders the active group's *content* —
  switching swaps children with no remount and no enter/exit. Re-measured across
  five rapid switches: **max 1 panel**, `aria-expanded` consistent with it.
- **Selection did not close it.** The pathname effect cannot: a link to the route
  you are already on changes no pathname. From `/platforms/sap`, choosing SAP
  from the menu left the panel over the page just requested. Verified both ways.

## 9. ORDER 6 — client rail

"Still too tiny", and the measurement says why: **the cap was the binding
constraint, not the cell.** At a 48px cap a wide mark reached 267px of its 268px
cell while a square one rendered 48×48 — 18% of the cell width. The rail read as
mostly-empty cells with a few full ones, and the square enterprise marks stayed
small whatever the cell did.

Cap 48 → **68**, cell 268×96 → **300×112**, and the build constants moved with
them so the three legibility tests measure what ships. Source art is emitted
224px tall, so a 68px cap still downscales — nothing is resampled up. Narrowest
mark 48px → 68px, widest 267 → 300. 13 marks ship as silhouettes, 5 as their
name; the build gate still declines every source that will not key to one clean
ink, per canon §8.

## 10. ORDER 7 — replicate, and one critique per family

Measured across 7 routes in three families rather than assumed:

| Item | Finding | State |
|---|---|---|
| Identity hue | All three families carry `data-identity` and 3 wash hosts each, verified painting at ΔE ≥5 between samples | **Landed this session** (§4) |
| Balanced adjacent grids | **Zero** ragged grids across all 7 routes. The `auto-fill` fix landed earlier holds: every row is full except the last, at any item count | Holds |
| De-densify | 2–4 bordered boxes per first viewport; measure ≤ **80ch** everywhere with **zero** paragraphs over 80, so AAA 1.4.8 already holds | Nothing to fix on evidence |
| Humanised chips | Role chips 15.5px, sentence case, normal tracking. The only uppercase chips are the 13px "Perm / Contract" meta labels at 0.12em, which the type gate mandates | Already humanised |

I corrected one of my own measurements here: a first pass reported 8 bordered
boxes in SAP's first viewport against 3 elsewhere. The detector counted any
element with a top border, so it conflated **dividers** with boxes — `.figure` is
a `border-top` hairline inside an already-bordered card, not a box in a box. The
true count is 4. There was no density defect to fix.

### Critique, one sample per family

**Platform — `/platforms/sap`.** The strongest of the three. Four `WhyRail` cards
in the first viewport are equal-weight and equal-size, which suits four parallel
claims, and the metric divider inside each gives the eye a second rank without a
second box. The weakness is repetition rather than density: 80 role chips on one
page, and the hero lede at 72ch is the only wide prose, so the page reads as a
long list punctuated by headings. It would gain more from one visual carrier
mid-page than from any further de-densification.

**Sector — `/industries/retail`.** Best prose rhythm of the three: 14 paragraphs
over 120 characters but none over 80ch, and `segCopy` sits exactly on 80 — right
at the ceiling, so any future width increase to that column will breach it. Worth
capping in `ch` rather than px so it cannot drift. Identity plum now reads
clearly against Data & Analytics' teal (5.0 light, 8.7 dark).

**Capability — `/capabilities/data-analytics`.** Structurally the same shell as
retail and now correctly differentiated by hue, but it is the thinnest on
evidence: 32 chips against retail's 44 and SAP's 80, and the two `sub`
paragraphs at 75ch carry more of the page's weight than on either sibling. The
fix is content, not layout — and it is the surface where the two remaining
unsourced claims (Q12) sit.

## 11. Not done

- **Insight articles and blogs** — descoped permanently per the bolt-on. Not
  touched, not ported, not templated.
- **Service-family identity hue** (`/managed-delivery`, `/eor`) — these carry no
  `data-identity` and no wash. They are not platforms, disciplines or sectors, so
  they sit outside ORDER 7's scope; flagging rather than inventing an 19th domain
  hue for them.
