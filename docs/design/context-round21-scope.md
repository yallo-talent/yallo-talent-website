# Context — Round 21: the designed PDF, the calibrated assistant, and the redirect map

**v1.0 · 7 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Standing rules: `context-round13-scope.md` §8 as amended by round 17 §1.1 (R-A9). Single session, one port (3115).

**The theme.** Sumeet tested the gated research download and the assistant on the evening of 7 August and filed two defects; both are conversion-surface quality failures on the site's proof assets. Alongside them sits the one unverified cutover blocker: the game plan §7 redirect map. Cutover is planned as Sumeet-executed against `CUTOVER-RUNBOOK.md` immediately after this round is green.

---

## 1. Round 20 adjudication

Relay v28 read in full. **Accepted in its entirety**, including all seven delegated decisions and the two deliberate returns. The eight retractions are the discipline working; the pattern Code itself named — three results stated ahead of their evidence — is recorded here so it is checked against, not repeated: **no result is stated in relay v29 before its evidence exists.** The `repoSlugFrom` widening, the comment-preserving serialiser and the fresh-server CI fix are all specifically ratified. Branch protection returned to Sumeet and is being set (require the `checks` context; administrators not enforced). Page of origin returned to Chat and is ruled in §4. Phase 8 stays red by ruling until measured on the production host (runbook Phase 3.7).

## 2. The research PDF becomes a designed document

Sumeet's ruling, 7 August: the current PDF is a print of the web page and unacceptable as a proof asset; it must read as a designed publication. Reference standard: the front-of-house polish of a large consultancy's research PDF, executed in Yallo's own system, not theirs.

### 2.1 The template

One PDF template for the research family, in the design system throughout:

- **Cover page**: title, the petal signature, PetalPlate-derived art keyed to the piece's slug, "YALLO TALENT", the source-and-date line, yallo.co. No body text.
- **Running furniture**: header or footer per page with the piece title, page number, and `yallo.co`. The current output's mid-line page-number artefacts ("Yallo Talent · yallo.co 3" jammed into prose flow) must be impossible by construction.
- **Typography**: the print adaptation of DESIGN.md — Newsreader display, Inter body, IBM Plex Mono strictly for data labels; the type floor holds; real margins; no orphaned headings; footer text never breaks mid-word.
- **Charts as designed graphics**: every figure currently rendered as prose percentages gains a proper chart where one aids the reading — bar and dot-plot forms in the token palette. **Every chart derives from `src/data/research/dataset.ts` at build; no value is ever retyped.** Charts respect the corpus's own rules: no two families on one axis, overlapping shares never drawn as parts of a whole.
- **Closing page**: the brief CTA (programme-shaped, per canon), the four-city footprint, and the §2.2 colophon. The web page's full footer navigation does not belong in a document and goes.
- **The navigation chrome goes entirely**: no header nav, no "Ask Yallo Talent" launcher text, no footer link columns — the current output carries all three.

### 2.2 The caveats become a colophon — Sumeet's ruling, with the concern stated once

Sumeet ruled (7 Aug): "What this does not tell you" and the block-capital declaration are removed from the PDF and replaced with a subtle, polished line. R-A9 carve-out, stated once, after the work: those caveats are what make the document's claims checkable, and their substance therefore survives in refined form rather than vanishing. **The web page is untouched** — this section governs the PDF only.

Ratified replacement, shipping unless vetoed — a quiet colophon on the closing page, small type, no box, no capitals:

> **About this measurement.** Figures are drawn from a LinkedIn Talent Insights extract read on 2 August 2026 and describe the supply side of three markets at that date. Skills are self-declared and counts within a family overlap. Read alongside a firm's own placement data — ours informs the desks behind this document.

The cover carries one line: `Source: LinkedIn Talent Insights · read 2 August 2026`.

### 2.3 Implementation

Code's choice of mechanism (a dedicated print-designed route rendered headless, or a document library), judged on: deterministic output at build time, embedded fonts, vector charts, and no dependency on a third-party service. The PDF regenerates whenever the dataset or template changes; a stale binary can never ship. Verify the rendered output by reading actual pages as images, not by trusting the generator's exit code.

