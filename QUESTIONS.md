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

## Q3 — RESOLVED: the light register is built and live

**Superseded by the rebuild.** The finding below stands as the diagnosis; the
work is done. L1, L2 and service now follow the active register, `band-dark` is
off the shells, and every built surface passes axe in both themes.

**One line needs your ratification:** canon §5's register clause, which I have
updated to record light as adopted site-wide. Ratify or correct it.

The original diagnosis, kept because it explains why this took a rebuild:

### Diagnosis (30 Jul)

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

## Q5 — RESOLVED: India is a demand market as well as the supply hub

**Closed by canon amendment A6, ratified 30 Jul.** Demand arrives as Global
Capability Centre staffing — multinationals building capability centres in
Bengaluru buy from Yallo there. `PRODUCT.md` stands as written, the L1 heroes keep
"Middle East, Europe and India", and "3 delivery regions" stays banned because
that ban was always about conflating supply with demand.

The question as raised: canon §1 said "never a demand market" while `PRODUCT.md`
treated India as one, and the L1 heroes followed `PRODUCT.md`. Code left the copy
alone and asked rather than picking a side. The "never" line has been rewritten.

## Q7 — RESOLVED: the adjacency narrowing is ratified

**Closed by R1, 31 Jul.** The 1.125 minimum ratio applies **from `--fs-body-sm`
(15.5px) upward** — the display and heading chain, where a reader compares steps
by size alone. Below it the roles differ by family, case, tracking, weight and
colour as well as size, so A4's 13/14/15 sizes stand and the ratio does not
govern them. Canon §5's type clause now says this outright, so the conflict
between A4 and the earlier blanket rule is closed in the text rather than in a
comment.

## Q6 — RESOLVED: the per-sector hue system is deleted, not stubbed

**Closed by order step 9.** Canon §5's ban is now structural: there is nothing
left to re-enable. Removed in full — 139 `--card-hue*` CSS consumers, 8
`hueStyle`/`cardHueStyle` call sites, the `L1Hue` type, 48 `hue:` data fields
across 15 files, and all 30 `--hue-*` shim declarations in `globals.css`.

**Two things were worse than the original note recorded, and both were live
defects rather than inert plumbing:**

1. **29 bare `var(--card-hue-20)` uses in `HubLandingSections.module.css` had no
   fallback at all.** With `--card-hue*` declared nowhere, those declarations
   were invalid at computed-value time and had been silently falling back to
   `inherit`/`initial` — borders and washes that never rendered.
2. **Five pages plus the L1 hub were still assigning the accent per taxonomy
   branch, inline.** `about`, `why-yallo`, `jobs`, `leadership` and
   `LegalPageShell` each carried a live `hueStyle` object writing
   `--sector-accent: var(--hue-blue-500)`, and `L1HubShell` wrote
   `var(--hue-${e.hue}-500)` keyed to each entry's own slug — exactly what canon
   §5 bans, and inline beats every class. `jobs` and `leadership` did the same
   per row and per person.

Every consumer was rerouted to the semantic accent ramp, which flips per theme.
`-35` now resolves to `--sector-accent-35`, a real colour, rather than the shim's
`transparent` — the invisible-border defect from the earlier round, at its source.

## Q4 — RESOLVED: the pack now has a real alpha channel, and six marks ship as names

**Closed by order step 11.** The durable fix this entry named — extend
`scripts/build-logos.mjs` to key out backgrounds and emit true-alpha assets — is
done, so the CSS no longer compensates for the assets.

**Two simpler versions failed first, and the failures are the useful part:**

1. *Greyscale, normalise, invert, use as alpha.* Assumes dark ink on a light
   ground. Measured, `marks-and-spencer` came out **96.5% partial alpha and 0.1%
   transparent** — inverting a white-on-dark mark makes the ground opaque and the
   ink vanish.
2. *Sample the border ring for the ground luminance.* Better, 9 of 15 clean, but
   six stayed under 6% transparent because their grounds are gradients or brand
   colours, and `trim` had already eaten the flat edge on some.
