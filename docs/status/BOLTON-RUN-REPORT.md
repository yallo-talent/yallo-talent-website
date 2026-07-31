# Bolt-on run report — 1 August 2026

**Branch `main` · pushed · `5ef5824` · nine CI gates 9/9 green**
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

**One ratified item is only partially delivered: R11.** I reported it as shipped
earlier in the run. Measured properly now, it is not. Section 4 gives the figures.

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

## 4. R11 identity hues — partially delivered, and I over-reported it

R11's target was "SAP visibly distinct from Retail at a glance, both themes",
iterating "until visibly distinct, not until tokens resolve".

Measured on the **hero field mean**, like against like (ΔE76; 2.3 = just
noticeable, 5.0 = distinct):

| Pair | Theme | ΔE76 | Verdict |
|---|---|---|---|
| Retail vs Data & Analytics | light | **3.8** | perceptible, **not distinct** |
| Retail vs Data & Analytics | dark | **7.5** | distinct |
| SAP vs Retail | light | not comparable — see below | — |

On the **matched ambient section field**, Retail vs Data & Analytics separates by
only **1.1 ΔE** in light and 0.8–1.8 in dark — **below the just-noticeable
threshold**. The hue is carried by the hero and plates, and has effectively not
reached the section washes R11 named.

**SAP cannot be compared to Retail on hue at all.** Its L1 hero *and* its first
ambient section render near-black — `rgb(16,17,18)` — in **light** theme. There is
no hue there to differentiate. That also sits against **R12**, which ratified
light as the site-wide register, and it is the two-dark-band ceiling logged as
**Q19**.

So: R11's tokens are all live and all 18 domains resolve, hue is perceptible
between two light-hero pages, and the strongest surfaces R11 named — section
washes, and SAP itself — are **not** delivered. I should have measured this
before reporting R11 shipped instead of after.

I also reached that figure wrongly twice more in this run: my first two passes
compared a dark hero band against light ones and returned 65.1 and 86.3 ΔE. Both
meaningless — the same container-not-thing error the run has now made four times.

---

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

## 8. Not done

- **ORDER 7's remaining sweep** — balanced adjacent grids, de-densification and
  humanised chips are landed on the surfaces scored in this run, but the sweep
  across *every* remaining platform, discipline and sector is not complete, and
  the one-sample-per-family critique is not written.
- **Insight articles and blogs** — descoped permanently per the bolt-on. Not
  touched.
