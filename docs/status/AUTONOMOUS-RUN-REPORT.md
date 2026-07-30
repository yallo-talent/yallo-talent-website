# Autonomous run — report

**30 July 2026 · Project GTM.01 · `main` @ CI green**
Canon: `docs/design/yallo-talent-CANON.md` v1.0, read first and treated as authority.
22 commits, all merged to `main` on green CI. Parked decisions: `QUESTIONS.md`.

---

## 1. What is done, and what is not

| Step | State |
|---|---|
| 1 · Copy sweep | **Done** |
| 2 · Ambient colour, both options switchable | **Done** |
| 3 · Homepage | **Done** — critique → fix → re-critique |
| 4 · Engagement pages | **Done** — rebuilt into the light register, axe clean |
| 5 · Evidence surfaces | **Partial** — card excerpts and titles rebuilt; index/detail templates not |
| 6 · Register test | **Resolved** — light built and adopted; see §4 |
| 7 · Platform pages | **Done** — Microsoft and Workday built, all six live |
| 8 · L1/L2 strip-and-rebuild | **Done** — strip CI-banned, all 6 L1s and 20 L2s in the light register |
| 9 · Discipline pages | **Done** — both seeded pages rebuilt; the four PLANNED stay non-interactive |
| 10 · `/ai-talent` | **Done** |
| 11 · Mega menu merge | **Done** |
| 12 · Logo lockup | **Done** |
| 13 · adapt / audit / polish | **Done** — axe in CI, adapt via the 360 gate, polish run as a discrete pass |
| 14 · L1 re-critique round | **Done** — 5 confirmed defects fixed; see §1a |

**Two corrections to earlier versions of this report.** I first recorded steps 4,
8 and 9 as "blocked" by the register discovery — they were unstarted work, not
blocked work, and none of the run's stop conditions applied. And I then reported
`polish` as unrun. Both are now done. All thirteen steps have been executed.

**What is NOT claimed:** the exit criteria ask for two consecutive passes without
score gain per page. The L1 re-critique has since landed at **20/36 raw**, which
the critique itself re-based to **≈15/36 → 20/36 (+13.9pp)** like-for-like after
finding the earlier pass had scored leniently against task-blocking defects. That
is a gain, not a plateau, and this round then changed the page again — so no page
has yet demonstrated two consecutive passes without gain. The criterion remains
unmet.

### Correction: reduced motion was not honoured, despite being claimed as met

An earlier version of this report listed "reduced-motion honoured" among the
satisfied criteria. That was wrong, and the L1 re-critique caught it. Two
independent mechanisms were both absent:

- **Framer Motion** defaults to `reducedMotion: "never"`. There was no
  `MotionConfig` anywhere in `src/`, so every entrance animation in
  `L1PageShell`, `ServicePageShell`, `NavBar` and `StickyBriefCTA` ran regardless
  of the user's setting. A comment at `globals.css:943` had already noted that CSS
  cannot stop a JS-driven inline transform; nothing acted on it.
- **The CSS reset was defeated by specificity.** The universal
  `@media (prefers-reduced-motion: reduce)` block has specificity 0, so any
  component class declaring a `transition` shorthand beat it outright —
  `.benefitCard` kept `transition: transform 0.3s` under reduced motion, measured.
  In combination this produced the exact defect the reset exists to prevent: once
  `MotionConfig` was added it correctly snapped the inline transform to target,
  and the surviving CSS transition animated the jump anyway.

Both are fixed, and `scripts/check-motion.mjs` now guards both halves in CI with
a motion-allowed control pass, so a page that never animates cannot score a
vacuous pass. Proven load-bearing by injection: unmounting the provider fails 2
of 3 routes; dropping the `!important` fails `/contract`. This was a real AA and
canon §5 breach live on every animated surface, and no existing gate could see
it — the token gate reads CSS, and axe does not evaluate motion.

---

