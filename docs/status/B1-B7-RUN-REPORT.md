# Bolt-on run — B1 to B7

**31 July 2026 · Project GTM.01 · `main` @ `a40baef` · two PRs, both merged on green CI**

All seven items executed. [#10](https://github.com/yallo-talent/yallo-talent-website/pull/10)
carried B1 and B2; [#11](https://github.com/yallo-talent/yallo-talent-website/pull/11)
carried B3 to B7.

---

## 1. Corpus inventory summary (B1)

I built the `.wpress` extractor from scratch. The format is a flat sequence of
4377-byte headers plus raw payloads, streamed because the archive is 5.1 GB.

**Two parsing bugs, both found by measurement rather than by reading:**

1. The fields are null-**terminated** inside fixed-width slots, not null-padded
   to the end of them. Stripping only *trailing* nulls left thousands of interior
   ones, which corrupted every path and truncated the walk at **998 of 27,645**
   entries.
2. The manifest had to become NDJSON — a single `JSON.stringify` over the entry
   list threw `RangeError: Invalid string length`.

### What the archive actually is

| | |
|---|---|
| Entries | **27,645** |
| Total | **5.51 GB** |
| `uploads/` | **26,921** (97.4%) |
| PNG · JPG · WebP · JPEG | 17,418 · 5,694 · 1,497 · 1,239 |
| MP4 · MP3 · SVG · WOFF2 | 181 · 49 · 180 · 302 |
| **`database.sql` / WXR** | **none — zero** |

**It is a files export, not a site export.** That changes B2's premise: the
archive is the authoritative *media* manifest and cannot corroborate a word of
copy. The **content** corpus at `content/` — 96 files, built earlier from a
live-site fetch — remains the only citable source for module names, and is what
B2 used. Recorded as **Q10**.

### Corpus artefacts at `../yallo-legacy-archive/`

| File | Source | Contents |
|---|---|---|
| `INVENTORY.csv` | live fetch | 133 URLs, 119×200 and 14×404, 97 content files |
| `LINKS.json` | live fetch | internal link graph, 1.6 MB |
| `MEDIA-MANIFEST.ndjson` | **the archive itself** | 27,645 entries with byte sizes and mtimes |
| `NUMBERS-FOUND.json` | content corpus | **371 figures, 82.2% with no source stated** |

`NUMBERS-FOUND.json` earned its place immediately. It judges conservatively — a
figure counts as sourced only if a citation cue appears in the same sentence or
the next — so it over-reports, which is the safe direction for a gate whose job
is to stop unsourced numbers being ported:

| Figure | Uses | Ever sourced |
|---|---|---|
| 72 hours | 60 | yes |
| 2:1 | 20 | yes |
| **100K** | **10** | **no** |
| **20 years** | **7** | **no** |
| **14+** | **6** | **no** |

---

## 2. The suite-level module tables (B2)

`derive.ts` re-projects sector data onto the platform axis, and retail was the
only sector seeded with SAP, Oracle and Salesforce tools — so a buyer landing on
`/platforms/sap` to ask about SuccessFactors met a retail merchandising bench.
Correct mechanism, wrong level.

**An authored set now REPLACES the derived list rather than joining it.** Unioning
would have published 26 SAP modules at two levels of abstraction, which is worse
than either. The `appearsIn` cross-links and the whole `sectors` list survive.
Retail modules are untouched on the retail L1 and its L2s.

### SAP — 14 modules, every name verbatim from the corpus

| # | Module | Desk certain? |
|---|---|---|
| 1 | SAP S/4HANA On-Premise | yes |
| 2 | SAP S/4HANA Public Cloud | yes |
| 3 | SAP S/4HANA Cloud, Private Edition | yes |
| 4 | RISE with SAP S/4HANA | yes |
| 5 | SAP S/4HANA Finance | yes |
| 6 | SAP Analytics Cloud | yes |
| 7 | SAP BTP (Business Technology Platform) | yes |
| 8 | SAP Integrated Business Planning | yes |
| 9 | SAP Customer Experience | yes |
| 10 | SAP Service Cloud | yes |
| 11 | SAP Ariba (Procurement & Sourcing) | yes |
| 12 | SAP SuccessFactors | yes |
| 13 | SAP Extended Warehouse Management (SAP EWM) | yes |
| 14 | SAP Transportation Management (SAP TM) | yes |
| — | **SAP Special Applications** | **NO — Q9** |
| — | **SAP Business One** | **NO — Q9** |
| — | **SAP Business ByDesign** | **NO — Q9** |

**Oracle — 9:** Fusion ERP · Fusion HCM · Fusion SCM · Fusion CX · E-Business
Suite · EPM · Cloud Infrastructure · NetSuite · BI Apps. The legacy page's
industry verticals (Retail, Hospitality, Food & Beverage, Healthcare, Financial
Services, Communication) are deliberately **not** modules — they are sector cuts
of the suite, which is the level the sector L1s already work at, and repeating
them would rebuild the skew one layer up.

**Salesforce — 6:** Sales Cloud · Service Cloud · Marketing Cloud · Commerce
Cloud · Experience Cloud · MuleSoft Anypoint Platform. Its feature-level legacy
headings (CPQ, AI Recommendations, Digital Storefronts) are capabilities *inside*
a cloud, not desks.

### Audit of all six

| Platform | Before | After |
|---|---|---|
| SAP | 12 retail modules | **14 suite** |
| Oracle | **8 of 10 were Oracle *Retail*** | **9 suite** |
| Salesforce | 3, all retail — thin as well as skewed | **6 suite** |
| Microsoft | already authored, suite-level | untouched |
| Workday | already authored, suite-level | untouched |
| **Blue Yonder** | mixed | **unchanged — no corpus source (Q9)** |

**Two legacy defects corrected rather than ported.** The scope line under "SAP
Analytics" actually reads *"SAP S/4HANA Public Cloud offers scalable,
subscription-based ERP"* — a copy-paste error in the source. And every legacy
scope line is platform-speak where canon §9 requires Talent-speak, so **the names
are the corpus's and the scope lines are ours**.

---

## 3. Before and after

| Surface | Before | After |
|---|---|---|
| **Gold references** | **573** | **447 (−22%)** |
| — resting card borders | 47 gold | neutral hairline |
| — card washes | 33 gold-tinted | neutral tonal step |
| — mono uppercase eyebrows | 38 gold | `--fg-subtle`, hero keeps the accent |
| Hero background layers per shell | 4 stacked (plate + tint + overlay + grid) | **1 field** |
| Blurred orbs (`blur(90px)`) | 3 | **0** |
| Mega-menu icon tiles | 20 | 0 (earlier round) |
| Capability hub cards | 2 of 6 under an H1 saying "six" | **6, four honestly inert** |
| Disabled menu items | `opacity: 0.55` | full strength + "Desk in build" |

**Hero, before and after:** `docs/status/screens/b3-heroes/BEFORE-hero-1280-light.png`
and `AFTER-hero-1280-light.png`.
**Platform page:** `docs/status/screens/b2-platforms/`.
**Menu and hub:** `docs/status/screens/b5-b6/`.

---

## 4. Glass and gradient surfaces, with readings

| Surface | Shipped | Reading |
|---|---|---|
| Nav on scroll | **A3 glass** | ground 88% of the register's own; blur confirmed in both themes |
| Mega panel | **ambient field, no glass** | item labels 15.11:1, planned marker 6.18:1 |
| L1 hero | field + scrim | h1 14.45:1 light / 14.91:1 dark; lede 8.99 / 8.56 |
| L2 · service · hub heroes | field + scrim | axe clean, both registers |
| **A2 gradient text** | **not applied** | the permission exists; no surface uses it |

The mega panel cannot take glass: it is a child of the glass header, and a nested
`backdrop-filter` is a no-op — the ancestor's filter establishes the backdrop
root. Measured, it took the translucent ground and reported
`backdrop-filter: none`, i.e. translucency with **no blur**, the one combination
that actively harms legibility. **A3 bans stacked blurs for exactly this reason,
so the rule caught its own case.** It gets the ambient field instead, which needs
no `backdrop-filter` at all. Recorded as **Q8**.

---

## 5. Where my own measurement was wrong

Worth recording, because both nearly reached this report as fact.

**Two hero probes were artefacts.** Sampling a single pixel at the h1's left edge
landed *inside a glyph* and read **1.75:1**. Switching to modal sampling over the
h1's box returned the **gold emphasis span**, not the ground — so I was comparing
the h1's base ink against gold text. axe pairs text with its own background
correctly, and once run on the hero routes it found **three real defects the
probes had hidden**, all in `HubLandingSections`, which keeps its own copy of the
L1's rules.

**The pattern behind those three:** a fix applied to `L1PageShell` in an earlier
round never reached the hub's duplicate. `.wwdBadge`'s opacity-over-large-grade
defect, `.archInitials` (deleted from the L1 rounds ago, still rendering and
failing contrast), and `.wwdEyebrow` plus six siblings using the large-text gold
grade on small labels. Duplicated stylesheets are the standing risk here.

---

## 6. QUESTIONS.md

| # | State |
|---|---|
| Q1 | open — ambient intensity inside PetalPlates |
| Q2 | open — six source defects in the case-study bodies |
| Q3 | open — canon §5's register line awaits ratification |
| Q4 | **resolved** — alpha pipeline; six marks ship as names |
| Q5 | **resolved** by A6 |
| Q6 | **resolved** — hue plumbing deleted |
| Q7 | **needs your word** — A4's sizes vs the 1.125 adjacency rule |
| Q8 | recorded — mega panel cannot have glass while it is a child of the header |
| Q9 | **needs your word** — 3 SAP desks, and the whole Blue Yonder suite, have no source |
| Q10 | recorded — the `.wpress` archive is media-only |

---

## 7. Not done

**No page reached plateau.** The exit criteria ask for two consecutive critique
passes with no score gain, per touched page. This bolt-on changed eleven more
surfaces and scored none of them. That remains the largest outstanding gap.

**A2 gradient text is ratified but unapplied** — the conditions are in canon
(gold-anchored, AA at the *lightest* stop, headline emphasis spans only) and no
surface has taken the permission up.

Nothing on the site is invented. Where a source did not exist — Blue Yonder's
suite, three SAP desks — the page renders what it can and the gap is named.
