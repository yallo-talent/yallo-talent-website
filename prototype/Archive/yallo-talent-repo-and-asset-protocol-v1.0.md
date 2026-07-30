# Yallo Talent — Repo, Branch & Asset Protocol

**Version 1.0 · 29 July 2026 · Addendum to `yallo-co-relaunch-GAME-PLAN-v1.2.md` §12**
Owner: Sumeet Goenka · Counterpart: Raphy Varghese · Status: recommendation, pending Sumeet's ratification

Written to be forwarded. Responds to the `chore/fmt-data-ai` branch delta of 29 Jul 2026 and Raphy's proposal to work on `main` while holding the branch back.

---

## 1. The disagreement, stated plainly

Raphy proposes: Sumeet works on `main`; Raphy holds `chore/fmt-data-ai` unmerged because `main` is tested and stable; Raphy works the asset folder and merges back "when you give back the code."

The asset-folder half of that reasoning is correct — `docs/images/` and `docs/icons/` cannot conflict with application code. The other half creates a problem.

**`chore/fmt-data-ai` is not an asset branch.** It carries:

- `src/data/capabilities/cloud-infrastructure.ts` — a new 428-line L1 seed
- `src/data/capabilities/index.ts` — a registry edit
- `src/data/capabilities/data-ai.ts` — a Biome reflow

All three are authored against the **current** `L1PageData` contract and the **current** design system. Phase 4 changes the design system and Phase 5 changes how templates consume the data layer. The risk is therefore not textual merge conflict — Raphy is right that there won't be one — it is **semantic drift**: a seed built to a schema that no longer exists. That rework accrues on Raphy's side and compounds weekly.

**Recommended sequence: merge first, then hand over, then build.**

| Step | Owner | Note |
|---|---|---|
| 1 | Raphy | Merge `chore/fmt-data-ai` into `main` today. Both commits are additive and low-risk; CI should pass unchanged. |
| 2 | Raphy | Merge or close any other open branches. Declare `main` the single truth. |
| 3 | Raphy | Freeze team authoring of `src/data/**` and `src/components/**` until Phase 5 completes. |
| 4 | Sumeet | Re-baseline the defect register against current `main`. |
| 5 | Sumeet | Take ownership; Phases 0b → 3 → 2 → 4 → 5 per the game plan. |

---

## 2. Branch discipline under Sumeet's ownership

**Do not work directly on `main`.** Not because review is needed — Sumeet is the sole owner and can self-merge — but because:

- CI is the only enforcement floor there is. Phase 4 touches design tokens consumed by every component; Phase 5 touches every template. Those are precisely the changes that should not reach `main` without a green build.
- A branch plus preview deploy gives a rollback point. Direct commits to `main` on a site being redesigned by an agent do not.
- The golden path requires `main` protected with PR required and no direct pushes. **[⚠] Confirm branch protection is actually enabled** — it could not be verified from repository contents.

**Lightweight pattern:** short-lived branches, one concern each, self-merge once CI is green. Suggested prefixes consistent with existing history: `fix/`, `feat/`, `design/`, `content/`, `chore/`.

**Close the CI floor first** (game plan Phase 3). Today `.github/workflows/ci.yml` runs Biome, `tsc --noEmit` and `next build` — no tests, on Node 20 and pnpm 9 while `engines` requires Node 22 and pnpm 10. Add a `test` script, run the Playwright suite, and align the versions, or CI is not testing what production runs.

---

## 3. Ownership must be unambiguous

Raphy's phrase "when you give back the code" implies a loan. The game plan (R13) records a transfer: Sumeet owns the Yallo Talent build; Raphy's pod moves to saasinator.ai and Yallo AI Academy (GTM.03) and retains only the six specified dependencies in §12.

**Action:** state which it is, in writing, before work starts. Two people operating on different assumptions about who owns `main` is the single most likely way this goes wrong.

`AGENTS.md` must be rewritten to match. It currently reads *"Nothing changes on the locked decisions … without Raphy's explicit sign-off"* and *"All commits are authored as **Raphy Varghese** — no co-author trailers, ever."* Both are incorrect under the new ownership, and the second should be dropped regardless: on an AI-assisted codebase it erases the provenance trail and conflicts with the Factory's commit-trailer discipline.

