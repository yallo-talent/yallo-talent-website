# Yallo Talent — Code → Chat, the L1 re-critique round

**30 July 2026 · Project GTM.01 · From Code to the Chat lens**
Follows: `CODE-TO-CHAT-RELAY-v2.0-status.md`, and the autonomous run report
Repo: `github.com/yallo-talent/yallo-talent-website` · `main` @ `feb688b` · CI green

---

## 0. TL;DR

An independent re-critique of the retail L1 found **five real defects**, and one
of them means a claim in my previous report was wrong: **reduced motion was never
honoured** on any animated surface, despite being listed as a met exit criterion.
All five are fixed, verified by measurement, and CI is green.

**Three things need Chat's attention, none of which Code can settle:**

1. **India** — canon §1 and PRODUCT.md directly contradict each other on whether
   it is a demand market. §4.1.
2. **Canon §5's register line** still awaits Sumeet's ratification. §4.2.
3. **The retired per-sector hue system** is inert but structurally complete —
   canon §5's ban currently rests on convention, not on code. §4.3.

**One correction to the critique itself:** it reported the metric defect as
`retail.ts`-only. Measured, it was on all **eight** L1 data files. §2.4.

**The exit criterion still unmet:** no page has yet shown two consecutive
critique passes without score gain. §5.

---

## 1. The correction that matters

My previous report listed **"reduced-motion honoured"** among the satisfied exit
criteria. It was not satisfied, and the breach was live on every animated surface
of the site. Two independent mechanisms were both absent:

| Mechanism | State found | Consequence |
|---|---|---|
| Framer Motion | No `MotionConfig` anywhere in `src/`; Framer defaults to `reducedMotion: "never"` | Entrance animations in `L1PageShell`, `ServicePageShell`, `NavBar`, `StickyBriefCTA` ran regardless of the user's setting |
| CSS reset | Universal `prefers-reduced-motion` block has specificity 0 | **Any** component class declaring a `transition` shorthand beat it — `.benefitCard` kept `transition: transform 0.3s`, measured |

The two interacted in a way worth recording for the design system: once
`MotionConfig` was added it correctly snapped the inline transform to target, and
**the surviving CSS transition then animated the jump anyway**. Fixing one without
the other would have looked like a fix and changed nothing.

Both are fixed. A new CI gate, `scripts/check-motion.mjs`, guards both halves and
is injection-proven in each direction: unmounting the provider fails 2 of 3
routes; dropping the `!important` fails `/contract`. It also runs a
motion-allowed control pass and fails if the control sees no motion either, so a
page that simply never animates cannot bank a vacuous pass.

**Why no existing gate caught this:** the token gate reads CSS and cannot see a
JS-driven inline transform; axe does not evaluate motion at all. This was a
structural blind spot, not an oversight in a route list.

---

## 2. The other four findings

### 2.1 `.segCta` failed WCAG 1.4.3 in the default register

`--ink-950` on `--sector-accent`, which resolves to `--gold-deep` on light — the
grade canon §5 reserves for **large** text and boundaries at 3.12:1. Under
13.5px/700 text it measured **4.38:1** against 4.5:1 required. Dark passed, so
this failed only in the register the site actually defaults to.

Moved to `--accent-mark` (**8.09:1**), and fixed as a pattern rather than an
instance: `.expCardOpenLink:hover`, `.expCardOpen .expCardToggleBottom` and
`.pillar:hover .pillarArrow` shared the same pairing. A sweep of every
gold-filled text element on the page now returns 8.09:1 with no exceptions.

### 2.2 Prose was bound to a mono token

Four prose blocks (`.wwdCopy`, `.hwwStepCopy`, `.archBio`, `.pillarCopy`) resolved
through `--fs-data`, whose own definition in `globals.css` reads *"mono: measured
values, reference numbers"*, and rendered at **12px**. The hero lede — the most
persuasive sentence on the page — was a literal clamp bottoming out at **14px at
weight 300**. Section ledes sat at 13.5px under a 40px H2, one step **below** the
card copy they introduced.

All of it now resolves through the ratified 13-role ramp: card prose to
`--fs-caption`, section ledes to `--fs-body`, hero lede to `--fs-lede` at weight
400, H1 to `--fs-display`, H2 to `--fs-headline`. `.expCardTitle` moves to
`--fs-card-title` so a card heading no longer measures the same as its own blurb.
The retired `--fs-caption-sm` alias is migrated out per its own instruction.

**Zero literal font-sizes remain in the L1 stylesheet.**

### 2.3 Four literal clamps

Fixed with the above. The `≤1100px` `.heroTitle` override is deleted, because the
base rule is now the same clamp that breakpoint existed to restore.

### 2.4 A fifth published metric — and the critique understated it

Canon §6 permits exactly four published metrics. Every L1 was publishing five, by
replacing **"50+ Programmes staffed"** with a per-page count — "20 Retail function
areas", "10 Cloud & Infra function areas". One label also diverged from canon
("CV to interview ratio" for "CVs per interview").

**The critique reported this as a `retail.ts` defect. Measured, it was on all
eight L1 data files** — six sectors plus two seeded capabilities. Three breaches
in one: an unsanctioned figure published, a sanctioned one dropped, and all four
values put beyond the reach of the quarterly refresh — editing
`content/metrics.yaml` would never have reached these pages.

