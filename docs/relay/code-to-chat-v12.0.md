# Code → Chat, v12.0 — session A, round 7

**2 August 2026 · branch `fix/round7-system` · four commits · every gate green on a production build except one, which is red by design**

---

## TL;DR

The mark normalisation was already there and the clamp was overriding it. `build-logos.mjs` solved one display height per mark against a hand-chosen target area, then clamped the result to 20-46px — and **nine of fifteen marks sat pinned at the 46px ceiling**, so for those nine no normalisation ran at all. Rendered ink area still spanned **6.07x** across the rail. That is why the report came back twice after being fixed twice: the fix was live and inert at the same time, which is the hardest kind to see from the source.

Measurement is now an asset fact and derivation is a surface fact, and one `<ClientMark>` renders all three surfaces. Worst deviation from the surface median is **12.8% on the rail, 0.4% on the case cards, 0.8% on the platform axis**. The rail's 12.8% is two assets against a box, and it is Sumeet's call whether to close it.

**The Cloudflare answer is the good one.** The legacy "Block AI Bots" toggle is **off**. All fourteen documented crawlers plus the control are served the real page by the live yallo.co today. That was the single most important open question in the discoverability scope and it needed a measurement, not a meeting.

---

## 1. Housekeeping — §3.1

Both round 6 branches merged to `main`, ancestry checked before the push, nothing forced. `main` fast-forwarded to `2c613dd` and pushed before either worktree cut. Both worktrees created from that commit with dependencies installed, so B and C could start immediately.

**One thing the instruction did not anticipate.** `../yallo-talent-website-B` was still occupied by round 6's worktree. Before reusing the path I confirmed `feat/round6-content` was fully merged, had nothing unpushed and held no untracked work — only the session-local `tsconfig.json` edit, which I restored so the removal never needed `--force`. Round 8 should assume the path is occupied and check rather than force.

`.claude/launch.json` now carries `session-a` 3107, `session-b` 3207 and `session-c` 3307, each with its own `NEXT_DIST_DIR`. A owns that file so the three sessions cannot conflict on it.

---

## 2. Optical marks — §6, the run's substance

### What was actually wrong, measured before diagnosed

`public/logos/manifest.json` carried a `dh` per mark, solved from ink area against `TARGET_AREA = 1150` and clamped to 20-46px. Reading the manifest rather than the code:

| | |
|---|---|
| Marks pinned at the 46px ceiling | **9 of 15** |
| Rendered ink area, max/min | **6.07x** |
| Wipro against the median | **−74%** |
| Infosys against the median | **+58%** |

For nine marks the clamp was the operative rule. The normalisation was real, measured, and never reached them.

**Second defect, same root.** A display height is a property of a *surface*, and there are three at three box sizes. One number could not serve them, so the case cards and the platform axis ignored `dh` entirely and used a flat max-height. The cards additionally had no ink treatment at all, which is why keyed black silhouettes were invisible on a near-black card.

### The shape now

Measurement moved to `scripts/measure-marks.mjs`, which reads everything in `public/logos` whatever produced it — including the **seven platform vectors `build-logos.mjs` never touched and never measured**. Derivation moved to `src/lib/mark-scale.ts`. One `<ClientMark>` in `src/components/blocks/` renders every mark on the site. No scale factor is written by hand anywhere.

One decision worth recording: the box constrains the **ink** box, not the image box. Wipro's file is 56.4% padding and Workday's 46.0%; charging a mark for its own transparent margins would push its ink below the legibility floor for no reason a reader could see.

### Result

| Surface | Worst deviation | Tolerance | Was |
|---|---|---|---|
| Rail, 15 marks | **12.8%** | ±13% | 6.07x spread |
| Case card, 5 marks | **0.4%** | ±2% | 46.3% best achievable in the old 24px box |
| Platform axis, 5 marks | **0.8%** | ±2% | no normalisation |

Case-study card marks take the rail's monochrome light-ink treatment at normalised size, not a white plate, per §6. The card's mark box grew from 24px to 32px, which is measured rather than aesthetic: the five marks now on cards need a 3.18x ink-height range and a 24px cap over a 10px floor offers 2.4x.

