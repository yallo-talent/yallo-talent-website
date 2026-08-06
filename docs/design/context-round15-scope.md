# Context — Round 15: the merge, and telling the truth about what ships

**v1.0 · 6 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`.
Standing rules: `docs/design/context-round13-scope.md` §8. **Cited, never retyped.** §8.3 adjacent-fix policy and §8.5 relay contract apply unchanged.

Round 14's adjudication record is `context-round14-scope.md`. This file supersedes nothing in it; it rules what came back.

---

## 1. Round 14 adjudication

Both relays complete and both are the strongest of this build. `v22-A.md` and `v22-B.md` read in full, addenda included. Every open item in both is ruled below. **None of this reopens.**

### 1.1 Accepted outright

| Item | Position |
|---|---|
| A's `check-a11y` rewrite via `rendering-units.mjs` shared with `check-gate-coverage.mjs` | **Accepted, and better than what was asked for.** The dispatch said derive from `published-paths.mjs`; A instead made the gate and the coverage auditor compute the identical sample from one function, so the coverage claim cannot drift from the run. Reversed against myself: A's design supersedes the instruction. |
| A's 2:30 production-build measurement, and its note that a first `next dev` reading of 3:06 was cold Turbopack compilation | **Accepted.** Logging the wrong measurement so nobody re-takes it is the behaviour this build keeps needing. |
| A's `mark-scale.ts` tie-break fix, keeping the larger R across a tied plateau | **Accepted.** A real algorithmic bug found by measurement after a config change did nothing, with the gate's own figure improving from 0.008 to 0.003 and the other three surfaces verified rather than assumed. |
| A's Wipro fix, deriving the rail viewport's `min-height` from `markScales()` rather than a flat cell height | **Accepted.** A future padded asset is now automatically safe, which is the class fix rather than the instance. |
| A's insights-orb removal across nine surfaces | **Accepted.** A round-8 comment claimed the orbs were deleted and only one rule had been touched; they had been rendering against DESIGN.md's explicit anti-reference on nine surfaces since. A stale comment asserting a fix is the same defect class as a gate asserting coverage. |
| A's `.band-dark` alias restatement | **Accepted.** The diagnosis is the valuable part: `:root`'s value happening to match in dark theme is exactly how a leak stays invisible until a theme flips. |
| B's launcher DOM move, 77 to 84 Tab stops down to 10 | **Accepted.** |
| B's collision fix watching StickyBriefCTA's DOM presence rather than copying its thresholds | **Accepted, and the reasoning is correct.** A copied threshold is this repository's signature defect, and it left `StickyBriefCTA.tsx` untouched by the widest possible margin. The string dependency it introduces is §2.2, not a criticism of the approach. |
| B's `Person` schema on four fields, with `url` as a resolvable `/leadership#{slug}` fragment | **Accepted.** Adding `id={member.slug}` so the fragment is real rather than invented is the right instinct. |
| B's `ThemeToggle` finding and its two-mount solution | **Accepted.** The component was built in round 10 and imported nowhere for four rounds, and the stale `NavBar.tsx` comment explaining why was itself wrong. Measuring before diagnosing found both. |
| B's retraction of the header-only placement after measuring 2.5px of overflow at 360px | **Accepted.** Measured, not assumed, and retracted rather than shipped. |
| B's refusal to build region-per-country capture unilaterally | **Accepted.** Ruled in §2.3. |
| B's verification of the model-cost question against Anthropic's published pricing rather than memory, and its recommendation not to switch tiers blind | **Accepted.** Sonnet 5 stands, `client.ts` unedited and verified unedited. |
| B's real end-to-end brief test, confirmed by querying `submissions` directly rather than trusting a 200 | **Accepted.** This is what verification means. |
| A's and B's refusal to build `/intelligence/research` | **Accepted, twice.** Both were right. The blocker is Sumeet's ruling on the five conclusions, drafted 4 August. |

### 1.2 My rulings that Code superseded, and my errors

**The hover-arrow focus state is withdrawn.** I ruled that A's hover-only gold arrow needed a matching `:focus-visible`. A instead made the arrows permanently visible on your correction, which removes the hover dependency altogether and is a better fix than mine. My ruling is superseded, not partially applied. Worth recording that `check:type-scale`'s A5 gate independently caught the transform-only hover state, so the reduced-motion half was closed by a gate rather than by either of us.

**The purge-cron hold is discharged, conditionally.** I ruled the daily purge could not go live unwatched. B has since provisioned real credentials and applied `0001_submissions.sql` against the live Neon database. `0002_assistant_transcripts.sql` has **not** been applied there. The hold now resolves as §2.1: apply, seed, watch which rows it selects, then enable.

**Two stale SHAs, mine, again.** `main` was already at `80e634d` with round 13 merged when A started, so housekeeping instructed a merge that had already happened. The hedge worked and A reported the real tips first, but that is twice.

