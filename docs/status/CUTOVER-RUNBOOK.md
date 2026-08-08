# yallo.co Cutover Runbook — executed by Sumeet

**v1.2 · 8 August 2026 · GTM.01.** Companion to `docs/status/CUTOVER-READINESS.md`.
v1.1 folds in relay v29: migration ordering, the double-slash edge rule, `/white-papers` → `/intelligence`, and the now-testable auto-merge watch.
**v1.2 corrects one factual error in v1.1 and closes one item.** The env switch is
`NEXT_PUBLIC_SITE_URL`, not `SITE_URL`; v1.1 named a variable nothing in the
codebase reads, and it is the one step in this procedure that fails silently. See
the note under Env. Phase 0.10, the database migration, is done: round 22 applied
it to the live database and verified it end to end.
Target: yallo.co serves the Next.js build on DigitalOcean behind Cloudflare, replacing WordPress. Rollback at every step until Phase 4.

Amendment to game plan §12: Sumeet executes the cutover personally. Raphy dependencies reduce to three access items, named in Phase 0.

---

## Phase 0 — Go/no-go pre-flight (all must be true before DNS moves)

| # | Check | How |
|---|---|---|
| 0.1 | Round 21 merged, CI green on final HEAD | Relay v29 adjudicated |
| 0.2 | Redirect map implemented and gated | Round 21 item 3; the gate walks every §7 legacy URL and asserts one 301 hop to the mapped target |
| 0.3 | One watched auto-merge publish | Protection now requires `checks` (verified via API in v29). Sign in at `/admin`, reorder two case studies, publish, watch the PR open and merge itself, reorder back. Only you can run this — Code correctly refuses credential entry |
| 0.4 | Brief-form email works in production | Resend dashboard: add domain `yallo.co`, copy the SPF and DKIM records it shows into Cloudflare DNS (Type TXT/CNAME exactly as given), wait for "Verified". If Raphy owns the Resend account, this is his ten minutes — or create a fresh Resend account yourself and put its key in the DO env |
| 0.5 | Production environment variables set in DigitalOcean | App Platform → your app → Settings → App-Level Environment Variables. Full list in §Env below |
| 0.6 | Volcanic `/jobs` punchout state acceptable to launch | Load `/jobs` on the DO preview; decide it is good enough or park the nav link. Volcanic credentials are Raphy's if wiring is needed |
| 0.7 | Search Console baseline exported | Google Search Console (yallo.co property) → Performance → export last 3 months of top pages and queries. Ten minutes; this is what proves the migration held |
| 0.8 | One production sign-in | `/admin` on the DO preview URL: sign in once, open all panes |
| 0.9 | Placeholder still noindex | `curl -s https://<do-preview-host>/robots.txt` shows `Disallow: /` — the env flip has not leaked early |
| ~~0.10~~ | ~~Database migration applied~~ **DONE** | Round 22 applied `0003_transcript_origin.sql` to the live database: `pnpm db:migrate` exit 0, column verified in `information_schema`, and a panel conversation on `/platforms/sap` verified end to end writing `origin_path`. **Do not re-run.** The standing rule survives for every future release: **migrations run before or with the deploy, never after** — v29 measured the after-case as silent transcript loss |

### Env — DigitalOcean production variables

**`NEXT_PUBLIC_SITE_URL=https://yallo.co`** (this is the switch: robots policy,
sitemaps, canonicals and noindex all key off it) · `AUTH_SECRET` · `ADMIN_EMAIL` ·
`ADMIN_PASSWORD_HASH` · `ADMIN_GITHUB_TOKEN` ·
`ADMIN_GITHUB_REPO=yallo-talent/yallo-talent-website` · `DATABASE_URL` ·
`RESEND_API_KEY` (plus any `RESEND_*` the brief form names) · `ANTHROPIC_API_KEY`
(the assistant ships ON and calls the API at runtime, and without this the panel
fails on the live site) · leave `NEXT_PUBLIC_ASSISTANT_ENABLED` unset (defaults
true; only the exact string "false" disables).

Mark every secret as encrypted in the DO UI. After changing env vars, DO
redeploys: wait for the deploy to go green before proceeding.

#### The switch variable, corrected 8 August 2026 — read this before setting it

**v1.1 of this runbook named `SITE_URL`. Nothing in the codebase reads that
name.** Measured by grep across `src`, `scripts` and `next.config.ts`: the only
occurrences of a bare `SITE_URL` were in this document. The correct name is
**`NEXT_PUBLIC_SITE_URL`**, which is what `src/lib/seo.ts` and `.env.example`
both use.

This is the one step in the whole cutover that **fails silently**. Set the wrong
name and the build succeeds, the site serves, and `yallo.co` goes live with
`Disallow: /` to every crawler while every canonical points at
`http://localhost:3000`. Nothing errors.

Three properties of this variable, each of which can defeat it on its own:

| Property | Requirement | What happens otherwise |
|---|---|---|
| **Name** | `NEXT_PUBLIC_SITE_URL` | A bare `SITE_URL` is read by nothing |
| **Timing** | **Build time.** The `NEXT_PUBLIC_` prefix means Next inlines the value into the bundle at `pnpm build` | Set at run time only, the build never sees it. In DigitalOcean the env var's scope must be **`RUN_AND_BUILD_TIME`**, not `RUN_TIME` |
| **Exact value** | `https://yallo.co`, no trailing slash, no `www` | `src/lib/seo.ts:18` is strict equality against `productionUrl` in `src/lib/robots-policy.json`. `https://yallo.co/` and `https://www.yallo.co` both evaluate false |

