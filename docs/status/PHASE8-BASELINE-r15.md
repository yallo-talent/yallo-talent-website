# Phase 8 baseline — round 15

**Measured 6 August 2026. `main` at `48ea940`. Measurement only; nothing was
changed to produce these numbers, per `context-round15-scope.md` §4.**

This file exists because round 14's numbers no longer describe `main`. Both
round 14 branches moved LCP inputs, and round 14 itself never ran
`check:phase8` — `docs/relay/v22-A.md` records it as explicitly not attempted
under §4 of that round's scope. **There is therefore no like-for-like round 14
figure to diff against.** This is a new baseline, not a delta.

## Conditions

| | |
|---|---|
| Commit | `48ea940`, the tip of `main` after round 15's three fixes |
| Build | production, `NEXT_DIST_DIR=.next-r15`, built fresh on this commit |
| Server | `next start` on 3115, confirmed by `lsof` to be the process serving |
| Settled | every measured route fetched once and returning 200 before measuring |
| Machine | quiet — the round 14 demo server on 3214 and both flag-on servers stopped, `lsof` on 3000–3299 empty before the build |
| Lighthouse | 12.8.2 |
| Passes | 4 |

## Worst pass per route

The gate is judged on the worst pass, not the median or the best.

| Route | Perf | LCP | CLS | TBT |
|---|---|---|---|---|
| `/` | 86 | 4.12s | 0.000 | 12ms |
| `/platforms/sap` | 86 | 4.08s | 0.001 | 14ms |
| `/contract` | 87 | 3.93s | 0.016 | 9ms |
| `/capabilities/data-analytics` | 87 | 3.94s | 0.000 | 13ms |
| `/industries/retail/customer-experience` | 87 | 3.93s | 0.000 | 14ms |
| `/industries/retail` | 88 | 3.93s | 0.000 | 10ms |
| `/brief` | 89 | 3.77s | 0.003 | 12ms |
| `/case-studies/oracle-hyperion-financial-management-hfm-implementation` | 91 | 3.40s | 0.040 | 12ms |

## Gate

| Criterion | Result |
|---|---|
| Lighthouse Mobile 90+ | **MISS — 7 of 8 below.** Only the case study clears, at 91 |
| LCP < 2.5s | **MISS — 8 of 8 above.** Worst 4.12s, best 3.40s |
| CLS < 0.1 | PASS — 8 of 8, worst 0.040 |
| TBT < 200ms | PASS — 8 of 8, worst 14ms |

Accessibility scored 100 on seven routes and 97 on `/`; best practices 100
throughout. SEO reads 66–69 because the placeholder host is deliberately
noindex — not a defect, and it will move on cutover.

WCAG 2.2 AA is not judged by this gate. `check:a11y` owns it, across both
registers at two widths, and it sees rules the Lighthouse category weights at
zero. INP is a field metric; the TBT column is its lab proxy, and a green TBT
is not a green INP.

## What the diagnostics say

LCP is a **text node on all eight routes** — a hero lede, a hero sub, an `h1`
or a standfirst. Not an image, not a font swap, not a script.

| Route | Render-blocking |
|---|---|
| `/contract` | 564ms |
| `/capabilities/data-analytics` | 538ms |
| `/` | 517ms |
| `/industries/retail/customer-experience` | 406ms |
| `/industries/retail` | 404ms |
| `/platforms/sap` | 403ms |
| `/brief` | 119ms |
| `/case-studies/…hfm-implementation` | 116ms |

The two fastest routes are the two with the least render-blocking CSS, by a
factor of roughly four. `font-display` passes on every route, so font
*delivery* is not swapping late; unused JS sits in a narrow 112–124 KiB band
across all eight and does not explain the spread. The spread is the blocking
CSS, and nothing else in the diagnostics tracks it.

That is the same conclusion round 13 reached and round 12 tested: `cssChunking:
'strict'` does not fix it on Turbopack. `context-round15-scope.md` §4 assigns
render-blocking CSS and font delivery to round 16, and this run does nothing
about either.

## For the go-live decision

Unchanged and not Code's to make (`context-round14-scope.md` §5.7): cutover
either waits for 2.5s, or proceeds on a documented miss with a stated plan.
This file is that documentation. The miss is real, it is consistent across
four passes, and it has one identified cause with a round already assigned
to it.
