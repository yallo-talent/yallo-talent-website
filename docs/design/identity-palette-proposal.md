# R4 identity palette — the full mapping, SHIPPED

> **RATIFIED 2 August 2026 — set C, and the governing test changes.**
>
> **The test is separation from bare ground, not pairwise separation.** This
> supersedes the pairwise floor recorded in the note below, which is kept
> because the numbers in it are still measured and still reported.
>
> The pairwise floor was set by analogy with the approved four without asking
> whether a reader ever sees two identity hues at once. They do not. The palette
> assigns hues so that no two members of one taxonomy share, precisely because a
> visitor is inside one family at a time. A ΔE between two colours nobody can
> compare measures a comparison that never happens. The only candidate set that
> met the floor met it by withdrawing two hues and making two platforms share
> one, which breaks the rule the floor existed to protect. That settles it.
>
> **What ships: set C, seven hues, whole-family pairwise minimum 3.51**, a 53%
> improvement on every failing pair with no hue leaving its brief. Four hues are
> frozen and untouched — indigo, teal, plum, violet. Three are re-derived by
> search on the lexicographic minimum:
>
> | Hue | Was | Now |
> |---|---|---|
> | harbour | `#3E6E85` / `#5289A5` | `#005A82` / `#427EA8` |
> | claret | `#8B3E4E` / `#AF5F70` | `#A36365` / `#BF7F80` |
> | mulberry | `#7B4988` / `#9D63AB` | `#8E62AD` / `#AA7CC4` |
>
> **Ground distance, the gate.** Measured on painted washes at real alpha, worse
> theme binding: teal 7.94, claret 8.16, indigo 8.42, violet 9.20, mulberry
> 10.48, plum 10.34, harbour 10.53. The floor is 7.94, derived from the weakest
> approved hue rather than set as a constant, so it cannot drift and cannot be
> met by removing a hue. `scripts/check-hue-separation.mjs` fails on it.
>
> **Pairwise stays measured and reported, never a gate.** The same script keeps
> printing the weakest pairs so drift stays visible.
>
> Contact sheet for Sumeet's eye: `docs/status/shots/hues-v8/`. One line reverses
> this if the eye disagrees.

> **AMENDED 2 August 2026 — the family is SEVEN, and two members changed.**
> Sumeet rejected moss and umber. `moss` becomes **harbour** `#3E6E85` / `#5289A5`,
> `umber` becomes **claret** `#8B3E4E` / `#AF5F70`, and Informatica takes a
> seventh, **mulberry** `#7B4988` / `#9D63AB`. Indigo, teal, plum and violet are
> approved and untouched. Tokens were renamed rather than aliased, so no
> `--amb-moss-*` or `--amb-umber-*` survives anywhere in the codebase.
>
> **The separation cost is real and is reported rather than fixed.** Measured on
> painted washes at real alpha, the six approved pairs separate at ΔE 2.55 to
> 4.87. Six pairs involving the new hues fall below that floor: claret/plum
> 0.75, harbour/indigo 1.13, mulberry/plum 1.60, mulberry/violet 1.73,
> harbour/teal 1.77, claret/mulberry 2.33. On declared values the swap costs
> two thirds of the previous gap — umber against plum was ΔE 49.5 and claret
> against plum is 17.0; moss against indigo was 56.4 and harbour against indigo
> is 19.0. That is the arithmetic consequence of replacing the family's only
> green and only brown with a blue and a wine, which sit inside the band the
> other five already occupy. Per the round's own instruction no variant was
> authored and no approved hue was moved. See the relay and
> `docs/status/shots/hues-v7/`.

**Status: all 18 wired, 1 August 2026 (ORDER 7).** Fourteen have live routes and
all fourteen resolve their ratified hue, verified by reading `--amb` on each page.
The remaining four — cybersecurity, integration & middleware, devops & platform
engineering, testing & quality engineering — are wired and will resolve when those
routes land. Zero identity-hue leaks onto any control, measured across colour,
border, outline and background on every `a`, `button` and `input`.

Superseded below: the "lead trio built, fifteen proposed" framing.

**31 July 2026 · for Sumeet's ratification · Code**
Canon §5 as amended by R4. The **lead trio is built and live**; the remaining
fifteen are proposed here rather than assumed.

---

## 1. The palette, and why it is not a new one

R4 asks for "one family feel, both themes". The site already has a curated
seven-hue ambient family in Layer 1, tuned per register and used positionally.
Rather than author a second set of hues to sit beside the first — which is how a
system becomes a rainbow — **the identity hues ARE that family**, re-pointed from
position to domain.

