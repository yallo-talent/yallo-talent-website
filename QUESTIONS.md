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



## Q11 — "Active bench across 3 markets" against the "3 delivery regions" ban

**Your call. Flagged rather than changed.**

Canon §2 bans *"3 delivery regions"* in any phrasing, and gives the reason: it
conflates supply with demand. `/industries/retail` says **"Active bench across 3
markets"**. That is not the banned phrase, and A6 has since established that
India is a demand market as well as a supply hub — so on the surface it is
clean, and `check-terminology` passes it.

The reason it is still logged: **bench is a supply claim**. "Active bench across
3 markets" asserts a bench in all three, which is the same supply/demand
conflation the clause names as its rationale, arriving by a different sentence.
Either the phrase is fine because A6 changed the underlying fact, or the ban
should be widened to the claim rather than the wording. I cannot settle which
without knowing whether there is a genuine bench in all three markets.

## Q12 — Three published figures with nothing behind them

**Acted on, and logged because reversing it needs a source, not a decision.**

Canon §6 and the standing "invent nothing" rule. Found during the Data &
Analytics and Retail passes:

| Figure | Where | What was wrong | Action |
|---|---|---|---|
| **72%** | `capabilities/data-analytics` | **Miscited.** ManpowerGroup's figure is that 72% of employers cannot find the skilled talent they need *in general*, with AI, IT and data among the hardest categories. The page narrowed it to "72% of enterprises can't find the AI, ML and data specialists they need" — a stronger claim than the source makes. | Restated to the wording already ratified for the same figure in `home/personas.ts`, with the full survey named in a new `source` field |
| **68%** | `capabilities/cloud-infrastructure` | **Untraceable.** The string appears exactly once in the whole repository — in that data file. No source, no corpus attestation, and ManpowerGroup's name attached to it. | Deleted |
| **"4–6 wks"** | both capability pages | **Unsourced.** "Average time lost when a data engineer / cloud architect is placed without production-scale experience." No source anywhere in the repo or the legacy corpus. A figure with the authority of data and nothing behind it. | Deleted |

`L1IntroStatCard` had **no `source` field at all**, which is why the only way to
cite one was to append "(ManpowerGroup, 2026)" to the claim text. A citation
that reads as prose is not doing a citation's job — and inlining it is precisely
how the miscitation survived, because the source name lent authority to wording
the source does not support. The field now exists and renders as a citation, so
an uncited figure is a visible omission.

**What I need from you.** If the 68% and the 4–6 wks figures are real, they need
a source and they can come straight back. If they were placeholders, the
cloud-infrastructure intro now has no stat rail and that composition gap wants a
decision — a sourced figure, or a different right-hand element.

## Q13 — Radwell's mark is a box lockup, and it was committed by hand

**Measured, reported, deliberately not changed.**

The client rail's legibility gate gained a third test this round. A **box
lockup** — a logo whose artwork is a filled rectangle with knockout type — keys
to its *box* rather than its letterform, so the silhouette is a solid slab: black
on light, and on the dark rail a near-white card, which canon §8 forbids
outright. The clarity test cannot see this, because a filled box is a perfectly
clean two-class key.

Ink density alone does not separate the cases either: **Infosys is a legitimate
wordmark at 31.8% ink, above Radwell's 34.9% box.** Perimeter ink does — a box
runs ink along its outer frame while a wordmark's letters float inside the
trimmed bounding box. Measured across the whole pack:

| Mark | Perimeter ink | |
|---|---|---|
| wickes | 30.5% | box — now ships as its NAME |
| **radwell** | **25.0%** | **box — still shipping as a silhouette** |
| tcs | 5.0% | highest legitimate wordmark |
| capgemini | 1.4% | fine |
| everything else | ≤4.6% | fine |

The threshold sits at 15%, in a gap five times wider than the spread it has to
resolve. `wickes` is now correctly a name.

**Why Radwell was left alone.** It is one of two marks committed *by hand* and
labelled in the script "verified, not generated" — plausibly committed precisely
because the automated path could not do it justice. Deleting a curated asset on a
heuristic written after the fact would be the script overruling a human decision
it has no standing to overrule. So the build now measures the committed vectors
too and **prints a warning every run** rather than passing it in silence.

**Your call:** either Radwell ships as its name like Wickes, or a monochrome
letterform-only SVG replaces the box artwork. It cannot stay a slab on the dark
rail and also satisfy §8.

## Q14 — Canon §5 bans blurred orbs; four pseudo-element rule sites survive

**Measured and flagged. Not changed, because it is a reading of §5 rather than a defect.**

