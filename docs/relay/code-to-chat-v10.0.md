# Code to Chat, relay v10.0

**2 August 2026 · Session A · branch `fix/round5-system` · answering `context-round5-rulings.md` §1, §2, §3, §5**

Every §3 item shipped. Fourteen gates green on a production build. The
derivation was the run's substance and it found more than the ruling predicted:
ten copies of the platform set, two of them on surfaces no list named. Two of
the eight items turned out to need no work at all, which is the standing
failure mode working correctly for once. Two gates were themselves the defect.

---

## 1. Housekeeping (§1)

| Step | Result |
|---|---|
| Merge | `fix/round4-system` fast-forwarded, `feat/round4-content` merged `--no-ff`. Ancestry checked before each push, neither forced |
| Conflicts | **Two, not the three predicted** |
| Context docs | `context-round5-rulings.md` was the one untracked file. Committed first, before any other work |
| Branch | `fix/round5-system` cut from merged `main` |
| Session B | Prepped and verified. `feat/round5-content` cut from merged main, upstream corrected, all ten context docs present |

**The sector registry ordering did not conflict.** Both sessions independently
arrived at the same canonical order, which §1 calls a clean resolution rather
than a finding. Recording it because the prediction was reasonable and the
absence is the good outcome.

Both conflicts resolved on §1's rule. The Industries column keeps A's
`sectorNavItems` derivation and B's hand-typed seven-entry list is deleted
rather than merged beside it; nothing is lost, because the two label facts B was
assigned, the Healthcare plural and Education's published state, live in the
index the derivation reads. In `l1/index.ts` the array itself auto-merged
carrying B's Education entry; only the doc comment conflicted, and it keeps B's
fuller record of the ruling alongside A's pointer to the mechanism.

**One thing that nearly repeated round 3's failure.** I cut the branch before
committing the rulings document, which put it on `fix/round5-system` and not on
`main`, and B cuts from `main`. B's worktree did not have the file. Fixed by
fast-forwarding `main` to that commit before B started. The AGENTS.md rule says
a context document is not in play until it is committed; the sharper version is
that it is not in play until it is committed **where the other session will cut
from**.

### The duplicate repository: resolved, and there was nothing to resolve

`yallo-talent-website-B` is a **linked worktree of the same repository**, not a
second clone. Evidence:

- Its `.git` is a 106-byte pointer file reading
  `gitdir: …/yallo-talent-website/.git/worktrees/yallo-talent-website-B`.
- `git rev-parse --git-common-dir` from inside it returns the main repository's
  `.git`.
- Exactly one `.git/objects` exists for this project anywhere under
  `~/Claude/Claude-code/`.
- Both share one remote.

So §1's requirement, one repository with worktrees beneath it and no second
copy of history, **already held**. The observation that both carry a full
`docs/relay/` set is just what a worktree checkout looks like; it is duplicated
working files, not duplicated history. Nothing was destroyed and nothing needed
to be. Two further worktrees under `.claude/worktrees/` are clean and detached,
also of the same repository.

The one cosmetic loose end: deleting the merged round-4 branches was blocked by
the permission classifier, so `fix/round4-system` and `feat/round4-content`
still exist locally and on origin. Both are fully merged into `main`. Not
retried, not important.

---

## 2. Measure before you diagnose (§3.2), and both were already closed

Neither finding needed work. Confirmed post-merge before acting:

| Finding | State after the merge |
|---|---|
| `_L1CrossSector` at `L1PageShell.tsx:488` | **Gone.** A's deletion survived. Only the comment recording the deletion remains, at line 451 |
| Education missing from the mega menu | **Closed.** `education` is in `industriesIndex` and in `sectorRegistry`, so `sectorNavEntries()` yields it published. Verified rendered |

Both relays were accurate on their own branch and both were stale about the
merged tree. Acting on either would have been wasted work.

---

## 3. The derivation (§3.3 and §5), the substance

**Ten copies of the platform set were live, and five had never heard that
Informatica was ratified on 1 August.** The ruling predicted the class; the
count is larger than the sector round's.

