# Code → Chat relay — Capabilities parity round

**v1.1 · 2 August 2026 · Branch `feat/capabilities-parity` · Project GTM.01**
Supersedes v1.0, which is kept for its S2 correction trail.
Against `docs/design/context-capabilities-parity-round.md` v1.0 and `context-ai-talent.md`.
Ran in parallel with the platform round.

---

## TL;DR

The Capabilities pillar went from **two live disciplines to seven**, all at the same depth, with **48 L2 routes** serving. All three named Data & Analytics defects are fixed at the class rather than the instance. The four planned desks are seeded, so `PLANNED_CAPABILITIES` is now empty. The AI estate diagram ships with its role-family overlay derived from the existing stack matrix. Cybersecurity is renamed **Cybersecurity & Risk**.

**The single most transferable finding:** the same fault recurred **five times** in five different shapes. A taxonomy label copied by hand into a second place will always drift from the taxonomy, and each copy hid in a form the previous lint could not see. Three new lint rules now close that class.

Everything is committed and pushed. One item is pending and needs your ruling; three are flagged for the platform session.

---

## 1. What was done

### 1.1 The three named Data & Analytics defects (§3a)

**S1 · The discipline rendered as "Data & AI" — CONFIRMED, cause exactly as you hypothesised.**
Canon §3 runs two taxonomies sharing labels, and Relay v6.0's *desk* rename was applied by string match, taking the *discipline* with it. It rendered **13 times** on the L1, including in the `<title>`. Two carriers: `capabilitiesIndex.short`, and a hand-maintained `capabilityLabels` map inside `L2PageShell`. The map is deleted in favour of the existing `taxonomyLabels()`. Verified 13 → 0.
You also asked me to check Cloud & Infrastructure for the same leak: **it is clean** — the label is identical in both taxonomies, so there was nothing to diverge.

**S2 · "L2 links not clickable" — FOUND, and I got this wrong first time.**
I initially reported it as not reproducible, having measured the hub and the expertise grid. Both were genuinely clean. I had not opened the **Specialisms mega panel**, which is where it was. Your report was right and my measurement was too narrow.
`nav-config.ts` held a hand-written copy of the whole discipline taxonomy — seven labels and seven `published` flags. Seeding the four desks updated the hub and not the menu, so the menu went on marking four **live** pages "Desk in build" under the retired label "Artificial Intelligence". The tell was visible in your screenshot: the label was stale while the subtitle beneath it had already updated, because the subtitle reads from the index and the label did not. Now derived from a single predicate shared with the hub.

**S3 · Body thin against Retail and SAP — CONFIRMED, and measured.**
`retail.ts` populates `overview` and `tools` on all 20 expertise cards; Data & Analytics populated neither on any of its 7. That difference *is* the thinness: capability L2s opened with a one-line blurb where a sector L2 opens with a paragraph and a vendor band.
An earlier pass had declined to author these on the recorded ground that the only source was an untrustworthy workbook. I answered that rather than overruled it: **every product now in `tools` was already published in that file's own blurbs**, so the structure changed and the claims did not.

### 1.2 Index defects (§3)

**D1 · Testing & Quality Engineering's description — CONFIRMED.** It carried the retired `emerging-technologies` tagline verbatim, so the desk advertised blockchain and quantum talent. DevOps & Platform Engineering had the same class of orphan (`short: "Digital & DevOps"`, a retired desk name). Both fixed.

**D2 · "Artificial Intelligence has no description" — DOES NOT EXIST IN THE CODE.** There is no Artificial Intelligence row anywhere in `capabilitiesIndex` on `main`, so neither of the two causes the brief offered applies. §7 supersedes it: the row now exists as **AI Talent**, first, with its subtitle. Worth noting because it suggests your screenshot came from a tree that differs from `main` in more than that one row.

### 1.3 AI Talent as the seventh discipline (§7)

