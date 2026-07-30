# yallo.co Relaunch — Game Plan

**Version 1.2 · 29 July 2026 · Project GTM.01 — Websites — Product Build**
Owner and builder: Sumeet Goenka · Delivery support: Claude (Chat lens for canon and direction, Claude Code for execution) · Status: **plan ratified, canon not yet ratified**

*Changes from v1.1: build ownership transfers to Sumeet, Raphy's pod reallocated to saasinator.ai and Academy (R13); WordPress dependency already broken — a Next.js build exists and becomes the working base (R14); talent.yallo.co confirmed as a temporary placeholder, yallo.co is the destination (R15); new §5 current-build assessment; phase plan rewritten around an existing codebase rather than a fresh prototype; §7 becomes a concrete redirect map; §8 build order re-prioritised against what is actually missing; new §9 Phase 4 visual brief; new §12 operating model; risk register updated.*

Convention: UK English · "Yallo" capital Y only · "saasinator" lowercase always.
Tags: **[RATIFIED]** locked · **[DECIDED]** taken under delegated authority, Sumeet may veto · **[FACT]** sourced · **[ASSUMPTION]** working assumption · **[REC]** recommendation · **[⚠]** verify before publish.

---

## 1. Purpose, scope, audience

**Purpose.** One methodical plan for relaunching yallo.co as a dedicated Yallo Talent property, now built and owned by Sumeet directly on the existing Next.js codebase.

**Scope — in.** Positioning and canon, information architecture, visual system, homepage and priority inner pages, the page-level retain/retarget/retire decision and redirect map, proof and intelligence assets, defect remediation, SEO, and the specification of the work that must go back to the team.

**Scope — out.** DNS and cutover, the brief-form backend and its secrets, the Volcanic punchout wiring, the WordPress teardown, repository admin settings (all team-owned). Also out: the job board platform itself, Talent Engine (CORE.03), the Hub pillar-reporting lens (CORE.02), Academy (GTM.03), yallogroup.com, Design System extraction (GTM.02).

**Audience.** Sumeet as owner, builder and ratifying authority; Raphy's pod for the specified dependencies; a future session reconstructing context.

---

## 2. Decision register

### 2.1 Ratified by Sumeet

| # | Decision | Consequence |
|---|---|---|
| R1 | **One vertical, one site.** yallo.co = Yallo Talent; saasinator.ai = saasinator AI; academy.yallo.co = Yallo AI Academy. | Every non-Talent element of the legacy site is stripped: TS/EA as a Service, Managed IT CoE as consulting, the strategy proposition, "Strategy & Talent Unified". |
| R2 | **yallogroup.com out of scope** until all three verticals are live. | Do not design for it or reserve nav space. |
| R3 | **Client-first, unapologetically.** | Candidates are served by the job board. No top-level "Job seekers" panel — one quiet punchout. |
| R4 | **The job board is a separate, swappable surface.** Volcanic + Vincere today; Talent Engine (CORE.03) replaces Vincere; a Volcanic replacement is targeted **end of 2026, not a current priority**. | Design for swappability — shared chrome and tokens, independent platform — but do not plan the migration yet. |
| R5 | **"AI talent" is a category to lead, not a service line to list.** | First-order treatment. **Claude talent is depth-proof only** — never the organising claim. |
| R6 | **Yallo Design System replaces the cross-cutting CMS vision.** Each product carries its own local CMS. | Verticals live first. Not a technology project. |
| R7 | **Do not carry saasinator canon across.** | IRL, SAIF, Glass Factory, "SI for AI", the light/dark duality, the Forge mark, console microsyntax, the no-pricing rule — none hold authority here. |
| R8 | **Proof is publishable:** named client logos, real placement metrics, named consultants. Consultants collated from current and past team; **placeholders acceptable at first build, but as roles, never as invented people**. | See §10. |
| R9 | **The triangle is reason-to-believe, not the pitch.** | saasinator and Academy named once, low in the page, in service of the screening claim only. No group services carousel. |
| R10 | **Decouple from WordPress.** | Already achieved — see R14. |
| R11 | **Europe is a real second market**, grounded in Sumeet's UK career, Richemont Switzerland stint and European network. India is supply-side. | See §4.3. |
| R12 | **Working capital is covered** — managed for two to three years, with reserves and bank pipelines. | Risk downgraded to Monitor. **[ASSUMPTION]** holds at current growth; revisit if the contract book doubles. |
| R13 | **Sumeet takes personal ownership of the Yallo Talent build.** Raphy's pod reallocates to saasinator.ai and Yallo AI Academy (GTM.03). Team retains the §12 dependencies only. | Talent is the revenue engine and the surface where Sumeet's judgement is the scarce input; Academy is the long pole needing sustained engineering hours. |
| R14 | **The existing Next.js build is the working base**, not a reference to be replaced. | No fresh prototype. Enhancement, remediation and redesign happen in `github.com/yallogroup/yallo-talent-website`. |
| R15 | **talent.yallo.co is a temporary placeholder. yallo.co is the destination.** | Domain risk closed — but the placeholder must be set to `noindex` immediately, or the switch becomes a domain migration. See §7 and defect B6. |

