# Yallo Talent — Build Review & Defect Register

**Version 1.0 · 29 July 2026 · Project GTM.01 — Websites — Product Build**
Reviewer: Claude (Chat lens), directed by Sumeet Goenka · Build owner: Raphy Varghese
Subject: `github.com/yallogroup/yallo-talent-website` @ deployed preview `yallo-talent-ohog5.ondigitalocean.app`

**Method and limits.** Read: the deployed homepage, `/industries/retail`, `/industries/retail/customer-experience`, and the full repository source at a shallow clone. Not done: a local build, Lighthouse run, axe audit, or review of commit history. Severity is my judgement, not a mandate — Raphy holds sign-off.

**Verdict.** This is a competent, well-structured Next.js build with a real typed content model and better engineering hygiene than most agency work. The content depth on the retail L1 is genuinely differentiated — nobody in the category publishes twenty function areas with scarcity-flagged roles. Six defects would, however, damage the brand if the site went live as it stands, and four of them are cheap to fix. The gap is not competence. It is that the design intent was never written down (`DESIGN_SYSTEM.md` is an empty stub), so the visual system defaulted to a template register and taxonomy labels got wired to hero copy.

**Severity key.** **BLOCKER** — must not ship. **HIGH** — fix before the DNS switch. **MEDIUM** — fix in the next sprint. **LOW** — hygiene.

---

## 1. Blockers

### B1 · Sector display name renders as hero copy on every L2 page — **BLOCKER**

`src/data/l1/retail.ts:13` sets `title: "Retail tech contractors,"` — the first line of the hero H1, with `emphasis: "shortlisted in 72 hours."` carrying the second. But `sector.title` is then consumed as if it were a taxonomy label in six places in `src/components/blocks/l2/L2PageShell.tsx` (lines 97, 107, 657, 750, 752, 755) and in the page title at `src/app/industries/[sector]/[fn]/page.tsx:57`.

Result, live on every L2 page: the breadcrumb, the back link, the eyebrow, the sidebar name, the "More…" heading and the `<title>` all read **"Retail tech contractors,"** — trailing comma included. The browser tab and the Google result currently say `Customer Experience Contractors · Retail tech contractors, | Yallo Talent`.

The intent was right — `sector.title.split("&")[0]` was clearly written expecting `"Retail & Consumer"`. The data field is wrong.

**Fix.** The correct values already exist: `src/data/l1/index.ts` carries `label: "Retail & Consumer"` and `short: "Retail"` per sector. Add `label` and `short` to the `L1PageData` contract (or resolve from the index by slug), use those in all seven locations, and reserve `title`/`emphasis` for hero copy only. Add a type-level guard so a hero string can never satisfy a label parameter.

### B2 · Roughly forty internal links resolve to 404 — **BLOCKER**

The route tree contains `page.tsx` for `platforms`, `capabilities`, `insights` and `case-studies` **index pages only**. There is no `[platform]`, `[slug]` or nested dynamic segment under any of them. Links present in shipped components and data:

| Target pattern | Links found | Route exists |
|---|---|---|
| `/platforms/{sap,oracle,microsoft,salesforce,blueyonder,workday}` (+ servicenow, aws on the homepage) | 8 | **No** |
| `/capabilities/{data-ai, digital-devops, cloud-infrastructure, cybersecurity, integration-middleware, emerging-technologies}` | 6 | **No** |
| `/insights/{slug}` | ~28 distinct | **No** |
| `/case-studies/{slug}` | 2 | **No** |

Only `/industries/*` (six L1s) and `/industries/retail/*` (twenty L2s) resolve beyond the static pages. The platform links are the most damaging, because they are promoted prominently on the homepage and they are the highest-value SEO asset the site has.

**Fix.** Either build the routes or gate every link behind a `published` flag in the data layer so unbuilt targets render as non-interactive. A CI check that asserts every internal href resolves to a known route would prevent recurrence — this is exactly what a Layer 1 lint rule is for.

### B3 · The sitemap omits all deep content, and a dead data layer is the cause — **BLOCKER**

`src/lib/data.ts` declares three registries and never populates them:

```ts
const sectorRegistry: Record<string, IndustrySector> = {};
const platformRegistry: Record<string, PlatformPage> = {};
const capabilityRegistry: Record<string, CapabilityPage> = {};
```

