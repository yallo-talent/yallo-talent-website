# Context — Round 12: recover, close, measure once

**v1.0 · 3 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`.
Carries forward whole: `context-round9-scope.md` §6 (rubric), §7 (forbidden), §9 (Impeccable), §10 (close-out loop); `context-round10-scope.md` §11.5 (things confirmed good); `context-round11-scope.md` §2 (the roster ruling and its constraints), §6 (forbidden).

**One session this round.** Round 11's session A lost its shell partway through its first work item, leaving complete, built, unmeasured work uncommitted in the main checkout's working tree. Only a session in that tree can recover it, and every remaining work item sits in one territory (`scripts/**`, `src/components/**`, `src/styles/**`, `globals.css`, `.github/workflows/**`, `package.json`, plus `src/app/layout.tsx`). Session B's territory closed all three of its items and has no run's worth of work left in it, so it is folded rather than staffed.

---

## 1. Adjudication of round 11

Both relays ruled. Nothing below is reopened.

### 1.1 Accepted, and the four worth naming

| Finding | Ruling |
|---|---|
| **A: the merge was verified two ways rather than trusted** — byte-level `git diff <branch> main` empty across each branch's own touched files, then one production build serving all three branches' work simultaneously | **Accepted, and this is the standard now.** The behavioural check is the stronger one and it is what proved the merge rather than the absence of conflicts. Pre-adjudicating four overlaps that then did not exist was not wasted: the cost of the pre-adjudication is a paragraph, the cost of an unadjudicated conflict is an argument between two agents who cannot talk. |
| **A: the poisoned `next/image` optimiser key** — `check:a11y` failed four times identically, reproducing perfectly, and was not a defect in `panda-retail.png`. Settled by three measurements: `sharp` encodes it in 6ms, `curl` serves it in 34ms via `*/*` passthrough, a **fresh** `next start` serves the same key with a browser `Accept` header in 146ms | **Accepted, and the most valuable finding of the round.** A starved key stays locked for the life of the server process, so every retry inside that process fails identically. A perfectly reproducible false failure is more dangerous than a flaky one, because reproducibility is what we normally treat as evidence. Standing rule, added to §6. |
| **B: the "Six operators. Six practices." heading was false against the five-name roster**, with a lede claiming each practice lead has been in the role they screen for — untrue of Marketing & Growth and Finance & PMO | **Accepted, and this was the right call to make unprompted.** It is the §3 adjacent-fix policy working exactly as intended: the roster change surfaced the defect, so the defect was in scope. Replacing the copy with pure enumeration of the roster's own fields, plus a sentence already published on `/about`, introduced no new claim. |
| **B: shipped `bio` and `linkedin` as absent optional fields**, never an empty string, never a dash, never "bio to follow", and confirmed by reading the rendered accessibility tree rather than the source | **Accepted.** Verifying the absence in the render rather than in the data is the difference between believing a conditional works and knowing it does. |

### 1.2 Accepted without further comment

| Item | Ruling |
|---|---|
| A: merged branch tips one docs-only commit ahead of the named hashes | **Accepted**, same delta class as round 10 §1.2. |
| A: pinned `lighthouse` to exactly `12.8.2` rather than accepting the freshly-installed 13.4.1 | **Accepted, and it was the right call for the reason A gave second, not first.** Comparability with round 10 matters less than this: Lighthouse 13 replaced the legacy diagnostic audits with an `*-insight` set, so `largest-contentful-paint-element`, `render-blocking-resources` and `font-display` are absent from it. The gate would have reported LCP element `n/a` and a false `font-display` FAIL on all eight routes. A gate that cannot name the LCP element cannot direct the work. |
| A: `check:phase8` judges the worst pass, not the best | **Accepted.** The gate's green light would authorise a DNS cutover. "It reached 90 once" is a statement about variance. |
| A: WCAG and INP deliberately excluded from `check:phase8`, both stated in its own output | **Accepted.** Round 10's Label in Name failure scored 100 on `/brief`; a category score cannot stand in for `check:a11y`. TBT labelled as the lab proxy for a field metric is the honest treatment. |
| A: `chrome-launcher` as a devDependency so CI needs no second browser download | **Accepted.** |
| A: both round 10 worktrees removed after confirming clean twice, branches deleted only after confirming ancestry, remote refs left alone | **Accepted.** |
| A: `check:phase8` scheduled plus `workflow_dispatch`, never a PR gate | **Accepted**, same reasoning C applied to `check:crawlers` and it was right both times. |
| A: 25 eslint errors logged, not fixed, having verified none is a merge regression | **Accepted.** CI lints with biome at exit 0; eslint gates nothing here. `src/data` is not this round's territory either. |
| B: display spelling **"Chandrashekhar Kolar"**, corrected live by Sumeet mid-session, LinkedIn slug untouched at `chandrasekharkolar` | **Accepted and closed.** Three transliterations existed; the display name is Sumeet's, the URL is LinkedIn's and cannot be ours to change. There is nothing left to reconcile. Removed from the open-items list. Do not raise it again. |
| B: Sumeet's bio, every clause traced to `/why-yallo`'s credentials section and hero lede | **Accepted.** The traceability, stated clause by clause in the relay, is what made this shippable. |
| B: `/about` founder line restored via `git log -p` against the file rather than retyped from memory | **Accepted.** |
| B: homepage OG confirmed by downloading the PNG and reading its header for 1200×630, not by trusting the route | **Accepted.** |
| B: no `Organization.sameAs`, no `Person` schema, no photographs, no LinkedIn image fetching | **Accepted.** All four correct. §4 item 1 stays open. |
| B: LinkedIn URL verification attempted and inconclusive — `999` anti-automation on three, a Chromium navigation that never left the origin | **Accepted, and this is not a skipped check.** LinkedIn blocks automated verification; the URLs shipped are exactly as supplied, unguessed. It becomes a human item, §4 item 3. |

### 1.3 Reversed, amended, or mine to own

| Item | Ruling |
|---|---|
| **Round 11 §3.2's instruction to re-measure after each of the five font and JS steps** | **Reversed, and it was my error.** A measured `/contract` at 96 then 89, and `/capabilities/data-analytics` at 93 then 86, with no code change between passes. Per-step attribution below roughly 7 points therefore does not exist at two passes, and step 1 removed 19.6 KiB of a 186.7 KiB preload budget — comfortably inside that noise. Instructing per-step measurement bought a study nobody asked for at the price of the round. **Round 12 applies every lever, then measures the settled build once at four passes.** See §5. |
| **Round 11 §3.2's "five steps" framing as an ordered sequence** | **Amended.** A's §3.4 measurement makes the ordering wrong: Newsreader italic at 63.0 KiB is a third of the entire preload budget and a larger single lever than step 1 was, and it sat at position 2 behind a 19.6 KiB item. Levers are now ranked by measured size, §5.2. |
| **`src/app/layout.tsx` allocated to B while §3.2 mandated a `next/font` change to A** | **My error, not A's.** All three `next/font` declarations live in that one file and there was no other place the change could be written. A made it after confirming B's four items touched no part of it. Correct, and the territory grant in §3 now names it explicitly so the exception is not needed again. |
| **`main` left unpushed, 4 commits ahead of `origin/main`** | **Correct to hold, and now authorised.** Pushing was outward-facing and unasked, so declining was right. Ten rounds of merge history existing in one working copy is the larger risk, and the round 10 feature branches on `origin` are not a substitute for the merge commits. §2c authorises it. |
| **`/leadership` visited by only one of the six enumerating gates** | **Now in scope, and the reason changed this round.** It was a tolerable gap on a page of anonymous role cards. It is not one on a page naming five real people with links to their real profiles. §4.5. |

---

### 1.4 Amendments of 3 August, evening — Sumeet's rulings after the round 11 relays

Four, each recorded with its provenance, because three of them change what Code may treat as settled.

| Ruling | Consequence |
|---|---|
| **The four bios are withdrawn, not deferred.** Sumeet did not intend to supply them; he wrote as though they were already being written. He asks for a minimal version, noting that no photographs are being added either. | **The roster is final as shipped: name, role, link.** `bio` stays optional and absent for the four. Round 12 does no bio work and the item leaves the open list. Recorded for the file: a one-line function descriptor per entry would invent nothing on three of the five, but this site publishes no copy describing a marketing or a finance function, so it would break on two of five, and an inconsistent set of five reads worse than a clean one. If depth is wanted later, the Phase 1 benchmark §4 is specific that what converts is a **specialism and a direct contact route** per person, not a biography — Forsyth Barnes is the only firm in the benchmark set that clears that bar, and it clears it without bios. That needs one line of data per person from Sumeet, not prose from anyone. |
| **The company LinkedIn URL is `https://www.linkedin.com/company/yallogroup/`.** Supplied by Sumeet, 3 August. | Unblocks `Organization.sameAs`. It is the **Yallo Group** page and there is no separate Yallo Talent company page, so §4.7 rules how to use it without reintroducing the group shell. |
| **The logged-in check of the four personal LinkedIn URLs is not required.** | Leaves the open list. The URLs ship exactly as supplied. It is also the reason `Person` schema stays deferred — §4.7. |
| **Client logo consent is obtained for all named clients.** Sumeet's assertion of 3 August; Code may treat the consent flag as clear. | Closes the first of the two cutover blockers. **Recorded with its provenance rather than as a fact of this file**, because the game plan flagged logo rights as `[⚠]` on the basis that enterprise MSAs commonly restrict them. Nothing further is needed for the build. Whether a written record exists per client is a commercial question and it stays Sumeet's. |

