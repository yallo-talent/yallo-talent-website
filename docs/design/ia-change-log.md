# R5 IA modernisation — was / now / why

**31 July 2026 · for Sumeet's ratification · Code**
Canon §9 as amended by R5. The legacy corpus is the source for what Yallo
*published*; it is two to three years old, so it is not the source for what the
market *is*. Every change below is logged for ratification, and no module name
is invented — each is either corpus-attested or a current market product named
as such.

---

## SAP — 14 → 17 modules (21% amendment)

### Added

| Module | Attested where | Why now |
|---|---|---|
| **SAP Datasphere** | `platform-expertise/sap-expertise.md`, `capability-expertise/data-expertise.md` | The clearest gap a 2–3 year old IA would have. Supersedes SAP Data Warehouse Cloud, and sits directly beside Analytics Cloud, which was already listed. Two independent corpus mentions. |
| **SAP Fieldglass** | `platform-expertise/sap-expertise.md` | External workforce management — the system a client uses to *engage contractors*. Unusually apt for a staffing firm to staff. |
| **SAP Emarsys** | `platform-expertise/sap-expertise.md` (as both "Customer Engagement" and "Account Engagement") | SAP's customer-engagement product; the CX estate was represented only by the umbrella and Service Cloud. |

### Retired (R2, Sumeet-ratified)

| Module | Why |
|---|---|
| SAP Special Applications | Not a product. The legacy scope line describes a *category*, so there is no bench to name and no role list that would be honest. |
| SAP Business One | SMB ERP. Canon §1 positions Yallo on enterprise platform programmes. |
| SAP Business ByDesign | Same, and SAP has sunset new sales. |

### Corrected rather than ported

| What | Correction |
|---|---|
| "SAP Analytics" | Published as **SAP Analytics Cloud**, the name the corpus body uses. |
| The Analytics scope line | The legacy source reads *"SAP S/4HANA Public Cloud offers scalable, subscription-based ERP"* — a copy-paste defect in the original. Not ported. |
| Every scope line | Legacy lines are platform-speak (what SAP does). Canon §9 requires Talent-speak (what Yallo places), so **the names are the corpus's and the scope lines are ours**. |

### Considered and parked — not added

| Candidate | Why parked |
|---|---|
| SAP Signavio | Process mining, SAP-owned since 2021 and now common in S/4 transformation programmes. **Not in the corpus.** Whether Yallo staffs it is a question about Yallo, not the market. |
| SAP LeanIX | Acquired 2023. Not in the corpus; same reasoning. |
| SAP Concur | Not in the corpus. |
| SAP Business AI / Joule | Too new to be a staffed desk, and not in the corpus. |

**The distinction that governs all four:** R5 permits a name from the current
market rather than only from the corpus, but it does not permit a *guess about
what Yallo staffs*. A product being real is necessary and not sufficient.

---

## Oracle — 9 modules, level corrected rather than modernised

The Oracle page was **8 of 10 Oracle *Retail*** — Xstore, Retail MOM, Assortment
Planning, Space Optimization, Retail Pricing, Retail Order Management. That was a
level error, not a staleness error, and is fixed by the suite-level rebuild
(Fusion ERP/HCM/SCM/CX, E-Business Suite, EPM, OCI, NetSuite, BI Apps).

**Deliberately not modules:** the legacy page's industry verticals — Oracle
Retail, Hospitality, Food & Beverage, Healthcare, Financial Services,
Communication. They are sector cuts of the suite, which is the level the sector
L1s already work at; repeating them here would rebuild the skew one layer up.

**Not yet critiqued for staleness.** Oracle's set is corpus-accurate at suite
level but has not had an R5 market pass. Candidates a pass would examine: Oracle
Fusion Data Intelligence, and whether "Oracle BI Apps" should be retired in
favour of OAC.

---

## Salesforce — 6 modules, level corrected

Was 3, all retail (Retail Cloud clienteling, Loyalty Management, Marketing
Cloud) — thin as well as skewed. Now Sales, Service, Marketing, Commerce and
Experience Cloud plus MuleSoft Anypoint Platform.

**Deliberately not modules:** the legacy page's feature-level headings — CPQ, AI
Recommendations, Digital Storefronts, Customer Self-Service Portals. Those are
capabilities *inside* a cloud, not desks.

**Not yet critiqued for staleness.** A pass would examine Agentforce, Data Cloud
and Tableau — all real, all significant, none corpus-attested.

---

## Blue Yonder — unchanged, and it is the one page still wrong

**No corpus file exists** — no `platform/blue-yonder.md`, no
`blue-yonder-expertise.md`. So there is no attested suite list to draft from, and
its page still mixes two levels: the retail cut (Merchandise Management,
Assortment Optimization, Space Planning) alongside genuinely suite-level modules
(WMS, TMS, Luminate, Demand Planning).

Sumeet is naming the desks. Until then it stays as it is: R5 permits a market
name, but Blue Yonder's desks are a question about what Yallo staffs, which no
market research answers. `QUESTIONS.md` Q9.

---

## Microsoft and Workday — no change proposed

Both were ratified directly by Sumeet (Relay v2.1 rev 2 §5 and §5b) and are
already suite-level. An R5 pass on Microsoft would raise Fabric, which has
displaced Synapse in the market since the corpus was written — **flagged, not
changed**, because the Microsoft set is ratified and amending it is Sumeet's
call, not a critique's.

---

## Data & Analytics — 6 → 7 disciplines (14% amendment)

