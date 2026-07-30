# yallo.co Relaunch — Game Plan

**Version 1.0 · 29 July 2026 · Project GTM.01 — Websites — Product Build**
Owner: Sumeet Goenka · Delivery: GTM Apps pod (Raphy) · Status: **plan ratified, canon not yet ratified**

Convention: UK English · "Yallo" capital Y only · "saasinator" lowercase always.
Tags: **[RATIFIED]** locked · **[DECIDED]** taken by Claude under delegated authority, Sumeet may veto · **[FACT]** sourced · **[ASSUMPTION]** working assumption · **[REC]** recommendation · **[⚠]** needs verification before publish.

---

## 1. Purpose, scope, audience

**Purpose.** One methodical plan for relaunching yallo.co as a dedicated Yallo Talent property, replacing the legacy Yallo Group site and superseding the team's `/home-4/` work-in-progress.

**Scope — in.** Positioning and canon, information architecture, visual system, homepage design and build, proof model, SEO and URL migration, handover to the Next.js rebuild.

**Scope — out.** The job board platform itself (Volcanic and its replacement), Talent Engine (CORE.03), Academy content (GTM.03), yallogroup.com (does not exist until all three verticals are live), and Design System extraction (deferred behind shipping the sites).

**Audience.** Sumeet as the ratifying authority; Raphy's pod as the build team; a future session needing to reconstruct context without this conversation.

---

## 2. Decision register

### 2.1 Ratified by Sumeet

| # | Decision | Consequence |
|---|---|---|
| R1 | **One vertical, one site.** yallo.co = Yallo Talent, saasinator.ai = saasinator AI, academy.yallo.co = Yallo AI Academy. | Every non-Talent element of the legacy site is stripped: TS/EA as a Service, Managed IT CoE, the strategy/consulting proposition, "Strategy & Talent Unified". |
| R2 | **yallogroup.com is out of scope** until all three verticals are live and shaped. | Do not design for it, plan around it, or reserve nav space for it. |
| R3 | **Client-first, unapologetically.** | Candidates are served by the job board, not by the marketing site's IA. No top-level "Job seekers" mega panel — one quiet punchout. |
| R4 | **The job board is a separate, swappable surface.** Volcanic (Access Group) + Vincere today; Talent Engine (CORE.03) replaces Vincere; a Volcanic replacement is wanted. | Build the marketing site so board migration is a re-skin, not a rebuild: shared chrome and tokens, independent platform. |
| R5 | **"AI talent" is a category to lead, not a service line to list.** | First-order treatment on the homepage. |
| R6 | **Yallo Design System replaces the cross-cutting CMS vision.** Each product carries its own local CMS. | Verticals live first. This is not a technology project. |
| R7 | **Do not carry saasinator canon across.** | IRL, SAIF, Glass Factory, "SI for AI", the light/dark duality, the Forge mark, the console microsyntax, the no-pricing rule — none hold authority here. Method transfers; content does not. |
| R8 | **Proof is publishable:** named client logos, real placement metrics, named consultants with photos. | Unlocks the strongest proof model available. See §5. |
| R9 | **The triangle is reason-to-believe, not the pitch.** | saasinator and Academy named once, low in the page, only in service of the screening claim. Never a group services carousel, never nav links into saasinator's offer. |

### 2.2 Taken under delegated authority — Sumeet may veto

| # | Decision | Rationale |
|---|---|---|
| D1 | **Evolve the existing Yallo mark; build an entirely new design system around it.** Wordmark retained, mark refined; typography, palette, layout grammar and structural signature all new and Talent-specific. | The wordmark carries real equity — client logo wall, ~100k LinkedIn audience, existing organic footprint — and discarding it asks enterprise buyers to trust an unknown vendor at the worst moment. A clean sheet would also pre-empt a group-level decision: a brand-new Talent identity forces the future umbrella to follow it or clash. Nothing in the current *visual language* is load-bearing; it is stock imagery and Slider Revolution gradients. Siblings cohere through shared structure, not shared palette. |
| D2 | **The Gulf leads — UAE and KSA.** India is the supply engine, not a demand market. The UK is credential-bearing and a secondary demand market. | The existing logo wall is overwhelmingly Gulf enterprise (Landmark, Majid Al Futtaim, Al Tayer, Al Futtaim, Chalhoub). India is sourcing and delivery — competing on rate against entrenched local staffing firms is unwinnable for a boutique. The UK is saturated, IR35-complicated and low-margin. "Equal weight" is not implementable: SEO and IA require one primary. **[ASSUMPTION]** KSA weighting rests on programme spend and entity friction; Phase 1 verifies. |
| D3 | **Contract, direct to end client, is the lead category.** Permanent is the account-entry and credibility instrument. EOR is an enabler inside contract. Subcontracting to SIs is kept, capped, and removed from the website. | See §3.2. |
| D4 | **Publicly, one proposition with engagement models beneath it** — not four service tiles. | Four tiles fragment the pitch and invite procurement to commoditise each line. |

