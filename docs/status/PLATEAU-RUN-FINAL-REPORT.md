# Plateau run — final report

**31 July 2026 · branch `plateau-run` · 43 commits · Code**

The six deliverables the goal asks for, in order. Every figure here was measured
in a browser against the served build, not read from source. Where I got a
measurement wrong during the run and corrected it, the correction is recorded
rather than quietly replaced.

**Headline: 0 of 4 surfaces plateaued. Three have no open P1s; SAP has one, and
it is blocked on your ruling, not on work. The plateau condition itself cannot
be satisfied by the loop as run — §7 explains why and what to do instead.**

---

## 1. Per-pass scores per surface

| Surface | Pass 1 | Pass 2 | Pass 3 | Pass 4 | Open P1s now |
|---|---|---|---|---|---|
| Homepage | 25/36 | 25/36 | 27/36 | **28/36** | **0** |
| `/industries/retail` | 22/32 | 21/32 | 23/32 | 20/32 ¹ | **0** |
| `/capabilities/data-analytics` | 23/36 | 22/36 | 29/36 | 25/36 ² | **0** |
| `/platforms/sap` | 16/24 (67%) | 17/24 (71%) | 64% ³ | — | **1** (Q17) |

¹ Pass 4 rebuilt the rubric as 16 criteria × 2 rather than reusing the earlier
shape, so 20/32 is not comparable with 23/32. Its own instruction: treat the
direction as indicative and the findings as the signal.
² Pass 4 was the first to traverse the header by keyboard and probe fixed-overlay
occlusion. Both produced P1s, and both categories were unmeasured in pass 3 — so
29 → 25 is scope widening, not decay. Every pass-3 fix verified clean.
³ Pass 3 rebuilt the denominator too (18/28). Percentages are the only
comparable series for this surface.

**What the scores hide, and what matters more.** Every pass verified the previous
round's fixes by measurement rather than accepting them on report:

| Pass | Fixes claimed | Verified landed |
|---|---|---|
| D&A 3 | 8 | 7½ |
| D&A 4 | 4 | 4 |
| Retail 3 | 5 | 4 fully, 1 with a regression it then found |
| Retail 4 | 7 | 5 clean, 2 partial (both named) |
| SAP 3 | 6 | 6 |
| Homepage 4 | 5 | 5 |

---

## 2. The IA change table (R5)

Full table: **[docs/design/ia-change-log.md](../design/ia-change-log.md)**. Summary:

