# The /jobs host hop: measured, and it is not in this repository

**Filed 10 August 2026, round 27. For Raphy Varghese, to act on at DNS cutover.**

Relay v37's read-only smoke observed a redirect hop on `/jobs` and the round 27
brief asked where it originates: repo-origin means fix it to one canonical host,
infrastructure-origin means file it with evidence and touch nothing. It is
infrastructure-origin. **Nothing in this repository was changed.**

## What was measured

Every request below was made with a browser user agent, 10 August 2026, from
Dubai (`cf-ray` … `-DXB`).

| Request | Status | `location` | `server` |
|---|---|---|---|
| `https://talent.yallo.co/jobs` | 301 | `https://yallo.co/jobs` | cloudflare |
| `https://yallo.co/jobs` | 301 | `https://www.yallo.co/jobs` | cloudflare |
| `https://www.yallo.co/jobs` | 200 | — | cloudflare |
| `https://yallo-talent-ohog5.ondigitalocean.app/jobs` | **200** | — | cloudflare |
| `http://localhost:3000/jobs` (this build) | **200** | — | — |

Two hops to reach a 200 from `talent.yallo.co/jobs`, and the final URL is
`https://www.yallo.co/jobs`.

## Why it is not ours

- **The app answers 200 on its own ingress.** `yallo-talent-ohog5.ondigitalocean.app/jobs`
  returns 200 with no `location`, and so does this build served locally. The
  application emits no host redirect on this path, or on any path.
- **Neither responding 301 carries an application header.** No `x-powered-by`, no
  Next.js marker, no DigitalOcean marker. `server: cloudflare` on both, and the
  bodies are `text/html` from the edge rather than from a rendered route.
- **The string does not exist in the repository.** `www.yallo` appears in exactly
  one file, `scripts/extract-case-studies.mjs`, and only inside the source URLs of
  the nine imported case studies — historical `sourceUrl` values that record where
  each study came from. It appears in no middleware, no `next.config.ts`, no
  `src/data/redirects.mjs` and no `robots.ts`.

Both 301s are Cloudflare rules on the currently live site, which is the
pre-cutover WordPress estate, not this application.

## The two things worth Raphy's attention

1. **Apex to `www` on `yallo.co`.** Canon is unambiguous that `yallo.co` is Yallo
   Talent's own domain and the destination that carries the accumulated
   authority. A rule that permanently redirects the apex to `www` makes `www` the
   canonical host, which is the opposite of that. At cutover, this rule decides
   which host the site actually serves from, and it currently answers `www`.

2. **`talent.yallo.co` redirects to the apex.** AGENTS.md records that
   `talent.yallo.co` exists only as a pre-cutover placeholder and stays `noindex`
   per `robots.ts`. Right now an edge rule sends it to `yallo.co` before any
   application code runs, so the placeholder is not serving the placeholder — the
   `noindex` the repository sets never reaches a crawler that starts at that host.
   Worth confirming this is intended rather than left over.

## What this repository already asserts, so it is not asked for twice

`scripts/check-no-redirect-hops.mjs` (`pnpm check:no-redirects`) fails on any
internal link that resolves through a redirect, and `scripts/check-redirects.mjs`
covers the content redirect table. Both are green. They measure paths within one
host; a host-level rule at the edge is outside anything this repository can see
or assert, which is why this is a filing rather than a fix.

## Reversal

Nothing to reverse. No file in this repository changed for this item.
