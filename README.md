# Yallo Talent — talent.yallo.co

Enterprise platform talent across the Middle East and Europe. Next.js 16 App
Router, TypeScript strict, Tailwind 4, pnpm 10, Node 22. Statically generated,
no CMS.

## Run it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. `pnpm build && pnpm start` runs the production
build, which is what the performance gate is measured against — the dev server's
image optimisation is slow enough to skew it.

## Read these first

| File | What it is |
|---|---|
| [PRODUCT.md](PRODUCT.md) | Product truth. Users, positioning, taxonomy, banned terminology, and the absences that must not be filled by invention |
| [DESIGN.md](DESIGN.md) | The visual system. Tokens are normative; the prose says how to apply them. Ends with a record of every departure from the design prototype |
| [AGENTS.md](AGENTS.md) | Ownership, ground rules, phase order, the pre-launch gate |

If a change contradicts any of the three, raise it rather than working around it.

## The rules that will bite you

**Colour.** Raw hex lives in exactly one place: `src/app/globals.css` Layer 1.
A pre-commit hook rejects it anywhere else. Both themes must pass WCAG 2.2 AA
independently — `pnpm check:contrast` verifies all 32 rendered token pairs and
fails the build on any miss.

**Terminology.** "GCC", "KSA", "subcontract", "Bangalore" and "UK · ME · India"
are banned for commercial reasons, not stylistic ones. `pnpm check:terms`
enforces it; `--fix` applies the mechanical replacements. The reasoning is in the
script header.

**Nothing invented.** No fabricated people, quotations, clients, metrics or case
studies. Every client on the site carries `consentOnFile: true` in
`content/clients.yaml`; every published metric has a definition in
`content/metrics.yaml`. Where something is missing, the component renders
nothing rather than a placeholder — see the testimonial slot in
`src/data/home/intelligence.ts`.

**No photography.** Canon forbids stock imagery and there are no licensed
assets. Surfaces that used to hotlink Unsplash now draw a `PetalPlate`, a
composition generated from the page's own slug.

## Layout

```
src/app/                routes
src/components/blocks/home/    the homepage, one section per file
src/components/blocks/l1,l2/   sector and function templates (dark register)
src/data/               all copy. Components hold no strings
src/data/platforms/     platform coverage, derived from sector data
content/                MDX case studies and insights, plus YAML registers
scripts/                the guards and the content pipelines
assets/client-logos/    source logo pack for scripts/build-logos.mjs
```

Content is separated from render throughout. If you find a user-facing string in
a component, it belongs in `src/data/`.

## Checks

```bash
pnpm lint            # biome
pnpm typecheck       # tsc --noEmit
pnpm check:terms     # banned terminology
pnpm check:contrast   # WCAG 2.2 AA, both themes
pnpm test            # playwright
pnpm check:visual    # both themes at 1280 and 360, plus served-HTML assertions
```

`pnpm check:visual` needs a server running. It asserts the things that silently
regress: that real metric values are in the server-rendered HTML rather than
zeros, that no banned term reaches the page, that nothing overflows at 360px,
and that no image fails to render.

## Content pipelines

Both read saved HTML and write MDX. Neither paraphrases — they convert structure
and apply the terminology sweep, reporting every substitution.

```bash
node scripts/extract-case-studies.mjs --dry   # report without writing
node scripts/build-logos.mjs                  # regenerate logo assets
```

`content/*.yaml` is **not** part of Next's build-cache key. After editing one,
`rm -rf .next` before rebuilding or you will serve the previous prerender and
lose an hour wondering why.

## Deployment

`NEXT_PUBLIC_SITE_URL` drives canonicals, Open Graph and the robots policy. Any
host that is not the production domain is `noindex`. `NEXT_PUBLIC_DEFAULT_THEME`
switches the site-wide default register without touching a component.
