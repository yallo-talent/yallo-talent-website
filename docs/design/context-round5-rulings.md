# Context — Round 5 rulings and work split

**v1.0 · 2 August 2026 · Chat lens, adjudicating relay v9.0 (session A) and capabilities v3.0 (session B)**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. A reads §1, §2, §3, §5. B reads §1, §2, §4, §6.

---

## 1. Process

Round 4's §1 held. Every context document was committed, B was not blocked, and the near miss of round 3 did not repeat. Keep it.

**Merge.** A merges `fix/round4-system` first, then `feat/round4-content`, into `main`. Ancestry checked before each push, neither forced. Both new branches then cut from the merged `main`, one per worktree, as rounds 3 and 4 ran.

**Three conflicts are expected this round, not one.** Both sessions touched `src/data/l1/index.ts` (`industriesIndex`), the sector registry ordering, and `src/components/layout/nav-config.ts`.

Resolution rule, and it is not negotiable:

- **A's derivation wins over any hand-typed label or order.** Where B fixed a rail as an instance and A made the same rail derive, keep the derivation and delete the instance. Do not merge the two alongside each other.
- **B's index data is kept**, because the derivation consumes it: Education's `industriesIndex` entry, the Healthcare & Life Sciences plural, the canonical order.
- A already reordered `industriesIndex` under delegated authority and B independently applied the same order. If they agree, that is a clean resolution and not a finding.

**Context documents.** A commits every `docs/design/context-*.md` present in the tree as the first commit of the run, before any other work. This file included.

**The duplicate repository copy.** Two working copies exist on disk, `yallo-talent-website` and `yallo-talent-website-B`, and both carry a full `docs/relay/` set. Session A determines what they actually are — two worktrees of one repository, or two independent clones — and resolves it so there is one repository with worktrees beneath it and no second copy of history. Report what you found and what you did.

**No manual step is handed back to Sumeet on this.** If resolution would destroy uncommitted work, stop and report rather than act.

---

## 2. Decisions taken

| # | Decision | Reasoning |
|---|---|---|
| 1 | **An insight row renders only published items. With none published, the row does not exist.** | The Blueprint's no-empty-slot rule, applied sitewide. A placeholder naming a platform the desk no longer staffs is worse than an absent row. |
| 2 | **The customer-shaped principle governs segments. The mapping test is withdrawn.** | B is right that the two disagreed. The principle was the definition; the test was only a filter for one sweep. See §6. |
| 3 | **Islamic Banking is added as a finance segment.** | Customer-shaped, explicitly staffed, and the desk's stated regional weighting. Pills verbatim from function 02. |
| 4 | **Wash bands carry two text levels, not three.** | 1.11:1 is not a visible step. State the constraint rather than pretend a hierarchy a reader cannot see. Record in `DESIGN.md`. |
| 5 | **Derivation extends to platforms and capabilities.** | The class fix. See §5. |
| 6 | **`/ai-talent` publishes no sector rail, and this is ruled rather than pending.** | There is no per-sector AI evidence to put in one. B stops reporting it. |
| 7 | **The Data Science to AI Talent reverse link is one optional typed discipline field on the adjacent band.** | Least structure that satisfies round 4 §7's both-directions requirement. Not a new band. |
| 8 | **ESLint's 624 errors get a triage report, no fixes.** | Inherited, identical on the merge base, therefore not urgent. Counts by rule, then Chat decides. Do not spend the run on it. |
| 9 | **Informatica's `published` flag flips and then derives from the registry.** | A hand-declared publication state is the same class of defect as a hand-copied label. |

---

## 3. Session A — shell, lib, scripts, gates

Branch `fix/round5-system`, cut from the merged `main`. In order.