The named orb divs were all correctly killed — `.wwdGlow`, `.hwwGlow`,
`.expCardGlow`, `.scarceGlow`, `.introOrb` are each `display: none` with a
comment citing the DESIGN.md anti-reference. **Their pseudo-element twins were
not**, and they render:

| Selector | Filter | Size | Radius | Opacity | Instances |
|---|---|---|---|---|---|
| `.wwdCard::before` | `blur(40px)` | 200×200 | 50% | 0.5 | 3 |
| `.expCard::before` | `blur(30px)` | 160×160 | 50% | 0.5 | 6 |
| `.segPanel::after` | `blur(60px)` | 260×260 | 50% | 0.6 | 1 |
| `.segImgWrap::after` | `blur(50px)` | 220×220 | 50% | 0.55 | 1 |

That is ~11 rendered blurred circles per L1 page, visible as a warm wash at the
bottom-left of every card.

**Why this is your call and not mine.** Either §5's ban means
`filter: blur()` + `border-radius: 50%` on a decorative layer — in which case
four rule sites go and every card on every L1 changes appearance — or it means
only free-floating orbs behind copy, and the clause wants narrowing to say so.
These are masked into card corners rather than sitting behind body text, which
is the specific harm the killed divs were cited for.

I removed `.scarceGridBg` on exactly this reasoning-by-precedent argument, so
consistency points at removing these too. I have not, because that one was a
texture nobody would miss and this is a visible change to every card surface on
the site. **One line either way and I will apply it across all four sites in one
pass.**

Worth weighing alongside it: A3's glass permission carries a performance
condition, and eleven `filter: blur()` compositing layers per page is a cost
that clause did not anticipate.

## Q15 — Two platform marks cannot render at rail scale

**Same class as Q13, found while closing the homepage's §8 breach.**

The `#place` axis marks were full-colour vendor logos on a `--paper-2` tile
inside a band whose ground is near-black in the light register — canon §8's
"never a mark on a white card", eight sections below a client rail that had just
been taken to zero chroma. That breach is fixed: the opaque tile is gone, a
hairline frame matches the sectors column beside it, and `--mark-flatten` gives
single ink in both registers.

**Two of the six do not survive it, and neither is a CSS problem:**

| Mark | Measured | Problem |
|---|---|---|
| **Blue Yonder** | renders **48×7px** | A 7:1 wordmark in a 76px column gives 7px of ink — under half the 15px legibility floor `build-logos.mjs` enforces on the client rail. The source `blue-yonder.png` also has **0.0% transparency**, so it is a baked ground rather than an alpha silhouette |
| **SAP** | `sap.svg` is **24.5% transparent** | A box lockup — a filled trapezoid with knockout type. Flattening a box gives a slab, exactly the defect the rail's new perimeter-ink test catches |

Neither can be fixed by styling. The options are the same two Q13 offers:
commission a monochrome letterform-only vector, or drop these to the drawn-glyph
treatment the sectors column already uses — `.axisMarkDrawn` exists and works.

**My recommendation:** the drawn glyph, because the platform NAME is already
rendered beside the mark in Newsreader at full size, and the marks are
`aria-hidden`. They carry recognition, not information, so a mark that cannot be
recognised is carrying nothing. But swapping vendor logos for glyphs is a
brand-presentation call, not a design-system one, so I have left them.

Worth noting alongside it: a prior round deleted the "technology partners"
section because presenting those marks implied a partnership claim with nothing
behind it. The same question applies here in visual form.

## Q16 — `check-a11y` cannot tell an abstention from a pass

**A real AA failure lived in this gap for a whole round, and the gate was green.**

axe returns three verdicts per rule: `violations`, `passes`, and **`incomplete`** —
"I could not determine this." `check-a11y.mjs` fails on violations only, so an
`incomplete` is silence, and silence reads as a pass.

On `/capabilities/data-analytics` a pass-3 critique measured **113 `incomplete`
`color-contrast` nodes** — most of the page's text, including `h1`, `h2`,
`.wwdTitle`, `.wwdCopy`, `.expCardTitle` and `.scarceRowName`. The stated reasons
are all structural to this design: *"background could not be determined due to a
background gradient"*, *"…due to a pseudo element"*, *"…partially overlaps other
elements"*, *"…contains an image node"*. Ambient washes, the hero field and the
petal geometry guarantee axe abstains on the surfaces that matter most.

**`.rtagPerm` was in that set** and composed to 3.26:1 against its real ground —
the only AA-failing informational text on the page, invisible to CI, found only
because a critique composed the value by hand. It is fixed (4.89:1 light /
6.84:1 dark), but the hole it came through is still open.