**Verified against the market on 31 July 2026, not from memory.** This is the
second lead domain's R5 pass and it is deliberately smaller than SAP's 21%,
because the starting point was different: SAP's page was a corpus port, while
this one was **already ahead of the corpus**. The legacy source
(`capability-expertise/data-expertise.md`, 438 lines) carries four categories —
Data Engineering & Integration, Data Management & Governance, Analytics & BI, and
AI/ML — with Azure Synapse Analytics filed under *governance*. The live page
already carries six modern desks including Analytics Engineering, Lakehouse and
Streaming as separate practices, which is the current shape.

**R5's "20–30%" describes expected drift, not a quota.** Manufacturing changes to
hit a percentage would be the opposite of what the ruling asks for, so this pass
amends what moved and logs the rest.

### Added

| Discipline | Attested where | Why now |
|---|---|---|
| **Enterprise Platform Analytics** — SAP Analytics Cloud, SAP Datasphere, BW/4HANA, Oracle Analytics Cloud | Every product named is **already an authored module in this repo's own platform sets** (`data/platforms/authored.ts`), and Datasphere is corpus-attested twice | The clearest gap on the page. Every other desk is modern-stack — Snowflake, dbt, Collibra, Kafka — while Yallo's wedge is enterprise platform programmes. A buyer with a BW/4HANA estate or an Oracle Analytics footprint found nothing here, even though the SAP page sells those exact desks. Nothing is invented: the site already publishes all four as things it staffs |

### Flagged, not changed

| What | Market status (verified) | Why not changed |
|---|---|---|
| **Azure Synapse Analytics** (corpus) → **Microsoft Fabric** | Synapse is supported with **no EOL date**, in maintenance mode — security and maintenance updates but no major new capability, with all new investment on Fabric. From 20 July 2026 Microsoft is retiring the "Azure Synapse Link for Dataverse" name in favour of a unified "Link data" hub | The Microsoft module set is **Sumeet-ratified** (Relay v2.1 rev 2 §5), so amending it is his call. Also worth stating precisely: Synapse is *stale*, not *dead* — a Synapse desk is still a real desk, which is a weaker claim than my earlier note implied |

### Considered and parked

| Candidate | Why parked |
|---|---|
| Folding **Real-time & Streaming** into Data Engineering | Proposed by a critique. It is a composition opinion, not a market movement — Kafka and Flink desks are as distinct now as they were. R5 authorises amending what the market moved, not restructuring on taste. Sumeet's call |
| **AI / ML Engineering** | Not a gap. The page's own hero says "AI roles have their own practice", which is a canon scoping decision, not an omission |
| **Databricks** as its own desk | Real and significant, but it sits inside Data Platform & Lakehouse where the page already places it. Promoting it would be a judgement about demand mix, which no market source settles |

---

## What still needs a market pass

| Domain | Status |
|---|---|
| SAP | **Done** — 3 added, 3 retired, 2 corrected |
| Oracle | level corrected; staleness pass outstanding |
| Salesforce | level corrected; staleness pass outstanding |
| Microsoft | ratified; Fabric flagged for Sumeet |
| Workday | ratified; no flags |
| Blue Yonder | blocked on Q9 |
| Data & Analytics | **Done** — 1 added, 1 flagged, 3 parked (14%) |

---

# SAP IA round 2 — ORDER 1, 1 August 2026

## The fold: four S/4HANA entries become one

| Was | Now | Why |
|---|---|---|
| `SAP S/4HANA On-Premise` | **`SAP S/4HANA`**, one entry | A deployment is not a product. Four sibling modules read as four things to staff when they are one product deployed three ways. |
| `SAP S/4HANA Public Cloud` | variant "Cloud Public Edition" | SAP's own 2026 name is **Public Edition**, not "Public Cloud". |
| `SAP S/4HANA Cloud, Private Edition` | variant "Cloud Private Edition" | Retained as a deployment; it is one. |
| `RISE with SAP S/4HANA` | variant "delivered via RISE with SAP" | **This was a category error in our IA.** RISE is SAP's *commercial programme* — it bundles S/4HANA Cloud (Public **or** Private Edition) with managed infrastructure and BTP. It was never a fourth deployment sitting beside the other three. |

Verified against SAP's 2026 portfolio by web search rather than from memory. The
deployment options are **On-Premise**, **Cloud Public Edition** and **Cloud
Private Edition**; RISE and GROW are commercial programmes that wrap them.

The four variants render as chips inside the module page, so folding organises the
information rather than losing it — the deployment distinction is exactly what a
buyer asks about first.

**Route effect:** `sap-s4hana-on-premise`, `sap-s4hana-public-cloud`,
`sap-s4hana-cloud-private-edition` and `rise-with-sap-s4hana` now 404, replaced by
`sap-s4hana`. No redirect is added because none of these has ever been published —
the DNS switch is still pending, so there is no inbound link to preserve. If that
changes before launch, four redirects belong in `next.config.ts` alongside the
legacy insight rules.

SAP module count: **17 → 14**.

## Omitted from the 2026 portfolio check

| Candidate | Why omitted |
|---|---|
| **GROW with SAP** | Real, and current — SAP's midmarket programme alongside RISE. **No role in the repo names it.** R13's hard rule applies here as much as it did to Blue Yonder: a product being real is necessary and not sufficient. |
| SAP Business Data Cloud | Announced since the corpus was written. Not corpus-attested and no role names it. |
| SAP Joule / Business AI | Same. Flagged in the round-1 log and still parked. |

## Not re-verified

The other eleven SAP modules were checked for *name currency* in round 1 against
the corpus, not against SAP's 2026 portfolio. This round verified the S/4HANA
family only, because that is what ORDER 1 named. A full portfolio pass on the
remaining eleven is outstanding and would most likely raise SAP Datasphere's
relationship to Business Data Cloud, and whether "SAP Analytics Cloud" is still
the shipping name.
