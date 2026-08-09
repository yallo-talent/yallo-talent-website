# Context — Admin Cockpit v3: the publishing and growth engine

**v1.0 · 9 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` (as amended by `canon-amendment-2026-08-09.md`) and `DESIGN.md`. Supersedes `context-cockpit-v2.md`, which described a git-backed cockpit that Sumeet's rulings of 9 Aug replace. Status: ratified by Sumeet 9 Aug 2026 on four rulings; build split across rounds 25 and 26.

## 1. What the cockpit is now for

The website exists to generate inbound leads and win new clients for Yallo Talent. The cockpit is the machine that does it, and it has three jobs, in this order:

1. **Publish thought leadership daily.** Articles are the inbound engine. The bar is Substack, not a form: a writer opens the cockpit, writes, formats, and the piece is live in seconds.
2. **Publish proof.** Case studies carry trust. Same engine, more structure, plus consent discipline and an ordering the homepage obeys.
3. **Convert.** Briefs and conversations are the funnel, and they become a working lead surface rather than a log (round 26).

Raphy owns this machine day to day as Head of Marketing and Growth. His content team writes; Talent Ops works the briefs; Sumeet retains ownership.

## 2. The four rulings of 9 August

| # | Ruling | Consequence |
|---|---|---|
| **R-C1** | **Content lives in the database, not in git. No git copy.** | `content/insights/**` and `content/case-studies/**` are imported and retired. Publishing writes a row and revalidates; nothing rebuilds. Version history moves from git commits to in-database revisions. |
| **R-C2** | **No pull request in any content path.** | The PR-and-CI publishing route, staged ordering and the content CI lane are superseded for articles and case studies. Validation moves from CI into the publish action, where it must be at least as strict. |
| **R-C3** | **Article bodies may carry uploaded images, charts and PetalPlate art.** | Canon §5's imagery rule relaxes for article and case-study bodies only. Marketing surfaces, heroes and page furniture keep the existing rule. |
| **R-C4** | **Four roles: owner, admin, editor, ops.** | Sumeet is owner. Raphy is admin and sees everything including briefs and conversations. Content team are editors. Talent Ops are ops. `/privacy` is amended to state this truthfully. |

**What R-C1 and R-C2 cost, stated plainly so nobody rediscovers it later.** Round 23 built a PR-based publishing path, staged ordering and a content CI lane. For articles and case studies those are superseded. That is the price of daily publishing, and it was paid knowingly. Three protections CI used to give must be rebuilt inside the application, or quality silently drops: figure sourcing, terminology, and internal-link integrity. §7 covers this and it is not optional.

## 3. Content architecture

**Tables.** `articles`, `case_studies`, `content_revisions`, `media_assets`. Status is an enum: `draft`, `review`, `scheduled`, `published`, `archived`. Nothing is ever hard-deleted; archive is the terminal state, so a URL can always be resolved or redirected.

**Body format.** TipTap (ProseMirror) document JSON is canonical. It is rendered server-side through an allow-list of node types, so an editor cannot inject arbitrary markup and the rendered article always obeys `DESIGN.md`. MDX is retired for these two types.

**Publishing.** A publish writes the row inside one transaction and calls on-demand revalidation for the article route, the index, the taxonomy surfaces, the homepage rail where relevant, the sitemap and `llms.txt`. Target: live within seconds, no deployment.

**Revisions.** Every save writes a revision row carrying the full body, the author and the timestamp. Any revision can be previewed and restored. This is what replaces git history, and it is the reason "no git copy" is safe.

**Reading and rendering.** Public routes read published rows with request-level caching and tag-based invalidation. A draft is reachable only through a signed preview URL that renders it in the real template.

## 4. The editor

The bar is a writer never wanting to draft somewhere else first.

- Rich text: headings (H2 and H3 only, H1 is the title), bold, italic, links, ordered and unordered lists, blockquote, horizontal rule, inline code, code block.
- Yallo blocks: pull quote, key-figure callout with its source, FAQ block, related-desk card, PetalPlate divider, image with caption and alt text, simple bar or line chart from typed rows.
- Slash command and a floating toolbar on selection. Keyboard shortcuts. Undo history.
- Autosave every few seconds with a visible saved-state indicator; no work is ever lost to a closed tab.
- Live word count and computed reading time; reading time is never asserted by hand.
- Side-by-side preview in the real article template, both themes, at mobile and desktop widths.
- Full-screen writing mode.
- The editor surface itself gets the cockpit's design treatment: paper ground, Newsreader for the title field, Inter for body, real contrast, generous measure. It should look like the publication it produces.

## 5. Taxonomy, filtering and the index

Three dropdowns, sourced from the live taxonomy indexes, never retyped: **Industry** (7), **Platform** (7), **Discipline** (7). At least one is mandatory; any combination is allowed. A fourth field, **Category**, carries the editorial type (Market intelligence, Hiring guidance, Programme staffing, AI talent, Company news).

`/insights` gains filter controls driven by the same three taxonomies plus category and a text search. Filter state lives in the URL so a filtered view is shareable.

**Crawl discipline.** Only single-facet views are indexable, and each is a real landing page with its own copy: `/insights/platform/sap`, `/insights/industry/retail`, `/insights/discipline/ai-talent`. Multi-facet combinations canonicalise to the base index and carry `noindex`. This gives 21 genuine SEO surfaces without opening a faceted-crawl hole.

## 6. SEO and GEO

Every article and case study carries, as first-class fields with live character counters and defaults derived rather than blank:

- Title tag and meta description, canonical URL, OG and Twitter cards, OG image (uploaded hero, or PetalPlate generated from the slug).
- `BlogPosting` or `Article` schema with `Organization` as author (house byline, canon §8), `datePublished`, `dateModified`, `articleSection`, `about` from the taxonomy, `mainEntityOfPage`; `BreadcrumbList`; `FAQPage` where an FAQ block is present.
- Slug editable before first publish, frozen after, with an automatic redirect row written if it ever changes.
- Automatic internal links to the desks named in the taxonomy fields, plus a related-articles rail derived from shared taxonomy.
- The answer-first rule from `context-discoverability-scope-v1.0.md` §4 enforced as a soft check: the summary and the first paragraph must state the answer, and the editor warns when the first screen carries no substantive claim.
- Sitemap and `llms.txt` become dynamic, read from the database, with `lastmod` from `updated_at`.

## 7. What CI protected, and where it moves

Validation runs in the publish action and blocks publishing, not saving. Drafts may be incomplete; published content may not.

| Was | Becomes |
|---|---|
| `check:sources` in CI | Publish-time refusal: any figure in the body without a matching source entry |
| Terminology lint | Publish-time refusal on canon §2 banned vocabulary, with the documented allow-list method |
| `check:yallo-case` internal links | Publish-time refusal on any internal link that does not resolve, plus a nightly sweep over published rows |
| `check:cs-excerpts`, published manifest | Database constraints and publish-time field checks |
| Rates and fees rule | Publish-time refusal on any rate, fee or day-rate figure |
| Byline | Not a field. "Yallo Talent" is applied by the system |

A nightly job re-validates every published row and reports drift to the cockpit rather than failing anything silently.

## 8. Case studies

Everything above, plus: client name and `clientPublic` consent flag (a study cannot publish naming a client until consent is recorded, with the recorder and date captured), logo consent, structured outcome metrics each carrying its own source, engagement pillar, platform, industry, region, and the quotation block with attribution fields that render nothing until all of them are real.

**Ordering is drag and drop**, with an integer position column and one save. The homepage rail and `/case-studies` both read that order. No staged-order cookie, no PR.

## 9. Media

Uploads go to object storage, not the database or the repository. Automatic resizing to the widths the templates use, modern formats, and a required alt-text field that blocks publishing when empty. A media library pane lists what exists, where it is used, and refuses deletion of anything in use.

## 10. Roles

| Role | Reaches |
|---|---|
| **owner** | Everything. Cannot be disabled or demoted by anyone. Sumeet. |
| **admin** | Everything: articles, case studies, media, briefs, conversations, users. Cannot demote or disable the owner. Raphy. |
| **editor** | Articles, case studies, media. No briefs, no conversations, no users. |
| **ops** | Briefs. No content, no conversations, no users. |

An audit log is now required, not deferred: with four roles and a growing team, "who published that" must have an answer.

## 11. Round split

**Round 25, publishing.** Schema, import, editor, taxonomy, instant publish with validation, SEO fields and schema, media, drag-and-drop ordering, roles and privacy, dynamic sitemap and `llms.txt`, public index filters.

**Round 26, the funnel.** Briefs and conversations rebuilt as a working lead surface: pipeline states, owner, SLA clock against the 72-hour commitment, notification on arrival, filtering, search, saved views, export, conversation-to-brief linkage, and the analytics that show which pages start conversations.
