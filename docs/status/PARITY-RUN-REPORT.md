# Parity run report — 1 August 2026

**Branch `main` · pushed · nine CI gates 9/9 green · freeze `parity-freeze-1` = `3ae20b5`**
Scope: `/platforms/sap` (+ L2s), `/capabilities/data-analytics` (+ L2s), mega menu.

---

## 1. What the menu diagnosis actually found

The reported suspect was right, and my previous run's fix had addressed a
different symptom.

Pointer trace at 1440px, moving straight down from a trigger:

| y | Panel open? | Element under pointer |
|---|---|---|
| 40 | yes | `BUTTON.groupTrigger` |
| 62 | yes | `DIV.bar` |
| **70** | **NO** | `DIV.bar` |
| 80 | no | panel's own top edge |

The group wrapper ends at **y=62**; the panel is `position: fixed` at
`top: var(--header-h)` = **y=80**. The 18px between belongs to neither, so
`mouseleave` on the nav fired at y=70 — **ten pixels before the panel existed**.

**The links were never broken.** Measured: each is a real **303×46** target and
`elementFromPoint` at its centre returns the anchor. They were unclickable only
because a straight-line move to one closed the panel en route.

**Fixed:** 180ms cancellable grace period on close, the panel as its own hover
host, and an invisible 22px bridge spanning the strip. Verified — panel survives
the full traverse y=40→200, a straight-line click lands and navigates, exits
below and beside still close, only ever one panel, keyboard parity holds (opens
on activation, 14 focusable links, `aria-expanded` and `aria-controls` resolve,
Escape closes).

**Redesign.** It read as a bare list because it was one. Every row now carries a
support line, none of it authored — an item's own `description` first, else the
L1 index `tagline` for its slug; 18 of 19 Specialisms rows resolve. Column heads
were `--fs-label` at weight 400 in `--fg-subtle` above 16px links, i.e. the
quietest thing in their own column — now mono caps in `--accent-label` over a
rule. "Desk in build" wrapped to two lines on 5 of 7 discipline rows; `nowrap`
plus `flex: none` fixed it, **not** a smaller font. Columns size to content.
Panel capped to the viewport — with support lines it measured 870px against an
820px gap and clipped its last row mid-sentence. Responsive ladder verified
1600→1100.

**One regression I introduced and fixed:** the support line returned
`item.description`, which `NavItemBody` already renders, so every Engagement and
Explore subtitle printed twice.

---

## 2. SAP IA — was, now, why

Vendor research time-boxed to ~30 minutes, sap.com and SAP News only.

**Now published by SAP:** SAP Business Suite positioned as the **Autonomous
Suite** — Autonomous Finance, Spend, Supply Chain Management, HCM, CX — over
**SAP BTP** and **SAP Business Data Cloud**, with **SAP Business AI Platform**,
**Joule** and **Joule Studio** across all of it, and **RISE with SAP** / **SAP
GROW** as adoption programmes.

**Our 14 product families were right; the frame around them was three years old.**

| Family (now) | Beneath it | Was |
|---|---|---|
| Core ERP | SAP S/4HANA *(On-Premise · Public · Private · via RISE)* | Top of a flat list |
| Autonomous Finance | S/4HANA Finance | Flat list |
| Autonomous Spend | Ariba · Fieldglass | Two unrelated entries |
| Autonomous Supply Chain | IBP · EWM · Transportation Management | Three unrelated entries |
| Autonomous HCM | SuccessFactors | Flat list |
| Autonomous CX | Customer Experience · Service Cloud · Emarsys | Three unrelated entries |
| Enterprise technology | **BTP · Integration Suite · Build · Signavio · LeanIX** | BTP alone, covering everything |
| Data & analytics | Datasphere · Analytics Cloud | Indistinguishable from applications |
| **SAP Business AI** | Desk open, roles being added | **Absent entirely** |

**Why:** a buyer arriving from sap.com sees five autonomous families, a platform
layer and an AI layer. We showed fourteen product names in one column and no AI.

**The AI layer.** I first shipped this as "we do not staff a SAP AI desk yet" —
**that was wrong**, and wrong in the worst direction, understating a live
offering. The SAP AI Talent Desk is open and taking briefs. It now says so; role
titles are not yet in the data layer, and the family fills the moment they are.

