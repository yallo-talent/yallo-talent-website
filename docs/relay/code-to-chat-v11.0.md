# Code → Chat, v11.0 — session A, round 6

**2 August 2026 · branch `fix/round6-system` · six commits · fifteen gates green on a production build**
Answers `docs/design/context-round6-rulings.md` §1, §2, §3, §5 and §6. Authority for everything below is that file, subordinate to `docs/design/yallo-talent-CANON.md`.

---

## TL;DR

Every §3 item shipped. The conformance inventory §3.1 asked for changed the round's diagnosis before any code moved: `/ai-talent` was not a discipline page with two unique bands, it was a separate page wearing the homepage's stylesheet, sharing **one** band out of eight with the L1 family. Decision 3's arithmetic was right about the destination and wrong about the starting point.

Three bands became one. The estate band absorbed the stack matrix per decision 2 and — a finding the ruling did not have — the governance band, which was a second copy of the frameworks list that **disagreed with the rail's by one entry while both rendered on the same page**. 42 tools now carry a layer and a tier, layer 01 derives the seven platform desks from `platformsIndex`, and the L2 is the same component with one prop.

Two things need Sumeet, both listed in §5 below. Nothing is blocked.

---

## 1. Process — §1

| Step | Result |
|---|---|
| Merge `fix/round5-system` → `main` | Fast-forward, clean |
| Merge `feat/round5-content` → `main` | **Zero conflicts.** §1 predicted one; the split did not leak |
| Context docs committed first | `e179e87`, `docs/design/context-round6-rulings.md`, the run's first commit |
| `main` fast-forwarded and pushed | `9bf2df7..e179e87`, **before** B cut |
| B's worktree | `feat/round6-content` cut from merged `main`, ancestry `0 0`, context doc visible, `node_modules` present |

**The §1 near-miss reproduced on my own first commit, and it was item 9's defect.** The docs-only commit left `src/components/blocks/l1/L1PageShell.tsx` modified in the working tree, because the pre-commit hook ran `biome check --write .` across all 194 files. I fixed the hook before doing anything else rather than at step 9, then proved the fix by reverting the collateral file and re-committing: nothing outside the staged set moved. Round 5's report of "A's file reformatted inside three of B's commits" was not a one-off — it is what that hook does on every commit in a two-worktree repository.

---

## 2. The conformance inventory — §3.1, rendered

Both pages rendered at 1280 and walked band by band. `/capabilities/data-analytics` composes **entirely** from `L1PageShell`. `/ai-talent` imports `Home.module.css` and hand-builds seven of eight bands.

| # | Standard band | `/ai-talent` | Verdict | Done |
|---|---|---|---|---|
| 1 | `L1Hero` + `HeroAtmosphere`, `amb-1` | bare `.section`, **no field, no `amb-1`** | Variant | Conformed |
| 2 | `L1StatsStrip` | **absent** | Missing | Conformed |
| — | `L1SubNav` | present | Standard | — |
| 3 | `L1Intro` `#why` | `#ai-gap` + `WhyRail` | Variant | Left: already the shared `WhyRail` |
| 4 | `L1WhatWeDeliver` | **absent** | Missing | Not added — see below |
| 5 | `L1HowWeWork` | `#ai-screen` | Variant | Left: different content, not a near-copy |
| 6 | `L1ScarceTalent` | absent | Conditional | — |
| 7 | `L1Expertise` | `#ai-families` | **Protected** (decision 3) | Untouched |
| 8 | `L1Segments` | absent | Correct (decision 4) | — |
| — | — | `#ai-stacks` dark band | **Unique** | **Deleted** |
| — | — | `#ai-estate` | **Protected** | **Rebuilt** |
| — | — | `#ai-governance` | **Unique** | **Absorbed** |
| 9 | `L1BottomCta` | present | Standard | — |
| 10 | `L1ReadNext` | **absent** | Missing | Not added — see below |
| 11 | `L1Insights` | absent | Correct | — |

**Two findings the relays had never recorded.**

1. **The desk shares one band, not six.** Decision 3 reads as though the desk conformed with two exceptions. Measured, only `L1BottomCta` and `L1SubNav` were shared. The round-3 ruling that rejected rebuilding on `L1PageShell` — "it would cost the stack matrix and the estate diagram their place" — was true then and half of it has now gone.

2. **`#ai-governance` was a second copy of the estate's right rail, and they disagreed.** `governanceFrameworks` in `index.ts` held **five** frameworks; `estateRails.right.items` held **four**, missing `ISO/IEC 23894`. Both rendered on the same page, roughly 900px apart. Exactly decision 2's class, found by the same test, closed by the same merge.

**Two standard bands deliberately not added, and both are judgement calls to overturn if you disagree.** `L1WhatWeDeliver` and `L1ReadNext` need authored `L1PageData` this page does not have, and `L1ReadNext` would duplicate the exits layer 01 now carries as links. Adding either is authoring, not conforming.

---

## 3. What shipped

### The estate band, §3.2

Five layers, two rails that span by geometry rather than by a sentence.