**The territory split was the dispatch's weakest assumption, and it is mine.** §3 of round 14's scope assigned `src/components/**` to B and `scripts/**`, `src/lib/db/**` and `src/app/api/**` to A. Both sessions then crossed the line, in both directions, because you gave direct live instructions to each of them. A edited `nav-config.ts`, `globals.css`, `EditorialLayout.module.css` and `LogoRail.tsx`; B edited `api/brief/route.ts` and `api/cv/route.ts`. Both logged the crossing openly rather than hiding it, which is the correct behaviour and is why the merge is recoverable.

**The standing rule this produces:** a territory split does not survive the human instructing both sessions live. It is a merge-safety device between two dispatched briefs, not a boundary that binds you. Where live direction is expected, either run one session or accept that the split is advisory and budget the merge accordingly. Round 15 runs one session for exactly this reason.

---

## 2. Rulings new this round

### 2.1 The retention claim is now wrong in the other direction

**Measured, from both relays.** B found the launcher disclosure and `/privacy` both claiming conversations are kept for 12 months when no transcript store existed, and corrected both to what was true at the time. A, on its own branch, then built `assistant_transcripts` with a 365-day purge. **After the merge, B's corrected copy understates what ships and A's store has copy that denies it exists.** Neither session could see this; only the merge creates it.

**Ruling.** The privacy section and the launcher disclosure both describe retention accurately for the shipped configuration, and both are gated behind the same flag that gates the assistant, so the copy appears only when the surface does. One source, derived, not two hand-written statements that already drifted once within a single round.

**The failure mode, stated because this is a claim about data handling.** A privacy page that describes a retention period the code does not implement is a false statement to a visitor about their own data. So is one that stays silent while a store quietly retains. Whichever direction it drifts, it is the kind of defect that matters more than anything else in this round.

**Before this can be true, `0002_assistant_transcripts.sql` must be applied to the live Neon database and the purge watched.** Apply it, seed a deliberately aged row, run `db:purge-transcripts`, and report which rows it selected before enabling `.github/workflows/purge-transcripts.yml`. A cron whose failure mode is deletion does not go live on a syntax check.

### 2.2 The collision guard depends on a typed string with no gate

**Measured, from B's relay, which flagged it itself.** `AssistantLauncher.tsx` finds StickyBriefCTA by the literal selector `[aria-label="Contact CTA"]`. If a future round changes that label for any reason, including localisation, the `MutationObserver` silently stops matching and the two surfaces overlap again at 360px with nothing catching it. B stated plainly that its own measurement is the only evidence, not a standing check.

**This is the eighth instance of this repository's signature defect**, and the standing rule is to rule on the class: a value copied into a second place always drifts, and each copy hides in a shape the previous lint could not see.

**Ruling, as constraints rather than an answer.** The label stops being typed in two places: it derives from one exported constant that both `StickyBriefCTA.tsx` and `AssistantLauncher.tsx` consume, or from an equivalent single source. A gate asserts the collision does not occur at 360px with both surfaces live, which means it must scroll far enough to trigger StickyBriefCTA rather than testing the launcher's route alone. **If deriving the constant means editing `StickyBriefCTA.tsx`, that is authorised this round** for the export only. Round 14's "never move, resize or restyle" prohibition covered its layout and behaviour, not the addition of an exported string, and B honoured that prohibition correctly under the reading available to it.

### 2.3 Region-per-country capture: not now

**Ruled, per your own instruction to let Chat decide.** The coarse enum stays. Do not widen `region`, and do not add a parallel free-text field.

**Reasoning.** B measured the collision accurately: `region` is `briefFormSchema`'s enum, shared field-for-field with the Anthropic tool schema in `client.ts`, validated again by `/api/brief`, and rendered by `/brief`'s own `<select>`. Widening it is a contract change across three surfaces plus the canonical form, arriving in the week the site is trying to cut over. The commercial value is real, because Riyadh and Dubai are genuinely different staffing problems, but it is not worth a contract change at this point in the schedule.

**When to revisit, so this is not simply deferred forever:** after cutover, once captured briefs exist, and only if the free-text fields on real submissions show the country is not already arriving there. That is a measurement, not a guess, and it costs nothing to wait for.

### 2.4 The mark tolerances stand, and the next loosening does not

**Accepted.** A loosened rail 0.13 to 0.36 and card 0.02 to 0.23 when Sephora's mark joined at 8.06% ink, the lowest in the pack. Re-measured honestly via `check-marks.mjs --sweep` rather than hand-picked, matching the pattern Richemont's 12.8% already set. The alternative was rejecting a real client mark, which is worse.

**The limit, recorded now rather than argued later.** The tolerance is now set by the two lowest-density marks in the set, and a global tolerance loosened to accommodate outliers stops describing the other twenty. A third low-density mark does not get a third loosening: it gets a per-mark override or a padding-normalisation step in `build-logos.mjs`. Whoever hits this next should read this paragraph rather than reach for the sweep.