First in the order, labelled AI Talent, subtitle as ratified. `/ai-talent` canonical; `/capabilities/ai-talent` and `/capabilities/artificial-intelligence` both redirect to it. `L1IndexEntry.href` added so the hub links to the page rather than through the redirect — a hop on the primary nav link of the one discipline carrying paid spend was worth one field.

**The estate diagram (§7.1).** Five layers, two cross-cutting rails, and the role-family overlay. The overlay is **derived from `stacks.ts`**, not retyped, because that file already maps every technology to the families screened against it and is the ratified source for the L1 matrix and all nine L2s.
Deriving it caught a content error before it shipped: mapping the Models layer to both "Model providers" and "Cloud AI platforms" gave it **eight of nine families**, including the Chief AI Officer, because that second group holds both model hosting and vendor agent platforms. An overlay marking every family on every layer conveys nothing, which would have cost the diagram the exact thing §7.1 calls its point. Now 2–5 per band, all nine placed.

### 1.4 The four planned disciplines (§4)

All four seeded to full depth from the ratified §4 content: 6–8 expertise cards each with `overview` and `tools`, 8 scarce roles, 6 segments, cross-links, SEO. **31 new L2 routes.** No scarcity figure, count or rate on any role.
Cybersecurity names the regional frameworks its GRC and OT roles are screened against, including Saudi Arabia's NCA Essential Cybersecurity Controls and the UAE Information Assurance standards — **named only**, with a `benchNote` on each saying no obligation is interpreted and no certification implied.
`PLANNED_CAPABILITIES` is now empty. The array and mechanism stay for the next discipline canon adds; the marker was always data-driven, so seeding removed it rather than any label being deleted.

### 1.5 Cloud & Infrastructure brought to parity

It was the last discipline with zero `overview` and zero `tools` — once the others were done it had inherited S3's fault by default. All 10 cards now carry both. Every discipline is now equal on the measure that carried S3:

| Discipline | cards | `overview` | `tools` | size |
|---|---|---|---|---|
| Data & Analytics | 7 | 7 | 7 | 24 KB |
| Cloud & Infrastructure | 10 | 10 | 10 | 23 KB |
| Cybersecurity & Risk | 8 | 8 | 8 | 20 KB |
| Testing & Quality Engineering | 8 | 8 | 8 | 20 KB |
| DevOps & Platform Engineering | 8 | 8 | 8 | 19 KB |
| Integration & Middleware | 7 | 7 | 7 | 18 KB |

### 1.6 "Yallo" in capitals — real, on every page, and not a string

Grepping for `YALLO` returned one JSX comment and nothing user-facing. The word was capitalised **nowhere in the source**. The cause was `text-transform: uppercase` on the design system's eyebrow classes applied to copy containing the word. **No static check can see this**, because the source string is correct and the capitals are made at paint time.

Eight rendered instances, the largest being the footer's "Yallo family" on **every page on the site**, plus "Why Yallo for {domain}" on twelve L1s. All reworded so the word does not sit in an uppercase slot; "Why Yallo for X" became "Why us for X", matching the sub-nav label already in use. Measured before and after: **8 → 0 across fifteen pages.**

### 1.7 Cybersecurity → **Cybersecurity & Risk**

Renamed to match the `X & Y` shape, with cybersecurity **first**: seven of the eight sub-desks are security proper and GRC is the eighth, and every other pair in the index leads with its dominant term. "Risk & Cybersecurity" would have inverted that convention and demoted the search term. "& Risk" is earned by the GRC consultants, ISO 27001 lead implementers and the regional-framework screening — which is this desk's stated differentiator and a risk conversation, not a firewall one.

**The slug stays `cybersecurity`.** No redirect, and canon §3's slug list is untouched. A short slug under a fuller label is already the pattern: `finance` renders "Banking & Financial Services". It is also the better search target.

### 1.8 Two defects found while verifying, not reported by anyone