## 1a. The L1 re-critique round

Five findings, each verified in source before being fixed, none taken on the
critique's word.

| Finding | Verified as | Fix |
|---|---|---|
| Reduced motion unguarded | Real, and worse than reported — two mechanisms, both absent | `MotionProvider` + `!important` on the reset + `check-motion.mjs` in CI |
| `.segCta` 4.38:1 in light | Real. `--sector-accent` → `--gold-deep`, the large-text grade, under 13.5px/700 text | Moved to `--accent-mark` (8.09:1) across all four components sharing the pairing |
| Four prose blocks at 12px | Real. Bound to `--fs-data`, whose own definition reads "mono: measured values" | Card prose → `--fs-caption`, section ledes → `--fs-body`, hero lede → `--fs-lede` at weight 400 |
| Four literal font-size clamps | Real | All resolve through the ramp; zero literals remain in the file |
| A fifth published metric | Real, and on all **eight** L1 data files, not one | Strip renders from `content/metrics.yaml`; `stats` field and `L1Stat` type deleted |

**One claim in the critique did not survive.** It reported the metric strip as a
`retail.ts`-only defect. Measured, every one of the eight L1 data files had
replaced "50+ Programmes staffed" with a per-page count, so the fix is a
structural one — the strip now reads the canonical four from the server page, and
a quarterly `metrics.yaml` refresh reaches these pages for the first time.

**A false alarm worth recording, because it nearly reached this report.** A local
axe run produced 26 serious target-size violations on routes I had not touched,
including a confident diagnosis that `min-height` cannot raise an inline anchor.
The elements were measuring `font-size: 16px`, `line-height: normal`,
`display: inline` — browser defaults. `next start` was still holding port 3100
from an earlier build while `.next` had been rebuilt underneath it, so every CSS
chunk returned 500 and axe was scoring an unstyled page. `pkill -f "next start"`
had missed it because the child process has a different command line. The axe
gate now asserts the stylesheets actually applied before it reports anything, and
that assertion is injection-proven.

---

## 2. Homepage: before and after scores

Dual-agent impeccable critique — design review isolated from detector-plus-browser
evidence, then a third independent re-critique after the fix pass.

| | Before | After |
|---|---|---|
| Nielsen (7, 9, 10 `n/a` on a Persuade surface) | **23/28 · 82%** | **21/28 · 75%** |
| Cognitive-load failures | 2 of 8 | 2 of 8 |
| P1 issues | 3 | 0 of the original 3 |

**The score went down, and that is the honest result.** Six of ten prior issues
resolved, including all three P1s — but the fix pass introduced one P0 and one P1
that cost more on the rubric than the fixes gained. Both are now fixed
(commit `5deed92`), which is the entire reason an after-critique is run.

**Resolved:** instrument invisible in dark · H1 six lines with the CTA below the
fold · mobile CTA hidden · headline overrun · hover-commit · adjacent inverted
bands · excerpt voice.
**Introduced then fixed:** monochrome rail rendering marks as black bars ·
malformed mobile CTA · reduced-motion duplicate showing twice · instrument never
pausing · excerpts still clipping.
**Still open:** two identical gold primaries in the Close · case-rail arrows never
disable · role panel height shift.

---

## 3. Ambient colour: recommendation and how to flip it

Both options are built as switchable token sets. Comparison captures:
`docs/status/screens/ambient-options/` (band-level, both themes, both options).

**Recommendation: `spectrum` — the six desaturated hues — and it is the default.**

Reasoning. The dossier register is deliberately quiet, and gold is the only
colour that is ever interactive, navigational or brand-bearing. A gold-only
ambient layer therefore adds atmosphere in exactly the hue that already carries
every signal, so the wash competes with the marker instead of setting it off; on
the near-black ground it reads as a single brown haze. The six hues stay
recognisably desaturated at the ratified ceilings (8% light, 14% dark), give each
section its own air without touching a single control, and leave gold doing one
job. `gold` remains fully built and is the right pick if Sumeet wants the quieter
extreme.

