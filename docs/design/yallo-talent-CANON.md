# Yallo Talent — Canon

**v1.0 · 30 July 2026 · Project GTM.01 · Owner and ratifier: Sumeet Goenka**
The Phase 2 artefact. Supersedes `SESSION-STATE-and-DESIGN-CANON.md` as the authority; consolidates it with the R/D registers in `yallo-co-relaunch-GAME-PLAN-v1.2.md` §2 and every ruling through Relays v2.0, v2.1 rev 2, v2.2 and the 30 July session. Location: `docs/design/yallo-talent-CANON.md`. Changes require Sumeet's ratification.

---

## 1. Positioning

**Wedge.** Yallo Talent staffs and delivers enterprise platform programmes across the Middle East and Europe, with specialist-screened people, including the AI talent nobody else can find. Platform depth at module level is verified unclaimed in the category (Benchmark §6).

**Four pillars.** Contract, direct to end client, leads. Permanent is account entry and credibility. Employer of Record is an enabler inside contract. Managed Delivery is the fourth pillar: direct mode published, white-label never published. "Subcontracting" never appears in public copy.

**Boundary with saasinator.** Talent delivers fixed scope on the client's existing enterprise platforms. saasinator builds new AI-native systems the client owns. Routing test: "make our Salesforce work" goes to Talent; "replace the thing we rent" goes to saasinator.

**Geography.** Middle East (UAE, Saudi Arabia) primary. Europe, UK first, a genuine second demand market. India third: Global Capability Centre staffing for multinationals, never a demand market. Four entities: London, Dubai, Riyadh, Bengaluru.

## 2. Terminology