**Recommendation, and it needs your word because it changes what green means.**
`check-a11y` should compose contrast itself for every `incomplete` node —
walking ancestors, multiplying alphas, and evaluating gradients analytically at
the element's own position — and fail on a real shortfall. Every critique pass
has had to build that compositor from scratch to do its job; the gate should own
it instead. That is a substantial addition rather than a flag, which is why it is
a question and not a commit.

**Two related gate rulings I also need:**

1. **320 vs 360 for reflow.** `check-reflow.mjs` asserts 360px and says so
   deliberately, citing canon's performance gate. **SC 1.4.10 is specified at
   320px**, and at 320 the nav's actions row overflows by 32px on every route in
   both themes — long-standing, not new. Either canon's 360 is the authority and
   WCAG's 320 is accepted as out of scope, or the guard moves to 320 and the nav
   row is rebuilt. One number has to be authoritative.
2. **A4 for a filled MONO control.** `.skipLink` is uppercase mono at 0.12em on a
   gold fill. A4 gives mono labels 13px and buttons 15px; this is both. I raised
   it to 15.5px on the reading that "filled control" wins, but A4 does not say.

## Q17 — The SAP module pages repeat their parent card, and the corpus cannot fix it alone

**The last open P1 on `/platforms/sap`, and it is a content-scope question rather than a build defect.**

A pass-3 critique measured it string-for-string: the L2 page for SAP Datasphere
carries the **identical scope line** and the **identical four role names** as the
SAP Datasphere card on the L1. What the L2 adds is the four sitewide metrics
(byte-identical on every module page) and 16 links back out — 540 of its 1,646px
is the sibling grid. **Net new module-specific information: zero.** On a platform
whose entire wedge is module-level depth, the destination does not pay for the
click.

**What the corpus does and does not give.** `platform-expertise/sap-expertise.md`
in the legacy archive is 662 lines with a real section per module, so the source
exists. But the prose is **platform-speak** — *"SAP Analytics delivers an
integrated suite of tools for real-time reporting, AI-driven forecasting…"* —
which describes what SAP does, not what Yallo places. The IA change log already
recorded this: the names are the corpus's and the scope lines are ours. Converting
that prose to Talent-speak means writing new claims about what Yallo staffs, which
is a claim about Yallo that no corpus answers.

**The one genuinely convertible asset** is the sub-product list inside each
module. For SAP Analytics the corpus names Analytics Cloud, Datasphere,
BW/4HANA, BusinessObjects, Crystal Reports, Lumira and the BI Suite. That is real,
attested, module-specific depth the L1 card does not carry — and it is exactly the
kind of list an L2 should hold.

**Why I have not built it.** Each name needs an R5 market pass before it ships,
and I ran that pass on two of them to check the argument holds. It does, though
one of my own figures was wrong: I first wrote that **SAP Lumira is
discontinued**, which is too strong. Verified — Lumira *Designer* is supported
to **2031** with no new features, and it is Lumira *Discovery* that drops out of
BI 2025. Either way it is not a desk to staff, but the accurate reason is
"maintenance-mode, no new features", not "retired". BusinessObjects and Crystal
Reports are in the same category. R5 requires real market products with a logged
was/now/why table per change, so this is a scoped piece of work with a
ratification step rather than something to slip in.

**Three ways forward, and it is your call which:**

1. **Build the sub-product layer** — I run the R5 market pass per name across all
   17 modules, ship the survivors as the L2's depth, and log the table. Largest
   and the one that makes the L2 worth its click.
2. **Thin the L2 set** — keep module pages only where there is real depth to
   publish, and let the rest resolve to the L1 anchor the new index provides.
3. **Leave them** — accept that the L2s are currently SEO surface with a bench
   list, and revisit when the content exists.

My recommendation is 1, gated on your ratification of the resulting table.

## Q18 — SC 2.2.2 needs a pause control, and that is a design decision

**Level A, found by the paired frozen passes. I tried a fix, reverted it, and am asking instead.**

Two surfaces auto-run past WCAG's five-second threshold and neither offers a
pause mechanism reachable without a pointer:

| Surface | Duration | Current pause | Reaches |
|---|---|---|---|
| Client rail | `rail-drift` **64s** infinite | `.railViewport:hover` — and it genuinely works, transform frozen across 900ms of hover | mouse only. The viewport contains **0 focusable elements**, so there is no keyboard route and, on touch, none at all |
| Hero instrument | rewrites three rows every **~12s** | `onPointerEnter` works; `onFocusCapture` is **declared and can never fire** — the figure has no focusable descendant and no tabindex | mouse only |

Both are fully static under `prefers-reduced-motion`, verified — but WCAG does
not accept an OS setting as the page's mechanism, and a touch user has no hover.

