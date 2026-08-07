# Context — Round 19: the write pane, the assistant's CX, and the people

**v1.0 · 7 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Standing rules: `context-round13-scope.md` §8, as amended by round 17 §1.1 (**R-A9**). Single session, one port (3115), one dist directory, per Sumeet's ruling of 6 August.

**The theme of this round.** The write pane is the last thing between Sumeet and cutover, and its credentials have now landed. Alongside it: the assistant's customer experience has three live defects Sumeet found by using it, and the leadership page ships the bios he has now ratified. Sumeet reviewed both surfaces in a browser on 7 August; his instructions are recorded verbatim where they decide something.

---

## 1. Round 18 adjudication

`v26` read in full. **Accepted in its entirety, none of it reopens.** Specifically accepted: the copy-rules/source-rules separation and its `copySpans` scope; the orb gate's technique-versus-wash distinction and its place in the pre-commit hook; the `ENTITIES` extraction; the comparison table shipping categories; the six separator-token fixes found by reading the diff. Code's retraction of the `check:assistant-terms` finding is the same premise-error class Chat has filed six of; recorded, no action.

Rulings on v26's open items, with Sumeet's 7 August decisions where he gave them:

| Item | Ruling |
|---|---|
| Credentials | **In place, per Sumeet, 7 August.** The write pane proceeds. Expected, not measured: Code verifies at ground. |
| Competitor names in the table | **Categories, ratified by Sumeet, 7 August.** Closed. Do not relitigate. |
| `team/index.ts` "Enterprise IT operator" | **Resolved by §4.2**: the ratified bio replaces the sentence. Delete the allow-list entry for it once the bio lands, and watch `check:terms` stay green. |
| The 10 em dashes in `content/` | No ruling received. v26's default stands: out of scope per Relay v2.2 §2, reported informational. |
| Wickes | No ruling received. Untouched, still Sumeet's. |
| `/privacy` administrator sentence | No veto received. Stands as logged. |
| R-AI3 | No veto received, now three rounds. The ruling stands: `/ai-talent` may cite a sourced, dated scarcity figure; rates stay banned. Treat as ratified by lapse and note it in the relay. |
| Heading fade on `/permanent` and `/contract` | Carried. Sumeet has not yet tried incognito. |
| CI on `af7fbf8` | Owed the moment Actions recovers. §5.4. |

## 2. The write pane — the cutover gate

Spec: **round 17 §2.3 as amended by round 18 §2.4.** Both ratified; neither reopens. The requirements, restated once so this file is sufficient on its own:

- The cockpit **opens a PR and enables GitHub's native auto-merge**. CI runs before anything publishes; Sumeet does nothing in the happy path.
- The `content/` restriction is **enforced in the commit path as well** — fine-grained tokens have no path scope (round 18 §1.3), so the PR is the backstop with CI behind it.
- **If auto-merge is disabled on the repository, report it. Never fall back to a direct push.** A direct push skips the CI that exists to stop a malformed case study breaking `main`.
- **Case-study reordering writes `content/case-studies/order.yaml`.** Never an `order` frontmatter field — that instruction was withdrawn in round 18 §1.3 because it would restore a defect a previous round removed.
- **Watch it commit.** A commit path reported working that was not watched committing is the one claim this project has ruled a session must never make.
- **Execute one real sign-in and report it.** The authenticated path has never run once. Everything anonymous is verified; this is the gap.
- **Run the client-bundle isolation assertion with the real environment.** It has never executed because no admin secrets existed where it ran. It must run once before cutover.
- A GitHub App with a narrower installation is post-cutover hardening. Not this round.

If any credential is absent or malformed at ground, stop item 1, report exactly which variable and how it failed, and proceed to item 2. Do not idle the round on it.

## 3. The assistant's customer experience

Sumeet used the assistant on 6–7 August. Three findings, his words summarised: answers are verbose; page links do not look like links; clicking one navigates the whole page to a 404 and the chat session is lost. His ruling on the links: **open in a new tab, the chat session stays intact.**

### 3.1 Links must look like links and must not destroy the session

Measured from source: `renderAssistantText.tsx` renders a bare `<a href>` and `AssistantPanel.module.css` styles `.disclosure a` only, so message-body anchors inherit body text colour and a click navigates the page, killing the panel's React state.

