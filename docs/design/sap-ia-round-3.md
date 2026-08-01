# SAP IA round 3 — re-cut from the vendor's current portfolio

**1 August 2026 · D2 of the parity run.** Round 2 folded four S/4HANA variants
into one. Round 3 changes the *frame*: our cut described SAP as it was, organised
by product name. SAP now organises itself by autonomous application family with
an AI layer across all of it, and the absence of that layer is what made the page
read dated.

Research time-boxed to ~30 minutes, vendor sources only.

## What SAP publishes now

| Layer | SAP's current naming |
|---|---|
| Suite framing | **SAP Business Suite**, positioned as the **Autonomous Suite** |
| Application families | **Autonomous Finance · Autonomous Spend · Autonomous Supply Chain Management · Autonomous HCM · Autonomous CX** |
| Platform | **SAP Business Technology Platform (BTP)**, **SAP Business Data Cloud** |
| AI | **SAP Business AI Platform**, **Joule**, **Joule Studio** |
| Adoption programmes | **RISE with SAP** (existing customers modernising), **SAP GROW** (new/scaling cloud ERP) |

## Was → now → why

Our 14 modules are unchanged. What changes is the family they sit under, so the
L1 reads as SAP's portfolio rather than as our historical list.

| Family (now) | Modules beneath (ours, unchanged) | Was |
|---|---|---|
| **Core ERP — SAP S/4HANA** | SAP S/4HANA *(On-Premise · Cloud Public · Cloud Private · via RISE with SAP)* | Top of a flat product list |
| **Autonomous Finance** | SAP S/4HANA Finance | Flat list |
| **Autonomous Spend** | SAP Ariba · SAP Fieldglass | Flat list; Ariba and Fieldglass were unrelated entries |
| **Autonomous Supply Chain** | SAP Integrated Business Planning · SAP Extended Warehouse Management · SAP Transportation Management | Three unrelated entries |
| **Autonomous HCM** | SAP SuccessFactors | Flat list |
| **Autonomous CX** | SAP Customer Experience · SAP Service Cloud · SAP Emarsys | Three unrelated entries |
| **Data & platform** | SAP BTP · SAP Datasphere · SAP Analytics Cloud | Flat list; the platform layer was indistinguishable from applications |
| **SAP Business AI** | *(none — see below)* | **Absent entirely** |

**Why:** a buyer arriving from sap.com sees five autonomous families, a platform
layer and an AI layer. Our page showed fourteen product names in one column with
no AI anywhere. The modules were right; the frame was three years old.

## SAP Business AI — represented, and honestly empty

The brief requires SAP AI to be represented. It is, as a **named family in the
frame** — that is a fact about SAP's portfolio, not a claim about us.

It ships with **no modules and no roles**, because we have none. Searched the
whole data layer: the 93 distinct SAP roles contain no Joule, no SAP Business AI,
no SAP AI Core or AI Foundation role. The AI-titled roles we do hold — Azure AI
Engineer, Databricks Engineer, Data Architect — are Microsoft and data-platform
roles and would be a false attribution under a SAP AI heading. That is exactly
what **R16** forbids: a heading may only assert what every row beneath it
satisfies, and here there are no rows at all.

So the family renders with the site's existing **"Desk in build"** treatment, the
same convention the nav already uses for Cybersecurity and DevOps. It says what
is true: SAP has this layer, and we do not yet staff it.

**Parked, needs Sumeet:** whether Yallo has or wants a SAP Business AI desk. If
roles exist that are not in the data layer, they can be added and the family
fills. Nothing else in this re-cut is blocked on it.

## Not adopted

- **RISE with SAP / SAP GROW** stay as *deployment variants* inside S/4HANA
  rather than becoming families. They are commercial programmes, not application
  families, and round 2 already put RISE inside the S/4HANA entry.
- **"Autonomous" as our own adjective.** We use it only where naming SAP's family.
  Calling our desks autonomous would be borrowing the vendor's claim.

---

## Round 3b — Sumeet's mid-run direction, 1 Aug

> *"ensure that you are not picking only the application families, but you are
> picking the technology, data, and cloud families as well… We also have this
> Signavio and LeanIX as well… I would love to get you to use logos like this."*

### Role evidence, checked before adding anything

The hard rule from R13 stands: **a module ships only if it maps to an existing
role in the data layer or the homepage line.** Searched the whole of `src/data`:

| Product | Data-layer hits | Ships? |
|---|---|---|
| SAP Signavio | **0** | **Parked** — no role, anywhere |
| SAP LeanIX | **0** | **Parked** — no role, anywhere |
| SAP Concur | **0** | **Parked** |
| SAP Business One / ByDesign | **0** | **Parked** |
| SAP Digital Manufacturing | 2 | **Parked** — hits are sector prose, not SAP roles |
| SAP PLM · IoT · Portfolio & Project Mgmt | 12 / 19 / 5 | **Parked** — hits belong to the manufacturing sector data, not to SAP roles |
| Leonardo · Data Intelligence · Process Automation | **0** | Correctly absent — **retired or superseded** by SAP; the reference image predates that |
| Joule | **0** | Named as a family, no rows (above) |

Signavio and LeanIX are real, current SAP products and the frame is poorer
without them — but adding either means asserting we staff it, and we have no
evidence that we do. **This needs Sumeet, not a guess:** confirm the roles and
they ship the same day.

### The technology / data / cloud layer

Already present as **Data & platform** (SAP BTP · Datasphere · Analytics Cloud) —
the three we have roles for. The wider technology layer SAP publishes (Build,
Integration Suite, Process Automation, LeanIX, Signavio) is parked on the same
rule. The layer is represented; it is not yet complete, and it cannot be
completed by inventing desks.

### Logos

**Blocked on assets, not on a decision.** `public/logos/` contains no SAP product
marks — the pack has vendor-level marks only. Fabricating twenty SAP product
lockups is not something I will do.

Two further constraints Sumeet should know before commissioning them:

1. Canon §8 ships marks as **keyed single-ink silhouettes**, and
   `scripts/build-logos.mjs` declines any source that will not key — six marks
   already render as their name for that reason. A colour lockup pack would need
   to survive that gate.
2. The module cards previously **carried** vendor marks and they were removed on
   a recorded reason: seventeen *identical* full-colour SAP logos, aria-hidden,
   on a page that already is that vendor. Sumeet's ask is different — the image
   shows **distinct product lockups** (S/4HANA, BTP, Ariba, EWM…), which do carry
   information the repeated corporate mark did not. That is a genuine change of
   input, not a reversal, so it does not conflict with the recorded decision.

**Ready when the assets are:** supply an SVG/PNG per product and the family
grid renders them through the existing pipeline. Nothing else blocks it.