| Surface | What was wrong | Now |
|---|---|---|
| Mega menu Platforms column | Hand-written, and admitted it in its own comment | `platformNavEntries()` |
| Hub cross-rail | **Missing Informatica AND** ran Salesforce before Microsoft, against canon §3 | `platformsIndex` |
| JSON-LD `PLATFORMS` | Missing Informatica, so the structured data every crawler reads understated the set | `platformLabels()` |
| CV form `interestOptions` | Missing Informatica, so a candidate could not declare it | `platformLabels()` + two authored non-platform options |
| `L2PageShell` vendor map | Missing Informatica, so an Informatica L2 had no link back to its platform | `vendorSlugMap()` |
| `derive.ts` `VENDOR_SLUGS` | Complete and correct, and still a copy | `vendorSlugMap()` |
| Homepage rail | Own order; `published` hand-declared | `derivePlatformList()` + registry |
| AI estate bridge | Hand-typed names | `derivePlatformList()` |
| Blueprint archetype desks | Hand-typed names | `derivePlatformList()` |
| **`PlatformCoverage.name`** | **See below** | index first, vendor string as fallback |

**Two were on no list, and both were found by measuring rather than by
grepping.**

`PlatformCoverage.name` is the platform's own H1, eyebrow, `<title>`, module
headings and every "Also in X" rail, the largest platform-name surface on the
site. It was taken from whichever sector tool card the coverage walk reached
first. The one place a platform rename could not reach was the platform's own
page.

The homepage rail rendered **Telco & Media as unbuilt while
`/industries/telco` returned 200**. Round 4 fixed that rail by honouring the
authored flag, and inside the same round the flag was wrong in the other
direction. Both files agreed with each other and both were wrong about the site,
which is why only the rendered page shows it. `published` now derives from the
registry on both axes. Decision 9, generalised past Informatica.

**Capabilities were mostly already derived** at the nav and hub rail from round
4. What was not derived was every `related` cross-link, which carries a
hand-typed label beside its href on every L1. `src/lib/taxonomy-links.ts` takes
the name from the index owning the href and **leaves authored labels alone**
where the href is not a taxonomy route, because those rails also point at case
studies and service pages that have no index to come from. Order is deliberately
not touched there: a `related` rail is an editorial sequence, not an expression
of taxonomy order.

### Surfaces NOT converted, and why

| Surface | Why not |
|---|---|
| `src/app/layout.tsx:39` and `src/app/platforms/page.tsx:11` | Prose meta descriptions that happen to list six platforms. §5 exempts authored copy. **They are stale**, both omitting Informatica. Copy fix, flagged below, not taken here |
| `SPECIALIST_DESKS` in `L1PageShell` | The six canon §3 desks, a different axis that legitimately shares two labels with the disciplines. Converting it would be relay v6.0's mistake in reverse |
| `src/data/home/screen.ts` `desks` | Same, the desk axis |
| 70 platform and 48 discipline labels in `src/data` | Reported by file for B's sweep, exactly as the 60 sector labels were |

Nothing was blocked by the stop condition on inventing a label. Every derived
name existed in an index; the Data Science sub-desk title came from the
capability data rather than being minted.

### The gate rules, and each one watched to fail

`check:taxonomy` gains **rule 6 (platforms)** and **rule 7 (disciplines)**
beside the sector rule, all three now generated from one loop.

**The first draft of rule 6 was green, and it was green because it was wrong.**
It matched only `label:`/`name:`/`title:`/`short:` positions. Both copies it was
written to catch, the JSON-LD list and the CV form, are **bare arrays of
quoted names with no key in front of them**, so it could never have fired on
either. That surfaced only because the brief requires typing the defect back in.
A rule that cannot fail on its own motivating case is not a rule. The element
shape was added: a quoted string equal to a label, opening after `[`, `,` or
line-leading whitespace and closing before `,` or `]`, which admits
`["SAP", "Oracle"]` and excludes `=== "SAP"`, `case "SAP":` and any sentence
containing the word.

Evidence, each defect reintroduced and reverted:

| Rule | Defect typed back in | Gate said |
|---|---|---|
| 6, bare array | `const PLATFORMS = ["SAP", "Oracle"]` | `jsonld.ts:64 writes the platform label "SAP"` |
| 6, keyed | `label: "Blue Yonder"` in the hub rail | `HubLandingSections.tsx:282 …` |
| 7, keyed | `label: "AI Talent"` in nav-config | `nav-config.ts:139 …` |
| 5, sectors | `label: "Retail & Consumer"` in the footer | `Footer.tsx:23 …` unchanged behaviour |

