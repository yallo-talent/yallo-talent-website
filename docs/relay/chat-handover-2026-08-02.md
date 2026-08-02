# Chat lens handover — GTM.01 yallo.co build

**2 August 2026 · from the Chat session that ran rounds 1 to 4 · for the next Chat session**
Read this, then `docs/design/yallo-talent-CANON.md`, then `docs/design/context-round4-rulings.md`.

---

## 1. What this session was

Sumeet owns and builds yallo.co personally through Claude Code. Chat holds canon, design direction, adjudication of Code's relays, and the authoring of content Code is forbidden to invent. This session took the build from the post-homepage state through four rounds of parallel Code sessions.

**The working loop, and it is now proven.** Chat writes rulings and authored content into `docs/design/context-*.md`, hands Sumeet two `/goal` prompts under 4,000 characters each, two Code sessions run in parallel in separate git worktrees, each files a relay at `docs/relay/`, Chat adjudicates and the loop repeats. Two parallel sessions roughly doubles throughput and the seam that makes it safe is **ownership by file class, not by subject**: one session owns tokens, shared shells and gates, the other owns `src/data/**` and copy.

---

## 2. Where the build is

Seven platforms, seven capability disciplines, seven industries, all at comparable depth. AI Talent is the first capability discipline and carries the paid marketing. Programme Staffing Blueprint ships as a structure asset with three archetypes. Finance and Education are authored to a deliberately shallower nine and eight functions rather than retail's twenty.

**Round 4 is in flight as this is written.** Session A does integration, the 72-hour over-claim, body-text contrast over the wash, hue set C and gates. Session B does Education & Universities, the sector index, the Data Science desk and the finance sweep. Both relays will land at `docs/relay/code-to-chat-v9.0.md` and `docs/relay/capabilities-v3.0.md`.

---

## 3. The five things that keep going wrong

Each recurred often enough to be a pattern rather than an incident. Expect them.

1. **Hand-copied taxonomy labels.** Six instances across two rounds, each hiding in a shape the previous lint could not see: a short label, a `const` map, an inline array, a nav column, a cross-link label beside an href, a sector rail. Every fix must derive from the single index. Assume a seventh exists.
2. **Blind guards.** Twice a gate passed while the defect was live, because the gate measured tokens rather than composites, or enumerated a page list that had gone stale. When a gate is green and the page is wrong, suspect the gate.
3. **Symptoms naming the wrong layer.** Five of twelve homepage faults were a gate, a guard or an off-by-one dressed as a design problem. Instruct Code to measure before it diagnoses, every time.
4. **Uncommitted artefacts.** Chat writes context files into the working tree; nobody commits them; a parallel worktree cannot see them. Session A now commits them as step one. Watch that it holds.
5. **Error rate spiking at the end of a run.** Every prompt carries a stop condition for this. It works. Keep it.

---

## 4. Standing rules that are easy to breach

- **Never invent a person, client, quotation, metric, source, case study or date.** This is the rule Sumeet has corrected hardest. When content is genuinely needed and cannot be sourced, Chat authors it as market-standard vocabulary in a context file for his ratification. That is the difference between authoring and inventing, and it is the whole reason the context files exist.
- No figure without a visible source. No rates on the public site.
- UK English, no em dashes, canon §2 banned vocabulary, no sentence that counts the items below it, no interface microcopy.
- "Yallo" capital Y only, never in capitals, and `text-transform: uppercase` is how that rule gets broken invisibly.
- Claude talent is depth-proof only, never the organising claim.

---

## 5. How Sumeet works

Long, voice-style messages mixing strategy, design critique and correction. He expects them structured and acted on, not reflected back. **He delegates: "decide for me" means decide, take the least-overclaiming option, and log it for review.** One recommendation with the trade-off, never an options menu, unless the choice turns on information only he holds, and then use `ask_user_input_v0` with a stated default.

Corrections are direct. Acknowledge plainly and move.

**The prompt format matters.** Claude Code enforces a hard 4,000-character limit on `/goal`. Write the full prompt, measure with `python3 -c "print(len(open(...).read()))"`, then compress in iterative passes. Push detail into the context file and let the prompt point at it. Budget real time for this; it takes several passes.

---

## 6. Open with Sumeet

1. **The hue contact sheet** at `docs/status/shots/hues-v8/`. Set C shipped under a changed criterion; his eye may still veto.
2. **LinkedIn Talent Insights.** He holds the login. **Chat owes him exact, detailed steps for the specific reports Blueprint v2 needs.** This is the one concrete debt this session leaves. Blueprint v2 quantities stay blocked until it is paid.
3. **Informatica's `consentOnFile` flag**, still false, one line to flip.
4. The Blueprint archetypes carry no AI or retrieval content, so the tenth AI role family has nothing to associate to. An authoring job.
5. **Insight articles are descoped** to Raphy's pod. Do not pull them back in.

---

## 7. Two things I got wrong, so the next session does not

**I derived three ambient hues by hand and argued the wheel was full.** Measurement showed three failed, not the one I flagged. Then, offered a re-derivation, I had set the wrong test entirely: a pairwise floor between colours a reader never sees together. Code pushed back and was right. **When a judgement can be measured, specify the objective function and let Code search. Do not hand it hexes.**

**I ruled AI Talent a signpost rather than a discipline.** Sumeet reversed it within hours because it is where the paid marketing goes. When a decision is about where demand will come from, that is his call, not a taxonomy tidiness question.

---

## 8. The artefacts

`docs/design/` holds canon, `DESIGN.md`, the identity palette, and the context files: finance depth, education, AI talent, Informatica, the Blueprint, the platform and capability parity rounds, and rounds 3 and 4 rulings. `docs/relay/` holds every Code relay in sequence. Read the two most recent relays and the most recent rulings file and you will have the live state; the rest is history you can search when a decision needs its reason.
