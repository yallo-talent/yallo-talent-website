# Yallo Talent — Combined Implementation Relay

**29 July 2026 · For the Claude Code session · Project GTM.01**
Owner: Sumeet Goenka. Supersedes and merges every earlier relay from the Chat-lens design session.

---

## 0. Read these first

Upload and read before writing any code:

| File | What it is |
|---|---|
| `SESSION-STATE-and-DESIGN-CANON.md` | The authoritative canon: tokens, positioning, taxonomy, terminology, metrics, proof model |
| `yallo-talent-home-v0.3.html` | Homepage design prototype. **A starting point, not a specification** |
| `yallo-talent-home-v0.2.html`, `v0.1.html` | Earlier iterations, kept for the reasoning trail |
| `yallo-talent-design-directions-v0.1.html` | The two directions that were considered |
| `yallo-co-relaunch-GAME-PLAN-v1.2.md` | Programme plan, phases, redirect map |
| `yallo-talent-build-review-and-defect-register-v1.0.md` | Defect register against the current build |
| `yallo-talent-phase1-benchmark-v1.0.md` | Competitor benchmark and the homepage funnel it implies |
| `yallo-talent-content-authoring-guide-v1.0.md` | How content gets published after go-live |
| `yallo-talent-repo-and-asset-protocol-v1.0.md` | Branch discipline, asset locations, taxonomy reconciliation |
| `Client_Logos.zip` | 47 logo files |
| `AGENTS.md`, `docs/architecture/*.html`, `docs/deisgns/*` | Raphy's original build documentation |

Also read the existing codebase properly before changing it. `src/data/l1/*`, `src/components/blocks/*`, `globals.css`, `nav-config.ts` and `docs/architecture/arc_v10.html` contain a lot of good thinking.

---

## 1. Use impeccable at full capacity, from the start

This is not a light-touch QA pass. Run the skill as it is designed to be run.

| Order | Command | Purpose |
|---|---|---|
| 1 | `/impeccable init` | Write `PRODUCT.md`. Product truth is in §4 below and in the canon file |
| 2 | `/impeccable document` | Write `DESIGN.md` from the current codebase **and** the v0.3 prototype, reconciling both. `docs/deisgns/DESIGN_SYSTEM.md` is an empty stub and should be superseded |
| 3 | `/impeccable shape` | Plan the homepage and the theme system before implementing |
| 4 | implement | Per §5 to §11 |
| 5 | `/impeccable critique` | Per page type. Fix what it raises |
| 6 | `/impeccable typeset` · `layout` · `bolder` | Wherever the critique scores low |
| 7 | `/impeccable adapt` | Responsive behaviour to 360px |
| 8 | `/impeccable audit` | WCAG 2.2 AA, Lighthouse Mobile 90+, LCP under 2.5s, CLS under 0.1, INP under 200ms |
| 9 | `/impeccable polish` | Final pass |

**Mode: Persuade** for every public marketing surface. Keep the hooks on.

---

## 2. The design direction is open, not frozen

`yallo-talent-home-v0.3.html` is an initial prototype produced in a chat session without access to the codebase, real assets or a rendering loop. Treat it as **direction and intent**, not as a specification to copy.

You are expected to improve on it. Specifically you have licence to:

- Change layout, rhythm, spacing and section internals wherever impeccable's critique says the prototype is weaker
- Introduce motion, interaction and micro-detail the prototype could not carry
- Replace any drawn graphic with something better executed
- Reorder or merge sections if the funnel logic in the benchmark still holds
- Reject a prototype decision outright if you can argue it against the canon

What is **not** open, because it is ratified business canon rather than design opinion:

- The positioning wedge, four pillars and the Managed Delivery naming
- Geography order and terminology: Middle East first, "GCC" banned, Bengaluru not Bangalore
- The four published metrics and their definitions. No database-size claim
- The commitment terms. Real contractual terms only, never invented guarantees
- Client-first IA. No candidate content in the buyer path, one quiet Jobs punchout
- Named clients limited to the confirmed list in §9
- No stock photography, and no invented people, quotes, metrics or case studies

---

## 3. Preserve the best of the existing build

Raphy's build is strong and a lot of it should survive. Audit it deliberately and carry forward what is better than the prototype. Named candidates:

**Keep outright**
- The typed content model: `L1PageData`, `L1ExpertiseCard`, `L2Tool`, `L1ScarceRole`, `L1Segment`, with their documented field contracts
- The two-layer token architecture and the `.claude/hooks/check-colours.js` enforcement that raw hex lives in exactly one file
- `AGENTS.md` discipline: locked decisions, fixed phase order, the self-imposed performance and accessibility gate
- The content rules from `docs/architecture/`: *stop describing tools, deploy talent*. The never-write list. The H1 formula
- L2 generation gated on data presence, so real pages exist rather than thin ones
- Role-dominant cards with the vendor mark as a small reference badge
- The sticky L2 sidebar doing navigation and coverage credibility at once
- The GA4 event layer: `contractor_request`, `role_pill_click`, `bench_signal_view`
- Zod validation, Resend, sharp, Playwright, `robots.ts`, `sitemap.ts`
- The retail L1's twenty function areas with scarcity-flagged roles. Nobody in the category matches that depth

**Design elements from the current build that are better than the prototype and should be carried in**
- The numbered step cards with large ghost numerals, icon tiles, a connector line and inline badges. The prototype's version of this is derived from it and Raphy's execution is stronger
- The tabbed engagement panel with a media pane, "right for" chips and a per-model metric callout
- The sector cards with pill tags and a featured-sector treatment
- The persona hover mechanic in `TheProblem.tsx`, including its keyboard handling
- The overall confidence of the dark register

Where the prototype and the existing build disagree on execution quality, prefer the better-executed one and record the choice in `DESIGN.md`.

---

## 4. Product truth for `PRODUCT.md`

Yallo Talent staffs and delivers enterprise platform programmes across the Middle East and Europe, with specialist-screened people, including AI talent.

Buyers: Delivery Director, Head of Talent Acquisition, PMO Director, VP Engineering, Practice Lead, CIO, procurement. Not candidates.

Four pillars: Contract direct to end client leads. Permanent is account entry. Employer of Record is an enabler inside contract. Managed Delivery is fixed-scope work on the client's existing platforms.

Markets in priority order: Middle East (UAE, Saudi Arabia), Europe (UK first), India (Global Capability Centre staffing for multinationals, de-prioritised but real). Four entities: London, Dubai, Riyadh, Bengaluru.

Primary conversion: a programme brief, not a vacancy. Secondary: the gated Programme Staffing Blueprint.

---

## 5. Theme system: light and dark as equals

Raphy's build is dark and it works. The prototype is light. Both should exist as first-class themes.

1. **Tokenise both fully.** Every colour resolves through a semantic token. Neither theme is an inversion of the other. `ThemeToggle.tsx` already exists; extend it rather than replacing it.
2. **Light tokens** are in `SESSION-STATE-and-DESIGN-CANON.md` §2. **Dark tokens** derive from the existing `globals.css` dark layer, with the contrast corrections in §6 below applied.
3. **A build-time default plus a user toggle.** Expose the site-wide default as an environment variable or a single config constant so it can be switched without touching components. The user toggle persists to `localStorage` and respects `prefers-color-scheme` on first visit.
4. **Both themes must pass the audit independently.** WCAG 2.2 AA on every surface in both.
5. **Section-level band inversion stays.** Within either theme, evidence and data surfaces may invert to the opposite ground. Rule: inversion signals content type, never decoration, and no page carries more than two inverted bands.

---

## 6. Palette: gold leads, functional colour returns

One brand accent was the right call against seven decorative sector hues. It is the wrong call if it leaves nothing to encode meaning with. So:

**Brand accent, unchanged:** gold `#d4a843`, deep `#9d7818`. This is the mark colour and it carries brand recall. It stays the only colour used decoratively, and it appears on every page.

**Functional palette, new.** A small set used **only where colour carries information**, never as decoration and never as a per-sector brand tint. Derive tone from the saasinator family so the properties read as siblings, then shift saturation and value so Talent is not a clone:

| Role | Reference | Used for |
|---|---|---|
| Signal / heat | saasinator plasma `#ff6b47` | Scarcity and criticality indicators, "hard to fill" flags |
| Information | saasinator current `#3d9be9` | Data series, in-region availability, neutral status |
| Positive | saasinator growth `#4e9a5c` | Renewal rate, filled seats, met milestones |
| Category | saasinator arc `#c45e9e` | Optional fourth series where three are not enough |

