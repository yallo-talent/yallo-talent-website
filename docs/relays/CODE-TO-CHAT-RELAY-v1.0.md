# Yallo Talent — Code → Chat Relay

**30 July 2026 · Project GTM.01 · From the Claude Code session to the Chat lens**
Subject: `github.com/yallo-talent/yallo-talent-website`, branch `refactor/taxonomy-and-geography`
Responds to: `CLAUDE-CODE-COMBINED-RELAY.md` (29 July 2026)

---

## 0. TL;DR

Sections §1–§11 of the combined relay are implemented and pushed across six commits.
The homepage is rebuilt against the benchmark funnel, both themes are first-class and
independently AA, the taxonomy and terminology sweeps are complete and now enforced in CI,
all stock photography is gone, and the platform-depth surface — the wedge — exists for the
first time. **Impeccable is partly run: `init` and `document` are complete and the design
hook is live, but `shape`, `critique`, `typeset/layout/bolder`, `adapt`, `audit` and
`polish` have not been run as discrete passes.** See §6.

Nine findings need a Chat-lens decision or a canon amendment. Four of them are cases where
canon as written would have shipped a defect. Those are in §3 and §4.

---

## 1. Where the build is

| Branch | State |
|---|---|
| `main` | Untouched since `7ce8e46` |
| `design/tokens-and-themes` | 4 commits. Tokens, themes, homepage, assets, case studies |
| `refactor/taxonomy-and-geography` | 3 commits on top. Taxonomy, terminology, platforms, defects |

Tag `pre-design-2026-07-30` marks the pre-design state. Nothing is merged to `main` — both
branches are pushed and awaiting review.

### Gates, measured not asserted

| Gate | Result | How |
|---|---|---|
| WCAG 2.2 AA, both themes independently | **32/32 token pairs** | `scripts/check-contrast.mjs`, in CI |
| Banned terminology | **0 in 175 files** | `scripts/check-terminology.mjs`, in CI |
| Dead internal links | **0 of 75 hrefs** | `e2e/dead-hrefs.spec.ts`, widened to platform + capability routes |
| Raw hex outside the token file | **0** | pre-commit hook |
| `images.unsplash.com` references | **0** (was 183) | grep |
| Server-rendered metric values | Real, not zeros | `scripts/capture-home.mjs`, in CI |
| Horizontal overflow at 360px | None, both themes | same |
| Sitemap URLs | 18 → **79** | matches generated route count |
| LCP / CLS (mobile, 4× CPU, throttled) | **876ms / 0.006** | vs gates of 2500ms / 0.1 |
| Lighthouse Mobile | **Not run** | needs the real host |

LCP element is the H1 text — there is no hero image to load, which is a direct consequence
of the drawn-graphic decision.

---

## 2. Decisions taken during the session

All by Sumeet unless noted.

| # | Decision | Consequence |
|---|---|---|
| 1 | Fetch the case studies from yallo.co directly | 15 real studies ported, bodies verbatim |
| 2 | Keep 4 "thought leadership" insights, delete 4 | Kept ones are `published: false` with a `rewriteBrief` |
| 3 | House byline **"Yallo Talent"** on all published content | See §4.9 — this re-attributes real named work |
| 4 | Review checkpoint after tokens + homepage | Taken; then instructed to continue and fix on sight |
| 5 | Testimonial: build the slot, leave it empty | Renders nothing until real permissioned text arrives |
| 6 | Creative North Star: **delegated to Code** | "The Screening Dossier" — see §5 |
| 7 | Depth model: **delegated to Code** | Flat by tonal layering, exactly one lifted element |
| 8 | Source the two missing logos independently | Radwell and Capgemini committed as vectors |
| 9 | Commit the logo pack as source assets | `assets/client-logos/`, 56 files |

---

## 3. Canon amendments required

These are cases where canon or the relay, followed literally, would have shipped a defect.
All are already corrected in code; they need ratifying in canon so they do not regress.

### 3.1 Canon §2 token list is not AA-safe as written — **amend**

Canon §2 gives `--gold: #d4a843` and `--gold-deep: #a8811f`, and the v0.3 prototype sets
every 11px mono eyebrow in `--gold-deep`. On paper that is **3.12:1** — a live WCAG AA
failure on the most-repeated element in the system.

**Amendment.** The gold accent needs **three grades on light**, not two:

