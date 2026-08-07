# Cutover readiness — yallo.co

**Measured 7 August 2026, round 20. HEAD `8890f89`.**

Every line below was measured this round, on a production build (`pnpm build`
then `next start`, port 3115) unless the line says otherwise. Nothing here is
aspiration, and nothing here is inherited from an earlier round's report. Where
something was not measured, it says so rather than being omitted.

This is the artefact the go-live decision is taken on.

---

## 1. Build gates, with real exit codes

Run against `http://localhost:3115` on a production build. Browser gates were run
serially: concurrent Chromium starves the image optimiser and produces a load
timeout that looks like a page fault.

| Gate | Command | Exit | In CI |
|---|---|---|---|
| Types | `pnpm tsc --noEmit` | **0** | yes |
| Terminology | `pnpm check:terms` | **0** | yes |
| Blurred orbs | `pnpm check:orbs` | **0** | yes + pre-commit |
| Contrast (source tokens) | `pnpm check:contrast` | **0** | yes |
| Contrast (rendered pixels) | `check-rendered-contrast.mjs` | **0** | **no — see §6** |
| Taxonomy | `pnpm check:taxonomy` | **0** | yes + pre-commit |
| Case-study excerpts | `pnpm check:cs-excerpts` | **0** | yes |
| Type scale (source) | `pnpm check:type` | **0** | yes + pre-commit |
| Type scale (rendered) | `check-rendered-type.mjs` | **0** | yes |
| Robots, non-production branch | `pnpm check:robots` | **0** | yes |
| Robots, production branch | `NEXT_PUBLIC_SITE_URL=https://yallo.co pnpm check:robots` | **0** | yes, own workflow |
| Prose rules | `pnpm check:prose` | **0** | yes |
| Visual and served markup | `pnpm check:visual` | **0** | yes |
| Accessibility (axe) | `check-a11y.mjs` | **0** | yes |
| Reduced motion | `pnpm check:motion` | **0** | yes |
| Interaction | `check-interaction.mjs` | **0** | yes |
| Reflow, 320 and 360 | `pnpm check:reflow` | **0** | yes |
| Yallo casing, rendered | `pnpm check:yallo-case` | **0** | yes |
| Estate band interaction | `check-estate-interaction.mjs` | **0** | yes |
| Mark scale | `check-marks.mjs` | **0** | yes |
| Gate coverage | `check-gate-coverage.mjs` | **0** | yes |
| No internal redirect hop | `check-no-redirect-hops.mjs` | **0** | yes |
| Metrics attribution | `check-metrics-attribution.mjs` | **0** | yes |
| Metrics agree with dataset | `pnpm check:metrics` | **0** | yes, new this round |
| Research dataset | `pnpm check:research-dataset` | **0** | no |
| Asset case | `pnpm check:asset-case` | **0** | pre-commit |
| Admin isolation | `check-admin-isolation.mjs` | **0** | yes |
| Admin panes render | `check-admin-render.mjs` | **0** locally, **1 in CI** | yes, new this round — see the CI note below |
| Write path invariants | `pnpm check:write-path` | **0** | yes, new this round |
| CTA collision | `pnpm check:cta-collision` | **0** | no |
| Nav promise | `pnpm check:nav-promise` | **0** | no |
| **Phase 8 performance** | `pnpm check:phase8` | **1 — FAILS** | own workflow, failing |
| ESLint | `npx eslint src scripts` | **1 — FAILS** | **no**, CI lints with Biome |

Two reds locally, both covered in §6. A third appears only in CI and is covered
directly below.

`check:assistant-links` is **not represented above**: it needs
`ANTHROPIC_API_KEY`, which is not set anywhere this round could reach. See §6.

### CI state on final HEAD

**CI on `8890f89`: 35 of 36 steps green. One red.**

Everything passes except the last gate, `Admin cockpit renders`, which fails
`sign-in did not produce a session` in all four theme/width contexts and measures
0 of 28 panes. The gate is behaving correctly — round 19 ratified that it fails
rather than skips when it cannot sign in.

**The cause is measured, not inferred, and it has one owner.** The committed
`src/lib/admin/password.ts` calls `scryptSync` at `N = 2^15` without raising
`maxmem`. That is exactly node's 32 MiB default ceiling, so the call throws
`ERR_CRYPTO_INVALID_SCRYPT_PARAMS` and no password can verify. Reproduced
directly against the file as committed at HEAD:

```
committed password.ts THROWS: ERR_CRYPTO_INVALID_SCRYPT_PARAMS
```

**The fix already exists and is uncommitted in Sumeet's working tree**, alongside
the matching change to `scripts/admin-password-hash.mjs` and `.env.example`. It
derives `maxmem` from the cost rather than hardcoding it. Round 20 was instructed
not to touch those three files, so it did not.

**Owner: Sumeet. Committing those three files should turn CI green.** Until then
the cockpit's rendered-accessibility gate does not run in CI, and local runs are
the only evidence for it — `check:admin-render` exits 0 locally over 6 panes ×
2 themes × 2 widths, signed in, plus the discovered conversation-detail route.

