# Context — Round 14: the talent research family

**v1.0 · 3 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Scope brief, pending Sumeet's ratification.
Sequencing: content-blocked on Sumeet. Dispatches after round 13. The nav card defect that surfaced this work is fixed in round 13, not here.

Ratified by Sumeet, 3 August: the LinkedIn Talent Insights licence is **verified and clear** for this use, on the basis that LTI's stated purpose includes using the reports to grow a client base. Recorded with its provenance as his assertion, in the same way client logo consent is recorded. **Thirty-seven reports** in the source folder, one duplicate. Cut **by platform family**, with the three-market read inside each. Route decision delegated to Chat and taken in §3.

Source of record for this brief: `lti-combined-2026-08-02.csv`, a combined extract produced from the 37 reports, read and analysed on 3 August.

---

## 1. The three constraints that govern every claim

These are properties of the dataset, measured, not opinions about it. Each one rules out a shape of publication that would otherwise be the obvious one.

**1. There is no compensation data. None.** The extract carries platform, role or skill, three market counts, a combined total, a baseline and five ratio columns. **Nothing about pay, anywhere.** So the phrase the nav card currently promises — "compensation windows" — was never deliverable from this corpus, whatever page sat behind it. That closes the loop on the card defect: it is not a broken link, it is a promise the evidence base cannot keep. **The research family must not promise, imply or contain a compensation figure**, which also keeps it inside canon's ban on rates on the public site.

**2. The skill counts overlap, so they are not shares of a whole.** Measured: Oracle's named skills sum to 6,230 against an Oracle baseline of 5,147, and the Cloud family's sum to 43,224 against a baseline of 25,262. One professional carries several of these skills at once. **Consequence: never a pie chart, never a stacked bar, never "x% of the market is y".** Each ratio is an independent statement of the form "this share of the pool lists this skill". Two ratios in one family may legitimately sum past 100.

**3. This is supply, not demand.** LTI counts professionals who exist, not roles that are open. A small pool is a small pool; it is **not** evidence that a role is hard to fill, and nothing here supports a time-to-fill or "hardest to hire" claim. Those need Vincere, which is Yallo's own data and is the right source for them. Where the research wants to say something about difficulty, it must either source it from Vincere or frame it as pool size and stop.

Two further caveats, both required in the published methodology note:

- **Baselines are not comparable across families.** Data shows 128,813 and Oracle 5,147. That is the width of the title net, not the relative size of two markets. Ratios within a family are comparable; baselines across families are not, and no chart may place them on one axis.
- **Skills on LinkedIn are self-declared.** A profile listing Databricks is not a person who has delivered with Databricks. This is the dataset's weakest property and it is also **the site's central argument**: the gap between a declared skill and a screened one is what Yallo sells. State it plainly rather than hiding it, and let it do the work.

---

## 2. What the data actually says — the findings worth a page

Measured from the extract on 3 August 2026. Every figure below carries that date.

### 2.1 The sharpest single finding: Salesforce in Saudi Arabia

**Sixty-five Salesforce professionals in the whole of Saudi Arabia**, against 4,326 in the UK. Inside that 65: Marketing Cloud 18, Service Cloud 6, data migration 2, release engineering 1, **Commerce Cloud zero**.

Saudi Arabia and the UAE together hold **13.3%** of the combined Salesforce pool — the lowest Gulf share of any family in the set. A Salesforce programme in Riyadh cannot be staffed from the local market, and that is not an opinion, it is a headcount.

This is the corridor proposition stated as evidence rather than as positioning, and it is the strongest thing in the corpus.

### 2.2 Oracle is the mirror image, and it is the Gulf's family

Oracle carries the **highest Gulf share of any family at 45.3%**. Oracle Financials is **+8.4 percentage points** better represented in the Gulf than in the UK (48.8% Saudi, 48.2% UAE, 40.1% UK); Fusion is +6.5pp. Meanwhile Salesforce Marketing Cloud is **−13.7pp** in the Gulf.