| Token | Value | Ratio on darkest light ground | Use |
|---|---|---|---|
| `--gold` | `#d4a843` | 1.69:1 | Decorative only on light. Never text or state |
| `--gold-deep` | `#9d7818` | 3.12:1 | Large text, underlines, focus rings, boundaries |
| `--gold-ink` | `#7b5d13` | 4.69:1 | **All small text**, every 11px mono label |

Also: `--ink-3` at canon's `#63656c` misses 4.5:1 on the Kraft ground. Raised to `#5c5e66`
(4.94:1).

### 3.2 Canon §6 functional palette needs two grades per hue per theme — **amend**

The relay specifies one value per functional hue. No single value clears both a graphical
threshold (3:1) and a text threshold (4.5:1) on both paper and near-black.

**Amendment.** Each functional hue carries a `-mark` grade (≥3:1, fills, dots, strokes) and
a `-text` grade (≥4.5:1, labels), tuned separately per theme. Eight values per hue, thirty-two
in total, all verified. The naming makes the misuse obvious: reaching for a `-mark` value to
set a label is the single easiest way to break AA here.

### 3.3 Canon §7 "GCC" cannot be swept mechanically — **note in canon**

The ban is right, and the reason is exactly why the sweep is hard: **in Yallo's own copy
"GCC" means the Gulf in some places and Global Capability Centre in others.** A blind
replace turns the India delivery-centre narrative into nonsense. Resolved occurrence by
occurrence in `scripts/check-terminology.mjs`, with the reasoning recorded per case.

### 3.4 The "3 delivery regions" claim survived in another form — **closed**

Canon §7 retires it. It was still live as **"3 · Active delivery markets"** in the stats
strip of all eight L1 pages. Replaced with **80% contracts renewed**, a canon metric that is
published and defined. Worth adding to canon that the claim is banned *in any phrasing*.

### 3.5 L1/L2/service pages are now dark-register pages — **needs ratifying**

Canon §2 says dark is for evidence and data surfaces, and no page carries more than two dark
bands. These pages were built dark throughout and rendered dark-ink-on-dark once light
became the default. Two options existed: patch section by section, or make the page one
coherent dark surface.

**I made them dark-register pages** and added a `.band-dark` utility. The argument: an L1
page with twenty function areas and scarcity data *is* a data surface. But this stretches
canon §2 and should be either ratified as a deliberate exception or scheduled for a rebuild
into the light register. **This is the largest open design decision in the build.**

### 3.6 The Two Band Rule vs the gated Intelligence card — **resolved, documented**

Canon wanted the gated Blueprint card on an inverted ground. The homepage already spends
both permitted inverted bands on WherePlace and AITalent. Resolved by giving the gated card
the inverted **corner** only (top-right instead of bottom-left), so the pair is
distinguishable in silhouette without a third inversion. DESIGN.md is updated to match.

---

## 4. Findings that need a Sumeet or Chat decision

### 4.1 The published site has 29 case studies, not 8 — **decided, recorded**

| Group | Count | Action taken |
|---|---|---|
| Yallo's own client work | **15** | Ported, bodies verbatim |
| Duplicates / stale URLs | 4 | 301'd to the canonical study |
| **Not Yallo's work** | **8** | 301'd to `/insights` |

The eight are a GDPR and incident-response teaching series about Facebook, Google, Uber,
Maersk, Equifax, Capital One, Target and Sony. Real content, but it is not evidence of
staffing capability and it sat in the same `/case-studies` namespace as client work.

### 4.2 Three content defects on the live site — **needs Sumeet**

Found while porting. Excised from the port and reported rather than propagated.

1. A whole **"Industry Context: Why HFM Is Mission-Critical"** section sits inside the
   Majid Al Futtaim **time-and-materials staffing** study. Oracle Hyperion content in a
   staffing case study.
2. A paragraph about **AI retail automation and smart shopping carts** sits inside that
   same page, and that page's **meta description belongs to that other article entirely**.
3. The Alshaya planning study's outcome claims **"accurate and timely financial
   consolidation"** — Hyperion language in a custom-build planning study. **Left as
   published and flagged**, because editing a client-facing outcome claim is not a Code
   decision.

Items 1 and 2 are excluded from the ported MDX. Item 3 is still live on yallo.co.

### 4.3 Microsoft has almost no module data — **blocks the wedge**

Canon §5 requires Microsoft at **equal depth to Oracle** because Yallo is a Microsoft house.
The sector data holds 12 SAP modules, 11 Oracle, 9 Blue Yonder, 3 Salesforce — and **2
Microsoft, 0 Workday**.