---

## 2. Ground state, and what has to be recovered first

Everything in this section is an **expectation** drawn from two relays, not a measurement of the tree as it stands now. Verify each before acting on it, and stop and report on any mismatch rather than working around it.

**Expected branch and commit state:**

| Ref | Expected at | Contents |
|---|---|---|
| `main` | `56fb7fc` | Round 10's three branches merged. **4 commits ahead of `origin/main`.** |
| `feat/round11-perf` | `56fb7fc` | Main checkout. Same commit as `main` — A committed nothing after the merge. |
| `feat/round11-pages` | `7b9a7b4` | Worktree `../yallo-talent-website-B`. Three commits: roster, `/about` founder line, homepage metadata. |

**Expected uncommitted, in the main checkout's working tree.** This is round 11 session A's complete, built, unmeasured work. It is not stray:

| Path | State |
|---|---|
| `scripts/check-phase8.mjs` | New, complete, run successfully three times |
| `package.json` | `check:phase8` script; `lighthouse` at exactly `12.8.2` and `chrome-launcher` as devDeps |
| `pnpm-lock.yaml` | Matching |
| `src/app/layout.tsx` | `preload: false` on IBM Plex Mono. Built green; **effect on the numbers never measured** |
| `docs/relay/v19-A.md` | Round 11 session A's relay |
| `docs/gtm/platform-employer-signals-2026-08-02.md` | Untracked, pre-existing, **not this round's and not to be committed** |