### 2.2 Taken under delegated authority — Sumeet may veto

| # | Decision | Rationale |
|---|---|---|
| D1 | **Evolve the existing Yallo mark; build a new design system around it.** Wordmark retained, mark refined; typography, palette, layout grammar and structural signature all new and Talent-specific. | The wordmark carries equity already paid for — logo wall, ~100k LinkedIn audience, organic footprint. A clean sheet would pre-empt a group-level decision. Nothing in the current *visual language* is load-bearing. Siblings cohere through shared structure, not shared palette. |
| D2 | **One corridor, not two markets.** Middle East (UAE, Saudi Arabia) leads the IA and SEO surface. Europe is a genuine second surface. India is the supply engine, never a demand market. The proposition is the **corridor**. | Two co-equal demand markets is not implementable in IA or SEO, and competing head-on in the saturated, IR35-complicated UK contract market is not a boutique's game. The corridor is defensible and category-normal — Halian, Whitehall and Forsyth Barnes all run Europe-plus-Middle-East as one estate. |
| D3 | **"Middle East" is canonical.** "GCC" banned. "Gulf" only as occasional variant. Name **UAE** and **Saudi Arabia** explicitly; avoid "KSA" in public copy. "MENA" only if North Africa is genuinely served. | "GCC" collides with Global Capability Centres in exactly the AI-skills data the site cites, and it excludes markets Yallo may serve. |
| D4 | **Contract, direct to end client, leads.** Permanent is account entry and credibility. EOR is an enabler inside contract. **Managed Delivery is the fourth pillar.** | See §4.2. |
| D5 | **The fourth pillar is "Managed Delivery."** Direct mode publishable; white-label mode not. | "Subcontracting" describes Yallo's position in someone else's value chain. "Outsourcing" reads 2005 and invites rate comparison with the Indian SIs — the one axis to avoid. |
| D6 | **Boundary rule between verticals:** Yallo Talent Managed Delivery delivers fixed scope **on the client's existing enterprise platforms** with named specialists. saasinator builds **new AI-native systems the client owns**. | Routing test: "make our Salesforce work" → Talent. "Replace the thing we rent" → saasinator. |
| D7 | **Stack stays Next.js.** Confirmed by the existing build: Next 16.2.12, React 19.2.4, TypeScript 5.9, Tailwind 4, pnpm. | The Design System only becomes real if both live sites consume the same token and component package. The Nuxt option is closed. |
| D8 | **The salary guide is demoted to a by-product.** Flagship intelligence asset is the **Programme Staffing Blueprint**; the AI category asset is the **AI Talent Atlas**. | Salary guides are commodity — Robert Half, Forsyth Barnes, Michael Page and Hays all publish one, against far higher domain authority. Nobody publishes what it takes to *staff a programme*. See §10. |
| D9 | **Retain and retarget the legacy taxonomy.** Platform, industry and capability URLs keep their authority and change proposition. | The new build's route design already matches the legacy taxonomy almost exactly — an unplanned but significant advantage. See §7. |
| D10 | **Publicly, one proposition with engagement models beneath it** — not four service tiles. | Four tiles fragment the pitch and invite procurement to commoditise each line. |
| D11 | **One brand accent, not seven.** Retire the six-hue per-sector system in `globals.css`; keep the yellow/amber accent as the single brand colour. | A brand with seven accents has no accent, and per-sector hue means the brand colour changes on every page — the opposite of what a boutique needs. See §9. |
| D12 | **Enrich the twenty existing L2 pages rather than generate the remaining hundred.** | Each L2 currently carries roughly 120 words of unique content against identical boilerplate. Scaling that to 120 pages is squarely inside Google's scaled-content-abuse territory, and the exposure is a site-wide quality signal, not just weak rankings. |

---

## 3. The competitive field

Corrected against research, July 2026. The v1.0 set was wrong for this market.

