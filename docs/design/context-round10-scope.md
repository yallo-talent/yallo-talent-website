# Context — Round 10: close out and reach publish-ready

**v1.0 · 3 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`.
Carries forward, unchanged: `docs/design/context-round9-scope.md` §3 (the pillar questions), §6 (the review rubric), §7 (forbidden), §9 (Impeccable), §10 (the close-out loop). Those are ratified and are not restated here except where corrected below.

---

## 1. Adjudication of round 9

Every open position in `code-to-chat-v17.0.md` and the overnight summary, ruled. Nothing below is reopened.

| Item | Ruling |
|---|---|
| Worktree instead of the shared checkout | **Reversed against myself.** The dispatch said "no worktree" and the dispatch was wrong: a live parallel session held the checkout with uncommitted work. Finding the conflict, messaging the other session, and isolating rather than touching their files was correct. The retirement of the worktree afterwards, once the other branch was confirmed pushed, was also correct. |
| Port 3207 instead of 3107 | **Accepted.** Blocking on another process is the worse outcome. Round 10 assigns a port per session so this cannot recur. |
| Impeccable path corrected to `~/.claude/skills/impeccable/scripts/context.mjs` | **Accepted, and the dispatch's error.** The skill is a global install, not project-local. Corrected in every round 10 prompt. Not a deviation and not to be re-litigated. |
| `CONTEXT_STALE` on `.impeccable/design.json` reported and not acted on | **Accepted.** Exactly right. Still not to be acted on. |
| Impeccable run single-context, no dual sub-agent, no interactive questions | **Accepted with the reasoning corrected.** The right call, but the reason is not only that a batch round cannot stop to ask twenty times — it is that the interactive step exists to resolve *direction*, and direction here is already ratified by canon and `DESIGN.md`. There is nothing for it to ask. **This is now the standing protocol for every batch closure round.** Do not re-run the four pillars to apply the fuller ceremony. |
| `ServicePageData` / `ServicePageShell` extended with shared optional `audience`, `boundary`, `proof` | **Accepted, and it is the round's best decision.** Three of the seven required questions had no field to live in. Fixing the contract once, shared, rather than patching four pages, is the fix-classes-not-instances rule applied correctly. The other in-scope service-shaped pages consume the same fields in round 10. |
| Three of six Managed Delivery case studies on Proof | **Accepted.** Proportionate beats maximalist. |
| Mega-menu column headings derived from each group's own `label` | **Accepted.** No new copy authored, drift removed. |
| EOR left at corridor level, Saudi mechanism not invented | **Accepted, and this is the behaviour the round existed to produce.** It stays at corridor level. See §9.1 — the answer has not arrived and the page does not wait for it. |
| `/permanent` six-month rebate FAQ left in place | **Reversed. Remove it.** See §3.2. The reasoning was defensible — do not overwrite a decision you cannot see — but it ranks the wrong thing first. An uncorroborated commercial commitment on a page days from publication is a rubric-level-1 honesty defect, and the asymmetry of the bet decides it: removing a real clause costs one line to restore, publishing an unreal one costs a claim we cannot stand behind. |
| 35 pre-existing ESLint errors logged, not fixed | **Reversed in part.** The unescaped entities and the `module` assignment in `derive.ts` were correctly left. The `setState`-in-effect pattern in `NavBar.tsx` and `ThemeToggle.tsx` is different in kind: it is on global chrome, on every page, and it is the class that produces hydration and first-interaction defects. It is fixed this round. See §3.1. |
| Deep-scroll screenshots returning black beyond ~9,000px | **Accepted, and the workaround is now the method.** Verify by computed styles plus the repo's own Playwright gates. Do not spend session time re-diagnosing the preview tool. Scroll by section rather than to absolute depth. |
| Blueprint v2 not merged, awaiting instruction | **Merge it.** Green on tsc, all 17 gates and the full Playwright suite. See §2. |
| `aiTalentScarcity` left importable and unwired | **Accepted, stays unwired.** Its consumer is the AI Talent lane, not round 10. |
| `docs/gtm/platform-employer-signals-2026-08-02.md` unowned | **Parked, and it has an owner: the LTI research lane**, which Sumeet is running separately. No round 10 session touches it. |

---

## 2. Ground, merges and the pre-adjudicated conflicts

**State at round 10 open.** `main` at `0f2a66b`. Two unmerged branches, both green, both to land before any new work:

| Branch | HEAD | Contents |
|---|---|---|
| `feat/round9-pages` | `4f49c23` | Global chrome, the four engagement pillars, the round 9 findings file |
| `feat/blueprint-v2-scarcity` | `8dca4ea` | Scarcity bands on three Blueprint archetypes, Oracle EBS, two capability desks; the isolated `ai-talent/scarcity.ts`; a scoped terminology rule |

**The one real conflict, and it is pre-resolved: `scripts/check-terminology.mjs`.** Both branches edited it and both edits are additive and independent. `feat/blueprint-v2-scarcity` adds a scoped rule banning "LinkedIn" and "Talent Insights" and a percentage beside a named platform or role token, within the files that exercise touched. `feat/round9-pages` adds one allowlist entry for a real case-study URL slug containing "landscape". **Keep both. The rule set is a union and the allowlist is a union. Drop neither.** Then run `check:terms` across the tree and confirm 0 before pushing — a union that passes each branch separately can still fail combined, and that is the case this conflict exists to catch.

Merge order: `feat/blueprint-v2-scarcity` first, then `feat/round9-pages`. Blueprint is the smaller, more isolated diff, so a conflict surfacing on the second merge is unambiguously attributable. Ancestry checked before each push. Never forced. Delete both branches, local and origin, only after confirming merged.

---

## 3. Session A — integrator, shared chrome, and the publish gate

Territory: `scripts/**`, `src/components/**`, `src/styles/**`, `src/app/globals.css`, the merge, the worktrees, and the Phase 8 gate run. **Session A does not edit page content and does not edit `src/lib/seo.ts`, `robots.ts`, `sitemap.ts` or `.github/workflows/**`** — those are C's.

### 3.1 The chrome lint defect

Fix the `setState`-in-effect pattern in `NavBar.tsx` and `ThemeToggle.tsx`. Measure before diagnosing: render the header, exercise the theme toggle and the mega menu at 360 and 1280 in both themes, and confirm what the effect is actually synchronising before rewriting it. A derived value computed during render, or an event handler, replaces most instances of this pattern; an effect that genuinely needs to run should not be setting state that render could have derived. Re-run `check:a11y`, `check:motion` and `check:reflow` afterwards, because both files are on every page.

Leave the unescaped-entity errors and the `derive.ts` `module` assignment. They are logged and out of scope.

### 3.2 Remove the `/permanent` rebate clause

Per §1. Strike the "rebate … within the first six months" qualifier from the `/permanent` FAQ. Do not replace it with a softer version, a hedge, or a "terms apply" line — that is the same claim with deniability attached. The answer stands without it, or the question comes out. Log it in the relay as removed pending Sumeet's confirmation, with the exact wording that was removed so restoring it is one edit.

### 3.3 The Phase 8 gate — run it, and report the numbers

**This is the highest-value thing in round 10 and there is no evidence it has ever been run.** The project set its own pre-launch gate in `AGENTS.md`: Lighthouse Mobile 90+, LCP under 2.5s, CLS under 0.1, INP under 200ms, WCAG 2.2 AA.

Run it against a production build, on mobile emulation, across a representative route set: `/`, one engagement pillar, one platform desk, one capability desk, one industry L1, one industry L2, `/case-studies/[slug]`, and `/brief`. Report **the actual numbers per route**, not a pass or fail. Where a metric misses, name the binding cause from the trace rather than guessing at it, and fix only what is cheap and safe on this branch. An expensive fix is a finding for the next round, not a same-day rewrite.

If the numbers cannot be produced at all, say so plainly and name what blocked it. A fabricated or estimated Lighthouse score is worse than no score, because it would be used to authorise a cutover.

### 3.4 Worktrees and the handshake

A creates the worktrees for B and C off merged `main`, then cuts its own branch. Ports: A on 3107, B on 3207, C on 3307. Each session sets its own `NEXT_DIST_DIR`.

---

## 4. Session B — the nine remaining page-groups

Territory: `src/app/**` and `src/data/**` for the routes below, and `content/**`. **B consumes `src/components/**` by reference and never forks a shared component** — A may be replacing the very component you would fork, and a fork dies at the merge. Log a needed component change rather than make it.

Work the close-out loop in `context-round9-scope.md` §10 exactly as round 9 did — render and score, close by severity, Impeccable critique then audit, close, polish once, re-render, gate, commit one page per commit, log. Order:

```
1. /                      (the homepage; highest traffic, closes first)
2. /why-yallo
3. /case-studies and /case-studies/[slug]
4. /brief                 (Operate mode; clarify is in play here)
5. /leadership            (see below)
6. /about
7. /intelligence          (landing only; blueprint content untouched)
8. /jobs
9. /privacy, /terms, /cookies   (one unit, Read mode)
```

**The service-shaped pages inherit round 9's contract.** `audience`, `boundary` and `proof` now exist on `ServicePageData`. Where a page in this list is service-shaped and answers those questions in prose that the fields could carry, move it into the fields. Do not add the fields where they do not apply.

**`/leadership` — the ruling, so this does not stall.** Canon §8 forbids invented people and that is absolute. There are no ratified named consultants. **Ship the page in the pattern the defect register already identified as correct: roles with real credentials, no names, no photographs, no `Person` schema.** Do not build an empty gallery, do not build a "team coming soon" state, do not use silhouettes or placeholder avatars. A page that says what the screening bench actually is, in roles, is honest and publishable; a named gallery waits for real names. Log it as the open item it is.

**`/brief` is the site's only conversion surface and it converts or the site does not work.** Operate mode. Impeccable `clarify` applies to its labels, help text, validation messages and error states — and to nothing else on the site. Test the failure paths: empty submit, invalid email, a very long paste into the brief field, and submit with JavaScript disabled if the form supports it. A conversion surface whose error states have never been rendered is untested, not finished.

---

## 5. Session C — SEO, retrieval and CI

Territory: `src/lib/seo.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, the OG and `llms.txt` generation, `.github/workflows/**`, and `scripts/**` only for gates it adds. **C does not edit any page under `src/app/**` beyond the generated routes it owns, and does not edit `src/data/**` or `src/components/**`.** Everything C needs from a page it derives from the route tree or existing metadata.

Scope is `context-discoverability-scope-v1.0.md` §8, session A, ratified there. In priority order:

1. **Environment-driven crawler policy and `SITE.url`.** Defect B6, still open, and it is the one that converts a config change into a domain migration if it ships wrong. Full three-family allow on the production host only; `Disallow: /` for every family on any host that is not production; `noindex` on the same env switch. The placeholder must not be indexable and must not be citable.
2. **Wire the seven unwired gates into CI**: `check:taxonomy`, `check:yallo-case`, `check:estate`, `check:marks`, `check:crawlers`, `check:cs-excerpts`, `check:gate-coverage`. Everything rounds 7, 8 and 9 built is currently protecting nothing automatically. Confirm each one runs and can fail in CI, not merely that it is listed.
3. **Per-page OG images generated from PetalPlate at build time**, 1200×630 per route, and the `defaultOgImage` defect closed as a by-product. No photography, no third-party asset, no hotlink.
4. **A gate asserting no internal link resolves through a redirect.** `check:yallo-case` already proves every internal href resolves; a hop is a different defect and it costs AI retrieval eligibility, not only crawl budget. Watch it fail on a deliberately introduced hop before trusting it.
5. **`Organization` schema with `sameAs`**, derived from one source and never hand-typed, naming the four entities consistently. London, Dubai, Riyadh, Bengaluru. "Bengaluru", never "Bangalore". No `Person` schema.
6. **`llms.txt` generated from the route tree**, filtered to published routes, alongside `sitemap.ts`. Ship it as agent wayfinding and a Lighthouse audit item. **Never describe it, in a commit message or a comment, as an AI-visibility or citation lever** — it is not one, and the claim would propagate.

---

## 6. Impeccable — corrected setup, everything else unchanged

`context-round9-scope.md` §9 stands in full: refinement only, never redesign; no `new-work`, `document`, `extract`, `bolder`, `overdrive`, `delight`; the incumbent look is the target and never the anti-reference; photography banned, PetalPlate only; it declines rather than asks when a claim would be added.

**One correction.** The script is a global install:

```
node ~/.claude/skills/impeccable/scripts/context.mjs
```

Run once per session, cwd at that session's own working tree. `CONTEXT_STALE` is reported, never acted on. Only session B runs it — A and C are not doing design work.

---

## 7. The publish gate — what is true, and what is not ours

Round 10 closes the build. It does not publish the site, and no session should describe itself as having done so.

**Closable inside round 10:** every remaining page-group closed and gated · the Phase 8 numbers produced and reported · the crawler policy made environment-driven · the seven gates wired · OG images generated · the no-redirect-hop gate live · the chrome lint defect fixed · the unsupported rebate clause removed.

**Not ours, and each one is a hard cutover dependency** (game plan §12): DNS and the yallo.co cutover · deploying the redirect map · flipping `SITE.url` to production and lifting the placeholder `noindex` · decommissioning WordPress · the brief-form backend secrets and deliverability · the Volcanic `/jobs` punchout · CDN and WAF confirmation that retrieval crawlers are not blocked.

**Not ours and not technical, and both are genuine publish blockers:** written client logo consent per named client, and one auditable definition per published metric with an "as at" date and a refresh owner. A public site displaying enterprise logos without consent on file is a commercial exposure, not a defect.

---

## 8. Forbidden — carried forward, unchanged

`context-round9-scope.md` §7 in full. Restated only for the two that a publish-adjacent round is most likely to breach:

- **No invented person, client, quotation, metric, source, case study, date or capability claim.** Not on `/leadership`, not in schema, not in an OG image, not in a commit message.
- **No claim that a gate, score or check passed unless it was run and its real exit code observed.** A fabricated number here would authorise a cutover.

---

## 9. Open items for Sumeet — decided where possible, logged where not

### 9.1 Decided under delegated authority, logged for veto

| Item | Ruling |
|---|---|
| EOR Saudi Arabia mechanism | Page stays at corridor level. It does not block publish and it does not wait. One line restores the detail when the fact exists. |
| `/permanent` six-month rebate | Removed. §3.2. |
| `/permanent` and `/eor` have zero tagged case studies | Both ship without a Proof section rather than borrow a study tagged to another pillar. An absent section is honest; a mis-tagged one is not. |
| `/leadership` | Ships as roles with credentials, no names. §4. |
| Blueprint v2 | Merged. §2. |
| Round 9's audience and boundary phrasing | Stands. Grounded in the ratified persona table, and it is Code's wording rather than invented fact. Read it when convenient; it is not a gate. |

### 9.2 Still yours, and two of them gate the cutover

1. **Client logo consent** — written consent per named client. Cutover blocker.
2. **Metric definitions** — one auditable definition each, an "as at" date, a refresh owner. Cutover blocker.
3. **A go-live date**, and it needs Raphy's availability for the §7 list, not just yours.
4. FAQ question sources for the four pillar pages — the highest-value retrieval surface on the site, still empty.
5. Real named consultants, whenever they exist.
6. The Saudi Arabia EOR mechanism.
7. Whether the `/permanent` rebate clause is real.
---

## 11. Addendum — amendments from the round 9 findings log

Added 3 August 2026, after reading `docs/design/context-round9-findings.md`. The findings log carried three details the v17.0 relay did not, and each one changes a round 10 instruction. Appended rather than rewritten so the diff is visible.

### 11.1 Ownership correction — `nav-config.ts` is chrome, not data

The round 9 mega-menu work edited `nav-config.ts` to give the Evidence and Intelligence columns distinct headings. Its path puts it near the data layer, but it is global navigation configuration and it is on every page.

**Session A owns `nav-config.ts`. Session B does not touch it.** If B needs a nav entry added, changed or removed for one of its nine pages, it logs the request rather than making it. Two sessions editing the site's navigation in parallel is the highest-cost merge available in this repo.

### 11.2 Ownership carve-out — session A edits exactly one file under `src/data/**`

Round 10's §3 gives A the components, styles, scripts and the merge, and gives `src/data/**` to B. §3.2 then instructs A to strike the `/permanent` rebate clause, and that clause lives in an FAQ in `src/data/services/`. The two instructions contradicted each other.

**Resolution: A may edit the single `src/data/services/` file that carries the `/permanent` FAQ, and nothing else under `src/data/**`.** `/permanent` is not in B's nine-page list, so no conflict arises. A records the file it touched in its relay so the boundary is auditable.

The alternative — moving the strike to B — was rejected because it would put a closed pillar page back into an open session's territory for the sake of one deletion.

### 11.3 `/why-yallo` — the guarantee wording is frozen

This is the amendment that matters most, and it is a cross-session coupling that neither relay flagged.

Round 9 struck an invented eligibility qualifier from `/contract` ("if a contractor isn't performing within the first four weeks") on the explicit grounds that **`/why-yallo`'s comparison table holds the only ratified version of that guarantee**, and that version carries no time-boxed condition. `/contract` is now closed and defers to it. `/permanent`'s own rebate clause is being removed for the same reason.

So `/why-yallo` has quietly become the canonical source for the site's risk-reversal claims, and B is about to open it.

**Ruling: the claims in that comparison table are frozen for round 10.** B may not reword, soften, strengthen, re-sequence or restructure any claim in it. B *should* fix its accessibility and layout without restraint — the legacy version of this table used image ticks, which the game plan named as an accessibility failure not to repeat, and confirming the rebuilt version uses real markup is squarely in scope.

The reason to state rather than assume: a reword here produces no visible defect on this page and silently drifts two pages the session cannot see.

### 11.4 `/brief` — the failure paths, named

Moved here from the prompt for space. Render and score each of these, in both themes:

- Submit with every field empty.
- Submit with a malformed email.
- Paste several thousand characters into the brief field and submit.
- Submit with JavaScript disabled, if the form supports a no-JS path at all. If it does not, that is a finding, not a pass.
- The success state after a valid submit, and what the person is told happens next.

A conversion surface whose error states have never been rendered is untested rather than finished, and this is the only conversion surface on the site.

### 11.5 Two things confirmed good, so nobody re-opens them

- **The footer already derives its Industries column from `sectorNavEntries()`.** One index, no hand-typed taxonomy. Do not "improve" it.
- **`MotionConfig reducedMotion="user"` wraps the app** in `MotionProvider.tsx`, so Framer Motion respects the preference globally. Reduced-motion compliance is structural, not per-component. Do not add per-component guards.

### 11.6 One question for Sumeet, raised by the findings log, not blocking

The footer renders "Yallo AI Academy" as inert text with a **"Launching"** marker. That is accurate today and it is correctly not a dead link. But two things sit against it at cutover: the forbidden list bans "coming soon" states, and game plan H5 ruled that the sibling-brand block reduces to a single reason-to-believe line supporting the screening claim rather than a group-services presence.

**Question: at cutover, does the Academy marker stay, drop to nothing until `academy.yallo.co` is live, or become a live link?** No session acts on this without an answer. Logged, not actioned.
