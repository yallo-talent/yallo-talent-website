# R13 — Blue Yonder evidence table

**1 August 2026 · Code · ratified by R13, closes Q9**

Q9 sat parked for two rounds because there is **no Blue Yonder file in the legacy
corpus** — no `platform/blue-yonder.md`, no `blue-yonder-expertise.md` — so there
was no attested suite list to draft from.

R13 unparks it with a hard rule: **a module ships only if it maps to an existing
role in the data layer or to the ratified homepage line.** Everything else is
omitted rather than guessed.

## The two evidence sources

| Source | Content |
|---|---|
| Ratified homepage line — `src/data/home/place.ts:75` | `"Luminate · WMS · planning"` |
| Roles already named in `src/data/l1/*.ts` | listed per module below |

## What ships, and on what evidence

| Module | Roles cited | Where those roles already exist |
|---|---|---|
| Luminate Planning | Luminate Supply Chain Planner, Demand Planner, Inventory Optimisation Lead, SCP Specialist | `manufacturing.ts:76, 182, 208, 171` + homepage line |
| WMS | WMS Consultant, WMS Specialist | `roles.ts:65`, `retail.ts:816`, `manufacturing.ts:220` + homepage line |
| TMS | TMS Architect | `retail.ts:871` |
| Merchandise Management | Merchandise Consultant, MFP Specialist | `retail.ts:332, 319` |
| Assortment Optimization | Assortment Specialist | `retail.ts:375, 400` |
| Space Planning | Space Planner | `retail.ts:442` |
| Price & Promotion | Price / Promotion Lead | `retail.ts:484` |
| Fulfillment | Fulfillment Lead | `retail.ts:705, 717` |

Eight modules. **Every one is anchored to a role string that already exists in the
repo**, and the first two are additionally named on the ratified homepage line.

## What is deliberately OMITTED, and why

The hard rule bites hardest here, so the omissions matter as much as the entries.

| Candidate | Why omitted |
|---|---|
| Luminate Control Tower | A real Blue Yonder product. **No role in the data layer names it.** Whether Yallo staffs a control-tower desk is a question about Yallo, not about the market |
| Luminate Commerce / Returns | Real products; no role anywhere in the repo |
| Blue Yonder Category Management | Real; not named by any role |
| Blue Yonder Workforce Management | Real; not named by any role |
| Blue Yonder Order Management (as distinct from Fulfillment) | The repo names a Fulfillment Lead but no OMS role, so it ships as Fulfillment only |

**The distinction that governs all five:** a product being real is necessary and
not sufficient. R5 permits a current market name over a corpus-only one; neither
R5 nor R13 permits a guess about what Yallo staffs.

## Two notes for ratification

**`Fulfillment` carries two spellings.** `retail.ts` names both
"Blue Yonder Fulfillment Lead" (:705) and "Blue Yonder Fulfilment Lead" (:717) —
US and UK. Both are listed because both exist in the data; the module name uses
the vendor's own US spelling for accuracy, per R13's "vendor names for accuracy".
The data-layer inconsistency is worth a tidy but is not Code's to resolve by
picking one — it may reflect two different desks.

**Hue: moss**, per R13 — wired and verified. `/platforms/blue-yonder` resolves
`--id` and `--amb` to `#4a7d55` on light and `#5e9a6b` on dark, and renders all
eight modules.