| Zone | Bought | Engineered | Roles |
|---|---|---|---|
| Rail · Evaluation and observability | 2 | 4 | 5 |
| 05 Experience and delivery | 5 | 0 | 6 |
| 04 Orchestration and agents | 0 | 8 | 6 |
| 03 Models | 10 | 1 | 6 |
| 02 Data and grounding | 8 | 4 | 6 |
| 01 Systems you already run | 7 platform desks, derived | — | 3 |
| Rail · Governance, risk and safety | 5 frameworks | — | 3 |

**42 tools**, matching §5's stated count exactly after Zapier and Make came off. No zone carries most of the family set; the largest is five of ten.

- **Layer 01 derives.** `estatePlatformDesks(routeExists)` → `platformNavEntries` → `platformsIndex`. The names **are** the links, so `estateBridge` and the button row it fed are retired. `check:taxonomy` rule 6 green throughout. The old layer prose hand-typed all seven names in a string — an eleventh copy no check could see.
- **Two zones carry no tools, and both are findings.** Layer 05's products are the ones a business user meets and layer 04's are all engineered, because agent orchestration has no enterprise procurement route yet. That is the clearest thing the tier grading shows.
- **Platform marks (§7 item 4): rendered as text, and the reason is a finding.** §3.2 makes marks conditional on their being wired to `public/`. They are — `public/logos/platforms/` holds **six of the seven**: `sap.svg`, `oracle.svg`, `microsoft.svg`, `salesforce.svg`, `workday.svg`, `blue-yonder.png`, already consumed by `src/data/home/place.ts`. **Informatica has no platform mark.** The only Informatica image in the repo is `public/logos/clients/informatica.png`, which is the **client-register** mark shipping at `consentOnFile: false` and renders nowhere until you flip it — using it here would publish a client relationship through a side door.

  So layer 01 renders all seven as text. Six marks and one text label would not be a partial win: it would visually demote the seventh below the ordering canon R-INF2 already gives it, on a layer whose entire argument is that Yallo staffs the estate. All-or-nothing is the honest reading of "if and only if". **One SVG unblocks this** — a monochrome Informatica mark at `public/logos/platforms/informatica.svg` and the layer switches to marks in one change.
- **Visually:** solid tonal grounds, hairlines, the petal on every block, no dashed boxes anywhere, gold on the role chips alone.

**One measured deviation, logged for your ruling.** §3.2 asks the grounds to step `.amb-1…6`. The hue does — `.amb-1` on every zone, mulberry via `data-identity`, no colour named in the component. The **step** could not: the positional ladder spans `--amb-step` 0.82 to 1.12, and the five grounds measured luminance 0.8099 / 0.8064 / 0.8029 / 0.7888 / 0.7835 — a range of **0.026**, five grounds nobody can tell apart. That is R11's exact failure mode. The ladder is local now and runs from half the governed `--amb-alpha` to the governed value itself, so **no ground on the band exceeds canon §5's ambient ceiling**. Measured after: 0.6705 → 0.5944 on light.

The first attempt spread ±50% around `--amb-alpha` and reached 45% on dark, which took `--text-2` to **3.62:1**. Swept the multiplier against composed contrast to find the ceiling: 1.0 returns 4.69:1, 1.1 returns 4.46:1.

**The gold overlay label went with the gold box it sat in.** §3.2 says role chips are the only gold and the label above them is not a chip; once the box was removed it also measured 3.76:1. One fix, two reasons.

### The L2 variant, §3.3

`<AiEstateDiagram family={f.slug} />`. One prop, one data path. `/ai-talent/llm-engineer`: four zones lit with the family's filtered tools, three present and dimmed, the governance rail still showing all five frameworks. `/ai-talent/ai-governance-lead`: only the governance rail lit, which is honest — that family is screened against frameworks, not tools. Dimming is by token swap, never opacity, because opacity would take the text below AA.

### The role-chip interaction, §3.4

Keyboard focus on `LLM Engineer` lights **23 tools across four zones**. Zero lit at rest, zero after blur. The untriggered DOM holds **47 tool nodes and 35 chips with nothing hidden or faded**. No transform, no shadow, no transition anywhere in the stylesheet, so `prefers-reduced-motion` is satisfied by construction rather than by an override.

**Gold on the lit state is a reading I want confirmed.** §3.2 says role chips are the only gold on the band; canon §5 says gold is the only colour that is ever interactive. I took §3.2 as governing the resting band and canon §5 as governing the interaction, so lit tools wear the chip's colour. The alternative — a non-gold interaction highlight — would breach canon §5.

### System, §3.5 and §6.4

- **`check:taxonomy` rule 5 promoted.** Sector labels in `src/data` now fail. Proven by typing `{ label: "Retail & Consumer" }` into `src/data/l1/retail.ts`: exit **1**, named the line; removed, exit **0**. Rules 6 and 7 stay reporting — 70 platform and 49 discipline copies are still live and that sweep is B's round 6 work.
- **Pre-commit hook scoped to `--staged`**, with the re-add restricted to the same list.
- **Meta descriptions, verbatim:**