**Every capability L2 breadcrumb was a 404.** `L2PageShell` is shared by sector and capability L2s, but both crumbs were hardcoded to the sector tree, so `/capabilities/cybersecurity/identity-access-management` announced itself as "Industries / Cybersecurity" and its second crumb pointed at `/industries/cybersecurity`, which does not exist. **48 pages**, each with a dead link in the one control a reader uses to go back up. Now reads the L1's own `category`. No gate caught it: `routeExists` guards data-driven cross-links and this href was built from a literal.

**The scarce band's seam.** The band above is `amb-wash`, so its background runs through its own 72px of bottom padding, and `.scarce` began at 0 — the card's top edge landed exactly on the edge of that wash. Two filled surfaces meeting on a hard seam.
Measured separately, and this is why the fix is small: the **rhythm was already correct** at 115px from the band's last line to the card, against 117 and 118 on the neighbouring bands. So the fix lifts the card clear of the wash (20–32px) rather than restating the rhythm. A full sibling-sized padding would have opened a 190px hole. Affects every L1, sector pages included.

### 1.9 Mega-panel row alignment

The support line had a two-line clamp as a **maximum only**, so row height tracked how long each tagline happened to be (61px on one line, 80px on two) and the three columns did not line up.
I started by lengthening taglines and abandoned that: measured at 1280/1440/1728/1920, **the wrap point is not monotonic with viewport** — a 61-character line wrapped at 1440 and not at the other three — so any string tuned to one width comes apart at another. It is also unavailable for AI Talent, whose subtitle is ratified §7 copy. So the second line is reserved in CSS, and four taglines were lengthened as well so the reserved line carries content. Measured after: **every row in all three columns is 80px at all four widths.**

---

## 2. The pattern worth carrying forward

The same fault appeared **five times**, each in a shape the previous guard could not see:

| # | Copy of the taxonomy | How it showed | How it hid |
|---|---|---|---|
| 1 | `capabilitiesIndex.short` | "Data & AI" on the discipline, 13× | Looked like a legitimate short label |
| 2 | `capabilityLabels` map in `L2PageShell` | Same, on every capability L2 | A `const` map, so it read as config |
| 3 | `nav-config.ts` column | Four live desks marked "Desk in build" | An inline array, not a `const … Labels =` map, so rule 2 missed it |
| 4 | `HubLandingSections` rail | Missing AI Talent entirely | Same shape, different file |
| 5 | Cross-link `label` beside `href` | 7 stale labels after the rename | Looks like content, not taxonomy |

Three lint rules now cover the class, plus a browser-based gate for the casing fault a static check structurally cannot see.

**Two lint rules I had to narrow after they over-fired**, both worth recording because the failure mode is the same one the repo's own terminology script warns about:
- Banning `"digital twin"` as a substring flagged **"Digital Twin for Cities Consultant"** and the **"Digital Twin & IIoT"** sub-desk — both real, both published. The rule now matches the retired *phrase*.
- Demanding an exact cross-link label match flagged ten chips in the platform narrative bands written in deliberate sentence case ("Integration and middleware"). That is another session's copy style and not mine to overrule, so the comparison is now normalised for case and ampersands. It still catches what is a defect under any style: three links to data-analytics labelled "Data and AI".

---

## 3. What is pending

**One item, and it needs your ruling.**

**AI Talent has no sticky sub-navigation.** §7 asks for parity with Data & Analytics on this. The page keeps its ratified `context-ai-talent.md` §2 band order (hero, gap, nine families, stack matrix, screening, estate, governance, close), which is *deeper in substance* than the L1 template, but it does not use `L1PageShell`, so it has no sub-nav, no stats strip and no read-next.

Two ways, and I did not pick one because both have a cost you should own:
- **Export `L1SubNav` from `L1PageShell`** — one line, in the platform session's file, and `/ai-talent` keeps every band it has. **My recommendation.**
- **Rebuild `/ai-talent` on `L1PageShell`** — full chrome parity, but the stack matrix and governance bands have nowhere to go unless the shell gains a slot, and those are the page's most distinctive assets.