**`tsconfig.json`** is rewritten by `next build` and `next start` (adding a dist-dir `types/**` entry to `include`). It was clean at A's last observation. `git checkout -- tsconfig.json` before every stage, per `AGENTS.md`. Never stage it.

A server may still be listening on **3107** with `NEXT_DIST_DIR=.next-a-r11`. `.next-a-r11/` and any `.next-*` directory is session-local and must never be committed.

**Observed 3 August, evening: the Code UI reports 7 files changed, +1685 −3 on `feat/round11-perf`, and offers to stash them when a branch switch is attempted.** That count is consistent with the six paths above plus the `tsconfig.json` build rewrite.

- **Do not stash.** A stash is a second place for the round's foundation to be forgotten or dropped, and §2a's commit is the intended resolution. Decline the offer.
- **Do not switch branches until §2a has committed.** The checkout is expected to be on `feat/round11-perf`; committing there is what makes `git checkout main` safe, and that checkout is a step for this session to run.
- **The same UI reports that other sessions are registered against this folder.** That cannot be verified from Chat, and registered is not the same as running. If anything is uncommitted beyond the six paths above, or another process holds the checkout, stop and report rather than working around it.

### 2a · Recover before anything else

Commit the five paths above, by explicit path, before making a single further change. The runner and the baseline it produced are the round's foundation and they exist in exactly one place. `git add -A` would sweep the untracked GTM note and a build directory into the commit.

### 2b · Then merge, foundations first

