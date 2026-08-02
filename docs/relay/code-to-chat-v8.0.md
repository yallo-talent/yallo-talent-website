# Code to Chat, relay v8.0, session A, design system and gates

**2 August 2026 · branch `fix/design-system-and-gates` · from `main` at `e2c40e7`**
Answers `docs/design/context-round3-rulings.md` §1, §2 and §4.
Session B runs in parallel on `feat/content-depth` in `../yallo-talent-website-B`.

---

## 1. Housekeeping, and it was clean

| Step | Result |
|---|---|
| Containment | `origin/feat/platform-parity-round..feat/capabilities-parity` returned nothing. Capabilities was fully contained, as §1 assumed. No cherry-pick was needed |
| `main` | fast-forwarded `e4b3d59..e2c40e7`, 22 commits, ancestry verified before the push. Never forced |
| Branches | both deleted on origin. The local `feat/capabilities-parity` needed `-D` rather than `-d`, because deleting its origin counterpart left the tracking ref stale and git compares against that ref rather than against `HEAD`. Containment in `main` was re-checked with `merge-base --is-ancestor` before forcing it |
| Worktree | `../yallo-talent-website-B` on `feat/content-depth`, cut from `main` |

**`L1SubNav` was exported and pushed first**, in `0cb7cce`, before any other work, because B was blocked on it.

It shipped with `L1SubNavScope`, and that is not tidying. A sticky element travels
inside its parent's box, so a consumer that wraps only the bar gets a 49px parent
and no travel. Measured on the platform template, which scrolled off at
`top:-855`. Wrap nothing and the bar pins over the read-next rail instead, which
on retail reduced three live links to zero clickable area. That behaviour lived in
a class name inside a CSS module, so both existing consumers reached into the
stylesheet to get it, and a third would have had to know to. It is a component
now. **B should import both from `L1PageShell` and wrap the bar and the sections
it indexes, nothing else.**

---

## 2. The hues. The floor is not reachable, and here is the measurement

### 2.1 First, the earlier numbers do not reproduce

The round 3 figures, claret/plum 0.75 and an approved band of 2.55 to 4.87, came
from a pass that was not committed. I could not reproduce them. I fitted 504
combinations of compositing model, alpha and delta-E formula against them and
none lands on both the approved band and the six failures.

What **does** reproduce is the finding. `scripts/check-hue-separation.mjs`
returns the same six pairs as the worst six, in near-identical order. So the
conclusion was right and the instrument was lost, which is exactly the gap that
script now closes: it reads every value out of `globals.css`, so it cannot drift
from what ships, and it is re-runnable.

Its metric, and each part of it verified rather than assumed:

- **Composite first, measure second.** An identity hue is only ever seen as
  `.amb-wash` at `--amb-alpha` over `--ground`. On declared hexes claret and plum
  are 17.0 apart; on the painted wash they are **2.29** apart. Measuring the
  token measures something no page renders.
- **src-over in gamma sRGB**, which is what a browser does. Checked by painting
  each hue onto a canvas in the running app: the bytes match this arithmetic and
  do not match a linear-light composite.
- **CIEDE2000**, worse theme of the two. Dark separates roughly twice as well as
  light throughout, so light is always what binds.
- **Peak alpha is the generous reading.** The wash is a gradient decaying to
  transparent, so most of a band separates less than these numbers say.

### 2.2 What it measures

The floor restated in this metric's units is **4.65**, and it is the same
definition the ruling gave: the weakest pair among the four frozen hues, which is
indigo/violet. The approved band runs 4.65 to 14.32.

Shipped today, the whole-family minimum is **2.29**, and the six pairs below the
floor are the six round 3 named.

### 2.3 Re-derived by search, and 4.65 is not reachable at seven

Simulated annealing then multi-restart hill-climbing on the lexicographic
minimum, moving lightness and chroma as well as hue, inside the family's own
measured tonal envelope, with harbour held to a soft cool blue, claret held off
orange and brown, and nothing allowed near green.