Rules: any single view uses at most three functional colours at once. Functional colour never appears in navigation, buttons, headings or backgrounds. Every functional colour has an equivalent non-colour signal, a label or an icon, so meaning never depends on hue alone. Both themes need their own tuned values for AA contrast.

Let impeccable settle the final values and document them in `DESIGN.md`.

---

## 7. Taxonomy, geography and terminology corrections

These were specified in an earlier relay that was never run. Apply them all.

**Capabilities.** Replace the current six slugs with:
`data-analytics` (renamed from `data-ai`) · `cloud-infrastructure` · `cybersecurity` · `integration-middleware` · `devops-platform-engineering` (renamed from `digital-devops`) · `testing-quality-engineering` (new, replaces `emerging-technologies`).

- Rename `src/data/capabilities/data-ai.ts` to `data-analytics.ts`, update slug and registry key.
- AI-specific content inside it moves verbatim to `src/data/pending/ai-talent-source.ts` as source material for `/ai-talent`. Trim `data-analytics.ts` to data engineering, analytics, BI and migration.
- `emerging-technologies` retires. `devops-platform-engineering` and `testing-quality-engineering` have no seeds yet: add with `published: false` and render non-interactive.
- In `nav-config.ts`, the capability column lists AI first pointing at `/ai-talent`, then the six above.
- 301 in `next.config.ts`: `data-ai` and `data` to `data-analytics` · `digital-devops` and `digital` to `devops-platform-engineering` · `cloud` to `cloud-infrastructure` · `integration` to `integration-middleware` · `innovation` and `emerging-technologies` to `/ai-talent`.

**Platforms.** Six, in this order everywhere: **SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.** Microsoft means Azure and Dynamics 365 explicitly and needs equal depth to Oracle, because Yallo is a Microsoft house. Rename slug `blueyonder` to `blue-yonder` everywhere with a 301. ServiceNow and AWS come out of the platform set; AWS folds into `cloud-infrastructure`.

**Navigation.** Five outward-facing items: **Specialisms · Industries · How we work · Evidence · Intelligence**, then a quiet Jobs text link and Start a brief as the only button. Delete `jobSeekersGroup` and its dropdown. Move Leadership under Evidence. Remove the `hue` field from `NavItem`. Remove `image` and `imageAlt` from `NavFeatured` and from the component: the About panel currently pairs the name "Sumeet Goenka" with a stock photograph of an unrelated person. Add `published?: boolean` to `NavItem`, rendering non-interactive where false.

**Geography and terminology sweep** across all of `src/` and `content/`, including meta descriptions, JSON-LD and alt text:
- "GCC" becomes "Middle East", or name the country. Never "KSA" in public copy. Includes slugs and ids.
- "UK · ME · India" in any order becomes "Middle East · Europe · India".
- Remove any copy presenting India only as delivery or supply. India is a de-prioritised demand market; the correct framing is Global Capability Centre staffing for multinationals.
- Delete the "3 delivery regions" claim. Four entities, three demand markets.
- Add **Riyadh** to the footer locations and to `LocalBusiness` JSON-LD for all four entities.
- Bengaluru, not Bangalore.
- Pillar four is **Managed Delivery** only. "Subcontract" and "subcontracting" never appear in public copy.
- saasinator is live at saasinator.ai. Fix the "Launching soon" label and the `#` sibling links.

---

## 8. Homepage

Rebuild `src/app/page.tsx` against the funnel in the Phase 1 benchmark §7, using v0.3 as the starting layout. Section order:

Hero · LogoRail · TheGap · Metrics · TheScreen · RoleCoverage · Commitment · Engage · WherePlace · AITalent · Evidence · Intelligence · Close

Delete: `HeroSlider`, `WhatWeDo`, `WhereWePlace`, `OurPartners`, `TalentBridge`, `WhyYallo`, `YalloFamily`. Wire `Metrics.tsx`, which is currently imported nowhere. Move every string into `src/data/`.