**The flip costs one line.** `src/config/theme.ts`:

```ts
export const AMBIENT_SCHEME: AmbientScheme = "gold"; // was "spectrum"
```

Or without touching source: `NEXT_PUBLIC_AMBIENT=gold` at build time. Every
consumer resolves through `--amb-1…6`, so nothing else moves.

**Assignment is positional only** (`.amb-1`…`.amb-6` by section rhythm).
Per-taxonomy assignment stays banned — I raised it as the retired per-sector
system returning and Chat ratified the ban.

---

## 4. Register test: resolved, and it took a rebuild

Canon §5 recorded the site default as "under critique test". **It could not be
scored as a comparison, because no light variant existed to score.** Removing
`band-dark` from the retail L1 rendered dark-ink-on-dark — the shells painted
their grounds from the Layer 2c dark aliases rather than the semantic layer.

So the test became the work. What it took:

| Change | Count |
|---|---|
| Ground declarations moved onto the semantic layer | 49 |
| Gradient-text rules removed (canon bans them; they also rendered invisible) | 9 rules / 18 sites |
| Label colours moved to the AA-safe gold grade | 62 |
| Fills moved to the mark grade | 12 |
| Literal font-sizes tokenised | 116 |
| Literal radii tokenised | 53 |
| Inline JSX `fontSize` values tokenised | 17 |

**Light is adopted site-wide.** Every built surface renders correctly in both
registers and passes axe in both. Chat's deciding reason holds: L1 and platform
pages are the primary organic entry points, so dark there would make dark the
brand's first impression for most traffic. Canon §5 updated; the line needs
Sumeet's ratification (`QUESTIONS.md` Q3).

Three defects only the light register could expose, each found by measurement:

1. **Gradient text was invisible text.** After the ground rewrite, `color:
   transparent` sat over a gradient that no longer resolved — 5 transparent-text
   nodes on the retail L1 in dark. Now 0 in both registers.
2. **The type guard had a blind spot that hid real defects.** JSX inline
   `fontSize: 10` is a px value React writes out, and the guard only read CSS.
   Closing it immediately surfaced **nine sub-12px inline values** across about,
   jobs, leadership and why-yallo that every gate had passed over.
3. **Six scroll reveals animated from invisible.** `initial={{ opacity: 0 }}`
   with a -40px observer margin meant any element the observer never fired for
   stayed at opacity 0 permanently — three benefit cards and two process steps
   on `/contract` were simply absent. Nothing catches this: axe measures
   contrast pairs, not whether an element ever became visible. All six are now
   transform-only, so content is visible from first paint regardless of JS,
   observer or reduced motion.

### The L1 was then critiqued, and it scored 20/36

Dual-agent, on the rebuilt page. Verdict: **"a dark page repainted, and the
mechanism is measurable at the token layer."** It was right, and the diagnosis was
better than my own — the register move had swapped tokens without re-deriving the
surface:

- `--sector-accent-08` and `-20` both resolved to `--gold-wash`, **1.005:1
  against paper**, and `-35` resolved to `transparent` — across 42 usages, ten
  component types. Half those usages are hover states, so **pointing at a card
  deleted its own edge.** The dark rule "accent is lighter than the ground" had
  been preserved verbatim instead of inverted for paper.
- The `--wa*` alpha ladder collapsed the same way — five 3–15% whispers flattened
  to one opaque hairline, so `.heroGrid` drew **opaque graph paper across the H1**.
- `--amb` was undefined and nothing carried `.amb-1…6`, so **every PetalPlate was
  a grey smear** and the ambient system I had built was unimplemented on L1.
- Two reflow content-loss failures: the segment panel clipped **1,305px** with 8
  of 10 role pills outside the clip rect; the engagement chip was clipped off
  every scarce-role row. Both now measure **0**.
