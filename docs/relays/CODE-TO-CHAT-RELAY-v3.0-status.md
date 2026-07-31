# Yallo Talent — Code → Chat, Relay v3.0

**31 July 2026 · Project GTM.01 · From Code to the Chat lens**
Follows: `CODE-TO-CHAT-RELAY-v2.3-recritique.md`
Repo: `github.com/yallo-talent/yallo-talent-website` · `main` @ `3dc31ef` · CI green
Reports: canon amendments A1–A6, the 11-step order, and the B1–B7 bolt-on

---

## 0. TL;DR

Two ratified amendment sets have landed and been built against: **A1–A6** and the
**B1–B7** bolt-on. Five PRs, all merged on green CI. The site is materially
different from the one v2.3 described — warmer dark register, a 13px type floor,
suite-level platform pages, atmospheric heroes, 22% less gold, and a legacy corpus
that is now citable.

**Six things need Chat's or Sumeet's word.** Three are new and two of those are
blocking real work:

1. **Q7 — two ratified canon rules contradict each other.** A4's sizes cannot
   coexist with the 1.125 adjacency rule. I picked one and narrowed the other.
   §3.1.
2. **Q9 — Blue Yonder has no corpus source at all**, so its platform page is the
   one still mixing two levels of abstraction. Three SAP desks are parked for the
   same reason. §3.2.
3. **Q10 — the `.wpress` archive is media-only.** It cannot corroborate a word of
   copy, which changes what "sourced from the corpus" can mean. §3.3.
4. Q1, Q2, Q3 unchanged from v2.3.

**One thing Code did NOT do, and it is the largest gap:** no page has reached
plateau. §5.

---

## 1. What shipped

### Canon first, then code

A1–A6 were written into `docs/design/yallo-talent-CANON.md` and committed
**before any build work**, as instructed. The amendment log carries all six with
the line each supersedes.

| # | Amendment | Built |
|---|---|---|
| A1 | "specialist-screened/-led" replaces "architect-screened/-led" | **97 replacements**, guard-enforced, injection-proven |
| A2 | gradient text as a display accent | canon only — **no surface uses it yet** |
| A3 | glass returns as one governed utility on five surfaces | shipped; guard changed from ban to allow-list |
| A4 | type floor raised to 13px | shipped — and it broke a rule, see §3.1 |
| A5 | hover elevation as an interaction state | shipped |
| A6 | India is a demand market as well as the supply hub | closes Q5 |

### The 11-step order

All eleven executed. Highlights rather than a list:

- **Dark comfort.** The register was blue-biased on every step (R < G < B) under a
  warm gold accent, with peak text at 13.62:1 doing the glare. Now warm charcoal,
  peak text 12.94:1, hairlines 1.17:1. **All 32 contrast pairs still pass and two
  improved.**
- **Four ways** rebuilt as a vertical master-detail — one DOM serves desktop
  master-detail and the mobile accordion, because source order *is* the accordion.
- **Client rail** rebuilt as true single ink. See §4, it is the most instructive
  item in the run.
- **L1 composition:** three weakest sections dropped, counting headings removed.
  The retail L1 fell **10,933px → 7,740px (−29%)** with nothing removed that
  carried a claim.
- **L2 grammar:** the "jumble" turned out to be a *duplicate* — a wall of 17
  orphan chips that unioned every role from the tool cards below it, so the same
  names appeared twice, once with no context.
- **Hue plumbing deleted** — 139 CSS consumers, 8 stub sites, 48 data fields, 30
  shim declarations. Canon §5's ban is now structural. Closes Q6.

### The B1–B7 bolt-on

- **B2, the structural one.** Platform pages were publishing *sector* modules
  because `derive.ts` re-projects sector data onto the platform axis and retail
  was the only sector seeded with SAP, Oracle and Salesforce tools. SAP 12 retail
  → **14 suite**; Oracle **8 of 10 were Oracle *Retail*** → **9 suite**;
  Salesforce 3 retail → **6 suite**. Microsoft and Workday were already correct.
- **B3, heroes.** Four shells each rolled their own background out of stacked
  layers — a *bounded* card plate pinned into a corner, plus tint, overlay and
  grid, and three `blur(90px)` orbs canon bans by name. One atmospheric field
  replaces all of it, deterministic per page.
- **B4, gold.** **573 → 447 references (−22%)**: 47 resting borders, 33 washes, 38
  mono eyebrows. Gold keeps interaction, focus, filled CTAs and the hero emphasis.
- **B5, phrases.** "WHAT WE CAN FIND FOR YOU" was the named case, but the
  *treatment* was the bigger half — whole phrases set in mono uppercase.
- **B6, disciplines.** Both seeded pages already existed; the gap was the four
  PLANNED, which rendered **nowhere**. The hub listed two cards under an H1 saying
  "Six cross-cutting capabilities", contradicting itself.
