# Code to Chat — relay v9.0

**2 August 2026 · Session A · branch `fix/round4-system` · adjudicating `context-round4-rulings.md` §1, §2, §3, §4.3, §5**

All five §5 work items shipped. Every gate green, verified on a production build
rather than on the dev server. One decision taken under delegated authority, one
visible regression that Session B closes, and two live defects found in passing
that belong to B.

---

## 1. Housekeeping

| Step | Result |
|---|---|
| Fetch | done |
| Merge both branches to `main` | `fix/design-system-and-gates` fast-forwarded, `feat/content-depth` merged `--no-ff`. Ancestry checked before each push, neither forced |
| Conflicts | **Two, not one.** `.claude/launch.json` as well as `ai-talent/page.tsx` |
| Context docs committed | 5 `context-*.md`, plus the relay handover and the Informatica logo |
| Branches deleted | both, local and origin |
| Worktrees | B on `feat/round4-content`, A on `fix/round4-system`, both cut from merged `main` |

**The `ai-talent/page.tsx` conflict auto-merged, and the auto-merge was correct** —
`data-identity` outermost, the sub-nav scope inside it around the bar and the
sections it indexes. Checked rather than trusted. B's raw `l1.subNavScope` class
is reconciled onto the `L1SubNavScope` component the shell already exports, so
there is one idiom and that page is no longer the exception.

**`.claude/launch.json` was the second conflict:** B had added its own `session-b`
entry in its own idiom beside A's. Resolved to one entry per session, A's form.

**Standing fix in `AGENTS.md`:** a context document is not in play until it is
committed. The `tsconfig.json` hazard beside it is sharpened with the actual
remedy, since under a custom `NEXT_DIST_DIR` the rewrite names that directory and
the file becomes session-local.

---

## 2. The 72-hour over-claim — §5.2

**Four sites, not one.** The named instance was the L2 hero; sweeping the phrase
found the L2 contract-pillar copy, the About services card, and three claims in
the contract service data including the SEO title and description. Roughly ninety
other occurrences already said *shortlisted* correctly, which is exactly why one
wrong verb among them was invisible.

The lint matches the **construction**, sentence-scoped: a delivery verb and a
72-hour figure in one sentence with no shortlist to qualify it. Sentence scope is
what keeps it off the four L1 stat lines where a *placed* and a *72h* sit in
different sentences of the same string.

**Worth recording, because it is the round's recurring failure.** The first
version of this lint was blind to the very line it was written for. An
`ALLOWED_LINES` entry added to quiet the script's own comment also exempted the
real JSX line, because the comment and the defect were the same string. Caught by
reintroducing each of the five defects and watching the gate fail. The rule is
now written into the script: do not quiet this file's comments with an
allow-list; word the comments to avoid the construction.

---

## 3. Body text over the wash — §3, and it outranked the hues

**Measured worse than reported.** The ruling had 4.01 to 4.45. Reachable worst
cases are **4.02:1 on light** (claret on `--paper`) and **3.70:1 on dark** (teal
on `--dk-2`). The earlier pass had not covered `--dk-2`.

**R11's alpha is untouched, and no amendment is needed.** Stepping the text alone
clears 4.5:1 against all seven hues at full alpha on both themes:
`--ink-3-wash` `#535355` at **4.63:1**, `--dk-txt-3-wash` `#a6a6a6` at **4.61:1**.

The dark value is deliberately close to the line rather than comfortably clear.
Every step up narrows the gap to `--dk-txt-2` at `#afafaf`, and the hierarchy
between secondary and subtle copy is what is being spent to buy the ratio. It
sits 1.11:1 apart.

**Grounds are measured, not assumed.** Every `.amb-wash` element across nine
pages in both themes resolves to `--paper`, `--paper-2`, `--dk` or `--dk-2`.
`--ground-3` hosts no wash, so it is reported rather than gated — pessimising for
it would cost real hierarchy on dark for a case that does not exist. A second
assertion fails if a wash ever lands on a `g3` surface, so that enumeration
cannot go stale the way the type floor's did.

**The mechanism needed care.** `--fg-subtle` and `--wa40` are declared as
`var(--text-3)` at `:root`, so their values are computed there and inherited;
overriding `--text-3` inside `.amb-wash` does not reach them. Same trap that left
`.axisLabel` at 2.96:1 inside `.band-invert`. Twelve files consume `--fg-subtle`
and sixteen consume `--text-3` directly, so missing either would have fixed half
the page. One rule does the whole job, because every context that declares
`--text-3` now declares `--text-3-wash` beside it. Confirmed by reading the
rendered DOM in both themes, including inside `band-invert` where the theme flips.

`check:contrast` measures composites now — seven hues over each ground at full
alpha, hues and alpha read out of Layer 1 rather than restated. Verified by
reverting both tokens and watching two composites fail.

---

## 4. The hues — §2, set C shipped

Set C, seven hues. Indigo, teal, plum, violet frozen. Harbour `#005A82`/`#427EA8`,
claret `#A36365`/`#BF7F80`, mulberry `#8E62AD`/`#AA7CC4`. Whole-family pairwise
minimum 2.29 → **3.51**.

**`check-hue-separation` now fails on ground distance and only reports pairwise.**
All seven clear at 7.94 to 10.53 light, 12.70 to 17.81 dark. The floor is **7.94,
derived from the weakest approved hue** rather than fixed as a constant — it
cannot drift, and it cannot be met by withdrawing a hue, which was the flaw in the
pairwise floor. Verified by washing claret out to near-paper and watching it fail.

