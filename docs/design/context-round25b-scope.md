# Context — Round 25b: the writer's half of the publishing engine

**v1.0 · 9 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` (post round 25 fold); the specification remains `context-cockpit-v3.md`; `DESIGN.md` governs every rendered surface. Standing rules unchanged (R-A9). The site is LIVE on yallo.co. Single session; stop cleanly between numbered items and name any remainder 25c.

## 0a. Relay v34 — adjudicated

**Accepted in its entirety, and it sets the bar.** Ratified specifically: the byte-level import verification that was watched failing on list tightness before it passed; the eight-plus-one publish refusals each proven in both directions; the four-role matrix asserted both ways with the `/privacy` assertion wired into it; the real-session role-reach proof; the retirement sweep fixed as a class with the three-way reference check; all four CI failures captured before any re-run; and the retraction, which reported an ordering deviation that was structurally forced and correctly taken. No claim is reopened.

**Delegated decisions D1 through D8: all ratified.** D3 and D4 get their follow-through below.

Rulings for this round, each under delegated authority, logged for Sumeet's veto:

- **R-25b.1 (v34 open item 1):** CI stops using the production credential. Create a dedicated Postgres role `ci_reader` with `CONNECT` and `SELECT` only (plus temp for the sources self-test is NOT granted: the self-test step keeps the writing secret it already had, scoped to that one step). Swap the `full` job's `DATABASE_URL` secret to the `ci_reader` string. One GRANT, no new infrastructure, and CI can never write production content.
- **R-25b.2 (v34 D4):** the category rule. Articles use the design's five editorial types; case studies use the engagement pillar their cards already display (Contract, Permanent, EOR, Managed Delivery, Advisory). Publish rule 9 enforces the right list per content type. The nine imported studies already carry pillars, so nothing needs inventing.
- **R-25b.3 (v34 D3 follow-through):** the cockpit's case-study edit surface gains the same three taxonomy dropdowns as articles, so Sumeet or Raphy can assign real values to the nine studies from the browser. No session assigns them; A5 enforcement applies to publishes after values exist.
- **R-25b.4 (v34 open item 5):** the publish action refuses to unpublish a case study that a legacy URL in `redirects.mjs` names, with a message naming the URL. Cheap, and it closes the two-hop window before a person can open it.
- **R-25b.5 (v34 open item 4):** fix `check-terminology`'s comment stripper to skip regex literals. A scanner with a known false-finding mode is a latent flake; fix the class, keep the reworded comment as it now reads.
- **R-25b.6 (v34 open item 6, carried):** if the `yallo-web-dev` droplet (`178.62.82.59`) is visible to the authenticated `doctl`, attach a DigitalOcean cloud firewall restricting inbound 80 and 443 to Cloudflare's published IP ranges only. Port 22 is not touched. Reversible by detaching. If the droplet is not in this team, report and stop the item. Destroy-or-keep remains Sumeet and Raphy's.
- **R-25b.7 (v34 open item 7):** both linters stay for now; eslint just caught a real error biome cannot see. The consolidation question is deferred to the design-system extraction, where the toolchain gets decided once for all three sites.

## 0. Preconditions — the flip to database-served production

Merging PR #25 switches what production serves. Prove it changed nothing visible:

1. **Before merging**, capture the prose baseline: run the `verify-import.mjs` harness's production side against `https://yallo.co` and store the nine studies' extracted prose to a local file.
2. Merge PR #25. Watch the deploy to ACTIVE.
3. **After**, extract the same nine from production again and byte-compare against the stored baseline. Identical or stop and relay. Then smoke: `/case-studies` 200, one study 200, `/insights` 200, `sitemap.xml` and `llms.txt` route counts match the published rows, `/admin` posture unchanged, `/privacy` serving the ratified wording.
4. Apply R-25b.1 (the `ci_reader` role and secret swap) before any further CI runs, then cut `round25b` from `main` and ground-commit this file.

## 1. The editor (design §4, all of it)

TipTap with the full node set: headings H2/H3, marks, links, lists, blockquote, rule, code, plus the Yallo blocks (pull quote, key-figure callout with source, FAQ block, related-desk card, PetalPlate divider, image with caption and alt, typed-rows chart). Slash command and selection toolbar. Autosave with a visible saved state; a closed tab loses nothing. Revision history with preview and restore against the `content_revisions` table item 2 already populates. Side-by-side preview in the real article template, both themes, 360 and 1280. Full-screen writing mode. Computed word count and reading time. The surface obeys `DESIGN.md` and should look like the publication it produces. Works for articles AND case studies (the structured case-study fields sit alongside the body editor).

## 2. SEO and GEO (design §6, all of it)

Meta title and description with live counters and derived defaults; canonical; OG and Twitter cards; OG image from an uploaded hero or PetalPlate from the slug; `BlogPosting`/`Article` schema with `Organization` author, `BreadcrumbList`, `FAQPage` when an FAQ block exists; slug editable until first publish, frozen after, an automatic redirect row written on any later change; automatic desk links from taxonomy; the related rail from shared taxonomy; the answer-first warning as a soft check in the editor.

## 3. Media (design §9)

Uploads to `yallo-talent-media` through the server route, never browser-direct. Resize to the widths the templates use, modern formats, required alt text blocking publish when empty. A media library pane: what exists, where each asset is used, refusal to delete anything in use. Nothing touches `yallo-lms-assets`.

## 4. Public surfaces (design §5 and the rest of round-25 item 8)

`/insights` filter controls and text search, filter state in the URL. The three single-facet families as real indexable landing pages with their own copy: `/insights/platform/{slug}`, `/insights/industry/{slug}`, `/insights/discipline/{slug}`; multi-facet views canonicalise to `/insights` and carry `noindex`. Drag-and-drop ordering in the case-studies pane, writing the position column in one transaction (the write path already exists; this is the affordance). All of it under the accessibility and interaction gates, both themes, both widths.

## 5. Rulings follow-through

R-25b.2 (publish rule 9, per-type category list, red-proven both directions like the eight), R-25b.3 (case-study taxonomy dropdowns), R-25b.4 (the unpublish guard, red-proven).

## 6. Hygiene and estate

R-25b.5 (the stripper fix, with a regression case: a file whose regex literal precedes a comment containing an em dash must scan clean and a real em dash in copy must still be caught). R-25b.6 (the dev-droplet firewall, evidence: the rule set read back, a request from a non-Cloudflare address refused, `dev.yallo.co` through Cloudflare still 301ing to yallo.co).

## 7. Forbidden

No real accounts; no taxonomy values assigned to the nine studies; no article or case-study content authored or published; fixtures create and remove themselves. No briefs or conversations work beyond what role guards already do (round 26's territory). No `www` Caddy block, no Volcanic path, no touching the dev droplet beyond R-25b.6's cloud firewall. No credential entry. No performance work against Phase 8. UK English, no em dashes, canon vocabulary, explicit commit paths. Relay v35 at `docs/relay/v35.md`: standard shape, RETRACTIONS even if empty, watched exit codes throughout, the pre/post-merge prose comparison evidence, and every red-proof individually. End with the round's PR open and green, unmerged; merges are Sumeet's.
