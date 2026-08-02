# Context — Round 7 rulings, evidence integrity and the case study family

**v1.0 · 2 August 2026 · Chat lens, adjudicating relay v11.0 (session A) and capabilities v5.0 (session B)**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`.
A reads §1, §2, §3, §6. B reads §1, §2, §4, §7. C reads §1, §2, §5, §6.

---

## 1. Process

### 1.1 Three sessions this round, not two

The default is two. Round 7 gets three because a genuinely disjoint territory with a full run's work in it has appeared: the case study page family. It touches `src/app/case-studies/**` and its own components and almost nothing else.

| Session | Territory | Branch | Port |
|---|---|---|---|
| **A** — integrator, shared foundations | `src/components/blocks/**` shared marks, `src/lib/**`, `scripts/**`, `src/app/robots.ts`, `src/lib/seo.ts`, the homepage case-study rail | `fix/round7-system` | 3107 |
| **B** — data and copy | `src/data/**`, `content/**` | `feat/round7-content` | 3207 |
| **C** — case study page family | `src/app/case-studies/**`, `src/components/blocks/case-study/**` | `feat/round7-casestudy` | 3307 |

A merges, commits context docs, creates both other worktrees, and prints the handshake. Nobody starts until it does.

### 1.2 Pre-adjudicated conflicts — four, resolved here rather than at the merge

1. **`src/lib/case-study-order.ts`.** A creates it. C imports it and never writes it. The signature is fixed here so neither invents it:
   ```ts
   export function orderedCaseStudies(all: CaseStudy[]): CaseStudy[]
   export const HOMEPAGE_CASE_STUDY_COUNT = 4
   ```
   Order comes from `content/case-studies/order.yaml`, a single list of slugs. Unlisted published slugs append in date order. A slug in the file that resolves to nothing is a gate failure, not a silent skip. A ships the file with the current order; Sumeet reranks after the merge.
2. **The client mark component.** A creates one `<ClientMark>` and it is the only place a client or platform mark is rendered anywhere on the site. B and C consume it by reference. **Fork it and that work dies at the merge**, because A is actively replacing the sizing logic underneath it.
3. **The case-study source data.** B owns it entirely. C reads and never writes. If C needs a data change, it logs it in its relay.
4. **`src/data/home/place.ts`.** B fixes the Blue Yonder mark path in the data. A does not touch that file; A's work there is the rendering component only.

### 1.3 What held in round 6, and keep

Zero conflicts on the round 5 merge — the file-class split did not leak. B checked ancestry rather than assuming for the third round running. A committed context docs first and fast-forwarded `main` before B cut. All three carry forward.

---

## 2. Round 6 adjudication

### 2.1 Accepted, do not relitigate

| Item | Position |
|---|---|
| The conformance inventory finding: `/ai-talent` shared **one** band, not six | **Accepted.** This is the round's most valuable output and it is measure-before-diagnose working exactly as intended. Decision 3 was written against a starting point nobody had measured |
| `#ai-governance` absorbed — a second copy of the right rail that disagreed by one framework while both rendered 900px apart | **Accepted.** Same class as decision 2, found by the same test |
| The tier gradings for n8n, Weaviate and Qdrant | **Accepted, and the stated test is promoted to canon.** "Bought means it cannot run in production without a commercial agreement" is a line a procurement team would draw, and it is better than the one I wrote. See §9 |
| Gold on the lit interaction state | **Accepted.** §3.2 governs the resting band, canon §5 governs interaction, and a non-gold highlight would breach canon §5. The reading is right |
| The local ambient ladder replacing the positional one | **Accepted with the reasoning recorded.** Five grounds inside 0.026 luminance is R11's failure mode repeating. Half `--amb-alpha` to the governed value, measured, under the ceiling, and the contrast sweep that found 1.0 returns 4.69:1 is the objective-function approach working |
| Platform marks rendered as text, all seven | **Accepted.** Six marks and one text label would demote the seventh below the ordering canon R-INF2 gives it. All-or-nothing is the honest reading |
| `L1WhatWeDeliver` and `L1ReadNext` not added | **Accepted for now.** Both need authored `L1PageData` and adding either is authoring. Folded into the migration decision at §10 |
| Deleting the two false positives rather than allow-listing them | **Accepted** |
| B: the two flagged sites at §2.3 are correct code, not dead copy | **Accepted.** The specialist-desk array and Informatica-as-a-product-name are both real. Promoting rules 6 and 7 as they stand would fail the build on correct code |
| B: `FMCG Manufacturing`'s pills are not a subset, both segments stay | **Accepted.** The test was applied literally as instructed and returned the right answer |
| B: `insightsSub` field kept, only the authorship clause removed | **Accepted.** "Opinionated, specific, useful." is not an authorship claim |

### 2.2 Reversed

**The vendor agent platforms return to layer 04.** Salesforce Agentforce, SAP AI Core and Joule and Oracle AI Services move back from layer 05 to Orchestration and agents.

A's reasoning was sound and the conclusion is still wrong. Two reasons:

- **Layer 04 is named "Orchestration and agents" and it now carries zero bought products.** On the layer where the enterprise question is most contested, the band currently says nobody buys anything here. That is the opposite of what the tier grading exists to show, and it is the layer a competitor would point at.
- **The problem A solved was a rendering-order problem and the tier already solves it.** §5 ratified that bought leads its layer, prominently. A buyer does not meet LangGraph before Agentforce because Agentforce sits at the head of layer 04, not because Agentforce has been moved to a different layer.

A was right to flag that ratified prose had moved and right not to treat it as binding once decision 2 deleted it. The flag is what made this reviewable.

**Consequence to check after the move:** layer 05 drops to roughly two bought and layer 04 gains three. If layer 05 falls below three entries in total, report it and stop rather than backfilling. An honest thin layer beats an invented one.

### 2.3 Escalated to Sumeet

Listed at §8. Four items, none blocking.

### 2.4 Recorded, no action

B's phantom `check-a11y` and `check-interaction` failures were four Chromium instances starving the AVIF encode, ruled out against a merge-base rebuild rather than assumed. Recorded because it presents exactly as a regression in the change under test. Run one gate per invocation.

`pnpm lint` on source is **37 and 13**, identical on the merge base. Round 6's file said 38; 37 is correct.

---

## 3. Session A — shared foundations

Branch `fix/round7-system`. In order.

### 3.1 Housekeeping and the handshake

Per §1.1 and §1.2. Both worktrees created by A, both context docs committed first, `main` fast-forwarded before either cuts.

### 3.2 Optical mark normalisation — the class fix

The substance of A's run and the reason is at §6. One `<ClientMark>` component, one measured normalisation, one gate. It serves three surfaces that are currently each broken differently: the homepage client rail, the homepage platform axis, and the case-study cards.

### 3.3 The case-study ordering library

`src/lib/case-study-order.ts` to the signature in §1.2. A also ships `content/case-studies/order.yaml` carrying the current order, and wires the homepage rail to take the first `HOMEPAGE_CASE_STUDY_COUNT`.

### 3.4 The Cloudflare crawler probe, and the environment-driven robots policy

Deadline-bound: **15 September 2026**, when Cloudflare begins evaluating multi-purpose crawlers under all their behaviours, so a zone blocking Training also blocks Googlebot. Full reasoning in `context-discoverability-addendum-cloudflare-and-domains.md` §10.

The probe runs against the **live yallo.co**, which sits behind the same Cloudflare zone as the future site, so the posture is measurable today without waiting for cutover. Specification at §10.3 of that file. Two details worth repeating because they are where this check usually fails: assert on a known string in the page body, not on the status code, because a Cloudflare challenge returns 200; and probe the placeholder host too, since it may not sit behind Cloudflare at all, in which case `robots.ts` is the only control there.

`robots.ts` and `SITE.url` become environment-driven in the same change: the full three-family allow on the production host, `Disallow: /` for every family on any other host.

### 3.5 `check:yallo-case` has a gap, and case study content is sitting in it

The gate reads computed `text-transform` in a real browser, because canon §2's incident was capitals produced at paint time. Case study bodies now contain **literal** capitals — "YALLO partnered with", "YALLO's Role" — which no paint-time check can see, because nothing is transforming them. Extend the gate to fail on the literal string in rendered text as well. B sweeps the occurrences; A closes the hole so the next one fails the build.

---

## 4. Session B — data, copy and the evidence audit

Branch `feat/round7-content`. In order. Item 1 outranks everything else on this list.

### 4.1 The case study evidence audit — the highest-severity item in the round

Full rule at §7. In short: the homepage evidence band is headed "Named clients, named platforms, published work" and it is currently rendering the same client three or four times, two pairs of near-identical stories, and one card reading "Undisclosed enterprise". Every entry is audited against the eight real published case studies. Anything not traceable to one published source is **deleted, not rewritten**.

### 4.2 The literal capitals

Sweep "YALLO" from every case study body and heading. Canon §8 says case study bodies are Yallo's own published words verbatim; canon §2 says Yallo is never set in capitals. **Canon §2 governs.** The casing of the company's own name is house style, not a fact of the source, and "verbatim" protects substance rather than typography. A closes the gate gap in parallel.

### 4.3 The Blue Yonder mark path

`/platforms/blue-yonder` renders the **SAP** mark on the homepage platform axis. `blue-yonder.png` exists in `public/logos/platforms/`. This publishes a false vendor association on the homepage and it ranks above every design item on B's list for that reason. Fix the path, then check every other mark path resolves to the vendor it claims.

### 4.4 The client register becomes the single source for client identity

Case study cards currently carry their own client name string: one reads "Sephora Middle East" where the register reads Sephora. Client display name and mark both derive from the client register, everywhere a client is named or marked. This is the eleventh instance of the derivation class and it is closed the same way as the other ten.

Where a client has no mark asset, the card falls back to the register's display name set in the site's own type. That is honest. A longer regional variant of the name is not, because it is a second source of truth wearing a display name's clothes.

### 4.5 Clients with no mark do not appear in the client rail

Sephora, Wickes and Radwell render as text in a rail canon §8 defines as uniform monochrome marks. A text wordmark in a mark rail breaks the uniformity the rail exists to have. Gate rail membership on the mark asset existing, list which are missing in the relay, and Sumeet supplies them. This is the same all-or-nothing reasoning A applied correctly to Informatica in round 6.

Note the distinction from §4.4: a missing mark removes a client from the **rail**, because the rail is nothing but marks. It does not remove a **case study**, because a case study is content and the client name carries it.

### 4.6 The commitment section

Three changes.

- **Order.** Contract before Permanent. Canon §1 makes contract the lead pillar and the section currently reads permanent-first.
- **Eyebrow.** "CONTRACT HIRING" becomes "CONTRACT WORKFORCE". "PERMANENT HIRING" is unchanged. This is a card eyebrow only: the pillar in canon §1 and in the navigation stays **Contract**.
- **Headline.** "What sits in the contract, not just on the website." becomes **"What sits in the agreement, not just in the pitch."** Authored here for ratification. "Contract" comes out because it collides with the service line two inches below it; "website" comes out because a site telling you it is a site is the interface describing itself, which canon §2 already bans in microcopy form.

The sub-line "Permanent and contract carry different terms. Both are in writing before you brief us." is unchanged and lower-case "contract" there is the ordinary noun, not the pillar.

### 4.7 The step badges

Remove `YOU AND WE` and `WE` from the four shortlist steps. The four steps read as a sequence without them, and a badge that says "we" on three of four cards carries no information.

---

## 5. Session C — the case study page family

Branch `feat/round7-casestudy`. The template brief is the substance.

### 5.1 What is wrong with the current template

Measured from the rendered page, not described:

- A **blurred gold orb** in the hero. Canon §5 bans blurred orbs outright.
- The **register is dark**. Canon §5 makes light the working default with dark bands reserved for evidence and data surfaces, at most two per page.
- H1 **centred** over a left-aligned body column, which is the source of the visual disjunction.
- Content in a **narrow left column with the right half empty**. Not a measure, a gap.
- Section headings at **small serif with no hierarchy** — "Client Context", "YALLO's Role" read as bold paragraphs rather than as structure.
- A large **dead vertical gap** between hero and first content.
- **No taxonomy chips, no metrics, no client mark, no next, no CTA.** The page ends and offers nothing.

### 5.2 The reference pattern, read rather than assumed

Both Reply Group pages Sumeet supplied use one template. The mechanism worth taking is a **two-level section heading**: a fixed uppercase section label (THE CHALLENGE, THE SOLUTION, HOW WE DID IT, THE RESULTS) with an authored descriptive subhead beneath it. The label is template; the subhead is where the specificity lives. That is why their pages read as substantial while carrying roughly the same word count as ours.

Also taken: a standfirst under the H1, topic chips in the hero, imagery interleaved between sections rather than banked at the top, and an entity card at the end.

Not taken: the hero photograph, because canon §5 bans stock photography and people-and-places imagery.

### 5.3 The template

Light register throughout, with **one** dark band, the metrics strip. Single column, measure capped near 68 characters, left-aligned throughout, no centred H1.

| # | Block | Content |
|---|---|---|
| 1 | **Hero** | Eyebrow chip `CASE STUDY · {CLIENT}`, left-aligned. H1 descriptive. Standfirst, one sentence. Taxonomy chips — pillar, platform, sector, region — each an internal link. Ground is the PetalPlate from the slug. No orb |
| 2 | **The engagement strip** | What Yallo placed: roles, count, platform, duration, region. Mono, tabular. This block does not exist on any competitor's case study and it is what a talent buyer scans for |
| 3 | **Four movements** | Mono section label at 13px, tracking ≥0.12em, plus an authored Newsreader subhead, plus body. THE CONTEXT · THE CHALLENGE · WHAT YALLO DID · THE OUTCOME. The labels are fixed; the subheads are authored per case study and come from the published source |
| 4 | **Metrics strip** | The one dark band. Only where the source carries sourced figures. Every figure carries a source per canon §6. No sourced figures, no strip — the no-empty-slot rule |
| 5 | **The client card** | Mark via `<ClientMark>`, one-line description, region. Only what the published source says. No invented boilerplate |
| 6 | **Next case study** | One, from `orderedCaseStudies`. Not a grid |
| 7 | **CTA** | Start a brief. Programme-shaped |

Blocks 2, 4 and 5 render nothing when their data is absent. A case study with no metrics is not a broken page.

### 5.4 The landing page

`/case-studies` lists in `orderedCaseStudies` order. Same `<ClientMark>`, same card component the homepage rail uses, filterable by pillar, platform and sector using the existing taxonomy indexes and never a hand-written list.

### 5.5 The excerpt rule, gated

Canon §8: excerpts are compression of the body only, never new facts. Sumeet asked how this holds once full articles exist.

The card excerpt is a schema-enforced `summary` field with a length budget. The gate that catches the real failure mode is cheap: **every proper noun in the summary must appear in the body.** A client, platform or figure that appears on the card and nowhere in the article is exactly the defect, and it is mechanically detectable.

---

## 6. The optical mark rule, stated once

Sumeet has raised inconsistent mark sizing three times. Twice it was fixed by hand-tuning individual widths, and twice it came back. That is the signature of an instance fix applied to a class problem.

**The cause.** A mark's bounding box is not its optical weight. A wordmark like RICHEMONT fills its box horizontally and reads large; a compact device like Al Othaim's fills a fraction of the same box and reads tiny. Setting every mark to the same height or the same width guarantees they look different.

**The rule. Normalise on rendered ink area, not on box dimensions.** For each mark, measure the bounding box of its non-transparent pixels, compute the ink area as a proportion of the rendered box, and scale each mark so its ink area lands within a tolerance band of the set's median.

**Specify the objective function, not the values.** Do not hand-write a scale factor per logo — that is what produced this. Compute the factors, and record them in data so they are reviewable, but derive them by measurement.

**The gate.** `check:marks` renders every mark on every surface and fails when any mark's ink area deviates from that surface's median by more than the tolerance. Sweep the tolerance to find the tightest value that the current asset set can actually satisfy, report the curve, and set the gate at that value rather than at a number chosen in advance. If a mark cannot reach the band because the asset itself is padded, report it as an asset defect rather than scaling it into distortion.

**Case-study card marks keep the rail's treatment.** They are currently dark ink on a near-black card, which is why they are invisible. The fix is the same monochrome light-ink treatment the rail already uses, at a normalised size — not a white plate. That gives Sumeet the legibility he asked for without a second mark treatment and without touching canon §8's never-a-mark-on-a-white-card clause. If he still wants plates after seeing it rendered, it is a one-line change.

---

## 7. The evidence audit rule

The homepage band is headed **"Named clients, named platforms, published work."** Every word of that is a claim, and three of them are currently false somewhere in the rail beneath it.

**What is visibly wrong.** Majid Al Futtaim appears three or more times. Alshaya appears three times. Two MAF entries — "Cutting MAF's T&M costs with one delivery partner" and "Cutting cost across MAF's multi-platform IT estate" — carry nearly identical bodies. "Unifying MAF's multi-vendor IT delivery model" and "Consolidating Alshaya's multi-vendor IT delivery into one model" are the same story against two clients. And one card reads "Undisclosed enterprise" directly beneath a heading promising named clients.

**What that pattern means.** Near-identical bodies against different clients is the signature of generated or duplicated content, not of eight sourced case studies. This is the same class as defect B5, and it is worse, because B5 was three unsourced statistics and this is the section whose entire job is proof.

**The audit.**

1. Locate and name the source of truth for case study entries. Do not assume it is `content/case-studies/`; report what it actually is.
2. Enumerate every entry with its client, pillar, platform, sector and slug.
3. Map each to one published case study from yallo.co or the legacy archive corpus. One source, one entry.
4. **Delete every entry with no source.** Do not rewrite it, do not anonymise it, do not park it as `published: false`. An entry with no source cannot be restored later because there is nothing to restore it from.
5. Delete "Undisclosed enterprise". An anonymised client is legitimate — canon's own `clientPublic: false` pattern renders a descriptor such as "a Middle East banking group" — but a placeholder string is not that, and it cannot stand under a heading promising named clients.
6. Report the full mapping table, including every deletion and its reason.

**The gate.** No two published case studies share a client, platform and outcome signature. Watched to fail by reintroducing one of the duplicates.

**The count is the test.** If eight published sources exist, there are at most eight entries. More than that means something was written rather than sourced, and it must go.

---

## 8. Still with Sumeet

1. **One SVG unblocks the platform marks.** `public/logos/platforms/` holds six of seven; Informatica has none. Its client-register mark must not be borrowed, because that would publish a client relationship through a side door. Supply a monochrome `informatica.svg` and both the estate band's layer 01 and the homepage platform axis switch from text to marks in one change.
2. **Three client marks are missing:** Sephora, Wickes, Radwell. Until they land, those clients do not appear in the client rail.
3. **The CPG suffix drift.** Seven of nine roles across `Consumer Packaged Goods (CPG)` and `FMCG Manufacturing` are arguably the same role at a different grade — Specialist against Consultant, Consultant against Architect, Lead against Consultant. My reading is that these are one desk under two names and the segments should merge, but merging pills and choosing a name are both authoring. Ruling needed; no session touches it meanwhile.
4. **Canon claims a gate that has never existed.** B checked `git log --all` on the path: `scripts/check-headings.mjs` has no history. Canon §9 R16 names it as the enforcement for "a heading may only assert what every row beneath it satisfies", and the completeness headings are exactly what it would have caught. Either the gate gets written or canon stops claiming it. **[REC]** write it in round 8 and correct canon now, because a canon that describes enforcement it does not have is worse than a canon with a gap.
5. **Healthcare and telco segments.** Unchanged from round 6. All 29 are work-shaped, the customer partition is written in each page's own `segmentsSub`, and it needs your ratification before it becomes data.

---

## 9. Canon amendments to ratify

Drafted. Nothing is in force until Sumeet ratifies.

**§3 — the tier test, in Code's words rather than mine.** A tool is *bought* when it cannot run in production without a commercial agreement. Everything else Yallo screens against is *engineered*. This supersedes the looser "an enterprise procurement route exists" and it is the line a procurement team would actually draw.

**§5 — mark normalisation.** Marks are normalised on rendered ink area against the set median, never on box height or width, and the tolerance is measured against the asset set rather than chosen. A mark that cannot reach the band is an asset defect, not a scaling problem.

**§8 — evidence integrity.** Every published case study traces to one published source. No entry is anonymised by placeholder string; canon's existing `clientPublic: false` descriptor pattern is the only anonymisation. No two entries share a client, platform and outcome signature.

**§8 — client identity derives.** A client's display name and mark come from the client register wherever a client is named or marked. No surface carries its own client name string.

**§2 — completeness claims** (drafted round 6, still unratified). A heading may not assert that the set below it is complete. Five headings currently carry the form and become a class sweep the moment this is ratified.

**§9 — correct the enforcement claim.** R16 names `scripts/check-headings.mjs` as enforcement. The file has never existed. Either write it or amend the clause.

---

## 10. Deferred to round 8, logged so it is not lost

- **`/ai-talent` finishes its migration onto `L1PageShell`.** `#ai-gap` and `#ai-screen` are still hand-built against `Home.module.css`. The round-3 ruling that rejected this was reasoned from the stack matrix and the estate diagram needing their own place, and half of that is now gone. **Direction ruled, do not relitigate:** the desk composes from `L1PageShell` with one typed custom-band slot, because a generic slot is what the Design System needs anyway rather than a special case for one page. `L1WhatWeDeliver` and `L1ReadNext` are decided inside that work.
- **`check:taxonomy` rules 6 and 7 promote**, after A widens the exemptions per B's §2.3: exempt a `name:` sitting beside a `vendor:` in the same object, and key the specialist-desk exemption off the array's contents rather than its variable name.
- **The 18 composed discipline strings.** Ruling, so it can be swept mechanically: **a position reproducing the taxonomy label in its canonical casing tracks the index; a sentence-register variant is authored prose.** That keeps "Why us for banking & financial services" authored and makes `eyebrow`, `introEyebrow` and `seo.title` on the capability files derive.
- **The five remaining completeness headings**, once §9's amendment is ratified.
- **`llms.txt`, per-page OG images from PetalPlate, and `Organization` schema with `sameAs`.** All three from the discoverability scope. Deferred behind the Cloudflare probe because none carries a date.
- **The title and H1 pass across the fourteen platform and discipline desks.**
- **`L1Segment.name` deletion**, still blocked on one generic-constraint relaxation in `src/lib/sectors.ts`.