The four runs before this one all failed at the a11y step instead. That is fixed:
see the note below.

### The a11y step: cause found and fixed

The `Accessibility (axe, both themes, 1280 and 360)` step failed **four** CI runs
across three commits, always on `/`, always `page.goto: Timeout 60000ms exceeded`.

It was never a regression, and that is measured: re-running the job unchanged on
`07db8e2` — already green that morning — failed identically.

A retry was tried first and **disproved by the next run**: the second navigation
timed out too. A server that fails twice at 60s is not slow, it is wedged.
`next/image` optimises on demand and a starved optimiser key stays stuck for the
lifetime of the process, so later requests for that image wait on a lock nothing
releases and `load` never fires. `check:visual` pulls the homepage through four
viewports on a two-core runner immediately before, and a11y's first route is that
same homepage.

A process cannot recover from it, so CI now **retires that server and gives the
browser gates a clean one** against the build that already exists. The retry was
removed. On `8890f89` the a11y step passed, along with every browser gate after
it.

---

## 2. Parity checks

| Check | Result |
|---|---|
| `sitemap.xml` entries | **174** |
| `llms.txt` entries | **174** |
| Paths in sitemap but not llms.txt | **none** |
| Paths in llms.txt but not sitemap | **none** |
| `/admin` paths in either | **none** |
| Every internal href resolves | yes — `check:yallo-case`, exit 0 |
| Every internal href resolves in ONE hop | yes — `check-no-redirect-hops.mjs`, exit 0 |
| Every rendering unit visited by a gate | yes — `check-gate-coverage.mjs`, exit 0, 10 lists read from source, none stale |

### Robots, both environment branches asserted

`robots.ts` branches on `NEXT_PUBLIC_SITE_URL`, which is inlined at build time,
so each branch needs its own build. Both were built and asserted this round.

- **Non-production** (the `talent.yallo.co` placeholder posture, and every
  preview): `Disallow: /` for every user-agent group. Exit 0.
- **Production** (`NEXT_PUBLIC_SITE_URL=https://yallo.co`): 15 user-agent groups,
  each `Allow: /` with five disallowed paths — `/api/`, `/users/`, `/admin/`,
  `/downloads/`, `/intelligence/research/corridor/print`. Sitemap declared at
  `https://yallo.co/sitemap.xml`. Exit 0.

The admin surface is excluded four independent ways: absent from `sitemap.xml`,
absent from `llms.txt`, `Disallow: /admin/` in every robots group, and an
`X-Robots-Tag: noindex` header on every response. All eight admin routes are read
from the app tree rather than a maintained list, so a route added tomorrow is
covered by being in the directory.

---

## 3. The write pane: exactly what was watched

Round 20 §2.1 required the first real publish to be watched rather than inferred.
This is what was observed, stage by stage. Nothing below is inferred.

| Stage | Observed |
|---|---|
| Configuration | `ADMIN_GITHUB_TOKEN` present and valid; the API returned `full_name: yallo-talent/yallo-talent-website`, `allow_auto_merge: true`, `default_branch: main`, admin+push permission |
| Publish issued | A reorder executed from `/admin/case-studies` in a browser, signed in |
| Branch created | `admin/2026-08-07T07-29-20-906Z` |
| Commit | `content/case-studies/order.yaml`, and nothing else |
| Pull request | **#13**, opened, title `data(case-studies): reorder from the admin cockpit` |
| Diff | Exactly the two lines that swapped. Header and per-slug client column intact |
| CI | Ran on the pull request. Concluded **failure**, at the a11y step described in §1 — the same flake, on a branch whose only change is one YAML line |
| Auto-merge | **REFUSED by GitHub**, verbatim: `Pull request is in unstable status` |
| Merged to `main` | **No** |
| Rendered on the site | **No** — nothing merged, so there is nothing to render |

**Auto-merge is refused for a reason that is not the repository setting.**
`allow_auto_merge` is true. `main` carries **no branch protection and no required
status check**, so nothing blocks the merge, and GitHub will not queue auto-merge
behind a check that is not required. The module did what it is built to do:
reported it and left the pull request open. It did not merge, and it must not —
a merge performed by the module lands on `main` without waiting for anything.

**PR #13 is still open.** It was deliberately not merged: §2.1 rules that when
auto-merge is off the correct outcome is to watch to the open pull request and
report waiting.

**What this means for the claim "the cockpit can publish".** It can create a
branch, commit under `content/`, and open a pull request — all watched. It cannot
yet publish unattended, because publishing unattended requires auto-merge, and
auto-merge requires a required status check on `main`. That is one repository
setting away, and it is in §5.

### Lifecycle, round 20 §2.2

Add, reorder, **edit** and **unpublish**, all on the one pull request path.
Unpublish is `published: false`; there is no deletion path from the cockpit.

Validation runs **before** any pull request opens, against the build's own
`caseStudyFrontmatterSchema`. Watched: setting `clientPublic` false on a study
whose title names the client returned four errors, per field, naming `title`,
`cardTitle`, `excerpt` and `body`, and opened no pull request. An empty body
returned one error. Neither reached GitHub.

