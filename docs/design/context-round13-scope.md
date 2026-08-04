# Context — Round 13: foundations and the assistant

**v1.0 · 4 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. This file governs round 13 and supersedes stale parts of the game plan and the defect register.
Companion, load-bearing: **`context-round13-chatbot.md`** carries the assistant's full specification and is session B's primary source. **`context-round14-research.md`** is round 14 and is not in scope here.
Carries forward whole: `context-round9-scope.md` §6 (rubric), §7 (forbidden), §9 (Impeccable), §10 (close-out loop); `context-round12-scope.md` §6 (forbidden).

**Two sessions this round.** Territory split and pre-adjudicated overlaps in §3. Handshake string: **`ROUND13-SPLIT-OK`**.

---

## 1. Adjudication of round 12

Both halves ruled. Nothing below is reopened.

### 1.1 Accepted, and the five worth naming

| Finding | Ruling |
|---|---|
| **The axe experimental gate paid for itself inside its own round.** It immediately found two more live instances of the WCAG 2.5.3 class the brand-link fix was written for — the `/case-studies` grid card, and the expertise "show all" button whose hand-written `aria-label` had drifted from its own `+N more` badge. Both fixed. Self-test done properly: the brand-link defect reintroduced, the gate watched failing on `.NavBar-module__brand`, reverted, rebuilt, green. | **Accepted, and this is the round's best result.** A Level A failure sat on this site for six rounds behind two green gates. Adding the gate found two more instances in the same sitting. The self-test is what makes the gate trustworthy rather than merely present. |
| **`check-taxonomy` caught a hand-copied case-study slug inside `check-phase8.mjs` itself**, and the fix was to use the existing `sampleCaseStudySlug()` helper the other four gate scripts already use. | **Accepted.** A gate script carrying a hand-copied value is the defect class this build keeps hitting, found inside the tooling written to prevent it. Deriving rather than re-typing is always the fix. |
| **`/leadership` added to 4 of 6 enumerating gates, not 6**, with `check-motion` and `check-marks` deliberately excluded because both are scoped by their own route comments to routes carrying Framer animations or client marks, and `/leadership` has neither. | **Accepted, and the judgement was better than my instruction.** I wrote "into the enumerating gates" without qualification. Forcing a route into a gate that cannot meaningfully assert against it manufactures a false check, which is worse than a known gap. §4.4 turns this into the class fix. |
| **The new `check-yallo-case` pass immediately found a real defect on the page it had just been pointed at**: both `/leadership` eyebrows read "Yallo Talent's leadership" inside a `text-transform: uppercase` span, rendering "YALLO" against canon §2. Fixed to "Leadership" and "The team". | **Accepted.** Second gate addition in one round that found a live defect on first run. |
| **The first Phase 8 run was discarded rather than reported**, because its timing overlapped a concurrent session's server start closely enough that contamination could not be ruled out. | **Accepted, and it is the right instinct.** A measurement that authorises a DNS cutover is worth re-running. Reporting a number you cannot defend is the failure this round was built to avoid. |

### 1.2 Accepted without further comment

