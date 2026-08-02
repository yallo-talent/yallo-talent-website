# Context — Programme Staffing Blueprint v2, scarcity evidence

**v1.0 · 2 August 2026 · Chat lens · sourced from 38 LinkedIn Talent Insights Talent Pool Reports, pulled 2 August 2026**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `yallo-talent-content-authoring-guide-v1.0.md` §9
(no figure without a visible source). This file is the source evidence for Blueprint v2; it is not
publishable copy as it stands. See §5 before anything in here reaches a page.

Raw exports live at `docs/lti-reports/`. Combined dataset at
`docs/lti-reports/lti-combined-2026-08-02.csv` and `.xlsx`. Every figure below is traceable to a specific
export file, verified against that file's own embedded filter sheet before use.

---

## 1. Method

Six platform groups (SAP, Oracle, Salesforce, Cloud, Data, AI/ML), each built the same way: one baseline
Talent Pool Report against every standardised job title LinkedIn's typeahead offers for that platform, then
one report per scarce role, same titles, same three locations (United Arab Emirates, Saudi Arabia, United
Kingdom), narrowed by a skill filter. **Scarcity is the narrowed pool divided by its own platform's
baseline pool** — a matched denominator, not an absolute headcount. Title sets were frozen before use and
verified twice: on screen before export, and against the exported file's own filter sheet on receipt.

**Licence position, unchanged and binding:** rank, do not republish. No LinkedIn-derived pool size or
percentage reaches the public site as a LinkedIn-attributed figure. What follows is Yallo's own judgement,
informed by these ratios, expressed as ordinal bands. Any absolute figure that does reach the site comes
from Vincere.

---

## 2. The headline finding

**AI platform-specialist pools are the scarcest thing measured, by a wide margin, and the scarcity is
real rather than a vocabulary artefact.** Region-wide, combined across the UAE, Saudi Arabia and the UK:

| Skill | Combined pool | Ratio against the AI/ML baseline (22,853) |
|---|---|---|
| Amazon Bedrock | 178 | 0.78% |
| Azure AI Foundry | 189 | 0.83% |
| Vertex AI | 206 | 0.90% |

Under one professional in a hundred carrying an AI/ML title also carries a named hyperscaler AI-platform
skill. By comparison, the scarcest role found anywhere else in this exercise — SAP Security at 10.97% of
the SAP baseline — is more than ten times less scarce. **This is the strongest single piece of evidence
for the AI Talent category claim gathered so far**, and it is a genuine market fact rather than a taxonomy
gap: unlike the round 5 finding that LinkedIn's skill taxonomy has no entry for FBDI, HDL, Copado, Gearset,
SAP PI/PO or Migration Cockpit, Bedrock, Vertex AI and Azure AI Foundry are all real, populated skills.
The scarcity is in the people, not in LinkedIn's vocabulary.

**A caution on the growth figures.** Year-on-year growth on these three skills in the UK ranges from 155%
(Bedrock) to 500% (Azure AI Foundry), and Saudi Arabia's Vertex AI growth reads 533%. These are genuine
figures from the export, but every one of them is a small base growing from a few dozen people — Azure AI
Foundry's UK pool moved from roughly 22 to 132. **[FACT, small base]** the direction is real and worth
citing; the percentage itself should never be quoted alone without the base, because it reads as a market
claim about scale that a base this small cannot support.

---

## 3. Full ranked table, by platform, scarcest first

Combined ratio (all three markets) shown; per-country ratios are in the CSV for anything that needs
market-level nuance.

**SAP** (baseline 7,922)

| Role | Pool | Ratio |
|---|---|---|
| Security (Security + Authorizations + GRC) | 869 | 10.97% |
| Integration (SAP Cloud Platform) | 1,039 | 13.12% |
| Data migration | 2,169 | 27.38% |

**Oracle** (baseline 5,147)

| Role | Pool | Ratio |
|---|---|---|
| Payroll | 103 | 2.00% |
| Fusion (OFA + HCM) | 847 | 16.46% |
| Financials | 2,262 | 43.95% |
| E-Business Suite | 3,018 | 58.64% |

**Salesforce** (baseline 4,989 — see §4.1, this baseline is UK-heavy)

| Role | Pool | Ratio |
|---|---|---|
| DX (release engineering) | 127 | 2.55% |
| Commerce Cloud (SFCC + B2B + B2C) | 131 | 2.63% |
| Data migration | 730 | 14.63% |
| Service Cloud | 909 | 18.22% |
| Marketing Cloud + AMPscript | 3,007 | 60.27% — see §4.2, flagged |

