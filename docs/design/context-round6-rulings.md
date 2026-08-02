# Context — Round 6 rulings, and the AI Talent redo

**v1.0 · 2 August 2026 · Chat lens, adjudicating relay v10.0 (session A) and capabilities v4.0 (session B)**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. A reads §1, §2, §3, §5, §6. B reads §1, §2, §4, §5.
Supersedes the unwritten `context-round6-ai-talent.md` draft; that file was never committed and does not exist.

---

## 1. Process

Round 5's §1 held on both sides. A committed the rulings document first, caught its own near-miss and fast-forwarded `main` before B cut; B checked ancestry rather than assuming and got `0 0`. Keep both.

**Merge.** A merges `fix/round5-system` first, then `feat/round5-content`, into `main`. Ancestry checked before each push, neither forced. Both round 6 branches cut from the merged `main`, one per worktree.

**Context documents.** A commits every `docs/design/context-*.md` present in the tree as its first commit, then fast-forwards `main` to it before B cuts. This file included.

**The file-class split changes this round, and the change is the point.**

| Tree | Owner |
|---|---|
| `src/data/ai-talent/**`, all of it, types included | **A** |
| Everything else under `src/data/**` | **B** |
| `src/components`, `src/lib`, `src/app`, `scripts`, gates | A |

The AI Talent redo changes the shape of `stacks.ts` at the same time as the component that reads it. Splitting those across two sessions would put a type change and its only consumer on two branches. Round 5 already set the precedent: A edited `src/data/ai-talent/types.ts` for decision 7. This generalises it for one round. B does not enter that tree at all.

**Conflicts expected: one, not three.** Both sessions touch nothing in common except the context docs. If a second appears, it is a signal the split leaked.

---

## 2. Decisions taken

| # | Decision | Reasoning |
|---|---|---|
| 1 | **The max-ten-tools cap is withdrawn.** Replaced by the tier test in §5. | It was a symptom-level instrument aimed at crowding. Applied literally it would have deleted the screening depth, which is the proof, not the clutter. Sumeet's own words: not fussed about the number, it must be sensible and enterprise-shaped. |
| 2 | **The stack matrix is deleted as a band. The estate band absorbs it.** | They are one set of 44 tools under two groupings that disagree, and the estate band's layer descriptions name tools in hand-typed prose. That is the round 5 derivation class in content structure. See §3.2. |
| 3 | **Ruling 2 of the LTI session is amended: three unique elements, one unique band.** Role-family structure, the `adjacentDiscipline` join, and the estate band. | Conformance measured in bands is the honest test. The desk goes from two unique bands to one and conforms everywhere else, so it gets simpler rather than more special. A desk with no signature at all would fail the wedge in canon §1. |
| 4 | **No sector rail on `/ai-talent`, and the amendment's urgency is dropped.** The wording stays: none until per-sector AI evidence exists. | The amendment was reasoned from a rail-shaped gap left by conformance. Decision 3 keeps a signature band, so the gap closes. Nobody chases evidence for a rail. |
| 5 | **Zapier and Make come off. LlamaIndex stays, graded engineered.** | Zapier and Make are SMB automation, against canon §1's enterprise-programme wedge, on exactly the reasoning R2 used to retire SAP Business One and Business ByDesign. LlamaIndex fails "bought" and passes "screened against", which is what the tier is for. |
| 6 | **The seven Education screening lines are ratified verbatim.** | Reviewed against canon §2 and §9. Each claims only what is screened for. No outcome, no rate, no volume, no person, no client, no banned vocabulary. B's correction of the count from eight to seven is right: a cross-link card that restates nothing makes no screening claim. |
| 7 | **`insightsSub`'s individual byline is swept.** | Canon §8 ratified a house byline with no individual names. Inert today only because no insight renders; it ships with the first published article. |
| 8 | **Segment headings do not assert completeness.** | "Every public-sector segment" over four, with central government carrying none, is the same family of defect as a sentence counting the items below it. Canon §2 already bans the counting form. |
| 9 | **Healthcare and telco segments are not touched this round.** | B's stop condition was correct. The replacement set is authoring against a customer partition each page already states, and it needs Sumeet's ratification before it becomes data. See §7. |
| 10 | **Government's `Education Administration` segment stays, and government keeping four is accepted.** | A school authority is a public body. The overlap with the Education sector is real and tolerable; deleting it would take government to three. Least-overclaiming option, logged. |