Platform pages are generated only where real module data exists, so SAP, Oracle, Blue Yonder
and Salesforce ship and Microsoft and Workday render non-interactive. **Microsoft module
data is the single highest-value content input outstanding**: it unlocks the deepest page on
the site's strategic wedge, and today the site is quieter than the business on the platform
canon says matters most.

### 4.4 Canon §9 has Richemont wrong — **closed**

Canon says Richemont has no logo file and needs sourcing. **It is in the pack**
(`Richemont.jpeg`). The actual gaps were **Radwell** and **Capgemini**, both now sourced as
vectors and committed. All eighteen consented clients render a real mark; no wordmark
fallbacks remain.

### 4.5 An unattributed client quote exists — **opportunity**

The older MAF page carries a real published client sentence:
*"YALLO has transformed the way we manage our IT operations…"* with no attribution.
The benchmark rates an attributed testimonial as the cheapest credibility upgrade available,
and the homepage slot is built and waiting. **If a name, initial, title and permission can
be obtained for that quote, it is a one-line change.**

### 4.6 Case study publication dates — **corrected, worth knowing**

My first extraction pass stamped plausible 2025 dates on every study. That was a
fabrication and it is corrected: real dates come from the page hero and from JSON-LD on
permalink pages. **Two studies genuinely carry no date on the source** (the MAF Hyperion and
MAF time-and-materials pages) and are marked with the port date rather than a convincing
guess.

### 4.7 Four disciplines have no content — **declared, not faked**

`cybersecurity`, `integration-middleware`, `devops-platform-engineering` and
`testing-quality-engineering` are real but have no seed content. They are declared in
`PLANNED_CAPABILITIES` and render non-interactive rather than being registered with thin
data. Same discipline the repo already applies to L2 pages.

### 4.8 ServiceNow — a reading worth confirming

