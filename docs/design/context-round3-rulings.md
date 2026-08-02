# Context — Round 3 rulings and work split

**v1.0 · 2 August 2026 · Chat lens, adjudicating Relay v7.2 (platform) and Capabilities relay v1.1**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`.
Read by both sessions. Session A reads §1, §2 and §4. Session B reads §1, §3 and §5.

---

## 1. Branches, and the rule that stopped being followed

**State at adjudication:** `main` at `e4b3d59` and well behind. `feat/platform-parity-round` at `50672fe` carries both sessions' work. `feat/capabilities-parity` at `08cdd26` carries session 2's work and is missing session 1's last two commits.

**Ruling.** `feat/platform-parity-round` is the integration branch because it is already the superset. **No rebase of anyone's commits.** Session A verifies that every capabilities commit is contained in it, merges it to `main` in one pass, pushes, and deletes `feat/capabilities-parity` once the containment check is clean. If containment fails, stop and report which commits are missing rather than cherry-picking.

**What went wrong last round, and it must not repeat.** One session committed onto the other's branch, and both shared one build directory, so an entire measurement pass described a stale build. Both are now cheap to avoid:

- Each session works on its own branch, named in its own prompt, and commits **only** to that branch. If you find yourself staging a file you do not own, stop.
- Each session runs its own dev server on its own `NEXT_DIST_DIR`, which `next.config.ts` now honours.
- Each session stages explicit path lists. No `git add -A`. That held last round on both sides; keep it.

---

## 2. Adjudication of session 1's seven questions

| # | Question | Ruling |
|---|---|---|
| 1 | Merge order | §1. Platform-parity-round is the integration branch, merge to `main`, no rebase |
| 2 | Finance depth | **Both.** Ship the honest interim now, Sumeet supplies the real twenty later. Detail in §5 |
| 3 | Tenth AI role family | **Ratified. Add it.** "AI Data Engineer, retrieval and RAG pipelines". Retrieval work currently split across two families is a real gap, and this is the domain carrying paid spend, so a gap in it is expensive. Ten families |
| 4 | Hue separation | **Not accepted. Re-derive by measurement.** Detail in §4.1 |
| 5 | `--r-chip` 2px from `--r-xs` | **Collapse.** Delete `--r-chip`, use `--r-xs` at 8px. Two steps 2px apart is not a scale, it is noise. If 8px visibly pills a slim chip, revert to a single 6px step and move `--r-xs` rather than keeping both |
| 6 | `DESIGN.md` contradictions | **The ratified rules win and `DESIGN.md` is stale.** Ambient alpha is 20% light and 30% dark per R11. Per-taxonomy assignment is permitted per R4. Correct both, date the amendment, and note in the file that it records ratified decisions rather than proposing them |
| 7 | `/ai-talent` lost a band | **Do not restore it there.** Ten role families is more depth than four capability areas, and those four belonged to a retired discipline. But do not lose them either: check them against the seven Data & Analytics expertise cards and port anything genuinely absent into that discipline, which is where they belong now. Session B owns this |

**Decisions I am confirming without change:** the sticky bar indexing five sections rather than thirteen mixed items; chips carrying a gradient, since Sumeet's direct instruction for shine overrode the written spec and the reversal is recorded in the CSS; `shortName` shortening the chip only; generic bar labels, since what each platform has genuinely differs; "Autonomous Finance assistants" rather than the family name; and the duplicate-class guard reporting rather than failing.

---

## 3. Adjudication of session 2's questions

| # | Question | Ruling |
|---|---|---|
| Pending | AI Talent has no sticky sub-nav | **Take your own recommendation: export `L1SubNav` from `L1PageShell`.** Rebuilding `/ai-talent` on the shell would cost the stack matrix and the estate diagram their place, and those are the page's most distinctive assets. Session A makes the export, session B consumes it |
| 1 | Estate diagram is HTML and CSS, not one `<svg>` | **Accepted, and the brief was loose.** The intent was vector and resolution-free, not an exported image. A single SVG cannot restack at 360px without two copies of the content in the accessibility tree, which is worse. `context-capabilities-parity-round.md` §7.1 is amended to say "vector, drawn by the browser, no raster asset" |
| 2 | ServiceNow under DevOps & Platform Engineering | **Accepted.** Record it as a dated canon §3 amendment rather than leaving it as a session decision |
| 3 | "Testing & Quality Engineering" versus "Testing & Quality" | **The canon label wins.** My dispatch shortened it in passing and that was my error, not an instruction |
| 4 | Cloud & Infrastructure and DevOps share six sub-desk names | **Your split by subject is right; the reader should not have to draw it unaided.** Detail in §5 |
| 5 | `contract-perm` uniform at two per desk | **Sumeet's ruling, 2 Aug 2026, reversing mine: architect and lead grade is right. The badges stay.** Detail in §5 |
| 6 | Redirects emit 308 rather than 301 | **Accepted.** 308 is a permanent redirect, search engines treat it as equivalent, and twenty neighbours already use it. Consistency beats the letter of a brief written without checking Next's behaviour |

**Also confirmed:** the Cybersecurity to **Cybersecurity & Risk** rename, with the slug staying `cybersecurity`, is well argued and stands. The three boundary crossings you logged were the right call and are accepted, including the six `introEyebrow` strings, because a site-wide casing gate that fails the build for both sessions is worse than a scoped edit.

**One thing to note rather than fix.** Your D2 finding, that no Artificial Intelligence row existed in `capabilitiesIndex` on `main`, means Sumeet's screenshot came from a tree that differs from `main` in more than that row. Nothing to do now, but if a future report does not reproduce, suspect the tree before suspecting the reporter.

---

## 4. Session A. Design system, gates and integration

Branch `fix/design-system-and-gates`, cut from `feat/platform-parity-round`.

### 4.1 The hue re-derivation, and I got this wrong

I derived harbour, claret and mulberry by hand, argued that the hue wheel was full, and flagged harbour against indigo as the one real risk. The measurement says three of them are too close, not one: claret to plum **0.75**, harbour to indigo **1.13**, mulberry to plum 1.60, mulberry to violet 1.73, harbour to teal 1.77, claret to mulberry 2.33, against an approved range of 2.55 to 4.87.

The fix is not another hand-picked hex from me. It is a measured search, and the check that produced those numbers is already the objective function.

**Task.** Hold indigo `#3a5a8a`, teal `#3d7d7d`, plum `#8e4a72` and violet `#5f5694` frozen. Re-derive harbour, claret and mulberry to maximise the minimum pairwise separation across all pairs, with a hard floor of **2.55**, the lowest value among the approved six.