- Canon breaches: "the people who screen" (canon says that section stays
  deleted), monograms generating **"Sp", "Op", "C&"** for non-people, five
  `published: false` insight cards rendering as openable articles, and "the
  platforms we staff" over sixteen wordmarks including **AWS**, which canon
  excludes from the platform set.

All P0s and the canon breaches are fixed (`ac81f90`). The page has not been
re-scored — that is the honest state, and the next pass should start there.

Evidence: `docs/status/screens/register-light-rebuilt/`, `l1-light/`,
`engagement/`, `l2-light/`.

## 5. The strip, and the ban

Relay v2.2 §3, confirmed as strip-and-rebuild. The incumbent register had not
been removed — it had been **unplugged**, with tokens rewired to `transparent`.
One variable would have restored all of it site-wide.

| | Before | After |
|---|---|---|
| `backdrop-filter` | 149 | **1** (the sticky nav, the only blur canon permits) |
| `--glass-*` uses | 69 | **0** |
| `box-shadow` (real elevation) | 100 | **1** (`--lift`, hero instrument) |
| `text-shadow` | 6 | **0** |

`scripts/check-type-scale.mjs` now fails CI on any `backdrop-filter` or
`--glass-*` outside the nav. Proven by injection, not assumed. The ban
immediately caught inline glass in `why-yallo` and `leadership` that a CSS-only
sweep had missed.

---

## 6. Gates

All green on `main`, CI passing.

| Gate | Result |
|---|---|
| Terminology | 0 banned in 175 files |
| Contrast (token pairs) | 32/32, both themes |
| **axe, 47 routes × 2 themes × 2 widths** | **clean** — new, in CI |
| Type scale | 0 below 12px; 13-role ramp; ≥1.125 adjacency |
| Glass ban | 0 violations |
| Dead internal links | 0 (E2E 2/2) |
| Raw hex outside globals | 0 |
| Visual + served markup | all assertions pass, production build |
| Typecheck / biome | 0 errors / 2 known warnings |
| Lighthouse | **not run** — needs the real host |

The axe gate found **four real AA failures the token gate structurally cannot
see**, because each pair is only formed at render: the nav CTA (ink on gold-deep,
4.38:1), the editorial CTA, the footer's eyebrows (3.16:1), and six editorial
heroes. Plus two scrollable regions with no keyboard access. All fixed.

Two axe findings are exemptions, each recorded in the script with the clause that
grants it: the Yallo wordmark (WCAG 1.4.3, logotypes) and the aria-hidden ghost
numerals (1.4.3, incidental text).

---

## 7. Screenshot index

`docs/status/screens/`

| Folder | Contents |
|---|---|
| `home-before` / `home-after` | Homepage, 1280 + 390, both themes |
| `ambient-options` | Both schemes, full page and band-level, both themes |
| `platforms` | Microsoft, Workday, SAP — 1280 + 390, both themes |
| `logo-lockup` | Header and footer lockups, both themes, 3× |
| `logo-rail` | The continuous monochrome rail, both themes |
| `mega-menu` | Merged Specialisms panel, both themes |
| `register-dark` / `register-light` | The register test — the light set is the diagnosis, before the rebuild |
| `register-light-rebuilt` | Retail L1 and contract AFTER the rebuild |
| `l1-light` | The five other sector L1s in the light register |
| `engagement` | All four engagement pages |
| `l2-light` | Two retail L2 samples |
| `final` | Home, ai-talent, microsoft, workday, contract, case-studies |

Regenerate any set: `node scripts/capture-pages.mjs --tag <name> --routes <a,b>`.

---

## 8. Relay v2.0 §7 report-back

1. **Type-size violations** — 91 literal sub-12px declarations across 13
   stylesheets, smallest 8.5px, plus 2 ramp tokens. All raised by role. Guard in
   CI and pre-commit. Final ramp: **12 · 13.5 · 15.5 · 17.5 · 20 · 23–27 ·
   32–54 · 38–62**, 13 roles, no adjacent pair closer than 1.125.
