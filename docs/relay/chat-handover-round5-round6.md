# Chat lens handover — round 5 close-out and round 6 start

**2 August 2026 · from the session running LTI · for the new Chat session taking Code and canon**
Read this, then `docs/design/context-round5-rulings.md`, then `docs/relay/code-to-chat-v10.0.md`. When
Session B's relay lands it will be `docs/relay/capabilities-v4.0.md` — it had not landed as of this
handover.

---

## 1. Why this split exists

Sumeet is running the LinkedIn Talent Insights data pull himself, in parallel, via Claude in Chrome,
with heavy step-by-step supervision from the session handling that thread. That session is staying on
LTI exclusively and handing Code/canon work to you so neither thread stalls waiting on the other.
Nothing about the working loop changes: Chat writes rulings into `docs/design/context-*.md`, hands
Sumeet two `/goal` prompts, two Code sessions run in parallel worktrees split by file class, each files
a relay, Chat adjudicates.

**Do not touch LTI.** If Sumeet mentions Talent Insights reports, scarcity data, or Blueprint v2
quantities, that is the other session's thread. Point him back to it rather than answering from
context you don't have live.

---

## 2. Where round 5 actually is

**Session A is done and filed at `docs/relay/code-to-chat-v10.0.md`.** All of §3 shipped. Fourteen
gates green on a production build. Read the relay in full before doing anything — it is dense and
several findings change what B should do next.

**Session B has not filed yet.** Its relay will be `docs/relay/capabilities-v4.0.md`, answering
`context-round5-rulings.md` §4 and §6. Do not adjudicate round 5 until it lands. When it does, adjudicate
both relays together, the way rounds 3 and 4 were adjudicated, not A in isolation.

### What A found that changes B's brief

1. **The duplicate repository was a non-issue.** `yallo-talent-website-B` is a linked worktree of the
   same repository (verified via `.git` pointer file and `git rev-parse --git-common-dir`), not a second
   clone. Nothing needed resolving. Do not reopen this.
2. **Both of round 5's "measure before you diagnose" flags were already closed by the merge** —
   `_L1CrossSector` was gone, Education was already in the mega menu. Confirmed post-merge, not
   assumed. This is the standing failure mode (diagnosing a symptom that a merge already fixed) working
   correctly for once. Keep expecting it.
3. **The platform derivation found ten copies, not the six or seven predicted, including two on no
   list anyone had made**: `PlatformCoverage.name` (the platform's own H1/eyebrow/title/module headings
   — the largest platform-name surface on the site) and the homepage rail's `published` flag, which
   disagreed with the mega menu about whether Telco & Media exists, in the wrong direction, inside the
   same round that "fixed" it. Both are closed now. The lesson: grep finds copies with obvious names;
   measuring the rendered page finds the ones that don't have one.
4. **`check:taxonomy` rule 6 (platforms) was first written wrong and shipped green**, because its
   pattern only matched keyed positions (`label:`, `name:`) and the two motivating defects — the JSON-LD
   platform list and the CV form's interest options — are bare quoted-string arrays with no key in front
   of them. It could never have caught what it was written for. Fixed by adding array-element matching,
   verified by typing both original defects back in and watching it fail. **Take this as confirmation
   of the standing rule**: a gate is not trusted until it has been watched to fail on its own motivating
   case, not merely written to look like it would.
5. **B inherits 70 inert platform labels across 18 files and 48 inert discipline labels across 13**,
   listed in `check:taxonomy`'s output beside the 60 sector labels from round 4. A's relay adds a
   caution worth repeating verbatim: three of the lists it flagged as inert turned out to be live, not
   inert, so **do not assume a flagged label is unreachable — check each one renders nowhere before
   sweeping it**, the same discipline B already applied to the sector sweep.
6. **Two stale meta descriptions still omit Informatica** (`src/app/layout.tsx:39`,
   `src/app/platforms/page.tsx:11`), outside `src/data`, so A's by ownership but flagged rather than
   fixed because rewriting authored copy is not a derivation task.
7. **The ESLint number from round 4 was wrong, not the code.** 624 was 96% generated and duplicated
   files, because `eslint.config.mjs` was linting whichever dist directory happened to be on disk plus
   two nested worktree checkouts of the same source. Fixed the config, not the code. **The real count is
   38 errors, four rules, 34 of them literal apostrophes in JSX** — see
   `docs/status/eslint-triage-2026-08-02.md`. My recommendation, not yet ratified by Sumeet: leave all
   38 for the next copy pass rather than script-fixing apostrophes inside authored prose, since that
   would be a content change wearing a lint fix's clothes. Raise this with him when you next have his
   attention on something else; it is not urgent enough to interrupt him for on its own.
