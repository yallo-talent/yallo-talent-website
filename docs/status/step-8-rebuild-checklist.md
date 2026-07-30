# Step 8 — L1 / L2 / service rebuild checklist

**Scope confirmed by Chat Relay v2.2 §3: strip-and-rebuild, not recolour.**
Every item here was found and deliberately parked during steps 3 and 4 rather than
fixed in a file about to be replaced. Nothing here is a new discovery for step 8 to
make — it is a list to work through.

## 1. Delete the unplugged incumbent register

The previous build neutralised the glass-and-glow register by rewiring tokens, not
by removing CSS. Everything below currently renders as nothing, which is why it
survived review. **One variable restores all of it site-wide.**

| What | Count | Why it renders as nothing today |
|---|---|---|
| `box-shadow` declarations | **100** | 99 resolve through `--sector-accent-35`, `--card-hue-35`, `--hue-*-35`, `--accent-glow`, `--success-glow`, all `transparent`. Exactly **one** is real: `var(--lift)` on the hero instrument |
| `backdrop-filter` / `--glass-*` declarations | **149** | `--glass-blur` is `0px` in light and undefined in dark, so the declaration is invalid and dropped |

Per file, glass and shadow combined:

| File | glass | shadow |
|---|---|---|
| `blocks/l1/L1PageShell.module.css` | 69 | 41 |
| `blocks/l2/L2PageShell.module.css` | 32 | 19 |
| `blocks/hub/HubLandingSections.module.css` | 16 | 6 |
| `blocks/service/ServicePageShell.module.css` | 9 | 11 |
| `blocks/editorial/EditorialLayout.module.css` | 7 | 2 |
| `blocks/l1/L1HubShell.module.css` | 4 | 3 |
| `blocks/editorial/LegalPageShell.module.css` | 4 | — |
| `blocks/BriefCTA.module.css` | 4 | 7 |
| `layout/StickyBriefCTA.module.css` | 2 | 1 |
| `layout/NavBar.module.css` | 2 | 4 |
| `blocks/BriefForm.module.css` | — | 3 |
| `ui/Badge.module.css` | — | 1 |

**Rule, per v2.1 rev 2 §2 and v2.2 §3: adopted or gone, no third state.** Whatever
the step-5 ambient option deliberately adopts survives; everything else is deleted.

**After the deletion lands**, add `backdrop-filter` and `--glass-*` to the banned
list in `scripts/check-terminology.mjs` so the register cannot return. The sticky
nav's one permitted blur is the single exception DESIGN.md allows and needs an
explicit allow-list entry.

## 2. The side-tabs — two of them, and they render

v2.2 §5 asks for these on this list so they are dismantled deliberately.

**`L1PageShell.module.css:463`** — one rule breaking four DESIGN.md prohibitions:

```css
background: var(--glass-bg);                      /* glass — anti-reference */
backdrop-filter: saturate(160%) blur(var(--glass-blur));  /* blur — anti-reference */
border-left: 3px solid var(--sector-accent);      /* coloured side-tab; also per-sector colour */
border-radius: 14px;                              /* off the petal scale */
```

**`L2PageShell.module.css:721`** — the same pattern, missed on the first pass:
a `--sector-accent-08` gradient ground, a dead `--sector-accent-35` border, the
same `border-left: 3px solid var(--sector-accent)`, the same off-scale `14px`
radius, and an `inset` shadow.

Unlike the glass above, **the 3px side border renders.** Measured on
`/industries/retail`: `.introStatCard` computes
`border-left: 3px solid rgb(212, 168, 67)` — gold. The craft floor names a
coloured side border above 1px as the single most recognisable generated-UI tell.

## 2b. The decorative grid field — renders, and was missed

`L1PageShell.module.css:101` and `L2PageShell.module.css:80`, identical
`.heroGrid` rules: a two-axis hairline field tiled at `44px 44px` from
`--wa03`, masked radially.

**This one is not neutralised.** `--wa03` resolves to `--dk-line` (`#2e333d`) on
dark and `--hairline` on light, so unlike the ~250 glass and shadow declarations
it paints. Measured on `/industries/retail`:
`linear-gradient(rgb(46, 51, 61) 1px, transparent 1px)` at `44px 44px`, both axes.

Scope checked rather than assumed: 21 files reference a `heroGrid`, but the
**homepage's is already dead** (`background-image: none` on `Home.module.css`'s
`.heroGrid`). So this is genuinely a shell problem, not a site-wide one — the same
class of decoration as the footer dot-grid removed in `6a8697d`, left in place
here only because these files are being rebuilt rather than patched.

Check the remaining shells during the rebuild — `service/ServicePageShell`,
`l1/L1HubShell`, `editorial/EditorialLayout`, `editorial/LegalPageShell` all
declare one too.

## 3. Gradient text — renders, and is explicitly banned

DESIGN.md: "Don't introduce glass, backdrop blur, blurred orbs, or gradient text."

| File | Lines |
|---|---|
| `blocks/l2/L2PageShell.module.css` | 179, 283, 1125 |
| `blocks/l1/L1PageShell.module.css` | 201 |
| `blocks/hub/HubLandingSections.module.css` | 48 |

## 4. Off-scale values, and the literal backlog

Per v2.2 §4, literals in these files are tokenised **during** the rebuild, not
before. Known off-ramp values the detector flags: font sizes 34px, 28px, 24px,
13.5px, 12.5px, 14.5px, 16px, 18px; radii 16px, 14px, 10px; and literal colours
including `rgba(0, 0, 0, 0.5)`.

Aggregate design-hook findings currently parked, by file: `L1PageShell` **37**,
`L2PageShell` **29**, `HubLandingSections` **8**.

Also here: `L1PageShell.module.css:3098` `noDescendingSpecificity` — one of the two
known biome warnings. A hover rule declared before its base rule in a 3,000-line
stylesheet. Reordering it was judged too risky in a file scheduled for this
rebuild; the rebuild is where it gets fixed.

## 5. The register change itself

Move L1, L2 and service from one coherent dark surface to the light register, with
genuinely data-dense sections as inverted bands, **at most two per page**, exactly
as the homepage does. Canon §2 holds unamended.

Chat's deciding reason, worth keeping in view while rebuilding: these are the
primary organic entry points. A buyer searching "SAP contractors Dubai" lands on
`/platforms/sap`, never on the homepage — so dark here would make dark the brand's
first impression for most traffic.

**Report in §7:** whether the rebuild moved any contrast pair. `scripts/check-contrast.mjs`
covers the token pairs; the register change is exactly the kind of edit that breaks
one theme while fixing the other.

## 6. Sequencing

Step 6 (homepage critique) comes first and produces the validated patterns this
step applies — ruled in v2.0 §2.1, and correctly, against my own earlier
recommendation. Eight L1 pages get rebuilt once against proven patterns rather
than twice. Critique one L1 and one platform page after the rebuild, not before.
