# Context — Informatica platform L1 and L2 family

**v1.0 · 1 August 2026 · Chat lens, ratified by Sumeet 1 Aug 2026 · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. Where this file and canon disagree, canon wins.

---

## 1. Rulings

**R-INF1 · Informatica becomes the seventh platform.** Canon §3 currently fixes six platforms. Sumeet ratified Informatica as a platform destination on 1 Aug 2026. Code appends the amendment to canon §3 in the same commit that ships the page, worded as an amendment with its date, and does not silently edit the six-platform line out of existence.

**R-INF2 · Order.** SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday, Informatica. Seventh, last, everywhere the platform order is expressed. It is a real desk, not a co-equal of the ERP suites.

**R-INF3 · Informatica is also an account Yallo staffs.** Add the client rail entry with `consentOnFile: false` on the **enterprise** rail, so it renders nowhere until Sumeet flips the flag. Code does not flip it. Flag it in the relay as a one-line action for Sumeet. If Sumeet says it belongs on the integrators rail instead, that is a data move, not a rebuild.

**R-INF4 · Logo.** Assets are already in the repo. Grayscale, area-matched per the client-rail treatment fixed in Relay v6.0 point 3. If the mark is a box lockup the gate declines, fall back to the name and log it; do not defeat the gate.

**R-INF5 · No placement claims, no figures.** Same discipline as every other platform page. No client, count, metric, quotation, case study or date that is not already in the repo.

---

## 2. The positioning angle, and it is a real one

**[FACT, verified 1 Aug 2026]** Salesforce completed its acquisition of Informatica on 18 November 2025 (Salesforce press release, 18 Nov 2025). Informatica is now a wholly owned Salesforce subsidiary, positioned against Data 360 and alongside MuleSoft.

Two demand streams follow, and both are staffable:

1. **Estates that keep running.** Large PowerCenter and IDMC estates continue regardless of ownership, and modernisation off PowerCenter is live work with a scarce skill base.
2. **Convergence work.** Data 360, MuleSoft and Informatica are being brought together. That work needs people who can hold Salesforce and Informatica at once.

Yallo already carries a Salesforce desk. Adding Informatica means it can staff the convergence rather than one side of it. That is the argument the page makes, and it is verifiable rather than asserted. State the ownership as fact with the date; do not speculate about product roadmap, do not predict what Salesforce will retire, and do not imply Yallo has delivered convergence work.

---

## 3. Module set, nine desks

Real products only. Mirror the depth pattern of the Microsoft and Workday sets in canon §3.

| Slug | Desk | Scope |
|---|---|---|
| `idmc-platform` | IDMC platform administration | Intelligent Data Management Cloud tenancy, runtime environments, Secure Agents, upgrades, capacity and cost |
| `cloud-data-integration` | Cloud Data Integration | CDI and CDI-Elastic, mass ingestion, mappings, taskflows, the core ETL and ELT desk |
| `cloud-application-integration` | Cloud Application Integration | CAI, process orchestration, API Manager, real-time and event integration |
| `data-quality` | Cloud Data Quality | Profiling, rule specifications, cleansing, standardisation, match and merge logic |
| `master-data-management` | Master Data Management | MDM SaaS and MDM Hub, Customer 360, Supplier 360, Product 360, Reference 360 |
| `data-governance-catalog` | Data Governance and Catalog | CDGC and Metadata Command Center, lineage, stewardship, business glossary. Absorbs the former EDC and Axon estates |
| `powercenter-modernisation` | PowerCenter modernisation | PowerCenter run and support, plus assessment and migration to IDMC. The scarcest skill pairing on this list |
| `data-privacy-masking` | Data privacy and masking | Data Privacy Management, dynamic and persistent masking, test data management |
| `b2b-data-exchange` | B2B data exchange | B2B Gateway, Data Transformation, Cloud Integration Hub, EDI and partner onboarding |

**CLAIRE is not a desk.** It is Informatica's AI engine and appears as a capability referenced inside the desks that use it, never as a page or a role. Inventing a CLAIRE practice would be the same error canon §3 already ruled on for SAP Special Applications.

---

## 4. Roles

Real market titles. Per desk, three to five, drawn from this set and mapped to the desks they actually belong to:

Informatica Developer (CDI) · IDMC Solution Architect · PowerCenter Developer · Cloud Migration Specialist, PowerCenter to IDMC · MDM Developer · MDM Solution Architect · Data Quality Developer · Data Quality Analyst · Data Governance Lead · Data Steward · Metadata and Catalogue Analyst · Informatica Administrator · Integration Architect, CAI and API · Data Migration Lead · Test Data Management Specialist · Data Platform Solution Architect.

No scarce-role flags and no scarcity data on any of them until Sumeet supplies it. Where a desk cannot carry three genuine roles, ship the desk with what is real and report the gap.

---

## 5. Page structure

**L1 `/platforms/informatica`.** Follow the SAP and Microsoft platform L1 shell exactly. Band order: hero, what Yallo places on Informatica, the nine desks as the module grid, the ownership and convergence point from §2 as a short evidence band, roles and screening, sectors running Informatica (driven from real L1 data, gated out if fewer than three sectors qualify, per the same ruling applied to SAP), cross-links, ask.

**L2 `/platforms/informatica/{desk}`.** Nine pages, same shell as the other platform L2s. Each: what the desk covers, what Yallo screens for, the roles, the common mis-hire, where it sits in a programme, adjacent desks, ask. Real depth or do not ship the page.

**Cross-links, both directions:** `/capabilities/data-analytics`, `/capabilities/integration-middleware`, `/platforms/salesforce`, and the AI talent stack matrix entry for Informatica IDMC in `context-ai-talent.md` §5.

---

## 6. Copy voice, the one rule that gets broken here

Do not describe what Informatica does. Write what Yallo places on it. "IDMC delivers trusted data for AI" is vendor marketing and is banned. "Finding CDI developers who have migrated a live PowerCenter estate without a data outage" is the site's voice. Authoring guide §10 applies verbatim.

Canon §2 vocabulary is lint-enforced. Product names are allow-listed occurrence by occurrence with a documented reason, per the standing GCC method. "Landscape" is allowed only for SAP system landscape, so do not reach for it here.

---

## 7. Forbidden

- Any number, client, logo consent, quotation, case study or date not already in the repo.
- Any statement about Salesforce's product roadmap or what will be retired.
- Any implied delivery history on the convergence work.
- CLAIRE as a desk or a role.
- Any tenth desk invented to round the number up.
