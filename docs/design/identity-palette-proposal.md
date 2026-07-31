# R4 identity palette — the full mapping, SHIPPED

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
six-hue ambient family in Layer 1, tuned per register and used positionally.
Rather than author a second set of hues to sit beside the first — which is how a
system becomes a rainbow — **the identity hues ARE that family**, re-pointed from
position to domain.

Measured against the grounds after the dark comfort pass:

| Hue | Light | on paper | Dark | on charcoal |
|---|---|---|---|---|
| indigo | `#3a5a8a` | 5.74:1 | `#5677b3` | 4.27:1 |
| teal | `#3d7d7d` | 3.90:1 | `#4e9a9a` | 5.85:1 |
| plum | `#8e4a72` | 5.12:1 | `#b45c8e` | 4.44:1 |
| moss | `#4a7d55` | 3.97:1 | `#5e9a6b` | 5.76:1 |
| violet | `#5f5694` | 5.32:1 | `#7a6fb8` | 4.37:1 |
| umber | `#9a6e3e` | 3.70:1 | `#c08a4e` | 6.37:1 |

**How to read that table.** These ratios are *not* a pass/fail gate, because R4
confines identity hues to the ambient layer — they are consumed at
`--amb-alpha` (8% light, 14% dark) behind a scrim, never as text or a control.
The column matters only for R4's conditional clause: *if* a text grade is ever
derived from one of these, that grade must clear AA on its own. **Four of the six
would already clear 4.5:1 in at least one register as-is; teal, moss and umber
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

Six hues across eighteen domains means each hue is reused roughly three times.
**That is deliberate, and the constraint that makes it safe is that a hue is only
ever seen against its own family:** a visitor is on a platform page or a sector
page, not comparing SAP to Retail side by side. Reuse across *different*
taxonomies is invisible; reuse *within* one would not be, so no two platforms
share, no two sectors share, and no two disciplines share.

### Platforms (canon §3 order)

| Platform | Hue | Note |
|---|---|---|
| SAP | **indigo** | live |
| Oracle | **umber** | Oracle's own brand is red; umber is the family's warm end, and red is too close to `--signal` |
| Microsoft | **teal** | Azure reads blue-green; indigo is taken by SAP |
| Salesforce | **violet** | distinct from the two blues above |
| Blue Yonder | **moss** | last unused hue; **parked with Q9 until the module set exists** |
| Workday | **plum** | HR/people, warm |

### Disciplines

| Discipline | Hue |
|---|---|
| Data & Analytics | **teal** (live) |
| Cloud & Infrastructure | **indigo** |
| Cybersecurity | **violet** |
| Integration & Middleware | **moss** |
| DevOps & Platform Engineering | **umber** |
| Testing & Quality Engineering | **plum** |

### Sectors

| Sector | Hue |
|---|---|
| Retail & Consumer | **plum** (live) |
| Banking & Financial Services | **indigo** |
| Manufacturing & Logistics | **umber** |
| Government & Public Sector | **moss** |
| Healthcare & Life Sciences | **teal** |
| Telco & Media | **violet** |

---

## 4. What would make me revisit this

**If eighteen domains should each look unique**, six hues cannot do it and the
family has to grow to nine or twelve — which needs a colourist's eye on the
tonal spacing, not a developer's. I would rather reuse deliberately than
interpolate six more hues and produce a set that reads as arbitrary.

**If a hue should ever carry text** — a domain label in its own colour, say —
then teal, moss and umber need darkened `-text` grades for the light register
first. R4 already requires this; nothing consumes it yet.

**Blue Yonder is the one gap**, and it is the same gap as Q9: no module set, so
no page worth colouring.
