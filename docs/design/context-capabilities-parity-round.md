# Context — Capabilities parity round, second session

**v1.0 · 1 August 2026 · Chat lens, ratified by Sumeet 1 Aug 2026 · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`.
Written for a **second, parallel Code session** running alongside the platform parity round.

---

## 1. The session boundary. Read this before anything else

Two sessions are running on one repository tonight. Session 1 owns the platform family and the shared design system, including a token rename and a redesign of the chips and the How We Work band. This session owns capability content. The split holds only if the file ownership below is respected exactly.

**Branch.** Work on `feat/capabilities-parity`, cut from `main` at session start. Rebase on `main` before every push. Never push to `main` and never force-push anything.

**This session owns, and may edit:**

- `src/data/capabilities/**`
- `src/app/capabilities/**`
- `src/data/ai-talent/**` and `src/app/ai-talent/**`, **transferred to this session on 1 Aug 2026** because AI Talent is now a capability discipline (§7). Session 1 must be told to stop work on those paths; Sumeet is issuing that instruction.
- one new component, the AI estate diagram, at `src/components/blocks/ai/AiEstateDiagram.tsx`. It is new, so it is yours, but it consumes shared tokens rather than defining any.
- capability-specific copy and data anywhere under those paths

**This session is read-only on, and must not edit:**

- `src/app/globals.css` and every token file
- every shared component: the product-family chips, the How We Work band and its connector, the sticky mini-bar, the bench-list component, the client rail, the section band wrappers
- `src/data/platforms/**`, `src/data/l1/**`
- `docs/design/yallo-talent-CANON.md`

**Why read-only, and this is the whole point:** session 1 is replacing the chips and the How We Work band tonight. If this session forks either one to make capability pages match today's Data & Analytics page, that fork is dead on arrival and the work is done twice. **Consume shared components by reference and the redesign arrives for free.** If a shared component is broken and blocks you, log it in the relay as a request and work around it locally. Do not fix it here.

**Tokens, the one real collision.** Session 1 renames `--amb-moss-*` to `--amb-harbour-*` and `--amb-umber-*` to `--amb-claret-*`, and adds `--amb-mulberry-*`. Integration & Middleware currently consumes moss; DevOps & Platform Engineering consumes umber. **Always reference the domain-level token, `--id-integration-middleware-*` and `--id-devops-platform-engineering-*`, never the raw hue name.** That insulates this session from the rename completely. If you find a raw `--amb-moss-*` or `--amb-umber-*` reference inside a file you own, replace it with the domain-level token rather than the new hue name.

---

## 2. Data & Analytics is the benchmark, and you derive the checklist from it

Sumeet has reviewed the Data & Analytics domain closely and approved it as the standard for the other five. **Do not take a checklist on trust from this document.** Read the page and its data, inventory its band order, its component set and its data contract, write that inventory into the relay as the explicit parity checklist, then apply it. Anything I asserted here about its structure would be a guess; the page is the truth.

Fix its defects first, then replicate.

---

## 3. Defects visible on the capabilities index

Two are certain from the screenshot Sumeet supplied. Sumeet may name more; Code should also run the measure-first sweep rather than trusting either list to be complete.

**D1 · Testing & Quality Engineering carries the wrong description.** It currently reads "Blockchain, IoT, digital twin and quantum-adjacent talent." That is the retired `emerging-technologies` description left attached to the wrong desk when the discipline was retired (canon §3). It needs its own description, and the retired string should exist nowhere in the repo. Grep for it and for every other orphan from that retirement.

**D2 · Artificial Intelligence is the only row with no description.** Every sibling carries one line. Two possibilities and they need different fixes, so measure before choosing: the description field is absent from the data, or it is present and the render is gating it. Check which before writing anything.

**Ruling on that row, reversed and superseded by Sumeet, 1 Aug 2026.** An earlier version of this file made Artificial Intelligence a signpost. **That is withdrawn.** AI Talent is the **seventh discipline and the first in the order**, built to the same depth as Data & Analytics, with its own hue and its own L2 family. Sumeet's reasoning: it is where future demand concentrates and it carries heavy paid marketing, so a cross-link would be the single worst place to under-build. Details in §7.

**On the "Desk in Build" state.** The four tagged disciplines are the canon §3 `PLANNED_CAPABILITIES` set, rendering non-interactive until seeded. That is correct behaviour, not a bug. The tag is data-driven, so it disappears when the data lands. Seed the data; never delete the label to make the tag go away.

---

## 3a. Sumeet's three named Data & Analytics defects

**S1 · The domain renders as "Data & AI" on L1 and L2. It must read "Data & Analytics".**

The likely root cause, and check it before anything else: canon §3 carries **two** taxonomies that share labels. The six specialist desks include "Data & Analytics" and "Cloud & Infrastructure", and so do the six disciplines. Relay v6.0 point 7 renamed the **desk** from Data & Analytics to Data & AI. If that rename was applied by string match rather than by taxonomy, it hit the discipline as collateral. Grep for it, and check whether "Cloud & Infrastructure" has the same class of leak waiting.

The durable fix is not a string edit. The desk keeps its ratified name, Data & AI, on the platform side; the discipline is Data & Analytics; and a lint rule stops either name resolving into the other taxonomy again. Fix the class.

**S2 · The L2 links are not clickable.** This exact fault already appeared in Relay v6.0: Data & Analytics was flagged `published: false` while its route had been serving 200 throughout. Check the published flags against actual route status before treating this as a render or styling problem.

**S3 · Body content is thin against the Retail and SAP pages.** Read `src/data/l1/retail.ts` and the SAP L1 to see which fields exist and are populated, then close the gap in the Data & Analytics data before it becomes the template every other discipline inherits.

Sumeet expects the measured sweep to find more than these three.

---

## 3b. Two site-wide rules confirmed in the same review

**"Yallo" is never set in capitals.** Canon §2 already says capital Y only. Sumeet found capitalised "YALLO" in the interface. Grep every occurrence across components, data, alt text, `aria-label`, page titles and metadata, and add it to the terminology lint so it cannot return. Scope is the word Yallo only: the ratified logo lockup's "TALENT" is unaffected.

**Data & Analytics loses "GenAI" from its subtitle.** With AI Talent as its own discipline, that word now describes the neighbouring domain. Rewrite the line so the two do not overlap.

---

## 4. Sumeet's ruling on the four unseeded disciplines

**All four are real desks Yallo staffs today. Build all four to full depth.** No hedging language, no "coming soon", and no thinner treatment because they are newer than Data & Analytics.

Content substance follows so nothing is invented. Sub-desks and role titles are real market vocabulary. Tools are named as things Yallo screens against, never as claims of delivery. No scarcity flag, no count, no rate on any role.

### 4.1 Cybersecurity

**Sub-desks:** Security architecture · Identity and access management · Governance, risk and compliance · Security operations and incident response · Application and product security · Cloud security · Data protection and privacy · Operational technology security.

**Roles:** Security Architect · Enterprise Security Architect · Cloud Security Architect · IAM Architect · IAM Engineer · Privileged Access Engineer · GRC Consultant · ISO 27001 Lead Implementer · Risk and Compliance Analyst · SOC Analyst · Detection Engineer · SIEM Engineer · Incident Response Lead · Threat Hunter · Vulnerability Management Analyst · Application Security Engineer · Penetration Tester · DevSecOps Engineer · Privacy Consultant · OT Security Specialist · Security Programme Manager.

**Stacks screened against:** Microsoft Entra and Defender · Sentinel · Splunk · QRadar · CrowdStrike · SailPoint · Okta · CyberArk · Saviynt · Qualys · Tenable · Wiz · Prisma Cloud · Burp Suite.

**The in-region differentiator, and handle it carefully.** Middle East programmes are governed by real regional frameworks: Saudi Arabia's NCA Essential Cybersecurity Controls, UAE Information Assurance standards, and the data-protection laws of both markets. Naming the frameworks a role is screened against is legitimate and is a genuine advantage over a firm staffing from outside the region. **Do not summarise what any framework obliges, do not give compliance dates, and do not imply certification.** Name, do not interpret.

### 4.2 Integration & Middleware

**Sub-desks:** Integration architecture and governance · API management and gateways · iPaaS and cloud integration · Event streaming · ESB and legacy middleware modernisation · B2B and EDI.

**Roles:** Integration Architect · API Architect · MuleSoft Developer · MuleSoft Architect · Boomi Developer · Kafka Engineer · Event Streaming Architect · Azure Integration Developer · SAP Integration Suite Developer · Oracle Integration Cloud Developer · TIBCO Developer · webMethods Developer · IBM App Connect Developer · APIM Engineer · API Product Manager · EDI and B2B Analyst · Middleware Administrator · Integration Test Engineer · API Security Engineer.

**Stacks:** MuleSoft Anypoint · Boomi · Apache Kafka and Confluent · Azure Integration Services · SAP Integration Suite · Oracle Integration Cloud · Informatica Cloud Application Integration · TIBCO · IBM App Connect and MQ · webMethods · Apigee · Kong · Solace · Workato · Camunda. Forward-looking and real: agent interoperability through Model Context Protocol and agent-to-agent is now an integration concern, and n8n sits inside SAP's Joule Studio.

**Cross-links:** the SAP, Oracle, Salesforce and Informatica platform desks all staff integration work. Link both ways, once each.

### 4.3 DevOps & Platform Engineering

**Sub-desks:** CI/CD engineering · Platform engineering and internal developer platforms · Infrastructure as code · Container platforms and Kubernetes · Observability and site reliability · Release engineering · IT service and operations management · FinOps.

**Roles:** DevOps Engineer · Platform Engineer · Platform Architect · Site Reliability Engineer · Kubernetes Engineer · Cloud Platform Engineer · Infrastructure as Code Engineer · Release Manager · Build and Release Engineer · Observability Engineer · DevSecOps Engineer · Developer Experience Engineer · Automation Engineer · FinOps Analyst · ServiceNow Developer · ServiceNow Architect.

**Stacks:** GitHub Actions · GitLab CI · Azure DevOps · Jenkins · Argo CD · Flux · Terraform · Pulumi · Ansible · Kubernetes · OpenShift · Helm · Backstage · Crossplane · Prometheus · Grafana · Datadog · OpenTelemetry · HashiCorp Vault · Copado and Gearset for Salesforce release trains.

**ServiceNow, and flag this one.** Canon §3 retired ServiceNow as a platform destination and kept it as a role-level capability without naming its home. It lands here, under IT service and operations management. That is a placement decision taken under delegated authority, so log it for Sumeet rather than leaving it silent.

### 4.4 Testing & Quality Engineering

**Sub-desks:** Test strategy and management · Test automation engineering · Functional and regression testing · Performance and load engineering · Non-functional and resilience testing · Test data and environment management · Accessibility testing · Quality engineering in the pipeline.

**Roles:** Test Manager · Test Lead · Test Architect · QA Automation Engineer · Software Development Engineer in Test · Performance Test Engineer · Functional Test Analyst · Integration Test Analyst · User Acceptance Coordinator · Test Data Manager · Environment Manager · Non-functional Test Lead · Accessibility Test Specialist · Quality Engineering Manager.

**Stacks:** Playwright · Selenium · Cypress · Tricentis Tosca · Worksoft · Provar for Salesforce · SAP CBTA · JMeter · k6 · LoadRunner · NeoLoad · Postman · REST Assured · Appium · BrowserStack · Xray and Zephyr · axe for accessibility · Delphix and Informatica test data management.

**The argument this page makes, and it is a real one.** Test roles are the ones programmes cut first and regret. The Programme Staffing Blueprint archetypes already say so, in the under-scoped section of all three. Cross-link to them. Do not restate a figure of any kind.

---

## 5. Order of work

1. Fix the Data & Analytics defects: Sumeet's three named ones in §3a, plus anything the measured sweep finds.
2. Fix D1 and D2 on the index, the two site-wide rules in §3b, and the AI Talent renaming and reordering per §7.
3. Derive and record the parity checklist from Data & Analytics.
4. **AI Talent to full depth, per §7, including the estate diagram.** It goes before the other seeding because it carries the marketing spend.
5. Cloud & Infrastructure to parity. It is already live, so this is gap-closing rather than seeding.
6. Seed the four planned disciplines to full depth, in canon §3 order: Cybersecurity, Integration & Middleware, DevOps & Platform Engineering, Testing & Quality Engineering.
7. Cross-links to the platform desks, both directions, once each.

---

## 6. Forbidden

- Editing anything on the read-only list in §1.
- Any invented job title, sub-desk, product name or vendor figure.
- Any client, quotation, metric, source, case study or date not already in the repo.
- Any interpretation of what a regulatory framework obliges, any compliance date, any implied certification.
- Any "coming soon", "desk in build" left on a discipline that has been seeded, or thinner treatment of a newer desk.
- Banned vocabulary per canon §2. UK English, no em dashes.

---

## 7. AI Talent, the seventh discipline

Ratified by Sumeet 1 Aug 2026. This supersedes the signpost ruling in §3 and amends `context-ai-talent.md` §1.

**Label and placement.** The capabilities row is renamed from "Artificial Intelligence" to **"AI Talent"** and sits **first**, above Data & Analytics. Canon §3's six disciplines become seven; append the amendment with its date rather than editing the six-discipline line out of existence.

**Subtitle.** Same register as its siblings, naming what Yallo places: *"Agentic AI, LLM, MLOps, evaluation and AI governance specialists."*

**Hue.** AI Talent takes **mulberry**, `#7B4988` light and `#9D63AB` dark, the values session 1 is adding tonight. Within the disciplines nothing else holds it, so the family rule is satisfied. Informatica also holds mulberry on the platform side; cross-taxonomy reuse is explicitly permitted by the palette document, since a visitor is inside one family at a time. Log the reuse, do not invent an eighth hue, and do not disturb Data & Analytics' teal.

**Routes.** `/ai-talent` stays canonical. It is already the canon §3 redirect target for `emerging-technologies`, it is short enough for paid campaigns, and session 1's spec is written against it. `/capabilities/ai-talent` and `/capabilities/artificial-intelligence` both 301 to it. L2s stay at `/ai-talent/{roleFamily}`, the nine families in `context-ai-talent.md` §4.

**Depth.** Identical to Data & Analytics: the same parity checklist you derive in §2, the same sticky sub-navigation, the same numbered function list, the same body depth measured against `retail.ts`. Sumeet's instruction is explicit that AI Talent must not be treated differently, and the reason is commercial: this is the domain carrying the paid marketing, so it is the worst possible place to ship a thin page.

### 7.1 The AI estate diagram

Sumeet wants a conceptual diagram giving an enterprise buyer a map of the AI technologies in play, with Yallo's depth visible across them. Five layers, two cross-cutting rails, one overlay. The saasinator lesson applies from the start: once this structure works, refine content only, do not re-architect it.

| Layer, bottom to top | Contents |
|---|---|
| Systems of record | SAP, Oracle, Microsoft, Salesforce, Workday, Blue Yonder, Informatica. The estate Yallo already staffs, and the reason this diagram is credible |
| Data and grounding | SAP Business Data Cloud, Databricks, Snowflake, Microsoft Fabric, vector stores, retrieval, knowledge graphs |
| Models | Anthropic, OpenAI, Google, Meta, Mistral, Cohere, hosted through Azure AI Foundry, AWS Bedrock or Vertex AI |
| Orchestration and agents | LangGraph, CrewAI, Semantic Kernel, Model Context Protocol, agent-to-agent, Joule Studio, Agentforce, n8n |
| Experience and delivery | Copilots and agents embedded in a business process, and the interaction design that makes an uncertain system usable |

**Left rail:** evaluation and observability, spanning every layer. **Right rail:** governance, risk and safety, naming EU AI Act, ISO/IEC 42001, NIST AI Risk Management Framework and OWASP Top 10 for LLM Applications without interpreting any of them.

**The overlay is the point.** Mark which of the nine role families staff each layer. Without it this is a technology poster anybody could draw; with it, it is the only diagram in the category that says who you need where.

**Constraints.** SVG, not raster. Both themes, AA, type floor 12px. Gold carries the Yallo overlay only, mulberry the ambient wash, no other decorative colour. Reduced-motion renders it static. At 360px it stacks vertically with the rails beneath rather than compressing sideways. Naming a technology asserts only that Yallo screens against it, exactly as with the stack matrix, and the caption must say so once. No vendor logos in full colour.

### 7.2 Forbidden here specifically

No placement count, client, logo, quotation or date. No claim that Yallo is leading, pioneering or first. No vendor performance figure. No technology in the diagram that is not a real, current product.