**Moving three hues moved the composites tuned an hour earlier.** The binding case
went from claret to harbour on light and from teal to claret on dark, and the new
composite gate found both on its own. The wash text tokens stepped once more to
hold a real margin instead of 0.06.

Recorded in `DESIGN.md` as **R4a** and at the head of the palette document, with
the reasoning, so it is not relitigated. Contact sheet still at
`docs/status/shots/hues-v8/` for Sumeet's eye.

---

## 5. The sector rail — §4.3

**It was six copies, and the sweep found two more.** Four rendering surfaces now
read one derivation in `src/lib/sectors.ts`, and none of them writes a sector name
or a sector order:

| Surface | What was wrong |
|---|---|
| Mega menu | hand-typed, and it was the CANONICAL order while being unenforceable. Carried the singular "Life Science" |
| Footer | a fourth copy, drifted into its own register: "Retail & Consumer" in full beside "Telco" and "Government" |
| Capability rail | six copies, one per capability data file. Wrong order, "Public Sector", singular "Life Science" |
| Homepage rail | its own order, putting Manufacturing third where the menu puts it second |

Only name and order derive. Intro, roles, scope line and icon stay authored.

**One decision under delegated authority:** `industriesIndex` is reordered to the
canonical order. That is a `src/data` file and belongs to B, but the moment the
mega menu started deriving, leaving the index in its old order would have shipped
the canonical surface wrong. Six entries moved, no content change. **B should not
redo it** — only add Education.

**Also deleted:** `_L1CrossSector` and its `crossSectorLinks` array. Unreferenced,
and a seventh hand-copied sector list with its own labels and order, invisible
because it never rendered.

`check:taxonomy` rule 5 fails on a sector label written in rendering code,
verified by typing one back into the footer.

---

## 6. `.heroGrid` — §5.7

**Three declarations, not the one the ruling named:** EditorialLayout, L2PageShell
and L1HubShell all draw it. Suppressing only the flagged instance would have left
two identical declarations firing.

Scoped per file, citing canon §5, using the tool's own scoped-suppression path —
which refuses an unscoped wildcard, so this could not have become a blanket
ignore. Verified: the three are silent and the rule still fires on a new file
drawing the same two-axis grid.

---

## 7. For Session B

**One visible regression, and B closes it.** Education & Universities has
disappeared from the mega menu. It used to be a hand-written `published: false`
entry there; the column now derives from `industriesIndex`, which has no Education
entry yet. **Adding Education to `industriesIndex` restores it**, as inert text
until its page exists and as a link on the commit that adds the page. It still
renders inert at the end of the homepage rail in the meantime, because a sector
not yet in the index keeps its authored name and sorts last.

**60 inert sector labels remain in `src/data`, across 13 files.** They no longer
reach a page — every surface derives before painting — so `check:taxonomy` reports
them by file rather than failing. Sweeping them is B's, and the rule becomes a
failure afterwards.

```
 7  src/data/capabilities/cloud-infrastructure.ts     3  src/data/l1/finance.ts
 7  src/data/capabilities/cybersecurity.ts            3  src/data/l1/government.ts
 7  src/data/capabilities/data-analytics.ts           3  src/data/l1/healthcare.ts
 6  src/data/home/place.ts                            3  src/data/l1/manufacturing.ts
 5  src/data/capabilities/devops-platform-engineering.ts   3  src/data/l1/retail.ts
 5  src/data/capabilities/integration-middleware.ts        3  src/data/l1/telco.ts
 5  src/data/capabilities/testing-quality-engineering.ts
```

**Two live defects found in passing, both in B's files, neither touched:**

1. **`src/data/home/place.ts` marks Informatica `published: false`.**
   `/platforms/informatica` returns 200. The homepage renders a real page as
   unbuilt, hiding the seventh platform, while the mega menu links it correctly.
   One-word fix. The deeper fix is that `published` should derive from the
   registry the way `sectorNavEntries` does, rather than be hand-declared.
2. **`src/data/services/contract.tsx` was edited by this session** for the
   72-hour sweep, three strings. Flagged so B is not surprised by a `src/data`
   change from A.

---

## 8. For Sumeet

1. **Hue contact sheet** at `docs/status/shots/hues-v8/`. Set C ships; one line
   reverses it.
2. **The dark subtle-text token narrows the tonal hierarchy inside wash bands**,
   from 1.40:1 to 1.11:1 against `--dk-txt-2`. It is the least lift that clears
   AA with R11's alpha intact. The alternative was lowering `--amb-alpha`, which
   the ruling put last and which was not needed.
3. Still open from §8 of the rulings and untouched here: the LinkedIn Talent
   Insights reports, Informatica's `consentOnFile` flag, and the Blueprint
   archetypes carrying no AI or retrieval content.

---

## 9. Gate summary

Static, all green: `check:terms`, `check:contrast` (32 token pairs + 6
composites), `check:type`, `check:taxonomy`, `check:motion`,
`check-hue-separation`, `check-gate-coverage`, `check-colours`, `tsc`.

Rendered, all green, **on a production build on an isolated dist dir and port**:
`check:a11y` (axe clean, 6 routes x 2 themes x 2 widths), `check:yallo-case` (17
pages), `check-rendered-type` (13 templates x 4 widths), `check-interaction`,
`check-reflow`.

**One thing to know about `check:yallo-case`.** It reported all 17 pages "did not
load" against the dev server, and then only `/`. Neither was a content failure:
the gate waits on `networkidle`, which never settles under `next dev`, and it
takes its base URL as `argv[2]` rather than from `BASE_URL`. The homepage's 41
internal links were crawled directly and none is dead. Run it as
`node scripts/check-yallo-case.mjs http://localhost:PORT` against `next start`.
