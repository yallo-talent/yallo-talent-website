# Context — Round 4 rulings and work split

**v1.0 · 2 August 2026 · Chat lens, adjudicating relay v8.0 (session A) and capabilities v2.0 (session B)**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. A reads §1, §2, §5. B reads §1, §3, §4, §6.

---

## 1. Process, and one thing that must be fixed permanently

**The context documents were not in the repository.** B found `context-finance-depth.md` and `context-round3-rulings.md` only as uncommitted files in A's working folder, copied them across and committed them. The P0 was nearly reported as blocked on that. Chat writes these files into the working tree and nobody commits them, so a parallel worktree cannot see them.

**Standing fix, session A:** commit every `docs/design/context-*.md` present in the tree in the first commit of the run, and add a line to `AGENTS.md` that a context document is not in play until it is committed.

**Branches.** Two now: `fix/design-system-and-gates` and `feat/content-depth`. A merges both, in that order, resolving the one real conflict itself. Then both new branches cut from the merged `main`, one per worktree, exactly as round 3 ran. That worked and the model holds.

---

## 2. The hue ruling, and A's pushback is accepted

A is right and I was wrong about the test, not just the values.

I set a pairwise floor by analogy with the approved six without asking whether a reader ever sees two identity hues at once. They do not: the palette assigns hues so no two members of a taxonomy share, precisely because a visitor is inside one family at a time. A pairwise delta-E between two colours nobody can compare measures a comparison that never happens. Option D would meet that floor by making two platforms share a hue, which breaks the rule the floor existed to protect. That is self-defeating, and it settles it.

**Ruling.**

1. **Ship set C, seven hues, minimum 3.51.** A 53% improvement on every failing pair with no hue leaving its brief.
2. **The governing criterion becomes separation from bare ground**, which is what R4 actually asks: does each page read as having its own colour. All seven clear it at 7.5 to 10.7 on light and 12.8 to 17.8 on dark. Record it in `DESIGN.md` and in the palette document as the test, with the reasoning above, so this is not relitigated.
3. **Pairwise separation stays measured and reported, never a gate.** `check-hue-separation` keeps printing the six weakest pairs so drift is visible. It does not fail.
4. Sumeet reviews `docs/status/shots/hues-v8/` when he wakes. One line reverses this if his eye disagrees; that is cheaper than holding the branch.

**On the lost instrument.** The round 3 numbers came from an uncommitted pass and do not reproduce. The finding did, which is the part that mattered. `scripts/check-hue-separation.mjs` reading values out of `globals.css` is the right permanent answer, and the same lesson as §1: an uncommitted measurement is not a measurement.

---

## 3. Body text over the ambient wash. This outranks the hues

`--text-3` over the wash measures 4.01:1 to 4.28:1 on light and 4.01:1 to 4.45:1 on dark. Several sit under 4.5:1. That is body text failing WCAG 2.2 AA on a project whose own gate is AA, and `check:contrast` cannot see it because it reads tokens rather than composites.

A logged it as an R11 decision rather than acting. Correct instinct, wrong conclusion: R11 raised the alpha to make the ambient visible, and it did not rule that body text may fail AA. There is no conflict to defer.

**Ruling, session A, and it ranks above the hue work.**

1. **Extend `check:contrast` to measure composites**, not tokens. A gate that cannot see the most likely failure is the defect behind the defect, and this is the second time this round a guard was blind rather than wrong.
2. **Fix by stepping `--text-3` inside `.amb-wash` contexts** to a value that clears 4.5:1 on both themes against every one of the seven hues at full alpha. Keep R11's alpha.
3. **Only if that cannot clear 4.5:1 without destroying the wash**, lower `--amb-alpha` and report the new value with its measurement. That is an R11 amendment, so record it as one.

---

## 4. Sumeet's three new instructions

### 4.1 Education & Universities

The seventh industry, still `DESK IN BUILD`. Build it to full depth. Content is authored in `docs/design/context-education-universities.md`.

### 4.2 Education added retrospectively wherever sectors appear

Sumeet's instruction is to add it everywhere sectors are listed. Applied with the site's own honesty rule, that means **everywhere it is genuinely true, and nowhere else**:

- **Every capability desk.** All seven disciplines genuinely serve universities.
- **Platform rails for Oracle, Microsoft, Salesforce, Workday and Informatica**, where the education products are real: PeopleSoft Campus Solutions, Microsoft 365 Education, Education Cloud, Workday Student, and the data estate behind them.
- **Not Blue Yonder.** Retail and supply-chain planning is not a university system, and adding it would be the invention rule broken to satisfy a completeness instruction.
- **SAP only if the repo carries evidence.** SLcM exists but is uncommon in the region. If there is no evidence, leave it out and say so.

Report every rail where you added it and every rail where you did not, with the reason.

### 4.3 The "where we deploy" rail is wrong in three ways at once

The screenshot shows a different order from the mega menu, "Public Sector" where the menu says "Government & Public Sector", and "Healthcare & Life Sciences" where the menu says "Healthcare & Life Science".

