# QUESTIONS.md — parked decisions and gaps

Standing register for the autonomous run of 30 July 2026. Items here need
Sumeet's or Chat's word; nothing below blocked the build — each carries the
assumption the work proceeded under.

## Q1 — Ambient intensity inside PetalPlates

Canon §5 caps ambient at 8% (light) / 14% (dark) opacity. Applied literally to
the PetalPlate imagery objects, every plate would be near-monochrome — but the
goal asks for plates as "rich gradient+geometric objects using the ambient
hues".

**Assumption taken:** the cap governs *atmosphere* (washes behind page content);
a PetalPlate is a bounded, self-contained graphic object — imagery, not
atmosphere — so hues inside a plate may run stronger, while plates never sit
behind body copy. Ratify or correct; correcting means regenerating plate
gradients only, no structural change.

## Q2 — Six source defects found in the case-study bodies

Found while drafting the devendored card excerpts (bodies untouched — they are
verbatim canon). These are defects in the *published source*, so correcting
them is a Sumeet/client-side call, not a Code decision:

1. `enabling-azure-data-platform-delivery-at-enterprise-scale` — deck line
   appears to belong to the MAF T&M-consolidation family, not this Azure story.
2. `enabling-supply-chain-transformation-through-targeted-delivery-expertise`
   — empty "Client Context" heading; its content sits under the next heading.
3. `engineering-a-custom-planning-platform` — deck and first outcome bullet are
   verbatim copies from the MAF Hyperion study (the already-flagged "financial
   consolidation" defect, now located precisely). Excluded from the excerpt.
4. One deck line reused verbatim across two unrelated studies (Fixed Assets and
   EBS integrations).
5. Same engagement told twice in three pairs/triples (Chalhoub ×2, Alshaya
   Azure ×2, MAF T&M ×3) — a curation question, not an error.
6. Two legacy-format studies carry unattributed embedded quotes and legacy
   brand terms ("Talent in a Box", "TS/EA as Service") — collides with canon
   §8's testimonial rule if ever surfaced.

**Assumption taken:** excerpts compress around the defects (no defective line
was used); bodies stay verbatim including the defects.

## Q3 — Register test: the light variant is a rebuild, not a variant

**This is the largest scope discovery of the run, and it blocks step 8.**

Canon §5 records the site default register as "under critique test", and Relay
v2.0 §2.1 rules L1/L2/service into the light register. I ran the test by
removing `band-dark` from the retail L1 and capturing both.

**The light flip does not render.** It produces dark-ink-on-dark across most of
the page — which is precisely why `band-dark` was applied in the first place.
Measured cause: the legacy shells hardcode dark grounds in their own CSS rather
than resolving through `--ground`, via the Layer 2c aliases `--ink-950`,
`--ink-900`, `--ink-800` and `--dk`:

| Shell | Hardcoded dark-ground references |
|---|---|
| `l2/L2PageShell.module.css` | 23 |
| `service/ServicePageShell.module.css` | 18 |
| `l1/L1PageShell.module.css` | 10 (34 alias uses in total) |
| `l1/L1HubShell.module.css` | 7 |

So the register change is not a class swap — every one of those grounds has to
be re-authored against the semantic layer, and the section rhythm re-designed so
the page reads as light with at most two inverted bands. On a ~3,000-line
stylesheet per shell that is the single biggest remaining task in the build.

**State left:** the dark register is restored and working; nothing is broken.
Captures of both attempts are in `docs/status/screens/register-dark/` and
`register-light/` — the light one is the evidence, not a deliverable.

**Recommendation:** treat the L1/L2/service light rebuild as its own dispatch
with the strip-and-rebuild checklist (`docs/status/step-8-rebuild-checklist.md`),
rather than as a step inside a broader pass. The critique comparison canon §5
asks for cannot be scored until the light variant actually renders.

## Q4 — The client mark pack has no alpha channel

Canon §8's "uniform monochrome treatment" presumes silhouette-ready sources. The
pack is **15 opaque rasters** (PNG colour-type 3, no alpha) with baked-in white
backgrounds, plus 3 vectors — and a few marks whose own background is dark.

A CSS filter alone therefore rendered fifteen of eighteen marks as solid black
bars. The shipped fix knocks the white out with a blend mode per theme
(`multiply` on light, `invert` + `screen` on dark), which is legible and
tile-free. A residual light or dark box still shows on the few marks whose
background is off-white or genuinely dark.

**Assumption taken:** blend-mode knockout ships now because it is legible and
canon-shaped. **The durable fix is the asset pipeline** — extend
`scripts/build-logos.mjs` to key out backgrounds and emit true-alpha assets, or
commission monochrome SVG silhouettes for all eighteen. That is a content and
asset task, not a CSS one.