**Smaller and not blocking:** the §4.2 platform cross-links are written from the capability side only. The return links live in platform files owned by the other session.

---

## 4. Blockers and open questions

**Blocked on the platform session (three items):**

1. **`--id-ai-talent-l/d` and the `[data-identity="ai-talent"]` selector are missing from `globals.css`.** The `--amb-mulberry-*` hue landed; the identity mapping did not. I did not touch `globals.css`. Until it lands, `/ai-talent` falls back to the positional ambient rhythm instead of wearing mulberry. **Two token lines and one selector pair.**
2. **`Informatica` has no menu support line**, because it is absent from `platformsIndex`. It is the last unlevel row in the mega panel. It costs nothing else — the platform page supplies its own label, so there is no lowercase-slug fallback, which I checked. One index entry with a tagline fixes it, and writing platform copy is not mine to do.
3. **`check-interaction` fails on `/platforms/sap/sap-datasphere`** at both widths, and it is **not** an accessibility finding. The gate refuses to judge a page under 600 CSS rules; that route legitimately delivers **451**, because `PlatformModuleShell` is a lighter template than `L1PageShell` (every route I own delivers 743). A fixed rule-count floor calibrated on the heaviest template mis-fires on lighter ones. Their route, their threshold, their call — I did not retune a shared gate.

**Open questions for you:**

1. **The estate diagram is not a single `<svg>`, and §7.1 says "SVG, not raster".** The binding constraint in the same paragraph is that it stacks at 360px with the rails beneath, and a single SVG cannot restack — honouring that inside one SVG means two complete copies of the content in two `<g>` groups, both in the accessibility tree, guaranteed to drift. It is built as semantic HTML with CSS geometry: no raster asset, no image element, every rule drawn by the browser, and the layers are a real ordered list whose reading order matches the visual one. I read the intent as "vector and resolution-free, not an exported image". **Say so if you want the literal single-SVG version.**
2. **ServiceNow placement.** Canon §3 retired it as a platform destination and kept it as a role-level capability without naming a home. I placed it under DevOps & Platform Engineering, IT service and operations management, under delegated authority. Reversible as a canon amendment.
3. **"Testing & Quality Engineering" vs "Testing & Quality".** I used the canon label throughout; your dispatch summary used the shorter form. A taxonomy label is not something to shorten in passing, but say the word.
4. **Cloud & Infrastructure and DevOps & Platform Engineering share six sub-desk names** — platform engineering, SRE, Kubernetes, IaC, observability, FinOps. Canon ratifies both, so I did not fix it by deleting a side. I held the split **by subject**: on Cloud the work is the estate (landing zones, networking, migration); on DevOps it is the delivery system running on it (pipelines, release trains, IDPs, ITSM). It reads cleanly, but a buyer choosing which desk to brief has to draw that distinction unaided.
5. **The `contract-perm` split is uniform at exactly two per desk** across all six. The badge itself is deliberate and load-bearing — the section states "Contract unless noted" from data, and the chip renders only where a role deviates, so two badges means those two roles are also placed permanently. But *which* two is your commercial knowledge; I picked architect and lead-grade roles as plausible. Retail has one of eight, so the uniformity is my authoring artefact, not a rule.
6. **Redirects emit 308, not the 301 the brief names.** Next's `permanent: true` produces 308, and every taxonomy redirect already in `next.config.ts` uses that flag. 308 is a permanent redirect treated as equivalent by search engines. Changing these two alone would make them inconsistent with their twenty neighbours.

**Boundary crossings I made deliberately, all logged:**
- Six `introEyebrow` strings in `src/data/l1/**` (read-only per §1) for the Yallo casing rule, because it is explicitly site-wide and shipping the gate without them would fail the build for both sessions.
- Four label strings in `src/data/platforms/narrative.ts`, same reasoning, written in that session's sentence-case style rather than mine.
- `L2PageShell` and `L1HubShell`, for the taxonomy label maps and the breadcrumb. Scoped to taxonomy resolution; no styling touched.