| Item | Ruling |
|---|---|
| Two §2 ref mismatches found, reported, traced and confirmed before proceeding rather than worked around | **Accepted.** The stop-and-report instruction worked exactly as intended. |
| Merge verified by reading every merged file plus tree-wide `check:terms`, not by the absence of conflicts | **Accepted**, now the standing standard. |
| `main` pushed; worktree removed and branches deleted only after ancestry confirmation | **Accepted.** |
| `CvUploadForm` client half, verified in a real browser rather than by reading the diff | **Accepted.** |
| Footer Academy marker removed together with the now-dead `live`-flag ternary | **Accepted.** Removing the mechanism with its last consumer is right. |
| Three standing rulings recorded as comments, no behaviour change | **Accepted.** |
| `Organization.sameAs` defined once alongside `SERVICES`/`ENTITIES`, `name` unchanged, no `parentOrganization` | **Accepted**, and derived rather than hand-typed as instructed. |
| `Person` schema left untouched | **Accepted.** |
| `CaseStudyCard` restructured to a small anchor plus stretched pseudo-element, reusing the homepage rail's existing pattern | **Accepted.** Reusing the pattern already in the codebase beats inventing a second one. |
| Two different-class axe findings logged with severity rather than fixed at speed | **Accepted**, and §4.3 schedules them. |
| `check:phase8` wired as daily cron plus `workflow_dispatch`, offset from `crawler-access.yml`, confirmed absent from the `pull_request` trigger, results file gitignored | **Accepted.** |
| The concurrent session's handover relay committed as supporting evidence | **Accepted.** Two independent measurements agreeing is worth more than one. |
| The round 13 and round 14 context files left untracked because they were not that round's | **Accepted**, and §2a commits them now. |

### 1.3 My errors, named

Three instructions of mine were wrong. Recording them because a session that cannot trust the brief slows down, and because two of these would have shipped.

**1. §4.3's `band-invert` prescription was a no-op as written, and Code caught it by measuring.** I instructed that `.sectionAlt` compose `band-invert`. `.band-invert` only re-scopes custom properties — unlike `.band-dark`, it never paints a background. Composing it alone would have left `.sectionAlt` transparent and changed nothing, while looking fixed in the diff and in the class name. Code measured the computed background before trusting the fix, found the gap, and added `background: var(--ground)` locally, matching `Home.module.css`'s own `.invert` precedent. **That is the correct fix and it is not the one I specified.** The instruction was written from a class name rather than from a measurement.

**2. §5.2's lever table was wrong in two places.**

- **IBM Plex Mono's `preload: false` is a priority change, not a byte saving.** I carried round 11's 19.6 KiB forward as though it had been removed from the payload. The bytes are still fetched, at lower priority; only the eager `<link rel=preload>` went. So the 186.7 KiB preload budget did not fall by 19.6 KiB in any sense that reaches the metric.
- **"Unused JavaScript, 113–126 KiB per route" is not a lever.** It is Next's own `Link` prefetch working as designed, confirmed at the network level at `priority=Low`, `initiator=script`. Listing it as a lever invited a session to break prefetch chasing a Lighthouse line item.

**3. The prompt had no live-concurrent-session check.** I told session A to expect a dirty tree and to stop on an unexpected ref, but not to establish that no other session was actively holding the checkout. One was — a resumable round 11 session that had restarted a server on 3107 and written five scratch scripts into the same scope. The Code UI had warned about exactly this and I passed the warning through as informational. §3.1 makes it a hard first step.

Also noted, and not an error but a stale figure: `main` was 24 commits ahead of `origin/main`, not the 4 my §2 table carried from round 11's relay. The table was marked an expectation and the stop-and-report instruction caught it, which is the system working rather than failing.

### 1.4 Rulings on round 12's open questions

**Open item 1 — `/why-yallo`'s eyebrow: fix it, and fix the class rather than the instance.**

Code asked whether closing an adjacent-looking defect on a closed page, found by inspection rather than by a mandated gate, is in scope. The answer is yes, but the instance is not the point. **The real defect is that `check-yallo-case` runs against a hand-maintained route list.** That is why `/leadership` was missing until round 12 added it by hand, and it is why `/why-yallo` is missing now. Adding one more route by hand guarantees a third instance.

**Ruling: drive `check-yallo-case` from `publishedPaths()` rather than a hand list**, then let the gate confirm `/why-yallo` and fix whatever else it finds. Code itself described that gate as general-purpose across templates, which is precisely the property that makes an exhaustive route set correct for it. Apply the same reasoning to any other gate whose own comments do not scope it to a route property. §4.4.

**Open item 2 — carried items are unchanged**, and §7 restates them.