| | Before | After |
|---|---|---|
| `layout.tsx` | `Specialist-screened shortlists in 72 hours. Middle East · Europe. Enterprise platforms: SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.` | `Specialist-screened shortlists in 72 hours. Middle East · Europe. Enterprise platform programmes staffed at module level, not at vendor level.` |
| `platforms/page.tsx` | `SAP, Oracle, Microsoft, Salesforce, Blue Yonder and Workday specialists. Specialists across the Middle East and Europe.` | `Enterprise platform specialists, screened at module level rather than by vendor name. Contract, permanent and EOR across the Middle East and Europe.` |

Neither list extended. Both verified in the served HTML.

### One new gate, not asked for

`scripts/check-estate-interaction.mjs`, registered as `check:estate`. §3.4's three conditions are all behavioural — none shows in a diff or a screenshot, and the cheapest future "simplification" (fading the unlit tools) passes every other gate while destroying the third. **Proven both ways:** removing `onBlur` latches the highlight and it reports 23 and 8 tools still lit; `opacity: 0.55` on `.tool` fails the untriggered assertion on both levels.

It corrected itself on its first run. The blur step used `Shift+Tab`, which from the first chip lands on the *next* chip, whose own `onFocus` correctly lights its family — a false failure on every L2 run. Moving focus is not the same event as losing it.

---

## 4. Gates — fifteen, all green

Production build, `NEXT_DIST_DIR=.next-a-r6`, port 3106, ownership confirmed by `lsof` before every measuring pass.

`typecheck` · `check:taxonomy` · `check:terms` · `check:type` · `check:contrast` · `check-colours` · `check:hue-separation` · `gate-coverage` · `check:a11y` · `check:motion` · `check:reflow` · `check:type-render` · `check:interaction` · `check:yallo-case` · `check:estate`

`gate-coverage` passes: no new route was added, so no guard list needed extending.

**`check:type-render` caught a real defect and it is A4's own worked example.** The role chips and platform-desk links shipped at 14px, and the gate reads the painted background to tell a filled control from a footer link. Raised to `--fs-body-sm` rather than exempted, because A4's floor went up *because* "role chips, module lists, metric labels" had settled at the smallest size on the page.

**Shots:** `docs/status/shots/round6-before/` and `docs/status/shots/round6-after/`, both pages, both registers, 360 and 1280. `/ai-talent` is **7,324px** after absorbing two bands, against 7,987px before carrying them separately.

**Not touched, as instructed:** the 38 ESLint errors (**37 now** — I removed none deliberately; one went with the deleted stack-matrix markup), `check-colours`'s `rgba()` gap, `BriefForm.module.css`, `docs/lti-reports/`.

---

## 5. For Sumeet

1. **Two tier gradings are judgements, not facts.** **n8n** is graded *engineered*: it sells enterprise licences, but the dominant deployment in the estates Yallo staffs is self-hosted, and grading it *bought* would stand it at the head of layer 04 beside nothing. **Weaviate and Qdrant** are graded *engineered* alongside `pgvector` while **Pinecone** and **Azure AI Search** are *bought*, on the line stated in `stacks.ts`: bought means it cannot run in production without a commercial agreement. All five are vector stores; a procurement team would draw the line there. Reverse either and it is a one-line change.
2. **The layer assignment of the vendor agent platforms.** Salesforce Agentforce, SAP AI Core and Joule and Oracle AI Services sit at **layer 05**, not 04, even though the old ratified prose named Agentforce and Joule under orchestration. §5's own worked example is that a buyer should not meet LangGraph before Agentforce, and putting the buyer-facing products at the top layer makes that structural rather than a matter of ordering a flat list carefully. The old prose is what decision 2 deleted, so I did not treat it as binding — but it was ratified text and you should know it moved.
3. **Gold on the lit state** — the §3.2 / canon §5 reading in §3 above.
4. **One SVG unblocks the platform marks.** `public/logos/platforms/` has six of seven; Informatica has none, and its client-register mark must not be borrowed. Supply `informatica.svg` and layer 01 goes from text to monochrome marks in one change. This also answers §7 item 4: defect M9's "sitting unwired in `docs/`" is out of date — six are wired and live on the homepage.
5. **Not in any ruling, spotted in passing:** `layout.tsx`'s description says "Middle East · Europe" and omits India, which canon §1's A6 makes a demand market in its own right. I did not change it: §6.4 authorised replacing the platform enumeration and nothing else, and the geography is copy. Flagging rather than fixing.

---

## 6. For the next round

- **Rules 6 and 7 promote the round after B's sweep lands.** The mechanism is in place; each needs one flag and one proof-by-defect.
- **`L1Segment.name`** stays deferred as round 5 logged it: A's one-line relax of `deriveSectorRail`'s generic constraint, B's mechanical delete of 49 fields.
- **`/ai-talent`'s remaining variance.** `#ai-gap` and `#ai-screen` are still hand-built against `Home.module.css`. They are not near-copies of a standard band, so conforming them means either authoring `L1PageData` for the desk or widening `L1PageShell` to take arbitrary bands. That is a real architectural decision and it did not belong inside this round.