- **B7, menu.** Panel gets the ambient field; `opacity: 0.55` on planned items is
  gone.

---

## 2. Gates, on every merge

axe clean across up to 8 routes × 2 themes × 2 widths · contrast **32/32** in both
registers · type scale clean at the 13px floor · terminology clean across 186
files · 0 dead hrefs · no 360px overflow · reduced motion honoured with a
motion-allowed control pass.

**One new CI gate exists that did not before:** `check-motion.mjs`. It came out of
v2.3's correction and guards both mechanisms — Framer's `reducedMotion` and the
CSS reset's specificity — with a control pass so a page that never animates cannot
score a vacuous pass.

---

## 3. For Chat — the open questions

### 3.1 Q7 · Two ratified canon rules contradict each other **(blocking a decision, not work)**

A4 enumerates **13px** (mono labels), **14px** (meta, footer links) and **15px**
(nav, buttons) as required sizes. Canon §5's adjacency rule says no two adjacent
fixed steps sit closer than a **1.125** ratio.

- 14 / 13 = **1.077**
- 15.5 / 14 = **1.107**

There is no ramp that satisfies both.

**What Code did:** let A4 win as the later and more specific ratification, and
narrowed the adjacency rule to apply **from `--fs-body-sm` (15.5px) upward** — the
display and heading chain, where its ratios still hold at 1.129, 1.143, 1.147 and
1.15.

**The argument for the narrowing:** adjacency exists so a reader never meets two
*heading* steps they cannot tell apart. In the small-text band the roles are
separated by family, case, tracking, weight and colour as well as size — mono
uppercase tracked at 13px against sans sentence-case at 14px is not a size
comparison at all.

**This is Code trimming a ratified rule, so it needs confirming or reversing.** The
alternative is dropping one of A4's three sizes, most likely collapsing meta and
nav onto a single 15px step, which satisfies adjacency but loses the meta/control
distinction.

### 3.2 Q9 · Blue Yonder has no corpus source **(blocking real work)**

B2 required module names to come **only** from the legacy corpus. For SAP, Oracle
and Salesforce the corpus has platform-level pages that enumerate the suite. For
**Blue Yonder there is no corpus file at all** — no `platform/blue-yonder.md`, no
`blue-yonder-expertise.md`.

**Consequence:** Blue Yonder is the one platform page still mixing two levels of
abstraction. It shows the retail cut (Merchandise Management, Assortment
Optimization, Space Planning) alongside genuinely suite-level modules (WMS, TMS,
Luminate, Demand Planning). Inventing its suite list is exactly what the run's
rules forbid, so it stays skewed until there is a source.

**Also parked, corpus-attested but not published:**

| Name | Why not published |
|---|---|
| SAP Special Applications | Not a product. The legacy scope line describes a *category*, so there is no bench to name and no honest role list. |
| SAP Business One | SMB ERP. Canon §1 positions Yallo on enterprise platform programmes. |
| SAP Business ByDesign | Same, and SAP has sunset new sales. |

**What would settle it:** name the Blue Yonder desks you staff, or point at a
source. Same for the three SAP names — a yes on any and it publishes with roles
mapped from the existing families.

### 3.3 Q10 · The `.wpress` archive is media-only **(changes a premise)**

B1 assumed the archive was a content export. It is not.

Extracted and indexed: **27,645 entries, 5.51 GB**, of which **26,921 are
`uploads/`** — 17,418 PNG, 5,694 JPG, 1,497 WebP, 181 MP4, 49 MP3. There is **no
`database.sql` and no WXR** anywhere in it. It is an All-in-One WP Migration
*files* export.

**What this means for anything citing "the corpus":**

- The archive is the authoritative **media** manifest, built from the container
  itself.
- It **cannot corroborate a single word of copy.** The content corpus at
  `content/` — 96 files from an earlier **live-site fetch** — is the only citable
  source for module names, and is what B2 used. Its own report notes no WXR was
  provided, so page content came from HTTP and may carry render artefacts.

**If a full export exists**, a `database.sql` would let the inventory be rebuilt
from `wp_posts` rather than fetched HTML, settling publish dates, drafts and
revisions the fetch cannot see.

### 3.4 Also new, recorded rather than asked

**Q8 · The mega panel cannot have A3 glass**, even though A3 allow-lists it. The
panel is a child of the header, which is itself glass once scrolled, and a
`backdrop-filter` inside an element that already has one is a no-op. Measured, it
took the translucent ground and reported `backdrop-filter: none` — translucency
with **no blur**, the one combination that actively harms legibility. **A3 bans
stacked blurs for exactly this reason, so the rule caught its own case.** Making
it glass needs the panel rendered as a sibling in a portal; worth doing only if the
effect is specifically wanted there.

### 3.5 Carried from v2.3, still open