| Domain | Was | Now | Status |
|---|---|---|---|
| **SAP** | 14 modules | **17** | Done — 3 added, 3 retired, 2 corrected (21% amended, inside R5's 20–30%) |
| Oracle | 8 of 10 were Oracle *Retail* | 9 at suite level | Level corrected; staleness pass outstanding |
| Salesforce | 3, all retail | 6 | Level corrected; staleness pass outstanding |
| Microsoft | ratified | unchanged | Fabric flagged for you, not changed |
| Workday | ratified | unchanged | no flags |
| Blue Yonder | mixed levels | unchanged | **Blocked — Q9, no corpus file exists** |
| Data & Analytics | 6 disciplines | unchanged | **Outstanding — the one R5 gap in this run** |

**Added to SAP**, each corpus-attested: SAP Datasphere (two independent mentions;
supersedes Data Warehouse Cloud), SAP Fieldglass (external workforce management —
the system a client uses to engage contractors), SAP Emarsys.

**Retired per R2**: Special Applications (a category, not a product), Business
One, Business ByDesign (SMB ERP against canon §1's enterprise wedge). Verified
absent from the build: **0 occurrences of each**.

**Parked rather than added**: Signavio, LeanIX, Concur, Business AI/Joule — all
real products, none corpus-attested. R5 permits a current market name; it does
not permit a guess about what Yallo staffs.

---

## 3. The identity palette (R4) — hex and contrast evidence

Full proposal: **[docs/design/identity-palette-proposal.md](../design/identity-palette-proposal.md)**.

The identity hues **are** the existing six-hue ambient family, re-pointed from
position to domain, rather than a second palette beside the first.

| Hue | Light | on paper | Dark | on charcoal |
|---|---|---|---|---|
| indigo | `#3a5a8a` | 5.74:1 | `#5677b3` | 4.27:1 |
| teal | `#3d7d7d` | 3.90:1 | `#4e9a9a` | 5.85:1 |
| plum | `#8e4a72` | 5.12:1 | `#b45c8e` | 4.44:1 |
| moss | `#4a7d55` | 3.97:1 | `#5e9a6b` | 5.76:1 |
| violet | `#5f5694` | 5.32:1 | `#7a6fb8` | 4.37:1 |
| umber | `#9a6e3e` | 3.70:1 | `#c08a4e` | 6.37:1 |

Those ratios are **not** a pass/fail gate — R4 confines the hue to the ambient
layer, consumed at `--amb-alpha` (8% light / 14% dark) behind a scrim. The column
serves R4's conditional clause only: if a text grade is ever derived from one,
that grade must clear AA alone. **Four of six already would in at least one
register; teal, moss and umber would each need a darkened `-text` grade on light
first. Nothing consumes one today.**

**Lead trio, verified painting rather than merely declared:**

| Domain | Token | `--amb` light | `--amb` dark | Painted SVG fill |
|---|---|---|---|---|
| SAP | `--id-sap-*` | `#3a5a8a` | `#5677b3` | `rgb(58,90,138)` / `rgb(86,119,179)` |
| Data & Analytics | `--id-data-analytics-*` | `#3d7d7d` | `#4e9a9a` | `rgb(61,125,125)` |
| Retail & Consumer | `--id-retail-*` | `#8e4a72` | `#b45c8e` | `rgb(142,74,114)` |

**Containment verified independently by three passes:** zero identity hue on
`color`, `border-*-color`, `outline-color`, `text-decoration-color` or any state,
on any of the three surfaces. Gold remains the sole interactive accent — one pass
audited all 56 interactive elements and found **0** coloured by anything but gold
or the ink/paper neutrals.

**Two measurement corrections, both mine and both worth recording.** Two passes
reported "R4 unimplemented — `--amb` is the empty string", and I reproduced it
before catching the cause: the platform shells put `.amb-N` on section heroes
*inside* the `[data-identity]` element, so reading `--amb` off the declaring node
returns nothing. It resolves where it is consumed. Verified by the painted fill,
which is the only reading that cannot be fooled this way.

**Open question on strength.** A pass measured the light register at mean ΔE76
1.96 against dark's 2.54, with the **median pixel carrying zero identity colour**
and only 1.5–2.5% of the band above ΔE5. Its recommendation — and I agree — is to
widen *coverage* (which surfaces inherit `--amb`) before raising `--amb-alpha`,
because 8% is canon's stated cap and raising it needs your amendment. Not done.

---

## 4. SAP drill-down map

**17 modules · 17 with an L2 · 17 resolve HTTP 200 · 0 dead.** Live-checked.

| Module | L2 route (`/platforms/sap/…`) | Roles | Sector link |
|---|---|---|---|
| SAP Customer Experience | `sap-customer-experience` | 8 | ✓ |
| SAP S/4HANA On-Premise | `sap-s4hana-on-premise` | 5 | |
| RISE with SAP S/4HANA | `rise-with-sap-s4hana` | 5 | |
| SAP S/4HANA Public Cloud | `sap-s4hana-public-cloud` | 4 | |
| SAP S/4HANA Cloud, Private Edition | `sap-s4hana-cloud-private-edition` | 4 | |
| SAP S/4HANA Finance | `sap-s4hana-finance` | 4 | |
| SAP Analytics Cloud | `sap-analytics-cloud` | 4 | |
| SAP BTP | `sap-btp` | 4 | |
| SAP Integrated Business Planning | `sap-integrated-business-planning` | 4 | |
| SAP Ariba | `sap-ariba` | 4 | |
| SAP SuccessFactors | `sap-successfactors` | 4 | |
| SAP Extended Warehouse Management | `sap-extended-warehouse-management` | 4 | |
| SAP Datasphere | `sap-datasphere` | 4 | |
| SAP Fieldglass | `sap-fieldglass` | 4 | |
| SAP Transportation Management | `sap-transportation-management` | 4 | |
| SAP Service Cloud | `sap-service-cloud` | 3 | |
| SAP Emarsys | `sap-emarsys` | 3 | |

**One sector cross-link of seventeen, and that is honest rather than broken.**
The suite-level rebuild moved module names away from the retail-seeded sector tool
names the `appearsIn` join matches on. A conservative normalised match was tested
and joins the same one. The connection does not exist; inventing it would be
worse than its absence, so the L1 lede no longer promises it.

**The L1 also now carries a module index** — a wrapping anchor list, 17 links
against 17 card ids, 0 broken, jumps clearing the sticky header. At 390px that is
736px to see the whole set against 4.6 viewports to discover it.

---

## 5. Before / after

Captures in `docs/status/shots/` — `plateau-r2/` (16 files), `plateau-r3/` (20,
adding the SAP L2 template), `final/` (8). Four surfaces × two themes × 1280 and
390, full page.

**One hero — the homepage.** Was: a static rotated petal, `.heroHeadline em` in
flat gold, H1 at weight 800 against a face that ships 400/500/600 so every glyph
was browser-synthesised. Now: the same petal drifting 24px over 90s
(transform-only, `no-preference`-gated, CLS 0.00008 → 0 under reduce), the
emphasis span carrying A2's gradient at 3.37:1 light / 8.65:1 dark on the lightest
stop, and the H1 at a real loaded 600.

**The rail.** Was: 156×56 cells, 26px marks, ink at 0.82, `width={120} height={26}`
handed to `next/image` while the mark displayed at 208×37 — so the optimiser
served variants sized for a box 42% narrower than the real one. Now: 208×76
cells, 37px marks, ink 0.95, correct intrinsics, and `wickes` shipping as a
typeset name because a perimeter-ink test (30.5% against every real wordmark's
≤5.0%) identifies it as a box lockup that silhouettes to a slab.

**One module L2 — `sap-datasphere`.** Was: no template at all. Now: A2 gradient
H1, the module's scope line and role bench, sector cross-links where they exist,
a 4×4 balanced sibling grid, the four canon §6 metrics **with their definitions
rendered** and `<dt>` before `<dd>`. Its honest weakness is §6 of this report.

---

## 6. QUESTIONS.md delta

Seven new entries this run, Q11–Q17. Q1–Q10 unchanged.

| # | Subject | State |
|---|---|---|
| Q11 | "Active bench across 3 markets" against §2's supply/demand ban | **Your call** — flagged, not changed |
| Q12 | Three published figures with nothing behind them | **Acted on** — 1 miscitation restated, 2 deleted; reversal needs a source |
| Q13 | Radwell's mark is a box lockup (25.0% perimeter ink) | **Measured, reported, not changed** — hand-committed asset |
| Q14 | §5 bans blurred orbs; four pseudo-element sites survive (~13 instances) | **Your call** — one line and I apply it across all four |
| Q15 | Blue Yonder renders 48×7px; `sap.svg` is a box lockup at 24.5% | **Recommendation logged** — drawn glyph |
| Q16 | `check-a11y` cannot tell an abstention from a pass | **Your call** — plus 320-vs-360 reflow, and A4 for a filled mono control |
| Q17 | SAP L2 pages repeat their parent card; net new information zero | **Blocked** — three options, recommendation is the R5 sub-product pass |

---

## 7. Why no surface plateaued, and what would change it

**The condition is unreachable by the loop as run.** Plateau means two
consecutive passes over the **same** artefact with no gain and no P1. Mine landed
commits mid-measurement — twice during pass 4, once inside the component under
review. Under *critique → fix → critique → fix*, "no gain over the previous pass"
compares two different builds, and each round's fixes guarantee the next pass has
something new to find. Pass 4's retail critique named it before I did.

**The evidence says the frontier is moving, not that pages are failing:**

| Pass | Categories it instrumented first |
|---|---|
| 2 | A4 role minimums · §5's blurred-orb clause · the mobile clamp |
| 3 | keyboard traversal of shared chrome · fixed-overlay occlusion · heading tag vs role · copy repetition |
| 4 | drawer modality · target geometry under flex · effective-vs-declared hover cues · disclosure truthfulness |

**The design system has plateaued.** Type ramp, contrast, glass, motion, register,
terminology and target size all hold under adversarial measurement. Two passes
hand-composed every one of axe's abstentions — 64 and 143 nodes, the Q16 hole —
and found **nothing hiding in them**.

**Three steps would close it, in this order:**

1. **Build the four gates pass 4 named.** None needs a canon amendment: assert
   `aria-expanded` returns to false on Escape for every `aria-haspopup` trigger
   and cap tab stops to the header CTA; probe `elementsFromPoint` under every
   `position: fixed` overlay and fail on occluded interactive content; assert each
   `<section>`'s first heading matches its peers' level; flag any ≥4-word string
   rendered more than twice in one document.
2. **Freeze a tag** and run two consecutive passes against it with no commits
   between. This is the only version that satisfies the condition as written.
3. **Rule on Q14–Q17.** Q17 is the only one blocking a surface.

**Still outstanding on the order**, stated plainly: R5's Data & Analytics table
(§2 above); SAP de-densification, partial; the site-wide sweep of remaining mono
phrases, partial. Everything else in items 1–8 is in the build and verified — the
sticky-header root cause, the Gap's 130ms pointer-gated dwell, the SAP module set
and L2 routes, the identity hues, the balanced grids, the rail geometry, role
chips out of mono, the hero drift, and A2 on all four lead surfaces.

**Gate state at `1382008`:** `check:terms`, `check:contrast`, `check:type`,
`check:motion`, `check:reflow`, `check:type-render`, `check:a11y`, `check:visual`
— all green. axe clean across 6 routes × 2 themes × 2 widths.