Requirements:
- **Hero.** Single frame, no carousel. A drawn device rather than a photograph. Motion gated on `prefers-reduced-motion`.
- **TheGap.** Keep all five personas, their headlines, all fifteen quotes and all five sourced statistics from `TheProblem.tsx` verbatim. The label is "what we hear", never "in their words", because the quotes are composites.
- **Metrics.** 72h brief to shortlist · 2:1 CVs per interview · 80% contracts renewed · 50+ programmes staffed. Definitions on the page, no source or date lines, values read from `content/metrics.yaml`. Server-render the real values and animate from zero only after hydration when motion is allowed. The current `useMotionValue(0)` pattern renders zeros to crawlers.
- **TheScreen.** Four steps, one line of copy each. Carry Raphy's ghost-numeral and connector execution.
- **RoleCoverage.** Eight role families, the full role lists are in the v0.3 `R` array, sourced from Sumeet's pitch-deck role wheel. Keyboard accessible. Do not duplicate the platform or sector axes here.
- **Commitment.** Permanent: no success no fee, payment on start date, flat fee across all levels, exclusive or retained, 100-day warranty. Contract: published rate card, replacement on quality, ramp up and down, contract to hire, 2 to 4 weeks to onboard including visa and EOR. Nothing beyond these.
- **Engage.** Four models, contract leading. Accordion or tabbed panel, whichever critiques better. One line of positioning per model plus "right for" chips. No paragraphs.
- **WherePlace.** Two axes only, six platforms and six sectors, with real vendor marks. The discipline axis is deliberately absent because RoleCoverage carries it.
- **Evidence.** Read from `content/case-studies/`. Seed with the eight real published studies in §10. Do not write new ones or invent metrics.
- **Close.** Programme-shaped brief checklist.

---

## 9. Assets and clients

Commit the logo pack to `public/logos/clients/`, `public/logos/integrators/` and `public/logos/platforms/`, lowercase hyphenated slugs matching the v0.3 arrays. SVG where a vector exists, otherwise optimise via `sharp` at twice the rendered height. Fix source misspellings: "Sqaure" to "square", "Sainsuburys" to "sainsburys".

`content/clients.yaml` carries **only these**, `consentOnFile: true`:

**Enterprise:** Alshaya Group · Landmark Group · Majid Al Futtaim · Al Tayer · Al Futtaim · Chalhoub Group · Al Othaim Markets · Sephora · Richemont · Marks & Spencer · Panda Retail · Wickes · Radwell

**Integrators**, headed "the systems integrators delivering them come to us for specialists": TCS · Wipro · Infosys · Capgemini · Oracle Consulting

Do not add any other logo from the pack. The rest are not current trading relationships.

Richemont has no file in the pack and needs sourcing. Flag it rather than substituting.

Delete every `images.unsplash.com` reference and the `remotePatterns` entry in `next.config.ts`. No stock photography anywhere.

---

## 10. Case studies and insights

**Case studies.** Port the real published studies from `yallo.co/case-studies` into `content/case-studies/*.mdx`. Ask Sumeet for a WordPress export or explicit permission to fetch; do not paraphrase or regenerate bodies. Convert `?case-study=` query strings to proper slugs with 301s. Seed the homepage rail with: Wipro and Al Tayer S/4HANA · Alshaya Azure data engineering · Chalhoub supply chain recruitment · Majid Al Futtaim Oracle Hyperion · Al Othaim Cairo offshore hub · Sephora target operating model · TCS Oracle EBS integrations · Alshaya custom planning platform.

**Insights.** Port these thirteen from the legacy site, preserving final slug segments and applying the terminology sweep: `enterprise-architect-uae-hiring` · `reduce-enterprise-hiring-delays` · `why-cloud-transformation-is-creating-a-new-talent-shortage` · `data-engineer-uae-ai-programmes` · `critical-technology-roles-uae-vacancy-cost` · `gcc-it-hiring-trends-2026-cio-guide` (to `middle-east-it-hiring-trends-2026`) · `ai-talent-uae-programme-failure-before-go-live` · `enterprise-ai-in-2026-the-gap-everyone-is-ignoring` · `wrong-it-hire-cost` · `me-india-blended-it-teams-gcc-delivery` (to `blended-delivery-teams-middle-east-india`) · `hidden-cost-of-slow-tech-hiring-enterprises` · `the-best-way-to-use-contract-hiring-during-high-demand-enterprise-projects` · `enterprise-architect-uae-hiring-challenges`.