- **Q3** — canon §5's register line, recording light as adopted site-wide, awaits
  Sumeet's ratification.
- **Q1** — ambient intensity inside PetalPlates.
- **Q2** — six defects in the *published* case-study source (deck lines belonging
  to the wrong study, an empty heading, verbatim reuse across two unrelated
  studies). These are client-side corrections, not Code decisions.

---

## 4. One item worth Chat reading in full: the client rail

The brief said the marks were "tiny, inconsistent, several illegible dark blobs".
The cause was not the CSS. Every mark was a **flattened white tile** shown through
`grayscale()` plus a per-theme `mix-blend-mode` — and a blend mode composites
against each asset's **own baked background**, so it can never give one tone across
a pack where some grounds are white, some off-white and some genuinely dark.

Fixed at the source. `scripts/build-logos.mjs` now keys the ground out at build
time and emits **true-alpha silhouettes**, so the whole treatment is one filter per
theme and **no blend mode at all**.

**Two keying attempts failed first, and the failures are the useful part:**

1. *Greyscale, normalise, invert.* Assumes dark ink on a light ground.
   `marks-and-spencer` measured **96.5% partial alpha, 0.1% transparent** —
   inverting a white-on-dark mark makes the ground opaque and the ink vanish.
2. *Border-ring sample for the ground luminance.* 9 of 15 clean; six stayed under
   6% transparent because their grounds are gradients or brand colours.
3. *Otsu's method.* Ships. Finds the luminance split between ink and ground; the
   border ring only decides which class is which, so either polarity works.

**Eleven marks key cleanly. Six ship as their NAME** — canon §8's own rule, applied
by measurement rather than by eye. The build refuses to emit an asset it cannot
vouch for:

| Mark | Reason |
|---|---|
| Landmark Group | 21.3% transparent, 70.8% partial |
| Chalhoub Group | 16.8% transparent, 74.4% partial |
| Al Othaim Markets | 19.4% transparent, 70.5% partial |
| Sephora | 3.8% transparent, 50.4% partial |
| Oracle Consulting | 2.2% transparent, 67.4% partial |
| Richemont | cap height 10.7px at the rail cell |

**Worth commissioning:** monochrome SVG silhouettes for those six. Nothing is
broken without them — a name is a legitimate treatment, not a placeholder — but a
vector would let all fifteen render as marks. **This is a content/asset decision
for Chat and Sumeet, not a Code one.**

---

## 5. What Code has NOT done

**No page has reached plateau, and this is the largest outstanding gap.** The exit
criteria ask for two consecutive critique passes with no score gain, per touched
page. Across both runs Code changed roughly eighteen surfaces and scored none of
them afterwards. The only scored data remains v2.3's: homepage 23/28 → 21/28, and
the retail L1 at 20/36 (re-based to ≈15/36 → 20/36 like-for-like).

**Recommendation:** the next dispatch should be scoring, not building. Building
without re-scoring is how a run accumulates unverified claims.

**A2 gradient text is ratified but unapplied.** The conditions are in canon —
gold-anchored, AA at the *lightest* stop, headline emphasis spans only — and no
surface has taken the permission up. Nothing regressed; a ban simply became a
permission nobody used.

---

## 6. Two corrections to Code's own earlier reporting

Recorded because both nearly reached a report as fact.

**Reduced motion was never honoured**, despite an earlier report listing it as a
met exit criterion. Framer defaults to `reducedMotion: "never"` and there was no
`MotionConfig` anywhere; separately, the universal CSS reset was losing on
specificity to every component class declaring a `transition`. Both fixed, both
now guarded.

**Two hero contrast probes were artefacts.** One sampled a single pixel that landed
*inside a glyph* and read 1.75:1; the other used modal sampling and returned the
**gold emphasis span** rather than the ground. axe pairs text with its own
background correctly, and once run on the hero routes it found **three real defects
the probes had hidden** — all in `HubLandingSections`, which keeps its own copy of
the L1's rules, so three fixes made to the L1 in earlier rounds had never reached
it. **Duplicated stylesheets are the standing structural risk in this codebase.**

---

## 7. State

`main` @ `3dc31ef`, in sync with origin, working tree clean, CI green on every
step. Five PRs merged this window: #6, #7, #8, #9, #10, #11.

Reports: `docs/status/A1-A6-RUN-REPORT.md` and `docs/status/B1-B7-RUN-REPORT.md`.
Corpus: `../yallo-legacy-archive/` — `INVENTORY.csv`, `LINKS.json`,
`MEDIA-MANIFEST.ndjson`, `NUMBERS-FOUND.json`.

**Nothing on the site is invented.** Where a source did not exist — Blue Yonder's
suite, three SAP desks, six client marks — the surface renders what it can and the
gap is named in `QUESTIONS.md`, now Q1 through Q10.
