# Code → Code handover v7.0

**For the next Code session on `yallo-talent-website`. Read this before touching
anything.** The Chat relay at `docs/relay/code-to-chat-v7.2.md` covers strategy,
decisions and open questions. This covers the traps.

**State:** `feat/platform-parity-round`, pushed, HEAD `50672fe`, nine gates 9/9.
**`main` is at `e4b3d59` and has none of this.**

---

## 1. Read this first: you are not alone in this repo

A **second Code session has been running concurrently** in the same working
tree on the capabilities round. It committed while my work was uncommitted, and
it moved the tree onto its own branch mid-session.

Consequences you will hit:

- `git branch --show-current` may not be the branch you think. **Check it every
  time before committing.**
- The working tree may contain another agent's in-flight edits. `git status`
  before every stage, and **stage explicit paths only** — `git add -A` is banned
  here and this is now the second reason why.
- A build can fail on a file you did not touch because the other session is
  mid-write. Wait and retry before "fixing" it. If it is **committed** rather
  than in-flight, it is fair game.
- Both sessions commit as the same git identity, so `--author` cannot separate
  them. Use the branch and the subject line.

Three branches, all live:

| Branch | Commit | Contents |
|---|---|---|
| `main` | `e4b3d59` | Neither session's work |
| `feat/platform-parity-round` | `50672fe` | Everything, mine on top of theirs |
| `feat/capabilities-parity` | `08cdd26` | Theirs, missing my last two |

---

## 2. Start here, in this order

```bash
git branch --show-current && git status --short
pnpm build
for p in 3000 3100; do lsof -ti:$p | xargs -r kill -9; done; sleep 3
pnpm next start -p 3000 &
pnpm next start -p 3100 &
```

Then **verify CSS is actually served before believing any gate**:

```bash
node --input-type=module -e 'import{chromium}from"@playwright/test";
const b=await chromium.launch(),p=await b.newPage();
await p.goto("http://localhost:3000/",{waitUntil:"load"});
console.log(await p.evaluate(()=>{let n=0;for(const s of document.styleSheets){try{n+=s.cssRules.length}catch{}}
return{cssRules:n,font:getComputedStyle(document.body).fontFamily.slice(0,12)}}));await b.close();'
```

Expect **~1164 rules and Inter**. Anything near 200 or Times means a stale
server and every gate result is worthless.

Note: use the **preview tooling** for a dev server (`.claude/launch.json` has a
`yallo-talent` entry on 3000), not a bare shell. `pnpm next start` on 3000/3100
is for gates only.

---

## 3. The traps that cost time this round

**1 · Piped exit codes lie.** `node script.mjs 2>&1 | tail -3; echo $?` gives
you **tail's** status, not the script's. I reported a gate green that was red.
Redirect to a file and read `$?` directly:
`node scripts/x.mjs >/tmp/x.log 2>&1; echo $?`.

**2 · The gate's PAGE LIST is the weak point, not its rules.** Twice this round
a live A4 breach shipped because `check-rendered-type.mjs` had never been
pointed at the template. `/ai-talent` was missing; then an **industry** L2 was
missing even though a **platform** module L2 was listed — different shells, so
one never covered the other. **Add a new template to the guards in the same
commit that creates it.**

**3 · `--fs-data` is a MONO-ONLY token.** 13px is legal only with
`--font-mono` alongside it; A4's sans floor is 14px and filled controls are
15px. Three different floors, easy to land on the wrong one — I moved a control
from 13 to 14 and hit the meta floor instead of the control floor.

**4 · CSS modules hash `@keyframes` names.** Moving a rule to `globals.css`
while leaving its keyframes in a module silently resolves the animation to
nothing, and no gate can see it. Move both.

**5 · Authored roles are UNIONED with derived sector roles**, not overridden.
An authored fix in `platforms/authored.ts` will not stick while `l1/retail.ts`
or `l1/manufacturing.ts` disagrees. That is how a duplicate came back after
being "fixed".

