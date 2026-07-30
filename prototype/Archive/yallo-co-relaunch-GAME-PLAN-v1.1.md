# yallo.co Relaunch — Game Plan

**Version 1.1 · 29 July 2026 · Project GTM.01 — Websites — Product Build**
Owner: Sumeet Goenka · Delivery: GTM Apps pod (Raphy) · Status: **plan ratified, canon not yet ratified**

*Changes from v1.0: geography reframed as a Europe–Middle East corridor (§3.3); "Middle East" ratified as the regional term and "GCC" banned (§3.3); Managed Delivery added as a fourth pillar with a saasinator boundary rule (§3.2); competitive field corrected against research (§4); full page-level retain/retarget/retire inventory added (§6); inner-page scope and build order added (§7); salary guide demoted and replaced by the Programme Staffing Blueprint (§8); Next.js decoupling and edge-split migration plan added (§9); working-capital risk downgraded.*

Convention: UK English · "Yallo" capital Y only · "saasinator" lowercase always.
Tags: **[RATIFIED]** locked · **[DECIDED]** taken under delegated authority, Sumeet may veto · **[FACT]** sourced · **[ASSUMPTION]** working assumption · **[REC]** recommendation · **[⚠]** verify before publish.

---

## 1. Purpose, scope, audience

**Purpose.** One methodical plan for relaunching yallo.co as a dedicated Yallo Talent property — replacing the legacy Yallo Group site, superseding the team's `/home-4/` work-in-progress, and decoupling from WordPress onto the golden path.

**Scope — in.** Positioning and canon, information architecture, visual system, homepage, the priority inner pages, the page-level retain/retarget/retire decision, proof and intelligence assets, SEO and URL migration, platform decoupling, handover to the build.

**Scope — out.** The job board platform itself (Volcanic and its replacement), Talent Engine (CORE.03), the Hub pillar-reporting lens (CORE.02), Academy content (GTM.03), yallogroup.com, and Design System extraction (deferred behind shipping the sites).

**Audience.** Sumeet as ratifying authority; Raphy's pod as the build team; a future session reconstructing context without this conversation.

---

## 2. Decision register

### 2.1 Ratified by Sumeet

| # | Decision | Consequence |
|---|---|---|
| R1 | **One vertical, one site.** yallo.co = Yallo Talent; saasinator.ai = saasinator AI; academy.yallo.co = Yallo AI Academy. | Every non-Talent element of the legacy site is stripped: TS/EA as a Service, Managed IT CoE (as consulting), the strategy proposition, "Strategy & Talent Unified". |
| R2 | **yallogroup.com out of scope** until all three verticals are live. | Do not design for it or reserve nav space. |
| R3 | **Client-first, unapologetically.** | Candidates are served by the job board. No top-level "Job seekers" mega panel — one quiet punchout. |
| R4 | **The job board is a separate, swappable surface.** Volcanic + Vincere today; Talent Engine (CORE.03) replaces Vincere; a Volcanic replacement is wanted, targeted **end of 2026, not a current priority**. | Design for swappability now — shared chrome and tokens, independent platform — but do not plan the migration yet. |
| R5 | **"AI talent" is a category to lead, not a service line to list.** | First-order treatment on the homepage. **Claude talent is depth-proof only** — never the site's organising claim. |
| R6 | **Yallo Design System replaces the cross-cutting CMS vision.** Each product carries its own local CMS. | Verticals live first. Not a technology project. |
| R7 | **Do not carry saasinator canon across.** | IRL, SAIF, Glass Factory, "SI for AI", the light/dark duality, the Forge mark, console microsyntax, the no-pricing rule — none hold authority here. |
| R8 | **Proof is publishable:** named client logos, real placement metrics, named consultants. Consultants to be collated from current and past team — **placeholders acceptable at first build**. | Reshapes the design. See §8. |
| R9 | **The triangle is reason-to-believe, not the pitch.** | saasinator and Academy named once, low in the page, in service of the screening claim only. |
| R10 | **Decouple from WordPress.** Standalone GitHub-based build, Claude Code-driven, evolving continuously. | See §9. |
| R11 | **Europe is a real second market**, not a footnote — grounded in Sumeet's UK career, Richemont Switzerland stint and European network. India is supply-side. | See §3.3. |
| R12 | **Working capital is covered** — managed for two to three years, with reserves and bank pipelines in place. | Risk downgraded from High to Monitor. **[ASSUMPTION]** holds at current growth rate; revisit if contract book doubles. |