`feat/round11-perf` into `main` first, then `feat/round11-pages`. Foundations before content: the perf branch carries `scripts/**`, `package.json` and `src/app/layout.tsx`; the pages branch carries `src/app/page.tsx`, `src/app/about/page.tsx` and `src/data/team/index.ts`.

**No conflict is expected — the two branches share no file.** That is an expectation and not a verification. An auto-merge is not a verified merge: read each merged file and run `check:terms` tree-wide, then the full gate suite plus a production build, before treating the base as settled.

**B's worktree.** `feat/round11-pages` is checked out in `../yallo-talent-website-B`, which does not prevent merging it from here. Do not enter that folder to work in it. Before removing the worktree, confirm it is clean — session B's relay may be uncommitted there, and a removal would lose the repository copy. If it is dirty, leave it in place and report what is in it. Delete the branch only after confirming it is an ancestor of `main`. Leave `origin`'s copies of any branch alone.

### 2c · Push `main`

Authorised, and it is the only outward-facing action in this round. After the merges are green, push `main` to `origin`. If the push is rejected — branch protection requiring a pull request is the expected reason, and it has never been confirmed enabled on this repository — report the exact error, open a pull request instead, and never force.

---

## 3. Territory

One session, so the territory is the whole repository, with three carve-outs that are about care rather than ownership:

- **`src/app/layout.tsx` is in scope this round.** It is where all three `next/font` declarations live and §5 mandates changes to them. The round 11 allocation that put it out of A's reach was my error.
- **`src/data/**` and `src/app/**` are in scope only for the specific items named in §4 and §5.** They are not open for refinement. Round 10 closed nine page-groups and round 11 closed `/leadership` and `/about`; none of them reopens. If an item below surfaces a defect on a closed page, fix that defect and say so, and do not re-run the close-out loop across the site.
- **`docs/gtm/platform-employer-signals-2026-08-02.md`** is somebody else's untracked file. Leave it exactly where it is.

**The adjacent-fix policy.** If a measurement or gate run this round instructs surfaces a defect, it is in scope — a Level A failure found by a gate this round mandated is not a finding for the next round. An adjacent defect of the same class: fix it and log it. A different class stumbled upon: file it with a severity, do not fix it.

---

## 4. The gates and the closures — items 1 and 2

### 4.1 The axe experimental-rules gate — first, because it finds this round's work

Round 11 §3.4, not started. A WCAG 2.5.3 Level A failure sat on every page of this site for six rounds because `check:a11y` does not run axe experimental rules and the Lighthouse accessibility category weights that audit at zero. Two green gates, one Level A failure, and no contradiction visible from either.

Add an experimental-rules pass — a flag on the existing gate or a second script, whichever fits the shape already there. Then prove it: **reintroduce the brand-link Label in Name defect, watch the new gate fail on that exact case, revert.** A gate nobody has watched fail on its own motivating defect is not a gate.

It runs first because it will surface pre-existing findings, and findings that arrive early in a round get fixed in it. Fix what is cheap and in territory; log the rest with a severity rather than fixing everything at speed.

### 4.2 `CvUploadForm` — the same treatment `BriefForm` now has

Round 11 §3.5, not started. `/brief` announces its validation errors properly and `/jobs` does not, and `/jobs` is the candidate-facing one. Shipping an accessible form beside an inaccessible one is worse than having fixed neither.

Bring it to `BriefForm`'s established pattern: `aria-invalid` and `aria-describedby` per field wired to a `role="alert"` error with a stable id, a `role="status" aria-live="polite"` status line, client-side validation before the fetch, and focus movement to the first invalid field on failure. Server-side validation is already solid — file type and size checks, zod, an HTML-escaped body — so this is the client half only.

### 4.3 `.sectionAlt` — the dark-theme collapse

Round 11 §3.3, not started. B measured it and B is right. `.sectionAlt` in `src/components/blocks/editorial/EditorialLayout.module.css` composes `band-dark`, a permanently dark surface identical in both themes. Light theme alternates correctly. In dark theme the plain `.section`'s inherited background resolves to the identical `rgb(14, 15, 17)`, so every mid-page section collapses into one undifferentiated surface with no rhythm.

