# Relay — session A handover to the ongoing round 12 session

**3 August 2026 · performance bolt-on, `context-round12-scope.md` §5 · stood down before the final measurement**

This session was dispatched with the round 11 §3.2 prompt. By the time its shell
recovered, rounds 11 and 12 had already absorbed most of that work, so it
re-scoped itself onto the one part still open — the performance bolt-on — and
worked it under **round 12 §5**, which supersedes the round 11 method (four
passes, apply every lever then measure once).

**Nothing was committed. No file in the tree was changed by this session.** Read
§5 before anything else: another agent is committing to this checkout.

---

## 1. Why this stopped

**A second agent is operating on `main` in this same checkout, concurrently.**

- `HEAD` moved from `cdc2510` to `3572e6a` between two of this session's tool
  calls, while a production build and measurement were in flight.
- `.github/workflows/phase8.yml` appeared in the working tree, untracked,
  36 seconds before it was noticed. **This session did not write it.**
- `git worktree list` shows one worktree, so this is not the two-worktree
  arrangement AGENTS.md mandates. Two agents, one branch, one build directory.

Consequences taken seriously rather than worked around: a Phase 8 number
measured while `HEAD` moves describes a build that cannot be pinned, and a
Phase 8 number authorises a DNS cutover. **The final four-pass measurement was
deliberately not run.** No number is reported below that was not observed
against a build this session verified.

---

## 2. Levers — four of five closed by measurement

All figures Lighthouse 12.8.2, production build, `next start` on 3107,
`NEXT_DIST_DIR=.next-a-r11`, port holder confirmed by PID, build freshness
confirmed behaviourally.

| §5.2 lever | Outcome |
|---|---|
| IBM Plex Mono `preload: false` | **Applied in round 11, and its effect is smaller than it looks.** It removed 19.6 KiB from the *preload* path (5 files/191,196 B down to 3 files/171,084 B) but the bytes are **still fetched**: mono renders on all 16 routes audited (474 nodes at 400, 263 at 500). This is a priority change, not a byte saving. |
| Audit every weight and style against usage | **Nothing is droppable.** See §3. |
| Confirm Latin subsetting | **Already in effect on the preload path.** All preloaded files carry the latin `unicode-range`. The 52 `@font-face` rules include cyrillic, greek and vietnamese subsets that are declared and shipped but never fetched, gated by `unicode-range`. They occupy 13.9 KiB of 281.4 KiB of built CSS (4.9%) and cost nothing at runtime. |
| Unused JavaScript, 121.5 KiB on `/` | **Not a defect. Ruled out by measurement.** See §4. |
| Render-blocking CSS, 549ms on `/` | **Real, measured, and not reachable by config.** See §4. |
| Newsreader italic preload, 63.0 KiB | **§5.3's stop condition has triggered.** See §3. |

### The font layer, measured off the built assets

| Family | Preloaded | Files |
|---|---|---|
| Newsreader | 119.8 KiB | 2 — normal 56.8 KiB + **italic 63.0 KiB**, each variable 400–600 |
| Inter | 47.3 KiB | 1, variable 400–600 |
| IBM Plex Mono | 19.6 KiB | 2, static 400 and 500 |
| **Total** | **186.7 KiB** | 5 files, 11 declared faces |

---

## 3. §5.3 has triggered — this is Sumeet's ruling, not the session's

**Above-the-fold italic exists, and it is in the hero headline.** Verified by
computed style in Chromium at both Lighthouse's mobile viewport (412x823) and
1280x900, across all eight measured routes — not by grepping for `<em>`.

| Route | Element | Rendered | Distance from document top |
|---|---|---|---|
| `/` | `<em>` inside the hero `h1` | Newsreader **italic 600**, 62px desktop / 38px mobile | 308px / 231px |
| `/platforms/sap` | `<em>` inside the hero `h1` | Newsreader **italic 600**, 62px / 38px | 205px / 196px |

The other six routes: none.

Per §5.3 this means `preload: false` on Newsreader italic is **outside the
delegated authority** — it would trade a measured LCP gain for a flash of
fallback italic in the first screen of the two highest-value routes. Not done.

### The weight audit, and the false negative it nearly produced

Across 16 routes, judged on computed style:

| Declared in `layout.tsx` | Rendered? |
|---|---|
| Newsreader 400 normal | **Yes — but only via `.quotes blockquote::before`** |
| Newsreader 500 normal | Yes, 148 nodes, 4 routes |
| Newsreader 600 normal | Yes, 278 nodes, 16 routes |
| Newsreader 400 italic | No |
| Newsreader 500 italic | No |
| Newsreader 600 italic | Yes, 3 nodes, 2 routes |
| Inter 400 / 500 / 600 | Yes — 906 / 554 / 209 nodes |
| IBM Plex Mono 400 / 500 | Yes — 474 / 263 nodes |

**The Newsreader 400 row is the important one and it is a warning.** A text-node
audit reported it used nowhere, because `.quotes blockquote::before` sets
`font-family: var(--font-display)` with no `font-weight`, so it inherits — and a
`TreeWalker` over text nodes structurally cannot see pseudo-element content. A
second audit over `::before`/`::after` found it painting the quote glyph on `/`.
**Newsreader 400 is in use. Do not drop it.**

Because Newsreader and Inter ship as variable fonts covering 400–600, narrowing
the declared weight list would not have shrunk a file anyway. **Step 2 yields no
byte reduction, and that is a measured result rather than an omission.**

One unrelated finding, logged not fixed, `src/data` territory: **something
renders Inter at weight 900** — 4 nodes on one route, the "72h" numeral. Inter is
declared 400–600, so that weight cannot resolve to a real face. No
`font-weight: 900` exists in `src/`, so it arrives from a utility class or a
parent. Cosmetic, not a gate, not this round's.

---

## 4. The two untouched levers, named file by file

`overallSavings` figures from Lighthouse 12.8.2 on `/`.

### Unused JavaScript — 121.5 KiB, and it is Link prefetch

| Chunk | Total | Wasted | |
|---|---|---|---|
| `1kj5p_hb_ggzy.js` | 59.8 KiB | 59.7 KiB | **100% unused** |
| `2m6vll9e3g18q.js` | 43.2 KiB | 36.1 KiB | 83% unused |
| `243v5zm6y55dh.js` | 69.4 KiB | 25.7 KiB | 37% unused |

The 100%-unused chunk contains **zod**. Only `BriefForm.tsx` and
`CvUploadForm.tsx` import it client-side, and they are rendered by `/brief` and
`/jobs` only — the root layout never reaches them. `L1PageShell.tsx` was checked
and cleared: it imports `MetricStat` as `import type`, erased at compile time,
and `data/metrics.ts` uses `node:fs` so it could never run client-side.

**Then measured directly via CDP: that chunk is requested at `priority=Low`,
`initiator=script`.** It is Next's `Link` prefetch for `/brief`, working as
designed. Lighthouse counts a prefetched route chunk as unused JavaScript.
`2m6vll9e3g18q.js` is Framer Motion, `243v5zm6y55dh.js` is react-dom.

**Ruling: this is not an LCP lever.** Low-priority requests are scheduled after
the render-critical ones, so suppressing prefetch would cost navigation speed
and buy close to nothing on a text LCP. Do not disable prefetch to move this
number.

Also visible and worth someone's attention later, not a gate: heavy RSC prefetch
churn, with `/about`, `/why-yallo`, `/leadership`, `/terms`, `/privacy` and
`/cookies` each fetched **three or four times** with different `?_rsc=` hashes in
a single page view. Low priority, so not LCP-blocking, but it is real bandwidth.

### Render-blocking CSS — 549ms, real, and not reachable by config

`/` render-blocks on four stylesheets. The problem is one of them:

| Chunk | Uncompressed | Transfer | Contents |
|---|---|---|---|
| `1nfsffihnh2v9.css` | 39.5 KiB | 7.9 KiB | global — needed |
| `1n9vi67s6740a.css` | 48.1 KiB | 7.9 KiB | `Home`, `AiEstateDiagram` — needed |
| `1lyj6jr6sj9uu.css` | 16.5 KiB | 3.2 KiB | `CaseStudy*`, `BriefCTA`, `ClientMark` |
| **`3kx_leomf33c8.css`** | **107.1 KiB** | **13.9 KiB** | **93% unused on `/`, 309ms attributed** |

That file mixes the global chrome every route needs — `Footer`, `Lockup`,
`NavBar`, `StickyBriefCTA` — with page shells `/` never renders: `L1PageShell`,
`L1HubShell`, `WhyRail`, `PlatformModuleShell`. Plus all 52 `@font-face` rules.
**So every route render-blocks on every other route's shell CSS, directly in
front of a text LCP.**