### 2.2 Taken under delegated authority — Sumeet may veto

| # | Decision | Rationale |
|---|---|---|
| D1 | **Evolve the existing Yallo mark; build an entirely new design system around it.** Wordmark retained, mark refined; typography, palette, layout grammar and structural signature all new and Talent-specific. | The wordmark carries equity you are already paying for — logo wall, ~100k LinkedIn audience, organic footprint. A clean sheet would also pre-empt a group-level decision, forcing the future umbrella to follow Talent or clash with it. Nothing in the current *visual language* is load-bearing. Siblings cohere through shared structure, not shared palette. |
| D2 | **One corridor, not two markets.** Middle East (UAE, Saudi Arabia) leads the IA and SEO surface. Europe is a genuine second surface. India is the supply engine, never presented as a demand market. The proposition is the **corridor**: European enterprises running Middle East programmes, Middle East enterprises needing European delivery standards. | Two co-equal demand markets is not implementable in IA or SEO, and competing head-on in the saturated, IR35-complicated UK contract market is not a boutique's game. The corridor is defensible, uses the London–Dubai–Bengaluru footprint as an asset, and is category-normal — Halian, Whitehall and Forsyth Barnes all run Europe-plus-Middle-East as one estate. |
| D3 | **"Middle East" is the canonical regional term.** "GCC" is banned outright. "Gulf" permitted only as occasional stylistic variant. Name **UAE** and **Saudi Arabia** explicitly; avoid "KSA" in public copy. Use "MENA" only if North Africa is genuinely served. | "Middle East" is what the category and search both use. "GCC" collides with Global Capability Centres in exactly the AI-skills data you would cite, and it excludes markets you may serve. |
| D4 | **Contract, direct to end client, is the lead category.** Permanent is the account-entry and credibility instrument. EOR is an enabler inside contract. **Managed Delivery is the fourth pillar.** | See §3.2. |
| D5 | **The fourth pillar is named "Managed Delivery"** — not subcontracting, not outsourcing. Direct mode is publishable; white-label mode is not. | "Subcontracting" describes your position in someone else's value chain. "Outsourcing" reads 2005 and invites rate comparison with the Indian SIs — the one axis to avoid. |
| D6 | **Boundary rule between verticals:** Yallo Talent Managed Delivery delivers fixed scope **on the client's existing enterprise platforms** with named specialists. saasinator builds **new AI-native systems the client owns**. Platform delivery versus product build. | Without this rule the two verticals collide in front of the same buyer. Routing test: "make our Salesforce work" → Talent. "Replace the thing we rent" → saasinator. |
| D7 | **Stack: Next.js, not Nuxt.** New GitHub repo, CI enforcement floor from day one, WordPress retired at cutover. | saasinator.ai is already on Next.js; the Design System only becomes real if both sites consume the same token and component package. Two frameworks means two component libraries. The golden path already ratifies Next.js. The only legitimate case for Nuxt would be a Vue-native pod, which would then require moving saasinator too. |
| D8 | **The salary guide is demoted from hero asset to by-product.** The flagship intelligence asset is the **Programme Staffing Blueprint**; the AI category asset is the **AI Talent Atlas**. | Salary guides are commodity — Robert Half, Forsyth Barnes, Michael Page and Hays all publish one, and you would be fighting for the same keywords against far higher domain authority. Nobody publishes what it takes to *staff a programme*. See §8. |
| D9 | **Retain and retarget the legacy taxonomy rather than delete it.** Platform, industry and capability URLs keep their authority and change proposition. | See §6. |
| D10 | **Publicly, one proposition with engagement models beneath it** — not four service tiles. | Four tiles fragment the pitch and invite procurement to commoditise each line. |

---

## 3. Strategic frame

### 3.1 The positioning wedge