| Set | Hues | Best minimum | Binding pair |
|---|---|---|---|
| A · shipped today | 7 | **2.29** | plum/claret |
| B · re-derived, briefs tight | 7 | **3.39** | plum/claret |
| C · re-derived, briefs relaxed | 7 | **3.51** | violet/mulberry |
| D · claret and mulberry withdrawn | 5 | **4.65** | indigo/violet, i.e. the floor is met |

Two things that only measuring showed:

**Widening the family's tonal envelope by a third buys 0.26.** The ceiling is
structural, not a tuning failure. Mulberry has a 43-degree hue gap between violet
and plum and nowhere to go, and at 20% alpha over paper the wash compresses
everything into a narrow band.

**Harbour costs nothing at all.** On its own it reaches 4.65: the minimum stays
the frozen indigo/violet pair. Every unit of the shortfall is claret and mulberry.

**So I have not shipped a fourth guess.** Tokens are untouched. B and C are
measured optima rather than guesses, but they still miss the floor, and which way
to go is your call, not an arithmetic one.

### 2.4 The thing I would push back on

The floor may be the wrong test, and the palette's own design says so. Hues are
assigned so that **no two members of one taxonomy share**, precisely because a
visitor is inside one family at a time and never sees two side by side. A
pairwise delta-E between two colours a reader cannot compare is measuring a
comparison nobody makes.

The test that matches what R4 actually asks, whether each page reads as having its
own colour, is separation from the **bare ground**, and all seven clear it
comfortably: 7.5 to 10.7 on light, 12.8 to 17.8 on dark.

Against that, five hues cannot give seven platforms one each, so option D breaks
the no-sharing rule it was meant to protect.

**Recommendation: keep seven, ship set C at 3.51, and record the ground-distance
figure as the criterion that governs.** It is a 53% improvement on every failing
pair with no hue leaving its brief. If you would rather hold the pairwise floor,
option D is the only set that meets it and the cost is two platforms sharing a
hue.

**Contact sheet:** `docs/status/shots/hues-v8/`, both themes, all four sets, real
`.amb-wash` at real alpha on a real page, every pair's number beside it. The
generator is archived in `source/`. Drop it back into `src/app/` to regenerate.

---

## 3. Everything else in §4.2, all shipped

**AI Talent's hue.** Two token lines and the selector pair, and the page had no
`data-identity` at all, so every `.amb-N` on the discipline carrying the paid
marketing fell through to the positional rhythm and it wore indigo in the hero
and teal in the invert band. The token existed; nothing consumed it. Mulberry,
because it is the only hue no other discipline holds. Verified by reading `--amb`
off all thirteen bands in the DOM.

**`--r-chip`** deleted, collapsed onto `--r-xs`. Measured before assuming: the
chip renders 62px tall, so 8px sits at a quarter of the pill radius. The 6px
fallback was not needed.

**`DESIGN.md`** corrected and dated. Both statements were left standing on the
reasoning that changing them would change a ratified rule. They did the opposite:
the file records decisions rather than making them, so where it disagreed with a
ratified rule it was simply wrong. That sentence is now in the file and in
`AGENTS.md`.

**`check-interaction`'s floor.** Flat 600, calibrated on the heaviest template,
failing sap-datasphere at 451 for being lighter. I built a stored per-route
baseline and measuring killed it: the same page delivers **451 under `next dev`
and 842 under `next start`**, so any recorded figure fails the other mode. The
floor is now half the heaviest page in the same run. Self-calibrating across
build modes, no stored state, with a 300 smoke floor for a build where
everything is partial. 300 sits below the lightest real template in either mode
and above the 153-rule partial build the old check let through.

**Gate lists.** `scripts/check-gate-coverage.mjs` guards the guards: route tree
from the filesystem, each gate's list read out of its source, routes grouped by
the shell that renders them so six sector pages are not six obligations. It found
two units visited by nothing: the case study template and the intelligence
index. Both are now in three gates. The standing rule is in `AGENTS.md`.

**The twelve duplicate CSS declarations.** Triaged by comparing the properties
each pair of blocks sets. Eleven share none and are additive. One was real:
`.moduleLink` declared `display: inline-flex` and then `display: flex` eighteen
lines later, so the first was dead the day it was written. Merged. The guard now
fails on a collision and reports an additive duplicate, and the fail path was
proved with a probe module: exit 1 with it, 0 without.

---

