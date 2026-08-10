# Context - Round 26: the editorial cockpit, the funnel, and closure

**v1.1 - 9 August 2026 - Chat lens - Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` as amended, `DESIGN.md`, and `docs/design/context-cockpit-v3.md` (the ratified cockpit spec; its round-26 clause in §11 is this round's funnel scope). This is the final planned build round. Sumeet hands the cockpit to Raphy on Monday morning, 10 August. v1.1 adds R-26.5 (the Substack bar, ruled with a reference screenshot) and §2A (block architecture for the long-term content engine).

## 1. Rulings, all given by Sumeet on 9 August

**R-26.1 - Validation never blocks. Anything. This supersedes cockpit-v3 §7's refusal list and round 25c's two-rule split.** Every validation rule (sources, terminology, rates and fees, internal links, answer-first, all of them) runs live and inline while the writer types, naming the exact text, as warnings and suggestions only. Saving is never impeded. Publishing is never refused by a validation rule. The publish action presents one sheet listing any outstanding warnings and publishes on a single confirm; that sheet is information, not a gate. Detection stays at full strength: every existing assertion about what the rules FIND must keep passing; what changes is only that nothing refuses. The nightly re-validation sweep becomes the safety net and its findings must surface prominently in the cockpit (a notices strip on the relevant pane), because it is now the only thing standing between a warned figure and a reader. Consequence recorded for the register, not for debate: an unsourced figure or a rate can now reach the public site past a warning. The unpublish guard (refusing a status change that would 404 a legacy-redirect target) is link integrity, not validation, and is unchanged - but its refusal message must read as a clear explanation with the one action that resolves it.

**R-26.2 - The sign-in flake is fixed by a readiness probe, not a third retry.** v36 §8.4 evidenced it firing on the first context of concurrent runs. The gate waits on a readiness check before its first sign-in POST. Fix the class: every browser gate that signs in gets the same probe.

**R-26.3 - Impeccable hook: scoped ignore for `public/signature.html`**, rationale recorded in the ignore entry (email clients cannot resolve CSS variables; Arial/Helvetica is the email-safe stack; sizes are ratified verbatim). The raw-colour gate's scope is unchanged (stays off `public/**/*.html`).

**R-26.4 - Merge and deploy are delegated to this session**, extending the D25c-9 precedent, on strict conditions: the full gate suite green in one process, merge-tree clean against `main`, deploy watched to ACTIVE, and a production smoke (read-only) green afterwards. If any condition fails, stop with the branch pushed and do not merge. Production content decisions remain human: no session publishes, unpublishes, or edits any article or case study row beyond what §4 explicitly repairs.

**R-26.5 - The editor's bar is Substack's own composer, ruled against a reference screenshot (9 Aug).** The register to match: a clean full-width writing canvas; Title and Subtitle as large placeholder fields at the top of the canvas (subtitle maps to the existing summary field, one value, no duplicate storage); byline shown as applied by the system, not editable; a persistent top formatting toolbar (style dropdown, bold, italic, strikethrough, inline code, link, image, embed, lists, blockquote and the Yallo blocks menu) IN ADDITION to the floating selection toolbar and slash commands; a live Saved pill; Preview and a primary Continue-style action in the top right that leads into the publish sheet. Long-term intent, recorded so the architecture serves it: Sumeet's roadmap is a Bloomberg-class content engine for the talent business - audio and podcasts, own video, reshared YouTube video, images, carousels. Round 26 does NOT build audio or video hosting (that is transcoding and storage infrastructure, out of scope for one night and said so plainly); round 26 DOES build the block seam that makes each of those an additive block type later. See §2A.

**Standing rule, promoted from the signature round:** no browser-measurement result counts until the harness passes a known-positive control. A red or green from an uncalibrated instrument is not a result.

**Ratified for the record:** canon A5's route clause is amended - the third pillar is Capabilities in public (`/insights/capabilities/{slug}`), `discipline` stays the column name. Sumeet coined this mid-round-25c; treat as ratified.

## 2. Item A - The editorial cockpit, to the Substack bar

Sumeet's verdict on the current cockpit, verbatim in substance: clunky, confusing, old-school controls, nowhere near Substack; he struggled to work out the draft, update, publish, unpublish workflow. That is the defect. The bar is R-26.5 plus cockpit-v3 §4's line: a writer never wanting to draft somewhere else first - and an operator never wondering what state a piece is in or what the next action is.

**A1 - Lifecycle legibility (the workflow complaint, fix first).** Every article and case-study editor gets a persistent header rail: status pill (Draft / Published / Archived), live Saved pill, and exactly one primary action for the current state (Draft: Continue into the publish sheet; Published: Update; everything else in an overflow menu: Unpublish, Archive, Move URL, View live). Preview one click, always. A first-run empty state on each pane that explains the lifecycle in two sentences. The publish sheet per R-26.1: warnings listed, one confirm, live in seconds, with the live URL shown on success.

**A2 - The canvas and the drawer.** The long scroll of metadata dies. The writing canvas is the page, per R-26.5: Title and Subtitle placeholder fields, system byline line, persistent top toolbar, body at a generous measure in the design system's faces. Taxonomy, SEO, social card, URL and History move into a right-hand drawer with grouped sections, opened from the header rail. Character counters live where the field is.

**A2A - Block architecture (the seam for the content engine).** Every body block is a typed TipTap node rendered server-side through the existing allow-list renderer. This round adds one embed node: **YouTube**, stored as the video id, rendered privacy-enhanced (`youtube-nocookie.com`), lazy-loaded, with a required caption-or-context field. The node and renderer registry must make the next block types - audio, native video, carousel - additive: a new node, a new renderer entry, no migration of existing bodies. Record the registry seam in a short `spec/` note so a future round starts from it. An image-gallery/carousel block is a stretch item (§4a): attempt only after D is closed.

**A3 - Controls and register.** Replace raw checkboxes with the design system's chip/tag toggles; consistent field heights and focus states; IBM Plex Mono retreats to identifiers and timestamps only; labels move to Inter. The full-width gold "Save fields" slabs are replaced by the drawer's own compact save affordance. History renders as a compact timeline (timestamp, author, character delta, Preview and Restore) rather than stacked full-width cards.

**A4 - The Impeccable loop, across the whole cockpit.** Run the impeccable critique skill against every pane - Articles, Case studies, Media, Briefs, Conversations, Users - and iterate each to zero critical and zero high findings. Both themes, 360px and 1280px. The cockpit is an editorial product Raphy's team lives in daily; it should look like the publication it produces (cockpit-v3 §4, last bullet). All existing gates stay green throughout: `check:admin-render`, `check:editor`, roles, a11y, contrast, reflow.

**A5 - Media inside the flow.** Image insertion from the library and by upload directly inside the editor via the toolbar's image control (the media pane exists; the writer should never leave the piece to use it). Alt text at insert stays a required field on the insert dialog, because an empty alt is a rendering defect, not an editorial judgement. Usage counts in the library update from body references as already built.

## 3. Item B - The funnel (cockpit-v3 §11 round 26, ratified 9 Aug)

Briefs and conversations become a working lead surface aligned to lead-funnel and customer-acquisition thinking. The `submissions` capture table stays append-only as the backstop; funnel state lives beside it (sidecar table keyed to submission id), so capture integrity and pipeline state never contend.

- **Pipeline states** on briefs: New, Contacted, Qualified, Won, Lost - one click to move, current state visible on the card, filterable. Default view: actionable first (New and Contacted, oldest SLA first).
- **Owner**: assignable from the cockpit's user list (ops and admin roles), shown on the card.
- **SLA clock**: elapsed time since submission against the 72-hour shortlist commitment, colour-stepped as it ages. This is the commitment the site publishes; the funnel pane is where it is kept.
- **Lead cards, not JSON.** Parsed fields rendered as a card: name, company, role/platform, region, engagement, message, source, email-delivery state. The raw payload stays behind a disclosure. Mailto and copy actions on the card.
- **Conversation linkage** both ways: a brief carrying a `transcriptId` links to its conversation; a conversation that produced a brief links back.
- **Filtering, search, saved views** on both panes (state, owner, source, platform, date). Filter state in the URL, as `/insights` already does.
- **Export** current view to CSV, admin and ops.
- **Origin analytics**: a rollup on the Conversations pane - conversations and briefs by page of origin - answering which pages start conversations. Data exists from 8 August onward; say so on the panel rather than inferring backwards.
- **Notification on arrival** already exists via the delivery email; verify it names the cockpit URL of the new brief, add it if not.
- RBAC per cockpit-v3 §10 unchanged: ops reaches briefs only. Update the hand-maintained role matrix in `e2e/roles.spec.ts` deliberately (the 25c §12a lesson) for any pane or route this round adds.

## 4. Item C - Hygiene and closure

1. **`check:signature-gif`**: a gate that re-runs the signature GIF generator deterministically and compares against the committed file, failing on drift (v36 relay open item 4, accepted). Wire into CI's full lane.
2. **Readiness probe** per R-26.2, applied to every signing-in browser gate.
3. **Impeccable scoped ignore** per R-26.3.
4. The three case-study rows 25c repaired and the nine studies' empty taxonomy are content: do not touch. The 21 unpublished articles: do not publish. Both are Raphy's from Monday.

### 4a. Stretch, strictly after D
An image-gallery/carousel block on the §2A seam, proving the seam by being additive. If time does not allow, its absence costs nothing: the seam note in `spec/` is the deliverable that matters.

## 5. Forbidden

- No invented people, clients, metrics, quotations, dates or example leads. Fixtures in tests only, clearly fixture-named, never written to the live database.
- No em dashes in any authored copy or UI string. UK English. Canon §2 vocabulary rules apply to every UI string this round writes.
- No new runtime dependency without recording it as a delegated decision with its reversal.
- No schema change to `submissions` itself; sidecar only.
- No weakening of any gate. R-26.1 changes what refuses, never what detects.
- No audio or video hosting infrastructure this round (R-26.5 scopes it out by name); the YouTube embed node is the only embed.
- No deploy without the R-26.4 conditions met in full.

## 6. Overnight discipline

Single session, five to six hours, unattended, run under caffeinate. Priority is strict: A before B before C-alongside-A1 before D, because Monday's handover is editorial first. Within A: A1 lifecycle first - it is the named pain. Commit per completed sub-item with explicit paths. Run the full suite in one process before the PR (the 25c §12a lesson: cross-spec defects only appear together). If the error rate rises late, stop between items with everything behind you finished, push, and relay honestly what was not reached - an unfinished B with a flawless A is a better morning than both at 90%. Relay to `docs/relay/v37.md`: shipped, not reached, retractions (required even if empty), delegated decisions with reversals, open items with unblocking questions, risks, HEAD and gate exit codes, and the deploy id watched to ACTIVE if merged.
