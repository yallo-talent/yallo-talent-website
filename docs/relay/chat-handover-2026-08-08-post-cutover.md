══════════════════════════════════════════════════════════════════
HANDOVER — yallo.co (Yallo Talent), GTM.01
Date: 8 August 2026, evening
Status: **THE SITE IS LIVE.** Cutover executed today by Sumeet, with Code.
Inheriting from: rounds 13–22 complete and adjudicated; cutover done;
                 relay v31 (post-cutover fixes) delivered and partly open
Mode: open fresh Chat session
Compaction trigger: explicit request, context heavily loaded
══════════════════════════════════════════════════════════════════

0. WHAT TO LOAD FIRST
══════════════════════════════════════════════════════════════════

**Check the MCP tool.** `yallo-talent-fs` mounts the repo at
`/Users/sumeetgoenka/Claude/Claude-code/yallo-talent-website`. Run
`list_allowed_directories` at session start. It was responsive all day today.
If it answers, read from the repo rather than asking for uploads.

ALWAYS (load-bearing):
  • docs/design/yallo-talent-CANON.md    — canon, ratified
  • DESIGN.md                             — the written design system
  • AGENTS.md                             — repo discipline, carries R-A9
  • docs/design/context-round13-scope.md  — §8 standing rules, cited never retyped

CUTOVER-SPECIFIC:
  • docs/status/CUTOVER-READINESS.md      — measured state at round 22
  • docs/status/CUTOVER-RUNBOOK.md        — v1.1. **Now partly historical fiction;
                                            see §3. Amend it before reuse.**
  • docs/relay/v30-cutover-handover.md    — Code's pre-cutover handover
  • docs/relay/v31.md (if written)        — post-cutover fixes

DO NOT reload unless reopened: the defect register (stale since round 9),
context-round14/15/16-scope.md, the LTI extract.

══════════════════════════════════════════════════════════════════
1. WHERE WE ARE
══════════════════════════════════════════════════════════════════

**yallo.co serves the Next.js site.** Flipped 8 August, roughly 16:00 GST.
`main` at **`cf64f4b`** per relay v31 — hedged, quoted SHAs have been wrong
before. CI was green end to end for the first time at round 22.

**Rounds 13–22 are complete, adjudicated and merged.** Round 22 closed the
last four build items. There is no round 23 scope file yet; see §7.

**The estate now, and it is not what the runbook says:**

| Host | Serves |
|---|---|
| `yallo.co` | The Next.js app on DigitalOcean. CNAME → `yallo-talent-ohog5.ondigitalocean.app`, proxied |
| `www.yallo.co` | **A record to the droplet `138.68.140.42`, proxied.** Caddy serves ONLY the Volcanic job board here and 301s everything else to the apex |
| `jobs.yallo.co` | 301 to www. A failed experiment, see §4 |
| `legacy.yallo.co` | WordPress archive on the same droplet, `noindex`, ungated |
| `talent.yallo.co` | 301 to apex |
| `dev.yallo.co` | **Still a publicly crawlable WordPress clone of production.** Unfixed |

**Key IDs.** DO app `4bfc47a0-89de-479c-91cc-cc7e36b383bf` · Cloudflare zone
`8d8ee6b4515d69ed823e459ed5bd84f5`, **now on the Pro plan** · droplet
`yallo-web-prod` `473723897` at `138.68.140.42`, project "Yallo Websites" ·
snapshot `yallo-web-prod-pre-cutover-2026-08-08`, 44.67 GB, taken pre-flip.

**Credentials in play.** Cloudflare token at `~/.cloudflare-token`, read
inline by Code, never echoed. `doctl` authenticated. SSH to the droplet as
root works from Sumeet's Mac with key auth. DO holds eleven env vars,
ten encrypted plus `NEXT_PUBLIC_SITE_URL=https://yallo.co` at
`RUN_AND_BUILD_TIME` scope, which is the switch the robots posture keys off.

══════════════════════════════════════════════════════════════════
2. THE ONE THING BLOCKING SUMEET RIGHT NOW
══════════════════════════════════════════════════════════════════

**Admin sign-in.** Code found the real cause at `cf64f4b`: `pnpm admin:hash`
prints `$` separators backslash-escaped, which is required for `.env.local`
because `@next/env` expands `$name`, but DigitalOcean stores the value
literally so the backslashes survive and the split never matches `scrypt`.
`verifyPassword` now unescapes first. **Sumeet has not yet confirmed a
successful sign-in.** Ask on the first turn. If it still fails, the next
step is regenerating with `pnpm admin:hash` or checking `ADMIN_EMAIL`.

══════════════════════════════════════════════════════════════════
3. AMENDMENTS THE RUNBOOK AND CANON NEED
══════════════════════════════════════════════════════════════════

Not yet written into any file. This is the next session's documentation job.

1. **Domain architecture (ratified 2 Aug) needs a www clause.** It says
   yallo.co is the destination and is never 301'd out. Still true. But www
   is now a live second host serving the job board, not a redirect. Record it.