---

## 3. Session A — the AI Talent redo, plus system

Branch `fix/round6-system`. In order.

### 3.1 Conformance inventory, before anything is changed

Nobody has written down where `/ai-talent` departs from a standard discipline page. The relays describe the desk; they do not enumerate the delta. Measure before diagnosing is the standing rule and this is the round's most likely place to break it.

Render `/ai-talent` and `/capabilities/data-analytics` side by side. For every band in order: which component renders it, and whether the AI desk's version is the standard one, a variant of it, or unique to the desk. Rendered, not grepped. Round 5's own lesson is that grep finds the copies with obvious names and only the rendered page finds the rest.

Report the table before changing anything. Everything the inventory finds unique is conformed, except the two elements decision 3 protects and the estate band it rebuilds.

### 3.2 The estate band, rebuilt

**Structure.** Five layers in a vertical stack, two rails that visually span all five.

| Zone | Contents |
|---|---|
| Rail, left | Evaluation and observability. Spans every layer. |
| 05 | Experience and delivery |
| 04 | Orchestration and agents |
| 03 | Models |
| 02 | Data and grounding |
| 01 | Systems you already run |
| Rail, right | Governance, risk and safety. Frameworks, not tools. Spans every layer. |

**Layer 01 is the enterprise anchor and it is derived.** It carries the platform desks from `platformsIndex` in canon order, not AI tooling and not hand-typed names. This is the join between `/ai-talent` and the platform pages, and canon §1 records it as the part a competitor cannot copy without first having the platform depth. It must not become an eleventh copy of the platform set: rule 6 stays green through the rebuild.

**Every tool carries a layer and a tier.** `StackGroup` is replaced by `layer` plus `tier`. The `roleFamilies` field is unchanged and is what makes the three-way map work: layer holds tools, layer places roles, `roleFamilies` joins the two.

**`stackMatrixAssertion` and `placementHistory` survive untouched.** Naming a tool asserts that Yallo screens for it and nothing more. No entry flips to `true` without Sumeet naming a placement he will stand behind. The assertion line moves onto the merged band; it does not disappear with the band it was written for.

**What makes it graphical, inside canon §5.** The current band is dashed wireframe boxes with everything gold-outlined, so nothing reads as load-bearing and the whole thing reads as a schematic of a page rather than a page. The vocabulary already exists:

- Solid tonal grounds stepping the mulberry ambient rhythm (`.amb-1…6`) so five layers read as a stack. Not dashed outlines.
- Hairlines, per canon §5's flat depth with tonal layering plus hairlines.
- The quarter-round petal on each layer block. It is the site signature and it is absent from this band entirely.
- **Gold on the role chips only.** Everything is gold-outlined today, so the roles, which are the product, do not stand out from the boxes containing them.
- The rails must visually span rather than sit as two sibling columns. "Spans every layer" is currently a sentence doing a diagram's job.
- Layer 01 rendered with the platform marks in monochrome, if and only if the marks are wired to `public/`. Text if they are not. Report which.

### 3.3 The L2 variant

The same component, one prop, filtered by role family. Layers that family works at are lit; the rest are present and dimmed, because absence would lose the estate context that is the point of the band. Not a second data path and not a separate filtered list.

### 3.4 The role-chip interaction

Focusing or hovering a role chip lights the tools that family is screened against, across every layer. That is the role-to-tool leg made legible without a fourth band.