2. **Copy** — 10 filler occurrences replaced, 4 named ledes rewritten, 1 cut. 19
   banned abstractions now lint-enforced in `src/` with an 11-entry allow-list
   carrying a documented reason each. Guard proven by injection.
3. **Ambient** — §3 above.
4. **Critique scores** — §2 above. L1 and platform critiques wait on §4.
5. **Did the light rebuild move any contrast pair?** **No — 32/32 throughout.**
   The token pairs never changed; what changed is which grade each surface
   consumes. That is also why the token gate stayed green while axe found four
   real AA failures: the gate checks pairs, and these were pairs only formed at
   render.
6. **Disagreements** — §9.
7. **Dependabot** — 5 advisories (4 high) → **1**, dev-only. postcss and sharp
   forced to patched versions. The last one is `brace-expansion` via eslint:
   overriding it clears the audit but **crashes eslint**, so I reverted rather
   than ship it. The clean fix is removing eslint, since biome is the real
   linter and `pnpm lint` already fails independently with 49 problems and is not
   in CI. That is a tooling call, so it is yours.

---

## 9. Where I disagree, or was wrong

**I was wrong about the register sequencing, and Chat was right.** I recommended
critiquing a dark L1 before deciding its register. Scoring a page about to be
discarded measures work nobody keeps. Homepage first was correct.

**I was wrong to stop.** I reported steps 4, 8 and 9 as blocked by the register
discovery. They were unstarted work, not blocked work — none of the run's stop
conditions applied, and the goal was explicit that every surface reach exit
criteria. Pulled up on it, I did the rebuild; it took one branch and is now on
main with CI green. The finding was real and worth surfacing; calling it a
blocker was not.

**I was wrong five times in my own execution**, each caught by a gate rather
than by me: the monochrome filter turned 15 of 18 client marks into black bars
(the asset pack has no alpha); marking 36 rail marks `priority` emitted 36
preload links and stalled the load event; and restoring the mobile CTA overflowed
the page by 61px. Then two more in the rail: marking all 36 marks eager blocked the `load` event
and timed CI out, and the eager/lazy pair turned out to be a deadlock that needed
splitting per track. All five shipped fixed. The pattern worth noting is that
none was visible in dev — the production-build gates caught every one.

**I disagree with one thing, and it is now canon.** Relay v2.0 §3.3 permitted
ambient hue "per section **or per taxonomy branch**". Per-branch is the retired
per-sector hue system returning at lower opacity, in the very files that still
held its dead plumbing. Chat ratified the ban.

**One correction to a relay figure.** v2.0 §2.2 said thirteen articles by Tanzil
Ul Ahmed. Measured: **11 Tanzil, 8 Sumeet, 4 Interns, 2 Editorial.** Eight were
Sumeet's own, which changes the decision. Sumeet then ruled house byline
throughout, so no restore was needed — but the count mattered while it was live.

**One thing I would push back on if asked.** The 12px floor is applied
site-wide, and a large share of load-bearing content — role chips, module lists,
source lines — now sits at or near it. The floor is right; but the *product*
(the roles Yallo places) still renders at the smallest sizes on the page. Worth a
deliberate pass to promote role chips a step, which is why they were raised to
15.5px on the homepage rather than left at 12px.

---

## 10. Blocked, unchanged

Microsoft module data arrived and shipped. Still outstanding and named rather
than filled: an attributed testimonial · Search Console for the eight GDPR URLs ·
the Alshaya outcome claim · LinkedIn Talent Insights licence · branch protection
on `main` · the real host for Lighthouse · true-alpha logo assets (`QUESTIONS.md`
Q4).

Nothing on the site is invented. Where something was missing, the component
renders nothing and the gap is named.