### 2.4 The delivery surfaces get real controls

The download link after gate-completion and the "Get the synthesis" submit both render as body text. Fix as the class, third occurrence of it (assistant links, then these): **every interactive element on the intelligence and research surfaces** styled as a control per the design system — underline-plus-accent for links, the ratified button treatment for submits, `:focus-visible` throughout, AA in both themes. Extend the rendered interaction gate to cover the gate-form states (pre-submit, post-submit, download) so an unstyled control on these surfaces cannot recur.

## 3. The assistant, calibrated

### 3.1 Link labels

The homepage citation renders as a bare `/`. Root cause class: a corpus path without a display title falls through to the raw path as its label. Fix: every corpus entry carries a human label; `/` is "the homepage"; a rendered link whose label is a bare path fails `check:assistant-links`. Sweep all corpus entries, not just root.

### 3.2 Length, recalibrated — Sumeet's ruling

The round 19 brevity rule overcorrected: replies are now too thin for substantive questions. Replace the flat rule with calibration: **concise by default (two to four sentences), complete when the question warrants it** — a multi-part or how-does-it-work question gets a full answer (up to two short paragraphs or one tight list); never restate the question; never pad; never truncate substance to hit a length. Measure before/after on the round 19 five questions plus two genuinely complex ones (a screening-process question and a multi-market comparison); report the distribution, not just the mean. All five assistant gates re-run; 7a holds.

## 4. Page of origin — Chat's ruling on the returned decision

**Capture it.** Pathname only: the page on Yallo's own site where the panel was opened — no query strings, no external referrer, nothing beyond the path. Rationale: it is proportionate to data already held (the transcript itself), it is what makes the shipped origin filter real, and it changes triage materially. Migration adds the column; the panel sends `location.pathname` at conversation start; existing rows stay null and the pane says "before 8 August 2026" for them. Retention and purge unchanged — origin lives and dies with its transcript. **One clause added to `/privacy`'s description of a recorded conversation ("...including the page on our site where the conversation started"), logged for Sumeet's veto per R-A9.**

## 5. The redirect map — the cutover blocker

Verify whether game plan §7's redirect map is implemented in the app (next.config redirects, middleware, or otherwise). Measured, not assumed. Then:

- If absent or partial: implement the full §7 table — every 301 in one hop, the "never 301 to the homepage" rule respected (the `/home-4/` → `/` entry is the deliberate exception, ruled in the game plan), `/white-papers/` → `/insights`, the double-slash retail defect handled, `/?case-study={slug}` query pattern included.
- The gate: walks every legacy URL in the table against the running server and asserts exactly one hop to the mapped target, and separately asserts **no internal link on the site resolves through any redirect** (the discoverability scope §8 rule). Red-proven by breaking one mapping first.
- The table lives in one data file the gate and the config both derive from; the map is never maintained in two places.

## 6. Readiness addendum

Update `docs/status/CUTOVER-READINESS.md`: the redirect gate's result, the PDF regeneration mechanism, the assistant recalibration measurements, the origin migration, and the runbook cross-reference (`CUTOVER-RUNBOOK.md`, Sumeet-executed). Re-run the full gate table after the last source change; CI on final HEAD; anything red named with its owner.

## 7. Forbidden this round

- **No web-page caveat changes** — §2.2 governs the PDF only; "How to read these numbers" and "What this does not tell you" stay on the routes.
- **No chart value typed by hand**; every figure derives from the dataset. No chart placing two families on one axis; no overlapping shares drawn as parts of a whole.
- **No third-party PDF service.**
- **No result stated in the relay before its evidence exists** (§1).
- **No em dash in assistant output** (7a) or site copy; UK English; canon vocabulary.
- **No touching Sumeet's uncommitted files**; explicit commit paths.
- **Scope closed**: nothing beyond this file; cutover items belong to the runbook, not this round.

## 8. Open with Sumeet after this round

The runbook's Phase 0 gates (Resend domain verification foremost), Wickes, the testimonial ask, and the go-live moment itself.
