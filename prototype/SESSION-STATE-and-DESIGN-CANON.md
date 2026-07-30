# Yallo Talent — Design Session State & Canon

**29 July 2026 · Project GTM.01 · Owner: Sumeet Goenka**
Purpose: everything decided in the Chat-lens design session, written so a fresh session, a new team member or Claude Code can resume without the conversation. Place at `docs/design/SESSION-STATE.md`.

---

## 1. Where we are

| Phase | State |
|---|---|
| 0 Teardown | Complete. Legacy site, WIP draft and Next.js build audited |
| 0b Stabilise | Complete. 8 commits merged, `known-good-pre-phase4` tagged |
| 1 Benchmark | Complete. `yallo-talent-phase1-benchmark-v1.0.md` |
| 2 Canon | In progress. Decisions below are the canon until formalised |
| 3 Handover | Mostly done. Outstanding: convert `docs/architecture/*.html` to markdown, confirm branch protection |
| 4 Visual system | **Current.** `yallo-talent-home-v0.2.html` is the reference. `DESIGN.md` still to write |
| 5 Apply | Briefs 1–3 merged or running |
| 6 Missing surfaces | Content layer live, platform/insight routes outstanding |

---

## 2. Design tokens — port these verbatim to `globals.css`

```css
--paper:#eae9e4;   --paper-2:#f4f3f0;  --paper-3:#e0ded6;
--ink:#16171a;     --ink-2:#3d3f45;    --ink-3:#6e7077;
--gold:#d4a843;    --gold-deep:#a8811f; --gold-wash:#f2e9d2;
--rule:#cfcdc5;    --rule-soft:#dcdad2;
--dk:#0c0d10;      --dk-2:#14161b;     --dk-3:#1c1f26;
--dk-line:#282c34; --dk-txt:#e9e8e4;   --dk-txt-2:#9fa3ac; --dk-txt-3:#6b7079;
--r:56px;          /* the petal radius */
```

**The brand gold is `#d4a843`**, taken from `public/logos/yallo-flower.svg`. The build's previous `#fbbf24` was brighter and cheaper than the mark. The six per-sector hues are retired: one accent, always.

**Typography.** Display `Newsreader` 500/600. Body `Inter` 400/500/600. Data `IBM Plex Mono`, tables and mono labels only. No third face. `Plus Jakarta Sans` and `DM Mono` are retired.

**Structural signature: the quarter-round petal.** Three square corners, one 56px radius, taken directly from the four petals of the Yallo mark. Used as: every card and panel corner, button radius, image masks, the progressive fill across the four screen phases, the four rotations on the entity strip, and large low-opacity background shapes. It is the one form a competitor cannot copy without copying the logo.

**Light and dark rule.** Light is the default register. Dark is used only for evidence and data surfaces, never for visual variety, and never more than two dark bands per page. Same band engine as saasinator, different tokens.

---

## 3. Brand architecture

The flower mark is the **Yallo family mark**, worn by Yallo Talent, Yallo AI Academy and eventually the group, differentiated by lockup, palette and display face rather than by a different symbol. saasinator keeps its own mark because it carries neither the name nor the domain.

Shared across all three pillars: family mark, spacing scale, grid, motion curves, component skeletons, accessibility floor, and **Inter** as body face. Differentiated per pillar: display face, palette, surface register.

saasinator for reference: Space Grotesk display, Inter body, Space Mono; canvas `#f7f6f1`, forge `#0c0d0b`, accents plasma `#ff6b47`, arc `#c45e9e`, current `#3d9be9`.

---

## 4. Ratified positioning

**Wedge.** Yallo Talent staffs and delivers enterprise platform programmes across the Middle East and Europe, with specialist-screened people, including the AI talent nobody else can find.

**Four pillars.** Contract direct to end client leads. Permanent is account entry and credibility. Employer of Record is an enabler inside contract. Managed Delivery is the fourth pillar: direct mode published, white-label behind an SI not published. Never the word "subcontracting" in public copy.

**Boundary with saasinator.** Yallo Talent delivers fixed scope on the client's existing enterprise platforms. saasinator builds new AI-native systems the client owns. Routing test: "make our Salesforce work" goes to Talent, "replace the thing we rent" goes to saasinator.

**Geography.** Middle East (UAE, Saudi Arabia) primary. Europe, UK first, a genuine second demand market. India third, de-prioritised but real, specifically **Global Capability Centre staffing for multinationals**, not a delivery function. The proposition is the corridor across all three.

**Terminology.** "Middle East" is canonical. "GCC" banned outright, because in Yallo's own India business it means Global Capability Centre. Name UAE and Saudi Arabia explicitly, avoid "KSA" in public copy. **Bengaluru**, not Bangalore. "AI talent" is the category, "Claude talent" is depth-proof only.

**Four entities.** London, Dubai, Riyadh, Bengaluru.

---

## 5. Taxonomy

**Six platforms**, in this order, because Yallo is a Microsoft house: SAP, Oracle, Microsoft (Azure and Dynamics 365), Salesforce, Blue Yonder, Workday. **ServiceNow and AWS removed** from the platform set; AWS folds into cloud-infrastructure.

**Six sectors:** retail, finance, manufacturing, government, healthcare, telco.

**Six disciplines:** `data-analytics`, `cloud-infrastructure`, `cybersecurity`, `integration-middleware`, `devops-platform-engineering`, `testing-quality-engineering`. `emerging-technologies` retired, 301 to `/ai-talent`. AI is listed first in the nav capability column but links to `/ai-talent`, not to a capability route.