---

## 3. Strategic frame

### 3.1 The positioning wedge

> **Yallo Talent staffs enterprise platform programmes across the Gulf with named, architect-screened specialists — including the AI talent nobody else can find.**

Four load-bearing elements, each defensible:

1. **Enterprise platform programmes** — SAP, Oracle, Workday, Salesforce, Blue Yonder. Neither competitor set owns this. **[FACT]** Forsyth Barnes, having opened Dubai in September 2025, operates in eTail, FinTech and Sports & Entertainment — adjacent, not head-on. The Indian SIs cover platform work only as commodity, offshore-weighted bench. The intersection of *enterprise platform depth* and *Gulf presence* is open ground, and it is exactly where the legacy site's taxonomy and the existing logo wall already sit.
2. **Named, architect-screened specialists** — the differentiator, now supportable because R8 clears named consultants. **[FACT]** Named team pages with individual specialisms are the category standard; Forsyth Barnes publishes one. yallo.co currently has zero named humans, while making "architect-led screening" its central claim.
3. **The Gulf, in-region** — the thing the Indian SIs are structurally bad at: a named specialist on the ground next week, not a CV from an offshore bench.
4. **AI talent** — the category nobody has claimed. See §3.3.

### 3.2 Category strategy

| Category | Role | Reasoning |
|---|---|---|
| **Contract — direct to end client** | **Lead** | Enterprise tech demand arrives programme-shaped and time-boxed. Recurring revenue, extensions compound, and it is the only category where speed-to-shortlist and screening depth genuinely differentiate. Each placed contractor is also intelligence on the next five roles. |
| **Permanent** | **Account entry and credibility** | Place the architect or programme director permanently, then staff the programme on contract. Senior and selective — retained or exclusive, never contingent volume. This is the boutique play and the defence against Forsyth Barnes-type entrants. |
| **EOR** | **Enabler inside contract** | Its job is to remove the client's excuse — no entity in KSA, India, wherever. As a fourth service line it fragments the pitch; as a capability it closes deals and locks in the contractor book. |
| **Subcontracting to SIs** | **Kept, capped, unpublished** | The problem is not primarily margin — it is that it structurally prevents account ownership and puts Yallo on the SIs' competitive axis (rate and bench) with a boutique's cost base. Retain it for utilisation and for early visibility of live programmes; convert that intelligence into direct relationships. Set an explicit revenue ceiling. **Remove it from the website** — publishing it tells end clients you serve their SIs, which invites them to route you through the SI. |

**Second-order effect, flagged.** Contract-led growth is working-capital hungry: contractor payroll is funded ahead of client payment, and Gulf enterprises routinely run 60–90 days. **[REC]** The binding constraint on this strategy is financing, not sales — size a facility or invoice-finance line to the growth curve before accelerating. **[⚠]** I do not have your current terms or facility.

**Website consequence.** If contract-direct leads, the hero, proof and CTAs must be **programme-shaped** ("staff your programme") rather than vacancy-shaped ("find talent"). The `/home-4/` draft's "from brief to shortlist in 72 hours" is already a contract motion — the right instinct, wrongly framed.

### 3.3 The AI-talent category — grounded

**[FACT]** The demand signal is unambiguous. ManpowerGroup's 2026 Talent Shortage Survey — 39,000 employers across 41 countries — found 72% reporting difficulty filling roles, with AI skills becoming, for the first time, the hardest of all to find, overtaking traditional engineering and IT. The WEF Future of Jobs work places AI specialists at the top of fastest-growing occupations, around 40% annual growth through 2030.

**[FACT]** The competitive gap is real. The incumbents are investing in **AI *for* recruiting** — Korn Ferry's Intelligence Cloud and KF Nimble with chatbot-based screening; Forsyth Barnes describing AI investment as a way to attract talent. Their AI *market* commentary comes from generalist practice leaders, not a named AI practice. Nobody has staked "the firm that places AI talent" as a branded specialism.

**[REC]** Two cautions:
- **"Claude talent" is the sharper, more defensible claim** — Anthropic partner status plus an Academy that certifies means Yallo can credibly say it places *and* certifies Claude-capable engineers. But do not rotate the whole site onto it: enterprises hire for the stack they run, often Azure or OpenAI. **AI talent is the category; Claude talent is the proof of depth.**
- **"GCC" is dangerously ambiguous.** Most published AI-skills-gap data uses it to mean Global Capability Centres in India; the `/home-4/` draft uses it to mean the Gulf. Resolve this in copy and in every sourced statistic, or you will publish a figure that means something else entirely.