| Firm | Shape | Why it matters |
|---|---|---|
| **Halian** | **The head-on competitor.** Founded London 1996, HQ Dubai, offices across Europe, Middle East and USA; Saudi office 2023. Permanent, contract, project-based, managed services, RPO, outsourced payroll, executive search. Dedicated ERP practice — SAP, Oracle, Dynamics, NetSuite, Infor. Publishes Vision 2030 and Dubai/Riyadh tech-role content. | Almost exactly the shape Yallo is building, **including the fourth pillar**. Benchmark and threat at once. Beat them on named-specialist depth, AI-talent category ownership, and the corridor. |
| **Hays Technology** | Middle East IT contract at scale — DevOps, cloud architects, SAP consultants; reported ~9-day average contract time-to-fill; contractor-care function. | Sets the speed bar. "72 hours to shortlist" is a *shortlist* claim, not a fill claim — never let copy conflate them. |
| **Robert Half** | Multinational and mid-market tech staffing; separate cybersecurity, ERP and development desks; 2026 salary guide with a six-month placement guarantee. | The commodity salary-guide play, plus a risk-reversal mechanism worth studying. |
| **BAC Middle East** | Longest-established UAE recruiter; strong on Dubai government projects. | Government-programme access. |
| **TASC Outsourcing** | Regional outsourcing and staffing at scale. | Nearest regional Managed Delivery competitor. |
| **Brunel** | Contract and project-based, engineering and energy-weighted. | Contract-at-scale mechanics; adjacent sector. |
| **Morgan McKinley** | Financial-services technology, rare skill sets. | BFSI depth. |
| **Whitehall Resources** | SAP specialist publishing Middle East SAP market analysis. | **The content and SEO competitor** on platform-talent keywords. |
| **Michael Page, Guildhall, Adecco ME** | Scale generalists and executive search. | IA and conversion-mechanics reference. |
| **TCS, Infosys, Capgemini, Wipro** | Indian SIs doubling as contract staffing. | Never compete on rate or bench depth. Their bench is deep but generic and offshore-weighted; the buyer's pain is a named specialist in-region next week. |
| **Forsyth Barnes** | *Style* reference only — named team page with individual specialisms and direct contacts, Salary Guides in primary nav, contract as a titled function. Dubai only since September 2025; verticals are eTail, FinTech, Sports and Entertainment. | Not a category rival on sector. A useful model for consultant presentation. |

**Phase 1 rubric.** Score each on: IA and nav model · client-versus-candidate handling · proof model · consultant presentation · lead magnets and gating · SEO surface and content cadence · conversion mechanics and risk reversal · engagement-model presentation · visual register · platform and performance.

---

## 4. Strategic frame

### 4.1 The positioning wedge

> **Yallo Talent staffs and delivers enterprise platform programmes across the Middle East and Europe — with named, architect-screened specialists, including the AI talent nobody else can find.**

1. **Enterprise platform programmes** — SAP, Oracle, Workday, Salesforce, Blue Yonder. Where the legacy taxonomy and the logo wall already sit, and narrower and more defensible than "tech talent". Neither competitor set owns it: the boutiques are in eTail, FinTech and Sports; the Indian SIs treat it as commodity offshore bench.
2. **Named, architect-screened specialists** — the differentiator, supportable because R8 clears named consultants, and the category standard the legacy site failed while making architect-led screening its central claim.
3. **The corridor, in-region** — what the Indian SIs are structurally bad at: a named specialist on the ground next week, not a CV from an offshore bench.
4. **AI talent** — the category nobody has claimed.

### 4.2 The four pillars

| Pillar | Role | Published? | Reasoning |
|---|---|---|---|
| **Contract — direct to end client** | **Lead** | Yes, leads the site | Enterprise tech demand arrives programme-shaped and time-boxed. Recurring revenue, extensions compound, and it is the only category where speed-to-shortlist and screening depth genuinely differentiate. Every placed contractor is intelligence on the next five roles. |
| **Permanent** | **Account entry and credibility** | Yes | Place the architect or programme director permanently, then staff the programme on contract. Senior and selective — retained or exclusive, never contingent volume. |
| **EOR** | **Enabler inside contract** | Yes, as a capability not a tile | Removes the client's excuse — no entity in Saudi Arabia, India, wherever. Closes deals and locks in the contractor book. |
| **Managed Delivery** | **The up-market move** | **Direct mode: yes. White-label: no.** | Fixed-scope SOW delivery. *Direct* — the Redwheel shape: Salesforce Service and Marketing Cloud, six to nine months, six or seven consultants and architects, Yallo owning the client. *White-label* — the Oracle Consulting shape, delivered behind the vendor's front. Commercially valuable, but publishing it tells end clients you serve their SIs, which invites them to route you through the SI. |