Conditions: keyboard reachable, paired with a non-motion cue per canon §5's A5, and every fact readable with the interaction never triggered. It is an affordance over the data, never the route to it.

### 3.5 System work

- Promote `check:taxonomy` rule 5 to a hard failure. B reports zero inert sector labels. Verify by typing one back in.
- Pre-commit hook scoped to the staged set. It runs `biome check --write` across all 194 files and reformatted A's own file inside three of B's commits. A session staging with `git add -A` would carry another session's file into its commit.

---

## 4. Session B — data outside `ai-talent`, and copy

Branch `feat/round6-content`. In order.

### 4.1 The platform and discipline label sweep

70 platform labels across 18 files, 48 discipline labels across 13. Sweep as the 76 sector labels were swept: derive from the index owning the href.

**Apply B's own round 5 finding first.** The report is a handover list, not a proof of inertness. Of the 76 sector labels, 49 were inert and 27 rendered; deleting all 76 would have taken the text off twenty links and out of seven breadcrumbs. Three of A's flagged platform lists were live. Check each renders nowhere before sweeping it, report the split by shape, and expect the real count to differ from 118.

### 4.2 The byline

`insightsSub` reads "Written by Sumeet Goenka and the Yallo team." on seven surfaces. Delete the authorship clause. If that empties the field, delete the field, because an unrendered row needs no subtitle. Do not mint a replacement byline; canon §8's house byline belongs on the article, not in a section subtitle.

### 4.3 The headings

Remove the completeness claim from finance's and government's segment headings. Do not replace it with a count, which is the other banned form.

### 4.4 The CPG overlap, and the em dash

One test, applied literally: if `FMCG Manufacturing`'s role pills are a subset of `Consumer Packaged Goods (CPG)`'s, delete `FMCG Manufacturing`. If not, leave both and report both pill sets verbatim. Merging pills or choosing a name is authoring.

Retail's `FMCG — Fast-Moving Consumer Goods` carries the only em dash in any segment name. Parenthesise it.

---

## 5. The tool inclusion test, stated once

This replaces the max-ten cap and it is the class rule, not an instance.

**Every tool carries a tier.**

| Tier | Test | Render |
|---|---|---|
| **Bought** | An enterprise procurement route exists for it. Somebody signs a contract. | Leads its layer, prominently |
| **Engineered** | No procurement route, but Yallo screens candidates against it | Secondary line within the same layer |

**Why grading rather than deleting.** An Agentic AI Developer genuinely is screened on LangGraph, and removing it would make the desk's screening claim false. But a buyer should not meet LangGraph before Salesforce Agentforce. The crowding Sumeet saw was not count, it was a flat wall of 44 with the enterprise names buried mid-list. Distributed across seven zones at six to ten each, graded within each, the same depth reads as an architecture.

**The count is an outcome, not a target.** After decision 5 the set is 42 tools, plus the platform desks at layer 01 and four governance frameworks. Nobody counts to ten.

**One deletion rule survives.** A tool that fails both tests comes off: no procurement route and not screened against. Zapier and Make fail the first on the enterprise wedge, which is the canon-precedent case, not a taste call.

---

## 6. Round 5 adjudication — closed, and what moved

**Closed, both sessions.** Every §3 and §4 item shipped. Twenty-two gates green across the two branches. Two findings A was sent to fix were already closed by the merge, which is the standing failure mode working correctly. Two gates were themselves the defect, and one of them, `check:taxonomy` rule 6, had shipped green because it could never have fired on either defect it was written for. That is the round's most valuable finding and it confirms the standing rule: a gate is not trusted until it has been watched to fail on its own motivating case.

**Recorded, no action.** The duplicate repository was a linked worktree and needed nothing; do not reopen it. Decision 1 removes every insight row on every page, not only finance, because no insight is published anywhere. That is the correct outcome and larger than the ruling's wording implied. The eight unsourced figures B swept across four sector pages were not in the ruling and were right to sweep as a class rather than as the page they were seen on; the five sourced 72% cards correctly survived, because the test is the source, not the figure.