> **Yallo Talent staffs and delivers enterprise platform programmes across the Middle East and Europe — with named, architect-screened specialists, including the AI talent nobody else can find.**

Four load-bearing elements:

1. **Enterprise platform programmes** — SAP, Oracle, Workday, Salesforce, Blue Yonder. This is where the legacy taxonomy and the existing logo wall already sit, and it is narrower and more defensible than "tech talent".
2. **Named, architect-screened specialists** — the differentiator, now supportable because R8 clears named consultants. It is also the category standard Yallo currently fails: the site makes architect-led screening its central claim while showing zero named humans.
3. **The corridor, in-region** — the thing the Indian SIs are structurally bad at: a named specialist on the ground next week, not a CV from an offshore bench.
4. **AI talent** — the category nobody has claimed. See §3.4.

### 3.2 The four pillars

| Pillar | Role | Published? | Reasoning |
|---|---|---|---|
| **Contract — direct to end client** | **Lead** | Yes, leads the site | Enterprise tech demand arrives programme-shaped and time-boxed. Recurring revenue, extensions compound, and it is the only category where speed-to-shortlist and screening depth genuinely differentiate. Every placed contractor is intelligence on the next five roles. |
| **Permanent** | **Account entry and credibility** | Yes | Place the architect or programme director permanently, then staff the programme on contract. Senior and selective — retained or exclusive, never contingent volume. The boutique play, and the defence against new entrants. |
| **EOR** | **Enabler inside contract** | Yes, as a capability not a tile | Removes the client's excuse — no entity in Saudi Arabia, India, wherever. As a fourth service line it fragments the pitch; as a capability it closes deals and locks in the contractor book. |
| **Managed Delivery** | **The up-market move** | **Direct mode: yes. White-label mode: no.** | Fixed-scope SOW delivery. *Direct* — the Redwheel shape: Salesforce Service Cloud and Marketing Cloud, six to nine months, six or seven consultants and architects, Yallo owning the client. Higher margin, deepens the account, and proves Yallo can be trusted with scope rather than CVs. *White-label* — the Oracle Consulting shape: Fusion customisation, integration and reporting delivered behind the vendor's client-facing front. Commercially valuable, but publishing it tells end clients you serve their SIs, which invites them to route you through the SI. |

**Validation.** Halian runs precisely this shape in this market — permanent, contract, project-based, managed services, RPO and outsourced payroll. The fourth pillar is a proven adjacency here, not a distraction.

**What Managed Delivery demands that staffing does not.** Fixed price transfers delivery and margin risk to Yallo. It needs SOW discipline, a named delivery owner per engagement, and margin governance. This is a different muscle from staffing and should be resourced as such. **[REC]** cap the number of concurrent fixed-price engagements until the discipline is proven.

**Website consequence of a contract-led model.** Hero, proof and CTAs must be **programme-shaped** ("staff your programme", "tell us about your programme") rather than vacancy-shaped ("find talent", "submit a vacancy"). The `/home-4/` draft's "from brief to shortlist in 72 hours" is already a contract motion — the right instinct, wrongly dressed.

