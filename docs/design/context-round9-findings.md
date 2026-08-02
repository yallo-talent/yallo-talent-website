# Round 9 findings log

Working log for the close-out loop. One heading per page/surface, findings scored
against §6 of `context-round9-scope.md`, closed in severity order. Close-out lines
appended at the end of each surface's section.

---

## 0. Global chrome — header, mega menu (§5), footer

**Method note.** Impeccable's `critique`/`audit` ran single-context (no sub-agent
Task tool exposed in this environment for a self-spawned isolated pass) and
skipped the interactive Ask-the-User step — the round's own §10 loop and §6
rubric already set fix priority across 14 pages, and stopping for 2-4 questions
per page would fight the closure discipline. Declaring this rather than running
it silently degraded, per the command's own protocol.

### Findings

1. **[Design/layout, closed]** Mega panel eyebrow, its rule (border-bottom) and
   its list items did not share one left edge. Measured the DOM (not any
   document): `.megaColHeading` and `.megaLink` each carried their own 10px
   `padding-left`, while `.megaDescription` carried 12px — three hand-typed
   values. Border-bottom draws at the box edge, outside padding, so the rule
   under each eyebrow rendered flush with the raw column edge, 10-11px left of
   the eyebrow text it sits under. Reproduced on Specialisms (3 columns),
   How-we-work, Evidence and Intelligence panels, at 1280 and 1440, both
   themes. Fix: one token, `--mega-inset`, applied once at `.megaCol` and
   referenced by `.megaDescription`; removed the redundant per-element left
   padding from `.megaColHeading` and `.megaLink`. Re-measured: eyebrow, rule
   and list-item text now agree to within 1px (sub-pixel/font rendering) at
   both widths, both themes, all four panels.
2. **[IA, closed]** Evidence and Intelligence mega-menu columns were both
   headed "Explore" (`nav-config.ts`) — the only two single-column groups that
   didn't carry a distinct heading (Specialisms: Platforms/Capabilities/
   Industries; How we work: Engagement). Renamed to "Evidence" and
   "Intelligence" respectively, reusing each group's own existing `label`
   field rather than authoring new copy.
3. **[Honesty, closed — §4]** Mega-menu EOR descriptor read "UAE visa + India
   payroll cover", omitting Saudi Arabia and asserting a per-country mechanism.
   Created `src/data/services/eor-countries.ts` as the one ratified index
   (UAE, Saudi Arabia, India — country names only, no per-country service
   claim per §4b). Mega-menu descriptor now derives from it: "UAE, Saudi
   Arabia, India". The same index is the one source for the `/eor` page
   rework (task order item 4).
4. **[Correctness, verified]** All 12 static mega-menu/footer hrefs resolve
   200 against the fresh build. Footer already derives its Industries column
   from `sectorNavEntries()` (one index, no hand-typed taxonomy) and renders
   the unpublished "Yallo AI Academy" family link as inert text with a
   "Launching" marker rather than a dead anchor — both already correct,
   no change needed.
5. **[Accessibility, verified]** `MotionConfig reducedMotion="user"` wraps the
   app (`MotionProvider.tsx`), so the mega panel's Framer Motion fade
   already honours `prefers-reduced-motion` — confirmed by `check:motion`.
   `check:contrast` (32 token pairs + 6 composites) and `check:a11y` (axe,
   both themes, 360/1280) both pass clean on `/`.
6. **[Out of scope, logged]** `npx eslint src` surfaces 35 pre-existing errors
   elsewhere in the tree (`NavBar.tsx` pathname-effect setState-in-effect,
   `ThemeToggle.tsx` same, unescaped entities in `L1HubShell.tsx` /
   `ServicePageShell.tsx`, a `module` variable assignment in
   `data/platforms/derive.ts`). None are in files this pass touched or were
   introduced by it (confirmed: `nav-config.ts` and `eor-countries.ts` lint
   clean). Pre-existing lint debt, not named in the round-9 scope doc — logged
   for a dedicated lint pass rather than fixed here as scope creep.

### Gates run

`tsc --noEmit` clean · `eslint` on touched files clean · `check:contrast` 32
pairs + 6 composites, all pass · `check:terms` 239 files clean · `check:taxonomy`
clean (205 files; 2 pre-existing "inert label" notes in unrelated data files,
not failures) · `check:a11y --routes /` clean (axe, 2 themes x 2 widths) ·
`check:motion` clean (reduced-motion honoured on 3 sampled routes) ·
`check:reflow` clean (22 routes x 2 themes x 320/360px, no horizontal overflow)
· `check:gate-coverage` clean (every rendering unit with a live URL visited by
≥1 gate).

### Close-out

Global chrome closed. Mega-menu alignment fixed and re-measured (DOM, not
screenshot, after the Browser pane's screenshot tool became unreliable at
scrollY > ~9000px on this page — a tooling artefact, not a page defect;
footer verified via computed styles instead of a visual capture for that
reason). Duplicate column headings and the stale EOR descriptor fixed. No
open items carried forward from this surface.

---
