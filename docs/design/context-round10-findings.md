# Round 10 findings log — Session B

Working log for the nine-page close-out loop, `context-round10-scope.md` §4.
Rubric and severity order per `context-round9-scope.md` §6, carried forward
unchanged. Close-out lines appended at the end of each page's section.

---

## 1. `/` — homepage

**Method note.** Impeccable ran single-context per the round 9 ruling now
standing protocol (`context-round10-scope.md` §1): no dual sub-agent, no
interactive questions, direction already ratified by canon and `DESIGN.md`.
`CONTEXT_STALE` reported once at session start (`.impeccable/design.json`
stale against `DESIGN.md`), not acted on.

### Render and score

Rendered via the repo's own `scripts/capture-home.mjs` (full-page, both
themes, desktop 1280 and mobile 360, device-scale 2x) rather than the
browser-pane tool, which hit the documented deep-scroll artifact on this
page (22,038px tall at 2x): a duplicated sticky header mid-capture. Verified
by computed style that the live DOM holds exactly one `<header>`
(`position: sticky`) — the duplication is a Chromium tiled-screenshot
limit on oversized captures, not a rendered defect. Consistent with the
prior "black beyond ~9,000px" tool artifact already on file; not
re-diagnosed further.

Sampled hero, gap/quotes, stats, process, role coverage, commitment,
where-we-place, evidence carousel, start-here CTA and footer in both
themes, plus mobile hero.

### Findings

No honesty, accessibility, correctness, IA or completeness defects found.
Two items checked and confirmed non-issues rather than logged as open:

1. **[Checked, not a defect]** The "SHORTLIST IN PROGRESS" hero mockup
   card renders as a fixed dark panel in both light and dark theme. This
   is the deliberate product-mockup pattern (a simulated dashboard
   screenshot), not the page's own theme failing to apply — confirmed by
   inspecting the card in light theme where the rest of the page correctly
   inverts around it.
2. **[Checked, not a defect]** Three "IN PREPARATION" tags (AI practice,
   Programme Staffing Blueprint, AI Talent Atlas) read as status labels on
   real, named, in-flight initiatives explicitly out of scope for round 10
   (`context-round10-scope.md` rules: "Blueprint, insights, DNS, Volcanic:
   out of scope"; round 9 ruling: the AI Talent lane is a separate
   consumer). Distinguished from the forbidden "coming soon" pattern
   (`context-round9-scope.md` §7), which targets placeholders standing in
   for missing content on a page that should already be finished — these
   labels state true status on cross-links to work genuinely in progress
   elsewhere, and do not claim the homepage itself is incomplete.

Footer's "Yallo AI Academy — LAUNCHING" marker left exactly as is per
`context-round10-scope.md` §11.6 — logged there, not actioned here.
Footer's Industries column and `MotionConfig reducedMotion="user"` also
left untouched per §11.5.

### Gates run

`node scripts/capture-home.mjs` (PORT=3207) — all visual and markup
assertions passed, including server-rendered (no-JS) markup and
prefers-reduced-motion · `check:a11y --base http://localhost:3207` — axe
clean, 1 exemption applied (ghost numerals, pre-documented) · `check:reflow`
— no horizontal overflow, 22 routes x 2 themes at 320/360px · `check:motion`
— reduced motion honoured on every animated route · `check:rendered-type`
— clean, 14 templates x 4 widths · `check:terms` — clean, 240 files ·
`check:prose` — clean · `check:contrast` — 32 token pairs + 6 composites,
all AA · `check:yallo-case` — 131 internal links resolve, casing correct
across 19 pages · `check:marks` — all logo ink areas within tolerance,
worst deviation 12.8% (Chalhoub Group rail mark, under the ±13% band).

All of the above are site-wide gates (the repo has no homepage-only
variant for several of them); homepage is one of the routes each one
covers.

### Close-out

`/` closed with no code changes required. No commit — nothing changed.
Logged here as the close-out record per step 9 of the loop.

---

## 2. `/why-yallo`

**Guarantee wording.** The comparison table's six rows (`comparison` array in
`src/app/why-yallo/page.tsx`) are the frozen claims per
`context-round10-scope.md` §11.3 — including "Free replacement search on
same 72h SLA", the ratified, non-time-boxed version of the guarantee
`/contract` now defers to. **Not one character of any `them`/`us` string
was touched.** Only the surrounding markup changed.

### Findings