2. **Runbook Phase 2 is wrong on SSL ordering.** It says set Full (strict)
   at the flip. DO cannot issue its certificate until DNS points at the app,
   and cannot validate through Cloudflare's proxy at all. **SSL is still
   `full`, deliberately.** See §5.
3. **Runbook Phase 4 is void.** WordPress cannot be decommissioned in 30
   days: the droplet is now load-bearing for the job board proxy AND hosts
   the legacy archive. It stays until Volcanic moves. CORE.03 dependency.
4. **The 18 vanity redirects** (`/sap`, `/retail`, `/data` …) lived only in
   the Caddyfile and were absent from game plan §7. They are now in
   `src/data/redirects.mjs` with corrected slugs. Fold into §7.
5. **`/white-papers/` → `/intelligence`**, ruled round 22, reversing the §7
   table row.
6. **Search Console baseline, captured 8 Aug before the flip:** 2.73K clicks,
   228K impressions, 1.2% CTR, average position 10.9, over three months.
   That is the number the migration must hold. CSVs are Sumeet's to file.

══════════════════════════════════════════════════════════════════
4. THE JOBS BOARD — READ THIS BEFORE TOUCHING ANYTHING NEAR IT
══════════════════════════════════════════════════════════════════

The board is **Volcanic (Access Group)**, internally "Krakatoa", tenant
`site_id 2072`, environment `prod-eu-2`, fronted by CloudFront. It is
multi-tenant and **resolves the tenant from the incoming Host header**.
`www.yallo.co` is the registered key. There is no other door — Code probed
the distribution exhaustively and every other hostname returns 403.

Caddy proxies it with `header_up Host www.yallo.co`. That one line is the
whole mechanism.

**The mistake, made and reversed today.** Chat proposed moving the board to
`jobs.yallo.co`. Reads worked; **every POST broke** — nine 422s in the Caddy
log, all `Origin: https://jobs.yallo.co` against the rewritten Host, Rails'
forgery check rejecting candidate logins and job applications for roughly
two hours. Restored to www, proven by POSTing wrong credentials and getting
Devise's normal 302 rather than a 422.

**Standing rules from that:**
- The board stays on `www.yallo.co`. Do not move it again without a vendor
  change on their side.
- Cloudflare Origin Rules cannot help: **Host header override is
  Enterprise-only**, not Pro.
- The apex path rule sends `/jobs`, `/job`, `/join-us`, `/diversity` to www.
  **Never `/admin`, `/api` or `/users`** — they collide with the cockpit and
  the assistant API.
- The vendor route is open and unused: ask Access Group to register
  `jobs.yallo.co` (or `careers.`) as an alternate domain on the distribution
  for site 2072, prod-eu-2, and supply the CNAME target. That removes the
  droplet dependency entirely.

══════════════════════════════════════════════════════════════════
5. OPEN WITH SUMEET
══════════════════════════════════════════════════════════════════

  1. **Admin sign-in retest.** §2. First question of the session.
  2. **Sitemaps in Search Console.** Remove `www.yallo.co/jobs/sitemap.xml`
     (wrong path, "Couldn't fetch"). Add `www.yallo.co/job/sitemap.xml`
     (singular, the real Volcanic one, last read 7 Aug) and
     `yallo.co/sitemap.xml`. Then remove the `www.yallo.co/sitemap.xml` row
     once the apex one reads. Use the **Domain property**, the plain
     `yallo.co` entry, not the two `https://` ones.
  3. **The legacy archive** is dispatched but unconfirmed: deactivate
     NitroPack, WAF-block `/wp-login.php` and `/wp-admin*` plus bot agents,
     then watch stability over ten minutes. It fell over once today from
     php-fpm worker exhaustion, and **it shares a 1-vCPU droplet with the
     live job board.**
  4. **SSL is `full`, not strict.** Fixing it means grey-clouding the apex
     briefly so DO can validate, during which every Cloudflare redirect rule
     stops firing including the jobs punchout. Schedule a quiet window.
  5. **`sbox.yallo.co`** appeared in Search Console's sitemap list and is in
     no DNS inventory. Possibly another forgotten WordPress. Unchecked.
  6. **`skillmagnet.co.uk` is no longer yours** and its mail forwards to a
     personal Gmail. If any legacy vendor account uses that domain for
     password recovery — plausibly the original Volcanic account — that is a
     live exposure. Sumeet acknowledged; not yet actioned.
  7. **Test a real brief submission** end to end. Resend is verified
     (`hello@yallo.co` → `brief@yallo.co`) but the production path has never
     been proven with a real submission.
  8. Carried: Wickes (retire or supply asset), one attributed testimonial,
     sourced FAQ questions, client-logo `consentOnFile` flags, the 42 prose
     figures, the credential-backup directory deletion, the repo is
     **public** and should go private post-cutover.