- "Middle East" canonical. **"GCC" banned** (collides with Global Capability Centre in Yallo's own India business). Name UAE and Saudi Arabia; avoid "KSA". **Bengaluru**, not Bangalore.
- **"3 delivery regions" is banned in any phrasing** — it conflates supply with demand.
- "AI talent" is the category; "Claude talent" is depth-proof only.
- Buyer vocabulary is protected: "phase", "gate", "go-live", "cutover", "mobilisation", "hypercare", "brief", "shortlist" stay wherever they carry specific meaning.
- Banned abstractions (lint-enforced in `src/`): "shape" as a verb, "hold the risk", "pipeline to insight", "delivery cadence", "where the process lives", "run and reliability", "seamless", "robust", "unlock", "leverage", "journey", "landscape" (except SAP system landscape), "tailored" (except legal wording), "best-in-class", "world-class", "cutting-edge", "empower", "streamline", "holistic", "ecosystem" except "platform ecosystem".
- **Standing method for every banned-terms sweep:** occurrence-by-occurrence resolution with a documented reason per allow-listed case (the GCC pattern). Product names (Journey Builder), vendor vocabulary and legal wording are allow-listed, never rewritten.
- Copy tells: any sentence that counts the items below it, instructs the reader to click or scroll, or restates the heading, is removed.

## 3. Taxonomy

**Six platforms**, in this order (Yallo is a Microsoft house): SAP, Oracle, Microsoft (Azure and Dynamics 365), Salesforce, Blue Yonder, Workday. ServiceNow and AWS are not platform destinations; ServiceNow survives as role-level capability, AWS folds into cloud-infrastructure.

**Microsoft module set (ratified 30 Jul):** Azure Data & AI, Azure Infrastructure, Azure Security, Azure DevOps, D365 Finance & Operations, D365 Customer Engagement, D365 Business Central, D365 Human Resources, Power Platform, Microsoft 365 Copilot — all full desks, at equal or greater depth than Oracle. Data as Relay v2.1 rev 2 §5.

**Workday module set (ratified 30 Jul):** HCM, Payroll, Financial Management, Adaptive Planning, Recruiting, Talent Management, Learning, Workforce Planning, Prism Analytics, PSA — full desks, published. Data as Relay v2.1 rev 2 §5b; the legacy outcome figures do not port.

**Six sectors:** retail, finance, manufacturing, government, healthcare, telco.

**Six disciplines:** data-analytics, cloud-infrastructure, cybersecurity, integration-middleware, devops-platform-engineering, testing-quality-engineering. The last four are declared `PLANNED_CAPABILITIES` and render non-interactive until seeded. `emerging-technologies` retired, 301 to `/ai-talent`.

**Eight role families**, platform-specific data per Relay v2.0 §3.4, implemented in `roles.ts` — that file is the truth. Segments stay an in-page concept. Six specialist desks carry the screening proof: Architecture, Software Development, Cloud & Infrastructure, Packaged Software, Data & Analytics, Agile & DevOps.

## 4. Navigation (amended 30 Jul)

**Specialisms and Industries are merged into one item labelled "Specialisms"**: columns Platforms · Disciplines · Industries, plus the AI-talent feature card. Nav: Specialisms · How we work · Evidence · Intelligence · Jobs (quiet text link) · Start a brief (the only button). No "Job seekers" panel — one quiet punchout to the board (R3).

## 5. Design system

**Grounds and ink.** Paper grounds, never white: `--paper #eae9e4`, `--paper-2 #f4f3f0`, `--paper-3 #e0ded6`; ink scale with `--ink-3` at `#5c5e66` (AA-corrected). Dark set per `DESIGN.md`.

**Gold — three grades on light (AA amendment, ratified):** `--gold #d4a843` decorative only, never text or state; `--gold-deep #9d7818` large text, underlines, focus rings; `--gold-ink #7b5d13` all small text and every mono label. Gold is the only colour that is ever interactive, navigational or brand-bearing.

**Functional hues:** two grades per hue per theme, `-mark` (≥3:1, fills/strokes) and `-text` (≥4.5:1, labels). Reaching for `-mark` on a label is the canonical misuse.

**Ambient colour:** desaturated hues live only in the ambient layer — gradients, glows, plate washes — never on text or controls. **Assignment is per-section only. Per-taxonomy-branch assignment is banned**: it is the retired per-sector hue system returning. The retired six-hue system stays retired.

**Type.** Display Newsreader 500/600, body Inter, data IBM Plex Mono (tables and mono labels only). No third face. **Floor: nothing below 12px anywhere; body 16px (17px preferred on light); card/list body 14px; meta 13px; mono labels 12px at ≥0.12em tracking (uppercase); table figures 14px tabular.** The ramp has exactly 13 documented roles; the frontmatter is the single source; no two adjacent steps closer than a 1.125 ratio. Enforced by project guard in CI and pre-commit.

**Structural signature: the quarter-round petal** (three square corners, one 56px radius, from the Yallo mark) — cards, buttons, masks, phase fills, entity strip, background shapes. **Creative North Star: "The Screening Dossier"** — the site is the artefact Yallo delivers. Depth is flat, tonal layering plus hairlines, with **exactly one lifted element: the hero instrument**.

**Register.** Light is the working default with dark bands for evidence and data surfaces, never more than two per page. **Site default register is under critique test:** one L1 built in both registers, impeccable critique scores decide, canon updates with the result.

**Banned in the visual system:** glass (`backdrop-filter`, `--glass-*` — CI-banned after the step-8 strip), blurred orbs, stock photography and hotlinked imagery, gradient text, hero carousels and carousel libraries, people-and-places imagery. Imagery is the deterministic PetalPlate system: gradient and geometric, generated from the page's own slug.

**Logo lockup (ratified 30 Jul):** flower mark, "Yallo" wordmark, **"TALENT" to the right of the wordmark, never beneath it** — header, footer, favicon derivations.

**Motion:** `prefers-reduced-motion` honoured for every animation; auto-advancing elements pause on hover; zero CLS from motion; text remains the LCP element on the homepage.

## 6. Metrics — the only four published

72h Brief to shortlist (three screened candidates from a complete brief) · 2:1 CVs per interview · 80% Contracts renewed (placed contractors extended at least once) · 50+ Programmes staffed (programmes, not placements). Database size is never published. Values render server-side, refreshed quarterly in `content/metrics.yaml`. No figure appears anywhere without a source; `source` is a required field on any stat type.

## 7. The commitment — real contractual terms only

**Permanent:** no success no fee · payment on start date · flat fee across all levels · exclusive or retained only · 100-day warranty. **Contract:** published rate card · replacement on quality · ramp up and ramp down · contract to hire · 2–4 weeks to onboard including visa and EOR. The "first ten working days at our risk" line is withdrawn. No rates, fees or percentages on public pages; rate bands live only inside the gated Programme Staffing Blueprint.

## 8. Proof

- **Client rail (amended 30 Jul): one continuous monochrome moving rail**, pause on hover, static under reduced motion. The enterprise/integrator split survives as data and one caption line ("including the systems integrators who come to us for specialists"), never as two walls. Uniform monochrome treatment; never a mark on a white card. `consentOnFile: false` renders nowhere.
- **No invented people, ever.** Practice leads are roles with real credentials. "The people who screen" stays deleted; the six desks carry the proof. The testimonial slot renders nothing until a real, permissioned, attributed quote exists.
- **Case studies:** bodies are Yallo's own published words, verbatim. Excerpts are compression of the body only — never new facts. Titles carry a schema-enforced length budget.
- **Authorship (ratified 30 Jul): house byline "Yallo Talent" on all articles and blogs. No individual names.** This supersedes the per-person attribution rule in the content authoring guide.

## 9. Content operating rules

- **Talent-speak, always:** what Yallo places, screens and staffs — never what the platform does.
- **Port-and-convert principle (ratified 30 Jul):** the legacy site was Talent + Delivery + Consulting; everything worth keeping ports, and everything that ports converts to Talent-speak. Legacy delivery outcome figures do not port without a client and record.
- **Workstream split (ratified 30 Jul):** case studies are Sumeet-and-Chat scope, first-class in the build. Insight articles are descoped from this build entirely — all legacy-ported insights `published: false` — and transfer to Raphy's pod post-handover with a Chat-authored brief.
- **The one rule above all:** never invent a person, quotation, client, metric, source, case study or date. Where something is missing, render nothing and name the gap. Enforced structurally by CI guards that are never weakened.

## 10. Amendment log

30 Jul 2026: three-grade gold and `--ink-3` AA correction · two-grade functional hues · "3 regions" banned in any phrasing · ambient per-section only, per-branch banned · Specialisms+Industries nav merge · merged client rail · logo lockup rule · house authorship · port-and-convert · article descoping · Microsoft modules ratified · **Workday modules ratified (supersedes the earlier draft status)** · type floor and 13-role ramp · glass CI ban · register critique test.