**The Phase 8 verdict: accepted as a miss, and the recommendation is accepted and scheduled.** §4.5.

---

## 2. Ground state

**[MEASURED, from round 12's relay — verify before acting]** `main` = `origin/main`. The base round reported `HEAD` at `cdc2510`; the bolt-on reported `3572e6a` and described it as unchanged since the base round, which cannot both be true. **[⚠] Establish the real `origin/main` tip first and report it.** The discrepancy is almost certainly the bolt-on's own commits (the workflow, the gitignore entry, the committed handover relay) and is informational, not a blocker.

Uncommitted and untracked in the working tree, expected:

| Path | Action |
|---|---|
| `docs/design/context-round13-chatbot.md` | **Commit** (§2a) |
| `docs/design/context-round14-research.md` | **Commit** (§2a) |
| `docs/design/context-round13-scope.md` | **Commit** (§2a) — this file |
| `docs/gtm/platform-employer-signals-2026-08-02.md` | **Leave.** Not this round's, still not anyone's here. |
| `scripts/audit-*.tmp.mjs` | **[⚠]** Five scratch files written by the concurrent session. Round 12 reports it modified no tracked file, so these are untracked. Delete them, by explicit path, and say so. Do not `git clean`. |

### 2a · Commit the three context files first

By explicit path, before any other change. `git add -A` would sweep the GTM note and the scratch scripts in.

---

## 3. Topology: two sessions

Round 14 is **not** one of them, and that needs saying plainly: the research family is blocked on copy that does not exist, and the blocker is Chat, not Code. Both sessions this round are round 13.

| | Session A — foundations | Session B — the assistant |
|---|---|---|
| Branch | `feat/round13-foundations` | `feat/round13-assistant` |
| Location | Main checkout | Worktree `../yallo-talent-website-B` |
| Port / dist | 3113 / `.next-a-r13` | 3213 / `.next-b-r13` |
| Role | **Integrator.** Merges B at the end. | Feature session. |

**Territory, and it is exclusive both ways.**

Session A owns: `src/lib/db/**` and any migration directory · `src/app/api/brief/route.ts` and `src/app/api/cv/route.ts` · `src/components/layout/nav-config.ts` · `src/app/layout.tsx` · every existing file under `scripts/**` · `package.json` and `pnpm-lock.yaml` · `.github/workflows/**` · `.gitignore` · the round 12 carried fixes in `src/components/**` and `src/app/why-yallo/**`.

Session B owns: `src/lib/assistant/**` (new) · `src/app/api/assistant/**` (new) · `src/components/assistant/**` (new) · `src/app/privacy/**` · **new** gate scripts named `scripts/check-assistant-*.mjs` only.

### 3.1 First step for both sessions, before anything else

**Establish that no other session holds this checkout.** Round 12 found a live, resumable session running in the same folder, restarting servers and writing scratch scripts into the identical scope, and discarded a Phase 8 measurement because of it. Check for running `next start` processes and for `claude --resume` ancestry. **If another session is live in this checkout, stop and report — do not stop its processes without the user's explicit authorisation.** Then print the handshake.

### 3.2 Pre-adjudicated overlaps — apply these, do not negotiate them

**1. `package.json` and `pnpm-lock.yaml`.** Both sessions need new dependencies: A a Postgres client, B the Anthropic SDK. **Resolution at merge: take the union of `dependencies`, `devDependencies` and `scripts`, then regenerate the lockfile with `pnpm install`. Never hand-merge a lockfile.** B may edit both files locally to work; A's formatting wins.

**2. Mounting the assistant launcher.** B's component has to be mounted, and `src/app/layout.tsx` is A's. **A mounts it in its first commit**: a deferred dynamic import of `src/components/assistant/AssistantLauncher`, behind an env flag defaulting to off, contributing nothing to the initial bundle. B fills the component at that exact path. Neither session edits the other's side of that seam.

**3. The capture contract.** B emits a brief; A builds where it lands. **A lands the contract in its first commit and states its exact shape in its relay.** It is `briefFormSchema` plus a `source` discriminator and a transcript reference, per `context-round13-chatbot.md` §4.2. **B does not edit `api/brief/route.ts`** — it posts to the endpoint A defines. If B needs a field the schema lacks, B logs it for A rather than adding a second schema.

**4. If either session finds it needs a file the other owns**, log it in the relay and move on. Do not edit across the line, and do not wait.

---

## 4. Session A — the work

### 4.1 The durable capture layer

`context-round13-chatbot.md` §2 and §2.1 are the specification, and §2's three defects are measured from the repository. **L1 is the one that matters: with `RESEND_API_KEY` unset the route returns `{ ok: true, delivered: false }` and a 200, so the form reports success while the payload is `console.warn`'d and lost.** Close it: a validated payload that cannot be delivered is persisted and **never** reported to the user as sent.

One append-only table, one row per submission: the raw validated payload, a `source` discriminator, referrer and campaign parameters, a timestamp, and a delivery status per downstream. Then email routes off the record. Neon Postgres per the golden path. Both `api/brief` and `api/cv` route through it.

No CRM integration, no Vincere push, no HubSpot. Ruled 3 August: Hub is expected operational by end of August and one connector is built then. `RESEND_TO` goes to Sumeet's `brief@yallo.co` and `hello@yallo.co` aliases, which now exist.

### 4.2 The Intelligence nav card, and the gate that should have caught it

`context-round13-chatbot.md` §8a. Repoint the featured card at `/intelligence` and rewrite the copy to describe what that hub holds. **No compensation language** — `context-round14-research.md` §1 records the measured finding that the LTI corpus contains no compensation data at all, so the promise was never meetable by any page.

Then the gate, which is the more valuable half: **no existing gate compares a nav card's promise against its destination.** Add one, driven from the same banned-vocabulary source `check:terms` already uses. Reintroduce the compensation wording, watch it fail, revert.

### 4.3 Round 12's two logged axe findings

Both are `[MEASURED]` by round 12, both themes, both widths.

- **`p-as-heading`, Serious**: `Home-module__aiStatValue` on `/`, `Home-module__personaStatValue` on `/ai-talent`. Styled `<p>` doing a heading's job.
- **`focus-order-semantics`, Minor**: `.L1PageShell-module__expertiseGrid` on `/industries/retail`.

Fix the class, not the two instances: if the same styled-paragraph-as-heading pattern exists elsewhere, it is in scope.

### 4.4 The gate route-set class fix

Per §1.4. **Drive `check-yallo-case` from `publishedPaths()` rather than its hand-maintained route list**, then fix what it finds — `/why-yallo`'s hero eyebrow ("Why Yallo Talent" inside an uppercase span) is the known instance, and there may be others.

Apply the same reasoning to every other gate **whose own comments do not scope it to a route property**. `check-motion` and `check-marks` stay scoped, per §1.1: they assert against Framer animations and client marks respectively, and a route without either cannot be meaningfully checked. Report which gates moved to exhaustive route sets and which stayed scoped, with the reason for each.

### 4.5 The Newsreader italic split — build the recommendation

Round 12's bolt-on named this and correctly did not build it, since §5.5 forbade reaching for a fourth idea mid-measurement. **It is now the mandated work.**

`[MEASURED]` twice, independently: Newsreader italic renders at **weight 600 only, 3 nodes, on exactly two routes** — `/` ("six people you couldn't find.", 308px) and `/platforms/sap` ("by module.", 205px). Both above the fold, which is why `preload: false` was correctly refused. The current file is a variable font spanning 400–600 across both styles at **63.0 KiB, a third of the entire preload budget, to render two phrases at one weight.**

Split it: a second `next/font/google` declaration at `weight: ["600"], style: ["italic"]`, with a CSS rule routing `font-style: italic` to that instance wherever Newsreader italic is used. **It stays preloaded**, so no flash of fallback italic and no design decision is needed — which is exactly why it sidesteps §5.3's boundary rather than testing it.

**Then measure: `check:phase8 --passes 4`, worst-pass, Lighthouse 12.8.2, on a settled build.** Report the before and after tables. The fences from round 12 §5.4 still bind: **no dropping a type family, no changing the gate or the Lighthouse version to reach the number, no reporting a number you did not measure.**

**Expect a partial improvement and possibly still a miss.** The gap is 0.21s to 3.20s on LCP against a 2.5s ceiling, and this lever is worth a fraction of 63 KiB on two of eight routes. A miss reported honestly with the new binding pair per route is a complete item. **Do not chase the remaining gap** — the two known remaining causes are render-blocking CSS, which round 12 confirmed `cssChunking: 'strict'` cannot fix on Turbopack, and font delivery generally. Both are their own round.

---

## 5. Session B — the assistant

**`context-round13-chatbot.md` is the specification and it is complete.** Read it in full before writing anything: §3 architecture, §4 conversation design, §5 forbidden, §6 privacy, §7 gates.

The load-bearing decisions, so they are not rediscovered:

- **No vector database.** The corpus is 60 to 80 documents, generated from `src/data/**` and `content/**` at build time and filtered to published routes, held in a cached system prompt. A vector store would be a second source of truth, and copied-then-drifted values are this repository's most-hit defect class — round 12 found another one inside a gate script.
- **One model, Sonnet 5. No router, no cheap-tier triage.**
- **Deferred island.** Nothing in the initial bundle on any route, asserted by a gate. Phase 8 already misses; zero third-party requests is a measured property worth keeping.
- **Flag off.** It ships dark and opens after Sumeet reads 50 to 100 real conversations. `talent.yallo.co` is noindex, so there is no pre-cutover traffic to pilot against.
- **Brief qualifier, not a Q&A bot.** Answer, cite the page, and assemble the brief. Never ask for the email first.

**§5's forbidden list is the round's real risk surface, not the architecture.** Every item on it is a thing an ungoverned model does unprompted: quoting a rate the site bans, extending the 72-hour shortlist claim into a fill guarantee that **does not exist** (Sumeet declined the no-fee guarantee on 3 August, so any risk-reversal language is invented), characterising a named colleague beyond name and role, implying a candidate pool.

**The refusal suite is the gate that matters** (§7 item 1). Watch it fail on its own motivating cases before trusting it.

---

## 6. Forbidden — carried, with one addition

`context-round9-scope.md` §7 and `context-round12-scope.md` §6 in full, including: never report a gate as passing unless it was run and its real exit code observed; never conclude anything about a `load` timeout without restarting `next start` first, because a starved `next/image` key stays locked for the process's life and the false failure reproduces perfectly.

**Addition, from round 12:** **never trust a measurement taken while another session may have been running in the same checkout.** Round 12 discarded a Phase 8 run for exactly this. Establish exclusivity first (§3.1); if it is established mid-run rather than before, discard and re-measure.

---

## 8. Standing rules, discipline and the relay contract — binds both sessions

These have been re-typed into every prompt for thirteen rounds. They live here now. **Both sessions read this section and treat it as part of their brief.** A prompt cites it rather than repeating it; anything a prompt states in addition to this section is additional, never a replacement.

### 8.1 Git and commit traps, all learned the hard way

- **Explicit paths on every commit. Never `git add -A`** — the working tree reliably contains files belonging to another round or another person.
- **`git checkout -- tsconfig.json` before every stage.** `next build` and `next start` rewrite it to add a dist-dir `types/**` entry. Never stage it.
- **Re-`git add` after the biome pre-commit hook runs**, because it rewrites staged files and the staged copy goes stale.
- **`-F` not `-m`** when a commit message contains backticks.
- Commit type is **`chore(merge):`**, never `merge:`.
- Never commit `.next-*`, any dist directory, or a results file a CI job writes to the workspace root.

### 8.2 Measurement traps

- **Restart `next start` before believing any `load` timeout or image-optimiser stall.** A starved `next/image` key stays locked for the life of the server process, so the false failure reproduces perfectly inside it and looks exactly like a real asset defect. Round 11 lost four gate runs to this. Reproducibility is not evidence when the process is the broken thing.
- **Run browser gates serially**, and note that serial running alone is not sufficient once a key is poisoned.
- **Never trust a measurement taken while another session may have held the checkout.** Round 12 discarded a Phase 8 run for exactly this. Establish exclusivity first; if it is only established mid-run, discard and re-measure.
- **eslint gates nothing here.** CI lints with biome. Log eslint findings, do not fix them.

### 8.3 The adjacent-fix policy

A defect surfaced by a gate this round mandates is **in scope** — a Level A failure found by a gate you were told to add is not a finding for the next round. An adjacent defect of the **same class**: fix it and log it. A **different class** stumbled upon: file it with a severity, do not fix it. Closed pages do not reopen for refinement; fix only what your own work surfaces, and do not re-run the close-out loop across the site.

### 8.4 Discipline

- **Measure before you diagnose.** On this codebase the symptom keeps naming the wrong layer: a class name that paints nothing, a font that is still fetched, an image that was never slow.
- **Fix classes, not instances.** Almost every defect this build has found twice was a hand-maintained list, a copied value or a hand-written label that drifted from its source. Derive it instead.
- **Freeze before scoring.** Maximum two freezes per surface. Read the gate summary before you push.
- **Never invent a person, job title, tool, client, metric, quotation, source, case study or date.** No "coming soon", no dash-filled cell, no plausible placeholder, and no fixture that reads as a real client.
- **Never report a gate, score or check as passing unless you ran it and observed its real exit code.**
- **UK English, no em dashes, canon vocabulary.** The terminology lint governs generated output as much as authored copy.
- **Stop when the error rate rises.** Ship what is green, relay what stopped, and stop between units with everything behind you finished rather than mid-unit.

### 8.5 The relay contract

Every relay carries these sections, in this order, and **each is required even when empty**:

shipped · not reached · decisions taken under delegated authority, each with its reversibility · what you did not do and why · **retractions** · anything you needed from the other session's territory · open items, each with its exact unblocking question · risks · HEAD and the real exit code of every gate run.

The two sections that have produced this build's most valuable findings are **"what you did not do and why"** and **retractions**. Write them first, not last.

---

## 9. Open items for Sumeet after round 13

1. **Metric definitions** — one auditable definition each, an "as at" date, a named refresh owner. The last cutover blocker.
2. **Close the stale Code sessions.** Round 12 found a live round 11 session in the checkout. This is housekeeping only Sumeet can do, and it cost a measurement.
3. **Is Informatica a client or a platform?** §4.8 flipped its consent flag and it now renders on the client rail. It is the one name on this site that exists as both a platform desk and a rail entry, and the collision is worth thirty seconds of confirmation before wide circulation.
4. **R-AI3 amendment**, ruled by Chat under delegated authority and logged for veto: **`/ai-talent` may cite a sourced, dated scarcity figure.** The ban was written when no sourced figure existed; `context-round14-research.md` §2.4 now supplies one (573 professionals across Bedrock, Vertex AI and Azure AI Foundry in three markets, each under 1% of a 22,853 pool, as at 2 August 2026). The site's rule is no *unsourced* figures, not no figures. **Rates stay banned outright.**
5. **The five research pieces' conclusions** — Chat drafts from the extract, Sumeet rules on the commercial judgement. This is round 14's blocker.
6. Carried, unchanged: whether to mount `ThemeToggle`; a specialism and contact route per named leader; `Person` schema; monochrome portraits; a go-live date needing Raphy's availability.