Merge two duplicate pairs first: the two enterprise-architect articles become `enterprise-architect-middle-east` with both originals 301ing to it; `gcc-engineering-team-scaling` and `critical-technology-roles-uae-vacancy-cost` share a title, keep the latter and 301 the former.

Retire with 301 to `/industries/retail`, do not port: the five monthly retail round-ups, plus `middle-east-retail-boom-2025-trends`, which is candidate-facing and breaches client-first.

Stub with `published: false` and a `rewriteBrief` field, angle changing from technology trend to hiring consequence: `retail-technology-investment-2025` · `smart-manufacturing-iots-role-in-shaping-intelligent-ecosystems` · `supply-chain-resilience-overcoming-disruptions-with-predictive-analytics` · `circular-economy-in-manufacturing-tech-enabled-sustainability` · `the-role-of-robotics-in-logistics-increasing-speed-and-efficiency`.

Add taxonomy archives at `/insights/industry/[slug]`, `/insights/platform/[slug]`, `/insights/discipline/[slug]`, generated only where three or more published articles carry that value. Write every 301 into `next.config.ts`, including the nested `/insights/news/*`, `/insights/industries/retail/*` and `/insights/category/*` paths.

Add the newsletter signup from the legacy footer to `/insights` and every article page, wired to Resend. Copy: "Get the Middle East enterprise hiring brief." Make no frequency claim.

---

## 11. Remaining defects to close

From the defect register, still open:

- **B1** Sector display name renders as hero copy. `src/data/l1/retail.ts:13` sets `title: "Retail tech contractors,"` and `L2PageShell.tsx` consumes `sector.title` as a taxonomy label in six places plus `generateMetadata`. The correct values already exist as `label` and `short` in `src/data/l1/index.ts`. Add them to `L1PageData`, use them in all seven locations, and add a type-level guard so a hero string can never satisfy a label parameter.
- **B2** Roughly forty internal links 404. No route exists for `/platforms/[platform]` (6 linked), `/insights/[slug]` (34 linked, 9 articles), `/case-studies/[slug]`. Build the routes or gate the links behind `published`. Add a CI check asserting every internal href resolves.
- **B3** `src/lib/data.ts` was deleted but verify no orphaned duplicate registry survives, and that `sitemap.ts` reads only from the real data layer.
- **H6** Insight articles bylined "Sumeet Goenka". Confirm authorship with Sumeet before publishing anything under his name.
- **M4** Convert `docs/architecture/*.html` to markdown at `spec/`, fixing the `exicution`, `deisgns` and embedded-space filename typos.
- **M5** README is still `create-next-app` boilerplate.
- **M7** `@vercel/analytics` on a DigitalOcean deployment is collecting nothing.
- **M9** Platform logo SVGs sit in `docs/data/platform_icons/` with `" (1)"` suffixes rather than `public/logos/platforms/`.
- Confirm branch protection is enabled on `main`.

---

## 12. Branching and verification

Work in short-lived branches, one concern each: `design/tokens-and-themes` · `design/homepage` · `refactor/taxonomy-and-geography` · `content/case-studies` · `content/insights` · `fix/defect-register`. Self-merge once CI is green. Tag before and after the design work.

Before every commit: `pnpm biome check .` · `pnpm tsc --noEmit` · `pnpm build` · `pnpm test`.

At the end, report:

1. Both themes passing WCAG 2.2 AA, with the contrast table
2. Lighthouse Mobile score, LCP, CLS, INP
3. Zero occurrences of "GCC", "UK · ME · India", "subcontract", "Bangalore" in `src/` and `content/`
4. Zero raw hex outside the single tokens file
5. Zero `images.unsplash.com` references
6. Every internal href resolving, or gated non-interactive
7. Sitemap URL count against generated route count
8. impeccable critique scores per page type, before and after
9. **A list of the places where you departed from the v0.3 prototype and why.** This is expected and wanted, not a failure. Record it in `DESIGN.md`

---

## 13. One standing rule

Never invent a person, a quotation, a client name, a metric, a source or a case study. If something is missing, leave a clearly marked slot and say so in the report. Everything published on this site has to survive a competitor screenshotting it.