**Eight role families** (from the pitch-deck role wheel, rendered as an accessible grid rather than a radial): Architects, Application Consultants, Developers, Data & Analytics, Cloud & DevOps, Test & Quality, Business & Functional, Product & Agile. Full role lists are in the v0.2 homepage `R` array.

**Six specialist desks** (from the team-structure slide): Architecture, Software Development, Cloud & Infrastructure, Packaged Software, Data & Analytics, Agile & DevOps. One account manager as single point of contact in front of them.

**Segments** stay an in-page concept, never a page family.

---

## 6. Navigation, rebuilt outward

| Label | Answers | Contains |
|---|---|---|
| Specialisms | Can you find my people? | Platforms, disciplines, roles, AI talent |
| Industries | Do you know my world? | The six sectors |
| How we work | How do we engage? | Contract, Permanent, EOR, Managed Delivery |
| Evidence | Why believe you? | Case studies, clients, the team |
| Intelligence | Do you know something I don't? | Blueprint, Atlas, insights |

Then a quiet **Jobs** text link and **Start a brief** as the only button. No per-item hues, no Unsplash panels, no "Job seekers" dropdown.

---

## 7. Metrics — the only four published

| Value | Label | Definition |
|---|---|---|
| 72h | Brief to shortlist | Three screened candidates from a complete brief |
| 2:1 | CVs per interview | Candidates sent per interview held |
| 80% | Contracts renewed | Placed contractors extended at least once |
| 50+ | Programmes staffed | Enterprise platform programmes, not placements |

Database size is deliberately **not** published: it argues against the screening positioning and invites a bench-depth comparison against the Indian SIs.

No source lines or "as at" dates render on the page. Refreshed quarterly in `content/metrics.yaml`.

---

## 8. The commitment — real commercial terms

Taken from the actual pitch-deck service scopes, replacing invented wording.

**Permanent:** no success no fee · payment on candidate start date · flat fee across all seniority levels · exclusive or retained · **100-day warranty**.

**Contract:** published rate card, hourly daily or monthly · replacement if quality misses the brief · ramp up and ramp down by phase · contract to hire · 2 to 4 weeks to onboard including visa and EOR.

The earlier "first ten working days at our risk" line is **withdrawn**. It creates unbounded exposure and is unsafe where contractors are on Yallo visa sponsorship.

---

## 9. Client proof

Two groups, never merged into one strip.

**Enterprise, accounts owned:** Alshaya Group, Landmark Group, Majid Al Futtaim, Al Tayer, Al Futtaim, Chalhoub Group, Al Othaim Markets, Panda Retail, Lulu, Danube, Apparel Group, Emirates NBD, Al Rajhi Bank, Al Hokair, Ghassan Aboud, Dubai CommerCity, Richemont, Marks & Spencer, Tesco, Sainsbury's, John Lewis Partnership, Currys, Debenhams, ASOS, Wickes, Sephora, Ralph Lauren, GAP, Target, Walmart, Lowe's, Kohl's, Radwell.

**Integrators, framed as validators of the screening bar:** TCS, Infosys, Capgemini, Wipro, CGI, Oracle Consulting. The heading is "the systems integrators delivering them come to us for specialists". Never describes the commercial arrangement.

**Platform partners** (separate wall): SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday, Anaplan, Manhattan Associates, Google Cloud, AWS, IBM, Informatica, Shopify, Magento, Coupa, Infor.

Logo files are in the uploaded `Client_Logos.zip`. Richemont is not in the pack and needs sourcing.

---

## 10. Homepage spine, v0.2

1. **Hero** — single frame, drawn shortlist device on the right, four-entity strip beneath
2. **Logo marquee** — two rows, opposite directions, pause on hover
3. **The gap** — five-persona index, content preserved from `TheProblem.tsx`, surface replaced
4. **Metrics** — four numbers, oversized numerals, petal fill
5. **The screen** — four phases plus the six specialist desks
6. **Role coverage** — the eight role families, interactive
7. **The commitment** — permanent and contract terms, two columns
8. **How you engage** — accordion, four models, contract leading
9. **Where we place** *(dark)* — three axes of six with drawn icons
10. **AI talent** *(dark)* — six roles plus the ManpowerGroup stat
11. **Evidence** — case-study rail with client names, plus one testimonial
12. **Intelligence** — Blueprint gated, Atlas open
13. **Close** — dark, brief checklist

"The people who screen" is **deleted**. Sumeet is the calibrating architect and Niharika Head of Talent Acquisition; a named-architect gallery overclaims. The six specialist desks carry that proof instead.

---

## 11. Content rules, kept from Raphy's plan

Stop describing tools, deploy talent. Never write "SAP Customer Experience delivers personalised experiences using real-time data insights." Write what roles Yallo places, how screening works, why the contractor has implementation depth. The visitor already knows what the tool does.

Never write: vendor marketing voice, superlatives without evidence, "GCC", "subcontracting", rates or fee percentages on public pages, candidate-facing copy in the buyer path, unsourced figures.

Rate bands live only inside the gated Programme Staffing Blueprint.

---

## 12. Outstanding

1. Richemont logo file to source.
2. `DESIGN.md` to write from section 2 above, via `/impeccable document`.
3. Platform detail routes (6), insight article routes, case-study routes still unbuilt.
4. Programme Staffing Blueprint and AI Talent Atlas content.
5. LinkedIn Talent Insights redistribution licence to verify before the Blueprint publishes.
6. Go-live date to set. Gate is already defined in `AGENTS.md`.