`globals.css` documents `band-dark` as reserved for the footer, the closing CTA and the L1/L2/service hero plates. This is the wrong token for a mid-page alternation.

**Fix: `.sectionAlt`'s mid-page use composes `band-invert`. `band-dark` stays on `.hero` and `.bottomCta` only.** The shell is consumed by `/why-yallo`, `/about`, `/leadership`, `/jobs` and `/insights`. Verify all five in both themes at 360 and 1280, and confirm `DESIGN.md`'s Two Band Rule holds on each — at most two inverted bands per page.

### 4.4 The footer's Academy marker — remove it

**Ruled by Chat under delegated authority, logged for Sumeet's veto.** The footer carries "Yallo AI Academy — LAUNCHING". It has been an open question across three rounds and it resolves against keeping it: it is an undated claim about a future launch, on a site days from cutover, for a property on a separate host (`academy.yallo.co`, GTM.03) that is not built. An undated "launching" marker is the kind of copy that is quietly wrong within a month and that nobody owns.

Remove the marker and the Academy entry with it. Do not replace it with a date, a "coming soon", or a dead link. If a live Academy link is wanted at cutover it is one line to add back at that point, against a host that exists.

### 4.5 Three standing rulings, recorded in code so they stop recurring

Round 11 §3.6 and §3.7, none started. All three are comments, not code changes:

- **`ThemeToggle` stays dormant.** It exists, it is correct, and nothing imports it. Do not mount it and do not delete it. Canon sets light as the default register and `prefers-color-scheme` already reaches dark; mounting a user-facing switch is a product decision Sumeet has not made, and deleting a working component to tidy up is the more expensive of the two mistakes. One-line comment recording that it is deliberately unmounted.
- **Legal pages stay permanently dark.** `LegalPageShell`'s `.body` composing `band-dark` is correct and passes contrast and axe. It disagrees with `/case-studies/[slug]`'s light register for the same nominal "Read mode" class, and they are genuinely different classes: legal pages are reference material, case studies are evidence in a sales path. Record the decision in a comment in the CSS. No code change.
- **`/brief` gets no no-JS fallback.** Confirmed absent, correctly logged twice. Closing it means a classic POST with a server-rendered response or a Server Action on the site's only conversion surface. A candidate for a post-cutover round; record it as such where the form lives.

### 4.6 `/leadership` into the enumerating gates

`check-gate-coverage.mjs` reports `/leadership` visited by only one of the six enumerating gates, `check-reflow`. Pre-existing, and it mattered less when the page carried anonymous role cards. It names five real people now, with links to their real profiles, and it is the page a named colleague will open first. Add it to the enumerating gates' route sets.

---

### 4.7 `Organization.sameAs` — unblocked, with one ruling attached

The URL is `https://www.linkedin.com/company/yallogroup/` (§1.4). Add it to the `Organization` schema's `sameAs`, derived from the same single source the four entities come from rather than hand-typed into a second place.

**The ruling: `name` stays "Yallo Talent". No `parentOrganization`, no group naming, and nothing user-facing that mentions Yallo Group.** The LinkedIn page is the real, owned, authoritative profile, and corroborating identity against it is precisely what `sameAs` is for. Asserting the parent relationship in structured data is a different act: it invites a knowledge panel for yallo.co to render the group's name, which is the shell R1 and R2 exist to remove. One is corroboration; the other is structure.

**`Person` schema stays deferred.** Round 11 §2.5 deferred it and the reason has changed rather than disappeared. The roster data is now final, so the original objection is gone — but the four personal URLs will not be verified (§1.4), and an unresolvable `sameAs` on a `Person` is a machine-readable identity claim rather than a broken anchor. It stays cheap to add in any later round. Not scoped.

### 4.8 The client logo consent flag

Consent is ruled obtained (§1.4). **Locate the mechanism before changing anything.** The content authoring guide specifies `consentOnFile` per entry in `content/clients.yaml`, with any `false` entry rendering nowhere, and it is not verified from Chat that the flag was ever implemented in that shape.

Three outcomes, all acceptable relays:

- The flag exists and gates real named clients off the rail. Flip them, and **report which names became visible** — that list is the thing Sumeet needs to see.
- The flag exists and is already clear everywhere. Say so, change nothing.
- The flag was never implemented and the rail renders from a plain list. Say so, change nothing, and do not build the flag now.

**Do not add, rename or invent a client.** The thirteen enterprise accounts and five integrators already on the rail are the set, and the two walls never merge into one strip.

---

## 5. The performance work — items 3 and 4

### 5.1 What is measured, and what is therefore not worth re-investigating

Round 11 session A's baseline, Lighthouse **12.8.2**, production build, `next start`, two passes, worst-pass rule. `check:phase8` **exit 1**.

| Route | Perf worst | LCP worst | CLS | TBT |
|---|---|---|---|---|
| `/` | 82 | 4.82s | 0.000 | 15ms |
| `/contract` | 89 | 3.77s | 0.000 | 15ms |
| `/platforms/sap` | 85 | 4.27s | 0.000 | 19ms |
| `/capabilities/data-analytics` | 86 | 4.22s | 0.000 | 14ms |
| `/industries/retail` | 86 | 4.21s | 0.000 | 14ms |
| `/industries/retail/customer-experience` | 87 | 4.09s | 0.000 | 12ms |
| `/case-studies/…al-othaim-markets` | 90 | 3.62s | 0.000 | 9ms |
| `/brief` | 96 | 2.72s | 0.000 | 11ms |

Perf misses on 8 of 8 against a 90 floor. LCP misses on 8 of 8 against a 2.5s ceiling, by 0.22s at best and 2.32s at worst. CLS and TBT pass everywhere.

**The binding cause is measured, twice, and is not a page defect.** The LCP element is a **text node on all eight routes** — `heroLede`, `heroSub`, `heroTitle`, `standfirst` — and the `font-display` audit passes on all eight, `swap` being set on all three families. So LCP waits on font and CSS delivery and **no image work can move it**.

**Do not re-investigate, all ruled out by measurement:** CLS, server response time (10ms), image formats, `font-display`, third-party requests (zero), and the `panda-retail.png` optimiser stall, which was a starved key and not an asset defect (§6).

### 5.2 The levers, ranked by measured size

A resolved the 186.7 KiB preload figure into 5 files and 11 declared faces. Newsreader and Inter ship as variable fonts, one file covering 400 through 600.

| Item | Size | Status |
|---|---|---|
| Newsreader normal, variable 400–600 | 56.8 KiB | Preloaded |
| **Newsreader italic, variable 400–600** | **63.0 KiB** | **Preloaded on every route. A third of the entire budget.** |
| Inter, variable 400–600 | 47.3 KiB | Preloaded |
| IBM Plex Mono, static 400 and 500 | 19.6 KiB | **Already removed from the preload path** by round 11's uncommitted change |
| Unused JavaScript | 113–126 KiB per route | Untouched |
| Render-blocking CSS | 94–254ms attributed | Untouched, and inflated by 52 `@font-face` rules of which 5 are ever fetched |
| Unused CSS | 0–13 KiB per route | Untouched |

Latin subsetting is confirmed in effect on the preload path: all 5 preloaded files carry the latin `unicode-range`. The cyrillic, greek and vietnamese subsets are declared and shipped but never fetched, gated by `unicode-range`. They cost nothing at runtime and they do inflate the render-blocking CSS.

**Apply every lever, then measure once.** Not step by step. Reversed from round 11 §3.2 and the reason is in §1.3: variance of up to 7 points at two passes with no code change makes per-step attribution of a 19.6 KiB change fictional.

### 5.3 The italic carve-out — the largest single lever, and its exact boundary

Newsreader italic is 63.0 KiB preloaded on every route, and the first question is whether any above-the-fold text on any of the eight routes actually renders italic.

**If no above-the-fold text is italic: `preload: false` on Newsreader italic is inside your authority and is the round's biggest single move.** That is not dropping a type family. The face stays declared, stays available, and loads on demand wherever italic is used — exactly the treatment IBM Plex Mono already has. Verify by computed style in a real browser on all eight routes, not by grepping for `<em>`.

**If above-the-fold italic does exist on any route: stop, name the route and the element, and report.** Removing the preload would then trade a measured LCP gain for a flash of fallback italic in the first screen, and that is a design decision.