══════════════════════════════════════════════════════════════════
6. WHAT I GOT WRONG TODAY — the pattern matters more than the list
══════════════════════════════════════════════════════════════════

Five errors, all the same shape: **asserting a technical fact without
verifying it, in a context where being wrong was expensive.**

  1. **`jobs.yallo.co`.** Proposed a Host-rewriting subdomain without
     considering that rewriting Host breaks same-origin POST checks. Cost:
     ~2 hours of broken candidate logins and applications.
  2. **The Pro upgrade.** Told Sumeet to pay ~$20/month for Host header
     override. It is Enterprise-only. Cost: real money, and Code had to
     discover it.
  3. **`AUTH_TRUST_HOST`.** Asserted it as the cause of the admin 500. The
     logs said `CredentialsSignin`. Code read them; I had guessed.
  4. **SSL ordering.** Said set Full (strict) at the flip. The certificate
     cannot exist until after the flip.
  5. **Search Console baseline.** Said it could not be taken retrospectively.
     Search Console retains sixteen months.

Code caught four of the five. **The lesson for the next session: when the
answer is checkable, have Code check it before stating it.** This is the
same defect the build has been fixing all along — a hand-maintained claim
that drifted from its source — and it is the same defect in prose.

══════════════════════════════════════════════════════════════════
7. ROUND 23 — shaped, not scoped
══════════════════════════════════════════════════════════════════

No context file exists yet. Candidates, in rough priority:

  • **The Articles pane with a scoped second login for Raphy.** Sumeet wants
    to hand article authoring to Raphy without giving him the repo or the
    cockpit's brief and transcript panes. The Articles shell shipped disabled
    in round 22. `/privacy` publishes that one named administrator can read
    conversations, so a second login must not see them.
  • **GitHub App hardening**, replacing the fine-grained token.
  • **Phase 8 measured on the production host.** It has never been measured
    anywhere that matters. Accepted red by ruling, not by moving the bar.
  • **GA4 with consent mode**, plus the cookie-policy update. Ruled: do it
    properly rather than dropping a tag in. Cloudflare Web Analytics covers
    the migration watch meanwhile.
  • **`dev.yallo.co`** — publicly crawlable production clone, competing with
    yallo.co in search today.
  • **`/saudi-arabia`** page, per the Phase 1 benchmark.
  • **The vendor-balance sweep** — Sumeet's note that the site over-indexes
    on application vendors and under-represents data, digital, cloud and
    open source. `/contract` FAQ 01 corrected; the rest unscoped.
  • **Volcanic replacement**, CORE.03. Now more urgent: the board is on
    two-year-old Yallo Retail branding, its canonical URLs are broken
    (`/job-search` 404s), and it keeps a WordPress droplet alive.

══════════════════════════════════════════════════════════════════
8. BEHAVIOURAL — how to work with Sumeet
══════════════════════════════════════════════════════════════════

**You are Chat.** Not Code. Two lenses, no Cowork. You hold canon, adjudicate
relays, author context files, compose `/goal` prompts, draft copy, rule.
**You do not build, commit, run gates, or claim any measurement you did not
take.** Code measures; you rule.

**Single session is the default**, ruled 6 August and written into AGENTS.md.
One port (3115), one worktree.

**R-A9 binds you.** Publishing decisions are Sumeet's. Neither lens
editorialises on site content, softens a ratified instruction, or asks
whether he is sure. A factual concern goes in the relay once, afterwards.

**His style.** Long voice-style dumps mixing strategy, correction and
critique — structure on receipt. "Decide for me" means decide and log for
veto, not a menu. One recommendation with its trade-off. Lead with the
answer. UK English, no em dashes. He corrects plainly and expects plain
acknowledgement without hedging.

**Today's addition, and he said it twice:** he does not want to be walked
through dashboards manually. **Bundle work for Code to execute via CLI or
API wherever possible.** Only hand him a manual step when a credential, a
security setting, or a judgement genuinely requires him. When you do, give
exact click paths, not summaries — he pushed back hard on assumed knowledge.

**Code's discipline is excellent and should be trusted.** It caught every
one of my errors, retracted its own promptly, and refuses credential entry
as a standing rule. When it disagrees with an instruction, it is usually
right; hear the evidence before overruling.

══════════════════════════════════════════════════════════════════
9. WHAT YOU'LL PROBABLY SEE FIRST
══════════════════════════════════════════════════════════════════

  (a) "The admin login works / still fails" → §2.
  (b) Code's relay on the legacy archive → adjudicate, then check whether
      the droplet is stable, because the job board shares it.
  (c) Screenshots of a live page with critique → his dominant mode. Read
      them as measurements.
  (d) "What's left?" → §5, then round 23 scoping.
  (e) Anything about traffic or rankings → the baseline is in §3.6. Nothing
      meaningful will be visible for days; say so rather than reading noise.

══════════════════════════════════════════════════════════════════
END HANDOVER
══════════════════════════════════════════════════════════════════