**Constraints:**

- Move lightness and chroma, not only hue. The wheel genuinely is crowded, so separation has to come from value and saturation as well. That is the part my hand derivation missed.
- Harbour must still read as a soft cool blue. That was Sumeet's explicit instruction and it is not negotiable.
- Claret must not read brown or orange. Umber was rejected for exactly that.
- Nothing may read green. Moss was rejected.
- All three pass `check:contrast`, leak onto no control, and behave at real alpha, 20% light and 30% dark.

**If 2.55 is unreachable with three hues, do not ship a fourth guess.** Report the best achievable minimum, name the binding pair, and put up the alternative: fewer distinct hues, reused across taxonomies, which the palette document already permits because a visitor is inside one family at a time.

**Deliver a contact sheet** in `docs/status/shots/` with every pair's measured separation, both themes, at real alpha, rendered on a real page. This is a judgement for Sumeet's eye, so make it easy to look at.

### 4.2 The rest of session A

1. **Merge to `main` per §1.** Do this first, so a day's work stops living on a branch.
2. **`--id-ai-talent-l/d` and the `[data-identity="ai-talent"]` selector.** Two token lines and one selector pair. Until they land, the discipline carrying the paid marketing wears a positional hue instead of its own.
3. **Export `L1SubNav` from `L1PageShell`** per §3, so session B can give `/ai-talent` its sub-nav without rebuilding the page.
4. **`--r-chip`** per §2.5.
5. **`DESIGN.md`** per §2.6.
6. **The `check-interaction` rule-count floor.** It fails `/platforms/sap/sap-datasphere` at 451 rules against a floor calibrated on the heaviest template, which delivers 743. That is a gate defect, not a page defect. Make the floor per-template or relative rather than absolute, and confirm the gate still catches what it was built to catch.
7. **Gate page lists.** Twice this round the list, not the rule, was what failed. Add the standing rule to `AGENTS.md`: a new template is added to every enumerating guard in the same commit that introduces it. Then audit the current lists against the route table and close the gaps.
8. **Triage the twelve duplicate CSS class declarations.** Some are deliberate second blocks, some may be live collisions. Separate them, fix the collisions, annotate the deliberate ones, and only then decide whether the guard should fail rather than report.

---

## 5. Session B. Content, data and information architecture

Branch `feat/content-depth`, cut from `feat/platform-parity-round`. Rebase onto `main` once session A's merge lands.