**This is the sixth hand-copied taxonomy this round.** Fix the class, not the rail: **label and order both derive from the single sector index**, everywhere sectors are rendered, with no per-page array and no hand-typed label. Then extend `check:taxonomy` to catch a seventh.

**Canonical order**, the mega menu's: Retail & Consumer · Manufacturing & Logistics · Banking & Financial Services · Government & Public Sector · Healthcare & Life Sciences · Telco & Media · Education & Universities.

**One naming decision taken under delegated authority:** the plural, **Healthcare & Life Sciences**, is the conventional term and the mega menu's singular is corrected to match. Not the other way round.

---

## 5. Session A. Design system, gates, integration

Branch `fix/round4-system`, cut from the merged `main`.

1. **Merge and commit the context docs.** Both branches to `main`, containment checked as in round 3. The one real conflict is `src/app/ai-talent/page.tsx`: **`data-identity` wrapper outermost, `L1SubNavScope` inside it around the bar and the sections it indexes.** Both are needed. Reconcile B's raw `l1.subNavScope` class onto A's `L1SubNavScope` component so there is one idiom. Then commit every `docs/design/context-*.md` per §1.
2. **The 72-hour over-claim, first work item after the merge.** `L2PageShell.tsx:103` hardcodes "contractors, deployed in 72 hours." Canon publishes 72 hours to **shortlist**, defined as three screened candidates from a complete brief. Deployed and shortlisted are not the same promise and the second is the one a buyer would hold us to. It is on every L2 on the site. Correct it to the canon claim, and add the phrase to the terminology lint so it cannot return.
3. **§3, body text over the wash.** Ranks above the hues.
4. **§2, ship set C** and change the governing criterion.
5. **The sector rail derivation** in §4.3: the component and lint side. Order and label derive from the index. B supplies the index data, so build the derivation to work the moment Education lands rather than waiting for it.
6. **`tsconfig.json`** is rewritten by `next dev` under a custom `NEXT_DIST_DIR`. Add the hazard to `AGENTS.md` beside the existing guidance and keep it out of commits.
7. **`.heroGrid`.** The Impeccable hook flags a decorative grid background that canon §5 makes load-bearing, at 3% alpha behind a radial mask, with the reasoning already commented in place. Sumeet's word: **keep the grid, add a scoped suppression at that single declaration citing canon §5.** No global rule change and no blanket ignore.

## 6. Session B. Content, data, IA

Branch `feat/round4-content`, cut from the merged `main`.

1. **Education & Universities to full depth**, per `context-education-universities.md`.
2. **The sector index**: add Education, apply the §4.3 canonical order and labels, correct Healthcare & Life Sciences to the plural everywhere including the mega menu. Then §4.2, the retrospective rails, with the report of where you did and did not add it.
3. **The Data Science desk** for Data & Analytics, §7 below. It becomes the eighth card and closes the last orphan.
4. **Backbase**, ratified. Sumeet's criterion was what most Middle East banks run, and Backbase meets it. Add it to finance digital channels. One line.
5. **The finance sweep**, both halves, per your own §5.3 and §5.4. The rule is not a platform list: **every tool and every segment must map to one of the nine published functions.** Anything that maps to a removed function goes. That takes nCino, Actimize, PSD2, Onfido and Jumio off the scarce rail unless they map, and removes the five function-shaped segments, which are a category error since a segment is customer-shaped by definition.
6. **Accepted without change, no work needed:** Engagement bands stay uniform, your reasoning is right and inventing per-function commercial distinctions would be the invention rule broken. LlamaIndex under Retrieval stands. `ai-data-engineer` rendering no blueprint band is correct.

---

## 7. The Data Science desk, authored

Eighth card on Data & Analytics, closing the last of the four orphaned areas.

**Sub-desks.** Applied machine learning · statistical modelling and experimentation · forecasting and demand science · optimisation and operations research · causal inference and measurement · model deployment and monitoring, cross-linked to MLOps rather than restated.

**Tools screened against.** Python with scikit-learn, PyTorch and statsmodels · R · Databricks · Azure Machine Learning · Amazon SageMaker · Google Vertex AI · Snowflake · MLflow · Dataiku · SAS.

**Roles.** Data Scientist · Senior Data Scientist · Applied Machine Learning Engineer · Statistician · Forecasting and Demand Planning Analyst · Optimisation Specialist · Experimentation and Causal Inference Analyst · Decision Scientist · Data Science Lead.

**The boundary that keeps it from colliding with AI Talent.** Data Science answers questions from a company's own data. AI Talent builds systems on foundation models. The join is the AI Data Engineer, who serves both. State the distinction once, cross-link both ways, and do not restate the other's content.

---

## 8. Still with Sumeet

1. The hue contact sheet at `docs/status/shots/hues-v8/`, for his eye.
2. The LinkedIn Talent Insights reports. Chat owes him exact steps. Blueprint v2 stays blocked and Code does not chase it.
3. Informatica's `consentOnFile` flag.
4. The Blueprint archetypes carry no AI or retrieval content, so the tenth role family has nothing to associate to. An authoring job, not a defect.
