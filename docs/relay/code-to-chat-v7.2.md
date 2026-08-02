# Code → Chat relay v7.2

**2 August 2026 · yallo-talent-website · Session 1 (platform parity + L1/L2 critique)**
**HEAD `50672fe` on `feat/platform-parity-round` · nine gates 9/9**

This supersedes nothing. It is the status of **session 1's** work. A second Code
session has been running in the same repo in parallel on the capabilities round
and files its own relays at `docs/relay/code-to-chat-capabilities-v1.*.md`.

---

## 1. TL;DR

Three page families shipped, platform parity is closed across all seven
platforms, and an Impeccable critique of the L1/L2 family found and fixed three
A4 breaches shipping live. **One P0 remains and it is blocked on your data, not
on build time: `/industries/finance` has no module depth at all.**

The thing worth your attention beyond the work itself: **twice this round the
gate's page list, not the gate's rules, was what failed.** Both breaches were
in templates the guards had never been pointed at. That is now a pattern, not
an incident.

---

## 2. Where the code is, and the branch situation

| Branch | Commit | What is on it |
|---|---|---|
| `main` | `e4b3d59` | Well behind. Nothing from either session. |
| `feat/platform-parity-round` | `50672fe` | **Everything.** Both sessions' work, mine on top. |
| `feat/capabilities-parity` | `08cdd26` | Session 2's, missing my last two commits. |

**Nothing has reached `main`.** Mid-round a parallel session moved the shared
working tree onto its own branch and began committing; `next.config.ts` was
modified in flight and was also in its commit, so reaching main would have
meant overwriting another agent's live edits. My work went onto a branch of my
own so nothing of theirs was disturbed.

**Someone needs to decide the merge order.** The two branches share history and
both are ahead of main.

---

## 3. Shipped

### Three new page families (27 routes)

| Family | Routes | Notes |
|---|---|---|
| Informatica | 10 | 7th platform, canon §3 amended and dated. Client-register entry at `consentOnFile: false` |
| AI talent | 10 | Nine role families, 44-entry stack matrix as one source for L1 and L2 |
| Programme Staffing Blueprint | 4 | Index plus three archetypes, under a new `/intelligence` hub |

### Platform parity, all seven

Bench depth, before → after: Microsoft 38→62 · Oracle 21→59 · Blue Yonder
31→47 · Workday 24→41 · Salesforce 10→38 · Informatica 17→34. SAP unchanged at
64 as the reference. **Every platform now sits at or above SAP's roles per
module**, which is the honest measure given SAP has 25 modules and Informatica
has 9.

All seven now carry the full narrative band set. SAP painted eight sections and
14,170px; the others painted four and roughly 6,500. They now run 8,984 to
10,439px. Content is genuine to each platform, not SAP's argument with the
nouns swapped.

### SAP reference items

Chips redesigned (twice — see §5), How We Work padding fixed on the class,
connector shared with the homepage rather than duplicated, and **SAP Business
AI filled**: seven desks, fourteen bench roles, seven new L2 routes. The
Sapphire 2026 consolidation is respected — one Business AI Platform, not three
legacy desks.

### Ambient hues

`moss`→`harbour`, `umber`→`claret`, `mulberry` added for Informatica. Renamed
not aliased; no `--amb-moss-*` or `--amb-umber-*` survives. Informatica needed
a `[data-identity]` rule as well as a token, or the page would have worn a
positional hue.

### Defects found by measuring, none of them in the brief

- **70 indexable pages were missing from the sitemap** — every platform module
  L2, on every platform, for as long as the template has existed. 67 URLs → 152.
- **The homepage shipped a live 404.** `/industries/education` is
  `published: false` in two data files and both honoured it; the sectors column
  in `WherePlace` never checked. The data was right, the render was wrong.
- **"Sectors running X" was a grid of one** on all seven platform pages, and a
  heading over zero rows on Workday, which is R16 outright.
- **Blue Yonder listed the same job twice**, 4px apart, in both spellings. The
  authored fix had not stuck because authored roles are *unioned* with derived
  sector roles and two sector files still disagreed.

---

## 4. The Impeccable critique, and what it cost us

Dual-agent, not degraded. Score **22/32** (69%, Acceptable) on the L1/L2 family.
Structural metrics were largely clean: zero horizontal overflow, zero tap
targets under 24px, zero 1:1 contrast, zero missing accessible names, clean
heading order on all five routes, zero dead anchors, three font families
throughout. Light and dark identical on every structural metric.

**Three A4 breaches were shipping live on every industry L2 on the site:**

1. Six declarations put `--fs-data`, a mono-only token, on sans elements — 46
   nodes of 13px Inter, under A4's 14px sans floor.
2. Three filled controls at 14px against A4's 15px button rule.
3. `.sbItemNum` and `.crossChipArrow` inheriting weight 600, which Plex Mono
   does not ship, so the browser was smearing the 500.

Plus `.screeningInner`'s 60px rail never collapsed: **eleven lines at 25
characters** at 360, against the same paragraph running four lines at 78 at
1440.

All fixed and verified as painted. Gate coverage extended 7 → 11 templates,
184 → 296 family/weight pairs.

---

## 5. Decisions I took that you should review