Ruling: style `.assistantMsg a` (underline plus accent, AA in both themes, `:focus-visible` per the interaction gate's standard); add `target="_blank" rel="noopener noreferrer"` to message-body links. The disclosure link's behaviour is unchanged. Verify in the rendered DOM in both themes.

### 3.2 The 404 — diagnose before fixing, and suspect the gate

Measured from Sumeet's report: a rendered link in a live conversation resolved to a 404. Which path is unknown. `check:assistant-grounding` was green on 30 citations the same round — **a blind-guard case: the gate checks fixture conversations, not the corpus-to-route mapping that `linkifyCitations` links from.** If a corpus entry names a path with no live route, every conversation that cites it ships a 404 the gate never sees.

Ruling, in order: **(a)** reproduce and name the failing path class — read `corpus.ts`'s path list against the real route tree and report every corpus path that does not resolve; **(b)** the class fix: corpus paths are proven against the route tree at build or in a gate, so an unroutable path can never enter the corpus; **(c)** extend the grounding gate to cover linkified output, proven red on the defect found in (a) before the fix lands. If (a) finds nothing, say so plainly and instrument the panel to log the next failing href rather than guessing.

### 3.3 Verbosity

Ruling: add a brevity rule to `CONVERSATION_DESIGN` in `system-prompt.ts` — replies default short (two to four sentences or one tight list), expand only when the visitor asks for depth, never restate the question. Reduce `MAX_OUTPUT_TOKENS` if measurement supports it; report the before/after shape rather than asserting improvement. All five `check:assistant-*` gates re-run after any prompt change; rule 7a (no em dash in generated output) must remain enforced.

## 4. The leadership page

### 4.1 Title

**Chandrashekhar Kolar's role becomes "Director of Managed Delivery".** Sumeet's instruction, 7 August, exact application of "from Head to Director". One string in `src/data/team/index.ts`; sweep for any other statement of his title (the corpus regenerates from data).

### 4.2 The bios — ratified text, ships verbatim

Sumeet supplied or ratified every fact below on 7 August. This supersedes the file's previous constraint that bios may only restate already-published sentences, and it supersedes round 18 §3's "no biography for any real named person" for exactly these five entries. **Ship the text verbatim. Any factual concern goes in the relay once, afterwards, never as a mid-round question (R-A9).** No em dash appears in any of them; keep it that way.

**Sumeet Goenka** (replaces the existing bio, and with it the last "operator" instance):
> Before founding Yallo, he was Group Chief Architect, SVP at Richemont, Chief Enterprise Architect at Landmark Group and Head of Enterprise Architecture at Alshaya EMEA, with earlier roles across Microsoft, Deloitte, Burberry, Vodafone and Oracle, spanning the UK, Europe, Middle East and APAC. The IT leader who delivered those complex transformations for 23+ years now builds your talent backbone today.

**Chandrashekhar Kolar:**
> Twenty years in enterprise solution architecture and programme delivery across TCS, ITC Infotech, Oracle, EPAM and Landmark Group, with deep retail, loyalty and customer-data work in the Middle East. Based in Dubai, he has taken complex platform programmes from architecture through to go-live, and now owns Yallo's fixed-scope Managed Delivery engagements end to end.

**Niharika Patir:**
> Fourteen years in recruitment across corporate and agency environments, with a Masters in Human Resources and Organisational Development from the Delhi School of Economics. From Bengaluru, she runs the screening and delivery operation behind every shortlist, owning the client's experience from brief to onboarding.

**Raphy Varghese:**
> An engineer by training, he leads marketing, growth and the web platforms Yallo's businesses run on. From Bengaluru, he builds the route that brings enterprise platform buyers to Yallo, and keeps it short from first contact to brief.

**Kritika Poddar:**
> She runs finance, commercial governance and the PMO across Yallo Talent's contract and delivery book. Every engagement's commercials, from rate card to invoice, run through her office.

### 4.3 The section lede

"Name, role and a link to their profile." describes the interface, which house rules ban. **Remove it.** The H2 carries the section. Do not replace it with a sentence that counts the cards beneath it.

### 4.4 The assistant's forbidden list follows the data

`system-prompt.ts` rule 4 currently restricts the four non-founder leaders to "name, role and link only". Once §4.2's bios are in the data layer and therefore the corpus, amend rule 4 so each leader may be characterised **exactly as the corpus states them, and nothing beyond** — the same standard Sumeet's entry already has. The refusal gate re-runs after the amendment.

### 4.5 What does not change

No photography, no `Person` schema beyond the four authorised fields, no invented specialism or contact route. Sumeet's card carries no LinkedIn URL in the data layer; every other card does. Flagged once here: if he supplies his URL it is a one-line data change, and it must never be derived from a name pattern.

## 5. The tail — filed in round 18 §4, now in scope

**(§5.1) P1 — the metrics generator.** `src/data/home/hero.ts` and `engage.ts` still type `"2:1"`, `"72h"` and `"50+"` beyond the quarterly refresh. Build the generator from `content/metrics.yaml` to a client-safe module with a `--check` flag, the shape `build-research-dataset.mjs` proved. Last known typed-figure drift on the site's own numbers.

**(§5.2) P1 — rendered-pixel contrast.** Source-level contrast cannot see text over a gradient (round 18 §2.2). A gate that measures rendered pixels on the templates, proven red on a synthetic failure before it is trusted.

**(§5.3) P2 — the admin panes get rendered a11y and type-scale measurement.** They are absent from the sitemap so no enumerating gate visits them, and the panes change this round with the write pane. Same standard as the public site; the "internal surface, one user" argument was already proven wrong once on `/ai-talent`.

**(§5.4) CI.** The moment Actions recovers: run on `af7fbf8` and on this round's head. The `check:visual` diagnostic answers the 2px overflow question on its first runner execution; report the answer, fix only if the cause is clear.

## 6. Forbidden this round

- **No Phase 8 work.** R-A6, unchanged.
- **No direct push from the cockpit under any failure.** §2.
- **No invented fact about any person beyond §4.2's ratified text.** Typography of the bios may not be "improved"; the text ships verbatim.
- **No touching Wickes**, no competitor names in the table, no rates anywhere. All ratified.
- **No question to Sumeet about published content mid-round.** R-A9. Factual concerns go in the relay, once, afterwards.
- **No narrowing a gate's rule to make its first run small**, and no gate trusted before it is watched failing on the real defect.
- **No `order` frontmatter field.** Withdrawn, round 18 §1.3.

## 7. Open with Sumeet after this round

1. His own LinkedIn URL for `/leadership` (one line, optional).
2. Wickes: retire the row or supply the asset.
3. The heading fade: try incognito on `/permanent` and `/contract`.
4. One client's yes for an attributed testimonial (name, initial, company) — the benchmark's cheapest credibility upgrade, still absent sitewide.
5. Real procurement questions for platform-page FAQ blocks — the highest-value retrieval surface not yet built; questions must be sourced, never invented.
6. Go-live date and production `RESEND_*` with SPF and DKIM — Raphy's, with the cutover.
