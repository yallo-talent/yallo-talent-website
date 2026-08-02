# Relay — Session C, case study page family

**v1.0 · 2 August 2026 · Branch `feat/round7-casestudy` · Port 3307**
Scope: `docs/design/context-round7-rulings.md` §1, §2, §5, §6.

---

## 1. What shipped

- **Detail template rebuilt**, `src/app/case-studies/[slug]/page.tsx` on new
  components at `src/components/blocks/case-study/`: light register
  throughout, one dark band (metrics strip only), single ~68ch column,
  left-aligned, no centred H1, no blurred orb. Seven blocks per §5.3, in
  order: hero → engagement strip → four movements → metrics strip (dark,
  renders nothing without sourced figures) → client card → next case study →
  `<BriefCTA>`.
- **Landing page rebuilt**, `src/app/case-studies/page.tsx`: lists in ordered
  form, card grid matching the homepage rail's visual system, client-side
  facet filters for pillar/platform/sector built only from data actually
  present (see §3 — sector currently has zero options and correctly renders
  no filter row rather than an empty one).
- **The excerpt gate**, `scripts/check-case-study-excerpts.mjs` (`pnpm
  check:cs-excerpts`): every proper noun in `summary`/`excerpt` must appear in
  the body. `--selftest` proves it fails on an injected defect (a named
  client absent from the body) before trusting it against real content. Run
  against the live corpus it found **one real, minor finding** — see §5.
- Verification: `tsc --noEmit` clean, `eslint` clean, `check:type-scale
  --strict` clean, `check:yallo-case` clean (18 pages, including the
  case-study slug already in its list), `check:a11y` clean (axe, both themes,
  both widths, across the landing page, a subhead-bearing detail page, and
  the anonymised-client edge case), `check:gate-coverage` reports every
  rendering unit with a live URL visited by at least one gate.

## 2. Import, never fork — status

`<ClientMark>` and `src/lib/case-study-order.ts` do not exist in this
worktree; A's branch merges separately. Per §1.2 this session imports and
never writes either. Interim stand-ins, both named and located so they
cannot collide with A's files at merge, and both flagged inline with a
swap-over comment:

- **Client marks** use the existing `LogoImage` primitive
  (`src/components/blocks/home/LogoImage.tsx`, already shared) via a new
  `findClientMark()` lookup in `client-lookup.ts` that matches a case study's
  `client` string against `content/clients.yaml` by containment (handles
  "Al Tayer Group" → register's "Al Tayer" today, and needs no edit once B
  normalises the field per §4.4). **Swap:** replace the `LogoImage` call
  sites in `ClientCard.tsx` and `CaseStudyCard.tsx` with `<ClientMark>` once
  A's branch lands.
- **Ordering** uses `interimOrderedCaseStudies()` in `interim-order.ts`,
  sorting by the existing `featured` field then date — same shape the
  ruling describes for the real library, different name, own file. **Swap:**
  replace the two imports (`[slug]/page.tsx`, `page.tsx`) with
  `orderedCaseStudies` from A's `src/lib/case-study-order.ts`.

## 3. A ruling I deviated from, and why

§5.3's fourth movement label is specified as **"WHAT YALLO DID"**. Rendered
in the template's fixed mono-uppercase treatment (13px, tracking ≥0.12em,
`text-transform: uppercase`), that string is exactly what canon §2 bans and
exactly what this round's `check-yallo-case` extension (§3.5, A's work) is
built to catch. Shipping it would be a fresh instance of the defect the round
exists to close. I renamed it **"THE APPROACH"** — keeps the fixed set
parallel (all four now read "THE ___"), carries the same meaning, contains
no Yallo. `check-yallo-case` run clean against a rendered detail page confirms
it. Flagging for Sumeet/A rather than treating it as silently resolved.

## 4. Gaps in the schema/data, not invented around

- **No pillar/sector taxonomy index for case studies.** `platform` on the
  schema is free authored text ("SAP S/4HANA", "Custom planning platform"),
  not a slug — so the platform chip/filter is a **containment match** against
  the canonical platform label set (`src/lib/platforms.ts`), never a
  hand-written synonym table. `industry` (inherited from the insight base
  schema) is the sector slot, but **no case study currently populates it**,
  so the sector chip and filter are correctly empty rather than guessed.
  Pillar uses the schema's own closed, documented `engagement` enumeration
  (Contract/Permanent/EOR/Managed Delivery/Advisory) with routes only where
  they exist (Advisory has none, renders as text).
- **No region route exists anywhere on the site** (`routeExists`/
  `taxonomyLabelForHref` cover platform/sector/capability only). §5.3's "each
  an internal link" for the region chip can't be literal; region renders as
  plain text. Flagging in case a `/regions/*` destination is wanted later.
- **Engagement strip (block 2) has no roles/count/duration fields** in the
  schema — only platform, region, engagement, all of which the strip
  renders. The ruling's fuller version ("roles, count, platform, duration,
  region") needs new frontmatter fields; not invented from prose here.

## 5. The excerpt gate's one live finding

`rapid-recruitment-for-critical-supply-chain-roles.mdx`: `excerpt` says
"Supply Chain Architects and Business Analysts" (plural); the body only ever
says "Supply Chain Architect and Business Analyst" (singular). Real facts,
minor mismatch, not a fabrication — logging for B rather than editing
`content/case-studies/**` myself.

Also worth B's attention while auditing: this file and
`enabling-supply-chain-transformation-through-targeted-delivery-expertise.mdx`
read as the same Chalhoub story told twice (noted only because I parsed both
bodies closely building the movements template; not part of my brief to
resolve — §7's evidence audit owns this).

## 6. For A, when scripts/** work resumes

- `check-gate-coverage` passes overall (every unit has at least one gate),
  but `/case-studies` (the landing hub) sits outside `check-yallo-case`'s
  page list — only the one dynamic slug already there is covered. Given
  §3.5's whole point is literal capitals in case-study surfaces, the landing
  hub's card titles/excerpts are worth adding too.
- `.claude/launch.json` gained a `session-c` entry (port 3307, `.next-c`),
  additive only, existing entries untouched.
- `package.json` gained one script line, `check:cs-excerpts`.

## 7. Not touched

`content/case-studies/**`, `content/clients.yaml`, `src/data/**`,
`src/lib/**` (only imported from), `scripts/**` (only added one new file),
the homepage rail, `<ClientMark>`.