**6 · `python .replace()` without an assert silently no-ops.** I "fixed" three
font sizes that never changed because the declaration was not adjacent to the
selector. Assert every replacement, or verify in the browser afterwards.

**7 · Measure the painted pixel.** The ambient wash reads as *nothing* at the
band's corner and as *gold* wherever a gold element sits. I sampled both and got
two confident wrong answers before profiling for the actual gradient.

---

## 4. Repo rules that bite

- **`git add -A` is banned.** Stage explicit paths.
- **`check-colours` blocks raw hex including inside comments.** It caught me
  twice more this round — once in a code comment quoting a token value, once in
  a `mask-image` gradient. Use `rgb(0 0 0)` in masks.
- **Commitlint**: lowercase subject, ≤100-char body lines, blank line before the
  footer.
- **Biome reformats on pre-commit without staging its writes** — a successful
  commit can leave a dirty tree. Commit the reformat separately.
- **Type floors are hard**: sans 14px, mono 13px at ≥0.12em, controls 15px.
- **Never dim with opacity for restraint.** It removes contrast too.
- **Read the gate summary before pushing, not after.**

---

## 5. Where things live

| Thing | Path |
|---|---|
| Design authority | `docs/design/yallo-talent-CANON.md` (canon §3 amended for Informatica) |
| Design system | `DESIGN.md` (+ generated sidecar `.impeccable/design.json`) |
| This round's spec | `docs/design/context-platform-parity-round.md` |
| Page-family specs | `docs/design/context-{ai-talent,informatica,programme-staffing-blueprint}.md` |
| Chat relay | `docs/relay/code-to-chat-v7.2.md` |
| Platform modules + benches | `src/data/platforms/authored.ts` |
| Platform narrative bands | `src/data/platforms/narrative.ts` (all 7 authored) |
| AI talent | `src/data/ai-talent/` (index, stacks, types, 9 families) |
| Blueprint | `src/data/blueprint/index.ts` |
| Hue proof shots | `docs/status/shots/hues-v7/` |

---

## 6. First tasks next session

**1 · Finance module depth — the one live P0.** All 20 `financeData.expertise`
entries have **zero `tools`**, so no finance L2 route exists and every expertise
card is a dead end. The hero promises depth the data cannot back, on the page a
banking buyer checks to test whether module depth is retail-only marketing.

**Do not invent tools or roles.** Retail's twenty came from real data. Either
Sumeet supplies the sets, or ship an honest interim state that stops the page
implying parity. Ask before authoring.

**2 · Triage twelve duplicate CSS classes.** `check-type-scale.mjs` reports them
on every run without failing. Some are deliberate second blocks by the same
component; some may be live cross-component collisions of the kind that
repainted the homepage pipeline to 1:1 contrast this round. Seven modules.

**3 · Blue Yonder's derived generics.** Its bench carries "Business Analyst",
"Solution Architect", "Integration Consultant" and near-duplicates like "MFP
Specialist" against "Blue Yonder MFP Specialist", all arriving through the
authored/derived union. Legitimate on the sector pages they come from, so this
is a data decision, not a cleanup. Needs Sumeet.

**4 · Two retail L2s read nearly identically.** Their Screening and Engagement
bands are word-for-word across all 20 pages. Content, not CSS.

---

## 7. Do not re-litigate

- Insight articles and blogs are **descoped permanently**.
- Identity hues are accepted; the **separation failures are reported and
  deliberately unfixed** per Sumeet's instruction. Do not author a variant and
  do not move an approved hue.
- The score-bar `width` animation is a confirmed exception.
- The service family (`/managed-delivery`, `/eor`) correctly has **no identity
  hue**.
- Packaged Software leads the desk list; "Data & AI", not "Data & Analytics".
- Client corridor is Middle East + Europe. India only where materially true.
- **Logo variant G ships**, divider included, at the 0.12em tracking floor.
  R15's divider ban is reversed and recorded as R22.
- Informatica is the **seventh** platform and last in every expressed order.
- The chip gradient overrides §2's "no gradient" on Sumeet's direct
  instruction. It is recorded in the CSS as a reversal.
