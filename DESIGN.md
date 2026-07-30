---
name: Yallo Talent
description: Enterprise platform talent across the Middle East and Europe — the site as the screening dossier it delivers.
colors:
  paper: "#eae9e4"
  paper-2: "#f4f3f0"
  paper-3: "#e3e1d9"
  ink: "#16171a"
  ink-2: "#3a3c42"
  ink-3: "#5c5e66"
  gold: "#d4a843"
  gold-deep: "#9d7818"
  gold-ink: "#7b5d13"
  gold-wash: "#f2e9d2"
  rule: "#cdcbc3"
  rule-strong: "#807e76"
  dk: "#0c0d10"
  dk-2: "#151820"
  dk-3: "#1f2330"
  dk-line: "#2e333d"
  dk-line-strong: "#6b7280"
  dk-txt: "#f0efec"
  dk-txt-2: "#b9bdc6"
  dk-txt-3: "#9298a3"
  signal-mark: "#c2410c"
  signal-text: "#a83a09"
  signal-mark-dark: "#ff8455"
  signal-text-dark: "#ff9a72"
  info-mark: "#1d6fa5"
  info-text: "#17557f"
  info-mark-dark: "#4aa8e8"
  info-text-dark: "#6ebcf0"
  positive-mark: "#2f7d46"
  positive-text: "#26643a"
  positive-mark-dark: "#57b478"
  positive-text-dark: "#7fc796"
  category-mark: "#9d3f7a"
  category-text: "#82305f"
  category-mark-dark: "#cf7fb4"
  category-text-dark: "#dc9ac6"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(38px, 5.6vw, 72px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(32px, 4.4vw, 54px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(20px, 2.2vw, 27px)"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  lede:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18.5px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.16em"
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.06em"
rounded:
  petal: "56px"
  petal-md: "18px"
  petal-sm: "12px"
  square: "0px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "22px"
  lg: "40px"
  xl: "64px"
  section: "clamp(52px, 6.5vw, 94px)"
  gutter: "clamp(20px, 5vw, 72px)"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.petal-md}"
    padding: "14px 24px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0 0 2px"
    typography: "{typography.body}"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-2}"
    rounded: "{rounded.petal-md}"
    padding: "13px 22px"
  card:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.petal}"
    padding: "28px"
  chip:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.petal-sm}"
    padding: "7px 13px"
    typography: "{typography.data}"
  eyebrow:
    backgroundColor: "transparent"
    textColor: "{colors.gold-ink}"
    typography: "{typography.label}"
---

# Design System: Yallo Talent

## Overview

**Creative North Star: "The Screening Dossier"**

The product Yallo actually delivers is a document: three names, screening notes, and the
reasons seventeen other people were rejected. The site is built as that artefact. Paper-stock
grounds instead of white. A serif that belongs to prospectuses and annual reports, not to
software. Monospace reserved for the things a dossier sets in monospace — reference numbers,
timestamps, source lines, measured values. Gold appears the way an assessor's marker appears
on a page someone has actually worked through: sparingly, and only where a judgement was made.

This is chosen against the category, not in ignorance of it. Every benchmarked competitor
scores 2 or 3 on visual distinctiveness, and they converge on the same look: photographic
hero, rounded cards, blue-to-violet gradient, sans-serif throughout. There is no incumbent to
beat here, only a default to refuse. A recruitment site that reads as a printed, annotated
document is unclaimed ground, and it happens to be the most honest possible expression of a
firm whose entire pitch is *we read these people properly before you did*.