### The tolerance curve, and the one call for Sumeet

Swept rather than chosen. The rail at its 68px cell, by ink floor:

| Ink floor | 50px cap | 54 | 58 | 62 | 68 |
|---|---|---|---|---|---|
| 12px | 21.1% | 13.6% | 6.6% | **0.0%** | **0.0%** |
| 15px | 41.1% | 34.5% | 28.1% | 21.9% | **12.9%** |
| 18px | 52.0% | 46.2% | 40.4% | 34.7% | 26.3% |

Two marks force the whole number. **Richemont** is 14.45:1, so it sits on the 15px ink floor and still carries 12.6% more ink than the median. **Chalhoub and Alshaya** are near-square and hit the 68px cell ceiling 12.8% under it. The set needs a 5.16x ink-height range; a 68px cell with a 15px floor offers 4.53x.

**I did not lower the floor to make my own gate green.** 15px is a legibility floor, and moving one to improve a metric is the gate lying. Dropping it to 12px takes the rail to 0.0% and that is a real option — it is your call, and it is one line in `src/lib/mark-surfaces.json`.

### Asset defects, reported not scaled

- **`blue-yonder.png` is an opaque plate.** 100% ink, no alpha, aspect 7.0. It cannot render as a monochrome mark and would paint a solid black bar. This matters for B's §4.3: fixing the *path* from `sap.svg` to `blue-yonder.png` removes a false vendor association and introduces a black bar in its place. **Both need doing, and the asset is the blocker.**
- **`wipro.png` is 56.4% padding** and **`al-othaim-markets.png` 52.4%**. Handled by constraining the ink box, so neither is distorted, but a tighter crop would give both more presence at the same optical weight.
- The six platform vectors carry 19.7% to 46.0% of their viewBox as padding. Intrinsic to the vendor files, absorbed the same way.

### The gate

`check:marks` renders every mark on every surface, reads the **painted box from the DOM** and multiplies by the manifest's ink fraction. Neither number comes from the library under test, so it measures the composite rather than proving the library agrees with itself.

**Watched to fail.** At one shared 34px cap — the pre-round-7 behaviour — it reports Wipro at **−73.7%** against Oracle at **+726.7%** and exits 1. That is the original complaint, quantified.

It also found a defect in my own first implementation: `next/image` needs integer width and height attributes, and with `width: auto` the browser derives the painted width from those rounded integers rather than from the file. On SAP that rounded 1035x512 to 19x9, an aspect of 2.111 against the true 2.021, and inflated its rendered ink by 5.2%. A mark failing its own normalisation through a rounding error in the attribute the optimiser reads. Both axes are pinned in CSS now.

---

## 3. Case-study ordering — §1.2

`src/lib/case-study-order.ts` to the fixed signature, `content/case-studies/order.yaml` carrying the current order so the merge moves nothing. The homepage rail takes the first four.

A slug that resolves to nothing **throws and fails the build**. Watched to fail on an invented slug; the error names the file and the slug. Note for B and C: **deleting a case study means deleting its line in `order.yaml` in the same commit**, and §4.1's audit will delete several.

`featured` on the frontmatter is now inert. I have not removed it — that is B's file — but it is dead and should be swept.

---

## 4. Cloudflare and robots — §3.4

**Probed live against yallo.co, 2 August.**

| | |
|---|---|
| Legacy "Block AI Bots" toggle | **Off.** All 14 crawlers plus the control served the real 1.37MB page |
| Search family | Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, DuckAssistBot, Amazonbot — **all served** |
| Agent family | ChatGPT-User, Claude-User, Perplexity-User, MistralAI-User — **all served** |
| Training family | GPTBot, ClaudeBot, meta-externalagent — **all served** |
| `talent.yallo.co` | Behind Cloudflare, returns **404 to everything including the control**, so it is not serving rather than blocking |

The gate asserts on a body marker and on `cf-mitigated`, never on the status code. **Watched to fail** against a host that challenges Googlebot at HTTP 200: it names Googlebot and exits 1.

The control user-agent earned its place immediately. Without it the placeholder's ordinary 404 read as fifteen crawler blocks; the gate now says the host is not serving and that nothing there is a statement about crawler policy.

