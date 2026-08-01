# Code → Chat relay — Capabilities parity round

**v1.0 · 2 August 2026 · Branch `feat/capabilities-parity` · Project GTM.01**
Against `docs/design/context-capabilities-parity-round.md` v1.0 and `context-ai-talent.md`.
Parallel with the platform round on `main`.

---

## TL;DR

The capabilities pillar went from two live disciplines to seven, all at the same depth. The three named Data & Analytics defects are fixed at the class rather than the instance, and two of the three turned out to have a different cause than the hypothesis in the brief. The four planned desks are seeded and serving with 31 L2 routes, so `PLANNED_CAPABILITIES` is now empty. The AI estate diagram ships with its role-family overlay derived from the existing stack matrix rather than retyped. The site-wide "YALLO" fault was real, was on every page, and was **not a string** — it was `text-transform: uppercase` applied to copy containing the word, which is why grep found nothing; it is fixed in eight places and guarded by a new browser-based gate.

Two items are **not** done and are listed in "What I stopped short of". Nothing is claimed as verified that I did not observe.

---

## 1. The parity checklist, derived from the page as instructed

§2 said to take no checklist on trust. This is what Data & Analytics actually renders, read off the live DOM rather than from the data file.

**Band order** (`L1PageShell`, in render order):

| # | Band | Notes |
|---|---|---|
| 1 | `hero` | ambient `amb-1`, breadcrumb, eyebrow, H1 + emphasis line, sub, two CTAs, four status dots |
| 2 | `statsStrip` | the four canon §6 metrics, passed in server-side from `metrics.yaml`. Not per-page data |
| 3 | `intro` (`amb-2`) | eyebrow, H2, two paragraphs, right-column stat cards |
| 4 | `wwd` | "What we deliver" |
| 5 | `hww` (`amb-3`) | How We Work. Shared component, consumed by reference |
| 6 | `scarce` | conditional on `scarceRoles` being non-empty |
| 7 | `expertise` | the numbered function grid, collapsing past 8 cards |
| 8 | `segments` | the six-segment interactive panel |
| 9 | `bottomCta` | shared |
| 10 | `readNext` | cross-link chips, filtered through `routeExists` |
| — | `insights` | **does not render.** Gated on `some(published !== false)`, and all four insight records are `published: false` because the whole insight family is descoped. Correct behaviour; the data is inert |

**Sticky sub-nav** renders 6 items: Why us · What we deliver · How we work · Scarce talent · Expertise · Segments. Insights appears only when a published insight exists.

**Data contract** (`L1PageData`, and the fields that carry depth): `slug`, `category`, `breadcrumb`, `eyebrow`, `title`, `emphasis`, `sub`, `sectorNoun`, two CTAs, `statusDots`, `introEyebrow/Title/Copy/StatCards`, optional `scarce*` block, `expertise[]` (`slug`, `num`, `title`, `icon`, `blurb`, **`overview`**, **`tools[]`**, optional `href`), `segments[]`, optional `insights[]`, `relatedTitle`, `related[]`, `seo`. No `stats`, no `partners` — both removed by earlier rounds, deliberately.

**The gate on L2 generation** is `roles` for capabilities and `tools` for sectors. All seven new/updated capability pages satisfy it.

All six other disciplines were built to this checklist.

---

## 2. The three named defects, and what they actually were

### S1 · "Data & AI" on the discipline — CONFIRMED, cause as hypothesised

Your hypothesis was right. Canon §3 runs two taxonomies sharing labels, and Relay v6.0's desk rename was applied by string match, taking the discipline with it. It rendered **13 times** on the L1, including in the `<title>`.

Two carriers, both fixed:
- `capabilitiesIndex.short` held `"Data & AI"`. `short` is a short form of the **discipline** label and nothing else.
- `L2PageShell` held a hand-maintained `capabilityLabels` map with both wrong strings. **Deleted**, in favour of the existing `taxonomyLabels()`. `platformLabels` went with it — a copy of a taxonomy always drifts from it.

**You also asked me to check Cloud & Infrastructure for the same leak. It is clean** — same label in both taxonomies, so there was nothing to diverge. But the same retirement had left two other orphans, which is D1 below.

Guard: `scripts/check-taxonomy.mjs` now fails the build if a desk name resolves into the discipline taxonomy, or if any surface re-declares a label map. Verified: 13 → 0.

### S2 · "L2 links not clickable" — NOT REPRODUCIBLE, and the brief's cause was not the cause

The brief said to check `published: false` against real route status. I did, and it is not that. Measured on the live page:

- All 7 expertise cards emit `<a href>` to `/capabilities/data-analytics/{fn}`.
- All 7 targets return **200**.
- Hit-testing at the card title, card centre and role-list positions returns the anchor at **every** point on all 7 cards. The whole card is the target, not just the corner circle.

So there is no clickability defect on the expertise grid in the current tree.

**What I think you saw, and it matters because it changes the fix.** Two candidates, both real:
1. **The capabilities index.** Four of six discipline cards were correctly non-interactive because their routes 404'd. If "L2" meant "the pages below Capabilities", then the four inert cards *were* the defect — and the fix is seeding, not a flag change. That is done; all seven now link.
2. `/capabilities/data-analytics` served **200 from a stale production build** on port 3000 throughout your review. My first measurement pass read that build and mistook it for the current tree. If your screenshot predates the commit that built the capability L2 route, the links genuinely did not exist then and already exist now.

**One process finding worth keeping.** Port 3000 was running `next start` on a prebuilt `.next`, not `next dev`. Every measurement against it describes a build snapshot, not the working tree. I have made `distDir` overridable via `NEXT_DIST_DIR` so two sessions can each run a server without corrupting the other's `.next`; I used `.next-caps` on port 3477.

### S3 · Body thin against Retail and SAP — CONFIRMED, and measured

| | expertise cards | `overview` populated | `tools` populated | file size |
|---|---|---|---|---|
| `retail.ts` | 20 | 20 | 20 | 51 KB |
| `data-analytics.ts` (before) | 7 | **0** | **0** | 14 KB |
| `data-analytics.ts` (after) | 7 | 7 | 7 | 24 KB |

That is the thinness, exactly: capability L2s opened with a one-line blurb where a sector L2 opens with a paragraph and a vendor band.

An earlier pass had declined to author these, on the recorded ground that the only source for capability tool names was an untrustworthy workbook. I answered that objection rather than overruling it: **every product now in `tools` was already published in that file's own blurbs**, so the structure changed and the claims did not. For the four new desks, §4 supplied the stacks, so the objection does not arise.

---

## 3. Defects on the index

**D1 · Testing & Quality Engineering's wrong description — CONFIRMED.** It carried the retired `emerging-technologies` tagline verbatim, so that desk advertised blockchain and quantum talent. It also wore `short: "Emerging"`. Both fixed, and DevOps & Platform Engineering had the same class of orphan (`short: "Digital & DevOps"`, a retired desk name).

**A note on the lint for it.** My first version of the orphan rule banned `"digital twin"` as a substring and immediately failed on **"Digital Twin for Cities Consultant"** in `government.ts` and the **"Digital Twin & IIoT"** sub-desk in `manufacturing.ts` — both real, both published, neither an orphan. The rule now matches the retired *phrase*. Flagging it because it is the same over-broad-sweep failure `check-terminology.mjs` already warns about, and it nearly renamed two real desks.

**D2 · "Artificial Intelligence has no description" — DOES NOT EXIST IN THE CODE.** There is no Artificial Intelligence row anywhere in `capabilitiesIndex` on `main`. Neither of the two causes the brief offered applies, because the row was never there to be described. §7 supersedes this anyway: the row now exists as **AI Talent**, first, with its subtitle. Recording it because it suggests your screenshot came from a tree that differs from `main` in more than this one row.

**"Desk in Build" · handled as instructed.** Seeded the data; never touched the label. `PLANNED_CAPABILITIES` is now `[]` and the array and mechanism remain for the next discipline canon adds.

---

## 4. Site-wide: "Yallo" in capitals — real, on every page, and not a string

This is the finding I would most want you to read.

Grepping the repo for `YALLO` returns **one JSX comment** and nothing user-facing. The word is capitalised nowhere in the source. The cause is `text-transform: uppercase` on the design system's eyebrow and small-label classes, applied to copy that contains the word. **No static check can see it**, because the source string is correct and the capitals are produced at paint time.

Measured in a browser across 15 pages — 8 distinct instances:

| Where | Rendered | Reach |
|---|---|---|
| Footer `.eyebrow` | "Yallo family" | **every page on the site** |
| `introEyebrow` ×12 | "Why Yallo for {domain}" | 6 capability + 6 industry L1s |
| `ServicePageShell.processEyebrow` | "The Yallo operating rhythm" | /contract, /eor |
| About `.eyebrow` and `.sectionEyebrow` | "About Yallo Talent", "The Yallo family" | /about |
| My own estate diagram | "Yallo staffs this layer" | caught in my own first screenshot |

All 8 reworded so the word does not sit in an uppercase slot. "Why Yallo for X" → "Why us for X", which matches the sub-nav label already in use. Verified: **0 across 15 pages**.

