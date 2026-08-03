# Relay — Code to Chat, Blueprint v2 scarcity (final)

**Single session, one branch: `feat/blueprint-v2-scarcity` · 2 August 2026 · cut from `main` after round 8's close (8f53759…0f2a66b)**
Ran overnight, unattended, alongside a parallel "Round 9 page closure" session sharing the same working directory (no separate worktree between us — flagged and coordinated directly, see §6).

---

## 0. A conflict surfaced before implementation, and how it was resolved

`docs/design/context-programme-staffing-blueprint-v2.md` — the evidence file the dispatch named as source — carries its own §5 ruling: *"hold this entire file at evidence status until the three open items in §4 are resolved... Do not run that translation from this file directly."* Two of those three items (§4.2 Marketing Cloud's anomalous ratio, §4.3 Oracle Financials/EBS reading as abundant rather than scarce) map directly onto values the dispatch asked me to set, and §4.3 explicitly says that call is *"a judgement call for Sumeet, not a data conclusion Chat should make unilaterally."*

Surfaced this to Sumeet directly before writing any code. Confirmed: proceed with every value exactly as dispatched, treating the dispatch itself as the ratification. Recorded here so the evidence file's own "not yet ratified" language and this relay's shipped values don't read as contradictory to a future reader — they aren't; the ratification happened in chat, not in a re-edit of the evidence file.

---

## 1. Every file touched or created

| File | What changed |
|---|---|
| `src/data/blueprint/index.ts` | New `BlueprintScarcityRole` interface; new optional `scarcity?: BlueprintScarcityRole[]` on `BlueprintArchetype`; populated on all three archetypes. Trailing "what v2 needs" comment updated to mark scarcity DONE. |
| `src/data/platforms/authored.ts` | New optional `scarcityBand`/`scarcityNote` on `AuthoredModule`. Populated on exactly one module: Oracle's `oracle-e-business-suite`. |
| `src/data/l1/types.ts` | New `L1PlatformScarcity` interface; new optional `platformScarcity?: L1PlatformScarcity[]` on `L1PageData` (the type both L1 industries and capability desks already share). |
| `src/data/capabilities/cloud-infrastructure.ts` | `platformScarcity` populated: GCP, Azure, AWS, DevOps (skill), Azure DevOps Services. |
| `src/data/capabilities/data-analytics.ts` | `platformScarcity` populated: GCP, Snowflake, Databricks, Azure, AWS. |
| `src/data/ai-talent/scarcity.ts` | **New file.** Isolated, unimported, unwired — see §4. |
| `scripts/check-terminology.mjs` | New scoped rule (§5). |

No other file touched. `docs/design/context-programme-staffing-blueprint-v2.md` was committed in the branch's first commit, per this repo's own rule that an uncommitted context doc is invisible to a parallel worktree.

---

## 2. Where each value landed, and why that structure

**The archetype data model is `src/data/blueprint/index.ts`** (`BlueprintArchetype`), confirmed by its three slugs matching the dispatch's three archetypes exactly (`sap-s4hana`, `oracle-fusion`, `salesforce-multi-cloud`). The dispatch's named roles (Security, Integration, Data migration; Payroll, Fusion (OFA+HCM), Financials; DX, Commerce Cloud, Data migration, Service Cloud, Marketing Cloud) don't match any existing field on this interface — not `streams[].roles`, not `underScoped[].item`, not `screenHardest.roles` — because those model programme team-shape and sequencing, a different axis entirely from platform-market scarcity. Added a new field rather than overloading an existing one. The file's own trailing comment had already earmarked this exact gap: *"2. Scarcity per role in-region... LICENCE CHECK OUTSTANDING"* — now marked done and reworded to drop the word this file's own new terms rule bans (§5).

**Part 2's "Oracle platform desk" is a different file entirely** — `src/data/platforms/authored.ts`, confirmed by the dispatch's own "(not the Blueprint)" parenthetical. Oracle's modules there are per-product (`Oracle Fusion ERP`, `Oracle Fusion HCM`, `Oracle E-Business Suite`, etc.), and only EBS was in scope for Part 2. Added the field to the shared `AuthoredModule` interface — which is why the dispatch's "Workday and Blue Yonder: do not add anything for these" instruction makes sense: both platforms have modules on this exact same shared type, so the field is available to them the moment it exists on the interface. Their module objects carry no such field — not `scarcityBand: null`, absent entirely, matching the dispatch's "leave absent, not null."

**Part 3's capability desks reuse `L1PageData`** — confirmed by checking first, as instructed: `cloudInfrastructureData` and `dataAnalyticsData` are both typed `L1PageData`, and that type already carries a scarce-role pattern (`scarceRoles?: L1ScarceRole[]`), shared verbatim with the L1 industry pages per canon. Read it before adding anything: `L1ScarceRole` names job ROLES ("Kubernetes Platform Engineer") with a required `engagement` field ("contract"/"perm"/"contract-perm") and only two scarcity tiers (high/med). None of that fits — GCP, Azure, Snowflake and Databricks aren't job roles and have no engagement type, and the dispatch needs three tiers plus null. Added a new, separate `L1PlatformScarcity` type rather than overloading `L1ScarceRole`, with a comment explaining the two are deliberately different axes.

---

## 3. Standing rule: ordinal display only

No numeric or percentage value was written into any of these fields. `scarcityNote` strings carry qualitative caveats only (e.g. Marketing Cloud's "directional only, magnitude unverified, do not cite a figure"; EBS's "pool size does not indicate scarcity here"). Nothing renders yet — none of these fields are read by any component or page — so there is no render-side null-handling to verify this round; the type system is the only consumer today.

---

## 4. Part 4 — AI Talent isolation, confirmed

**`src/data/ai-talent/scarcity.ts` is the only file touched under `src/data/ai-talent/`.**

Confirmed nothing under `src/app/**/ai-talent/` and no AI role-family shell, component or diagram file was edited:

```
$ git show --stat HEAD
 7 files changed, 216 insertions(+), 4 deletions(-)
 create mode 100644 src/data/ai-talent/scarcity.ts
```

Every other file in that diff is listed in §1 — none is under `src/app/ai-talent`, none is a shell/component/diagram file. The new file exports `aiTalentScarcity: Record<"bedrock" | "vertexAi" | "azureAiFoundry", AiPlatformScarcity>`, each entry `{ band: "scarcest", note: "these three are statistically close to each other and far scarcer than every other skill measured in this exercise." }`, using the field names `band`/`note` the dispatch specified for this file (deliberately not `scarcityBand`/`scarcityNote` — a distinct, isolated shape by request, not an inconsistency). It is not imported anywhere; `grep -rn "ai-talent/scarcity" src` returns only the file's own path.

---

## 5. Standing rule: the terms-check rule, failed before it passed

Added to `scripts/check-terminology.mjs`, scoped to exactly the files this exercise touches (`src/data/blueprint/`, `src/data/platforms/`, `src/data/capabilities/`, `src/data/ai-talent/`, `src/data/l1/types.ts`) rather than sitewide, because "LinkedIn" is a legitimate word elsewhere in the repo — the CV upload form has a real LinkedIn-URL field, and a blind sitewide ban would have broken it.

**Failed first, on a typed-in violation.** Temporarily set:
```
note: "TEMP TEST VIOLATION: LinkedIn Talent Insights says Bedrock is 0.78% of the AI/ML baseline."
```
Ran `check:terms`:
```
3 occurrence(s) need a human decision:
  src/data/ai-talent/scarcity.ts:29  [scarcity licence: linkedin — rank, do not republish]  ...
  src/data/ai-talent/scarcity.ts:29  [scarcity licence: talent insights — rank, do not republish]  ...
  src/data/ai-talent/scarcity.ts:29  [scarcity licence: percentage beside "Bedrock" — ordinal band only, no figure]  ...
Command failed with exit code 1.
```
All three motivating cases caught in one line. Reverted the test line, confirmed the real content passes:
```
No banned terminology in 239 files.
```

**One real, accidental collision found and fixed along the way, not exempted.** My own doc comment on `BlueprintScarcityRole` originally read *"never carries a percentage, a pool size or a LinkedIn attribution"* — explaining the rule using the word the rule now bans. Reworded to "a market-research attribution" rather than adding an `ALLOWED_LINES` exemption, since the file's own convention is to avoid the collision where a rewrite is cheap and an exemption is not needed.

---

## 6. Coordination with the parallel Round 9 session

Sumeet flagged partway through that a second session ("Round 9 page closure") is running overnight in the same repository, briefed to close the remaining pages, and that the two sessions should coordinate. Checked via `list_sessions`: that session's `cwd` is identical to this one's — **no separate git worktree between us**, which is the exact hazard this repo's own `AGENTS.md` names ("two sessions in one repository use two branches, two worktrees and two build directories").

Sent a direct message to that session (before writing this relay) covering: the shared-directory risk and a request not to switch branches or rebuild while either of us is mid-flight; every file this branch touched (§1); explicit confirmation nothing under `src/app/**/ai-talent/` was touched, so its AI Talent work is unblocked; and a flag that `docs/design/context-round9-scope.md` and `docs/gtm/platform-employer-signals-2026-08-02.md` are both sitting uncommitted in the shared tree — the first is presumably that session's own context file and needs committing early per the same rule that gated this branch's own first commit; the second is unrelated to either of our scopes (GTM/TAL.02 prospecting intelligence, not the website build) and has been left untouched. No reply had arrived by the time this relay was filed — this branch's own work does not depend on one, so it proceeded to close without waiting.

---

## 7. Verification, real exit codes

Committed at `5b2e957`, pushed to `origin/feat/blueprint-v2-scarcity`. Built and served on a fresh port (3108 — 3107 was still holding round 8's stale build, and a colleague was using it to browse; per this repo's own "check which server is on the port" lesson, a stale build proves nothing).

| Check | Exit |
|---|---|
| `pnpm typecheck` | 0 |
| `check:terms` (with the new rule) | 0 |
| `check:contrast` | 0 |
| `check:type` (`--strict`) | 0 |
| `check:a11y --base http://localhost:3108` | 0 |
| `PORT=3108 check:motion` | 0 |
| `check:type-render http://localhost:3108` | 0 |
| `check:interaction http://localhost:3108` | 0 (ran long, completed backgrounded) |
| `PORT=3108 check:reflow` | 0 |
| `PORT=3108 check:visual` | 0 |
| `check:taxonomy` | 0 |
| `check:yallo-case http://localhost:3108` | 0 |
| `check:estate http://localhost:3108` | 0 |
| `check:marks http://localhost:3108` | 0 |
| `check:crawlers` | 0 |
| `check:cs-excerpts` | 0 |
| `check:prose` | 0 |
| `check:gate-coverage http://localhost:3108` | 0 |
| `PORT=3108 pnpm exec playwright test` (12 tests) | 0 |
| `npx eslint src scripts` | 35 errors / 13 warnings, all pre-existing, none in any file this branch touched (verified by grep) |

`git status`: clean but for two files out of this branch's scope (`docs/design/context-round9-scope.md`, `docs/gtm/`), both the other session's concern, left untouched.

---

## 8. Not merged to `main`

This dispatch asked for a relay, not a merge. Branch pushed and stops there, pending direction — same discipline round 8 used before its own separate closing session merged it.