The register is confident and quiet. Density is editorial: generous measure, hairline rules
doing the work borders would do elsewhere, and long uninterrupted runs of type rather than a
grid of equal tiles. The one place the system breaks its own stillness is the hero, where a
drawn instrument shows a shortlist mid-assembly — because the claim is speed, and speed has to
be visible somewhere. **Explicitly rejected:** stock photography of any kind, glassmorphism and
blurred orbs (the incumbent build's register, now anti-reference), per-sector colour coding,
and gradient text.

**Key Characteristics:**

- Paper grounds, never pure white; ink, never pure black
- One accent, gold, on every page — and nothing else decorative
- Serif display over sans body over mono data: three faces, strictly divided by job
- The quarter-round petal: three square corners, one radius, taken from the mark
- Flat by tonal layering and hairline rules; exactly one lifted element in the whole system
- Both themes are first-class and independently AA; neither is an inversion of the other

## Colors

A warm, low-chroma paper-and-ink palette carrying a single metallic accent, with a tightly
governed functional set that appears only where colour is load-bearing.

### Primary

- **Assessor's Gold** (`--gold` `#d4a843`): the mark colour, lifted from the flower in
  `public/logos/yallo-flower.svg`. On dark grounds it does everything — eyebrows, numerals,
  emphasis, bar fills — at 7.07:1. On light grounds it is **decorative only** (1.69:1 on paper):
  petal fills, dots, the hero wash. It must never carry text or state on light.
- **Struck Gold** (`--gold-deep` `#9d7818`): the light-theme accent for anything at large size or
  functioning as a boundary — the italic emphasis inside an H1, oversized metric numerals,
  underlines, focus rings (3.12:1, clears AA-large and 1.4.11).
- **Marker Ink** (`--gold-ink` `#7b5d13`): the light-theme accent for anything small. Every 11px
  mono eyebrow uses this, not `--gold-deep` (4.69:1). This token exists because the prototype
  set eyebrows in `--gold-deep` at 11px and shipped a 3.12:1 label — a real AA failure that
  would have gone live.
- **Gold Wash** (`--gold-wash` `#f2e9d2`): the only tinted ground, for the two commitment badges.

### Secondary — the functional set

Not brand colour. These encode information and are otherwise forbidden. Each has a
graphical grade (`-mark`, ≥3:1) and a label grade (`-text`, ≥4.5:1), tuned per theme, because a
single value cannot clear both on paper and on near-black. Tone descends from the saasinator
family so the properties read as siblings; saturation and value are shifted so Talent is not
a clone.

- **Kiln Orange** (`--signal-*`): scarcity, criticality, "hard to fill". Light `#c2410c` /
  `#a83a09`; dark `#ff8455` / `#ff9a72`.
- **Signal Blue** (`--info-*`): data series, in-region availability, neutral status. Light
  `#1d6fa5` / `#17557f`; dark `#4aa8e8` / `#6ebcf0`.
- **Verified Green** (`--positive-*`): renewal rate, filled seats, met milestones. Light
  `#2f7d46` / `#26643a`; dark `#57b478` / `#7fc796`.
- **Archive Plum** (`--category-*`): an optional fourth series where three do not suffice. Light
  `#9d3f7a` / `#82305f`; dark `#cf7fb4` / `#dc9ac6`.

### Neutral

- **Dossier Paper** (`--paper` `#eae9e4`): the default ground. Warm grey-beige, the colour of
  uncoated stock. Pure white appears nowhere in the light theme.
- **Loose Leaf** (`--paper-2` `#f4f3f0`) and **Kraft** (`--paper-3` `#e3e1d9`): the two
  alternate grounds. Adjacent sections step between the three so blocks read as separate
  sheets without needing borders.
- **Ink** (`--ink` `#16171a`, 13.69:1): all body copy and headings.
- **Ink Two** (`--ink-2` `#3a3c42`, 8.42:1): section ledes and secondary copy.
- **Ink Three** (`--ink-3` `#5c5e66`, 4.94:1): captions and meta. Raised from the prototype's
  `#63656c`, which missed 4.5:1 against Kraft.
- **Hairline** (`--rule` `#cdcbc3`) and **Boundary** (`--rule-strong` `#807e76`, 3.11:1): the
  decorative divider and the contrast-grade control border respectively.
- **Appendix Black** (`--dk` `#0c0d10`), **Appendix Two** (`--dk-2` `#151820`), **Appendix
  Three** (`--dk-3` `#1f2330`): the dark grounds. Charcoal with a whisper of blue, never navy.
- **Appendix Text** (`--dk-txt` `#f0efec` 13.62:1 / `--dk-txt-2` `#b9bdc6` 8.32:1 /
  `--dk-txt-3` `#9298a3` 5.40:1) and the divider pair (`--dk-line` / `--dk-line-strong` 3.24:1).

### Named Rules

**The One Marker Rule.** Gold is the only colour used decoratively anywhere in the system, and
it appears on every page. If a surface needs a second decorative colour, the surface is wrong.

**The Load-Bearing Colour Rule.** A functional colour may appear only where hue carries
information a reader needs. Never in navigation, buttons, headings or backgrounds. At most
three functional colours in any single view. Every one carries an equivalent label or icon, so
meaning never depends on hue alone.

**The Grade Rule.** Small text takes the `-text` grade; fills, dots, bars and strokes take the
`-mark` grade. Reaching for a `-mark` value to set a label is the single easiest way to break
AA in this system, and `scripts/check-contrast.mjs` exists to catch it.

**The Two Band Rule.** Within either theme, evidence and data surfaces may invert to the
opposite ground. Inversion signals content type, never decoration, and **no page carries more
than two inverted bands.**

## Typography

**Display Font:** Newsreader (with Georgia, serif)
**Body Font:** Inter (with system-ui, sans-serif)
**Label/Data Font:** IBM Plex Mono (with ui-monospace, monospace)

**Character:** Newsreader at 500 is a text serif with real optical sizing, so it holds at 72px
without the brittle thinness a display serif would show; set tight (-0.022em, line-height 1) it
reads as considered rather than decorative. Inter carries every sentence a reader actually
reads. IBM Plex Mono carries only what a dossier would set in monospace. Three faces, and the
division between them is by job, never by taste. `Plus Jakarta Sans` and `DM Mono` are retired.

### Hierarchy

- **Display** (500, `clamp(38px, 5.6vw, 72px)`, 1.0): the H1, once per page. Capped at 17ch so
  it always breaks into three or four lines and never runs as a banner. Italic 600 in
  `--gold-deep` marks the one phrase carrying the argument.
- **Headline** (500, `clamp(32px, 4.4vw, 54px)`, 1.05): section H2, capped at 23ch.
- **Title** (550, `clamp(20px, 2.2vw, 27px)`, 1.15): card and panel headings.
- **Lede** (400, 18.5px, 1.6, `--ink-2`, max 52ch): the hero paragraph.
- **Body** (400, 16.5px, 1.6, `--ink-2`, max 46ch for section ledes, 66ch for article prose).
- **Label** (400, 11px, 0.16em, uppercase, `--gold-ink`): eyebrows. Always preceded by a 5px
  gold dot.
- **Data** (500, 12px, 0.06em): measured values, reference numbers, source lines, timestamps,
  and the ghost numerals on step cards.

### Named Rules

**The Three Jobs Rule.** Serif for what the page asserts. Sans for what the reader reads. Mono
for what was measured. A number that was counted is mono; a number in a sentence is not.

**The Measure Rule.** No line of body copy exceeds 66ch, and no headline exceeds 23ch. Both are
set as `max-width` in `ch` units on the element, not left to the container.

## Layout

A single 1280px container with a fluid gutter (`clamp(20px, 5vw, 72px)`). Sections take
`clamp(52px, 6.5vw, 94px)` of vertical padding and alternate between the three paper grounds,
so separation is tonal rather than ruled.

**The section head is a fixed two-column figure**, 1.3fr / 1fr, bottom-aligned: headline left,
supporting sentence right, eyebrow above. It repeats on every section and is the strongest
rhythm in the system. Below 900px it collapses to one column and the supporting sentence sits
under the headline.

**Content grids are asymmetric by default.** The hero is 1.02fr / 0.98fr. The persona panel is
a narrow index against a wide panel. The role grid is 4×2 against a full-width output panel.
Equal-width tile grids are used only for the four metrics and the four entity cells, where
equality is the actual meaning.

**Breakpoints:** 1100px (two-column figures collapse), 900px (section heads collapse, 4-up
becomes 2-up), 560px (everything single column, 2-up becomes 1-up). The floor is 360px; at that
width the hero instrument keeps all four phases but drops to a 2×2 arrangement rather than
scrolling horizontally.

**Density** is deliberately uneven. Evidence and data surfaces run tight; the commitment and
close run loose. A uniform rhythm would flatten the argument.

## Elevation & Depth

**This system is flat, with exactly one exception.** Depth comes from three sources, in order:
tonal layering between the three paper grounds, hairline rules, and the petal radius breaking
the silhouette. There is no shadow vocabulary, no glass, no backdrop blur, and no orbs — the
incumbent build's blurred-orb-and-glass register is an explicit anti-reference.

The single exception is the **hero instrument**, which takes
`0 30px 60px -30px rgba(22,23,26,0.5)`. It is the only element on the site pretending to be
live rather than printed, and the lift is what makes that read. Because it is the only shadow
in the system, it needs no name and no scale.

### Named Rules

**The One Lift Rule.** If a second element in this system acquires a shadow, the first one stops
meaning anything. Hover states change ground, border or transform — never elevation.

## Shapes

**The quarter-round petal is the structural signature: three square corners and one radius,
taken directly from the four petals of the Yallo mark.** It is the one form a competitor cannot
copy without copying the logo, and it appears at three scales — `56px` on full panels and
cards, `18px` on buttons and small cards, `12px` on chips and inner tiles.

Which corner carries the radius is not arbitrary. **Buttons and chips take bottom-left**
(`0 0 0 18px`), reading as a page corner turned up. **Cards and panels take bottom-left** as the
default; a card that inverts to a dark ground takes **top-right** instead, so the inversion is
legible in silhouette before colour registers. Large low-opacity gold petals rotated 12° sit
behind the hero and the close as the only background graphic in the system.

Everything else is square. Border-radius is never applied "for softness" — it is either the
petal, carrying brand, or it is absent. Circles are reserved for the 5px eyebrow dot, the live
pulse, and status marks.

## Components

### Buttons

- **Shape:** the petal at small scale — bottom-left radius only (`0 0 0 18px`).
- **Primary:** gold ground, ink text, `14px 24px`, weight 600. On dark bands it keeps the gold
  ground, because gold-on-dark is the strongest pairing in the system.
- **Hover / Focus:** `translateY(-2px)` over 0.45s `cubic-bezier(.2,.7,.2,1)`. No shadow, no
  colour change. Focus is a 2px `--gold-deep` outline at 3px offset, and it is never removed.
- **Secondary:** text with a 1.5px `--gold-deep` underline, 2px below the baseline. No box, no
  ground. On dark it takes `--dk-txt` with a `--gold` underline.
- **Dark:** ink ground, `--paper-2` text — used only where a gold button would be the third gold
  element in one view.

### Chips

- **Style:** `--paper-2` ground, `--ink-2` text, 1px `--rule` border, petal at 12px, mono at
  12px/0.06em.
- **State:** chips in this system are non-interactive labels ("right for" lists, role names).
  Where a chip *is* a control it takes `--rule-strong` for its border and a gold left edge when
  selected — never a gold fill, which would collide with the primary button.

### Cards / Containers

- **Corner Style:** petal at 56px, bottom-left; top-right when inverted.
- **Background:** `--paper-2` on a `--paper` section, `--paper` on a `--paper-2` section — always
  one step of tonal separation from its ground.
- **Shadow Strategy:** none. See Elevation & Depth.
- **Border:** 1px `--rule`. Hover lifts the border to `--rule-strong` and steps the ground one
  tone; it does not add elevation.
- **Internal Padding:** 28px, dropping to 22px below 560px.

### Inputs / Fields

- **Style:** `--paper-2` ground, 1px `--rule-strong` border (contrast-grade, because the border
  *is* the control boundary), petal at 12px, 14px Inter.
- **Focus:** border to `--gold-deep` plus a 2px outline at 3px offset. The ground does not change.
- **Error:** border and message in `--signal-text`, with an icon — never colour alone.

### Navigation

Sticky, `rgba(234,233,228,0.94)` with a 12px backdrop blur — the one permitted blur in the
system, because a sticky bar over scrolling content needs it to stay legible. 1px `--rule`
bottom border. Five outward-facing labels in 14.5px Inter 500 `--ink-2`, each with a gold
underline that wipes in left-to-right on hover over 0.35s. Then a quiet 13.5px `--ink-3` Jobs
punchout and one gold primary button. **No per-item colour, no imagery in panels, no more than
one button.**

### The Hero Instrument (signature)

A dark panel on a light page showing a shortlist mid-assembly: four phase tiles with the third
active, three scored candidate rows with animated bars, a fourth row reading "17 screened out",
and three measured values beneath. It carries the system's only shadow, its only scanning
animation, and the gold pulse. It is drawn entirely in markup — no image, no canvas — and every
animation is gated on `prefers-reduced-motion`, under which the bars render at final width and
the sweep does not run.

Its job is to make 72 hours visible in the first viewport. It is illustrative, labelled as
such, and contains no real candidate data.

### The Petal Fill (signature)

Metric cards, panel corners and the AI role tiles each carry a small gold petal in one corner at
low opacity. Across the four metrics the fill progresses — a quarter, a half, three-quarters,
full — so the row reads as a sequence rather than four equal facts. This is the mark used as
structure, and it is the cheapest recognisability in the system.

## Do's and Don'ts

### Do:

- **Do** set every 11px mono eyebrow in `--gold-ink` (`#7b5d13`), never `--gold-deep`.
- **Do** step the ground between adjacent sections (`paper` → `paper-2` → `paper-warm`) so blocks
  separate tonally without borders.
- **Do** give every functional colour a label or icon alongside it, and run
  `node scripts/check-contrast.mjs` before committing any colour change.
- **Do** cap headlines at 23ch and body at 66ch as `max-width` in `ch` on the element itself.
- **Do** put the petal radius on exactly one corner, bottom-left by default, top-right on
  inverted cards.
- **Do** server-render real values and animate *from* zero only after hydration, and only when
  motion is permitted.
- **Do** keep both themes independently AA. A change that fixes light and breaks dark is not a fix.

### Don't:

- **Don't** use `--gold` for text or state on any light ground — it is 1.69:1 and decorative only.
- **Don't** add a second shadow anywhere. Hover changes ground, border or transform.
- **Don't** introduce glass, backdrop blur (outside the sticky nav), blurred orbs, or gradient
  text. These are the incumbent register and are anti-reference.
- **Don't** use stock photography, invented headshots, or any remote image host.
- **Don't** colour-code by sector, platform or discipline. One accent, always.
- **Don't** put more than two inverted bands on one page, or invert a band for variety rather
  than to signal content type.
- **Don't** set a counted number in Inter or a sentence's number in mono.
- **Don't** apply border-radius for softness. It is the petal, or it is square.