---

## 4. Assets — three problems to fix before production starts

### 4.1 The assets are not in version control

`docs/images/` and `docs/icons/` are untracked in both `main` and the branch. Nothing untracked can be merged — it has to be committed. Decide now:

**[REC]** Two-tier split:

| Tier | Location | Tracked | Contents |
|---|---|---|---|
| **Web-ready** | `public/images/…`, `public/icons/…`, `public/logos/…` | Yes | Optimised, correctly sized, correctly named to match code slugs. This is what Next.js serves. |
| **Source masters** | Outside the repo (Drive or a DAM), or `docs/` with Git LFS if they must be versioned | Optional | Layered originals, raw photography, oversized exports. |

The current `docs/` path is not servable by Next.js, so as things stand no asset in those folders can render. Note also that `sharp` is already a dependency, so build-time optimisation is available.

**[⚠]** `src/lib/seo.ts` sets `SITE.defaultOgImage = "/images/og-default.jpg"`. Confirm that file exists in `public/` — if not, every social share currently has a broken preview image. `docs/images/shared/social-og-images/` suggests it is planned but not yet wired.

### 4.2 Cancel the hero slider

`docs/images/home/hero-slider/` should not be produced. A homepage carousel harms Core Web Vitals (LCP and CLS both), reduces conversion in enterprise B2B, and is precisely what Slider Revolution was doing on the legacy WordPress site that this rebuild exists to escape. One hero image, or — preferably, per the Phase 4 brief — one purpose-built graphic carrying the structural signature.

### 4.3 De-prioritise candidate-facing assets

`docs/images/about/culture/` is candidate-facing content. The site is ratified client-first (R3): candidates are served by the job board. Culture photography is not wrong, but it is not on the critical path. `about/team-photos/` **is** on the critical path — it supports the highest-leverage page type.

---

## 5. Taxonomy reconciliation — the blocking item

Four taxonomies are now in play across code, legacy URLs and the asset folders. Assets produced into folders whose names do not match code slugs will not resolve. This must be settled in canon (game plan Phase 2) before asset production begins — and it is a short artefact, so it can unblock Raphy quickly.

### 5.1 Industries — aligned, but assets incomplete

Code and legacy URLs agree on six: `retail`, `finance`, `government`, `healthcare`, `manufacturing`, `telco`. Asset folders exist for only `retail` and `manufacturing`.

**Action:** create the four missing folders using the exact code slugs. Note `finance` (not `financial-services`) and `telco` (not `telecoms`).

### 5.2 Platforms — two slug defects

| Code slug | Asset folder | Status |
|---|---|---|
| `sap`, `oracle`, `microsoft`, `salesforce`, `workday` | match | ✅ |
| `blueyonder` | `blue-yonder` | ❌ **Mismatch — will not resolve** |
| `servicenow` | `servicenow` | ✅ but no route exists yet |
| — | *(none)* | ❌ `aws` is linked on the homepage with no asset folder |

**Action:** pick one convention and apply it everywhere. **[REC]** hyphenate — `blue-yonder` reads better and is the more conventional slug — and change the code, since no platform detail route exists yet, so there is no live URL to preserve. Add `aws`. Confirm whether ServiceNow and AWS are genuinely in scope as platform pages or should come off the homepage.

### 5.3 Capabilities — three different sets, and a missing page type

| Source | Set |
|---|---|
| **Code slugs** | data-ai, digital-devops, cloud-infrastructure, cybersecurity, integration-middleware, emerging-technologies |
| **Legacy URLs** | data, digital, cloud, cybersecurity, integration, innovation |
| **Asset folders** | ai-machine-learning, architecture, change-management, cloud, data-analytics, programme-management, testing-qa |

The asset folders are not a variant of the code set — they are a different concept. Four of the seven (`architecture`, `programme-management`, `change-management`, `testing-qa`) are **programme roles**, not technology disciplines.

