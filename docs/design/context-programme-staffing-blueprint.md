# Context — Programme Staffing Blueprint, v1 content

**v1.0 · 1 August 2026 · Chat lens, ratified by Sumeet 1 Aug 2026 · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`.
This file exists because Relay v6.0 §6 reported the Blueprint as blocked on content. It is no longer blocked. The content below is the v1 asset.

---

## 1. The ruling that unblocks it

**Blueprint v1 is a structure asset, not a data asset.**

The unclaimed ground is the *team shape and the sequence*: which roles a programme needs, in which phase, and which ones are chronically under-scoped. That is programme knowledge and it is publishable today. The quantities are what need Sumeet's data, and they are held back:

| In v1 | Held for v2 |
|---|---|
| Phases, named as the vendor method names them | Team size, FTE counts, effort |
| Roles per phase, per stream | Time-to-hire per role, from Vincere |
| What each role is screened for | Scarcity index per role in-region |
| The roles that always get under-scoped, and the consequence | Rate bands |

**No empty numeric slot renders.** A section that needs a figure does not exist until the figure does. Do not ship a metric block with dashes in it, and do not ship a table column headed "time to hire" with nothing under it. That reads worse than the absence.

**No download promise.** There is no PDF. The close is a request, not a download: "Ask for the planning pack for your programme", routing to `/brief` with a `source` field identifying the archetype. Honest, and it captures the same lead.

**Three archetypes ship**, in Sumeet's priority order: SAP S/4HANA, Oracle Fusion, Salesforce multi-cloud. All three are programmes Yallo has staffed. Do not add a fourth.

---

## 2. Routes and structure

- `/intelligence/programme-staffing-blueprint` — the index. What the asset is, why it exists, the three archetypes, one line on method. Open, indexed.
- `/intelligence/programme-staffing-blueprint/sap-s4hana` (and `/oracle-fusion`, `/salesforce-multi-cloud`) — the archetype pages. Open and indexed, because the SEO surface is the point and the gate has nothing real to withhold yet.

Band order per archetype page:

1. Hero: the programme type, one line on what the page gives a reader.
2. **The phases**, named as the vendor method names them.
3. **The team, by stream**: architecture, functional, technical, quality, programme. This is the substance band.
4. **Who is on in which phase**: the matrix of stream against phase. The signature device of the asset.
5. **The roles that always get under-scoped**, and what happens when they are. The band a programme director screenshots.
6. **What we screen for** on the two or three hardest roles in this archetype.
7. Cross-links to the platform desks that staff it.
8. The ask, per §1.

Dossier register, PetalPlate imagery, no stock photography, both themes AA, type floor 12px. One dark band maximum on these pages, on band 4.

---

## 3. Archetype one, SAP S/4HANA rollout

**Phases, SAP Activate:** Discover · Prepare · Explore · Realise · Deploy · Run.

**Streams and roles**

| Stream | Roles |
|---|---|
| Programme | Programme Director · PMO Lead · PMO Analyst · Change and Adoption Lead · Training Lead |
| Architecture | Enterprise Architect · S/4HANA Solution Architect · Integration Architect · Authorisations and Security Architect |
| Functional | FI and CO · MM and Sourcing · SD and Order to Cash · PP and QM · EWM and TM · PM and PS · SuccessFactors interface lead · sector-specific functional lead where the sector demands one |
| Technical | ABAP and RAP Developer · Fiori and CDS Developer · BTP Developer · Basis and HANA Administrator · Integration Developer, Cloud Integration · Data Migration Lead · Data Migration Developer, Migration Cockpit · Analytics Developer, Analytics Cloud and Datasphere |
| Quality and cutover | Test Lead · Test Automation Engineer · Functional Testers · Cutover Manager · Hypercare Lead |

**Who is on when**

| Phase | On |
|---|---|
| Discover | Enterprise Architect, Solution Architect, Programme Director |
| Prepare | Adds PMO, Basis, Authorisations Architect, Data Migration Lead, Change Lead, Integration Architect |
| Explore | Functional streams at peak for fit-to-standard, Integration Architect, Data Migration Lead |
| Realise | Technical build at peak, all developers, migration developers, Test Lead, Test Automation |
| Deploy | Testing at peak, Cutover Manager, Training Lead, hypercare planning begins |
| Run | Hypercare Lead, retained functional and technical cover, support model |

**Always under-scoped, and what happens**

- **Data migration.** Scoped as a task, not a stream, and started after Explore. Legacy data quality is discovered during Realise, and the go-live date moves.
- **Authorisations and security.** Roles design starts near user acceptance testing. Testers cannot get into the system and the test window compresses to nothing.
- **Integration.** Assumed to be configuration on a middleware tool. Every non-SAP counterparty has its own contract, and nobody owns the end-to-end error handling.
- **Test automation.** Manual regression is planned once and then needed every cycle, so regression cost rises through Realise.
- **Cutover management.** Treated as a plan rather than a role. Nobody owns the hour-by-hour sequence, and the rehearsal exposes it too late.
- **Master data governance.** Migration is funded, governance after go-live is not, and the data degrades within two quarters.
- **Change and training.** Funded last, cut first, and it is the reason a technically successful go-live is reported as a failure by the business.

**Screen hardest for:** Data Migration Lead, Authorisations and Security Architect, Integration Architect. For each, evidence of a live cutover, not a project they joined after go-live.

---

## 4. Archetype two, Oracle Fusion implementation

**Phases:** Plan · Design and Configure · Validate, through conference room pilots · Deploy · Operate.

**Streams and roles**

| Stream | Roles |
|---|---|
| Programme | Programme Director · PMO Lead · Change and Adoption Lead · Training Lead |
| Architecture | Fusion Solution Architect · Integration Architect, Integration Cloud · Security and Roles Architect · Reporting and Analytics Architect |
| Functional, ERP and SCM | General Ledger · Payables and Receivables · Fixed Assets and Cash · Tax · Procurement · Projects · Inventory · Order Management · Manufacturing · Supply Planning |
| Functional, HCM | Core HR · Payroll · Absence · Talent · Recruiting |
| Functional, EPM | Planning · Financial Consolidation · Account Reconciliation · Enterprise Data Management |
| Technical | Integration Cloud Developer · Reports Developer, Publisher, OTBI and Data Intelligence · Data Conversion Specialist, FBDI and HDL · Visual Builder Extension Developer · Roles and Security Specialist |
| Quality and cutover | Test Lead · Conference room pilot Coordinator · Cutover Manager · Hypercare Lead |

**Who is on when**

| Phase | On |
|---|---|
| Plan | Solution Architect, Programme Director, PMO |
| Design and Configure | Functional streams at peak, Security and Roles Architect, Integration Architect, Data Conversion Specialist |
| Validate | Pilot coordination at peak, Test Lead, functional streams, reporting developers |
| Deploy | Cutover Manager, payroll parallel runs, training, hypercare planning |
| Operate | Hypercare Lead, quarterly update regression cover |

**Always under-scoped, and what happens**

- **Security and roles design.** Oracle's role model is the single most common cause of a delayed pilot. Started late, it blocks every downstream test.
- **Data conversion.** FBDI and HDL loads are treated as a technical chore. Iterations multiply and the pilot slips.
- **Quarterly update regression.** The one nobody staffs for at all. Oracle updates on a fixed cadence after go-live and there is no team left to test it.
- **Reporting.** Assumed to come with the product. Users do not accept the system without their reports.
- **Payroll parallel runs.** Under-planned, and payroll is the one workstream that cannot be soft-launched.
- **EPM data integration.** Planned as a separate project, then found to depend on the same conversion team.

**Screen hardest for:** Security and Roles Architect, Data Conversion Specialist, Payroll lead. Ask for the parallel run they got wrong and what they changed.

---

## 5. Archetype three, Salesforce multi-cloud programme

**Phases:** Discover · Define · Design · Build and iterate · Deploy · Optimise.

**Streams and roles**

| Stream | Roles |
|---|---|
| Programme | Programme Director · Delivery Lead · PMO Lead · Change and Adoption Lead |
| Architecture | Solution Architect · Technical Architect · Integration Architect, MuleSoft · Data Architect · Identity and Access Architect |
| Cloud and functional | Sales Cloud · Service Cloud · Marketing Cloud, including Journey Builder · Experience Cloud · Data Cloud · Revenue and CPQ · Field Service · Agentforce |
| Technical | Apex and Lightning Web Components Developer · Declarative and Flow Specialist · DevOps and Release Engineer · Data Migration Specialist · QA Automation Engineer |
| Quality and cutover | Test Lead · User Acceptance Coordinator · Release Manager · Hypercare Lead |

**Who is on when**

| Phase | On |
|---|---|
| Discover | Solution Architect, Programme Director |
| Define | Adds functional cloud leads, Data Architect, Change Lead |
| Design | Technical Architect, Integration Architect, Identity Architect, DevOps Engineer stood up early |
| Build and iterate | Developers and declarative specialists at peak, QA Automation, Data Migration |
| Deploy | Release Manager, Test Lead at peak, training, hypercare planning |
| Optimise | Hypercare Lead, adoption measurement, retained release cover |

**Always under-scoped, and what happens**

- **Release engineering and DevOps.** Stood up late, so metadata deployments are manual and every release becomes an event.
- **Data migration and de-duplication.** Underestimated because the object model looks simple. Duplicate records destroy user trust in week one.
- **Marketing Cloud specialists.** Assumed to be interchangeable with core platform people. They are a separate skill and a separate market.
- **Identity, permissions and licence design.** Discovered at user acceptance testing, when the licence mix turns out to be wrong.
- **Adoption and enablement.** The clouds go live and the pipeline data stays incomplete, so the business sees no value.
- **Data Cloud and Agentforce skills.** New, scarce, and now assumed to be part of a standard build team.

**Screen hardest for:** DevOps and Release Engineer, Data Migration Specialist, Marketing Cloud lead. Evidence of a live release train, not a sandbox.

---

## 6. What Sumeet supplies for v2

Listed so the dependency is explicit and Code does not attempt to fill it:

1. Time-to-hire per role, from Vincere history, with the definition used.
2. Scarcity per role in-region. **Licence check outstanding:** LinkedIn Talent Insights terms typically restrict external redistribution of derived data (game plan §10.2). Verify before any scarcity figure is published. Vincere data is Yallo's own and is the fallback.
3. Team size and effort per phase.
4. Rate bands, which stay off the public site and inside the requested planning pack only.

---

## 7. Forbidden

- Any quantity of any kind: FTE, duration, time-to-hire, scarcity, rate, percentage.
- Any client name, logo, quotation, case study or date.
- Any fourth archetype.
- Any download link or promise of a document that does not exist.
- Any empty numeric slot, dash-filled table cell or "coming soon" state.
- Banned vocabulary per canon §2. Buyer vocabulary is protected: phase, gate, go-live, cutover, mobilisation, hypercare all stay.