**Two false positives came out of that tightening and neither was allow-listed
away**, per the standing rule about round 4's `ALLOWED_LINES`:

- A comment quoting an old label read as code declaring it. Fixed by tracking
  block-comment state instead of guessing per line. That exempts **no code at
  all**: it teaches the scanner where comments end.
- `SPECIALIST_DESKS` is scoped out **by declaration, not by file**. Verified
  narrow: a discipline label placed elsewhere in `L1PageShell` still fails.

---

## 4. The smaller items (§3.4 to §3.7)

**Decision 1, the insight row.** It rendered every teaser and greyed out the
ones with no article, so a reader met a headline, a byline and a reading time
that could not be opened. Canon §9 descopes insight articles, so on six of seven
sectors that was the whole row. Only published items render now, and a row with
none does not exist: no eyebrow, no heading. Verified both ways: no row renders
anywhere today, and publishing one teaser brings the row back carrying **that
teaser alone** while its three unpublished siblings stay absent. The L2 shell
already filtered but kept the unreachable disabled branch; deleted rather than
left to be copied back into life.

**Decision 7, the reverse link.** `adjacentDiscipline` is one optional typed
field on the existing adjacent band, not a new band. It carries **no label**:
"Data Science" is already written down as the sub-desk's title on the Data &
Analytics desk, and `disciplineLink` resolves it, so the return leg cannot name
a desk by a name that desk has stopped using, and an unresolvable reference
renders nothing. Both legs verified rendered. Closes B's §4.1.

**Decision 4** recorded in `DESIGN.md` as a constraint with the measured figure:
`--dk-txt-3-wash` sits **1.11:1** from `--dk-txt-2`, which is not a visible step,
so a wash band carries two text levels and further hierarchy rides on size,
weight, case or family rather than tone.

**`check:yallo-case`.** `BASE_URL` first, `argv[2]` as override. Round 4 read
seventeen "did not load" lines as content failures when the gate had simply
ignored `BASE_URL`. The `networkidle` wait is gone. New assertion: **no rendered
link points at a route that does not exist**, scoped to every internal link
rather than to expertise cards, because the defect is the dead href and the card
is only where this instance came from. `/industries/education` joins the crawl
list, because the page the rule was written for has to be a page the rule visits, and
template coverage does not help when the fault is in data. Verified by pointing
Education's no-tools card at its own absent L2 and watching the gate name it.
**135 internal links resolve.**

---

## 5. Two gates were the defect (§3.8, and one found in passing)

**The ESLint count was 96% generated files.** Round 4 said 624; this run first
measured 2,886, with no source change between them. `eslint.config.mjs`
overrode the framework's default ignores and listed `.next` only, so every run
linted whichever parallel-session `NEXT_DIST_DIR` was on disk (2,776 errors),
plus two nested worktree checkouts of the same `src`, which counted every real
error three times and filled six of ten worst-file slots with duplicate paths.

**The real figure is 38 errors across four rules**, 34 of them one rule about
literal apostrophes in JSX. Report at
`docs/status/eslint-triage-2026-08-02.md`. **No lint error was fixed**. The
config change is a gate fix, and it is what makes the number mean anything.
Recommendation is to leave all 38 and let the apostrophes ride the next copy
pass, since replacing them inside authored copy by script is a content change
wearing a lint error's clothes.

**`check-rendered-type` was flaky, which is worse than broken.** It timed out at
30s on `/` against a freshly built dist directory and passed on the identical
commit minutes later. Measured: networkidle on `/` exceeds 30,000ms against a
cold next/image optimiser cache and settles in **801ms** against a warm one,
because the client rail is five logos across four srcset widths and `next start`
optimises on first request. The gate's verdict depended on whether anything had
visited the site first. Now `domcontentloaded`, with the `document.fonts.ready`
that was already there doing the real waiting. Verified it did not go blind: an
11px sans class brings all 32 violations back.

My first comment describing that fix claimed networkidle could never settle.
That was wrong, and it is corrected in the file. The failure is cache-warmth
dependent, not permanent, and a false claim baked into a comment is how the next
session loses an afternoon.

`capture-pages.mjs` has carried a note about networkidle and lazy images since
it was written. Two gates never got it.

---

## 6. Gate summary

