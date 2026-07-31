# Yallo Talent — Canon

**v1.0 · 30 July 2026 · Project GTM.01 · Owner and ratifier: Sumeet Goenka**
The Phase 2 artefact. Supersedes `SESSION-STATE-and-DESIGN-CANON.md` as the authority; consolidates it with the R/D registers in `yallo-co-relaunch-GAME-PLAN-v1.2.md` §2 and every ruling through Relays v2.0, v2.1 rev 2, v2.2 and the 30 July session. Location: `docs/design/yallo-talent-CANON.md`. Changes require Sumeet's ratification.

---

## 1. Positioning

**Wedge.** Yallo Talent staffs and delivers enterprise platform programmes across the Middle East and Europe, with specialist-screened people, including the AI talent nobody else can find. Platform depth at module level is verified unclaimed in the category (Benchmark §6).

**Four pillars.** Contract, direct to end client, leads. Permanent is account entry and credibility. Employer of Record is an enabler inside contract. Managed Delivery is the fourth pillar: direct mode published, white-label never published. "Subcontracting" never appears in public copy.

**Boundary with saasinator.** Talent delivers fixed scope on the client's existing enterprise platforms. saasinator builds new AI-native systems the client owns. Routing test: "make our Salesforce work" goes to Talent; "replace the thing we rent" goes to saasinator.

**Geography (amended 30 Jul — A6).** Middle East (UAE, Saudi Arabia) primary. Europe, UK first, a genuine second demand market. **India is both the supply hub and a demand market in its own right:** demand arrives as Global Capability Centre staffing — multinationals building capability centres in Bengaluru buy from Yallo there. This supersedes the earlier "never a demand market" line, which was written to stop India being counted as a *delivery region* and overreached into denying real demand. L1 heroes therefore keep "Middle East, Europe and India". `PRODUCT.md` stands as written. **"3 delivery regions" remains banned in any phrasing** — the ban was always about conflating supply with demand, and it still is. Four entities: London, Dubai, Riyadh, Bengaluru.

## 2. Terminology