**The Hub pillar lens** (CORE.02's build, flagged not designed here). The four-pillar revenue lens is right, with pillar four renamed Managed Delivery. **[REC]** the cross-pillar lenses that actually matter commercially are: **account ownership** (direct versus intermediated — the health metric, because pillar revenue can grow while the business gets structurally weaker if the intermediated share rises); **revenue type** (one-off fee versus recurring margin versus fixed price — predictability and working capital); and **programme concentration** (revenue per client programme — contract-led growth concentrates, and you want to see it). Carry this to CORE.02.

### 3.3 Geography — the corridor

| Market | Role | Site treatment |
|---|---|---|
| **Middle East — UAE, Saudi Arabia** | **Primary demand.** The logo wall is overwhelmingly Middle East enterprise (Landmark, Majid Al Futtaim, Al Tayer, Al Futtaim, Chalhoub). Vision 2030 programme spend and entity friction both concentrate here — and entity friction is exactly what EOR monetises. | Leads the IA, the SEO surface, the case-study set and consultant presence. |
| **Europe — UK first, Switzerland and Western Europe behind it** | **Genuine second demand market**, credential-bearing and network-led. Not a footnote. | A real regional surface with its own case studies. Do **not** compete head-on for generic UK contract keywords. |
| **India** | **Supply engine.** Sourcing and delivery, via Bengaluru. | Named as delivery capability. Never presented as a demand market. |

**The differentiated framing.** Rather than two separate market pitches, lead with the corridor: European enterprises running Middle East programmes need in-region specialists who work to European delivery standards; Middle East enterprises need European and global expertise landed locally. Yallo has entities in London, Dubai and Bengaluru, and the founder has the network on both ends. Nobody owns this positioning.

### 3.4 The AI-talent category — grounded

**[FACT]** The demand signal is unambiguous. ManpowerGroup's 2026 Talent Shortage Survey — 39,000 employers across 41 countries — found 72% reporting difficulty filling roles, with AI skills becoming, for the first time, the hardest of all to find, overtaking traditional engineering and IT. The WEF Future of Jobs work places AI specialists at the top of fastest-growing occupations, around 40% annual growth through 2030. Robert Half's 2026 Dubai salary guide reports an 18% premium on AI engineers.

**[FACT]** The competitive gap is real. The incumbents are investing in **AI *for* recruiting** — Korn Ferry's Intelligence Cloud and KF Nimble with chatbot-based screening; Forsyth Barnes describing AI investment as a way to attract talent; Halian listing AI and machine learning among its managed-services technologies. Their AI *market* commentary comes from generalist practice leaders, not a named AI practice. **Nobody has staked "the firm that places AI talent" as a branded specialism.**

**Raw material already in hand.** The legacy homepage buries a genuinely good AI role taxonomy inside a tab carousel — Agentic AI Developer, Prompt/LLM Engineer, AI Prompt QA & Evaluation Specialist, AI & Ethics Governance Lead, Chief AI Officer, AI Product Manager, MLOps Engineer, AI/GenAI Solution Architect, Generative AI Experience Designer. That is the category-creation asset. Surface it as the **AI Talent Atlas** (§8).

---

## 4. The competitive field — corrected

The v1.0 set was wrong for this market. Corrected against research, July 2026.

| Firm | Shape | Why it matters |
|---|---|---|
| **Halian** | **The head-on competitor.** Founded London 1996, HQ Dubai, offices across Europe, Middle East and USA; Saudi office 2023. Permanent, contract, project-based, managed services, RPO, outsourced payroll, executive search. Dedicated ERP practice — SAP, Oracle, Dynamics, NetSuite, Infor. Publishes Vision 2030 and Dubai/Riyadh tech-role content. | Almost exactly the shape Yallo is building, **including the fourth pillar**. Benchmark and threat simultaneously. Beat them on named-specialist depth, AI-talent category ownership, and the corridor. |
| **Hays Technology** | Powerhouse in Middle East IT contract — DevOps, cloud architects, SAP consultants; reported ~9-day average contract time-to-fill; contractor-care function. | Sets the speed bar. Yallo's "72 hours to shortlist" is a shortlist claim, not a fill claim — do not let the two be conflated in copy. |
| **Robert Half** | Multinational and mid-market tech staffing; separate desks for cybersecurity, ERP and development; publishes a 2026 salary guide with a six-month placement guarantee. | The commodity-salary-guide play, and a risk-reversal mechanism (guarantee) worth studying. |
| **BAC Middle East** | Longest-established UAE recruiter; strong on Dubai government projects. | Government-programme access. |
| **TASC Outsourcing** | Regional outsourcing and staffing at scale. | The nearest thing to a regional Managed Delivery competitor. |
| **Brunel** | Contract and project-based staffing, engineering and energy-weighted, Middle East project operators. | Contract-at-scale mechanics; adjacent sector. |
| **Morgan McKinley** | Financial-services technology, rare skill sets. | BFSI depth. |
| **Whitehall Resources** | SAP specialist recruiter publishing Middle East SAP market analysis. | **Your content and SEO competitor** on platform-talent keywords. |
| **Michael Page, Guildhall, Adecco ME** | Scale generalists and executive search. | IA and conversion-mechanics reference. |
| **TCS, Infosys, Capgemini, Wipro** | Indian SIs doubling as contract staffing. | Never compete on rate or bench depth. Their bench is deep but generic and offshore-weighted; the buyer's pain is a named specialist in-region next week. |
| **Forsyth Barnes** | Retained for *style* reference only — named team page with individual specialisms and direct contacts; Salary Guides in primary nav; contract as a titled function. Dubai only since September 2025; verticals are eTail, FinTech, Sports and Entertainment. | Not a category rival on sector. A useful model for consultant presentation. |

**Phase 1 rubric.** Score each on: IA and nav model · client-versus-candidate handling · proof model · consultant presentation · lead magnets and gating · SEO surface and content cadence · conversion mechanics and risk reversal · engagement-model presentation · visual register · platform and performance.

---

## 5. The phase plan

| Phase | Work | Artefact | Gate |
|---|---|---|---|
| **0 · Teardown** ✅ | Audit of legacy yallo.co, `/home-4/`, and the saasinator reference. Structural diagnosis. | Complete — §6 and §11 | — |
| **1 · Benchmark** | Fixed-rubric teardown of the §4 field. | Benchmark matrix + steal / avoid / own | — |
| **2 · Canon** | Positioning spine, four-pillar taxonomy, ICP roles, proof assets, terminology rules, tone, hard rules. | `yallo-talent-CANON.md` | **Sumeet ratifies** |
| **3 · IA + funnel + SEO** | Sitemap, page-type map, nav, the WHY → WHAT → HOW → PROOF → CTA funnel adapted for a contract-led motion, and the §6 migration map. | `yallo-talent-sitemap-IA-v0.1.md` | **Sumeet ratifies** |
| **4 · Visual system** | Refined mark, new token set, one structural signature — Talent's own. Two directions, one recommendation. | Token sheet + 2 direction comps | **Sumeet picks** |
| **5 · Homepage** | Single annotated self-contained HTML. Content in a typed `SITE` object, blocks named, claims evidence-tagged, accessibility and performance floor enforced. Iterate section by section. | `yallo-talent-home-v*.html` | — |
| **6 · Repo + handover** | Next.js repo scaffolded on the golden path with CI floor, AGENTS.md installed, homepage ported, edge split configured. Four-document handover package. | Repo + handover bundle | — |
| **7 · Inner pages** | Per the §7 build order. | Page templates | — |
| **8 · Migration + cutover** | 301 map executed, WordPress retired, rank tracking pre and post. | Migration log | **Sumeet approves cutover** |

**Immediate, outside the phases — this week:**
1. **Set `/home-4/` to `noindex`.** It is currently `index, follow`, titled "Home 4 - Yallo", with no meta description. A draft is competing with your homepage in search.
2. **Fix the zero counters.** The live site shows "0 + Successful Placements"; the WIP shows "0hrs Brief to Shortlist" and "0 Delivery Regions". Make the real figure the static fallback so animation failure degrades gracefully.
3. **Canonicalise the broken and duplicate paths** listed in §6.3 before any migration, or you migrate the mess.

---

## 6. Page inventory — retain, retarget, retire

### 6.1 Retarget — keep the URL and its authority, change the proposition

| Legacy URL | Becomes | Note |
|---|---|---|
| `/platforms/sap/` `oracle/` `microsoft/` `salesforce/` `blueyonder/` `workday/` | **Platform talent pages.** "SAP talent for Middle East programmes", etc. | **Highest-value retarget on the site.** These are your deepest existing authority and they map exactly onto the contract-led wedge. |
| `/platforms/*/expertise/` | 301 into the parent platform page | The overview/expertise split is thin duplicate content and dilutes the parent. |
| `/industries/{retail, manufacturing, finance, government, healthcare, telco}/` | **Industry talent pages** | Sector hiring demand, not sector consulting. |
| `/industries/*/expertise/` | 301 into the parent | As above. |
| `/capabilities/{data, digital, cloud, cybersecurity, integration, innovation}/` | **Discipline talent pages** | Already close to the specialised-talent taxonomy on the current homepage. `/capabilities/data/` → "Data & AI talent". Re-title and re-scope; keep the URLs. |
| `/managed-it-coe/` | **`/managed-delivery`** (301) | Do not retire this. It is the closest existing content to the new fourth pillar, and it is the category Redwheel actually bought under. |
| `/talent-in-a-box/` | 301 to the contract-staffing engagement page | The name dies — product-y, and it undersells enterprise contract work — but the URL likely carries rankings. |
| `/leadership-team/` | **`/team`** — the consultant page type | Promote from an about-us afterthought to a first-class, load-bearing page. |
| `/why-yallo/` | Retain URL, rewrite entirely | Currently carries the consulting/hybrid argument. |
| `/insights/*` | **Retain wholesale**, audited individually | "The Hidden Cost of Slow Tech Hiring in Large Enterprises" is exactly on-message. Retail-technology-investment pieces are consulting-shaped — 301 the ones that do not serve a talent buyer. |
| `/case-studies/*` | Retain structure, rebuild content with real names | Also fix the `?case-study=` query-string pattern into proper paths. |
| `/about-us/`, `/contact-us/` | Retain, rewrite | Contact becomes programme-shaped. |

### 6.2 Retire — 301 and delete

| Legacy URL | Redirect target | Why |
|---|---|---|
| `/tsea-as-a-service/` | `/how-we-work` | TS/EA consulting is out of scope entirely (R1). |
| `/white-papers/` | `/intelligence` | Folds into the new intelligence hub. |
| `/home-4/` | `/` at cutover; `noindex` immediately | Draft. |
| "Job seekers" mega panel, `/join-yallo/`, `/users/login` | Out of primary nav | R3. Keep `/join-yallo/` as a single CV route reachable from the board, not the marketing IA. |

### 6.3 Fix before migrating — broken and duplicate paths live today

`/industries/retail//` (double slash) · `/industries/consumer-retail/` (duplicate of retail) · `/technologies/sap/` versus `/platforms/sap/` (two paths, one page) · `/talent-ina-box/` · `/tsa-as-a-service/` · `/join-us/` versus `/join-yallo/` · industry cards linking to the wrong pages (Healthcare pointing at `/capabilities/innovation/`, Microsoft pointing at `/industries/retail//`, Workday pointing at Blue Yonder). Canonicalise, then migrate.

### 6.4 Rules for the migration

1. **Never 301 to the homepage.** Search engines treat that as a soft 404. Every retired URL goes to its nearest talent equivalent.
2. **One canonical per concept.** The overview/expertise duplication and the platforms/technologies fork both die.
3. **Rebuild the comparison table as accessible markup.** The legacy "Beyond Recruitment. Beyond Consulting." table renders its ticks as images — an accessibility failure. The *idea* is a strong sales asset and survives; the axis changes from Recruitment/Consulting/Yallo to something contract-relevant, and it must be real markup.
4. **Track ranks before and after.** Baseline the top 50 ranking URLs pre-cutover.

---

## 7. Inner-page scope and build order

Built after the homepage is proven, in this order. Each is a page *type*, not a one-off.

| # | Page type | Routes | Why this priority |
|---|---|---|---|
| 1 | **Consultant / team** | `/team`, `/team/{slug}` | The single highest-leverage addition. Converts "architect-led screening" from assertion to evidence, and it is the category standard Yallo currently fails. Placeholders acceptable at first build (see §8). |
| 2 | **Engagement models** | `/how-we-work` | Contract leads; permanent and EOR beneath. One proposition, models underneath — not four tiles. |
| 3 | **Managed Delivery** | `/managed-delivery` | The fourth pillar, direct mode only. 301 target for `/managed-it-coe/`. |
| 4 | **Platform talent** ×6 | `/platforms/{platform}/` | Retargeted, existing authority, core to the wedge. |
| 5 | **AI talent** | `/talent/ai` | The flagship category page. Hosts the AI Talent Atlas. |
| 6 | **Intelligence hub** | `/intelligence` | Home for the Blueprints, the Atlas and insights. Replaces `/white-papers/`. |
| 7 | **Programme Staffing Blueprint** ×N | `/intelligence/blueprint/{programme}` | One per archetype. Gated. The primary lead engine. |
| 8 | **Case studies** | `/case-studies/{slug}` | Real names, real numbers, real roles. |
| 9 | **Discipline talent** ×6 | `/capabilities/{discipline}/` | Retargeted. |
| 10 | **Industry talent** ×6 | `/industries/{industry}/` | Retargeted. |
| 11 | **Regional** | `/middle-east`, `/europe` | The corridor proposition and local SEO. |
| 12 | **Brief submission** | `/contact` | The primary conversion surface. Programme-shaped: "tell us about your programme", not "submit a vacancy". |
| 13 | **Jobs punchout** | `/jobs` | One quiet route to the board. Wears the site's chrome and tokens. |

---

## 8. Proof and intelligence assets

### 8.1 Proof

| Asset | Treatment | Watch-out |
|---|---|---|
| **Named consultants** | First-class page type plus faces on the homepage beside the screening claim. Each consultant carries a specialism, platforms, region and a direct contact route. | **[REC]** Do not launch with invented placeholder humans — a fabricated headshot discovered is a trust catastrophe. Launch with **real names and specialisms even without photos**, and mark photo slots as pending in-code. Needs a named owner: a stale team page is worse than none. |
| **Named client logos** | Promote from decoration to argument — group by programme type, pair each with the work done. | **[⚠]** Many enterprise MSAs restrict logo use. They are already displayed today, which means consent exists or it is an unmanaged risk. **[REC]** written logo-use consent on file per client before relaunch. |
| **Real placement metrics** | A metrics block with an explicit "as at [date]" and a quarterly refresh owner. | **[⚠]** Every figure needs one auditable definition. "Successful placements" must mean exactly one thing. Undefined metrics lose procurement conversations. |
| **Case studies** | Rebuild the two WIP cases with real names, numbers and roles. **Redwheel and the Oracle Consulting engagement are the two strongest Managed Delivery proof points** — subject to consent, and the Oracle one only if the white-label relationship can be described without breaching it. | Anonymised cases persuade nobody at enterprise scale. |

### 8.2 The Programme Staffing Blueprint — the flagship asset

Not "what does an SAP consultant earn". Instead: **what it actually takes to staff a transformation programme.** One Blueprint per archetype — S/4HANA rollout, Oracle Fusion implementation, Workday deployment, Salesforce multi-cloud, Blue Yonder supply chain — each carrying:

- **Team shape** — role by role, seniority by seniority, FTE count, phase by phase
- **Scarcity index** per role in-region, from LinkedIn Talent Insights
- **Realistic time-to-hire** per role, from Vincere placement history
- **Rate band ranges**, framed as planning inputs rather than a price list
- **The roles that always get under-scoped** — the ones that sink programmes

**Why this beats a salary guide.** It is a programme-planning and procurement tool, so it reaches the programme director, CIO and PMO at business-case and mobilisation stage — before a supplier has been chosen. It is naturally gated. It is repeatable per programme type, each one a distinct SEO surface with no incumbent. And it is directly downstream of the contract-led positioning rather than orthogonal to it. Nobody publishes this because it requires both placement data and programme knowledge, and Yallo has both.

**[⚠] Licensing.** LinkedIn Talent Insights terms typically restrict external redistribution of derived data. **Verify what the licence permits before publishing anything sourced from it** — this is a real constraint, not a formality. Vincere data is yours.

### 8.3 The AI Talent Atlas — the category asset

The role taxonomy already on the legacy homepage, turned into a reference work: for each role, what it actually does, how you screen for it, what it commands, how scarce it is in-region, and which roles did not exist eighteen months ago. Published open, not gated — its job is category ownership and inbound authority, not lead capture.

**[REC]** The salary guide survives as a **by-product** of the Blueprint data, published later and positioned as table stakes rather than the flagship.

---

## 9. Platform — decoupling from WordPress

**Target:** Next.js + TypeScript + Tailwind + pnpm + current Node LTS, per the golden path, in a new GitHub repo with the CI enforcement floor (lint, type-check, tests on every PR; `main` protected) from the first commit. AGENTS.md installed. Claude Code-driven, iterating continuously.

**Not a migration — a clean rebuild.** Do not attempt to lift Slider Revolution markup. What migrates is **URLs and content**, never markup. Content goes into a typed data layer; WordPress is retired at cutover.

**[REC] Ship incrementally via an edge split, not a big-bang cutover.** Point the domain at the new app and configure path-based rewrites so the Next.js app serves rebuilt routes while WordPress continues serving the rest, until nothing is left on it. With roughly forty-plus indexed legacy pages this materially de-risks the relaunch: you ship the new homepage in weeks rather than holding it until every inner page is rebuilt, and organic position degrades nowhere.

**Order of operations:** repo and CI → homepage ported → edge split live with the new homepage → inner pages per §7, each flipping from WordPress to Next.js as it ships → 301 map executed → WordPress decommissioned.

---

## 10. The job board seam

Volcanic (Access Group) plus Vincere today. Talent Engine (CORE.03) replaces Vincere; a Volcanic replacement is wanted, **targeted end of 2026 and explicitly not a current priority** — the existing board works, and standing up three verticals is the higher-value effort.

Two design constraints follow now, cheaply:

1. **Shared chrome and tokens, independent platform.** The board wears the marketing site's header, footer and design tokens so replacement is a re-skin. Extract those as a versioned, consumable theme package rather than duplicating CSS.
2. **One punchout, not a mega panel.** Per R3, candidates get a single quiet route to `/jobs`.

**[REC]** Treat the board as the first external consumer of the Yallo Design System token package. That makes the Design System real without turning this into a technology project.

---

## 11. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Talent-positioned page ships inside a Group-positioned shell | **Fatal** | Nav, mega menu, footer, meta and tagline rebuilt *with* the page. Non-negotiable gate on Phase 5. |
| Organic traffic collapse on relaunch | High | §6 migration map plus the §9 edge split, executed before cutover, with pre/post rank tracking. |
| Managed Delivery collides with saasinator in front of the same buyer | High | D6 boundary rule ruled into canon, with an explicit routing test. |
| Borrowed saasinator visual grammar reads as pastiche | High | Phase 4 delivers Talent's own structural signature. No `›` prompts, no console microsyntax, no numbered technical eyebrows. |
| Client logo consent undocumented | High | Written consent on file per client before relaunch. |
| Fixed-price delivery risk on Managed Delivery | High (commercial) | SOW discipline, named delivery owner, margin governance, concurrency cap until proven. |
| LinkedIn Talent Insights licence prohibits republishing | Medium | Verify before building the Blueprint on it; Vincere data is the fallback. |
| Metrics undefined or unrefreshed | Medium | Definitions published, "as at" date visible, named quarterly owner. |
| Consultant page ships with placeholder humans and is noticed | Medium | Real names without photos; no invented people. |
| Two frameworks fragment the Design System | Medium | D7 — Next.js on both sites. |
| Contract growth outruns working capital | **Monitor** (was High) | R12 — covered at current growth. Revisit if the contract book doubles. |

---

## 12. Boundaries and open items

**Boundaries.** Methodology → PRC.02. Academy and academy.yallo.co → GTM.03. Design System / CMS platform → GTM.02. Talent Engine and candidate-sourcing apps → CORE.03. Hub pillar-reporting lens → CORE.02. Live recruiting operations → TAL.01. Talent GTM execution → TAL.02, ABM in GTM.13. Pod scope → Raphy. Positioning, taxonomy and category definitions → Sumeet.

**Open items.**

1. **Yallo Talent canon** — the whole of it. Phase 2, pending ratification.
2. **Fee and rate transparency** — unresolved and needs a canon decision. **[REC]** publish an engagement-model page without numbers; rate bands live inside the Blueprint, where they are a planning asset rather than a negotiating position.
3. **academy.yallo.co** — sub-domain versus standalone domain. Deferred, not blocking.
4. **Consultant roster** — Sumeet to collate current and past team. Blocks page type 1 going live with real content.
5. **Client logo consent** — Sumeet or Operations to confirm what is on file.
6. **Metric definitions** — Sumeet or TAL.01 to define "successful placements" and the rest, auditably.
7. **LinkedIn Talent Insights licence** — verify redistribution rights.
8. **Redwheel and Oracle Consulting case-study consent** — the two strongest Managed Delivery proof points.
