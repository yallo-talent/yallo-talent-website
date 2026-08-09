# Context — Round 24: the merge, the proof, the sources gate, the brand pipeline

**v1.0 · 8 August 2026, late · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`, `DESIGN.md`, `AGENTS.md`. Standing rules: `context-round13-scope.md` §8 as amended (R-A9). Single session, overnight, unattended. The site is LIVE on yallo.co.

## 1. Relay v32 adjudication — read before working

**Accepted, with two method faults recorded and no retractions of substance.**

- **Method fault 1, internal contradiction:** v32 §9 item 3 ("batch publish is not built") and the §10 risk bullet ("the CI fast lane was not built") are both contradicted by v32's own evidence: commits `22bfce2` and `7fd0f7a`, run 31279543881, and PR #20's 40-second content lane. The evidence stands; those two passages are stale drafting that was never reconciled after §7f–§7g were written. Ruling: batch publish and the fast lane are BUILT and PROVEN; open item 3's question is void (the per-move path is gone).
- **Method fault 2, minor:** §7b is titled "what was NOT done" and lists things that were done. Cosmetic.
- **Premise correction accepted:** the figure-needs-a-source rule never existed as a build gate; the articles pane introduced it at the authoring surface. §4 below makes it a real gate, answering open item 4.
- **Ratified:** the derived redirect row (correct call — a literal row would duplicate a derived fact); the migration-before-merge execution; the break-glass sign-in order and its reasoning; the fixture-only user script with its prefix refusal; the red-proofs; the `data(insights)` commit-type fix; both mid-session infrastructure changes with the byte-identical `www` block proof; the Phase 8 report-only stance; `dev.yallo.co` report-only per the round file's own rule.
- **Ruling on the ground-commit bypass (open item 5):** no more documentation commits direct to `main`. From this round on, context files and scripts commit at ground ON THE ROUND BRANCH and land through its PR. This file follows its own rule.
- **Open item 1 (Academy 503):** Sumeet's ruling to ship stands; the link stays. Watching the host is his and Raphy's, not a build item.
- **Open items 2, 7, 8 answered in §§2, 6, 7 below.**

## 2. Item 1 — merge #19, watch the deploy, verify production

**The merge is authorised.** Sumeet dispatched this round knowing item 1 deploys the round 23 work; that dispatch is the go. Sequence:

1. `gh pr merge 19` with the repository's configured merge method. If the permission classifier refuses again, STOP the round and relay that as the only blocker — nothing else in this file is safe to run against a `main` that does not carry round 23.
2. Watch the DigitalOcean deployment to ACTIVE (`doctl apps get` / deployments list, app `4bfc47a0-89de-479c-91cc-cc7e36b383bf`). Record the deployment id and duration.
3. Verify on `https://yallo.co`, browser user-agent, real codes recorded: `/` 200 · footer contains the Academy link · `/case-studies` renders the nine studies in the §2 round-23 order · the deleted study's URL 301s to `/case-studies` in one hop · `/admin` unauthenticated shows sign-in with `X-Robots-Tag: noindex` · `/admin/users` unauthenticated redirects to sign-in · three spot redirects from `redirects.mjs` still single-hop.
4. Signing IN on production is Sumeet's check, not yours: no session holds the password. Say so in the relay rather than skipping silently.

Then cut `round24` from the new `main`, commit at ground: this file, and `scripts/brand/**` (README.md, setup.sh, signature-banners.mjs — already in the tree, uncommitted).

## 3. Item 2 — the last unproven property: auto-merge on the fast lane

`main` now carries the workflow, so the proof PR #20 could not perform is possible. One content-only PR from post-merge `main`: a single comment or whitespace line in one UNPUBLISHED insight draft (rendered output must be byte-identical — verify the published manifest is unchanged). Enable auto-merge, watch it take the content lane and merge itself under branch protection, record the timings. The merged change is inert, so no revert; note the deploy it triggers completes to ACTIVE. This closes v32's "one property still unproven".

## 4. Item 3 — the sources rule becomes a build gate

New gate `check:sources` over `content/insights/`: any figure (numeral token, spelled-out percentage, "N weeks"-class quantity) in the BODY of an insight with `published: true` must have a matching `sources` entry; drafts (`published: false`) are exempt so authoring can iterate. Reuse the pane's detection logic from `66c67fb` rather than writing a second detector — one class, one implementation, imported by both. Wire it into BOTH CI lanes (it is a content gate; it also runs in full). Red-prove with a temporary fixture `.mdx` created and deleted inside the gate run itself, mirroring the admin-fixture pattern — the fixture is never committed and its teardown sweeps on kill. All 21 real insights are unpublished, so the gate should pass trivially on the tree; say so with the count.

## 5. Item 4 — render and commit the signature banners

From `scripts/brand/`: `bash setup.sh`, then `node signature-banners.mjs`. Commit the four PNGs at `public/images/email/signature-{variant}.png` plus the `scripts/brand/**` sources in one commit. Verify each PNG renders (open and check dimensions 1200x340, non-zero size); serving them at 200 on production happens when this round's PR merges in the morning — note that, do not chase it tonight.

## 6. Item 5 — dev.yallo.co goes dark at the edge (delegated, logged for veto)

Ruling: one Cloudflare redirect rule, `dev.yallo.co/*` → `https://yallo.co/` 301, created via API with the existing token (the redirect-rules scope was exercised at cutover; if this token lacks it, report and stop this item — do not improvise with other mechanisms). This kills the duplicate-content exposure tonight and is reversible in one API call. The droplet `yallo-web-dev` (178.62.82.59) is NOT touched: destroy-or-keep is Sumeet and Raphy's call. Verify: `curl -sI https://dev.yallo.co/` → 301 → `https://yallo.co/`, and `https://yallo.co/` still 200.

## 7. Item 6 — hygiene

The 23 pre-existing `react/no-unescaped-entities` errors (v32 open item 8): one sweep commit, escaping only, zero copy changes — diff must show entity substitutions and nothing else. Run `pnpm lint` before and after with counts in the relay. Do not add eslint to CI this round; the linter-consolidation question (defect M1) stays open for Sumeet.

## 8. Forbidden this round

No real user rows; no article content outside gate fixtures that delete themselves; no performance work against the Phase 8 numbers (baseline only, re-measured another day); no edits to `/privacy`, canon, `DESIGN.md`; no touching the `www.yallo.co` Caddy block, the Volcanic path, or the `yallo-web-dev` droplet; no credential entry. UK English, no em dashes, canon vocabulary, explicit commit paths. If you stop early, stop between numbered items with everything behind you finished and pushed. Relay v33 at `docs/relay/v33.md`, standard shape, RETRACTIONS required even if empty, every gate with a watched exit code. End with the round's PR open and green, not merged — morning merges are Sumeet's.