`src/app/sitemap.ts` builds its sector, platform and capability entries from `getAllSectors()`, `getAllPlatforms()` and `getAllCapabilities()`, all of which return `[]`. **The published sitemap therefore contains eighteen static URLs and omits every industry L1 and all twenty retail L2 pages.**

The root cause is two parallel content models: the real one at `src/data/l1/*` (populated, typed, documented) and a stub one at `src/types/index.ts` + `src/lib/data.ts` (empty, wired into the sitemap). `getSector`, `getFunction` and `getCapability` are dead code.

**Fix.** Delete the stub layer and drive `sitemap.ts` from `src/data/l1`, filtered to routes that actually exist. Add a test asserting sitemap length matches the generated route count.

### B4 · Metrics server-render as zeros — **BLOCKER**

`src/components/blocks/Metrics.tsx` initialises `useMotionValue(0)` and renders the motion value directly:

```tsx
const count = useMotionValue(0);
const display = useTransform(count, (v) => Math.round(v).toString());
// …
<motion.span className={styles.num}>{display}</motion.span>
```

The count-up runs in a `useEffect` gated on `useInView`. So the server-rendered HTML contains `0`, and the real figure appears only when a JS-enabled client scrolls the element into view. Consequences:

- Crawlers, social scrapers and any non-scrolling render see `0`. This is why the live page reads "0hrs Brief to Shortlist" and "0 Delivery Regions" — and why the same symptom has now appeared in three successive builds.
- The `useEffect` never consults `prefers-reduced-motion`, so reduced-motion users get the animation regardless — a breach of the WCAG 2.2 AA gate the project set for itself in `AGENTS.md`.
- `stats` are hardcoded in the component, breaking the content/render separation the rest of the repo maintains well.

The section header reads "Measured, not marketed / Not marketing claims" above four zeros.

**Fix.** Render the true value in markup; animate *from* zero after hydration only when motion is permitted. Move `stats` into the data layer. Same pattern needs the same fix in `src/components/blocks/CaseStudies.tsx`.

### B5 · Three published statistics are unsourced or misstated — **BLOCKER**

- `src/data/l1/retail.ts:44` — *"68% of retail CIOs report contractor quality — not budget — is the primary reason programmes slip past go-live."* No source in the data or on the page. I could find no such published finding.
- `src/data/l1/retail.ts:48` — *"4–6 wks average time lost when a specialist is placed without retail-specific screening."* No source.
- Homepage — the UAE figure misrepresents its source. The report is the **UAE Future Tech Talent Report 2024**, published by the Ministry of Economy with Integra Seven and launched at GITEX 2024. It found that more than 95% of employers actively *seek* professionals from outside the region and that 83% say offshoring is a key part of their business model — but also that 48% consider local talent abundant. The site's causal framing, *"because senior specialists can't be found locally"*, is not a claim the report makes, and the attribution should name the report rather than the ministry alone.

These are the numbers a competitor screenshots. The project rule is no unsourced figures, and every figure carries a visible source.

**Fix.** Remove the two unsourced statistics or replace them with sourced equivalents. Correct the UAE wording and attribution. Add a `source` field to any stat type that renders a number, and make it required.

### B6 · The placeholder host is set to be indexed — **BLOCKER**

`src/lib/seo.ts` sets `SITE.url = "https://talent.yallo.co"`, `buildMetadata` applies `robots: { index: true, follow: true }` to every page, and `src/app/robots.ts` allows all crawlers. Every canonical, OG URL and hreflang alternate on the build points at the placeholder host.

Since the destination is yallo.co, allowing the placeholder to be indexed converts a config change today into a domain migration later.

**Fix.** Drive `SITE.url` from an environment variable, and set `noindex` plus a `Disallow: /` robots rule on any host that is not the production domain. Flip at cutover.

---

## 2. High