---

## 5. Process finding worth keeping

**Port 3000 was running `next start` on a prebuilt `.next`, not `next dev`.** An entire measurement pass described a build snapshot from an earlier commit and I nearly reported it as current state — including a "13 occurrences" count that source edits then failed to change. Two sessions sharing one build directory is the underlying hazard. `next.config.ts` now honours `NEXT_DIST_DIR`, so each session can run its own server without corrupting the other's build.

**The branch is not a clean capabilities-only diff.** The platform session committed onto `feat/capabilities-parity` rather than its own branch — 7 of the 19 commits are theirs, interleaved with mine — and its commit `67ee943` swept up two of my in-flight edits. Nothing was lost and I have not touched their commits, but reviewing this branch as a capabilities diff will show platform changes I cannot speak for. Separating them is a rebase decision for you, not something I should do unilaterally to another session's work.

---

## 6. Gates

Run against a dedicated dev server on an isolated build directory.

| Gate | Result |
|---|---|
| `typecheck` | pass |
| `biome check` | pass (6 pre-existing CSS duplicate-class warnings, none mine) |
| `check:taxonomy` **(new)** | pass — 179 files, 4 nav files, 7 labels cross-checked, 7 disciplines resolvable |
| `check:yallo-case` **(new)** | pass — 0 across 15 pages |
| `check:terms` | pass — 216 files. Caught one banned word of mine ("journeys"); reworded, not allow-listed |
| colour hook | pass — no hex outside `globals.css` |
| `check:type` | pass |
| `check:type-render` | pass |
| `check:contrast` | pass — 32 pairs, WCAG 2.2 AA |
| `check:a11y` | pass — axe clean, 6 routes × 2 themes × 2 widths |
| `check:motion` | pass |
| `check:reflow` | pass — 20 routes × 2 themes at 320 and 360px |
| `check:interaction` | **FAIL, 2 violations**, both the `sap-datasphere` rule-count guard in §4. Not mine, and not reported as green |

**Twelve of thirteen green.** The one failure is on a platform route I do not own, and its cause is a gate threshold rather than a defect.

---

## 7. Verified end to end

- All seven disciplines serve 200; the hub reads "Seven cross-cutting capabilities" from a derived count.
- **48 capability L2 routes** serve 200 (17 pre-existing + 31 new).
- All three capability-shaped AI forms redirect to `/ai-talent`.
- Mega panel: seven rows, all links, correct labels, no "Desk in build", every row 80px at four widths.
- Capability L2 breadcrumbs resolve; sector L2 breadcrumbs unchanged.
- Estate diagram renders in both themes and stacks at 360px with both rails beneath.

Nothing in this document is claimed as verified that I did not observe.

---

## 8. Commits

19 on `feat/capabilities-parity`, of which 12 are mine. Every commit staged an explicit path list; no `git add -A`, and the other session's uncommitted files were never staged by me. Branch is pushed and level with its remote.

| Commit | |
|---|---|
| `3b76363` | `fix(capabilities)` stop the desk taxonomy resolving into the discipline |
| `9843379` | `data(capabilities)` seed the four planned disciplines to full depth |
| `c45847a` | `feat(ai)` the estate diagram, and Yallo out of every uppercase slot |
| `8de6564` `7b9c10b` | `docs(relay)` branch sharing, and the 308 convention |
| `64866ea` | `data(capabilities)` bring Cloud & Infrastructure to the same depth |
| `9c8ba11` | `fix(nav)` derive the Capabilities menu from the taxonomy, and level the rows |
| `56d60bf` | `docs(relay)` correct S2 |
| `dbf5560` | `feat(capabilities)` rename cybersecurity to Cybersecurity & Risk |