**[REC] Do not discard them — they reveal a page family that is missing and probably better than the one that exists.** Those four are exactly the roles the Programme Staffing Blueprint identifies as chronically under-scoped and the reason programmes slip. A page family covering them ties directly to the contract-led wedge, to the architect-screening claim, and to the flagship intelligence asset. Nobody in the category publishes it.

Proposed resolution, for ratification in canon:

| Axis | Definition | Slugs |
|---|---|---|
| **Capabilities** | Technology disciplines | Keep the code's six. 301 the legacy slugs per game plan §7. |
| **Programme roles** (new) | The delivery roles that staff and de-risk a programme | architecture, programme-management, change-management, testing-qa — and consider adding the PMO and data-migration roles, which are the other classic under-scopes |

### 5.4 Segments — a category error in the folder structure

In code, `L1Segment` is an **in-page panel** — the "Segments we support" component inside an L1 page, with a sidebar, a swapping image and role pills. In the asset folders, `docs/images/segments/` is a **top-level directory with its own `hero/`**, containing `financial-services`, `logistics`, `manufacturing`, `retail`, `technology` — a set that overlaps industries but is not identical to it.

Two possibilities, and they need different assets: either these are meant as imagery for the in-page segment panels (in which case they belong nested under the relevant industry, keyed to segment IDs), or someone intends segments as a top-level page family (in which case it needs a canon decision, routes, and a reconciliation against industries).

**Action:** clarify intent before production. **[REC]** segments stay an in-page concept; move the assets under `industries/{sector}/segments/{segmentId}/` keyed to the IDs in the data layer. Do not create a fifth taxonomy.

---

## 6. What Raphy can safely do in parallel, today

Ordered so nothing depends on Phase 4 output:

1. **Merge the branch.** Step 1 of §1.
2. **Confirm branch protection** on `main` and hand over repo admin.
3. **Commit the asset folders** once §4.1 is decided, using code slugs.
4. **Produce slug-safe, design-neutral assets** — client logos, partner logos, platform logos, office locations, team photography, awards and accreditations. None of these depend on the visual system, so none of them will be wasted by Phase 4.
5. **Wire the default OG image** so social previews stop breaking.
6. **Not yet:** hero imagery, backgrounds, textures, illustrations or any per-block art. All of that is downstream of the Phase 4 structural signature and would be produced twice.

---

## 7. Amendments this makes to the game plan

| Game plan reference | Amendment |
|---|---|
| §6 Phase 3 (Handover + repo control) | Gains four steps: merge outstanding branches; freeze team authoring of `src/data/**` and `src/components/**`; commit and relocate assets per §4.1; confirm branch protection. |
| §6 Phase 2 (Canon) | Gains an explicit deliverable: **the single canonical taxonomy** — industries, platforms, capabilities, programme roles and segments, with slugs. Now on the critical path, because Raphy's asset production is blocked on it. |
| §8 Build order | Add **programme-role pages** as a candidate page family, pending the §5.3 canon decision. |
| §9 Phase 4 visual brief | Add: no hero carousel. |
| §11 Risk register | Add: *"Team-authored content seeds drift from a changing schema"* — Medium, mitigated by merging now and freezing authoring. Add: *"Asset folders keyed to names that do not match code slugs"* — Medium, mitigated by §5. |
| §12 Operating model | Raphy's dependency list gains: repo admin handover, asset production per §6 above. |
| Defect register | **B2 capability line and B3 both need re-verification** — `main` has advanced since the reviewed commit; `src/data/capabilities/` and the `capabilities/[cap]` route did not exist then. There may now be two `capabilityRegistry` symbols, which would make B3 worse rather than resolved. |

---

## 8. Open items

1. **Ownership** — transfer or loan. Sumeet to state in writing (§3).
2. **Asset tracking decision** — repo versus external, and Git LFS if versioned (§4.1).
3. **Platform slug convention** — hyphenated or not; and whether ServiceNow and AWS are in scope (§5.2).
4. **Capabilities versus programme roles** — canon decision (§5.3).
5. **Segments** — in-page concept or page family (§5.4).
6. **Branch protection** — confirm enabled on `main`.
7. **`/images/og-default.jpg`** — confirm it exists in `public/`.