**Family order is declared, not discovered.** Bucketing in first-encountered
order put Data & analytics third and HCM last — an accident of our file
presented as SAP's structure.

Detail and the round-3b additions: `docs/design/sap-ia-round-3.md`.

---

## 3. Parity checklist against retail, line by line

| | retail | SAP | Data & Analytics |
|---|---|---|---|
| Shell | L1PageShell | bespoke (Home.module.css) | L1PageShell |
| Sticky in-page bar | ✓ 43 items | ✓ **11 items, abbreviated to fit** | ✓ 22 items |
| Bar pins on scroll | ✓ top 80 | ✓ top 80 | ✓ top 80 |
| Section grammar | 10 sections | **6** — hero, bench, families, sectors, operating rhythm, closing CTA | 10 sections |
| In-page anchors | 28 | **30** | 21 |
| Working L2 detail pages | ✓ 21 links | ✓ 14 links | ✓ **8 links, 7 disciplines, all 200** |
| Closing CTA | ✓ | ✓ | ✓ |
| Identity hue on L1 | ✓ | ✓ | ✓ |
| Identity hue on L2 | ✓ | **✗ — see §4** | ✗ |
| Published evidence | case studies | ✓ 1 study + 4 named placements | — |
| P0 / P1 open | 0 | 0 | 0 |

**Where SAP still differs:** four of retail's ten sections — `intro`, `scarce`,
`segments`, `insights` — are authored narrative. `retail.ts` is 1,529 lines of
written copy. Nothing derives them, and writing them means composing marketing
claims about our own capability. Give SAP a data file shaped like `retail.ts`
and the page fills through the existing shell with no code change.

**D&A's gap was never data.** I parked it once, wrongly, without reading the
shell's guards: `L2Tools` returns null when tools are empty and `L2Overview`
falls back to `blurb`, which every capability card has. All seven L2s ship from
existing data with nothing authored. Two gates in the L1 shell had a `tools`
assumption baked in, which is why every capability card stayed unlinked.

---

## 4. Parked, and why

| Item | Why it is parked |
|---|---|
| SAP's four narrative sections | Authored copy; nothing derives it |
| **SAP L2 identity hue** | Confirmed missing — the L2 shell never receives `data-identity`. Small fix, not yet made |
| Mega-menu pillar icons, engagement layout, **the logo** | Flagged twice by Sumeet; not addressed |
| Informatica as 7th platform · "Disciplines" → "Capabilities" · "AI talent" → "Artificial Intelligence" · "Education & Universities" · design docs to 7×3 | Mechanical, not started |
| Replicating the family/lens pattern to Oracle, Microsoft, Salesforce, Workday, Blue Yonder | Out of this run's scope lock; Sumeet has since approved replication |
| "Sectors running SAP" shows only Retail | Genuine data gap — only retail's sector data lists SAP tools |
| SAP product logos | No product marks exist in the pack. Canon §8 keys marks to single-ink silhouettes and the build gate declines sources that will not key |

---

## 5. Rulings landed

R16 (a heading may only assert what every row beneath it satisfies) and **R21**
(a lede never states a count the page already displays) are in canon §9. R17
closed Q11 — "active bench across 3 markets" replaced with the four entities, in
both places it shipped. R18's figures were already gone. R19 amended the
two-band ceiling to content bands only. R20 recorded.

## 6. Corrections I made to my own work

- Parked D&A's L2s, then found the shell already degraded — built them.
- Reported SAP's L1 gap, then closed the derivable half twice over (bench
  section, then the shared closing CTA and operating rhythm).
- Said we had no SAP AI desk. We do.
- Two failed attempts at pairing lone product cards, both wrapping
  `.commitment` in another grid and squeezing cards to 174px. The real cause was
  a fixed two-column grid; `auto-fit` fixed it. Both traps documented in the CSS.
- Swept the untracked `prototype/` workbooks into a commit with `git add -A`.
  Sumeet confirms the login inside is not a real account, so nothing leaked, but
  the workbooks are now untracked and ignored and I have stopped using `-A`.