**Raw material already in hand.** The legacy homepage buries a genuinely good AI role taxonomy inside a tab carousel — Agentic AI Developer, Prompt/LLM Engineer, AI Prompt QA & Evaluation Specialist, AI & Ethics Governance Lead, Chief AI Officer. That is the category-creation asset. Surface it.

---

## 4. The phase plan

Each phase produces a named artefact. Nothing proceeds past a gate without ratification — the saasinator lesson was that every hour not spent on canon was spent twice on rework.

| Phase | Work | Artefact | Gate |
|---|---|---|---|
| **0 · Teardown** ✅ | Audit of legacy yallo.co, the `/home-4/` WIP, and the saasinator reference. Structural diagnosis, not taste. | Complete — findings in §6 and the risk register | — |
| **1 · Benchmark** | Fixed-rubric teardown of 6–8 firms: Korn Ferry, Michael Page, Robert Walters, Hays, Heidrick, Forsyth Barnes, Global Intec, plus one Indian SI staffing arm. Rubric: IA, client-vs-candidate handling, proof model, lead magnets, SEO surface, conversion mechanics, consultant presentation, visual register. | Benchmark matrix + steal / avoid / own | — |
| **2 · Canon** | Positioning spine, service taxonomy, ICP roles, proof assets, hard rules, naming conventions, tone. The Yallo Talent equivalent of saasinator's `01-CANON-and-DECISIONS.md`. | `yallo-talent-CANON.md` | **Sumeet ratifies** |
| **3 · IA + funnel + SEO** | Sitemap, page-type map, nav structure, the WHY → WHAT → HOW → PROOF → CTA funnel adapted for a contract-led talent motion, and the URL migration plan (§6). | `yallo-talent-sitemap-IA-v0.1.md` | **Sumeet ratifies** |
| **4 · Visual system** | Refined mark, new token set, and **one** structural signature — Talent's own, not a borrow of saasinator's duality. Two directions, one recommendation. | Token sheet + 2 direction comps | **Sumeet picks** |
| **5 · Homepage** | Single annotated self-contained HTML. Content in a typed `SITE` object, blocks named, every claim evidence-tagged, accessibility and performance floor enforced. Iterate section by section. | `yallo-talent-home-v*.html` | — |
| **6 · Handover** | The four-document package shape proven on saasinator: canon, content model, component inventory, master README. Feeds Raphy's Next.js build. | Handover bundle | — |
| **7 · Inner pages** | Only after the homepage is proven. Priority order: consultant/team, platform-talent pages, salary guide, case studies. | Page templates | — |

**Immediate, outside the phases — two live issues to fix this week:**
1. **`/home-4/` is publicly indexable** (`robots: index, follow`, title "Home 4 - Yallo", no meta description). A draft is competing with your homepage in search. Set `noindex` today.
2. **Counters render as zeros** on both the live site ("0 + Successful Placements") and the WIP ("0hrs Brief to Shortlist", "0 Delivery Regions"). Enterprise buyers are seeing zeros where the proof should be. Make the real figure the static fallback so animation failure degrades gracefully.

---

## 5. Proof model

R8 clears all three proof types, which is the strongest possible answer and reshapes the design.

| Asset | Treatment | Watch-out |
|---|---|---|
| **Named consultants** | A first-class page type, plus faces on the homepage next to the screening claim. Each consultant carries a specialism and a direct route to contact. This is the single highest-leverage addition — it converts "architect-led screening" from assertion to evidence, and it is the category standard Yallo currently fails. | Needs a named owner for keeping it current. A stale team page is worse than none. |
| **Named client logos** | Promote from decoration to argument: group them by programme type, and pair each with the work done. | **[⚠]** Many enterprise MSAs restrict logo use. The logos are already displayed today, which means either consent exists or it is an unmanaged risk. **[REC]** Get written logo-use consent on file per client before relaunch. |
| **Real placement metrics** | A live metrics block carrying an explicit "as at [date]" and a quarterly refresh owner. | **[⚠]** Every figure needs a definition — "successful placements" must mean one auditable thing. Undefined metrics are the fastest way to lose a procurement conversation. |
| **Case studies** | Rebuild the two WIP cases with real names, real numbers and real roles. Anonymised cases stay only where the client refuses. | Anonymous cases persuade nobody at enterprise scale. |