### 2.5 The tail, ruled briefly

- **`package.json`'s `"name": "talent.yallo.co"`** contradicts the ratified domain architecture. Rename to `yallo-talent-website`, matching the repository.
- **`.claude/launch.json`** gains `session-b-r14`'s missing entry only if it is still useful; round 15 is single-session, so add `session-r15` instead and leave the round 14 entries alone.
- **`ThemeToggle.tsx`'s mid-session `matchMedia` listener** still repaints on an OS theme change while `src/config/theme.ts` ignores OS preference for the initial paint. Same inconsistency, two mechanisms. Ruling: the toggle stops following OS preference mid-session, matching the forced-light default. A visitor who has seen a light page does not expect it to flip because their laptop reached sunset.
- **The Dependabot high-severity alert** gets triaged with one question answered first: is the vulnerable path reachable in production runtime, or is it dev or build-time only? Report the answer before proposing an upgrade. A dependency bump taken blind at this point in the schedule is its own risk.
- **The heading-fade defect** stays with Sumeet until he reports whether it survives an incognito window. A retracted its font-swap dismissal correctly and has exhausted static analysis. Not a Code item until that answer exists.

---

## 3. The merge is the round

Both branches have diverged heavily and both crossed the other's territory. This is not a routine integration.

**Merge order.** `feat/round14-surfaces` into `feat/round14-foundations` first, because foundations is the integrator branch and carries the mark pipeline and `globals.css`. Then foundations into `main`.

**An auto-merge is emphatically not a verified merge here.** Git will merge two additive edits to one file cleanly and report nothing. Whether both halves survived is a separate question, answered by reading the merged file. Read every file either branch touched, not only the conflicted ones. That is precisely how round 13's `transcriptRef` mismatch was caught, by reading rather than by a gate.

**Files known to be touched by both sides, or dangerous for other reasons:**

| File or path | Why |
|---|---|
| `assets/client-logos/` | A committed pipeline output; uncommitted manual edits sit in B's worktree. **Preserve before any worktree removal.** |
| `src/app/api/brief/route.ts`, `api/cv/route.ts` | A's territory, edited by B under live instruction. Keep B's `RESEND_TO` array fix and its sender-default change. |
| `content/clients.yaml` | A set Informatica's `consentOnFile` to `false` reversing R-INF3. Confirm it merges to `false`, never back to `true`. |
| `src/lib/assistant/corpus.ts`, `src/data/legal/*`, `privacy/page.tsx` | B's domain sweep. Reconcile against §2.1 rather than accepting either side. |
| `src/app/layout.tsx` | B's launcher reorder. A confirmed it never hand-edited this file. |
| `package.json` | A added `db:purge-transcripts` and `db:read-submissions`. Lockfile conflicts resolve by union then `pnpm install`, never by hand. |

**Nothing in `assets/client-logos/` gets committed or discarded this round.** Copy it out, list what is there, name which files `build-logos.mjs`'s `CLIENTS` and `PLATFORMS` maps actually consume, and report. That folder now carries near-duplicate files for the same two vendors by design, and a session guessing which is live will pick wrong.

---

## 4. Forbidden this round

- **No Phase 8 fixes.** Re-baseline measurement only, changing nothing. Round 16 owns render-blocking CSS and font delivery.
- **No turning the assistant flag on in a committed default.** Ratified. It stays off through cutover.
- **No widening of `briefFormSchema`'s `region` enum.** §2.3.
- **No committing or discarding anything in `assets/client-logos/`.** §3.
- **No dependency upgrade for the Dependabot alert** before the reachability question is answered. §2.5.
- **No biography, specialism, contact detail or credential for any real named person.** Unchanged, and B correctly reported four of five leaders have no `bio` and none has a usable contact field. Absent stays the default until Sumeet says otherwise.
- **No echoing of any `.env.local` value in tool output**, by any mechanism, including a redaction command. Two sessions have now printed a live key while trying to hide it.

---

## 5. Open with Sumeet

1. **The five research conclusions**, drafted 4 August, still unruled, and now the reason two sessions have declined to build `/intelligence/research`.
2. **Metric definitions.** One auditable definition each, an "as at" date, a named refresh owner. Still the last cutover blocker.
3. **The heading fade**: does it survive an incognito window?
4. **`assets/client-logos/`**: are the uncommitted edits yours, and how do you want them landed?
5. **The demo server on port 3214 is still running with the flag on and live credentials**, per B's own risk note. Anyone touching the brief flow writes a real row and sends real mail.
6. **`RESEND_FROM` and `RESEND_TO` are unset**, with code defaults doing the work. Fine as shipped, not a recorded production decision.
7. **The Phase 8 go-live call**, unchanged: wait for 2.5s, or cut over on a documented miss with a stated plan.
8. Carried: specialism and contact route per named leader; Informatica's classification, now reversed to platform-axis only on your confirmation; the R-AI3 veto window; the go-live date pending Raphy.
