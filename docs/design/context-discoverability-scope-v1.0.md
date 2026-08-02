# Context — Discoverability scope: classic search, agentic retrieval, social

**v1.0 · 2 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. Scope brief, pending Sumeet's ratification.
Sources verified by search on 2 August 2026, not from training data. Every claim below is tagged.

---

## 1. Two things that jump the queue

Neither waits for round 7. Both are cheap and both get more expensive with time.

**1. The AI-crawler policy must be environment-driven, alongside defect B6.** `src/app/robots.ts` allows all crawlers today and `SITE.url` points at the placeholder host. B6 was filed as an indexing risk. It is now worse than that: **[FACT]** real-time search crawlers tolerate redirect chains poorly, and one extra hop can drop a page out of a generated answer; **[FACT]** blocking or missing the retrieval layer is hard to reverse because LLM systems cache. A Google index entry for `talent.yallo.co` is undone by a 301. An AI answer that has learned to cite `talent.yallo.co` is not. The placeholder must serve `Disallow: /` to every crawler family, and the full policy must apply only on the production host.

**2. Confirm the CDN or WAF is not blocking retrieval bots.** **[FACT]** Most sites built or last audited before 2023 block AI crawlers unintentionally, through CDN configurations that treat `OAI-SearchBot` and `PerplexityBot` as malicious scrapers. This invalidates everything else in this document if it is true, and it cannot be seen from the repository. Raphy owns hosting; this is a question to send him now, not a build item.

---

## 2. What the verified guidance rules out

Most of the "AI optimisation" scope an agency would propose is either ineffective or explicitly discouraged. Recording it so it does not get bought.

| Claim | Status |
|---|---|
| AEO and GEO are separate disciplines needing their own strategy | **[FACT]** Google's 15 May 2026 guide addresses both by name and states that optimising for generative AI search is optimising for the search experience, and thus still SEO |
| AI Overviews and AI Mode use a separate index | **[FACT]** They are grounded in the same Search index classic ranking uses. No search rankings, no AI citations |
| Special AI schema markup is needed | **[FACT]** Google states structured data is not required for generative AI features and there is no special schema to add. Structured data stays recommended for rich results |
| `llms.txt` drives AI citations | **[FACT]** Google lists it among tactics to ignore. **[FACT]** An SE Ranking model found removing the `llms.txt` variable improved prediction accuracy — it added noise, not signal, to citation frequency |
| Content chunking for LLMs | **[FACT]** Named in Google's ignore list |

**`llms.txt` is still worth shipping, for a different reason and with no citation claim attached.** **[FACT]** Anthropic recommends it in its Writing for Agents guidance, OpenAI uses it for the Agents SDK and the Agentic Commerce Protocol, and Chrome's Lighthouse 13.3 added an Agentic Browsing audit category in early May 2026 that checks whether a site provides the file. **[REC]** ship it as agent wayfinding and a Lighthouse audit item, generated from the route tree so it cannot drift, and never described internally as an AI-visibility lever. It is close to free because the sitemap generator already walks the routes.

---

## 3. The crawler policy

**[FACT]** Three distinct families, and treating them as one is the common error.