**Static, all green:** `check:terms`, `check:contrast`, `check:type`,
`check:taxonomy`, `check:motion`, `check-hue-separation`, `check-gate-coverage`,
`check-colours`, `tsc`.

**Rendered, all green, on a production build on an isolated dist dir
(`.next-a-r5`) and port (3111), port ownership confirmed before measuring:**

- `check:a11y`: axe clean, 6 routes x 2 themes x 2 widths, 2,262 abstentions composed
- `check:yallo-case`: 18 pages, 135 internal links all resolve
- `check-rendered-type`: 13 templates x 4 widths, 348 pairs
- `check-interaction`: 5 templates x 2 widths, 450 focused stops
- `check-reflow`: 22 routes x 2 themes at 320 and 360

---

## 7. For Session B

1. **70 inert platform labels across 18 files, and 48 discipline labels across
   13**, listed by file in `check:taxonomy`'s output beside the 60 sector labels
   already on your list. Same handover shape: rendering code fails, data files
   are reported, and each becomes a failure once its sweep lands.
2. **The report is a handover list, not a proof of inertness**, and this round
   is why the wording changed. Three of the platform lists it flagged were
   live, not inert. Do not assume a flagged label is unreachable.
3. **Two meta descriptions are stale copy**, both omitting Informatica:
   `src/app/layout.tsx:39` and `src/app/platforms/page.tsx:11`. Outside
   `src/data`, so mine by ownership, but rewriting them is authoring rather than
   sweeping and both sit in the site's own description. Flagged for whoever owns
   the copy call.
4. **`src/data/ai-talent/types.ts` and `ai-data-engineer.ts` were edited by this
   session**, for decision 7's field, which §3.5 assigns to A. Two files, one
   type addition and one value.

---

## 8. For Sumeet

1. **Hue contact sheet** still at `docs/status/shots/hues-v8/`. Set C ships
   unless you reverse it.
2. **A mono size floor does not exist.** `check-rendered-type` enforces a 14px
   sans floor and a tracking rule on uppercase mono, but no minimum mono SIZE:
   an 11px mono label passes. Canon A4 reads "nothing below 13px anywhere", so
   either the gate is short of the rule or the rule means sans. Reported rather
   than changed, because adding a floor is a new rule and it could fail on real
   content.
3. **`src/components/blocks/BriefForm.module.css` looks like it missed the
   light-register rebuild, and it is one story rather than four findings.**
   Surfaced because this session touched `CvUploadForm.tsx`, which imports it;
   nothing in the file was edited.

   | What | Detail |
   |---|---|
   | Ground | `.section` paints from `--black-950`, a legacy alias for `--dk` |
   | Measured | `rgb(14, 15, 17)` on `/brief`, **identical in both registers** |
   | Grid | Two hairline `linear-gradient` layers on a 44px cell |
   | Colour | Two `rgba(110, 231, 183, …)` greens, outside the Layer 1 palette |
   | Radius | 999px pills, against canon §5's quarter-round petal signature |

   The common cause is that this stylesheet consumes the **alias** layer rather
   than the semantic one, which is precisely what canon §5 records as the reason
   L1, L2 and service had to be rebuilt onto the semantic ground layer. This file
   was not in that rebuild. A dark band on `/brief` may well be what you want;
   the point is that it is dark by inheritance from an alias rather than by
   declaring itself one, so it cannot respond to the register at all.

   Nothing changed and nothing suppressed. A ground, a colour and a radius are
   all design ratifications, and suppressing the grid rule here would be wrong
   for a reason worth stating: round 4 legitimately scoped that rule off the
   ratified **hero** grid, and this is a different surface with no such ruling
   behind it. Reusing that precedent would turn one sanctioned exception into a
   habit.

4. **`check-colours` matches hex and misses `rgba()`**, which is how the two
   greens above sit outside the palette with every gate green. A real gap in the
   guard, reported rather than closed: tightening it would fail the build on
   pre-existing colour this session has no authority to change.
5. **Still open and untouched here**, per §7 of the rulings: Informatica's
   `consentOnFile` flag, LinkedIn Talent Insights (a
   `docs/lti-reports/sap-talent-pool-2026-08-02.xlsx` has appeared untracked in
   the working tree and was left alone), and the Blueprint archetypes carrying
   no AI or retrieval content.
