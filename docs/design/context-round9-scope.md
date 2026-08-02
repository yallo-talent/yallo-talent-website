# Context — Round 9 scope: close the remaining pages

**v1.1 · 2 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`.
Supersedes, as a scope source: the build-order table in `docs/relay/chat-handover-2026-08-02.md` §1, and §8 of `yallo-co-relaunch-GAME-PLAN-v1.2.md`. Both were written against the 29 July defect register and both are stale — platform detail, capability detail, the intelligence hub and the blueprint routes all exist on `main`.

*v1.1 adds the Impeccable protocol (§9) and the per-page close-out loop (§10). The round is a closure round, not an audit round: an audit finding that is not closed by morning has not been actioned.*

---

## 1. The ruling that sets this round

Sumeet, 2 August: **the 21 specialism desks across the three pillars — platforms, capabilities, industries — are complete and signed off.** Round 9 does not reopen them. It reads them as the quality bar for every other page, and it may fix a defect found in them incidentally, but it does not redesign them and it does not add desks.

Round 9's subject is **everything else**: the pages a buyer passes through around the desks, which have had less attention and are now the weakest surfaces on the site.

**The round's success condition is closure, not discovery.** A findings list with open items against it is a failed round. The measure is how many in-scope pages are finished, gated and committed by the time the session stops.

---

## 2. Page inventory

### In scope

| Group | Routes |
|---|---|
| **Engagement pillars** — first priority | `/contract`, `/permanent`, `/eor`, `/managed-delivery` |
| Homepage | `/` |
| Positioning and firm | `/why-yallo`, `/about`, `/leadership` |
| Conversion | `/brief`, `/jobs` |
| Evidence | `/case-studies`, `/case-studies/[slug]` |
| Intelligence landing | `/intelligence` — the landing page only |
| Legal | `/privacy`, `/terms`, `/cookies` |
| Global chrome | Header, mega menu, footer, and the shared shells these pages consume |

### Out of scope, explicitly

- **The 21 specialism desks.** Signed off. See §1.
- **Insight articles**, `/insights/*` — descoped to Raphy's pod per `yallo-talent-articles-handover-brief-v1_0.md`. Taxonomy routes may be checked for correctness; no article content is authored here.
- **Programme Staffing Blueprint content**, `/intelligence/programme-staffing-blueprint/*` — Sumeet is analysing the LinkedIn Talent Insights reports separately and a separate Code session will complete this. Round 9 does not touch the blueprint data layer or the archetype pages. The `/intelligence` landing may link to them and must not misstate what is behind the link.
- DNS, cutover, Volcanic wiring, WordPress teardown — team-owned per game plan §12.

---

## 3. The four engagement pillars — the deep dive

Sumeet's ruling: these are the most important pages on the site and they are currently thin. They carry the commercial proposition; a buyer who reaches one and leaves without understanding what they would be buying is the most expensive failure on the site.

Each pillar page must answer all of the following, in its own words, and each answer must survive extraction from its surrounding layout (canon §9's retrieval rule):

| # | The question | Note |
|---|---|---|
| 1 | Who is this for | The buyer role, named. Not "organisations of all sizes". |
| 2 | What Yallo actually does, step by step | The mechanism, not the promise. Where the specialist-screening step sits in it. |
| 3 | What the client receives, and when | Concrete deliverable and a real elapsed time where one is defensible. |
| 4 | The commercial shape | **No rates, fees or percentages** — canon rule, hard. Describe the shape: contingent, retained, fixed scope, pass-through. |
| 5 | The risk reversal, where one applies | Only where already ratified and already live elsewhere on the site. Do not author a new commitment. |
| 6 | Where this pillar ends and the next begins | The boundary. Including the saasinator boundary on Managed Delivery: Talent delivers fixed scope on the client's existing enterprise platforms; saasinator builds new AI-native systems the client owns. |
| 7 | Proof for this pillar specifically | Real case studies filtered to the pillar, from the existing verified set of ten. Nothing new is authored. |

**The four are asymmetric and must read that way.** Contract leads and should be the deepest page. Permanent is account entry and is senior and selective. EOR is an enabler inside contract, not a peer product. Managed Delivery is the up-market move and carries the boundary work in item 6. A four-page set where all four are the same length and the same shape has failed this brief.

**FAQ blocks are not authored this round.** They are the right pattern for these pages and they are the highest-value retrieval surface on the site, but every question needs a real procurement source. A session must not invent a buyer question. Log the slot; do not fill it.

---

## 4. EOR — the country set

**Ruling, Sumeet, 2 August: the EOR country set is the United Arab Emirates, Saudi Arabia and India.** The mega menu currently reads "UAE visa + India payroll cover" and omits Saudi Arabia entirely.

Two separate things follow, and they must not be conflated.

**a. The country set derives from one source.** Today the set is hand-typed in the mega menu and almost certainly hand-typed again on `/eor` and wherever else EOR is summarised. That is the hand-copied-taxonomy class this repo has now hit six times. One index, every surface maps over it, a lint for the next copy.

**b. The per-country service descriptor is NOT ratified and must not be invented.** "UAE visa" and "India payroll cover" are existing published claims. What Yallo offers in Saudi Arabia — entity, payroll, visa sponsorship, or some subset — has not been stated to this session. A session that writes "Saudi Arabia payroll cover" because it pattern-matches the other two has invented a commercial capability claim, which is the most damaging class of invention on this site.

**Resolution:** render the three countries at country level without asserting a per-country service, so the summary line names the corridor rather than the mechanism. Log the per-country descriptors as an open item for Sumeet with the exact question stated. If the existing UAE and India descriptors cannot be preserved without creating an asymmetry that implies Saudi Arabia is lesser, drop all three descriptors rather than invent the third.

---

## 5. Mega menu — the alignment defect

Observed by Sumeet on `localhost:3107`, the "How we work" panel: the list items sit hard against the panel's left edge and read as unindented relative to the eyebrow rule above them. He reports the same on "Evidence" and "Intelligence".

**This is an objective, not a value.** Do not apply a nudge in pixels taken from this document.

The objective: **one panel inset, expressed as a single token, applied to every mega-menu panel**, such that the list items, the eyebrow and the rule above them resolve to one optical left edge, and that edge relates to the panel's own container rather than to the viewport. Measure the rendered result at 1280 and 1440 in both themes, and confirm the panels agree with each other — three panels that each look acceptable alone but disagree with each other is the defect restated, not fixed.

Suspect the layer before you fix it. A list hugging its container's edge is as often a missing container inset, a reset stripping list padding, or a grid column starting in the wrong place as it is a padding value. Measure the DOM.

Because the mega menu is on every page, it is closed first, before any page work.

---

## 6. The review rubric

Not a read of the source. Render, then score. Fixed rubric:

1. **Honesty** — every figure carries a visible source; no heading asserts more than the rows beneath it satisfy; no claim the business cannot evidence. Highest severity, always.
2. **Accessibility** — AA in both themes, `:focus-visible`, reduced motion honoured, no images-as-content, type floor respected.
3. **Correctness** — every internal link resolves in one hop; no taxonomy label hand-typed where an index exists; metadata and `<title>` correct per page.
4. **IA** — does the page sit where a buyer would look for it, and does it route onward to the right next page rather than to the homepage.
5. **Completeness** — does the page answer its own question, or does it stop at an assertion.
6. **Design** — register consistent with the signed-off desks: paper grounds, Newsreader/Inter/IBM Plex Mono, petal signature, at most two dark bands, PetalPlate imagery only.

Severity order for fixing is the order above. A false claim on one page outranks a misaligned menu on every page.

**Reflow, 360 to 1440, both themes, is part of the review and not a separate pass.**

---

## 7. Forbidden, concretely

- No invented person, client, quotation, metric, source, case study, date or capability claim.
- No "coming soon", no dash-filled cell, no plausible placeholder, no lorem.
- No new case study, no eleventh entry — the Oracle EBS/TCS study is real but its addition is authoring and sits with Sumeet.
- No rates, fees, day rates or percentages anywhere public.
- No stock photography, no hotlinked imagery, no people-and-places imagery. PetalPlate only.
- No new risk-reversal commitment, no new guarantee wording.
- No `Person` schema until real named consultants exist.
- No FAQ content (see §3).
- No touching the blueprint data layer (see §2).
- UK English, no em dashes, banned vocabulary per canon §2, lint-enforced.

---

## 8. Open items this round will produce, not close

Expected back in the relay rather than fixed:

- EOR per-country service descriptors (§4b).
- FAQ question sources for the four pillar pages (§3).
- Anything on `/leadership` that needs a real named consultant — canon §8's no-invented-people rule is at its strongest here, and a thin real page beats a full invented one.
- Any pillar content that needs a commercial fact only Sumeet holds.

Everything else is expected closed.

---

## 9. The Impeccable protocol for this round

Impeccable runs as the design layer of the close-out loop. It is powerful and it is directional, so the constraints below bind it and are not negotiable by the skill's own routing.

### 9.1 Refinement, never redesign. Ratified, do not relitigate.

`DESIGN.md` is written, the visual world is committed, and 21 desks are signed off against it. Impeccable's own rule is that *refinement preserves and redesign replaces, and you never split the difference*. **This round is refinement, on every surface, without exception.**

Concretely, and these are hard stops:

- **Do not run `new-work`.** Do not choose a replacement visual world.
- **Do not rewrite, regenerate or replace `DESIGN.md`.** Do not run `document`.
- **Do not treat the incumbent look as evidence-and-anti-reference.** It is the target, not the anti-reference.
- **Do not `extract`** — design-system extraction is GTM.02 and sits behind shipping the verticals.
- The signed-off desks are the visual reference. Where an in-scope page disagrees with a desk, **the page is wrong and the desk is right.** Converge the page onto the desk.

### 9.2 The commands that are in play

| Command | Use it for |
|---|---|
| `critique` | The heuristic design review inside each page's close-out. This is the main one. |
| `audit` | The technical pass — a11y, responsive, performance. Complements the repo's own gates, does not replace them. |
| `polish` | The final pass on a page once its content and correctness are closed. |
| `layout` | Only where critique names a spacing, rhythm or alignment defect. The mega menu is the obvious case. |
| `clarify` | UX copy, labels and error states only — the `/brief` form is the surface that needs it most. **Not** for marketing copy or claims. |
| `adapt` | Only where reflow fails and the repo's own `check:reflow` has not already caught it. |

Not in play this round: `new-work`, `document`, `extract`, `craft`, `bolder`, `overdrive`, `delight`, `colorize`, `animate`, `live`, `onboard`.

`bolder`, `overdrive` and `delight` are excluded deliberately. The register is ratified and restrained, the buyer is a CHRO or a programme director, and amplification against a committed world is how a coherent site becomes a loud one.

### 9.3 Mode

Choose per surface, per the skill's own rule that mode follows the surface and not the product:

- **Persuade** — the four pillars, `/`, `/why-yallo`, `/about`, `/case-studies`, `/intelligence`.
- **Operate** — `/brief` and `/jobs`. These are task surfaces; scanability and completion outrank expression.
- **Read** — `/privacy`, `/terms`, `/cookies`, `/case-studies/[slug]`, `/leadership`.

### 9.4 Where the brief overrides the skill

Impeccable's own guidance says the brief wins over its defaults, and it says to ship real imagery where the brief needs it. **This brief bans photography.** PetalPlate, gradient and geometric, generated deterministically from the slug, is the only imagery system on this site and it is CI-enforced. If Impeccable proposes photography, illustration, iconography from a third-party set, or any imported asset, the answer is no and the finding is logged rather than actioned.

Likewise: Impeccable asks before replacing factual copy or adding claims. **Here it does not ask, it declines.** Factual copy on this site is governed by canon and by the never-invent rule. Impeccable may restructure, tighten and re-sequence existing copy. It may not add a claim, a figure, a name or a commitment.

### 9.5 Setup and hygiene

- Run `node .claude/skills/impeccable/scripts/context.mjs` **once**, at the start, keeping cwd at the repo. Do not rerun it per page.
- If it reports `CONTEXT_STALE`, **report it, do not act on it**, except for findings marked `auto`. Repairing artefact drift as a side effect of a design task is explicitly out of scope and would silently move ratified ground.
- Do not enable or change the hooks configuration.
- Impeccable's findings do not override the repo's own gates. Where the two disagree, the gate wins and the disagreement is a relay item.

---

## 10. The close-out loop

The round is a loop over pages, not two big passes. This is deliberate: a session that stops at 4am should leave finished pages behind it, not a site that is half-audited everywhere.

**Order.** Global chrome first, because it is on every page. Then the four pillars, Contract first, because they are the most important and the most under-built. Then the rest in the order below.

```
0.  Global chrome — header, mega menu (§5), footer
1.  /contract
2.  /managed-delivery
3.  /permanent
4.  /eor            (§4 applies)
5.  /
6.  /why-yallo
7.  /brief
8.  /case-studies and /case-studies/[slug]
9.  /leadership
10. /about
11. /intelligence
12. /jobs
13. /privacy, /terms, /cookies   (one unit)
```

**Per page, in this order, and do not move on until the page is committed:**

| Step | Action |
|---|---|
| 1 | **Render and score.** 360 / 768 / 1280 / 1440, both themes. Score against §6. Append findings to `docs/design/context-round9-findings.md` — page heading, finding, rubric level, layer suspected. |
| 2 | **Close, in §6 severity order.** Honesty, then accessibility, then correctness, then IA, then completeness. |
| 3 | **Impeccable `critique`**, then `audit`, on the closed page. Mode per §9.3, refinement per §9.1. |
| 4 | **Close what critique found**, subject to §9.4. Anything it proposes that the forbidden list bans is logged, not actioned. |
| 5 | **`polish`**, once and only once. |
| 6 | **Re-render and re-score.** The finding is closed when the rendered page says so, not when the edit is made. |
| 7 | **Run the gates that touch this page.** Green, with real exit codes. |
| 8 | **Commit, explicit paths, one commit per page**, message naming the page and the rubric levels closed. |
| 9 | **Append a one-line close-out to the findings file**: page, findings closed, findings logged as open, and why. |

**Freeze before scoring, and at most two freezes per surface.** Scoring a page while an edit is in flight is how a round produces a finding it has already fixed. If a third freeze is needed on one page, the page has a structural problem — log it, commit what is green, move on.

**A page is not closed because it was edited.** It is closed because it re-rendered clean at step 6 and gated green at step 7. Anything that cannot reach that state is logged as open with the specific blocker named, and the loop continues to the next page.