`robots.ts` writes the three families **by name**, from the same list the probe reads, allowed on production and disallowed on every other host. Both branches verified from real builds rather than from the code. `PROBE_PRODUCTION_URL` overrides the target for the before- and after-cutover runs.

**Still outstanding from §10.2 and not measurable from here:** Bot Fight Mode behaviour toward verified AI bots, and the WAF custom-rule and rate-limit audit. Both need someone in the Cloudflare dashboard. The probe would catch either if it started blocking, which is the point of the cadence.

---

## 5. `check:yallo-case` — §3.5. **This gate is now red, by design**

It read computed `text-transform` only, so `YALLO partnered with` passed it: nothing was transforming it. It now reads the rendered text too, case-sensitive and word-bounded.

**Currently failing on 2 rendered instances. The full scope is 58 occurrences across all 14 case study files** — the heaviest are `rapid-recruitment-for-critical-supply-chain-roles` (12), `rapidly-building-a-high-performing-azure-data-engineering-team` (11) and `reducing-time-and-materials-cost-for-majid-al-futtaim` (8). That is B's sweep per §4.2. The hole is closed, so the next one fails the build.

One false positive found and fixed while building it: Next's RSC payload is a text node inside a `<script>` and carries a data copy of every string on the page, so the gate matched a defect no reader can see. Script, style, noscript and template content is excluded.

---

## 6. Gates

Run serially on a production build at 3107.

| Gate | |
|---|---|
| `check:marks` | **PASS** (new) |
| `check:crawlers` | **PASS** (new) |
| `check-gate-coverage` | **PASS** — 6 enumerating gates, every unit with a live URL visited, no stale list |
| `check-rendered-type` | PASS |
| `check-a11y` | PASS |
| `check-contrast` | PASS |
| `check-motion` | PASS |
| `check-reflow` | PASS |
| `check-interaction` | PASS |
| `check-estate-interaction` | PASS |
| `check:terms`, `check:taxonomy`, `check:type` | PASS |
| `typecheck` | PASS |
| `check:yallo-case` | **FAIL, by design** — see §5 |

ESLint on source is **37 errors and 13 warnings**, identical to the round 6 baseline. I introduced two warnings and removed them both.

**A note for whoever writes the next round's gates.** `check-a11y` takes `--base`, `check-motion` and `check-reflow` take `PORT`, `check-yallo-case` takes `BASE_URL` or `argv[2]`, and `check-rendered-type` takes `argv[2]`. Four conventions across five gates cost me two false failures that looked exactly like regressions in the change under test. Worth one commit in round 8 to unify.

---

## 7. For Sumeet

1. **The rail's 13% tolerance.** Keep the 15px legibility floor and accept 13%, or drop the floor to 12px and get 0.0%. One line either way. I have not taken it.
2. **`blue-yonder.png` is an opaque plate** and cannot render as a mark. A transparent monochrome version unblocks the homepage platform axis showing the right vendor. Related to §8's Informatica SVG request, which still stands.
3. **Sephora, Wickes and Radwell.** You supplied `Sephora_New.png`, `Wickes.png` and `Radwell.png` in `assets/client-logos/`. They are committed but **not yet shipped as marks**: `Radwell` was declined by the existing build gate as a box lockup, `Sephora` as a filled plate with knockout text, and `Wickes` is not in the converted set. The new Sephora file looks to be on an opaque white ground rather than transparent. I have not rerun the conversion, because doing so would change assets the round is not scoped to and I would rather report it than surprise you. Say the word and it is one run of `pnpm logos` plus whatever the gate then declines.
4. **`docs/lti-reports/`** left untouched as instructed.

---

## 8. For the next round

- **`featured` is dead data** now that `order.yaml` exists. Sweep it.
- **Unify the gate base-URL conventions**, per §6.
- **`check:crawlers` belongs in CI against production**, on the cadence in the addendum: once before cutover, once immediately after, then continuously. It is the only gate that can catch a zone setting changed by anyone at any time.
- The `entity` mark surface is defined and unused. C's block 5 client card is its first consumer.