1. **Merge and commit context docs**, per §1, including the duplicate-repository resolution.
2. **Verify before you act on two things.** A's relay reports `_L1CrossSector` deleted; B's relay reports it live at `L1PageShell.tsx:488`. Both are true on their own branch. Post-merge, confirm which survived and act only if it is still there. Same for Education's mega-menu regression: B added the `industriesIndex` entry, so the regression may already be closed. **Measure before you diagnose.** This is the round's standing failure mode and these are two live instances of it.
3. **Platforms and capabilities derivation**, per §5. The substance of the run. Name and order derive from the single index on every rendering surface, including the mega menu's Platforms column, which B reports as hand-written and self-admitted. `check:taxonomy` gains a rule per taxonomy, each verified by typing a label back in and watching it fail.
4. **The insight row rule**, decision 1, component side. A row with no published item does not render. B removes the two bad placeholders in the data.
5. **The adjacent-discipline field and its render**, decision 7, closing B's §4.1.
6. **`DESIGN.md`**: record decision 4 as a constraint, with the measured 1.11:1 and the reason.
7. **`check:yallo-case`** takes its base URL from `BASE_URL` with `argv[2]` as fallback, and no longer waits on `networkidle` in a way that cannot settle under a dev server. Add one assertion: a card carrying no `tools` must not emit an href to a route that does not exist.
8. **ESLint triage**, decision 8. Counts by rule, worst ten files, one paragraph on what a fix would cost. No fixes.

---

## 4. Session B — `src/data` and copy

Branch `feat/round5-content`, cut from the merged `main`. In order.

1. **The 60 inert sector labels**, across the 13 files your own relay enumerates. Sweep them all. A's rule becomes a failure afterwards, so anything missed fails the next run rather than hiding.
2. **The segment sweep on every sector**, per §6. Not finance only. Report per sector what went and what remains. Where a sector drops below three segments, report it and stop; do not backfill.
3. **Islamic Banking**, decision 3. Pills verbatim from function 02, no minted titles.
4. **Delete the two finance insight teasers** that name removed platforms, the Actimize one and the PSD3 one. Both are unpublished placeholders with no article behind either, and the Actimize excerpt carries an unsourced market claim of the class removed on 2 August. Deleting a placeholder is sweeping. Rewriting it would be authoring, so do not rewrite.
5. **Informatica's `published` flag**, data side of decision 9. A does the derive-from-registry.
6. **Report the eight Education `screening` lines verbatim** in your relay. Chat reviews them against canon. A screening claim is the most load-bearing sentence on the page and it has not yet been reviewed by anyone but its author.

---

## 5. The derivation class, stated once

Round 4 predicted a seventh hand-copied sector list. There were three: the footer, the homepage rail and a dead `_L1CrossSector`. Eight copies in total across the round.

The conclusion is not that sectors were unusually bad. It is that **any taxonomy rendered from a hand-written list will drift, and every taxonomy on this site is still rendered that way except sectors.**

Therefore: **platforms and capabilities derive name and order from their single index, everywhere they are rendered**, exactly as sectors now do. Intro copy, roles, scope lines and icons stay authored. Only name and order derive.

`check:taxonomy` gains a rule per taxonomy. B's finding that the Platforms mega-menu column is hand-written, and admits it in its own comment, is the eighth instance of this class and is closed by this ruling rather than as an instance.

---

## 6. The segment principle, corrected

B is right that the stated principle and the stated test disagreed, and the principle is the definition.

**A segment is customer-shaped by definition.** A segment describing work rather than a customer is a category error, whether or not it maps to a published function. The mapping test was a filter for the finance sweep and is withdrawn as a general rule.

Applied to finance, that takes Risk & Compliance and Regulatory Compliance & Governance, both function-shaped, both halves of one published function. B differentiated their pills and reported the tension rather than choosing. Correct instinct; here is the choice.

The sweep runs on every sector. Where removing segments leaves a sector with fewer than three, report it. Three invented segments are worse than two true ones.

---

## 7. Still with Sumeet

1. The hue contact sheet at `docs/status/shots/hues-v8/`. Set C ships unless his eye reverses it.
2. Informatica's `consentOnFile` flag. A consent question, not a code question.
3. LinkedIn Talent Insights. The skill-probe pass is with him. Blueprint v2 quantities stay blocked and Code does not chase them.
4. The Blueprint archetypes carry no AI or retrieval content, so the tenth AI role family has nothing to associate to. An authoring job for Chat, not a defect.