- "Middle East" canonical. **"GCC" banned** (collides with Global Capability Centre in Yallo's own India business). Name UAE and Saudi Arabia; avoid "KSA". **Bengaluru**, not Bangalore.
- **"3 delivery regions" is banned in any phrasing** — it conflates supply with demand.
- "AI talent" is the category; "Claude talent" is depth-proof only.
- Buyer vocabulary is protected: "phase", "gate", "go-live", "cutover", "mobilisation", "hypercare", "brief", "shortlist" stay wherever they carry specific meaning.
- Banned abstractions (lint-enforced in `src/`): "shape" as a verb, "hold the risk", "pipeline to insight", "delivery cadence", "where the process lives", "run and reliability", "seamless", "robust", "unlock", "leverage", "journey", "landscape" (except SAP system landscape), "tailored" (except legal wording), "best-in-class", "world-class", "cutting-edge", "empower", "streamline", "holistic", "ecosystem" except "platform ecosystem".
- **"Specialist-screened" and "specialist-led" replace "architect-screened" and "architect-led" site-wide (amended 30 Jul — A1).** The screening claim is about depth, not about one job title, and "architect-led" narrowed it to a single grade while the six desks in §3 span far more. **Allow-listed as genuine collisions, never rewritten:** real job titles ("Solution Architect · SAP", "Enterprise Architect", every `roles.ts` and job-board title), the **Architecture** desk in §3, and the word "architecture" describing a system. Lint-enforced.
- **Standing method for every banned-terms sweep:** occurrence-by-occurrence resolution with a documented reason per allow-listed case (the GCC pattern). Product names (Journey Builder), vendor vocabulary and legal wording are allow-listed, never rewritten.
- Copy tells: any sentence that counts the items below it, instructs the reader to click or scroll, or restates the heading, is removed.

## 3. Taxonomy

**Six platforms**, in this order (Yallo is a Microsoft house): SAP, Oracle, Microsoft (Azure and Dynamics 365), Salesforce, Blue Yonder, Workday.

**Retired from the SAP platform page (ratified 31 Jul — R2):** SAP Special Applications (a category, not a product), SAP Business One and SAP Business ByDesign (SMB ERP, against canon §1's enterprise-programme wedge). Corpus attestation is not the same as a desk Yallo staffs. **Blue Yonder's module set stays parked** pending Sumeet naming its desks — it is the one platform page still mixing suite and sector levels, and inventing its suite list is forbidden. ServiceNow and AWS are not platform destinations; ServiceNow survives as role-level capability, AWS folds into cloud-infrastructure.

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

**Ambient colour (amended 31 Jul — R4: per-domain identity, governed).** Desaturated hues live only in the ambient layer — hero atmospheric fields, PetalPlates, section washes — **never on text, controls, borders or state**.

**Each platform, discipline and sector carries ONE identity hue**, used only in that family's ambient layer. This supersedes the per-taxonomy-branch *ban* with a governed system, and the distinction is the whole point: the retired six-hue system failed because its hues reached into borders, labels and card washes, so a page's accent changed with its branch and the brand lost one marker. Under R4 the hue never leaves the ambient layer, so a page is recognisably SAP or retail at a glance while **gold remains the sole interactive and brand accent everywhere**.

Conditions on every identity hue: one curated family so the set reads as one system rather than a rainbow; tuned per register; desaturated enough to sit under `--amb-alpha` without competing with gold; and if any text grade is ever derived from one, that grade must clear AA on its own. Tokenised in Layer 1 — a component never names a hue, it inherits `--amb` from its page.

Within a page, section rhythm still varies by position (`.amb-1…6`), now within the family's hue rather than across six unrelated ones.

**Type.** Display Newsreader 500/600, body Inter, data IBM Plex Mono (tables and mono labels only). No third face.

**Floor raised 30 Jul (A4) — nothing below 13px anywhere.** Superseding the 12px floor: `mono labels 13px` at ≥0.12em tracking (uppercase) · `meta 14px` · `footer links 14px` · `nav 15px` · `buttons 15px` · card/list body 14px · body 16px (17px preferred on light) · table figures 14px tabular. The 12px floor was met and then became the resting size of load-bearing content — role chips, module lists, metric labels — so the product Yallo sells rendered at the smallest size on the page. The ramp has exactly 13 documented roles; the frontmatter is the single source. **Adjacency (ratified 31 Jul — R1): the 1.125 minimum ratio applies from `--fs-body-sm` (15.5px) upward**, the display and heading chain where a reader compares steps by size alone. Below it the roles are separated by family, case, tracking, weight and colour as well as size — mono uppercase tracked at 13px against sans sentence-case at 14px is not a size comparison — so A4's 13/14/15 sizes stand and the ratio does not govern them. This closes the direct conflict between A4 and the earlier blanket rule. Enforced by project guard in CI and pre-commit.

**Structural signature: the quarter-round petal** (three square corners, one 56px radius, from the Yallo mark) — cards, buttons, masks, phase fills, entity strip, background shapes. **Creative North Star: "The Screening Dossier"** — the site is the artefact Yallo delivers. Depth is flat, tonal layering plus hairlines, with **exactly one lifted element at rest: the hero instrument**.

**Hover elevation is allowed as an interaction state (amended 30 Jul — A5).** A shadow that appears on `:hover` or `:focus-visible` and returns on exit is feedback, not decoration, and does not spend the One Lift Rule. **Resting flatness is unchanged** — no card, panel or tile carries a shadow when idle, and the hero instrument remains the only resting lift on any page. Hover lift must be paired with a non-motion cue (border or ground shift) so it survives `prefers-reduced-motion`, and must never be the sole indicator of interactivity.

**Register.** Light is the working default with dark bands for evidence and data surfaces, never more than two per page. **Register test resolved 30 Jul — light adopted site-wide, pending Sumeet's ratification of this line.** The test could not be scored as a comparison: removing `band-dark` rendered the L1 dark-ink-on-dark, because the legacy shells painted their grounds from the Layer 2c dark aliases rather than the semantic layer, so no light variant existed to critique. L1, L2 and service were rebuilt onto the semantic ground layer (49 ground declarations), gradient text removed, and the three-grade gold applied; light then rendered correctly and every surface passes axe in both registers. Chat's deciding reason stands: L1 and platform pages are the primary organic entry points, so dark there would make dark the brand's first impression for most traffic.

**Gradient text returns as a display accent only (amended 30 Jul — A2).** Permitted on **headline emphasis spans only** — the `emphasis` half of an H1 or a section H2. Every gradient must be **gold-anchored** (both stops drawn from the gold grades, so the run reads as one brand colour shifting, never as two hues), and **AA-safe at its lightest stop measured against the ground it sits on** — the darkest stop passing is not sufficient, because the lightest pixels are still text. **Never** on body copy, mono labels, links, buttons, chips, metric values or anything under 23px. A gradient span always carries a solid-colour fallback for `background-clip` failure.

**Liquid glass returns, sanctioned (amended 30 Jul — A3).** Reversing the step-8 strip, but as **allow-list enforcement rather than a ban**. One token-governed `.glass` utility is the only implementation; no component may author its own `backdrop-filter`. **Allow-listed surfaces, exhaustively:** the nav bar once scrolled, the mega-menu panel, the hero instrument, the sticky brief CTA, and the four-ways media panel. Conditions on every one: both members of each translucent pair pass AA at the worst-case backdrop; a `prefers-reduced-transparency` fallback to an opaque ground; and the performance budget held (no `backdrop-filter` on a scroll-linked or continuously animating surface, and none stacked behind another). **The CI guard changes from banning `backdrop-filter` to enforcing this allow-list** — an unlisted surface or a raw `backdrop-filter` outside the utility still fails.

**Banned in the visual system:** blurred orbs, stock photography and hotlinked imagery, gradient text outside A2's display-accent rule, hero carousels and carousel libraries, people-and-places imagery. Imagery is the deterministic PetalPlate system: gradient and geometric, generated from the page's own slug.

**Logo lockup (ratified 30 Jul):** flower mark, "Yallo" wordmark, **"TALENT" to the right of the wordmark, never beneath it** — header, footer, favicon derivations.

**Motion:** `prefers-reduced-motion` honoured for every animation; auto-advancing elements pause on hover; zero CLS from motion; text remains the LCP element on the homepage. Honouring it takes **two** mechanisms, and both are mandatory: `MotionConfig reducedMotion="user"` for Framer, because a JS-driven inline transform cannot be overridden by any stylesheet rule; and `!important` on the universal reset, because the `*` selector has specificity 0 and loses to every component class that declares a `transition` shorthand. `prefers-reduced-transparency` is honoured wherever A3 glass appears. Guarded by `scripts/check-motion.mjs` with a motion-allowed control pass.

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
- **IA modernisation (authorised 31 Jul — R5).** The legacy corpus IA is two to three years old, so it is the source for what Yallo *published*, not for what the market *is*. Per lead domain the module taxonomy is critiqued against the current market and the portion that has moved is amended — expected to be 20–30%. Every change lands in a logged was/now/why table for Sumeet's ratification. Module names must be **real market products**; an uncertain desk parks in `QUESTIONS.md` rather than shipping. This narrows, and does not repeal, the corpus-only rule: names still may not be invented, but a name may now come from the current market rather than only from the corpus.
- **The one rule above all:** never invent a person, quotation, client, metric, source, case study or date. Where something is missing, render nothing and name the gap. Enforced structurally by CI guards that are never weakened.

## 10. Amendment log

30 Jul 2026: three-grade gold and `--ink-3` AA correction · two-grade functional hues · "3 regions" banned in any phrasing · ambient per-section only, per-branch banned · Specialisms+Industries nav merge · merged client rail · logo lockup rule · house authorship · port-and-convert · article descoping · Microsoft modules ratified · **Workday modules ratified (supersedes the earlier draft status)** · type floor and 13-role ramp · glass CI ban · register critique test.

**30 Jul 2026, second amendment set (A1–A6, Sumeet-ratified).** Each supersedes the line it names:

| # | Amendment | Supersedes |
|---|---|---|
| A1 | "specialist-screened" / "specialist-led" replace "architect-screened" / "architect-led" site-wide; genuine job titles and the Architecture desk allow-listed | the architect-led screening claim throughout §2 and §8 |
| A2 | Gradient text permitted as a display accent on headline emphasis spans — gold-anchored, AA-safe at its **lightest** stop | the flat "gradient text" ban in §5 |
| A3 | Liquid glass returns as one token-governed `.glass` utility on five allow-listed surfaces, each AA with a reduced-transparency fallback; the CI guard becomes allow-list enforcement | the §5 glass ban and the step-8 strip |
| A4 | Type floor raised to **13px**; mono labels 13, meta 14, footer links 14, nav 15, buttons 15 | the 12px floor in §5 |
| A5 | Hover elevation allowed as an interaction state; resting flatness and the single resting lift unchanged | the absolute reading of the One Lift Rule in §5 |
| A6 | **India is a demand market as well as the supply hub**, via GCC staffing for multinationals building Bengaluru capability centres; "3 delivery regions" stays banned | "never a demand market" in §1 |

A6 closes `QUESTIONS.md` Q5, which had recorded canon §1 and `PRODUCT.md` as contradicting each other on this exact point.

**31 Jul 2026, third amendment set (R1–R5, Sumeet-ratified).**

| # | Ruling | Effect |
|---|---|---|
| R1 | The adjacency narrowing is ratified | §5 type clause: the 1.125 ratio applies from 15.5px upward. **Closes Q7.** |
| R2 | Three SAP names retired from the platform page | §3: SAP Special Applications, Business One, ByDesign. **Q9 narrows to Blue Yonder only.** |
| R3 | No glass on the mega panel, and no portal | The ambient field stands there. **Closes Q8.** |
| R4 | **Per-domain identity colour, governed** | §5 ambient clause rewritten: one identity hue per platform, discipline and sector, ambient layer only. Supersedes the per-branch ban. Gold stays the sole interactive and brand accent. |
| R5 | IA modernisation authorised | §9: the module taxonomy may be amended against the current market, with a logged was/now/why table per domain. |

---

## Standing amendments S1–S3 · rulings R6–R15 — 31 July 2026, ratified by Sumeet

### S1 — the exit criterion is ZERO P1

**The "no gain" limb is dropped as sub-resolution.** Three raters scoring one
identical frozen build returned 28, 29 and 31 of 36; a fourth rater's rubric
scored the same retail page 80.6% against a prior series' 72.2%. The score
carries roughly ±1.5 points of rater noise and no cross-rubric comparability, so
"no gain over the previous pass" measured noise rather than convergence.

**A surface is done when a scoring pass against a frozen build returns no P0 and
no P1.** One pass per surface per freeze — not two.

### S2 — speed discipline, ratified as method

1. **Freeze before scoring.** Tag the commit; no commits of any kind while a pass
   is measuring. Broken twice on 31 Jul — once a docs file, once a rebuild and
   server restart mid-pass — and the second cost a pass part of its validity.
2. **Batch fixes between freezes.** Never fix inside a scoring window.
3. **Fix CLASSES, not instances.** Grep site-wide before declaring a fix done.
   Four recurrences on this run: one clamp removed and three left live; two
   motion-only hovers fixed and sixteen found later; one `<cite>` reset and one
   missed; one card's stretched link fixed and its sibling template's not.
4. **Restart the server before every browser gate.** A stale `next start` over a
   rebuilt `.next` produced two phantom gate failures and one phantom axe run.
5. **Match class tokens exactly.** `[class*=expCard]` matches `expCardOpenLink`;
   `[class*=readNextChip]` matches `readNextChips`. Both produced false P1s.
6. **Two freezes per surface, maximum.**

### S3 — delegated judgement

Where a question needs Sumeet's business knowledge and he is not available, take
the **least-overclaiming option**, log it in `QUESTIONS.md` with the reasoning,
and continue. Never invent a person, client, metric, quote, source or date.
Never idle waiting for an answer.

### R6–R15

| # | Ruling | Canon effect |
|---|---|---|
| **R6** | Q17: the 17 SAP L2 routes stay. The defect is zero net-new information, not the route. | §9: an L2 earns its place by JOINING data already held — the sectors and function pages staffing that module, role detail with screening notes, case studies carrying the platform tag, siblings. **One marked depth slot per module is reserved for Chat copy and must not be written by Code.** |
| **R7** | Q18: stop the loops rather than adding UI. **SHIPPED.** | §5 motion: the hero instrument **plays once on entry, then rests**, so SC 2.2.2 no longer applies to it. The client rail keeps its loop and gains a small persistent keyboard-reachable pause/play. The clause reads "pause on hover **plus a control**". **Closes Q18.** |
| **R8** | Q14: the blurred-orb ban stands. **SHIPPED — 8 sites, not the 4 reported.** | All four surviving pseudo-element orb sites are deleted. **Closes Q14.** |
| **R9** | Q15: key the two marks or set them as names. **SHIPPED — both ship as NAME text; perimeter ink 0.668 and 1.000 against 0.000-0.040 for the four letterforms that stay.** | §8: `blue-yonder` and `sap` either key to one clean ink or render as NAME text. No third option. **Closes Q15.** |
| **R10** | Q16: the a11y gate composes contrast for every axe abstention. **SHIPPED — 1,058 nodes composed per run; found ink-on-ink at 1.00:1 on its first real run.** | An `incomplete` verdict is no longer silence. **Closes Q16.** |
| **R11** | **SHIPPED — SAP/Retail/Data now read indigo/plum/teal, ΔE 5.28 on dark against 2.43 before.** The 18-domain identity palette is ratified in full — **and it was imperceptible.** Every page reads the same coffee-brown. | §5: raise ambient presence until **SAP is visibly distinct from Retail at a glance in both registers**. `--amb-alpha` up; field scale and gradient range wider; the hue must read in the hero, the plates and the section washes. **Pull umber and gold OUT of the neutral base** so gold is accent, not atmosphere. AA held throughout; gold owns every control. Iterate until visibly distinct, not until the tokens resolve. |
| **R12** | Q3: **light is the site-wide register.** **SHIPPED.** | §5 register clause records light as adopted, not under test. **Closes Q3.** |
| **R13** | Q9 unparked: Blue Yonder ships at suite level from evidence already in the repo. **SHIPPED — 8 modules, every one anchored to a role string already in the repo; 6 real BY products omitted for lack of one. Moss wired.** | §3: the ratified homepage line (Luminate, WMS, planning) plus the Blue Yonder roles the retail data names. **HARD RULE — a module ships only if it maps to an existing role in the data layer or to the homepage line. Omit the rest; never guess.** Moss hue. Evidence table logged. **Closes Q9.** |
| **R14** | Q2: delete what is demonstrably wrong in the case studies. **SHIPPED — 4 removals, logged in docs/design/case-study-removals.md; 2 of Q2's 6 items are curation/content decisions and stay with Sumeet.** | Lines belonging to another study, and the empty heading, are removed. Where text repeats across two unrelated studies it is kept where it belongs and removed from the other. **No rewriting.** Removals logged. **Closes Q2.** |
| **R15** | The logo drops the pipe divider. **SHIPPED — variant B, cap-height aligned. Four alternates measured and captured in docs/status/shots/r15-logo/.** | §5: TALENT as tracked small caps aligned to the wordmark's cap height. Four alternates built and self-critiqued; the strongest ships; all four shown for override. |

**Descoped permanently:** insight articles and blogs. Raphy revamps them fresh.
Code does not port, rewrite, template or touch them, and porting is struck from
the backlog.