Because it is inlined at build time, **changing this value needs a rebuild, not a
restart.** DO rebuilds automatically on an env change, which is why the flip is
not instantaneous: wait for the deploy to go green before checking `robots.txt`.

Verify it took effect by the output, never by the dashboard: `robots.txt` must
carry `Allow: /` plus the named crawlers and a `Sitemap:` line. `pnpm check:robots`
asserts exactly this and reads the same variable the build consumed.

---

## Phase 1 — Domain attach (no visitor impact yet)

1. DigitalOcean App Platform → app → Settings → **Domains** → Add `yallo.co` and `www.yallo.co`. DO shows the DNS target (a CNAME like `<app>.ondigitalocean.app`).
2. Do NOT change DNS yet. DO will show the domains as "Pending" — expected.

## Phase 2 — DNS flip (Cloudflare, minutes to take effect, minutes to roll back)

1. Cloudflare dashboard → yallo.co zone → **DNS**. Note the current records pointing at the WordPress host (screenshot them — this is your rollback).
2. Edit the apex `yallo.co` record: replace with **CNAME → `<app>.ondigitalocean.app`**, Proxy status **ON** (orange cloud; Cloudflare flattens CNAME at apex automatically). Same for `www`.
3. SSL/TLS mode: **Full (strict)** for the zone.
4. `talent.yallo.co`: Cloudflare → Rules → Redirect Rules → new rule: hostname equals `talent.yallo.co` → 301 to `https://yallo.co` preserving path. The placeholder host retires; nothing 404s.
4b. **The double-slash rule** (v29 §6.1): same Redirect Rules screen → custom filter expression `http.request.uri.path eq "/industries/retail//"` → static 301 to `https://yallo.co/industries/retail`. Next.js cannot answer this in one hop; the edge can.
5. In DigitalOcean, the two domains move from Pending to active with certificates. Usually under 15 minutes behind Cloudflare.
6. **The env flip:** confirm **`NEXT_PUBLIC_SITE_URL=https://yallo.co`** is live in the DO env, at scope `RUN_AND_BUILD_TIME`, and that the rebuild it triggered has gone green (set in Phase 0; see the corrected note under Env above, and note this is NOT `SITE_URL`). Load `https://yallo.co/robots.txt` — it must now serve the full three-family allow policy, not `Disallow: /`. If it still shows `Disallow: /`, the variable name, its scope, or a trailing slash is the cause, in that order of likelihood.

**Rollback at this phase:** restore the screenshotted DNS records. Cloudflare-proxied changes propagate in minutes. WordPress is untouched until Phase 4.

## Phase 3 — Verification, within the first hour

1. **Redirects:** spot-check ten legacy URLs (`/managed-it-coe/`, `/talent-in-a-box/`, `/capabilities/data/`, `/industries/retail//`, `/contact-us/`, `/leadership-team/`, `/white-papers/` — now lands on `/intelligence` per the round 22 ruling, `/technologies/sap/`, `/join-us/`, `/tsea-as-a-service/`): each must land on its mapped target in **one** 301 hop. `curl -sIL https://yallo.co/managed-it-coe/ | grep -i 'HTTP\|location'`
2. **Crawler posture:** Cloudflare → Security → Bots: confirm the legacy "Block AI Bots" toggle is OFF and Search/Agent/Training categories unblocked (ratified 2 Aug). Then the probe, four agents:
   `curl -s -o /dev/null -w "%{http_code}\n" -A "Googlebot" https://yallo.co/` — repeat with `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`. All 200.
3. **Sitemap:** `https://yallo.co/sitemap.xml` loads; submit it in Search Console; request indexing on the homepage.
4. **Brief form:** submit a real test brief; confirm the email arrives.
5. **Assistant:** open the panel on the live site, ask one question, click one citation (new tab, chat intact).
6. **Cockpit:** sign in at `https://yallo.co/admin`, run one reversible reorder, watch it auto-merge and deploy. Reverse it.
7. **Phase 8, finally measured where it matters:** PageSpeed Insights on `https://yallo.co` (mobile). Record the numbers in the readiness report. Fix post-cutover if red — this was ruled, not to be closed by moving the threshold.

## Phase 4 — Decommission (not today; after 30 clean days)

1. Keep the WordPress server running but out of DNS for 30 days: rollback insurance and content archive.
2. After 30 days: Raphy tears it down and cancels Slider Revolution and related licences (his server access).
3. Watch weekly against the Phase 0.7 baseline in Search Console; ranks should transfer via the redirect map. Investigate any top-50 URL that drops out.

## First 72 hours — watch list

- Search Console coverage: redirects being followed, no soft-404s.
- Cloudflare Analytics → traffic by user-agent: retrieval crawlers arriving (the server-log baseline, taken as ratified).
- DO deploy log and CI: every cockpit publish landing green.
- The nightly transcript purge staying green.
- Assistant conversations pane: the first real visitor transcripts, now with page of origin.