Measured against the grounds after the dark comfort pass:

| Hue | Light | on paper | Dark | on charcoal |
|---|---|---|---|---|
| indigo | `#3a5a8a` | 5.74:1 | `#5677b3` | 4.27:1 |
| teal | `#3d7d7d` | 3.90:1 | `#4e9a9a` | 5.85:1 |
| plum | `#8e4a72` | 5.12:1 | `#b45c8e` | 4.44:1 |
| harbour | `#3e6e85` | 4.58:1 | `#5289a5` | 5.00:1 |
| violet | `#5f5694` | 5.32:1 | `#7a6fb8` | 4.37:1 |
| claret | `#8b3e4e` | 5.97:1 | `#af5f70` | 4.29:1 |
| mulberry | `#7b4988` | 5.49:1 | `#9d63ab` | 4.39:1 |

**How to read that table.** These ratios are *not* a pass/fail gate, because R4
confines identity hues to the ambient layer — they are consumed at
`--amb-alpha` (8% light, 14% dark) behind a scrim, never as text or a control.
The column matters only for R4's conditional clause: *if* a text grade is ever
derived from one of these, that grade must clear AA on its own. **Four of the six
would already clear 4.5:1 in at least one register as-is; teal, harbour and claret
would each need a darkened `-text` grade on light before any such use.** None is
used that way today.

The three ratified functional hues (`signal`, `info`, `positive`, `category`) are
untouched and remain the only colours permitted to carry meaning.

---

## 2. Built and live — the lead trio

| Domain | Hue | Token | Rationale |
|---|---|---|---|
| **SAP** | indigo | `--id-sap-*` | SAP reads blue in the market; indigo is the family's blue |
| **Data & Analytics** | teal | `--id-data-analytics-*` | the data-visualisation convention, and it reads as instrumentation |
| **Retail & Consumer** | plum | `--id-retail-*` | consumer warmth, and the furthest of the six from gold |

Verified in the browser: `/platforms/sap/sap-datasphere` resolves `--amb` to
`#3a5a8a` on light and `#5677b3` on dark, and gold is unchanged on every
interactive element.

---

## 3. Proposed — the remaining fifteen

Seven hues across nineteen domains means each hue is reused roughly three times.
**That is deliberate, and the constraint that makes it safe is that a hue is only
ever seen against its own family:** a visitor is on a platform page or a sector
page, not comparing SAP to Retail side by side. Reuse across *different*
taxonomies is invisible; reuse *within* one would not be, so no two platforms
share, no two sectors share, and no two disciplines share.

### Platforms (canon §3 order)

| Platform | Hue | Note |
|---|---|---|
| SAP | **indigo** | live |
| Oracle | **claret** | Oracle's own brand is red; claret is the family's warm end without reading brown, and true red is too close to `--signal` |
| Microsoft | **teal** | Azure reads blue-green; indigo is taken by SAP |
| Salesforce | **violet** | distinct from the two blues above |
| Blue Yonder | **harbour** | a soft cool blue; the module set landed with R13 |
| Informatica | **mulberry** | 7th platform, 7th hue. 288deg, between violet and plum |
| Workday | **plum** | HR/people, warm |

### Disciplines

| Discipline | Hue |
|---|---|
| Data & Analytics | **teal** (live) |
| Cloud & Infrastructure | **indigo** |
| Cybersecurity | **violet** |
| Integration & Middleware | **harbour** |
| DevOps & Platform Engineering | **claret** |
| Testing & Quality Engineering | **plum** |

### Sectors

| Sector | Hue |
|---|---|
| Retail & Consumer | **plum** (live) |
| Banking & Financial Services | **indigo** |
| Manufacturing & Logistics | **claret** |
| Government & Public Sector | **harbour** |
| Healthcare & Life Sciences | **teal** |
| Telco & Media | **violet** |

---

## 4. What would make me revisit this

**If nineteen domains should each look unique**, seven hues cannot do it and the
family has to grow to nine or twelve — which needs a colourist's eye on the
tonal spacing, not a developer's. I would rather reuse deliberately than
interpolate six more hues and produce a set that reads as arbitrary.

**If a hue should ever carry text** — a domain label in its own colour, say —
then teal, harbour and claret need darkened `-text` grades for the light register
first. R4 already requires this; nothing consumes it yet.

**Blue Yonder is the one gap**, and it is the same gap as Q9: no module set, so
no page worth colouring.