`check:write-path` covers reorder, edit and unpublish at 47 assertions, and was
**proved red first** on the new order.yaml-preservation invariant — exit 1 naming
both the discarded header and the dropped per-slug comments — before it was
trusted.

---

## 4. Assistant

| Item | State |
|---|---|
| `check:assistant-a11y` | exit 0 |
| `check:assistant-links` | **not run this round, and not runnable in CI** — needs `ANTHROPIC_API_KEY` |
| Transcript retention | 365 days, from `src/lib/assistant/retention.json`, imported by the purge, `/privacy` and the panel rather than restated |
| Scheduled purge | **Working.** Diagnosed and fixed this round: the daily run failed with `DATABASE_URL is not set`; the secret was added at 06:50 and a `workflow_dispatch` run at 07:12 concluded **success** |
| Ships ON | `NEXT_PUBLIC_ASSISTANT_ENABLED` is set |
| Transcripts held | 94 conversations within the retention window |

---

## 5. Human items, with owners

### Sumeet

| Item | Note |
|---|---|
| **A required status check on `main`** | The single thing standing between the cockpit and unattended publishing. Until it exists, every cockpit publish waits for a human to merge, and PR #13 is the standing example |
| **Merge or close PR #13** | Open since 07:29 today. Its CI red is the §1 flake, not the diff |
| `ANTHROPIC_API_KEY` as a repository secret | Until it is set, `check:assistant-links` protects nothing in CI. It is charged per run, which is why this round did not set it |
| Phase 8 performance gate | See §6. Needs a decision: measure on the production host, or accept |
| Wickes | Retire the asset or make it a real one |
| Heading fade in incognito | Reported, not yet reproduced under measurement |
| One attributed testimonial | The slot renders nothing until all four fields are real. No placeholder |
| Sourced FAQ questions | Content-gated |
| Client-logo `consentOnFile` flags | The cockpit now surfaces `clientPublic` per study and refuses a draft that names a client the flag says may not be named |
| The 42 prose figures | R-A9: these are Sumeet's. `check:metrics` reports them, never rewrites them |
| Credential-backup directory deletion | Outstanding |
| Go-live date | Outstanding |

### Raphy (game plan §12)

DNS and cutover · redirect map deployment · WordPress teardown · Volcanic wiring ·
CDN/WAF retrieval-crawler confirmation · production `RESEND_*` with SPF and DKIM.

### Rides with cutover

Top-50 rank baseline · server-log baseline · citation-share snapshot. None can be
taken before the domain serves the new site.

---

## 6. The two reds, named with their owners

### Phase 8 performance gate — `check:phase8` exit 1

Measured this round, production build, `next start`, Lighthouse mobile:

| Route | Mobile | LCP |
|---|---|---|
| `/` | 96 | 2.67s |
| `/contract` | 87 | 3.93s |
| `/platforms/sap` | 86 | 4.15s |
| `/capabilities/data-analytics` | 86 | 4.08s |
| `/industries/retail` | 86 | 4.08s |
| `/industries/retail/customer-experience` | 89 | 3.69s |
| `/case-studies/oracle-hyperion-…` | 95 | 2.87s |
| `/brief` | 86 | 4.22s |

Against AGENTS.md's gate: **Lighthouse Mobile 90+ misses on 7 of 8. LCP < 2.5s
misses on 8 of 8.** CLS passes 8 of 8 (worst 0.040). TBT passes 8 of 8 (worst
30ms). The scheduled `phase8.yml` workflow has been failing on the same criteria.

**The honest caveat, and it matters.** These numbers come from a laptop serving
`next start` over loopback under Lighthouse's simulated mobile throttling. They
are not the production numbers: on Vercel with a CDN, cache headers and real
edge delivery, LCP is a different measurement. **Nobody has measured this site on
the host it will actually run on, because that host is not serving it yet.**

So this red is real and unresolved, and it cannot be closed from here. Either it
is measured on the production host before the DNS switch — a Raphy dependency —
or it is knowingly accepted and measured immediately after. It should not be
closed by adjusting the gate.

### ESLint — `npx eslint src scripts` exit 1, 23 errors

Not a CI gate: CI lints with Biome (`pnpm biome check .`, exit 0). The 23 errors
are pre-existing and none is in code this round touched — chiefly unescaped
entities in `CvUploadForm.tsx` and an `@next/next/no-assign-module-variable` in
`src/data/platforms/derive.ts`. Owner: whoever picks up the lint debt. It blocks
nothing.

---

## 7. Out of scope, as ruled

Phase 8 resumes post-cutover on field data · GitHub App migration · multi-user
cockpit auth · cockpit article authoring · `/saudi-arabia` and regional pages ·
FAQ blocks (content-gated) · testimonial slot population.

The Cowork-watcher idea was evaluated and **rejected** on 7 August: an unattended
job holding repository credentials is a direct push wearing a different hat.

---

## 8. What this report does not say

It does not say the site is fast on its production host, because that has never
been measured. It does not say a cockpit publish reaches `main` unattended,
because one never has. It does not say `check:assistant-links` is protecting the
assistant in CI, because it is not running there. Each of those is a specific
gap with a specific owner above.