**Cloud** (baseline 25,262, combined Cloud + DevOps title set — desk evidence, not a Blueprint archetype)

| Skill | Pool | Ratio |
|---|---|---|
| GCP | 2,871 | 11.36% |
| Azure | 7,898 | 31.26% |
| DevOps (skill) | 8,678 | 34.35% |
| AWS | 11,484 | 45.46% |
| Azure DevOps Services | 12,293 | 48.66% |

**Data** (baseline 128,813 — desk evidence)

| Skill | Pool | Ratio |
|---|---|---|
| GCP | 2,998 | 2.33% |
| Snowflake | 4,156 | 3.23% |
| Databricks | 4,652 | 3.61% |
| Azure | 5,086 | 3.95% |
| AWS | 5,753 | 4.47% |

**AI/ML** (baseline 22,853 — desk evidence, and see §2)

| Skill | Pool | Ratio |
|---|---|---|
| Amazon Bedrock | 178 | 0.78% |
| Azure AI Foundry | 189 | 0.83% |
| Vertex AI | 206 | 0.90% |

---

## 4. Findings that need a ruling before they become copy

### 4.1 Salesforce's regional shape is inverted against every other platform

The Salesforce baseline splits UK 4,326 / UAE 598 / Saudi Arabia 65 — 87% UK. SAP splits roughly 63/21/17
and Oracle roughly 55/27/19 across the same three markets. **[FACT]** Yallo's Salesforce bench, on this
evidence, is UK-sourced far more than SAP or Oracle's. This does not by itself say anything about Yallo's
own delivery capability, only about where the wider talent pool sits. Worth knowing before the Salesforce
desk's regional framing is written, and worth checking against Vincere placement history before drawing
any conclusion about Yallo specifically.

### 4.2 Salesforce Marketing Cloud's 60% ratio is anomalously high and should not be used as-is

Every other scarce-role ratio in this exercise sits under 60% only once elsewhere (Oracle EBS at 58.6%,
discussed in §4.3). A skill filter returning three in five of the entire platform's baseline pool is not
behaving as a scarcity signal. **[ASSUMPTION]** the two skill terms used, "Salesforce Marketing Cloud" and
"AMPscript", may be broader in LinkedIn's taxonomy than intended, or overlap heavily with adjacent
marketing-technology self-tagging that inflates the pool. **Recommend re-probing this one skill pair in
isolation before it is used anywhere**, rather than either publishing it or discarding it untested.

### 4.3 Oracle Financials and E-Business Suite read as abundant, not scarce, on this evidence

Financials at 43.95% and EBS at 58.64% of the Oracle baseline is a large share of the whole pool, which is
the opposite of what "chronically under-scoped" would predict if under-scoping were a supply problem.
**[FACT, no conclusion drawn]** this measures self-reported skill tagging, not verified delivery depth or
project-ready availability, so it does not contradict Sumeet's account of real EBS demand pressure — it
says the raw labour pool is not the constraint, which points the actual scarcity (if it exists) toward
depth, currency or delivery capacity rather than headcount. This is a judgement call for Sumeet, not a
data conclusion Chat should make unilaterally.

### 4.4 LinkedIn's own "hiring demand" label is not a usable signal

Nearly every location row across all 38 reports reads "Very high," including pools that clearly are not
"very high" by any relative measure (e.g. Oracle Payroll at 103 people region-wide reads "Very high"
identically to SAP's 7,922-person baseline). **Do not use LinkedIn's qualitative hiring-demand label
anywhere.** The ratio computed here is the only discriminating instrument this exercise produced.

---

## 5. What is and is not ready to publish

**Not yet publishable, any of it, as a LinkedIn-sourced number.** The licence position in §1 is unconditional.

**What can move toward publication, once translated into Yallo's own ordinal language:** a scarcity
ranking within each platform (scarcest/moderately scarce/least scarce), expressed without a percentage or
a pool size attached, sourced as "Yallo's assessment, informed by internal placement history and market
screening" rather than attributed to LinkedIn. §4.2 must be re-probed and §4.1/§4.3 need Sumeet's read
before any of this enters `src/data/blueprint/**`.

**Recommendation, not yet ratified:** hold this entire file at evidence status until the three open items in
§4 are resolved, then produce a `context-round7-blueprint-copy.md` translating the ranking into publishable
band language for Code to wire into the data layer. Do not run that translation from this file directly.
