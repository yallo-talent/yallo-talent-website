# Capabilities v6.0 — session B, round 7

**2 August 2026 · branch `feat/round7-content`**
Answers `docs/design/context-round7-rulings.md` §1, §2, §4, §7.

---

## 1. Process

`git status` clean, `git rev-list --left-right --count main...HEAD` returned
`0 0`, all fourteen `docs/design/context-*.md` present at cut time. `.claude/launch.json`'s
stale `session-b` entry (port 3002, round-4 leftover) is updated to port 3207
with its own `NEXT_DIST_DIR=.next-b-r7`, per this round's assignment.
`tsconfig.json` was rewritten by `next dev` for the custom dist dir and
reverted before staging, per the standing rule.

`content/case-studies/order.yaml` was not written — that ships from A.
`<ClientMark>` was not forked — nothing in this run needed it directly; the
logged items in §5 will need it once wired.

---

## 2. The evidence audit — §7

### 2.1 Source of truth

Not `content/case-studies/` on its own authority — that is the mechanism, but
the actual source of truth each entry claims is named in its own frontmatter:
`sourceUrl`, a link to the specific post on the live **yallo.co**. `Evidence.tsx`
(A's, unmodified) reads every `.mdx` in that directory via `getAllCaseStudies()`
and renders every entry carrying `published: true` and a `featured` rank — 14 of
14 qualified before this audit, which is exactly the defect: the render gate
checks internal consistency, never the external claim.

### 2.2 The audit method

Live yallo.co's `/case-studies/` index was read in full (lazy-loaded list,
confirmed complete once the "Our Services" footer appeared with no further
growth on scroll): **12 case studies actually publish there.** Each local entry
was then checked directly against its own claimed `sourceUrl`. A sanity check
first confirmed the mechanism works (`?case-study=oracle-hyperion-financial-management-hfm-implementation`
resolved to the correct live post).

### 2.3 The mapping table

| Local slug | Client (frontmatter) | Live match | Verdict |
|---|---|---|---|
| building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets | Al Othaim Markets | Title match on live index | **Keep** |
| defining-a-target-operating-model-for-sephora-middle-easts-digital-carve-out | Sephora Middle East | Title match on live index | **Keep** |
| driving-consistent-it-delivery-across-a-complex-retail-technology-landscape | Alshaya Group | Title match on live index | **Keep** |
| enabling-azure-data-platform-delivery-at-enterprise-scale | Alshaya Group | Title match on live index | **Keep** |
| enabling-sap-s-4hana-transformation-for-al-tayer-group | Al Tayer Group | Title match on live index | **Keep** |
| enabling-supply-chain-transformation-through-targeted-delivery-expertise | Chalhoub Group | Title match on live index | **Keep** |
| engineering-a-custom-planning-platform | Alshaya Group | Title match on live index | **Keep** |
| optimising-enterprise-it-delivery-through-a-unified-partner-model | Majid Al Futtaim | Title match on live index | **Keep** |
| oracle-hyperion-financial-management-hfm-implementation | Majid Al Futtaim | Title match on live index; sourceUrl resolves directly | **Keep** |
| unlocking-cost-efficiency-across-multi-platform-enterprise-it-landscape | Majid Al Futtaim | Title match on live index; sourceUrl resolves directly | **Keep** |
| enabling-accurate-asset-governance-through-oracle-fusion-fixed-assets | "Undisclosed enterprise" | **Real, live** (as "A large enterprise…", same anonymisation the source itself uses) | **Deleted anyway — §7.5 is explicit and unconditional on the placeholder client string, not on sourcing** |
| rapid-recruitment-for-critical-supply-chain-roles | Chalhoub Group | `sourceUrl` **404s** on live yallo.co | **Deleted — no source** |
| rapidly-building-a-high-performing-azure-data-engineering-team | Alshaya Group | `sourceUrl` **404s** on live yallo.co | **Deleted — no source** |
| reducing-time-and-materials-cost-for-majid-al-futtaim | Majid Al Futtaim | `sourceUrl` resolves to an **unrelated** insight article, not this case study | **Deleted — no source** |

**Result: 10 entries survive, 4 deleted.** Each deleted entry is exactly the
sibling of a surviving one for the same client and near-identical theme
(Chalhoub supply-chain roles, Alshaya Azure data team, MAF cost-cutting) — the
near-duplicate signature the ruling described was the tell, and the live-site
check confirms which twin is real in each pair.

### 2.4 Where this differs from the brief's working assumption

§4.1 and §7 both write "eight real published case studies" as the expected
count. The measured count is **10**, not 8. Two of the survivors — "Unifying
MAF's multi-vendor IT delivery model" and "Consolidating Alshaya's multi-vendor
IT delivery into one model" — are the exact pair §7's "what is visibly wrong"
section names as reading like the same story against two clients. Both verify
independently on the live site as genuinely separate, real, published posts for
two different clients; Yallo's own case-study copywriting simply reuses a
template across real engagements. §7's own instruction governs here over its
own illustrative estimate: "the count is the test" is conditioned on "if eight
published sources exist" — the audit found ten, and invented deletions to hit a
number nobody had verified would have violated the discipline against writing
rather than sourcing. Flagging the discrepancy rather than silently reconciling
it, per the session's own measure-before-diagnose instruction.

**Live yallo.co carries one more published case study this site's rail has
never had a local file for** — "Ensuring Reliable Oracle EBS Integrations for
Mission-Critical Enterprise Systems" (TCS, Saudi Arabia). Not added: nothing in
§7 asks for new entries, only deletion of unsourced ones, and adding content is
authoring outside a deletion audit's mandate. Logged for Sumeet.

---

## 3. Literal "YALLO" — §4.2