**Missing entirely and needed: a market-intelligence asset.** **[FACT]** Salary guides in primary navigation are the category standard — Forsyth Barnes publishes "Salary Guides 2026" as a top-level nav item, and the scale players run the same play. It is simultaneously the primary SEO engine and the primary lead-capture mechanism. **[REC]** A Gulf enterprise-platform-and-AI-talent salary and rate guide is the highest-value content asset Yallo could build, and it is data you already hold in Vincere. Scope it as a Phase 7 priority with TAL.01/TAL.02.

---

## 6. SEO and URL migration — first-order, currently unowned

The legacy site carries roughly forty-plus indexed pages: `/industries/{6}`, `/platforms/{6}`, `/capabilities/{6}`, each with overview and expertise variants, plus `/insights/*`, `/case-studies/*` and `/white-papers/*`.

**The risk.** A delete-and-relaunch destroys existing organic position at the moment you most need inbound credibility. Nobody has flagged this.

**The opportunity.** That taxonomy is *already talent-shaped*. The legacy site's own specialised-talent section maps Leadership, Architecture, Management, AI, Data, ERP/CRM, Digital, Cloud and Cybersecurity — a ready-made talent taxonomy, better than starting from scratch.

**[REC] The plan:**
1. **Retarget, don't delete.** `/platforms/sap/` becomes SAP *talent* demand content, not SAP consulting content. Same URL, same authority, new proposition.
2. **301 where you consolidate.** Every retired consulting URL redirects to its nearest talent equivalent — never to the homepage, which search engines treat as a soft 404.
3. **Kill the duplicate paths first.** The legacy site has broken and doubled URLs live today (`/industries/retail//`, `/platforms/*` versus `/technologies/*`, industry cards pointing at the wrong pages). Fix before migrating, or you migrate the mess.
4. **Never repeat the images-as-content failure.** The legacy "Beyond Recruitment. Beyond Consulting." comparison table renders its ticks as images. The *idea* is a strong sales asset and survives — the axis changes from Recruitment/Consulting/Yallo to something contract-relevant — but it must be rebuilt as accessible markup.
5. **Platform.** yallo.co is WordPress + Slider Revolution and will not meet the performance or accessibility floor. It needs migration to the golden path (Next.js + TypeScript + Tailwind + pnpm + current Node LTS), not patching.

---

## 7. The job board seam

Volcanic (Access Group) + Vincere today; Talent Engine (CORE.03) replaces Vincere; a Volcanic replacement board is wanted. Two design constraints follow:

1. **Shared chrome and tokens, independent platform.** The board wears the marketing site's header, footer and design tokens so migration is a re-skin. Extract those as a versioned, consumable theme package rather than duplicating CSS.
2. **One punchout, not a mega panel.** Per R3, candidates get a single quiet route to `/jobs`. The existing "Job seekers" top-level panel, `/join-yallo` and `/users/login` come out of the primary nav.

**[REC]** Treat the board as the *first external consumer* of the Yallo Design System token package. That makes the Design System real without turning this into a technology project.

---

## 8. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Talent-positioned page ships inside a Group-positioned shell | **Fatal** | Nav, mega menu, footer, meta and tagline are rebuilt with the page — not after. Non-negotiable gate on Phase 5. |
| Organic traffic collapse on relaunch | High | §6 migration plan, executed before launch, with pre/post rank tracking. |
| Borrowed saasinator visual grammar reads as pastiche | High | Phase 4 delivers Talent's own structural signature. No `›` prompts, no console microsyntax, no numbered technical eyebrows. |
| Client logo consent not documented | High | Written consent on file per client before relaunch. |
| Metrics undefined or unrefreshed | Medium | Definitions published, "as at" date visible, named quarterly owner. |
| "GCC" conflated between Gulf and Global Capability Centres | Medium | Terminology ruled in canon; every sourced stat checked for which it means. |
| Contract growth outruns working capital | High (commercial, not site) | Financing sized to growth curve before acceleration. |
| Consultant page goes stale | Medium | Named owner; treat as a maintained surface, not a launch artefact. |

---

## 9. Open items

1. **Yallo Talent canon** — the whole of it. Phase 2, pending ratification.
2. **Fee and rate transparency** — saasinator's no-pricing rule does not bind yallo.co. Whether Yallo Talent publishes fee models or rate bands is unresolved and needs a canon decision. **[REC]** publish an engagement-model page without numbers; rate bands belong in the salary guide, where they are an asset rather than a negotiating position.
3. **academy.yallo.co** — sub-domain versus standalone domain. Deferred, not blocking.
4. **GTM.02's own project description** still carries the superseded horizontal-CMS framing. Flag to correct.
5. **Working-capital facility** — sizing and terms not known to this plan.
6. **Volcanic and Vincere contract terms** — notice periods and data-export rights determine how quickly the board can be replaced. Not known to this plan.