1. **[Accessibility, closed]** The comparison table was two parallel
   `<ul>`s laid out side by side with CSS grid, relying entirely on visual
   position for a screen reader user to infer that row *n* on the left
   pairs with row *n* on the right — no structural association existed.
   Confirmed the specific legacy concern named in scope (§11.3, "the
   legacy used image ticks") did not survive: no image-based tick marks
   anywhere in the current markup, plain text only. But the pairing defect
   itself was real and undocumented. **Fix:** rebuilt as a real `<table>`
   in `src/app/why-yallo/page.tsx`, with `<caption>` (visually hidden),
   `<th scope="col">` for each side, and one `<tr>` per comparison pair —
   same copy, same visual two-tone card look, now with genuine
   row/column semantics. New styles live in a page-local
   `src/app/why-yallo/comparison.module.css` (not the shared
   `EditorialLayout.module.css` — see the logged item below).
2. **[Accessibility, closed]** At 360px the old two-column grid crushed
   each list into a ~170px column, wrapping five- and six-word rows
   across four or five lines each — technically no horizontal overflow
   (`check:reflow` passed throughout), but a real readability defect
   `check:reflow`'s overflow-only check doesn't catch. **Fix:** the table
   now scrolls horizontally on narrow viewports inside a
   `role="region"` wrapper, `min-width: 560px` on the table itself, so
   no cell is ever crushed. First pass shipped the wrapper without
   keyboard access; `check:a11y` caught it immediately
   (`scrollable-region-focusable`, serious) — added `tabIndex={0}` and
   `aria-label`. Re-ran clean.
3. **[Design, logged for Session A, not actioned]** `.sectionAlt` in the
   shared `src/components/blocks/editorial/EditorialLayout.module.css`
   composes `band-dark` — a *permanently* dark surface, identical in both
   themes (confirmed by computed style: `rgb(14, 15, 17)` in both light
   and dark). It is used here for the differentiators and credentials
   sections, which sit between the hero and the plain `.section`
   (theme-relative, transparent, inherits page background). In **light**
   theme this alternates correctly: dark / dark / light / dark / dark. In
   **dark** theme, the plain `.section`'s inherited background resolves
   to the exact same `rgb(14, 15, 17)` — confirmed by reading
   `getComputedStyle(document.body).backgroundColor` against the
   section's own computed background — so all five sections render as one
   undifferentiated dark surface with no rhythm at all. This is not the
   Two Band Rule (`DESIGN.md` line 387, which governs `.band-invert` and
   is unaffected — no `.band-invert` is in use here). It is `.sectionAlt`
   reaching for `band-dark` — documented in `globals.css` as reserved for
   "the page footer, the closing CTA, and the L1/L2/service hero
   plates" — for a job that calls for theme-relative alternation instead.
   **This shared component is used by four of my nine pages**
   (`/why-yallo`, `/about`, `/leadership`, `/jobs`, per `grep -rl
   "editorial/EditorialLayout" src/app`) plus `/insights` (out of scope).
   Per `context-round10-scope.md`'s ownership rule, `src/components/**` is
   Session A's territory; not touched here. **Logged, not fixed. Exact
   ask for A: should `.sectionAlt`'s mid-page use compose `band-invert`
   instead of `band-dark`, reserving `band-dark` for `.hero` and
   `.bottomCta` only?** This affects every page built on this shell in
   dark theme, not just `/why-yallo`.

### Gates run

`pnpm build` (NEXT_DIST_DIR=.next-b-r10) clean · `tsc --noEmit` clean ·
`check:a11y --base http://localhost:3207 --routes /why-yallo` — axe clean,
2 themes x 2 widths (first pass caught the keyboard-access regression
above; second pass clean) · `check:reflow --routes /why-yallo` clean ·
`check:motion --routes /why-yallo` — reduced motion honoured · `check:
rendered-type` clean, 14 templates x 4 widths · `check:terms` clean, 241
files · `check:contrast` — 32 token pairs + 6 composites, all AA.

### Close-out

`/why-yallo` closed. Guarantee table wording untouched and verified
unchanged by diff. One shared-component defect logged for Session A
(item 3 above) rather than fixed, per the ownership boundary.

---

## 3. `/case-studies` and `/case-studies/[slug]`

Rendered the list template and one detail template
(`oracle-hyperion-financial-management-hfm-implementation`, representative
of the ten verified studies) across both themes, desktop and mobile.

### Findings

No honesty, accessibility, correctness, IA or completeness defects found.
Filter chips (pillar/platform) work off `taxonomy.ts` derivation, not
hand-typed labels. Detail template's Context/Challenge/Approach/Outcome
structure carries no invented metrics or claims beyond what each MDX body
states — consistent with `check:cs-excerpts` passing (every proper noun in
a summary/excerpt is verifiable against the body). PetalPlate divider
graphic between sections, no photography. Client logo consent remains the
known open item (§9.2.1 of `context-round10-scope.md`), not actioned here.

### Gates run

`check:a11y --routes /case-studies,/case-studies/[slug]` — axe clean, 2
routes x 2 themes x 2 widths · `check:reflow` clean · `check:motion` —
reduced motion honoured · `check:cs-excerpts` — 10 case studies checked,
clean · `check:yallo-case` — 131 internal links resolve, casing correct.

### Close-out

Both templates closed with no code changes required. No commit — nothing
changed.

---

## 4. `/brief` — the site's only conversion surface

Territory note: `BriefForm.tsx`/`BriefForm.module.css` live under
`src/components/blocks/**`, nominally Session A's per
`context-round10-scope.md` §4. Confirmed single-consumer
(`grep -rl "BriefForm" src/app/` returns only `src/app/brief/page.tsx`)
before editing — nothing to fork, no other page to conflict with at
merge. Edited directly rather than logged, given §5's explicit
instruction to test and fix this page's failure paths.

### Findings

1. **[Accessibility, closed, serious]** `check:a11y` found the whole form
   section failing contrast in **light** theme: labels and the legend at
   1.72:1 (need 4.5:1), the h2 at 1.07:1 (need 3:1, effectively
   invisible), the submit button also failing. Root cause: `.section` set
   `background: var(--black-950)` by hand (a literal permanent-dark
   token, correct in itself — it resolves to the same `--dk` value
   `.band-dark` uses) but did not compose `.band-dark`, so the Layer 2c
   aliases (`--fg`, `--fg-muted`, `--fg-subtle`…) stayed resolved against
   the *light* register while sitting on a dark ground — the exact bug
   class `globals.css`'s own comments describe as already found and
   fixed on `EditorialLayout.module.css`'s `.hero`/`.bottomCta`. Not
   previously caught because nothing had run `check:a11y` against
   `/brief` specifically. **Fix:** `.section` now composes `band-dark
   from global` and the redundant hand-set `background` was removed.
   Re-ran `check:a11y --routes /brief`: clean, 0 violations, both themes.
2. **[Accessibility, closed, serious]** Submitting the form with any
   field empty produced visible red error text per field but nothing a
   screen reader would ever hear: no `aria-invalid`, no
   `aria-describedby`, no `role="alert"` on the error text, no
   `aria-live` region on the status message, and focus stayed on the
   submit button rather than moving to the first invalid field. Verified
   directly (not assumed) by reading computed DOM attributes before and
   after a blind empty submit. **Fix:** every field (`Field` component,
   the region `<select>`, the message `<textarea>`, the engagement
   radios) now carries `aria-invalid`/`aria-describedby` wired to a
   `role="alert"` error span with a stable id; the engagement radio group
   is now a real `<fieldset>`/`<legend>` rather than a `<div>` with a
   floating `<label>`; the status paragraph carries `role="status"
   aria-live="polite"`; and validation failure moves focus to the first
   invalid field. Re-verified: empty submit now reports `aria-invalid`,
   `aria-describedby`, `role="alert"`, `role="status"`/`aria-live`, and
   `document.activeElement` on the first errored field, all present.
3. **[Correctness, closed]** `message` had no upper bound in
   `briefFormSchema` (`src/lib/schemas.ts`) — inconsistent with the
   sibling `cvUploadSchema.message`, which already caps at 1000. Pasting
   6,000+ characters programmatically (bypassing the browser's native
   paste-truncation) submitted successfully with no feedback, forwarding
   an unbounded string into the API's HTML email body. **Fix:** added
   `.max(4000, …)` to the schema (defence in depth — catches direct API
   calls, not only browser paste) and `maxLength={4000}` on the textarea
   (native truncation on normal typing/paste, so most users never see the
   error). Verified both layers independently: native maxLength truncates
   a real paste; the schema still rejects a value set past the cap by
   direct DOM manipulation, exactly the no-JS/direct-POST case the schema
   guards.
4. **[Correctness, logged, not fixed]** **No-JS path does not exist.**
   Confirmed by reading the server-rendered HTML directly
   (`curl … | grep '<form'`): the `<form>` has no `action` and no
   `method` attribute. Per §11.4, this is explicitly "a finding, not a
   pass" rather than a mandate to rebuild. With JavaScript disabled,
   clicking submit falls back to the HTML default — GET to the current
   URL — which reloads `/brief` with every field value appended as a
   query string, submits nothing to `/api/brief`, and shows no
   confirmation and no error. The user cannot tell the difference between
   success and total failure. **Not fixed this round**: closing this
   properly means either a classic `method="POST" action="/api/brief"`
   submission with a server-rendered success/error response (the current
   API returns JSON, not HTML, so it would need a second code path or
   content negotiation) or a Next.js Server Action — either is a real
   architecture change to the only conversion surface on the site, higher
   risk than the scope of a refinement round with five page-groups still
   open. **Exact question for Sumeet: is a no-JS fallback for `/brief`
   worth a dedicated follow-up round, given the audience (CHRO/programme
   director on a corporate laptop) makes JS-disabled traffic unlikely but
   not zero?**
5. **[Checked, not a defect]** Success state renders correctly ("Thanks —
   we'll be in touch within one working day."), form resets, and the API
   route degrades gracefully with no `RESEND_API_KEY` set (logs and
   returns `{ok:true, delivered:false}` rather than erroring) — confirmed
   in this session's local run, which has no key configured. No
   invented delivery guarantee, no fabricated turnaround claim beyond
   what was already live.

### Gates run

`pnpm build` clean · `tsc --noEmit` clean · `check:a11y --routes /brief`
— axe clean, 2 themes x 2 widths (first pass caught the contrast defect
above; second pass clean) · `check:reflow` clean · `check:motion` —
reduced motion honoured · `check:contrast` — 32 token pairs + 6
composites, all AA.

### Close-out

`/brief` closed. Two serious accessibility defects fixed and verified by
re-running the gate that first caught each one. One correctness gap
(message length) closed with layered validation. One architectural gap
(no-JS path) logged with the exact question rather than actioned, per
§11.4's own instruction that this is a finding, not a required fix.

---