Swept `YALLO` → `Yallo` (canon §2, capital Y only) across all ten surviving
`.mdx` bodies and frontmatter `deck` fields — 27 occurrences across 10 files.
The four deleted files carried further occurrences that went with them.
`grep -rn "YALLO" content/case-studies/*.mdx` now returns nothing.

---

## 4. Blue Yonder mark path — §4.3

`src/data/home/place.ts`'s `blue-yonder` platform entry carried
`mark: "/logos/platforms/sap.svg"` — copy-adjacent to the SAP entry above it in
the same array, publishing SAP's mark under Blue Yonder's name and label on the
homepage platform axis. Fixed to `/logos/platforms/blue-yonder.png`, the asset
that already exists in the pack. Verified in the running preview: the `<img>`
now resolves through Next's image optimiser to
`/_next/image?url=%2Flogos%2Fplatforms%2Fblue-yonder.png…`, confirmed 200 with
`content-type: image/png` via direct request. The other five platform mark
paths (`sap.svg`, `oracle.svg`, `microsoft.svg`, `salesforce.svg`,
`workday.svg`) were checked against `public/logos/platforms/` and all resolve
to the vendor they claim; `informatica` stays `mark: null` by design (no
platform-desk asset exists, documented in place.ts).

---

## 5. Logged for A — components outside my territory

Two derivation-class fixes need a component change I cannot make under this
round's file split (`src/data/**` and `content/**` only).

**§4.4 — client display name.** Added `clientDisplayNameFor(client: string)` to
`src/data/home/client-logos.ts`, alongside the existing `clientLogoFor`. It
resolves a raw name through the same register and `ALIASES` map ("Sephora
Middle East" → "Sephora") and falls back to the input unchanged when nothing
matches. **`Evidence.tsx` line ~32 still reads `s.frontmatter.client` directly**
for the card's displayed name; it needs to call `clientDisplayNameFor(s.frontmatter.client)`
instead. Confirmed live in preview: the Sephora card still reads "Sephora
Middle East" pending this wiring.

**§4.5 — client rail membership.** Confirmed in the running preview:
`public/logos/clients/` has no `sephora.png`, `wickes.png` or `radwell.png`,
even though `content/clients.yaml` declares `logo:` paths for all three with
`consentOnFile: true`. `LogoRail.tsx`'s `hasLogoAsset` check correctly finds
them missing, but the component's fallback — `<span className={styles.wordmark}>{c.name}</span>`
— renders them as text inside the mark rail rather than excluding them, which
is what canon §8's "uniform marks" requirement and this ruling both call for.
**`LogoRail.tsx` needs the fallback branch changed to exclude those clients
from `LogoItems` rather than rendering their name**, not to touch case-study
cards, which is a separate surface and unaffected. I did not set
`consentOnFile: false` for these three in the register — that flag means
"no permission to name this client anywhere" and would be false for the
case-study cards too, which is the wrong scope for a purely missing-asset
problem.

**§4.7 — step badges.** `screenSteps` in `src/data/home/screen.ts` carried an
`actor: "You" | "We" | "You and we"` field that rendered "YOU AND WE" / "WE" via
the design system's uppercase eyebrow class (canon §2's known mechanism — the
source itself was never capitalised). Removed the field and its four values
entirely, since a "we" label on three of four cards carried no information, per
the ruling. This leaves one dangling reference: **`TheScreen.tsx` lines 44–48**
(a comment plus `<span className={styles.stepActor}>{s.actor}</span>`) need
deleting — confirmed via `tsc --noEmit`, which reports exactly one error,
`TS2339: Property 'actor' does not exist on type 'ScreenStep'` at that line.
Verified in the running preview that this type error does not block rendering
under `next dev`: the homepage compiled and served correctly with no "WE" text
visible anywhere on the page, but the dangling JSX reference should be removed
at merge so the type error does not persist.

---

## 6. Commitment section — §4.6

`src/data/home/commitment.ts`: `commitmentColumns` reordered to Contract before
Permanent (canon §1's lead pillar; the array previously read Permanent-first).
`kind: "Contract hiring"` → `"Contract workforce"`, which renders as the
eyebrow "CONTRACT WORKFORCE" through the same uppercase mechanism as the step
badges above — a copy change, not a literal-caps one. `"Permanent hiring"`
unchanged. `commitmentCopy.heading` set to exactly **"What sits in the
agreement, not just in the pitch."** Both confirmed rendering correctly in the
running preview, in the new order.

---

## 7. Lint

`npx eslint src scripts`: **37 errors, 13 warnings** — identical to the round-6
baseline recorded at merge base `main` (`2c613dd`). None of the errors or
warnings fall in any file this session touched
(`place.ts`, `commitment.ts`, `screen.ts`, `client-logos.ts`, the surviving
`.mdx` files). Zero new lint issues introduced.

`tsc --noEmit`: one error, the logged `TheScreen.tsx` dependency at §5.

---

## 8. Summary of file changes

- **Deleted** (§7): 4 unsourced `.mdx` case studies, listed in §2.3.
- **Modified**: 10 surviving `.mdx` case studies (casing only, §3).
- **Modified**: `src/data/home/place.ts` (Blue Yonder mark path, §4).
- **Modified**: `src/data/home/client-logos.ts` (new export, §5).
- **Modified**: `src/data/home/commitment.ts` (order, eyebrow, headline, §6).
- **Modified**: `src/data/home/screen.ts` (removed `actor`, §5).
- **Modified**: `.claude/launch.json` (`session-b` port 3002 → 3207, own dist dir).
- **Not touched**: `content/case-studies/order.yaml` (A's), any file under
  `src/components/**`, `src/lib/**`, `scripts/**`, `src/app/case-studies/**`.