Relay §7 removes ServiceNow from the **platform set**. It remains as a tool inside
government and healthcare role lists ("ServiceNow ITSM Consultant", "ServiceNow Case &
Knowledge Lead"), because that is real capability Yallo staffs — it is simply not a platform
*destination*. Removing those role entries would delete capability. **Confirm this reading.**

### 4.9 The house byline re-attributes real named work — **flagged at the time**

Decision 3 applies "Yallo Talent" to all published content. This moves thirteen legacy
articles authored by **Tanzil Ul Ahmed** (plus "Yallo Editorial" and "Yallo Interns") to a
house byline. Sumeet made the call with the trade-off stated. Raised here so Chat has it on
the record, because it affects a real named person's authorship.

---

## 5. The visual system as committed

Creative North Star, delegated to Code and now in `DESIGN.md`:

> **"The Screening Dossier."** The product Yallo delivers is a document — three names,
> screening notes, and the reasons seventeen other people were rejected. The site is built as
> that artefact. Paper-stock grounds, never white. A serif that belongs to prospectuses.
> Monospace only for what a dossier sets in monospace: reference numbers, timestamps, source
> lines, measured values. Gold appears where an assessor's marker appears.

Chosen against the category: all six benchmarked competitors score 2–3 on visual
distinctiveness and converge on photographic hero + rounded cards + blue gradient. A
recruitment site that reads as a printed document is unclaimed ground.

**Depth:** flat, by tonal layering between three paper grounds and hairline rules, with
**exactly one lifted element** — the hero instrument, because it is the only thing on the
page pretending to be live rather than printed.

**Consequences worth knowing:**

- **All photography is gone.** 183 hotlinked Unsplash URLs removed and the image fields are
  out of the content contract. Surfaces draw a `PetalPlate` — a composition generated
  deterministically from the page's own slug out of the petal geometry and the gold accent.
  Nothing to commission, host or licence. The cookie policy no longer claims a third-party
  image or font CDN, because there is not one.
- **A stock portrait captioned "Founder in a working session"** on the leadership page,
  paired with Yallo's founder narrative, is removed.
- **Twenty blurred orbs neutralised.** DESIGN.md names the blurred orb as anti-reference and
  at their size they sat behind body copy and washed it out.
- **The type ramp and radius scale are fully tokenised** — the design detector found 44
  literal values off the documented scale. DESIGN.md's original seven-role ramp was an
  under-specification for a page this dense; it is now 17 named steps and 5 petal scales.
- **DESIGN.md ends with a record of every departure from the v0.3 prototype**, grouped by
  kind, as relay §12.9 requires.

---

## 6. Impeccable: what has actually run

Relay §1 asked for the skill at full capacity in a nine-step order. **Two of the nine build
steps are complete and the hook is live. Six evaluation and refinement passes have not run.**

| Relay §1 step | Status | Evidence |
|---|---|---|
| 1 `/impeccable init` | **Done** | `PRODUCT.md` at repo root, product-schema 1 |
| 2 `/impeccable document` | **Done** | `DESIGN.md` + `.impeccable/design.json` sidecar |
| 3 `/impeccable shape` | **Not run** | Went straight from document to implementation |
| 4 implement | **Done** | §8–§11 of the relay |
| 5 `/impeccable critique` per page type | **Not run** | No heuristic scores exist |
| 6 `/impeccable typeset` · `layout` · `bolder` | **Not run** | — |
| 7 `/impeccable adapt` | **Partially, by hand** | 360px floor works, overflow asserted in CI |
| 8 `/impeccable audit` | **Partially, by hand** | Contrast + LCP/CLS done; no axe, no Lighthouse |
| 9 `/impeccable polish` | **Not run** | — |

**What did run instead.** The Impeccable **design hook is active** and fired on every UI
write for the whole session. I resolved every finding it raised — 44 type-ramp and radius
violations, a pill radius on the theme toggle, and the array-key and a11y issues. Plus, by
hand: full contrast verification of both themes, an LCP/CLS measurement, keyboard and
reduced-motion work, and the 360px responsive floor.

**So the mechanical floor is met and enforced in CI. The judgement-based passes are the gap.**
Relay §12.8 asks for *"impeccable critique scores per page type, before and after"* — **I
cannot supply those**, because critique never ran.

**One housekeeping item:** `.impeccable/design.json` is now stale relative to `DESIGN.md`
(the departures record, the extended type ramp and the five-scale petal all landed after the
sidecar was generated). It needs a `/impeccable document` refresh.

### Proposed plan

Run the missing passes in the relay's own order, on the surfaces that matter most:

1. `/impeccable document` — refresh the stale sidecar first, so later passes read current truth.
2. `/impeccable critique` on the **homepage**, then an **L1 sector page**, then a
   **platform page**. Record before/after scores to close §12.8.
3. `/impeccable typeset` · `layout` · `bolder` wherever critique scores low.
4. `/impeccable adapt` as a proper pass, rather than the hand-checking done so far.
5. `/impeccable audit` — this is the one that needs the real host for Lighthouse. Everything
   else in it (axe, focus order, landmarks) can run locally now.
6. `/impeccable polish` last.

**Recommendation:** do steps 1–3 before the L1/L2 dark-register question in §3.5 is settled,
because critique on an L1 page is exactly the input that decision needs.

---

## 7. Not built, and why

| Item | Status |
|---|---|
| Programme Staffing Blueprint | Route unbuilt, card renders non-interactive. Needs content; rate bands live only here |
| AI Talent Atlas | Same. Source material parked verbatim in `src/data/pending/ai-talent-source.ts` |
| `/ai-talent` | Not built. Nav lists it first in the disciplines column, non-interactive |
| `/saudi-arabia` market page | Not built. Benchmark §9 puts it ahead of the generic regional pages, because the in-country entity is a differentiator no competitor can claim |
| Microsoft / Workday platform pages | Blocked on module data — see §4.3 |
| Newsletter signup on `/insights` | Deferred to Raphy per the existing handover note |
| Lighthouse Mobile 90+ | Needs the real host |
| Branch protection on `main` | Not verifiable from the repo — confirm in GitHub settings |

---

## 8. Questions for the Chat lens

1. **§3.5 is the big one.** Ratify L1/L2/service as dark-register pages, or schedule a rebuild
   into the light register? Critique on an L1 page should inform this.
2. Ratify the three-grade gold and the two-grade functional palette into canon §2 and §6
   (§3.1, §3.2), so the AA floor is a canon property rather than a code property.
3. Confirm the ServiceNow reading in §4.8.
4. Is the Alshaya "financial consolidation" outcome claim (§4.2 item 3) a source error to
   correct on yallo.co, or intended?
5. Does the GDPR teaching series (§4.1) belong anywhere on the new site, or is retiring it to
   `/insights` the end of it?
6. Priority call between: the missing Impeccable passes (§6), the Blueprint and Atlas
   content, and `/saudi-arabia`.

---

## 9. One standing note, unchanged

Nothing on this site is invented. Every client carries `consentOnFile: true`; every published
metric carries a definition; every case-study body is Yallo's own published words. Where
something is missing — the testimonial, the two undated studies, Microsoft's module data —
the component renders nothing and the gap is named rather than filled. Three guards in CI
now make that structural instead of a matter of discipline.