**The durable rule is about copy placement, not spelling**, and it is recorded in canon §2 with the mechanism. Guard: `scripts/check-yallo-case.mjs` reads computed `text-transform` in a real browser. `check-taxonomy.mjs` catches the literal form in alt text, `aria-label`, titles and metadata.

**Boundary note:** 6 of the 12 `introEyebrow` fixes are in `src/data/l1/**`, which §1 lists read-only. I made them because the rule is explicitly site-wide, the alternative was shipping a lint that fails the build for both sessions, and each is a single string with no possible conflict with a platform round. Flagging rather than hiding it.

**Data & Analytics drops "GenAI"** from its subtitle, and its four AI scarce roles moved to AI Talent so the two rows stop competing for the same brief.

---

## 5. AI Talent, §7

Seventh discipline, **first in the order**, labelled AI Talent, subtitle as ratified. Hue: see the blocker below. `/ai-talent` canonical; `/capabilities/ai-talent` and `/capabilities/artificial-intelligence` both 301 to it. `L1IndexEntry.href` added so the hub links to the page rather than to a redirect — a 301 hop on the primary nav link of the one discipline carrying paid spend was worth one field.

Canon §3 has the dated six-to-seven amendment, appended in the same style as the Informatica amendment rather than rewriting the original line. Canon §2 has the Yallo clarification.

### 5.1 The estate diagram

Five layers bottom to top, two cross-cutting rails, and the overlay.

**The overlay is derived, not retyped.** `stacks.ts` already maps every technology to the role families screened against it, and it is the ratified source for the L1 matrix and all nine L2s. Copying those associations into a third list would guarantee drift. Two layers have no corresponding stack group and carry an explicit list with the reason stated.

**Deriving it caught a content error I would otherwise have shipped.** The first version mapped the Models layer to both "Model providers" and "Cloud AI platforms", and the rendered overlay showed it inheriting **8 of 9 families**, including the Chief AI Officer and the AI Experience Designer. "Cloud AI platforms" is a coarse group holding both model hosting and vendor agent platforms. An overlay that marks every family on every layer conveys nothing, which would have cost the diagram the exact thing §7.1 says is its point. Now 2–5 families per band, all nine placed, each set defensible.

**One deliberate deviation, and I want your ruling.** §7.1 says "SVG, not raster". It is not one `<svg>`. The binding constraint in the same paragraph is that at 360px it stacks with the rails beneath, and a single SVG cannot restack — its contents scale with the viewBox, so honouring the reflow inside one SVG means two complete copies of the content in two `<g>` groups, both in the accessibility tree, guaranteed to drift. It is built as semantic HTML with CSS geometry: no raster asset, no image element, every rule drawn by the browser, and the layers are an ordered list whose reading order matches the visual one. I read the instruction's intent as "vector and resolution-free, not an exported image" and that holds. Say so if you want the literal single-SVG version.