**What I tried and backed out.** `tabIndex={0}` on the instrument's `<figure>`
made the declared focus-hold fire, and I measured it working — focus set
`data-held`, the stage froze across 4s. I reverted it because biome objected
correctly: a non-interactive element in the tab order confuses more than it
helps, and a focusable figure whose only behaviour is "pauses while focused" is a
weak mechanism that announces nothing about itself.

**The criterion wants a control**, and that is the ask: a small pause/play toggle
on the rail and on the instrument. It is genuinely reachable by keyboard and
touch, it is self-describing, and it satisfies 2.2.2 outright. It also puts new
UI into the hero and onto the rail, which is a composition decision on the two
most deliberately-restrained surfaces on the site — so it is yours, not mine.

**A canon note that goes with it.** §5's motion clause says auto-advancing
elements "pause on hover", and the build honours that clause *exactly*. The
clause is what leaves 2.2.2 unmet, because hover is not a mechanism for keyboard
or touch. If you ratify the control, the clause should read "a mechanism" rather
than "hover" — otherwise the next implementer builds the same gap from the same
sentence.

---

# RESOLUTION LOG — 31 July 2026, rulings R6–R15

Eight entries close here. Each is struck by a ruling recorded in
`docs/design/yallo-talent-CANON.md`; nothing below is closed by Code's own
judgement except where S3 delegation is named explicitly.

| Q | Was | Closed by | What Code does |
|---|---|---|---|
| **Q2** | Six defects in published case-study bodies | **R14** | Delete what is demonstrably wrong — lines belonging to another study, the empty heading. Where text repeats across two unrelated studies, keep it where it belongs and remove the other. **No rewriting.** Removals logged |
| **Q3** | Which register is the site-wide default | **R12** | Light. Recorded in canon §5 as adopted, not under test |
| **Q8** | Glass on the mega panel | R3 (30 Jul) | Already closed |
| **Q9** | Blue Yonder's module set | **R13** | Ships at suite level from repo evidence only — the ratified homepage line plus the Blue Yonder roles the retail data names. A module ships **only** if it maps to an existing role or the homepage line. Moss hue. Evidence table logged |
| **Q14** | Four blurred-orb pseudo-element sites | **R8** | The ban stands. All four deleted |
| **Q15** | Two vendor marks rendering as light slabs | **R9** | Key them, or set them as NAME text. No third option |
| **Q16** | `check-a11y` cannot tell an abstention from a pass | **R10** | The gate composes contrast for every axe abstention |
| **Q17** | The SAP L2 returns byte-identical content | **R6** | Routes stay. Depth comes from JOINING data already held — sectors and functions staffing the module, role detail with screening notes, case studies on the platform tag, siblings. **One marked slot per module is reserved for Chat copy and Code must not write it** |
| **Q18** | SC 2.2.2 — no pointer-free pause | **R7** | Stop the loops rather than add UI. The hero instrument plays once then rests, so 2.2.2 stops applying. The rail keeps its loop and gains a small keyboard-reachable pause/play. Canon §5 gains "plus a control" |

## Still open, and why

| Q | Status |
|---|---|
| **Q1** | Ambient intensity inside PetalPlates. **Superseded in practice by R11**, which requires ambient presence to rise until the hue is perceptible — the opposite direction to the 8%/14% cap this asked about. Will be restated against whatever R11 lands on |
| **Q4** | Closed 30 Jul (true-alpha pack shipped) |
| **Q5, Q6, Q7** | Closed by A6, order step 9 and R1 |
| **Q10** | The legacy `.wpress` archive is media-only. Informational; no decision needed |
| **Q11** | "Active bench across 3 markets" against §2's supply/demand ban. **Needs Sumeet** — it turns on whether there is a genuine bench in all three markets, which is a fact about the business, not the build. Under S3 the least-overclaiming option is to soften the claim; recorded and not yet applied, because softening a ratified positioning line is a bigger step than S3 contemplates |
| **Q12** | Three removed figures. **Needs a source, not a decision.** If 68% and "4–6 wks" are real they can return with attribution |
| **Q13** | Radwell's mark is a box lockup at 25.0% perimeter ink. **R9 settles the principle** for `blue-yonder` and `sap`; Radwell was hand-committed and labelled "verified, not generated", so it is treated the same way — key it or set it as a name |
| **Q19** (new) | `data-ambient="spectrum"` renders the retired six-hue rhythm on the homepage: engage panels at 216°, 178°, 327° and 127° against 40–45° everywhere else. **Superseded by R11**, which rebuilds ambient presence site-wide — this will be resolved by that work rather than by flipping the constant. Also open in the same breath: whether footer chrome counts against §5's two-dark-band ceiling (three bands render in light: `#place`, `#start`, `footer`) |