| Family | Agents | What blocking costs |
|---|---|---|
| **Training** | `GPTBot`, `ClaudeBot`, `CCBot`, `Meta-ExternalAgent` | Nothing immediate. A policy choice about model training |
| **Retrieval** | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Bingbot`, `DuckAssistBot`, `Amazonbot` | Citation eligibility in that engine's answers. This is how AI citations happen |
| **User-triggered** | `ChatGPT-User`, `Claude-User`, `Perplexity-User`, `MistralAI-User` | Breaks the moment a real buyer hands a Yallo page to their assistant |

**[FACT]** `Google-Extended` and `Applebot-Extended` are not crawlers. They are robots.txt control tokens governing generative-AI training use.

**[REC] Allow all three families on the production host.** The trade-off is real and it resolves one way: publishers block training crawlers because they hold licensing leverage and can sell the corpus. Yallo has none, and its content is a lead engine rather than an asset for sale. Blocking training buys nothing measurable and risks a misconfiguration that catches the retrieval layer, which is the expensive mistake. Block `CCBot` if Sumeet wants a symbolic opt-out; it costs nothing either way.

**[FACT]** `Bytespider` and some Perplexity crawlers have been documented ignoring robots.txt, so robots.txt is a norm rather than a guarantee. Server or WAF level is the only real control. Raphy's, not ours.

---

## 4. What actually earns citations, and how it changes the copy work

**[FACT]** Google names two mechanics behind its AI features: retrieval-augmented generation, and **query fan-out** — the model generates multiple related queries from one prompt and runs them concurrently before answering.

Fan-out is the finding with real consequences for this site. A page optimised for one keyword satisfies one of the fanned queries. A page that answers the adjacent question shapes gets retrieved for several. That reframes three things already in the plan:

1. **The title and H1 pass agreed for the fourteen platform and discipline desks.** Already right, and fan-out is a second reason: "SAP contractors and consultants · Middle East and Europe" covers more fanned queries than "SAP" and more than "SAP Talent" would have.
2. **FAQ blocks on service and platform pages**, which the Phase 1 benchmark already identified as a pattern to take from Halian, move from cheap SEO surface to the highest-value fan-out surface on the site. **[FACT]** The FAQPage SERP enhancement is deprecated but the schema type itself is not, and Google confirmed this explicitly. Keep the markup; expect no rich result from it.
3. **The Programme Staffing Blueprint is the strongest agentic asset on the site and nobody else has one.** It answers procurement-stage questions — team shape by phase, which roles get under-scoped, realistic time-to-hire per role — at exactly the moment a programme director asks an assistant to research staffing a rollout. Canon already gates it. **[REC]** publish an ungated summary layer per archetype that is retrievable, with the quantities behind the gate. A fully gated asset cannot be cited, and a citation with no numbers still names Yallo.

**The rule this implies, and it is a copy rule not a technical one:** a page states its answer in its own words, near the top, in a form that survives extraction. Canon §9's talent-speak rule already forces this. What it does not yet forbid is the answer arriving only after three scroll-depths of atmosphere.

---

## 5. The entity layer

**[FACT]** Practitioner consensus on non-Google surfaces converges on entity consistency and third-party corroboration rather than on-page markup tricks.

- `Organization` schema with `sameAs` to the LinkedIn presence and every other owned profile, so the four entities resolve to one company.
- Consistent naming and address data across London, Dubai, Riyadh and Bengaluru. Canon §1 fixes the four entities; the site must state them identically everywhere, and "Bengaluru" never "Bangalore" per canon §2.
- `Service` and `JobPosting` where genuinely applicable. `JobPosting` belongs to the board, not the marketing site, and stays out of scope here.
- **No `Person` schema until real named consultants exist.** Canon §8's no-invented-people rule governs structured data exactly as it governs copy.

**[FACT]** Google has a Preferred Sources feature: users can nominate sources, which makes that content more likely to surface in AI Mode and AI Overviews for them. **[REC]** worth a single line in the eventual newsletter footer. Not a build item.

---

## 6. Social

The defect register flagged that `SITE.defaultOgImage` points at `/images/og-default.jpg` with no confirmation the file exists, which would mean every share on every channel currently previews broken.

**[REC] Generate per-page OG images from the PetalPlate system at build time.** Canon §5 already bans stock photography and hotlinked imagery and specifies PetalPlate as deterministic from the page slug. The same generator produces a 1200×630 card per route. That gives every page a distinct, on-brand preview with no third-party dependency, no photography budget and nothing to keep in sync — and it closes the broken-preview defect as a by-product rather than as a separate task.

---

## 7. Measurement, without which none of this is manageable

Two baselines, both taken before cutover, neither a build item:

1. **Server-log analysis by user-agent.** Which AI crawlers reach the site, how often, and which routes. This is the only first-party evidence that exists; everything else is inference.
2. **Citation-share baseline** across ChatGPT, Perplexity, Google AI Mode and Claude for the queries that matter: the platform-plus-region shapes, the four pillars, and "AI talent" in the Middle East. Recorded as a dated snapshot so post-cutover movement is attributable.

**[⚠]** Both need an owner. **[REC]** the log analysis rides with the cutover; the citation baseline sits with TAL.02 or GTM.13, not with the build.

---

## 8. Scope placement

**Round 7, session A — system and gates**

1. Environment-driven crawler policy in `robots.ts`: full three-family allow on the production host, `Disallow: /` for every family on any other host. Same env switch as B6's `noindex`.
2. `llms.txt` generated from the route tree, alongside `sitemap.ts`, filtered to published routes.
3. Per-page OG image generation from PetalPlate, and the `defaultOgImage` defect closed.
4. `Organization` schema with `sameAs` and the four entities, derived from one source, not hand-typed. It is a taxonomy in all but name and the derivation class applies.
5. A gate asserting no internal link resolves through a redirect. `check:yallo-case` already proves every internal href resolves; a hop is a different defect and it now costs AI retrieval, not just crawl budget.

**Round 7, session B — data and copy**

6. Title and H1 pass across the fourteen platform and discipline desks, per the pattern already agreed: name what Yallo places, in buyer vocabulary, never the platform's own marketing.
7. FAQ blocks on the platform and discipline desks, authored from real procurement questions. **[⚠]** This is authoring and it needs a source for every question. Do not let a session invent buyer questions.

**Canon amendment to ratify (§9, content operating rules)**
> A page states its answer in its own words within the first screen, in a form that survives extraction from its surrounding layout. Retrieval systems quote the sentence that answers the question, not the page it sits on.

**Game plan amendments**
- §7 redirect map: no chained redirects. Every legacy URL resolves in one hop. Chains cost AI retrieval eligibility, not only crawl budget.
- §9 Phase 9 cutover: add a pre-cutover CDN and WAF check that the retrieval crawlers are not blocked, and a post-cutover log check that they returned.
- §11 risk register, two additions: *"Placeholder host cited in an AI answer before cutover"* — severity raised above B6's original filing, because caching makes it hard to reverse; *"CDN or WAF silently blocking retrieval crawlers"* — Medium to High, invisible from the repository, owner Raphy.
- §12 operating model: Raphy's dependency list gains the CDN and WAF crawler-access confirmation.

---

## 9. What we are explicitly not doing, and why

No AI-specific schema. No content chunking. No separate AEO or GEO workstream. No `llms.txt`-derived Markdown mirror of every page — **[FACT]** a widely-copied implementation pattern that Google's own guidance describes as a poor use of time. No claim, internal or external, that `llms.txt` improves citation rates.

The honest position: **[FACT]** the same fundamentals that drive classic rankings drive visibility inside AI answers, because the retrieval runs against the same index. Everything in §8 is either a cheap hygiene item, a measurement baseline, or copy work that was already justified on classic-search grounds and is now justified twice.