3. *Otsu's method.* Ships. It finds the threshold that best splits the image into
   two luminance classes — the ink/ground split — and the border ring is used only
   to decide which class is the ground, so either polarity works. Alpha is the
   pixel's position between the two class means, so antialiased edges stay soft.

**Eleven marks key cleanly. Six do not, and they ship as their NAME** — canon §8's
own rule, applied by measurement rather than by eye. The build refuses to emit an
asset it cannot vouch for, on two tests: clarity (under 25% transparent, or over
45% partial alpha, means the ground did not separate) and cap height (a mark too
wide to reach 15px of ink in the 156px rail cell is a line, not a mark).

| Mark | Why it ships as a name |
|---|---|
| Landmark Group | 21.3% transparent, 70.8% partial |
| Chalhoub Group | 16.8% transparent, 74.4% partial |
| Al Othaim Markets | 19.4% transparent, 70.5% partial |
| Sephora | 3.8% transparent, 50.4% partial |
| Oracle Consulting | 2.2% transparent, 67.4% partial |
| Richemont | cap height 10.7px at the rail cell |

`src/lib/clients.ts` gained `hasLogoAsset`, because `clients.yaml` still names
these clients — the consent and the relationship are unchanged, only the asset is
absent.

**The rail is now genuinely single ink:** uniform 156x56 cells, one 26px cap
height, one filter per theme (`none` on light, `invert(1)` on dark), **no blend
mode at all**, one opacity, even 51.2px spacing — every one of those measured in
the browser.

**Still worth commissioning:** monochrome SVG silhouettes for the six. Nothing is
broken without them — a name is a legitimate treatment, not a placeholder — but a
vector would let all fifteen render as marks.

## Q8 — RESOLVED: no glass on the mega panel

**Closed by R3, 31 Jul.** Accepted as measured: the panel is a child of the glass
header, a nested `backdrop-filter` is a no-op, and translucency without blur is
the one combination that harms legibility. **No portal** — the panel is not being
re-parented to chase the effect. The ambient field stands there instead, which
needs no `backdrop-filter` at all.


## Q9 — NARROWED: Blue Yonder only

**R2, 31 Jul, settled three of the four.** SAP Special Applications, Business One
and Business ByDesign are **retired** from the platform page — a category and two
SMB products, against canon §1's enterprise-programme wedge. Corpus attestation
was never the same as a desk Yallo staffs, and that is now recorded in canon §3.

**Still open, and it is the one page still wrong:** Blue Yonder has **no corpus
file at all** — no `platform/blue-yonder.md`, no `blue-yonder-expertise.md` — so
there is no attested suite list to draft from. Its platform page therefore still
mixes two levels: the retail cut (Merchandise Management, Assortment
Optimization, Space Planning) sits alongside genuinely suite-level modules (WMS,
TMS, Luminate, Demand Planning).

**Sumeet is naming the desks.** Until then it stays as-is: under R5 a module name
may now come from the current market rather than only from the corpus, but Blue
Yonder's desks are a question of *what Yallo staffs*, which no market research can
answer.


## Q10 — The legacy `.wpress` archive is media-only

Recorded because B1 assumed it was a content export and it is not.

Extracted and indexed: **27,645 entries, 5.51 GB**. Of those, **26,921 are
`uploads/`** — 17,418 PNG, 5,694 JPG, 1,497 WebP, 1,239 JPEG, 181 MP4, 49 MP3.
There is **no `database.sql` and no WXR** anywhere in it. It is an All-in-One WP
Migration *files* export, not a full site export.

**Consequences, both already handled:**

1. The archive is the authoritative **media** manifest — `MEDIA-MANIFEST.ndjson`,
   built from the container itself rather than from a directory walk.
2. It cannot corroborate a single word of copy. The **content** corpus at
   `content/` — built earlier from a live-site fetch — remains the only citable
   source for module names, and it is what B2 used. Its own report notes no WXR
   was provided, so page content came from HTTP and may carry render artefacts.

**If a full export is available**, a `database.sql` would let the inventory be
rebuilt from `wp_posts` rather than from fetched HTML, which would settle
publish/modify dates, drafts and revisions that the fetch cannot see.