**`experimental.cssChunking: 'strict'` is a silent no-op on this project, and
this is the trap worth recording.** The option exists in Next 16.2.12's types
(`boolean | 'strict'`). It was set, the build succeeded with **exit 0 and no
warning** — and the emitted CSS was **byte-identical, same chunk hashes,
`3kx_leomf33c8.css` still 107,124 B with the same mixed module list**. Cause:
**Next 16 builds with Turbopack, and `cssChunking` is a webpack-only option that
Turbopack ignores without complaint.** The change was reverted rather than left
in place, because an inert config option reads as if CSS chunking is controlled
when it is not. Caught only by diffing emitted bytes; a green build proves
nothing here.

Closing this properly needs either a bundler change or a restructure of the
client component graph so chrome CSS and route-shell CSS land in different
chunks. Both are larger than a performance tweak on a closing build round.

---

## 5. State of the tree, and the warnings that matter

**Nothing committed. No tracked file modified by this session.** The five
`scripts/audit-*.tmp.mjs` files it wrote have been deleted; their findings are
above. The `next start` on 3107 has been stopped.

Untracked, and **not this session's**:

| Path | Note |
|---|---|
| `.github/workflows/phase8.yml` | **Provenance unknown. This session did not write it.** Content reviewed and it does correctly implement §5.5 — daily cron at 06:41, `workflow_dispatch`, four passes, results uploaded as an artifact. **Not committed:** a scheduled workflow consumes Actions minutes and runs against a live host, and it should not be committed by an agent that cannot attribute it. Confirm the author, then commit it. |
| `docs/design/context-round13-chatbot.md` | Pre-existing, flagged in v20 §Risks |
| `docs/design/context-round14-research.md` | Pre-existing, flagged in v20 §Risks |
| `docs/gtm/platform-employer-signals-2026-08-02.md` | Pre-existing since round 11 |
| `.gitignore` | Shows as modified. **Not this session's edit** — check before staging. |

`.next-a-r11/` is this session's 97 MB build directory. Session-local, never
commit it. Safe to delete.

---

## 6. What the round 12 session should do next

1. **Resolve the concurrency first.** Two agents on one branch in one checkout is
   the arrangement AGENTS.md exists to prevent. Whoever continues the bolt-on
   should hold `main` alone, or take a branch and a separate `NEXT_DIST_DIR`.
2. **Attribute `phase8.yml`, then commit it.** Do not commit it unattributed.
3. **Run the §5.5 measurement:** eight routes, **four passes**, worst-pass rule,
   Lighthouse 12.8.2, on a build that will not change again. The runner and the
   `check:phase8` script are already committed and working; its guard exits 2
   against a dead port, proven.
4. **Expect the gate to miss and report the table, not a verdict.** §5.5 names
   "the levers run out before the gate is met" as an acceptable outcome, and on
   this session's evidence that is where it lands. The last published baseline
   was LCP 2.72–4.82s against a 2.5s ceiling; the levers found since are a
   19.6 KiB priority change, and four dead ends.
5. **Do not reach for a fourth idea** (§5.5), and **do not drop a type family**
   (§5.4).

### The one option worth naming, for Sumeet to rule on

Not built, because §5.5 forbids inventing a lever and it is a type-system change:

**Newsreader italic is used only at weight 600, on 3 nodes across 2 routes, yet
ships as a variable 400–600 file at 63.0 KiB.** A second `next/font` instance
declared at `weight: ["600"], style: ["italic"]` would emit a single static
instance, materially smaller, while keeping italic **preloaded** and so
satisfying §5.3's above-the-fold constraint. It needs a CSS rule routing italic
to the new family variable, and it depends on the audit above holding — italic is
never used at any other weight anywhere. **What it would buy has not been
measured, so no millisecond figure is offered here.** Building it and measuring
it is a one-change, one-measurement task.

---

## 7. Risks

- **Any measurement taken in this checkout while two agents commit to `main` is
  untrustworthy.** This is the reason no number is reported here.
- **A green build does not prove a config option took effect.** The `cssChunking`
  no-op would have been reported as a fix by anyone who trusted exit 0 instead of
  diffing emitted bytes. There may be other Turbopack-ignored options in play.
- **A text-node audit cannot see rendered type.** `::before`/`::after` carry a
  family and a weight. Newsreader 400 was one audit away from being dropped as
  unused.
- **The poisoned `next/image` lock still applies** (round 12 §6): restart
  `next start` before believing any `load` timeout.