So the corridor is not one market with a shortage and one with a surplus. **The two ends specialise in different platforms**, which is a more interesting and more defensible story than scarcity alone.

### 2.3 Oracle Payroll: the scarcest named skill in the entire set

**103 professionals across all three markets** — UK 46, Saudi Arabia 29, UAE 28. Two per cent of the Oracle pool.

Payroll and entity friction are precisely what the EOR pillar monetises. This connects a data finding directly to a commercial pillar, and no competitor is publishing it.

### 2.4 AI: the category claim, quantified

Across all three markets combined: **Amazon Bedrock 178, Azure AI Foundry 189, Vertex AI 206** — each under 1% of a 22,853-strong AI/ML pool. **573 people in total** hold any of the three named platform skills.

This is the evidence base the AI Talent Atlas has been missing, and it substantiates "the AI talent nobody else can find" with a number instead of an adjective. **Note the canon constraint: R-AI3 bans a scarcity figure and a rate on `/ai-talent` itself.** These figures belong in the research piece and the gated synthesis, and the ruling on whether `/ai-talent` may now cite them is Sumeet's, not this brief's. §6 item 3.

### 2.5 Data: volume-over-fit, in one line

**128,813 data professionals. Databricks 3.6%. Snowflake 3.2%.**

Abundant titles, rare tooling. This is the clearest expression in the whole corpus of the problem the site says it solves, and it needs no embellishment.

### 2.6 The rest, briefly

- **SAP**: data migration is the largest named skill at 27.4% (2,169 people) and skews highest in the UAE at 32.1%. Security is thinnest at 11.0%. Integration is +4.3pp in the Gulf.
- **Cloud and DevOps**: Azure DevOps Services is the highest ratio in the dataset at 48.7%, AWS 45.5%. **GCP is the Gulf outlier at +6.9pp** — 19.1% in Saudi Arabia against 10.4% in the UK, which runs against the usual assumption and is worth a paragraph.

### 2.7 The gap that must not be papered over

**Workday and Blue Yonder are in the ratified wedge and have desks on the site. Neither appears in this dataset.** Microsoft, ServiceNow and Informatica are likewise absent.

So the research family covers five of the platform and discipline desks and not the others. **Do not imply coverage that does not exist**, do not interpolate, and do not let an index page's framing suggest the set is complete. A short line saying which platforms the current research covers is honest and costs nothing.

---

## 3. Route and slugs — decided

**Index at `/intelligence/research`. Pieces at `/intelligence/research/{slug}`.**

Reasoning: `/white-papers/` already 301s to `/intelligence` in the redirect map, so legacy authority lands on that hub and research beneath it inherits the context rather than starting a cold top-level path; it avoids a fifth top-level taxonomy, which the repo-and-asset protocol warned against explicitly and which matters more since the nav was merged from six items to five; and it keeps the gated assets in one place beside the Blueprint. The nav label stays **"Talent research"** — the path drops "talent" because on a Yallo Talent site everything is talent.

**The slugs are not new.** Key each piece to a platform or capability slug that already exists, so a research piece and its desk are the same concept and the cross-links derive rather than being typed:

| Piece | Slug | Keyed to |
|---|---|---|
| SAP | `sap` | platform desk |
| Oracle | `oracle` | platform desk |
| Salesforce | `salesforce` | platform desk |
| Cloud and DevOps | `cloud-infrastructure` | capability desk |
| AI and data | `data-ai` | capability desk |

**One honest mismatch to record rather than hide:** LTI's Cloud net is "Cloud + DevOps titles", which spans two desks — `cloud-infrastructure` and `digital-devops`. Key the piece to `cloud-infrastructure` and cross-link `digital-devops`, and say in the methodology note that the net does not map to one desk. Do not split the data to force a clean mapping; the net is what was measured.

Each desk page gains a link to its research piece, derived from the same index, and each piece links back. **Neither link is hand-typed** — that is the eighth-instance defect class this repository keeps hitting.