**§6.4 Meta descriptions — a class fix, not an instance.** `src/app/layout.tsx:39` and `src/app/platforms/page.tsx:11` both enumerate platforms and both omit Informatica. Do not extend the list. A meta description that enumerates a taxonomy goes stale every time canon amends it, which is the same defect the derivation closed in code. Replace the enumeration with a non-enumerating phrase. Report both strings verbatim, before and after, so the copy can be reviewed.

**Deferred to round 7, logged so it is not lost.** `L1Segment.name` can be deleted outright once `deriveSectorRail`'s generic constraint in `src/lib/sectors.ts` is relaxed; B measured the exact failure at `L1PageShell.tsx:785`. It is A's one-line change and B's mechanical delete, which makes it a cross-session dependency, and round 6 is already carrying the AI Talent rebuild. The 49 fields are dead but harmless.

**Not touched, and not Code's.** The 38 ESLint errors stay, 34 of them apostrophes inside authored prose; replacing those by script is a content change wearing a lint fix's clothes. `check-colours`'s `rgba()` gap stays open, because closing it fails the build on the two `BriefForm.module.css` greens, which wait on a design ruling.

---

## 7. Still with Sumeet

1. **Healthcare and telco segments.** All 29 are work-shaped and both sectors would reach zero. The customer partition is already written on each page, one line above the list that ignores it: healthcare's `segmentsSub` says providers run different programmes from CROs or biotech; telco's says a tier-1 MNO runs different programmes from a broadcaster or a hyperscaler-connect carrier. Those name real institution types and are the page's own published words, so segments derived from them would be authoring rather than inventing. Chat drafts a proposal for ratification; nothing enters data until he ticks it.
2. **`/brief` and `BriefForm.module.css`.** Is `/brief` a declared dark band? The file paints from a legacy alias, cannot respond to theme at all, and carries two off-palette greens and 999px pills against the petal signature. Three design ratifications in one file. Nothing moves until he rules, and `check-colours` cannot be tightened until it does.
3. **The mono size floor.** Canon A4 reads "nothing below 13px anywhere" but the gate enforces a 14px sans floor with no mono minimum, so an 11px mono label passes. Either the gate is short of the rule or the rule means sans.
4. **Platform marks in `public/`.** Layer 01 renders monochrome marks if they are wired and text if they are not. Defect M9 had them sitting unwired in `docs/`; A reports the current state.
5. **Hue contact sheet** at `docs/status/shots/hues-v8/`. Set C ships unless he reverses it.
6. **Informatica's `consentOnFile`.** A consent question, not a code question.
7. **LinkedIn Talent Insights.** A separate session's thread. Code does not chase it and this file does not answer it.

---

## 8. Canon amendments to ratify

Drafted for Sumeet's tick. Nothing below is in force until he ratifies it; canon is amended, never rewritten.

**§3, amendment — the AI Talent desk carries one unique band.** The desk conforms to the standard capability-page template. Exactly three elements are unique to it: the role-family structure, the `adjacentDiscipline` join to Data Science, and the estate band. The stack matrix is retired as a separate band and its content moves into the estate band, which is the desk's single signature. No sector rail until per-sector AI evidence exists.

**§3, amendment — the tool inclusion test.** Every tool published on `/ai-talent` carries a tier. Bought means an enterprise procurement route exists. Engineered means no procurement route exists but Yallo screens candidates against it. A tool that fails both is not published. There is no numeric cap; the tier and the layer do the work. SMB-tier products are not published, on the same reasoning that retired SAP Business One and Business ByDesign.

**§2, amendment — completeness claims.** A heading may not assert that the set below it is complete. This extends the existing ban on a sentence that counts the items below it: "Every X segment" makes the same claim by another route and goes stale the moment the set is curated.