| # | Issue | Detail | Fix |
|---|---|---|---|
| H1 | Pillar four has four names in shipped copy | "Managed Delivery" (nav, footer, engagement cards), "Subcontract" (L1 and L2 hero strips), "subcontracting" (Why Yallo card 03), "subcontracted" (How it works step 4) | Canon: **Managed Delivery** only. "Subcontract" never appears in public copy. Single source in the data layer. |
| H2 | "GCC" used throughout | "across the GCC", "GCC bank", "GCC enterprises", "GCC engineering centre", "SAP talent in the GCC" | Canon: **Middle East**, with **UAE** and **Saudi Arabia** named explicitly. "GCC" collides with Global Capability Centres in exactly the AI-skills data the site cites. |
| H3 | Geography presented as three co-equal markets | "UK · ME · India" everywhere, UK first; "3 delivery regions" used as a proof stat | Canon: Middle East leads, Europe second, India is the supply engine and not a demand market. Retire the "3 regions" stat — it conflates supply with demand. |
| H4 | "Job seekers" is a top-level nav dropdown | Client-first is ratified; candidates are served by the job board | One quiet punchout to `/jobs`. Remove the panel. |
| H5 | Sibling-brand errors | saasinator labelled "Launching soon" — it is live at saasinator.ai; both sibling links are `#`; "The Yallo Family" is a three-card group services carousel | Fix the status and links. Reduce to a single reason-to-believe line supporting the screening claim, not a group services block. |
| H6 | Insight articles bylined "Sumeet Goenka" | Ten-plus articles attributed to him across the pages reviewed, one at twenty minutes' read time; none has a route yet | Confirm the authorship policy before publishing anything under his name. |
| H7 | Seven accent colours | `globals.css` Layer 1 defines a yellow/amber brand accent **plus** six per-sector hues (blue, green, orange, rose, teal, violet), all desaturated mid-tones of similar value. Sector hue means the brand colour changes on every page | Design decision, not a bug — see the game plan's Phase 4. A brand with seven accents has no accent. |
| H8 | All imagery hotlinked from Unsplash | `next.config.ts` whitelists `images.unsplash.com`; every hero, card and segment image is a remote Unsplash URL | Generic register plus a third-party production dependency. Replace with purpose-built assets served from `public/`. |
| H9 | CI has no tests | `.github/workflows/ci.yml` runs `biome check`, `tsc --noEmit`, `next build`. The single Playwright smoke test in `e2e/smoke.spec.ts` never runs, and `package.json` has no `test` script | The golden-path enforcement floor is lint + type-check + **tests**. Add a `test` script and run Playwright in CI. |
| H10 | CI does not test what production runs | `engines` requires Node 22.x and pnpm 10.x; CI pins `node-version: 20` and `pnpm/action-setup version: 9` | Align CI to Node 22 / pnpm 10. Golden path is current LTS. |

---

## 3. Medium

| # | Issue | Note |
|---|---|---|
| M1 | Two linters, divergent enforcement | `pnpm lint` runs ESLint; CI runs Biome only. Keeping `eslint-config-next` is the right call for Next and a11y rules Biome may not cover — but then CI must run both, or the choice should be consolidated deliberately and logged in the Golden Path exceptions log. |
| M2 | Commitlint present | The golden path classifies commitlint as ceremony until release automation exists. Drop it or log an exception. |
| M3 | `DESIGN_SYSTEM.md` is an empty stub | "Status: draft — to be filled per Phase 0." Meanwhile `globals.css` carries a real two-layer token architecture. Undocumented design intent is the upstream cause of both H7 and B1. |
| M4 | Source of truth is HTML, with filename typos | `docs/architecture/exicution.html`, `arc_v10.html`, `teamand tools_v2.html`, `docs/deisgns/`. Not diffable, not reviewable in a PR, and the typos and embedded space will propagate into links and tooling. Convert to markdown at `spec/`. |
| M5 | README is unmodified `create-next-app` boilerplate | — |
| M6 | `AGENTS.md` is stale | Says "Next.js 15 / pnpm 9"; repo is Next 16.2.12 / pnpm 10.x. |
| M7 | `@vercel/analytics` on a DigitalOcean deployment | Likely collecting nothing. |
| M8 | Seventeen `alt=` occurrences across a heavily image-led site | Audit decorative versus informative and confirm the empty-alt cases are deliberate. |
| M9 | Platform logos not wired | SVGs sit in `docs/data/platform_icons/` with `" (1)"` filename suffixes rather than `public/logos/`; the site falls back to text badges. |
| M10 | Single-author commit policy | `AGENTS.md`: "All commits are authored as **Raphy Varghese** — no co-author trailers, ever." On an AI-assisted codebase this removes the provenance trail and conflicts with the Factory's commit-trailer discipline. A policy conversation, not a code change. |