| Decision | Reasoning | Reversible? |
|---|---|---|
| **Sticky bar indexes five page sections, not thirteen mixed items** | It was flattening two levels into one row and truncating mid-word at 1440. Families stay reachable through the chip index, which is finer-grained | Yes |
| **Chips got a gradient**, against §2's "no gradient" | Your direct instruction for shine and shadow overrode the written spec. Recorded in the CSS as a reversal rather than applied quietly | Yes |
| **`shortName` shortens the CHIP only** | You asked for the bracketed forms gone. Card headings keep the full product name for search and for buyers new to the suite | Yes |
| **Bar labels are generic across platforms** | §5 asked for "own taxonomy"; what each platform actually has differs, so the bar shows what exists rather than a fixed vocabulary | Yes |
| **"Autonomous Finance assistants"**, not "Autonomous Finance" | The latter is already a FAMILY name on SAP, and a module sharing its parent's name reads as a data error | Yes |
| **Duplicate-class CSS guard reports, does not fail** | Twelve pre-existing cases. A gate red on arrival gets ignored | Yes |
| **`--r-chip: 6px` added to the radius scale** | Ratified in §2, but undocumented. A token is the reviewable version | Yes |

---

## 6. Blocked, and what unblocks it

### P0 · `/industries/finance` has no module depth

**All 20 finance expertise entries have zero `tools`.** Retail has 20 of 20.
Consequence: **no finance L2 route exists** and every finance expertise card is
a dead end.

This is the page a banking buyer checks to test whether module-level depth is
retail-only marketing, and it currently fails that test. The hero copy promises
depth the data cannot back.

**Why I did not fix it:** the fix is authoring vendor tools and real role names
for twenty banking functions. Retail's twenty came from real data. Inventing
them is exactly what the repo forbids, and a plausible-looking fabrication here
would be worse than the gap.

**What unblocks it:** the same shape retail already has — per function, the real
platform tools (Temenos, FLEXCUBE, Finacle, Guidewire, Murex are already named
in the finance hero) and the real roles Yallo places on each.

### Content dependencies already known

- **Blueprint v2 quantities** — time-to-hire, scarcity, team size, rates.
  **The LinkedIn Talent Insights licence check is still outstanding** and blocks
  any published scarcity figure.
- **Two retail L2s read nearly identically.** Their Screening and Engagement
  bands are word-for-word across all 20. Making them genuinely differ is
  content, not CSS.

---

## 7. Questions that need your answer

1. **Merge order.** Two branches, both ahead of `main`, sharing history. Which
   lands first, and does platform-parity rebase onto capabilities or the
   reverse?

2. **Finance depth.** Do you supply the twenty function tool/role sets, or do we
   publish an honest interim state that stops the page implying parity with
   retail? I recommend the second as a stopgap and the first as the real fix.

3. **The tenth AI role family.** "AI Data Engineer, retrieval and RAG pipelines"
   is proposed and not ratified. It is a real gap — retrieval work is currently
   split across two families. Yes or no.

4. **The hue separation cost.** Six pairs fall below the approved floor: claret
   vs plum **0.75**, harbour vs indigo **1.13**, mulberry vs plum 1.60,
   mulberry vs violet 1.73, harbour vs teal 1.77, claret vs mulberry 2.33. The
   approved six sit at 2.55 to 4.87. On declared values the swap cost two thirds
   of the previous gap. Reported and unfixed per your instruction — do you
   accept, or do you want a revisit?

5. **`--r-chip` sits 2px from `--r-xs`.** Collapse the two onto 8px, or keep the
   new step?

6. **DESIGN.md has two statements that contradict ratified rules** and I did not
   touch them: it gives the ambient alpha as 8%/14% when R11 raised it to
   20%/30%, and its Rhythm Rule says per-taxonomy assignment is banned when R4
   introduced exactly that. Both change a ratified rule rather than record a
   change. Which way do they go?

7. **`/ai-talent` lost a band.** The four capability areas ported from the
   retired data-ai page are no longer rendered. The §2 band order does not
   include them and nine role families is more depth, but that is real content
   now dark. Want it back?

---

## 8. Risks

1. **Nothing is on `main`.** Two parallel branches, one shared working tree, and
   a merge nobody has sequenced yet.
2. **Twelve duplicate CSS class declarations** across seven modules, reported by
   the new guard on every run. Some are deliberate second blocks, some may be
   live collisions. Untriaged.
3. **Blue Yonder carries sector-derived generics** beside its real titles
   ("Business Analyst", "Solution Architect") and near-duplicates like "MFP
   Specialist" against "Blue Yonder MFP Specialist". Same union mechanism as the
   spelling duplicate. Untangling them is a data decision.
4. **The gate page lists are the weak point, twice proven.** Every guard that
   enumerates routes is only as good as its list, and three page families landed
   this round. Worth a standing rule that a new template is added to the guards
   in the same commit.

---

## 9. Gate state

Nine gates green at `50672fe`, verified with real exit codes rather than piped
`tail` status, against a rebuilt server with CSS confirmed served.

reflow · a11y · contrast · rendered type (11 templates, 296 pairs) · type scale ·
motion · interaction · terminology · visual — all exit 0. Plus `tsc --noEmit`
clean, and a full-site link crawl: 152 pages, 278 unique internal links, none
dead.
