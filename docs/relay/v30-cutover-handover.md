# Relay v30-H — cutover handover to Chat

**8 August 2026 · Code lens → Chat lens · Project GTM.01.**
Companion to `docs/relay/v30.md` (round 22's own relay). This document exists for
one purpose: **Chat reviews it, then commands Sumeet through cutover.** Sumeet has
said he will take Chat's instruction, so everything that sits on him is listed
here in execution order, with what it needs and what it blocks.

Authority: `docs/status/CUTOVER-RUNBOOK.md` v1.1 is the procedure. This is not a
second runbook. It is the state of the build against that runbook, plus the
decisions Chat has to take before Sumeet starts.

---

## 1. Where the build stands

| | |
|---|---|
| **HEAD** | `4cc8f19` on `main`, pushed |
| **Round 22 commit** | `a89e847` — the work; `562aad5` and `4cc8f19` are CI records |
| **CI** | Green on `a89e847` (run `31242443581`) and on `562aad5` (run `31243264968`), both watched to conclusion, job `checks` success |
| **Gates** | 36 of 38 green. Full table with real exit codes: readiness §1 |
| **Branch protection** | Set and verified by API this round: `contexts: ["checks"]`, `strict: false`, `enforce_admins: false`, `allow_force_pushes: false` |
| **Database** | `0003_transcript_origin.sql` **applied to the live database**, verified end to end |

**Round 22 closed all four of v29's open items.** The migration is run, the
`/white-papers` row is settled, the empty hub is handled, and the runbook is in
the repository with its cross-reference resolving. Two defects Sumeet reported
mid-round were also fixed: the University L1's mixed section colours and the
false margin-disclosure claim in three places.

**One retraction stands on the record:** mid-round I reported a real 1.00:1
contrast defect on the new `/insights` link. There is none. The reading came from
the preview pane returning a computed colour the served CSS cannot produce; real
headless Chromium passes the route in both themes. Nothing was shipped on the
strength of the wrong reading.

---

## 2. Decisions for Chat, before Sumeet touches anything

These are adjudications, not tasks. Sumeet should not be told to start Phase 0
until 2.1 and 2.2 have answers, because both change what "go" means.

### 2.1 Phase 8 performance — the only unresolved red, and it is a judgement call

`check:phase8` exit **1**, measured this round on a production build over
loopback under Lighthouse simulated mobile throttling:

- Lighthouse Mobile 90+: **misses 6 of 8 routes** (round 21 measured 7 of 8)
- LCP < 2.5s: **misses 8 of 8**
- CLS < 0.1: passes 8 of 8
- TBT < 200ms: passes 8 of 8

**The caveat is load-bearing.** These are laptop-over-loopback numbers. Nobody has
measured this site on the host it will actually serve from, because that host is
not serving it yet. AGENTS.md sets the gate as a pre-DNS-switch condition, and
readiness §6 records the ruling that **it must not be closed by moving the
threshold.**

Three coherent positions, and Chat should pick one and say so plainly:

| Option | What it means |
|---|---|
| **Measure first** | Sumeet loads the DO preview host and runs PageSpeed Insights against it before the DNS flip. If it clears, the gate closes honestly. This is the only option that satisfies AGENTS.md as written |
| **Accept and measure immediately after** | Go live, run Phase 3.7 on `https://yallo.co` within the hour, fix post-cutover. Records a knowingly accepted red |
| **Block** | Do not flip DNS until LCP is fixed. Not recommended: the fix is likely CDN and cache behaviour that only exists on the real host, so this risks optimising against the wrong measurement |

My reading, offered not decided: **measure first on the DO preview host.** It
costs Sumeet ten minutes, it is the same action as Phase 3.7 only earlier, and it
turns a guess into a number before the irreversible step. If it clears, the red
closes. If it does not, Chat is choosing between the other two with real data.

### 2.2 `ANTHROPIC_API_KEY` as a repository secret

Two different things wear this name and Chat should not conflate them:

1. **In the DigitalOcean production env — REQUIRED, not optional.** The assistant
   calls the API at runtime. Without it the panel fails on the live site. This is
   runbook Phase 0.5 and it is not a decision.
2. **As a GitHub repository secret — still unset**, by a delegated decision
   carried from round 21 and unchanged. Consequence: `check:assistant-links` runs
   nowhere in CI, so the assistant's citations are unprotected between rounds. It
   is charged per run, which is why it was left.

Chat's call: set it and accept the per-run cost, or leave it and accept that the
gate protects nothing in CI. Either is defensible; the current state is the
second, silently.

### 2.3 Content items that will ship as they are unless Chat says otherwise

None blocks cutover. All are Sumeet's under R-A9 and all are visible to a visitor:

| Item | State at cutover |
|---|---|
| The insights corpus | All 21 legacy articles unpublished, as ruled on 30 July. `/insights` now shows a quiet state with one link into `/intelligence/research` instead of an empty hub |
| Testimonial slot | Renders nothing. No placeholder, by design |
| FAQ blocks | Content-gated, out of scope as ruled |
| Wickes asset | Still to be retired or made real |
| The 42 prose figures | Sumeet's. `check:metrics` reports, never rewrites |
| `/eor` FAQ margin wording | Left standing this round. It discloses a **fee**, not a margin, and nothing Sumeet said contradicts it. One line in `src/data/services/eor.tsx` if Chat reads it differently |
| Vendor balance | Sumeet's note that the site over-indexes on application vendors and under-represents data, digital, cloud and open source. `/contract` FAQ 01 was corrected on his instruction. The sweep across other surfaces, including `/contract`'s own SEO description and the three other service pages, is **unscoped**. Recommend round 23, not pre-cutover |

### 2.4 `/jobs` Volcanic punchout — runbook 0.6

Load `/jobs` on the DO preview and decide: good enough to launch, or park the nav
link. Volcanic credentials are Raphy's if wiring is needed. Needs a decision, not
work.

---

## 3. What sits on Sumeet, in execution order

Everything below is his because it needs a credential, a dashboard, or a
judgement no session may take. **The migration is already done and is struck
through so nobody re-runs it.**

### Phase 0 — pre-flight, all true before DNS moves

| # | Action | Notes |
|---|---|---|
| 0.1 | Confirm round 22 adjudicated | This document. CI green on `4cc8f19` |
| 0.2 | Redirect map | Done and gated. `check:redirects` exit 0, every legacy URL one 301 hop to a resolving target. One declared exception, 3.1 below |
| **0.3** | **One watched auto-merge publish** | **Only Sumeet can do this.** Sign in at `/admin`, reorder two case studies, publish, watch the PR open and merge itself, reorder back. Protection now requires `checks`, verified by API. This also closes `check:admin-render`, which has never run because it needs `ADMIN_TEST_EMAIL` and `ADMIN_TEST_PASSWORD` |
| 0.4 | Brief-form email in production | Resend dashboard: add domain `yallo.co`, copy the SPF and DKIM records it shows into Cloudflare DNS exactly as given, wait for "Verified". Raphy's ten minutes if he owns the Resend account, otherwise create a fresh one and put its key in the DO env |
| 0.5 | DO production environment variables | Full list in §4 below. Mark every secret encrypted. DO redeploys on change: wait for green before proceeding |
| 0.6 | `/jobs` decision | Decision 2.4 |
| 0.7 | Search Console baseline | GSC (`yallo.co` property) → Performance → export last 3 months of top pages and queries. **This is what proves the migration held.** Ten minutes, and it cannot be taken retrospectively |
| 0.8 | One production sign-in | `/admin` on the DO preview: sign in once, open every pane |
| 0.9 | Placeholder still noindex | `curl -s https://yallo-talent-ohog5.ondigitalocean.app/robots.txt` shows `Disallow: /`. Confirms the env flip has not leaked early |
| ~~0.10~~ | ~~Database migration~~ | **DONE, round 22.** Applied to the live database, column verified, and a panel conversation verified end to end writing `origin_path`. Do not re-run. The standing rule survives: migrations run before or with the deploy, never after |
| **0.11** | **Phase 8 measurement, if Chat rules "measure first"** | PageSpeed Insights mobile against the DO preview host. Record the numbers in readiness. New, from decision 2.1 |

### Phase 1 — domain attach, no visitor impact

DO App Platform → app → Settings → Domains → add `yallo.co` and `www.yallo.co`.
DO shows the DNS target. **Do not change DNS yet.** Both will read "Pending",
which is expected.

### Phase 2 — DNS flip, minutes to take effect, minutes to roll back

1. Cloudflare → `yallo.co` zone → DNS. **Screenshot the current WordPress records
   first. That screenshot is the rollback.**
2. Apex `yallo.co`: CNAME → `yallo-talent-ohog5.ondigitalocean.app`, proxy **ON**. Same for `www`.
3. SSL/TLS mode: **Full (strict)**.
4. `talent.yallo.co`: Redirect Rule → 301 to `https://yallo.co`, preserving path.
   The placeholder retires and nothing 404s.
5. **The double-slash rule.** Redirect Rules → filter
   `http.request.uri.path eq "/industries/retail//"` → static 301 to
   `https://yallo.co/industries/retail`. **This is the one thing the app cannot
   do:** Next collapses duplicate slashes before any app code runs, so it takes
   two hops in-app. It reaches the right page meanwhile. Only the edge can make
   it one hop.
6. **The env flip.** Confirm **`NEXT_PUBLIC_SITE_URL=https://yallo.co`** is live
   in DO at scope `RUN_AND_BUILD_TIME` and its rebuild has gone green, then load
   `https://yallo.co/robots.txt` — it must now serve the full three-family allow
   policy, not `Disallow: /`. **This is not `SITE_URL`**; see §4.

### Phase 3 — verification, within the first hour

1. Ten legacy URLs, each one 301 hop to its mapped target, including
   `/white-papers/` → **`/intelligence`** (changed this round) and
   `/industries/retail//` → `/industries/retail` (now one hop, via 2.5).
2. Crawler posture: Cloudflare → Security → Bots, "Block AI Bots" **OFF**,
   Search/Agent/Training unblocked. Then probe as Googlebot, OAI-SearchBot,
   ClaudeBot, PerplexityBot. All 200.
3. Sitemap loads, submit in GSC, request homepage indexing.
4. Submit a real test brief, confirm the email arrives.
5. Assistant: open the panel on the live site, ask one question, click one
   citation. **New this round: check the conversations pane shows the page of
   origin** — that is what the migration bought.
6. Cockpit: sign in, one reversible reorder, watch it auto-merge and deploy,
   reverse it.
7. **Phase 8 on the real host.** PageSpeed Insights mobile on `https://yallo.co`.
   Record in readiness. Fix post-cutover if red. **Not to be closed by moving the
   threshold.**

### Phase 4 — decommission, not today

WordPress stays running but out of DNS for 30 days as rollback insurance and
content archive. After 30 clean days Raphy tears it down and cancels Slider
Revolution and related licences. Watch weekly against the 0.7 baseline;
investigate any top-50 URL that drops out.

---

## 4. DigitalOcean production environment variables

From runbook Phase 0.5, reproduced so Chat can hand it over as one block:

**`NEXT_PUBLIC_SITE_URL=https://yallo.co`** — **this is the switch.** Robots
policy, sitemaps, canonicals and noindex all key off it · `AUTH_SECRET` ·
`ADMIN_EMAIL` · `ADMIN_PASSWORD_HASH` · `ADMIN_GITHUB_TOKEN` ·
`ADMIN_GITHUB_REPO=yallo-talent/yallo-talent-website` · `DATABASE_URL` ·
`RESEND_API_KEY` plus any `RESEND_*` the brief form names · `ANTHROPIC_API_KEY`
(**required**, the assistant calls the API at runtime and the panel fails
without it) · leave `NEXT_PUBLIC_ASSISTANT_ENABLED` unset, it defaults true and
only the exact string `"false"` disables.

Mark every secret encrypted. DO redeploys after an env change; wait for green.

### Correction, 8 August 2026 — the switch variable was named wrongly

**v1.1 of the runbook and the first version of this handover both said
`SITE_URL`. Nothing in the codebase reads that name.** Measured by grep across
`src`, `scripts` and `next.config.ts`: the only occurrences were in those two
documents, and I propagated the error from the runbook rather than checking it.
Both are now corrected. The name is **`NEXT_PUBLIC_SITE_URL`**.

Chat should treat this as the highest-risk single line in the cutover, because
**it fails silently.** Wrong name and the build succeeds, the site serves, and
`yallo.co` goes live noindexed with canonicals pointing at
`http://localhost:3000`. Nothing errors and nothing warns.

| Property | Requirement | Failure mode |
|---|---|---|
| Name | `NEXT_PUBLIC_SITE_URL` | A bare `SITE_URL` is read by nothing |
| Timing | **Build time**, inlined by Next at `pnpm build` | In DO the scope must be **`RUN_AND_BUILD_TIME`**, not `RUN_TIME`. At run time only, the build never sees it |
| Value | `https://yallo.co` exactly | `src/lib/seo.ts:18` is strict equality against `productionUrl` in `src/lib/robots-policy.json`. A trailing slash or `www` evaluates false |

Changing it needs a **rebuild**, not a restart, so the flip is not instant.
Verify by output, never by the dashboard: `robots.txt` must carry `Allow: /`, the
named crawlers, and a `Sitemap:` line. `pnpm check:robots` asserts exactly that
and reads the same variable the build consumed.

---

## 4b. The DigitalOcean app, investigated and part-corrected 8 August 2026

Added after the first version of this handover, which said nothing about the host.
Chat cannot command a cutover without it.

**The app was misconfigured and could not have served current `main`.** Found by
read-only inspection, then two fields corrected on Sumeet's explicit instruction.

| | |
|---|---|
| App | `yallo-talent`, ID `4bfc47a0-89de-479c-91cc-cc7e36b383bf`, region `lon` |
| Ingress | `https://yallo-talent-ohog5.ondigitalocean.app` |
| Repo, before | `yallogroup/talent.yallo.co` — the pre-transfer path. The repo had been moved to the `yallo-talent` org and renamed, so DO's per-org GitHub App authorisation no longer reached it |
| Consequence | `deploy_on_push: true` had not fired since **29 July**. The live build was commit `09ebcf5`, **514 commits behind**, generating 51 static pages against current `main`'s 425 |
| Repo, now | `yallo-talent/yallo-talent-website`, branch `main`, `deploy_on_push: true`. **DigitalOcean accepted the path**, which is the real proof the GitHub App install works, and then built from it |
| Instance, before | `apps-s-1vcpu-0.5gb`, 512 MiB, $5/month |
| Instance, now | `basic-s`, 2 GiB, 1 shared CPU, **$20/month**, basic tier. Chosen against a measured local peak RSS of 1.01 GiB for a single build process |
| Deployment | `c518fdfe-ce74-48c1-b234-73dd6dfebc2a`, cause `app spec updated`, phase **ACTIVE 6/6**, commit `6aac5dc`. Built 425/425 static pages with no OOM on 9 workers |
| Env vars | **still zero, deliberately.** Sumeet's, in the dashboard |
| Domains | **still none, deliberately.** Sumeet's, Phase 1 |

**A side effect that closed a live exposure.** Before the redeploy the app was
publicly serving `Allow: /` with no noindex, i.e. an indexable 514-commit-stale
copy of the site competing with `yallo.co` as duplicate content, including the
margin-disclosure copy corrected this morning. Because `NEXT_PUBLIC_SITE_URL` is
unset, the new build correctly takes the non-production branch and now serves
`Disallow: /` for `*` and every named crawler. **Runbook Phase 0.9 therefore
passes as written.**

**Two things Chat must fold into its instruction:**

1. **The ordering trap on the switch variable.** The moment `NEXT_PUBLIC_SITE_URL`
   is set, this preview host flips to the full allow policy and becomes
   indexable while still on the `ondigitalocean.app` hostname. Set it as late as
   the runbook has it, in Phase 0.5 immediately before the flip, or accept a
   window in which the preview is crawlable.
2. **`deploy_on_push` is repaired but unproven.** The deployment above was
   triggered by the spec update, not by a git push. **The next commit to `main`
   is what proves the webhook fires.** Until one does, treat unattended
   cockpit publishing as unverified end to end, which is the same evidence gap
   Phase 0.3 exists to close.

Still outstanding on the host, all Sumeet's: the env block (§4), the two domains
(Phase 1), and a decision on whether `basic-s` is the size to run on in
production as opposed to merely build on.

---

## 5. What is NOT verified, stated so Chat does not assume it

| Not verified | Why | Consequence |
|---|---|---|
| Site performance on the production host | That host does not serve the site yet | Decision 2.1 |
| Brief-form email in production | Resend domain `yallo.co` not verified; SPF and DKIM not in Cloudflare | A submitted brief may not arrive. Phase 0.4 closes it |
| `/jobs` Volcanic punchout | Never wired | Decision 2.4 |
| The cockpit panes under a real session | `check:admin-render` has never run: it needs `ADMIN_TEST_EMAIL` and `ADMIN_TEST_PASSWORD`, and it fails rather than skips by design, because a green tick over an unmeasured surface is what it was filed against | Phase 0.3 and 0.8 are the human substitute |
| Assistant citations in CI | `check:assistant-links` runs locally only, no `ANTHROPIC_API_KEY` secret | Decision 2.2 |
| `/industries/retail//` in one hop | Structurally impossible in-app | Phase 2.5, edge rule |
| Redirect map's *editorial* correctness | The gate proves the mechanism, not that `/about-us` *should* go to `/about` | The table is one readable file, `src/data/redirects.mjs`, for exactly that review |

---

## 6. Risks Chat should weigh

- **`check:assistant-refusal` is non-deterministic and tripped again this round.**
  First run: one fixture, `competitor comparison`, matched the affirmative-guarantee
  matcher. Re-run: all 7 held. The failing reply refused correctly on rates and
  competitors, then made an affirmative claim about commitments. A clean run is
  not proof the class is closed. Its failure message now names which matcher
  fired, which it did not before.
- **The sitewide canonicalisation risk accepted in round 21 is still live.** The
  redirect map moved into middleware with `skipTrailingSlashRedirect`, which means
  middleware canonicalises every request path, not only legacy ones. Gated, and
  ratified with the risk accepted.
- **Cloudflare proxy ON plus DO certificates** is the one step with a visible
  failure mode: SSL mode must be Full (strict) or visitors see errors during
  propagation. Rollback is the Phase 2.1 screenshot.
- **`/insights` copy describes a future state.** "Insight articles are being
  prepared" reads as stale if the corpus stays unpublished for months. It removes
  itself automatically on the first publish and nowhere else.
- **Phase 8 accepted rather than measured** would mean going live on numbers
  nobody has taken on the real host. That is a knowing risk, not an unknown one,
  provided Chat records it as accepted.

---

## 7. Round 23, already shaped

From `context-round22-scope.md` §7, post-cutover: the Articles pane with a scoped
second login for Raphy · GitHub App hardening · Phase 8 measured on the production
host · the `/saudi-arabia` page.

Round 22 adds two candidates: the **vendor-balance sweep** (decision 2.3) and the
**`/eor` margin line** if Chat rules it a margin claim.

---

## 8. What Chat needs to send back to Sumeet

To turn this into execution he needs, in one message:

1. The Phase 8 ruling — measure first, accept, or block.
2. The `ANTHROPIC_API_KEY` repository-secret ruling.
3. Whether anything in 2.3 blocks cutover, or all of it ships as is.
4. The `/jobs` ruling.
5. Confirmation that Phase 0.3 is his first action, and that Phase 0.7's Search
   Console export must happen **before** the flip, because it cannot be taken
   afterwards.
6. A go-live date, which is still outstanding.

Everything else in §3 is procedure he can follow from the runbook without further
adjudication.