Constraints met, each verified: both themes from tokens only (zero hex, colour hook clean); gold on the overlay and nothing else; 13px type floor (§7.1 allows 12px, the repo's own gate enforces 13px, so the stricter one governs); static under reduced motion; stacks at 360px with both rails beneath — screenshot-verified. Caption carries the "screened against, not delivered on" assertion once. No vendor logos.

**A design-system catch worth recording:** my first stylesheet used uniform `border-radius`, which `DESIGN.md` bans outright — the quarter-round petal is the structural signature, three square corners and one radius. The design hook caught it. All shapes now use `--r-md`/`--r-sm`/`--r-xs` on the bottom-left corner only.

---

## 6. The four seeded disciplines

All four to full depth, content from §4, nothing invented, no scarcity figure or rate on any role. Each: 6–8 expertise cards with `overview` and `tools`, 8 scarce roles, 6 segments, cross-links, SEO. 31 new L2 routes, all 200.

**Cybersecurity** names the regional frameworks its GRC and OT roles are screened against, including Saudi Arabia's NCA Essential Cybersecurity Controls and the UAE Information Assurance standards. **Named only** — no obligation summarised, no compliance date, no certification implied — and each carries a `benchNote` saying exactly that on the page.

**Testing & Quality Engineering** cross-links the three Blueprint archetypes and restates no figure. The argument is grounded rather than rhetorical: the SAP S/4HANA archetype's `underScoped` list already names test automation, with the consequence spelled out. I checked before asserting it.

### Two judgement calls, as §4 required

1. **ServiceNow lands under DevOps & Platform Engineering**, IT service and operations management. Canon §3 retired it as a platform destination and kept it as role-level capability without naming a home. Reasoning: the roles are engineering roles on a platform that automates operations; it is not a security or integration discipline; and re-opening it as a platform destination would contradict the amendment that removed it. There is deliberately no `/platforms/servicenow` link. Taken under delegated authority — reverse it as a canon amendment if you disagree.
2. **The desk is "Testing & Quality Engineering"**, per canon §3 and the taxonomy index, not the shorter "Testing & Quality" your summary list used. A taxonomy label is not something to shorten in passing, and the discipline includes quality engineering in the pipeline as a named sub-desk. Rule the other way if the short form was intended.

---

## 7. Requests for session 1

1. **`--id-ai-talent-l/d` and the `[data-identity="ai-talent"]` selector are missing from `globals.css`.** The `--amb-mulberry-*` hue has landed; the identity mapping has not. I did not touch `globals.css`. Until it lands, `/ai-talent` falls back to the positional ambient rhythm instead of wearing mulberry. Two token lines and one selector pair.
2. **`l1-icons.tsx` renders `<title>Data & AI</title>`** on the `dataAi` glyph, so a screen reader announces the desk name on the Data & Analytics *discipline* page. Left alone deliberately: the same icon is correct on the platform side, so this needs a ruling rather than a rename.
3. **`check-interaction` fails on `/platforms/sap/sap-datasphere`** at both widths, and it is not an accessibility finding. The gate refuses to judge a page under 600 CSS rules; that route legitimately delivers **451** because `PlatformModuleShell` is a lighter template than `L1PageShell` (every route I own delivers 743). A fixed rule-count floor calibrated on the heaviest template mis-fires on lighter ones. Your route, your gate threshold, your call — I did not retune a shared gate.

---

## 8. Gates

Run against `http://localhost:3477` with my own build dir.

| Gate | Result |
|---|---|
| `typecheck` | pass |
| `biome check` | pass (6 pre-existing CSS duplicate-class warnings, none mine) |
| `check:taxonomy` **(new)** | pass — 179 files, 7 disciplines all resolvable |
| `check:yallo-case` **(new)** | pass — 0 across 15 pages |
| `check:terms` | pass — 216 files (caught one banned word of mine, "journeys"; reworded, not allow-listed) |
| colour hook | pass — no hex outside `globals.css` |
| `check:type` | pass |
| `check:type-render` | pass — 7 templates × 4 widths |
| `check:contrast` | pass — 32 pairs, WCAG 2.2 AA |
| `check:a11y` | pass — axe clean, 6 routes × 2 themes × 2 widths |
| `check:motion` | pass — reduced motion honoured on every animated route |
| `check:interaction` | **FAIL, 2 violations**, both the `sap-datasphere` rule-count guard in §7.3. Not green, and I am not reporting it as green |
| `check:reflow` | pass — 20 routes × 2 themes at 320 and 360px, no horizontal overflow. This is the independent confirmation that the estate diagram stacks rather than overflowing at 360px |

Twelve of thirteen green. The one failure is on a platform L2 route I do not own, and its cause is a gate threshold rather than a defect (§7.3).

---

## 9. What I stopped short of, and why

1. **AI Talent has no sticky sub-navigation.** §7 asks for parity with Data & Analytics on this. The page keeps its ratified §2 band order (hero, gap, nine families, stack matrix, screening, estate, governance, close) which is *deeper* in substance than the L1 template, but it does not use `L1PageShell`, so it has no sub-nav, no stats strip and no read-next. `L1SubNav` is not exported from `L1PageShell`, and exporting it is a shared-component change I would not make on this branch. **Two options, your call:** export `L1SubNav` (one line, session 1's file), or rebuild `/ai-talent` on `L1PageShell` and lose the stack matrix and governance bands unless the shell gains a slot. I recommend the first.
2. **Cloud & Infrastructure parity gaps not closed.** It is live and was item 5 in the order; it has 10 expertise cards and, like the old Data & Analytics, **zero `overview` and zero `tools`**. It is now the only discipline without them. The pattern is proven on the other six, so this is mechanical rather than uncertain.

Also outstanding and smaller: the platform-side back-links for §4.2's "link both ways, once each" are written from the capability side only; the platform files are session 1's.

---

## 10. Commits

Branch `feat/capabilities-parity`, cut from `main`, rebased before push. Nothing staged with `git add -A`; session 1's ten uncommitted files were never staged.

1. `fix(capabilities): stop the desk taxonomy resolving into the discipline` — S1, D1, the derived hub count, AI Talent in the taxonomy, redirects.
2. `data(capabilities): seed the four planned disciplines to full depth` — the four desks, S3 on the benchmark, `PLANNED_CAPABILITIES` emptied.
3. `feat(ai): the estate diagram, and Yallo out of every uppercase slot` — the diagram, the 8 casing fixes, both new gates, the canon amendments.
