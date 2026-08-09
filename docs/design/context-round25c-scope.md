# Context — Round 25c: finishing the publishing engine

**v1.0 · 9 August 2026, evening · Chat lens · Project GTM.01**
Authority: canon (post-fold), `context-cockpit-v3.md` (specification), `DESIGN.md`, R-A9 standing rules. The site is LIVE on yallo.co, serving from the database. Single session; stop between items; name any remainder 25d. **The work items live in `context-round25b-scope.md` §§2–6 and are unchanged; per v35 §10, do not re-derive round 25b's evidence.** This file carries the v35 adjudication, three new rulings and the order of work.

## 0a. Relay v35 — adjudicated

**Accepted in full.** Ratified specifically: the non-vacuous flip proof (zero `.mdx` on main + `x-nextjs-cache: MISS`); the retraction, which is the discipline working exactly as designed — the conclusion survived, the unearned reasoning did not; the pipe-swallows-exit-codes confession, which becomes standing practice (**never capture an exit code through a pipe**); D25b-1 through D25b-6, all six; the `WHERE false` red-proof technique for write-privilege probes; the schema-equals-renderer principle from §2.1; the four measured defects; the per-ref concurrency fix with its residual risk honestly named; and the PR #27 review-and-merge with its sequencing constraint passed to Sumeet.

Rulings, delegated, logged for Sumeet's veto:

- **R-25c.1 (v35 §14's question):** fixtures that cannot collide, not a repository-wide group. `check:editor`'s fixture rows carry a reserved slug prefix (`ci-fixture-`), and `check-admin-render`'s discovery excludes that prefix. The per-ref concurrency group stays. Red-prove by running both gates concurrently against one server once, watching neither trip over the other.
- **R-25c.2 (v35 §11's question):** the input v34 saw is recoverable, not inventable. The comment in `src/lib/assistant/client.ts` was REWORDED as the round-25 workaround; `git log -p` on that file recovers the original wording. Rebuild the fixture from that historical text, run the OLD stripper (from git history) against it expecting the false finding, the new stripper expecting clean, and a real em dash in copy still caught. If even the historical input does not reproduce on the old stripper, close R-25b.5 as fixed-by-state-corruption-proof, record the v34 finding as unreproduced, and do NOT manufacture a case and call it the one that mattered.
- **R-25c.3 (v35 open item 6):** the four high-severity Dependabot advisories are this round's. Triage each: patch within compatible ranges where possible, full suite green after each bump, and any advisory that demands a major-version migration is reported with its blast radius rather than taken unilaterally.

**Parked for Sumeet, not for any session:** which of the 21 articles publish; taxonomy values for the nine studies (the dropdowns exist); the shareable preview URL (not built until he rules); dev droplet destroy-or-keep (the firewall below is the interim); eslint-vs-biome (deferred to design-system extraction).

## 0. Preconditions

Merge PR #26, watch the deploy to ACTIVE, then smoke read-only: `/` 200, one study 200, `/insights` 200 (empty state renders properly — 0 published articles is the true state), `sitemap.xml` and `llms.txt` slug-sets against published rows, `/admin` posture. Cut `round25c` from that `main`; ground-commit this file.

## Order of work

1. **SEO and GEO** — round 25b file §2, everything the editor's counters did not already land: canonical, OG and Twitter, OG image from hero or PetalPlate, `BlogPosting`/`Article` schema with `Organization` author, `BreadcrumbList`, `FAQPage` on FAQ blocks, slug frozen after first publish with the automatic redirect row, desk links and the related rail from taxonomy, the answer-first soft check.
2. **Media** — round 25b file §3, unchanged.
3. **Public surfaces** — round 25b file §4, unchanged: `/insights` filters and search with URL state, the three single-facet families as indexable landing pages with their own copy, multi-facet noindex and canonicalised, drag-and-drop ordering in one transaction. Accessibility and interaction gates over all of it.
4. **R-25b.4** — the unpublish guard naming the legacy URL, red-proven both directions.
5. **R-25c.1** — the fixture-collision class fix, red-proven per the ruling.
6. **R-25c.2** — the stripper's owed red-proof, per the ruling's recipe. Then **R-25b.6** — the dev-droplet cloud firewall exactly per round 25b file §6, visibility tested first, ports 80/443 to Cloudflare ranges only, port 22 untouched, report-and-stop if the droplet is not in this team.
7. **R-25c.3** — the Dependabot four, per the ruling.

## Forbidden

Unchanged from round 25b §7 in full, plus: no article publishes, no taxonomy assignment, no preview-sharing mechanism. Relay v36 at `docs/relay/v36.md`, standard shape, RETRACTIONS even if empty, watched exit codes without pipes, every red-proof individually. End with the PR open and green, unmerged; merges are Sumeet's.