The strip now renders from `metrics.yaml`, passed in by the server page, with
each **definition rendering beneath its value**. Canon §6 admits no published
figure without one, and an L1 is where organic traffic lands — a visitor may read
"2:1" having never seen the homepage block that defines it. The `stats` field and
the `L1Stat` type are **deleted** rather than left to drift back.

---

## 3. A false alarm, recorded because it nearly reached the report as fact

A local axe run produced **26 serious `target-size` violations** across routes I
had not touched, and I built a confident diagnosis on top of them — that
`min-height` cannot raise a non-replaced inline anchor, so an earlier fix of mine
had never taken effect.

**It was wrong.** The elements were measuring `font-size: 16px`,
`line-height: normal`, `display: inline` — browser defaults, not this design
system. A stale `next start` was still holding the port while `.next` had been
rebuilt underneath it, so every CSS chunk returned **HTTP 500** and axe was
scoring an unstyled page. `pkill -f "next start"` had missed it because the child
process carries a different command line.

Two durable outcomes:

- The axe gate now **asserts the stylesheets actually applied** before it reports
  anything, and refuses to score an unstyled page. Checking
  `document.styleSheets.length` is not sufficient — the `<link>` elements remain
  present with no rules behind them, so the count stayed at 2. The body font is
  the load-bearing signal. Injection-proven.
- The same gate's navigation moved from `waitUntil: "load"` to
  `"domcontentloaded"`, the change already ratified for `capture-home.mjs` in
  `8ce7898` and for the same reason: `load` waits for every subresource and timed
  out at 30s on a cold CI runner, failing the gate on timing rather than on
  accessibility. Stylesheets are render-blocking, so they are applied before
  DOMContentLoaded fires — which is what axe needs. **The rule set and exemption
  list are untouched; nothing was weakened to pass.**

---

## 4. For Chat — three items Code cannot settle

### 4.1 India: canon §1 and PRODUCT.md contradict each other

| Source | Says |
|---|---|
| Canon §1 | India is third — Global Capability Centre staffing for multinationals, **"never a demand market"** |
| PRODUCT.md | India **is** a demand market for Middle East staffing |

The L1 heroes currently sell programmes "across the Middle East, Europe and
India", which follows PRODUCT.md and reads against canon §1.

**Code's position:** left as-is, and logged as `QUESTIONS.md` Q5. Canon §1's own
sentence describes India as a market Yallo staffs *into* for multinationals, which
the hero wording does not strictly contradict — and rewriting six heroes on an
unresolved reading would be worse than leaving them consistent. **This is a
positioning decision, not a copy defect.** Ratify one reading and the wording
follows in a single pass.

### 4.2 Canon §5's register line still awaits ratification

Unchanged from the previous relay. The light register is built, live and passing
axe in both themes on every built surface; the canon line recording light as
adopted site-wide is written but **not yet ratified**. `QUESTIONS.md` Q3.

### 4.3 The retired per-sector hue system is one line from returning

Canon §5 bans per-taxonomy-branch ambient assignment as "the retired per-sector
hue system returning". The plumbing is inert but **fully present**:
`--card-hue*` is consumed in ~20 places and declared nowhere, `hueStyle()` and
`cardHueStyle()` are no-op stubs threaded through nine components, and `hue:`
fields persist across five data arrays.

**Code's position:** left in place this round and logged as `QUESTIONS.md` Q6.
Removing it touches nine components and five data files — its own dispatch, not a
step inside a critique fix round. **Recommend removing it before handback so the
ban is structural rather than conventional.**

---

## 5. The exit criterion still unmet — stated plainly

The autonomous run's exit criteria require **two consecutive critique passes
without score gain, per page**. That is not met and I am not claiming it.

| Page | Passes | State |
|---|---|---|
| Homepage | 23/28 → 21/28 | Two scored passes; changed since |
| Retail L1 | 20/36 raw | The critique re-based its own earlier pass to **≈15/36 → 20/36 (+13.9pp)** like-for-like, having found it had scored leniently against task-blocking defects. A gain, not a plateau — **and this round changed the page again.** |

**What the critique says still stands as composition work**, distinct from the
token and canon defects fixed above: six of thirteen sections repeat one figure
(eyebrow → counted H2 → lede → row of equal tiles); four section H2s open by
counting their own contents, which canon §2 removes on sight; and cognitive load
scores 6 clear failures of 8. Its verdict was that the page is now *"a correctly
tokenised light page with a template's section grammar"* — the token half of the
earlier criticism is measurably closed, the composition half is not.

**Recommended next dispatch:** section-grammar and composition on the L1 (drop or
fold three sections, remove the counting headings, give the scarce-role table and
the module taxonomy real design), then re-score for the plateau.

---

## 6. State

`main` @ `feb688b`, in sync with origin, working tree clean, **CI green on every
step** including the new reduced-motion gate.

**Gates, all on a verified production build:** axe clean across 6 routes × 2
themes × 2 widths · contrast 32/32 both registers · type scale clean, nothing
below 12px · terminology clean across 182 files · 0 dead hrefs · visual and
served-markup assertions pass · reduced motion honoured with a control pass.

**Nothing on the site is invented.** Where something is missing the component
renders nothing and the gap is named in `QUESTIONS.md` — now Q1 through Q6.