### 5.4 The limit on the authority — three fences, not one

Sumeet's ruling stands: do what is right, no time pressure. Three things are outside it.

1. **Do not drop a type family.** Newsreader, Inter and IBM Plex Mono are ratified in canon and `DESIGN.md`. Removing one is a canon amendment and a design decision and must not arrive as a side effect of a performance run. If it is the only remaining route to the gate, say what it would buy in measured milliseconds and let Sumeet rule. §5.3's italic preload is a different thing and is permitted.
2. **Do not change the gate to reach the number.** Not the 90 floor, not the 2.5s ceiling, not the worst-pass rule, and **not the Lighthouse version.** A demonstrated that 13.4.1 returns up to 5 points more on the identical build — `/brief` reads as an LCP pass on 13.4.1 and a miss on 12.8.2. Re-pinning to a newer major would move the number without moving the site, and it would also remove the diagnostic audits the work depends on. `lighthouse` stays at exactly `12.8.2` this round.
3. **Do not report a number that was not measured.** A fabricated or estimated score would authorise a DNS cutover.

### 5.5 The measurement, and what counts as done

One run, at the end, on a build that will not change again afterwards. **Four passes, not two** — A's variance analysis is explicit that two cannot attribute anything under about 7 points, and `--passes N` already exists on the runner. Eight routes, all four categories, worst-pass rule, Lighthouse 12.8.2, production build, `next start`, port and dist dir per the prompt.

**The table is the deliverable, not a verdict.** Three outcomes are all acceptable relays:

- The gate passes. Report it with the exit code observed.
- The gate misses. Report the table, name the binding pair per route, and give one recommendation with its cost in measured milliseconds. This is the expected outcome and it is not a failure of the round.
- The levers run out before the gate is met. Same as above. Do not reach for a fourth idea; name what is left and what each would buy.

Wire `check:phase8` into CI as a **scheduled job plus `workflow_dispatch`, never a PR gate.** Eight routes times four passes is slow and the scores drift with content and host load, so gating merges on it would fail pull requests for reasons unrelated to the diff. Same reasoning C applied to `check:crawlers`.

---

## 6. Forbidden — carried forward, with two additions

`context-round9-scope.md` §7 in full, and `context-round11-scope.md` §6 in full, including both roster constraints — no bio, tenure figure, past employer or capability claim for any of the four named colleagues, and no photograph, silhouette, avatar, monogram or PetalPlate-as-portrait on any team entry.

Two additions, both from round 11's findings:

- **Never conclude anything about a `load` timeout or an image-optimiser stall without restarting `next start` first.** A starved `next/image` key stays locked for the life of the server process, so the failure reproduces perfectly inside it and looks like a real asset defect. Round 11 spent four gate runs on this. Reproducibility is not evidence when the process is the thing that is broken.
- **Never report a gate, score or check as passing unless it was run and its real exit code observed.** Carried from round 11 §6 and restated because this round produces the number that authorises a cutover.

---

## 7. Open items for Sumeet after round 12

One cutover blocker left:

1. **Metric definitions** — one auditable definition each, an "as at" date, a named refresh owner.

Smaller, each one edit or one decision:

2. **The footer Academy marker** — removed in §4.4 under delegated authority. Veto before dispatch if it should stay.
3. **Whether to mount `ThemeToggle`.** Dormant by default, §4.5.
4. **A specialism and a direct contact route per named leader**, if the roster is ever to carry more than name, role and link. One line of data per person, not prose. Reasoning in §1.4.
5. **`Person` schema**, deferred in §4.7 and cheap in any later round.
6. **Monochrome team portraits**, and with them the canon amendment permitting photography scoped to `public/team/**`, plus a rule that the carve-out never widens. Chat's recommendation is to hold PetalPlate and ship the roster as type.
7. **The Phase 8 verdict**, if §5.5 reports a miss. This is a go-live decision, not a technical one: cutover either waits on a 2.5s LCP or proceeds on a documented miss with a stated plan.
8. **A go-live date**, which needs Raphy's availability for the cutover list.

**Closed and removed from this list:** the name spelling (§1.2); the four bios, the company LinkedIn URL, the logged-in link check and client logo consent (all §1.4).