---

## 4. The five pieces, and what makes one publishable

Five pieces, by platform family, three-market read inside each, per Sumeet's 3 August direction. Fewer, better, per D12: five substantive pieces, not thirty-seven templated ones. Thirty-seven near-identical market-by-skillset pages is the scaled-content shape the game plan calls out as a site-wide quality risk rather than merely weak rankings, and it arrives at exactly the wrong moment relative to cutover.

**A piece ships when it states Yallo's conclusion, not LinkedIn's table.** This is the licence mitigation and the quality bar at once: the analysis is the product, figures are used sparingly and attributed to LTI with the extract date, and the narrative is the part no competitor can replicate because it needs programme knowledge as well as data. A piece that reproduces the source tables has failed on both counts.

Required in every piece: an "as at 2 August 2026" line, the methodology note from §1, the source attribution, and a route to the brief. Forbidden in every piece: a compensation figure, a time-to-fill claim, a pie or stacked chart, a cross-family baseline comparison, and any implication of coverage per §2.7.

---

## 5. Gated assets

**One gated PDF: the cross-market synthesis.** All families, all three markets, the corridor read — the specialisation asymmetry in §2.2 is its spine. It is the piece worth an email address because it is the only place the whole picture assembles.

Per the discoverability ruling, **the gate carries an ungated summary layer**: a fully gated asset cannot be cited, and a citation carrying no numbers still names Yallo. Publish the conclusions openly, hold the full tables and the per-market detail behind the gate.

**A second gated asset, if Sumeet wants one: a Saudi Arabia pack.** It has a natural spine in §2.1, and the Phase 1 benchmark already recommended `/saudi-arabia` as its own market page ahead of the generic regional pages, because the in-country entity is a differentiator no competitor can claim without one.

**Do not build a PDF generation pipeline this round.** Author the PDFs as static assets against the design system and serve them behind the capture form. The HTML piece is the canonical, indexable version; the PDF exists because a programme director forwards it to procurement, and forwardability is the whole mechanism.

**The gate reuses round 13's capture layer.** No second form, no second store, no second delivery path — the capture table's third consumer after the brief form and the assistant. `source` discriminates.

---

## 6. Open items for Sumeet

1. **Ratify the five-piece cut and the §3 routes.** Chat's recommendation is as written.
2. **Who writes the analysis.** Each piece needs a conclusion only someone with programme knowledge can draw. Chat can draft from the extract; the judgement is Sumeet's, and the house byline is "Yallo Talent" either way.
3. **Whether `/ai-talent` may now cite the §2.4 figures.** R-AI3 currently bans a scarcity figure on that page outright. The ban was written when there was no sourced figure to cite; there is one now. Amending it is a canon change and needs Sumeet's ruling, not a side effect of this round.
4. **The refresh owner and cadence.** A dated research set with no refresh owner becomes a liability on a known date. Same rule as the homepage metrics.
5. **The second gated asset**, Saudi Arabia pack or not.
6. **Whether this lands before or after cutover.** It is content-blocked on item 2, so the date follows the writing. Worth noting one argument for before: it means the `/white-papers/` 301 arrives at something substantive rather than a thin hub.

---

## 7. Explicitly out of scope

- **Any compensation, rate, salary or day-rate content.** §1. The corpus does not contain it and canon forbids it publicly.
- **A per-role scarcity index inside these pieces.** The pool counts feed the **Programme Staffing Blueprint**, which is where §10.2 always said the scarcity index belonged. The research family is the public narrative layer; the Blueprint is the gated planning tool. Keeping them distinct is what stops the research becoming the salary guide D8 deliberately demoted.
- **Workday, Blue Yonder, Microsoft, ServiceNow and Informatica research.** No data. §2.7.
- **A thirty-seven-page programmatic family.** §4.
- **Any claim that this improves AI-answer citation rates.** The discoverability brief settles that; retrieval runs against the same index.