**Validation.** Halian runs precisely this shape in this market. The fourth pillar is a proven adjacency here.

**What Managed Delivery demands that staffing does not.** Fixed price transfers delivery and margin risk to Yallo. It needs SOW discipline, a named delivery owner per engagement, and margin governance. **[REC]** cap concurrent fixed-price engagements until the discipline is proven.

**Website consequence.** Hero, proof and CTAs must be **programme-shaped** ("staff your programme") rather than vacancy-shaped. The existing build already does this correctly with `/brief` and "send the role, the platform, the timeline".

**The Hub pillar lens** (CORE.02's build, flagged not designed here). Four-pillar revenue lens is right, with pillar four renamed Managed Delivery. **[REC]** the cross-pillar lenses that matter commercially: **account ownership** (direct versus intermediated — the health metric, because pillar revenue can grow while the business gets structurally weaker if the intermediated share rises); **revenue type** (one-off fee versus recurring margin versus fixed price); and **programme concentration** (revenue per client programme). Carry to CORE.02.

### 4.3 Geography — the corridor

| Market | Role | Site treatment |
|---|---|---|
| **Middle East — UAE, Saudi Arabia** | **Primary demand.** The logo wall is overwhelmingly Middle East enterprise (Landmark, Majid Al Futtaim, Al Tayer, Al Futtaim, Chalhoub). Vision 2030 programme spend and entity friction both concentrate here, and entity friction is what EOR monetises. | Leads the IA, SEO surface, case-study set and consultant presence. |
| **Europe — UK first, Switzerland and Western Europe behind** | **Genuine second demand market**, credential-bearing and network-led. | A real regional surface with its own case studies. Do **not** chase generic UK contract keywords. |
| **India** | **Supply engine**, via Bengaluru. | Named as delivery capability. Never a demand market. Retire the "3 delivery regions" stat, which conflates supply with demand. |

**The differentiated framing.** European enterprises running Middle East programmes need in-region specialists working to European delivery standards; Middle East enterprises need European and global expertise landed locally. Entities in London, Dubai and Bengaluru, and a founder with the network on both ends. Nobody owns this positioning.

### 4.4 The AI-talent category

**[FACT]** ManpowerGroup's 2026 Talent Shortage Survey — 39,000 employers across 41 countries — found 72% reporting difficulty filling roles, with AI skills becoming for the first time the hardest of all to find, overtaking traditional engineering and IT. The WEF Future of Jobs work places AI specialists at the top of fastest-growing occupations, around 40% annual growth through 2030. Robert Half's 2026 Dubai salary guide reports an 18% premium on AI engineers.

**[FACT]** The gap is real. Incumbents invest in **AI *for* recruiting** — Korn Ferry's Intelligence Cloud and KF Nimble with chatbot screening; Forsyth Barnes describing AI investment as a way to attract talent; Halian listing AI and machine learning among managed-services technologies. Their AI market commentary comes from generalist practice leaders, not a named AI practice. **Nobody has staked "the firm that places AI talent" as a branded specialism.**

**Raw material in hand.** The legacy homepage buries a good AI role taxonomy inside a tab carousel — Agentic AI Developer, Prompt/LLM Engineer, AI Prompt QA & Evaluation Specialist, AI & Ethics Governance Lead, Chief AI Officer, AI Product Manager, MLOps Engineer, AI/GenAI Solution Architect, Generative AI Experience Designer. Surface it as the **AI Talent Atlas** (§10).

**[⚠]** Most published AI-skills-gap data uses "GCC" to mean Global Capability Centres in India, not the Gulf. Check every sourced figure for which it means.

---

## 5. Current build assessment

Full detail in `yallo-talent-build-review-and-defect-register-v1.0.md`. Summary:

**What is strong and should be preserved.** A real typed content model (`L1PageData`, `L1ExpertiseCard`, `L2Tool`, `L1ScarceRole`) with documented field contracts — genuine content/render separation, and the asset that survives any redesign. A two-layer token architecture with raw hex confined to one file, enforced by a pre-commit hook. An `AGENTS.md` carrying locked decisions, a fixed phase order and a self-imposed gate of Lighthouse Mobile 90+, LCP under 2.5s, CLS under 0.1, INP under 200ms and WCAG 2.2 AA. `prefers-reduced-motion` handled in CSS, 296 aria attributes, a theme toggle. Practice leads presented as roles with real credentials and **no invented people**. L2 generation gated on data presence, so twenty real retail pages exist rather than a hundred and twenty thin ones. Managed Delivery already built as pillar four. Content depth on the retail L1 that no competitor matches.

**Six blockers.** The sector display name renders as hero copy on every L2 page and in its `<title>`; roughly forty internal links 404 (all platform, capability, insight and case-study detail routes are unbuilt); the sitemap omits every industry and function page because a dead parallel data layer feeds it; metrics server-render as zeros; three statistics are unsourced or misstated; and the placeholder host is set to be indexed.

**The art gap, diagnosed.** Four causes, all fixable and all upstream of code: no structural signature (every section is eyebrow, headline, sub-paragraph, card grid); seven accent colours with the brand colour changing per sector; Plus Jakarta Sans plus DM Mono plus dark glassmorphism, which is both the 2024 SaaS default and saasinator's register, so the site reads as derivative of its own sibling; and density without hierarchy — ten anchor-nav sections and twenty function cards with nothing telling the buyer what matters most.

**Root cause.** `DESIGN_SYSTEM.md` is an empty stub: "Status: draft — to be filled." The engineering discipline is real; the design intent was never written down. That is what Phase 2 and Phase 4 exist to fix.

---

## 6. The phase plan

Rewritten around an existing codebase under Sumeet's ownership.

| Phase | Work | Artefact | Gate |
|---|---|---|---|
| **0 · Teardown** ✅ | Legacy site, WIP draft and the new Next.js build audited. | Defect register v1.0 | — |
| **0b · Stabilise** | `noindex` the placeholder (B6); correct or remove the three statistics (B5); fix the zero-rendering metrics (B4). Nothing else. | Three commits | — |
| **1 · Benchmark** | Fixed-rubric teardown of the §3 field, Halian deepest. | Benchmark matrix + steal / avoid / own | — |
| **2 · Canon** | Positioning spine, four-pillar taxonomy, terminology rules (Managed Delivery, Middle East, geography order), ICP roles, proof model, hard rules, tone. Shorter than a greenfield canon because much is now observable in the build. | `yallo-talent-CANON.md` | **Sumeet ratifies** |
| **3 · Handover + repo control** | Formal transfer. Rewrite `AGENTS.md` for the new ownership; drop the single-author commit rule; convert `docs/architecture/*.html` to markdown at `spec/`; close the CI floor (tests, Node 22, pnpm 10); confirm `main` protection. | Rewritten `AGENTS.md` + green CI | — |
| **4 · Visual system** | The design brief in §9, executed: one accent, new type pairing, one structural signature, purpose-built visuals. Two directions, one recommendation. Fill `DESIGN_SYSTEM.md`. | Token sheet + 2 direction comps + written design system | **Sumeet picks** |
| **5 · Apply and remediate** | Design direction applied across existing templates. Remaining blockers cleared: display-name bug (B1), dead links gated or built (B2), sitemap driven from the real data layer (B3). Terminology and geography corrections (H1–H3). Nav and sibling-brand fixes (H4, H5). | Working site on the placeholder | — |
| **6 · Build the missing surfaces** | Per the §8 order. | Routes + content | — |
| **7 · Content and proof** | Real consultants, real metrics with definitions and dates, real case studies, the first Programme Staffing Blueprint, the AI Talent Atlas. | Populated data layer | **Sumeet approves proof** |
| **8 · Gate** | Lighthouse Mobile 90+, LCP <2.5s, CLS <0.1, INP <200ms, WCAG 2.2 AA. Internal-link check green. Sitemap matches route count. | Gate report | **Sumeet approves** |
| **9 · Cutover** | Team-executed: DNS to yallo.co, redirect map from §7 deployed, `SITE.url` flipped, placeholder `noindex` lifted, WordPress decommissioned, ranks tracked pre and post. | Migration log | **Sumeet approves cutover** |

**This week, regardless of phase:** set `/home-4/` on the live WordPress site to `noindex` — it is currently `index, follow`, titled "Home 4 - Yallo", with no meta description, competing with the real homepage in search. Fix the zero counters on the live WordPress site too, or make the real figure the static fallback.

---

## 7. Redirect map — legacy WordPress to new routes

The new build's route design already matches the legacy taxonomy almost exactly. That is a significant and largely unplanned advantage: most of the highest-authority URLs can be retargeted in place rather than migrated.

**Kept — same path, new proposition. No redirect needed.**

`/industries` · `/industries/retail` · `/industries/finance` · `/industries/manufacturing` · `/industries/government` · `/industries/healthcare` · `/industries/telco` · `/platforms` · `/platforms/sap` · `/platforms/oracle` · `/platforms/microsoft` · `/platforms/salesforce` · `/platforms/blueyonder` · `/platforms/workday` · `/capabilities` · `/capabilities/cybersecurity` · `/why-yallo` · `/insights` · `/case-studies` · `/jobs`

**301 — consolidations and slug changes.**

| Legacy | New | Reason |
|---|---|---|
| `/industries/{sector}/expertise/` (×6) | `/industries/{sector}` | Overview/expertise split is thin duplicate content |
| `/industries/retail//` | `/industries/retail` | Double-slash defect live today |
| `/industries/consumer-retail/` and `/consumer-retail/expertise/` | `/industries/retail` | Duplicate of retail |
| `/platforms/{platform}/expertise/` (×6) | `/platforms/{platform}` | As above |
| `/technologies/sap/` | `/platforms/sap` | Two paths, one page |
| `/capabilities/data/` | `/capabilities/data-ai` | Slug changed |
| `/capabilities/digital` | `/capabilities/digital-devops` | Slug changed |
| `/capabilities/cloud/` | `/capabilities/cloud-infrastructure` | Slug changed |
| `/capabilities/integration` | `/capabilities/integration-middleware` | Slug changed |
| `/capabilities/innovation/` | `/capabilities/emerging-technologies` | Slug changed |
| `/capabilities/{cap}/expertise/` (×6) | parent capability | As above |
| `/managed-it-coe/` | `/managed-delivery` | The cleanest retarget on the site — the category Redwheel actually bought under |
| `/talent-in-a-box/` and `/talent-ina-box/` | `/contract` | Name dies; URL authority retained |
| `/tsea-as-a-service/` and `/tsa-as-a-service/` | `/managed-delivery` | Nearest talent equivalent; TS/EA consulting is out of scope |
| `/white-papers/` | `/insights` | Folds into the knowledge hub |
| `/leadership-team/` | `/leadership` | Route already exists |
| `/about-us/` | `/about` | |
| `/contact-us/` | `/brief` | Conversion becomes programme-shaped |
| `/insights/{path}` | `/insights/{slug}` | Audit each individually; 301 pieces that do not serve a talent buyer |
| `/?case-study={slug}` | `/case-studies/{slug}` | Query-string pattern becomes proper paths |
| `/join-us/` and `/join-yallo/` | `/jobs` | R3 — one quiet punchout |
| `/home-4/` | `/` | `noindex` now, 301 at cutover |

**Rules.** Never 301 to the homepage — search engines treat it as a soft 404. One canonical per concept. Baseline the top fifty ranking URLs before cutover and track after. Rebuild the legacy "Beyond Recruitment. Beyond Consulting." comparison table as accessible markup — the idea is a strong sales asset and survives, but its ticks are currently images, and the axis changes from Recruitment/Consulting/Yallo to something contract-relevant.

---

## 8. Build order for the missing surfaces

Re-prioritised against what is actually absent, not against a greenfield plan.

| # | Surface | Status | Why this priority |
|---|---|---|---|
| 1 | **Platform detail** ×6 (+ ServiceNow, AWS) | **0 built, 8 linked** | Highest-value retarget, deepest legacy authority, core to the wedge, and currently 404 from the homepage. |
| 2 | **Consultant / team** `/leadership`, `/team/{slug}` | Index exists | The single highest-leverage content addition — converts architect-led screening from assertion to evidence. Real names, photos pending. |
| 3 | **Insight articles** `/insights/{slug}` | **0 built, ~28 linked** | Twenty-eight dead links, and the SEO engine. Publish fewer, better. |
| 4 | **Case studies** `/case-studies/{slug}` | **0 built, 2 linked** | Real names, numbers and roles. Redwheel and the Oracle engagement are the strongest Managed Delivery proof. |
| 5 | **Capability detail** ×6 | **0 built, 6 linked** | Retargeted legacy authority. |
| 6 | **AI talent** `/talent/ai` | Not planned | The flagship category page; hosts the AI Talent Atlas. |
| 7 | **Intelligence hub** `/intelligence` | Not planned | Home for Blueprints, the Atlas and insights. 301 target for `/white-papers/`. |
| 8 | **Programme Staffing Blueprint** ×N | Not planned | Gated. The primary lead engine. |
| 9 | **L2 function pages**, remaining 5 sectors | Retail only (20) | Per D12 — enrich the existing twenty first; add sectors only where search demand justifies it. |
| 10 | **Regional** `/middle-east`, `/europe` | Not planned | The corridor proposition and local SEO. |

---

## 9. Phase 4 — the visual brief

Concrete, because the diagnosis is concrete.

1. **One accent.** Retire the six per-sector hues in `globals.css` Layer 1. Keep yellow/amber as the single brand accent. If sector differentiation is needed, use a single-channel device — a tint of the accent, or a monochrome sector glyph — never a different hue. Brand recall depends on the colour being the same on every page.
2. **New type pairing.** Plus Jakarta Sans with DM Mono is the default of every 2024 SaaS template. Choose a display face with actual character and one workhorse for body. Two faces, not three. Drop the mono labels — they are borrowed console grammar.
3. **Leave the dark glassmorphism behind.** It is saasinator's register, and it is the main reason Yallo Talent reads as derivative of its sibling. A talent business selling to CHROs and programme directors should not look like a developer product.
4. **One structural signature.** The single memorable form that a competitor cannot copy by changing colours. Candidates to explore: the *assessed bench* made visible as an object; the brief-to-shortlist calibration mechanism as a real device rather than a four-step row; or the corridor itself rendered as structure. One, executed hard, appearing on every page type.
5. **Purpose-built visuals replace every Unsplash hotlink.** Currently every hero, card and segment image is a remote `images.unsplash.com` URL — the same generic register the competitors use, plus a third-party production dependency.
6. **A restraint rule.** A maximum section count per page type, and an explicit rule that the page ends. The retail L1's ten anchor-nav sections are inventory, not experience.
7. **Kill the borrowed saasinator grammar.** The `›sound like your week?` prompt and the numbered 01–05 role selector with "in their words" go.
8. **Write `DESIGN_SYSTEM.md`.** The empty stub is the upstream cause of both the seven-accent palette and the hero-copy-as-taxonomy-label bug. The token architecture is good; the intent behind it must be recorded.

---

## 10. Proof and intelligence assets

### 10.1 Proof

| Asset | Treatment | Watch-out |
|---|---|---|
| **Named consultants** | First-class page type plus faces beside the screening claim. Each carries specialism, platforms, region and a direct contact route. | **[REC]** Never invent people — the current build's role-only placeholders are the right pattern. Launch with real names and specialisms even without photos. Needs a named owner; a stale team page is worse than none. |
| **Named client logos** | Promote from decoration to argument — group by programme type, pair each with the work done. | **[⚠]** Many enterprise MSAs restrict logo use. They are already displayed, so either consent exists or it is an unmanaged risk. **[REC]** written consent on file per client before relaunch. |
| **Real placement metrics** | A metrics block with an explicit "as at [date]" and a quarterly refresh owner. Values must render server-side. | **[⚠]** Every figure needs one auditable definition. "Successful placements" must mean exactly one thing. |
| **Case studies** | Rebuild with real names, numbers and roles. **Redwheel and the Oracle Consulting engagement are the strongest Managed Delivery proof** — subject to consent, and the Oracle one only if the white-label relationship can be described without breaching it. | Anonymised cases persuade nobody at enterprise scale. |

### 10.2 The Programme Staffing Blueprint — the flagship

Not "what does an SAP consultant earn". Instead: **what it actually takes to staff a transformation programme.** One per archetype — S/4HANA rollout, Oracle Fusion implementation, Workday deployment, Salesforce multi-cloud, Blue Yonder supply chain — each carrying team shape role by role and phase by phase; a scarcity index per role in-region from LinkedIn Talent Insights; realistic time-to-hire per role from Vincere history; rate bands framed as planning inputs rather than a price list; and the roles that always get under-scoped.

**Why it beats a salary guide.** It is a programme-planning and procurement tool, so it reaches the programme director, CIO and PMO at business-case and mobilisation stage — before a supplier is chosen. Naturally gated. Repeatable per programme type, each a distinct SEO surface with no incumbent. And directly downstream of the contract-led positioning. Nobody publishes it because it needs both placement data and programme knowledge, and Yallo has both.

**[⚠] Licensing.** LinkedIn Talent Insights terms typically restrict external redistribution of derived data. Verify what the licence permits before publishing anything sourced from it. Vincere data is yours.

### 10.3 The AI Talent Atlas

The role taxonomy already on the legacy homepage, turned into a reference work: for each role, what it does, how you screen for it, what it commands, how scarce it is in-region, and which roles did not exist eighteen months ago. Published open, not gated — its job is category ownership and inbound authority.

**[REC]** The salary guide survives as a **by-product** of the Blueprint data, published later, positioned as table stakes.

---

## 11. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Site ships with ~40 dead internal links | **Blocker** | Defect B2 — gate behind a `published` flag now, build per §8. Add a CI check asserting every internal href resolves. |
| Placeholder host gets indexed before cutover | **Blocker** | Defect B6 — `noindex` today, env-driven `SITE.url`. |
| Published statistics unsourced or misstated | **Blocker** | Defect B5 — remove or source; make `source` a required field on any stat type. |
| Talent-positioned page inside a Group-positioned shell | Fatal if it recurs | Already resolved in the new build — nav, footer and meta are Talent-only. Do not regress at cutover. |
| Organic traffic collapse on relaunch | High | §7 redirect map executed before cutover, with pre/post rank tracking. |
| Two owners pushing one `main` | High | R13 — formal handover; team contributes by PR only. |
| Sumeet becomes the bottleneck; site eats the quarter | High | Fixed go-live gate and date; canon locked before page editing so decisions are not relitigated. |
| Managed Delivery collides with saasinator | High | D6 boundary rule in canon, with the routing test. |
| Borrowed saasinator visual grammar reads as pastiche | High | §9 — Phase 4 delivers Talent's own signature. |
| Client logo consent undocumented | High | Written consent on file per client. |
| Fixed-price delivery risk on Managed Delivery | High (commercial) | SOW discipline, named delivery owner, margin governance, concurrency cap. |
| Thin programmatic content at scale | Medium (was High) | D12 — twenty gated L2 pages exist, not 120. Enrich rather than generate. |
| LinkedIn Talent Insights licence prohibits republishing | Medium | Verify before building the Blueprint on it; Vincere is the fallback. |
| CI floor incomplete — no tests | Medium | Defect H9/H10 — add a `test` script, run Playwright, align Node 22 / pnpm 10. |
| Articles published under Sumeet's byline that he did not write | Medium | Defect H6 — confirm authorship policy before publishing. |
| Contract growth outruns working capital | **Monitor** | R12 — covered at current growth. Revisit if the contract book doubles. |

---

## 12. Operating model

**Sumeet owns and builds.** Canon ratification, positioning, design direction and sign-off; content and copy; all page and component work in the repo via Claude Code.

**Claude (Chat lens) holds** canon and the decision register, design direction and critique, copy drafting, competitive and market research, defect triage, and review of what comes out of Claude Code.

**Raphy's pod owns** saasinator.ai and Yallo AI Academy (GTM.03), plus these discrete Yallo Talent dependencies, specified as requests rather than shared editing:

| Dependency | Why it stays with the team |
|---|---|
| DNS and the yallo.co cutover | Registrar and hosting account access |
| WordPress decommissioning | Server and account access |
| Brief-form backend — Resend keys, deliverability, spam protection, handoff into Vincere | Production secrets and integration work |
| Volcanic `/jobs` punchout wiring | Third-party platform credentials |
| GitHub branch protection and repo settings | Org admin |
| Redirect map deployment | Executed with the cutover |

**First actions on transfer:** rewrite `AGENTS.md` for the new ownership and drop the single-author commit rule; convert `docs/architecture/*.html` to markdown at `spec/` (and fix the `exicution` / `deisgns` / embedded-space filename typos); close the CI floor.

---

## 13. Open items

1. **Yallo Talent canon** — the whole of it. Phase 2, pending ratification.
2. **Fee and rate transparency** — saasinator's no-pricing rule does not bind yallo.co. **[REC]** publish an engagement-model page without numbers; rate bands live inside the Blueprint, where they are a planning asset rather than a negotiating position.
3. **Consultant roster** — Sumeet to collate current and past team.
4. **Client logo consent** — Sumeet or Operations to confirm what is on file.
5. **Metric definitions** — Sumeet or TAL.01 to define "successful placements" and the rest, auditably.
6. **LinkedIn Talent Insights licence** — verify redistribution rights.
7. **Redwheel and Oracle Consulting case-study consent.**
8. **Insight article authorship policy** — what may carry Sumeet's byline.
9. **academy.yallo.co** — sub-domain versus standalone domain. Deferred, GTM.03.
10. **GTM.02's project description** — still carries the superseded horizontal-CMS framing; new text supplied separately.
11. **Go-live date** — to be set. The gate is already defined in `AGENTS.md`.
