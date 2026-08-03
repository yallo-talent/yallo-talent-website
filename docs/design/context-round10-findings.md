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