8. **`check-rendered-type` was flaky** — passed and failed on the identical commit depending on whether
   the image optimiser cache was warm. Switched from `networkidle` to `domcontentloaded` plus the
   existing font-ready wait. Verified it still catches a real violation.
9. **`check-colours` matches literal hex and misses `rgba()`.** Reported, not closed — tightening it now
   would fail the build on pre-existing colour the session had no authority to touch. Two `rgba(110,
   231, 183, …)` greens on `BriefForm.module.css` are sitting outside the palette because of this gap.

### One item for Sumeet, not for Code

A found that `BriefForm.module.css` (imported by `CvUploadForm.tsx`, which A touched for an unrelated
reason) never went through the light-register rebuild that L1, L2 and service pages got: it paints from
a legacy dark alias rather than the semantic ground layer, so it cannot respond to theme at all, and it
carries pill radii and two off-palette greens alongside it. **Nothing was changed.** This needs a design
ruling from Sumeet (is `/brief` meant to be a fixed dark band, and if so make it declare that
deliberately) before either of you touch it. Surface it to him; do not put it in a `/goal` prompt as a
fix until he has ruled.

Also unresolved and explicitly not Code's to chase: a canon ambiguity over whether the type floor's "13px
everywhere" applies to mono labels (an 11px mono label currently passes the gate). Flag, don't fix.

---

## 3. Round 6 — AI Talent second pass, ruled but not yet written up

Sumeet reviewed the AI Talent capability desk in the LTI session and gave four rulings there. **They
have not yet been written into a context file** — do that as your first task, as
`docs/design/context-round6-ai-talent.md`, subordinate to canon as always. The four:

1. **Ten tools maximum per surface, test: enterprise-bought and Yallo screens against it** — a
   procurement line, not a library. This reverses last round's acceptance of LlamaIndex under Retrieval,
   which is a library and fails this test. It should come off.
2. **The desk conforms to the standard capability-page template.** Exactly two unique elements survive:
   the role-family structure, and the AI Data Engineer join to Data Science (the `adjacentDiscipline`
   field A just built in round 5, §4 above — it resolves both ways off the sub-desk title, no hardcoded
   label). Everything else adopts the standard shell.
3. **The no-sector-rail decision from round 5 (§2, decision 6) is amended**, not overturned: it becomes
   "no rail until per-sector AI evidence exists," rather than "never." Ruling 2 reopens this honestly,
   because a desk that conforms to the template has a rail-shaped gap where the other six desks have
   content.
4. **The architecture diagram is rebuilt to a written brief, not improved in place.** First step is
   Code capturing the current render (screenshot, not description) so Chat can spec against what
   actually exists rather than what the relay describes.

**Sumeet said he will give further suggestions on what and how to fix on this desk, and that this
happens together during round 6.** Treat the four rulings above as the starting brief, not the whole of
it — expect him to add to `context-round6-ai-talent.md` before you send the round 6 `/goal` prompts, and
build the diagram capture step first so his additional input has something concrete to react to.

---

## 4. Standing rules, unchanged, worth restating because this is a fresh session

- Never invent a person, client, quotation, metric, source, case study, date, job title or platform.
  Where content is genuinely needed and unsourced, author it into a context file for Sumeet's
  ratification — that is the line between authoring and inventing.
- A gate is not trusted until it has been watched to fail on the defect it exists to catch.
- Measure before diagnosing. Several "defects" this round were gates or merges, not the page.
- Sumeet delegates with "decide for me" — decide, take the least-overclaiming option, log it. One
  recommendation with the trade-off, not a menu, unless the choice turns on information only he holds.
- UK English, no em dashes, canon §2 banned vocabulary, no sentence counting the items below it, no
  interface microcopy. "Yallo" capital Y only, never rendered in capitals.
- `/goal` prompts have a hard 4,000-character limit. Write the full prompt, measure with
  `python3 -c "print(len(open(path).read()))"`, compress in passes.
- A context document is not in play until it is committed **on the branch the other session cuts
  from**, per round 5's sharpened version of the round-4 rule.

---

## 5. Immediate next actions, in order

1. Read `context-round5-rulings.md`, then `code-to-chat-v10.0.md` in full.
2. Wait for `capabilities-v4.0.md`. Do not adjudicate A alone.
3. When B lands, adjudicate both, write `context-round6-rulings.md` (or fold into the AI Talent context
   file if the timing lines up — your call), and prepare the round 6 `/goal` prompts once Sumeet has
   added his further AI Talent input.
4. Write `docs/design/context-round6-ai-talent.md` now, from §3 above, so it exists before Sumeet adds to
   it.
5. Leave `docs/lti-reports/` alone entirely — it is the other session's working area and files will
   keep appearing there.