---

## 4. Golden-path compliance

| Standard | Status |
|---|---|
| Next.js + TypeScript + Tailwind v4 + pnpm | ✅ Next 16.2.12, React 19.2.4, TS 5.9, Tailwind 4, pnpm |
| Node current LTS (22) | ⚠️ `engines` says 22; CI runs 20 |
| CI on every PR: lint + type-check + tests | ⚠️ lint ✅ type-check ✅ build ✅ **tests ✗** |
| `main` protected, PR required | ❓ Not verifiable from repo contents — confirm in GitHub settings |
| Biome as default linter | ⚠️ Biome in CI, ESLint in the local script |
| Husky as convenience, not the gate | ✅ |
| Commitlint not a default | ⚠️ Present |
| Dark/light mode + mobile | ✅ `ThemeToggle` present, responsive |
| Content separated from code | ✅ Strong — `src/data/**` typed, with one exception (B4 hardcoded stats) |
| Accessibility floor | ✅ Largely — `prefers-reduced-motion` in CSS, 296 aria attributes, `:focus-visible` — with the B4 motion gap |

---

## 5. What is genuinely good

Worth saying plainly, because the defect list is long and the foundation is not the problem.

- **The content model is real.** `L1PageData`, `L1ExpertiseCard`, `L2Tool`, `L1ScarceRole` and `L1Segment` are properly typed with documented field contracts and sensible optionality. This is the content/render seam done correctly, and it is the asset that survives any redesign.
- **Token architecture with enforcement.** A Layer 1 raw palette, semantic tokens above it, and a rule that raw hex may exist in exactly one file — enforced by a pre-commit hook at `.claude/hooks/check-colours.js`. That is better discipline than most teams manage.
- **`AGENTS.md` sets a real bar**: locked decisions requiring sign-off, a fixed phase order, and a self-imposed pre-launch gate of Lighthouse Mobile 90+, LCP under 2.5s, CLS under 0.1, INP under 200ms and WCAG 2.2 AA.
- **No invented people.** Practice leads are presented as roles with real credentials — "SAP practice lead, 20+ years" — with no fabricated names or headshots. Exactly the right call, and the one I would have flagged hardest had it gone the other way.
- **L2 generation is gated, not sprayed.** `generateStaticParams` only emits functions that carry `tools`, so twenty real retail pages exist rather than a hundred and twenty thin ones. From the outside this looked like a programmatic-content risk; in the code it is disciplined.
- **Managed Delivery is already built** as a named fourth pillar with outcome-based, fixed-milestone framing — independently arriving at the same conclusion as the strategy work.
- Zod for input validation, Resend for the brief form, `sharp` for images, Playwright configured, `robots.ts` and `sitemap.ts` present, `next/font` with self-hosted Google fonts.

---

## 6. Not yet built

| Surface | Built | Note |
|---|---|---|
| Homepage, service pages (contract, permanent, EOR, managed delivery) | ✅ | |
| Industry L1 | 6 of 6 | |
| Industry L2 (function pages) | 20 of ~120 | Retail only; the other five sectors carry no `tools` data |
| Platform detail | 0 of 8 | Linked from the homepage — **B2** |
| Capability detail | 0 of 6 | Linked from L1 pages — **B2** |
| Insight articles | 0 of ~30 | ~28 links live — **B2** |
| Case-study articles | 0 of 2+ | Linked from the homepage — **B2** |
| Job board integration | Index page only | Volcanic punchout still to wire |
| Legal (privacy, terms, cookies) | ✅ | |

---

## 7. Suggested fix order

1. **B6** — `noindex` the placeholder host. One line, closes an open-ended risk.
2. **B4** and **B5** — the zeros and the statistics. Both are credibility damage visible to any buyer today.
3. **B1** — the display-name bug. Small change, affects every L2 page and its search result.
4. **B2** — gate the dead links behind a `published` flag now; build the routes on the schedule in the game plan.
5. **B3** — delete the stub data layer, drive the sitemap from `src/data/l1`.
6. **H1–H4** — terminology and geography, once canon is ratified so it is done once.
7. **H9, H10** — close the CI floor.
8. **H7, H8** — design decisions, sequenced with Phase 4.
