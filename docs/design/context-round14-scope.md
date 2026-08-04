# Context — Round 14: integration, the pilot blocker, and the honest gate

**v1.0 · 4 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`.
Standing rules live in `docs/design/context-round13-scope.md` §8. **Cited, never retyped.** Everything in §8 applies to this round unchanged: git traps, measurement traps, the adjacent-fix policy (§8.3), the discipline stanza, the relay contract (§8.5).

**Naming, so it does not drift.** This file is round 14's adjudication record and scope. `context-round14-research.md` remains the substance document for the talent research family, which is content-blocked on Sumeet and dispatches as its own later round. Two files carry "round14" in their names for that reason; this one governs what Code does next, that one does not dispatch yet.

---

## 1. Round 13 adjudication

Both relays complete. `v21-A.md` and `v21-B.md` read in full. Every open item in both is ruled below. **None of this reopens.**

### 1.1 Accepted, no work needed

| Item | Position |
|---|---|
| A renamed its schema field `transcriptRef` to `transcriptId` to match B's already-tested five files | **Accepted.** Correct call, correct reasoning. Aligning the side with less verified work behind it is the right rule, and it is now the standing rule for a seam mismatch found at merge. |
| A removed B's temporary `AssistantMount.tsx` after confirming it unreferenced | **Accepted.** B described it as provisional; A verified rather than assumed. |
| A dropped B's `round13-b` launch entry as a duplicate of `session-b-r13` | **Accepted.** Naming convention holds. |
| A declined to convert `check-rendered-type.mjs` and `check-interaction.mjs` to exhaustive route sets | **Accepted, reasoning confirmed as correct.** `check-rendered-type` is scoped by its own stated principle and `check-gate-coverage` already audits shell coverage for it; `check-interaction` is scoped by measured cost. Both are genuinely scoped, not stale lists. This is the right distinction between a hand-maintained list and a deliberately sampled one, and it is the distinction §2.2 below turns on. |
| B did not use `--lift` on the assistant panel | **Accepted.** The One Lift Rule reserves it for the hero. B's abstention is correct and needs no design review. |
| A added four `ALLOWED_LINES` exemptions to `check-terminology.mjs` for `system-prompt.ts` | **Accepted.** The model must see the literal banned word to refuse it. Four exact-substring matches is the right narrowness. |
| A included the Programme Staffing Blueprint in the assistant corpus after checking `src/data/blueprint/index.ts` carries no rate or quantity field | **Accepted, and the method is the point.** Checked rather than assumed, and logged. |
| B escalated its refusal self-test from rule deletion to active fault injection | **Accepted, and adopted as the standing method.** A self-test that deletes a rule proves nothing when the model refuses on its own judgement. Fault injection is what "watched failing" means from here on. |

### 1.2 Ruled, having been escalated to Sumeet by one or both relays

**Transcript persistence — ruled, logged for veto.** A separate table, not the `submissions` family. See §2.1. Both relays correctly identified this as the pilot blocker and correctly refused to guess it mid-round.

**Worktree and branch cleanup — authorised, conditionally.** A held off on destroying `../yallo-talent-website-B` and `feat/round13-assistant` pending explicit sign-off, which was right. Authorised now, on one condition stated in the dispatch: A re-confirms ancestry against `main` **after** the merge to `main` lands, not against `feat/round13-foundations` before it. The commits are recoverable from the reflog either way, but the ancestry check is what makes the deletion safe rather than merely reversible.

**`check-a11y.mjs`'s route-sample gap — ruled as this round's second work item.** See §2.2. A was right to flag rather than decide it: the cost figure it measured (~29 minutes exhaustive) changes the answer, and a session deciding that unilaterally mid-round would have either shipped a 29-minute PR gate or quietly left the docstring lying.

**The Anthropic API key exposure — Sumeet's, on his own timeline, and out of Code's hands.** Recorded here so it is not re-raised at Code every round. B's disclosure was exemplary: it named its own shell mistake, named the exposure, and recommended rotation rather than burying it in a risks list.

### 1.3 The dispatch's errors, owned

**Round 13's scope expected five `scripts/audit-*.tmp.mjs` scratch files that did not exist in the tree.** A reported them absent rather than deleting something or inventing a reason. That was the dispatch's error, not A's, and it is the same class as the three errors owned in round 13's own §1.3: a premise asserted flat that had not been measured.

**Round 13's §3.2 seam contract named a field shape without fixing the field name.** It said A "lands the capture contract in its first commit and states its shape in its relay" and left B to build against a documented fallback. That is what produced the `transcriptRef` / `transcriptId` mismatch, which would have silently dropped every assistant-sourced brief's transcript reference because zod strips unrecognised keys. **A pre-adjudicated seam must name the exact identifiers, not the shape.** Both sessions behaved correctly; the dispatch under-specified. Carried into §3.2 of this file as a rule.

---

## 2. Rulings new this round

### 2.1 Transcript persistence: a separate table, same database

**Ruling.** A new append-only table, `assistant_transcripts`, on the same Neon instance as `submissions`. Not the `submissions` family.

**Reasoning, because this one will be questioned later.** A transcript and a submission have different retention clocks and different content profiles. `submissions` is the durable capture backstop and its whole value is that nothing is ever removed from it; transcripts carry a stated 12-month retention, which means something must remove them on a schedule. Folding a purgeable row type into an append-only table forces the purge to distinguish row types inside the one store that is supposed to be immutable, and the first mistake in that logic deletes a lead. Two tables, one of which is append-only and one of which is purgeable, keeps that impossible.

`transcriptId` remains the join. `source` continues to discriminate on `submissions` and gains no new responsibility.

**Retention is part of this item, not a later one.** A retention mechanism that does not exist is the same defect as a transcript store that does not exist, one date later. The purge path ships with the table.

### 2.2 `check-a11y.mjs`: derive the routes, and stop the docstring lying

**Measured, from A's relay:** the script's own docstring claims "every surface" while it samples 6 routes, and exhaustive coverage measures at roughly 29 minutes across 4 route-theme-width combinations. It is not registered in `check-gate-coverage.mjs`'s tracked set at all.

**This ranks high because a gate that lies is worse than no gate.** This repository's own precedent is two green gates coexisting with a live Level A failure for six rounds because neither ran the rule that caught it. A docstring claiming exhaustive coverage is exactly how that happens again: the next session reads the claim, believes the surface is covered, and scopes elsewhere.

**Ruling, stated as an objective function rather than an answer.** The route list derives from `scripts/lib/published-paths.mjs`, the same source `check-yallo-case` and `check-reflow` now use. Nothing typed. Beyond that, the constraint set rather than the solution:

- The default PR-gate run covers every distinct template or shell present in the derived set, selected by derivation, not by a hand list.
- Exhaustive coverage exists behind a flag and runs on the same daily cron as `check:phase8`, not on the PR trigger.
- The docstring states what the default run actually does.
- The gate is registered in `check-gate-coverage.mjs`.
- Default run measured under three minutes.

**If those cannot all hold together, report the binding pair and a named recommendation. Do not silently reduce coverage to hit the runtime, and do not ship a 29-minute PR gate.**

### 2.3 The launcher's keyboard distance is a real barrier

**Measured, from B's relay:** the launcher sits 77 to 84 Tab stops from a fresh page load on the homepage. B logged it as advisory. It is not advisory. A persistent global affordance that takes eighty keyboard presses to reach is unreachable in practice for the users the affordance exists to serve.

**Ruling.** Fix by DOM order. The launcher is fixed-position, so its position in the document is free of its position on screen: mounting it early in `layout.tsx` costs nothing visually and collapses the tab distance. Re-measure after, and verify no visual change at 360px and 1280px in both themes.

**Not by a skip link.** A skip link is the right pattern for jumping past navigation to main content, not for reaching a floating control. It would add a visible interactive element to every page to compensate for a DOM ordering choice.

### 2.4 The launcher and StickyBriefCTA: verify, and if they collide the launcher yields

B placed them in opposite corners and lifted the launcher above the CTA's mobile full-width state by measurement, but never saw both visible in one viewport, because A's mount seam had not landed. That check is now possible.

**Ruling on the failure branch, so it is not improvised.** If they collide, overlap, or read as two competing asks in the same viewport, **the launcher yields**: hide it while StickyBriefCTA is visible at mobile widths. Do not move, resize or restyle StickyBriefCTA. It is a converting surface that has been through design review; the launcher is a newer surface that is flag-off through cutover.

### 2.5 `Person` schema: real named leaders only, and nothing about them that they did not say

The discoverability brief bans `Person` schema until real named consultants exist. Real named leaders now exist on the leadership surface, so the ban is satisfied for them and only for them.

**Authorised fields:** `name`, `jobTitle`, `url`, `worksFor`. Derived from the leadership data module, never hand-typed, so it cannot drift from the page.

**The carve-out, stated because a prohibition without one gets over-applied.** This is not authority to write anything about a real person that they have not supplied. No `email`, no `telephone`, no `knowsAbout`, no specialism, no biography, no seniority claim, no years-of-experience figure. Those are Sumeet's to supply and they come back as slots in the relay. A fabricated career claim about a named colleague who will read the page is the worst invention available on this site, because it is a claim about their history that they never made.

### 2.6 `submissions` is write-only, and that is not shippable

Round 13 closed the silent-loss path: leads now persist before delivery is attempted, and `ok: true` is only reachable once the row exists. Correct, and the right ruling. But the table has no read path, which means the backstop cannot be consulted at the exact moment it matters, which is when Resend has failed and somebody needs to know which leads did not arrive.

**Ruling.** An ops read script, not a UI. Least-overclaiming: no admin route, no authentication surface, no new page. A script an operator runs that lists recent rows with their delivery status. A UI is a decision about who has access to lead data, and that is not a decision to take as a side effect of a gate round.

---

## 3. Territory and pre-adjudicated seams

Split by file class, not by subject.

| Session | Territory |
|---|---|
| **A**, integrator | `scripts/**`, `src/lib/db/**`, `src/app/api/**`, database migrations, `package.json`, `pnpm-lock.yaml`, `.env.example`, `.claude/launch.json` |
| **B** | `src/app/layout.tsx`, `src/components/**`, `src/lib/seo.ts`, `src/data/leadership*` |

### 3.1 The seams, resolved in advance

1. **`layout.tsx` is B's exclusively this round.** A's only contact with it is the git merge in housekeeping, which completes before B's branch is cut. A never hand-edits it. This makes the round's most obvious conflict structurally impossible rather than merely discouraged.
2. **`package.json` and the lockfile are A's.** Unchanged from round 13: A resolves lockfile conflicts by union then `pnpm install`, never by hand. If B needs a script or a dependency, it logs the need and does not add it.
3. **`check-a11y.mjs` is A's, and B consumes it read-only.** B runs whatever version exists on the base its branch was cut from. A re-runs the rewritten gate after merging B, which is when it matters.

### 3.2 The seam rule this round adds

**A pre-adjudicated seam names the exact identifiers, not the shape.** Round 13's seam said "the capture contract" and left the field name to a documented fallback, which produced the `transcriptRef` / `transcriptId` mismatch. Where two sessions must agree on a name, the name is written here, in this file, before either starts. This round has no cross-session identifier, because §3.1 item 1 removes the only place one would have been needed.

---

## 4. Forbidden this round

- **No Lighthouse, no `check:phase8`, no performance measurement in either session.** Two sessions build on one machine and A measured that contention invalidating two Phase 8 runs. A number taken under contention is worse than no number, because it could authorise a cutover. Phase 8 is round 15, solo.
- **No turning the assistant flag on.** Ratified, do not relitigate. It stays off through cutover regardless of transcript persistence closing.
- **No biography, specialism, contact detail or credential for any real named person.** §2.5.
- **No CRM integration.** Round 13's ruling stands: one Hub connector when Hub lands, nothing before.
- **No candidate-assistant variant.** Deferred, and still deferred.
- **No admin UI for lead data.** §2.6.
- **No redesign of StickyBriefCTA.** §2.4.

---

## 5. Deferred, with the reason

| Item | Where it goes |
|---|---|
| Render-blocking CSS and font delivery, the two remaining Phase 8 causes | **Round 15, single session.** Neither is cheap and neither can be measured beside a parallel build. `cssChunking: 'strict'` is already confirmed a no-op on Turbopack. |
| The talent research family, five pieces | Its own round, once Sumeet rules on the conclusions. `context-round14-research.md` governs it. |
| Monochrome portraits for named leaders | Held. PetalPlate remains the recommendation. |
| Metric definitions, Informatica's classification, the R-AI3 amendment, the go-live date | Sumeet's. Not Code's, in any round. |
| `RESEND_FROM` and `RESEND_TO` with SPF and DKIM alignment | Raphy's. |
| Anthropic API key rotation | Sumeet's, on his own timeline. |

---

## 6. Open with Sumeet

1. **The Phase 8 go-live decision.** Not technical and not Code's. Cutover either waits on a 2.5s LCP or proceeds on a documented miss with a stated plan. Round 15 will improve the number; whether it clears 2.5s on eight routes is not something anyone can promise before measuring.
2. **Metric definitions.** One auditable definition each, an "as at" date, a named refresh owner. Still the last cutover blocker.
3. **The five research conclusions**, drafted 4 August and awaiting his ruling.
4. **Specialism and contact route per named leader**, which §2.5 returns as slots rather than inventing.
5. Carried: Informatica as client or platform; the R-AI3 amendment logged for veto; the go-live date, which needs Raphy's availability.