### 5.1 `/industries/finance`, the P0

All twenty finance expertise entries carry zero `tools`, so no finance L2 route exists and every card is a dead end. Retail has twenty of twenty. This is the page a banking buyer opens to test whether module depth is retail-only marketing.

**Ruling, Sumeet 2 Aug 2026: the depth is authored, and it is deliberately shallower than retail.** Nine functions, not twenty, restricted to the five platforms already named in the hero and weighted to what Middle East banks actually run. Full content in `docs/design/context-finance-depth.md`, which is the source for this work.

The existing twenty entries are not all kept. Map them onto the nine where they correspond, populate those, gate or remove the rest, and report what you removed. Rewrite hero and index copy to match nine real functions: a page promising twenty and delivering nine is the same defect in a smaller size.

Session 1 was right to refuse to invent this content. What changed is not the rule but the source: the nine functions are now authored and ratified rather than guessed at inside a build run.

### 5.2 The tenth AI role family

Add **AI Data Engineer, retrieval and RAG pipelines** as the tenth family, per §2.3. Full L2 to the same depth as the nine: what it does, what we screen for, the common mis-hire, stacks from `stacks.ts`, seniority grades, where it sits in a programme. Then re-check the estate diagram overlay, since a tenth family changes which bands it marks, and rebalance so no band carries most of the set. Move retrieval content out of the two families currently splitting it rather than duplicating it.

### 5.3 Cloud & Infrastructure against DevOps & Platform Engineering

Six shared sub-desk names, and the split by subject is correct: Cloud staffs the estate, DevOps staffs the delivery system that runs on it. The defect is that the buyer has to infer it.

Make it explicit. One line on each L1 stating the distinction in the site's voice, and cross-link the six shared sub-desks between the two so a reader who lands on the wrong one is one click from the right one. Do not delete either side; canon ratifies both.

### 5.4 The `contract-perm` badges

**Sumeet has ratified the pattern, 2 Aug 2026: architect and lead grade is right.** My earlier instruction to strip them is withdrawn.

What remains is verification rather than removal. Confirm every badge sits on an architect- or lead-grade role and move any that does not, so the rule is applied rather than approximated. The section keeps reading "Contract unless noted" from data, and the badge keeps rendering only where a role deviates. Report any badge you moved and any desk where no role is architect or lead grade, since that is a data question rather than a badge question.

### 5.5 The rest of session B

1. **Informatica's mega-menu support line.** It is absent from `platformsIndex` and it is the last unlevel row in the panel. Sumeet has noticed it twice. One index entry with a real tagline in the register of its six siblings.
2. **Platform-side return cross-links.** The capability side wrote links out; the platform files owe the links back. One each, both directions, no more.
3. **Blue Yonder's role data.** Sector-derived generics sit beside real titles, and near-duplicates like "MFP Specialist" against "Blue Yonder MFP Specialist" survive the union of authored and derived roles. Untangle the union so authored titles win and generics are suppressed where a specific title already exists.
4. **The two retail L2s that read identically.** Screening and Engagement bands are word-for-word across all twenty. Make them genuinely differ per function. This is authoring, not CSS, and it is the kind of sameness a buyer reads as automation.
5. **The four orphaned capability areas** from the retired data-ai page, per §2.7. Check against the seven Data & Analytics cards and port anything genuinely absent. Do not restore them on `/ai-talent`.

---

## 6. What stays with Sumeet

1. **The LinkedIn Talent Insights reports.** Sumeet holds the login. Chat owes him exact, detailed steps for the specific reports Blueprint v2 needs, in a later session. **This is a Sumeet-and-Chat item; Code does not touch it and does not chase it.** Blueprint v1 ships structure-only, with no scarcity figure, no time-to-hire and no rate.
2. **Informatica's client-register consent flag**, still `consentOnFile: false`. One line to flip when the paperwork lands.
3. **The hue contact sheet** from §4.1, for his eye.
4. **Backbase**, proposed for the finance digital-channels function and deliberately not built.

Closed on 2 Aug 2026: the finance content, now authored in `context-finance-depth.md`; and the `contract-perm` pattern, now ratified.

---

## 7. Forbidden, both sessions

- Committing to the other session's branch, or sharing a build directory.
- `git add -A`.
- Inventing a job title, tool, client, metric, quotation, case study or date.
- Any "coming soon" or dash-filled cell in place of missing content.
- Retuning a gate you do not own without saying so.
- Banned vocabulary per canon §2. UK English, no em dashes.