## 4. Two things I found that were not on the list

**Four dead links per capability L2, and they explain a gate that looked broken.**
`L2PageShell` built four hrefs from a literal `/industries/`, so on every
capability L2 the back link, the sidebar's entire function list and the related
grid pointed into the sector tree. The breadcrumb was the one instance a critique
named and the only one that got fixed. All four now derive from the L1's own
category through one helper.

`check-yallo-case` had been timing out on `/capabilities/data-analytics/data-engineering`
with "did not load". The page loads fine; it was prefetching the dead
`/industries/data-analytics`, so `networkidle` never settled. A dead link
presented as a broken gate.

**Body text over a painted wash is marginal, and this is not mine to fix.** At
R11's 20% and 30%, `--text-3` over the wash measures 4.01:1 to 4.28:1 on light
and 4.01:1 to 4.45:1 on dark. Several sit under 4.5:1. It applies to the four
frozen hues as much as the three new ones, so it is a consequence of the alpha
raise rather than of any hue, and `check:contrast` cannot see it because it reads
tokens rather than composites. Logged rather than acted on: changing `--amb-alpha`
is an R11 decision.

---

## 5. Gate state

Run against a **fresh production build in `.next-a-prod`**, on port 3101, with
each stylesheet chunk fetched and confirmed non-empty first. One earlier run was
read off a stale server still holding the port from a previous shell, which is
the same trap as last round; the AGENTS.md rule about checking `lsof -ti:PORT`
comes from that.

Twelve green, real exit codes, none piped:

`contrast` · `type-scale` · `terminology` · `taxonomy` · `a11y` · `reflow` ·
`motion` · `rendered-type` · `interaction` · `yallo-case` · `gate-coverage` ·
`hue-separation`. All exit 0. Plus `tsc --noEmit` and `biome check` clean.

`check-hue-separation` exits 0 by design while the floor is an open ruling; it
reports the six pairs rather than failing them.

---

## 6. Open, for Sumeet

1. **The hue ruling.** Section 2. Seven at 3.51 with the criterion changed, or
   five at 4.65 with two platforms sharing. Contact sheet in
   `docs/status/shots/hues-v8/`.
2. **`--text-3` over the ambient wash**, §4. Whether 20% and 30% stand.
3. Unchanged from round 3 and untouched here: the LinkedIn Talent Insights
   reports, Informatica's consent flag, and Backbase.

## 7. Integration, read before merging either branch

Checked by reading refs, without entering B's worktree.

**B was never actually blocked.** `L1SubNav` had already been extracted into its
own file in the platform-parity round, so it was importable from `main` before
this session started. The §3 ruling assumed it was still private to
`L1PageShell`. My export is therefore a convenience rather than an unblock, and
B built `/ai-talent`'s sub-nav at `5e58f10` without taking `0cb7cce`.

**B got the containment right independently.** B wraps the bar in
`l1.subNavScope`, reaching into the CSS module the way the platform template used
to. So there is no occlusion defect on `/ai-talent`, which was the thing worth
checking. What is left is two idioms for one behaviour: B's raw class and this
branch's `L1SubNavScope` component. Reconcile onto the component at merge.

**One real conflict, in `src/app/ai-talent/page.tsx`.** Both sessions changed the
page's root. B added the sub-nav and its scope wrapper; this branch replaced the
bare fragment with a `data-identity="ai-talent"` wrapper so the hue resolves.
Both are needed and they nest: identity outermost, then the sub-nav scope around
the bar and the sections it indexes. Neither should be dropped in favour of the
other.

**B's commit message for `5e58f10` credits this session's export.** It is
describing the earlier extraction, not `0cb7cce`, which is not on B's branch.
Worth correcting if the message matters for the record.

## 8. Notes for session B

- `L1SubNav` and `L1SubNavScope` are on `fix/design-system-and-gates` at
  `0cb7cce`. Take that commit before building `/ai-talent`'s sub-nav.
- `/ai-talent` now has a `data-identity` wrapper div at its root. The sub-nav
  scope goes inside it.
- Dev server `session-b` on 3002 with its own `NEXT_DIST_DIR`, in
  `.claude/launch.json`.
- No `src/data/**` file was touched by this session.
