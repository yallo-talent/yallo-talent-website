# Context — Round 13: the site assistant, and where a brief lands

**v1.0 · 3 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Scope brief, pending Sumeet's ratification.
Sequencing: **this round does not dispatch until round 12's relay is adjudicated.** Nothing here is on the cutover critical path.

Ratified by Sumeet, 3 August: the assistant is a **brief qualifier**, not a general Q&A bot; it serves **clients only** with a punchout to `/jobs`; it **may name clients exactly as the published case studies already name them**; Sumeet owns the build via Claude Code.

---

## 1. What this is, and the one thing it is not

A deferred, in-page assistant that answers a buyer's question from the site's own content, cites the page it answered from, and — where the conversation has brief shape — assembles the brief as it goes.

**Its job is not to answer questions. Its job is to produce a qualified brief.** A Q&A bot answers and the visitor leaves. A brief qualifier answers and the conversation becomes the form, which is the conversion the whole site is already shaped around: send the role, the platform, the timeline. Nobody in the Phase 1 benchmark set has this — Halian, Michael Page and Robert Half all convert through forms and callbacks.

**It is not an SEO or AI-visibility asset.** `context-discoverability-scope-v1.0.md` §2 is explicit that retrieval runs against the same Search index, and Google names content chunking and `llms.txt` among tactics to ignore. Nothing in this round is justified on citation grounds, and no internal document should later claim it was.

**Second-order benefit worth naming.** Every conversation is first-party intelligence on which roles, platforms, modules and regions are being asked for, at which engagement model. That is the same class of asset the game plan describes when it says every placed contractor is intelligence on the next five roles, and it is direct input to the Programme Staffing Blueprint and to CORE.02. It is a by-product, not the justification.

---

## 2. Where a brief lands today — measured, and worse than assumed

Read from the repository on 3 August, not from the defect register, which is stale since round 9.

`src/app/api/brief/route.ts` validates the payload with `briefFormSchema` (zod), builds an HTML email with the fields escaped, and sends it via Resend to `RESEND_TO` — **defaulting to `hello@yallo.co`** — with `replyTo` set to the enquirer's address. `src/app/api/cv/route.ts` is the same shape for the candidate upload.

**There is no backend and no database.** `package.json` carries no ORM, no Postgres client, no queue: no drizzle, no neon, no prisma. The site is static pages plus two email routes. **A brief is an email in one shared inbox and nothing accumulates.** No enquiry is queryable, countable, attributable to a page or a campaign, or recoverable once the email is deleted.

Three defects follow, and the first is serious:

| # | Defect | Why it matters |
|---|---|---|
| **L1** | **Silent loss when the key is absent.** With `RESEND_API_KEY` unset the route returns `{ ok: true, delivered: false }` with a 200. The form renders success. The payload is `console.warn`'d and gone. | On a fresh deploy where the secret has not been set, **every enquiry vanishes while the buyer believes it arrived.** This is the site's only conversion surface. A validated payload that cannot be delivered must never return `ok: true`. |
| **L2** | **The sender is the placeholder host.** `RESEND_FROM` defaults to `brief@talent.yallo.co`. | At cutover this has to become a yallo.co sender with SPF and DKIM aligned, or briefs land in spam. Raphy owns the form backend and deliverability per game plan §12; **it is not confirmed that this is on his cutover list.** Send it to him as a question. |
| **L3** | **No source, referrer, campaign or timestamp is captured.** Fields are name, company, email, role, platform, region, engagement, message. | You cannot tell which page or channel produced a lead. **And the moment this assistant exists there will be two lead sources with no common store and no way to compare them.** That is why the capture layer belongs in this round rather than a later one. |

### 2.1 The ruling: persist first, route second

The website's job is to **capture durably, then fan out.** One append-only store, one row per submission: the raw validated payload, a `source` discriminator, referrer and campaign parameters, a timestamp, and a delivery status per downstream. Email becomes a *route off* that record rather than the only copy of it.

The reason is not tidiness. It means every future change of destination is a re-route rather than a data migration, and it means a downstream failure — Resend bouncing, a webhook timing out — degrades to a retry instead of a lost buyer.

**Why not straight into Vincere.** Vincere is slated for decommission by CORE.03's Talent Engine. A deep integration into a system being replaced is the expensive mistake, and the game plan already treats the Vincere handoff as Raphy's production-secrets work rather than the site's.

**Why not straight into Yallo Hub.** Hub (CORE.02) is the right eventual home — these are leads and opportunities, which is precisely its relationship-intelligence remit. But CORE.02 owns that schema, it does not yet exist for this purpose, and the website must neither wait on it nor guess its shape. The capture table is what Hub later reads from.

**Why this is not scope creep.** GTM.01's instructions say do not build bespoke content infrastructure inside this project, and that holds. **A durable append-only log is not a CRM.** It stores nothing Hub would not store, models no pipeline, and adds no UI. It exists so that no enquiry is lost while the system of record is being decided elsewhere. If Sumeet would rather accept email-only until Hub is ready, L1 must still be fixed — a false success on the conversion surface is not acceptable at any scope.

**Interim CRM routing: none. Ruled 3 August.** Sumeet's position: HubSpot exists but is not being leveraged, the eventual CRM will be a single system across Talent, saasinator and Academy, and **Yallo Hub is expected operational by end of August**. So there is no interim integration to build. The capture row persists, the email goes to Sumeet's `brief@yallo.co` and `hello@yallo.co` aliases, which he is creating with an inbox routing folder, and **one Hub connector is built when Hub lands** rather than a HubSpot webhook that would be retired within weeks. That timing is close to when the assistant opens, so the sequencing costs nothing.

---

## 3. Architecture — and the decisive call is no vector database

The corpus is **roughly 60 to 80 documents** — six industry L1s, twenty retail L2s, fourteen platform and discipline desks, four service pages, eight published case studies, `/why-yallo`, `/leadership`, `/about`, `/intelligence`, `/ai-talent`, the legal set. **[INFERRED]** from the route tree; take the real count from `publishedPaths()`.

**Put the whole corpus in a cached system prompt. Build no retrieval layer.** Anthropic's prompt-caching documentation names this exact pattern — embedding entire documents into the prompt and letting users ask questions of them. A cache hit costs 10% of standard input, so caching pays for itself after a single read on the five-minute TTL, and the 1,024-token minimum for Sonnet 5 is trivially cleared by a corpus this size. **[⚠]** Confirm current per-token rates and cache TTL behaviour against `https://platform.claude.com/docs/en/about-claude/pricing` at build time rather than from any figure quoted in conversation.

**Why this beats pgvector here, and the reason is this repository's history.** A vector store is a **second source of truth**, and the recurring defect class across eleven rounds has been a label or a list copied into a second place and drifting from the first. Round 10 found six fabricated job listings and five invented personas; the fix in both cases was to derive from one index rather than maintain a copy.

**So: generate the corpus digest from `src/data/**` and `content/**` at build time**, exactly as `sitemap.ts`, `llms.txt` and `publishedPaths()` already do. One source, derived, cannot drift. Filter it to published routes only — an assistant that can discuss an unpublished page is a leak.

**One model, Sonnet 5. No router, no cheap-tier triage.** Traffic on an enterprise B2B marketing site is low enough that token cost is not the binding constraint; the quality of what it says to a CHRO is. Haiku is the wrong economy on a surface that speaks for the business. Revisit only if measured volume makes it a real line item.

**Mounting: a deferred island, and this is a hard constraint, not an optimisation.** Phase 8 currently misses on eight of eight routes, and zero third-party requests is a measured property of this site worth keeping. The launcher is a small inline button; the assistant bundle is fetched on first interaction and never enters the initial payload. Nothing render-blocking, no effect on LCP, which round 11 measured as a text node on all eight routes.

**Shipping posture: merged before cutover, flag off through cutover, opened about a week after.** The build is low-risk. The go-live is not, for one reason that cannot be engineered away: `talent.yallo.co` is noindex, so there is effectively no pre-cutover traffic, and **you cannot pilot an answer surface without traffic.** Opening it on cutover day also means that if enquiries move you cannot attribute the movement against the DNS change, the redirect map, the WordPress teardown and the robots flip. Flag-off costs nothing and buys both.

---

## 4. Conversation design

### 4.1 The two jobs, in order

1. **Answer from the corpus, and cite the page.** The citation is not decoration: it makes the assistant navigation rather than a replacement for the site, and it gives the buyer somewhere to verify what they were told.
2. **Detect brief shape and capture progressively** — platform and module, role, region, engagement model, timeline, then company, name, email.

**Never ask for the email first.** Value before the ask, every time. The ask is framed as the brief and not as a lead form: the natural close is offering to put it in front of the people who screen, and asking for the timeline.

### 4.2 The payload, and why it reuses the existing schema

When a conversation reaches a real brief, it emits a payload conforming to **`briefFormSchema`** — the same zod schema `/brief` already uses — extended with a `source` discriminator and a transcript reference. **One capture path, not two.** Do not author a second brief shape; if a field is genuinely needed that the form does not have, add it to the shared schema so both surfaces gain it.

### 4.3 What it does when it cannot help

It says so, and routes to a human. An assistant that improvises is worse than one that stops. "I do not have that on the site" followed by the brief route or a named contact page is a complete, acceptable answer.

---

## 5. Forbidden — the real risk lives here, not in the architecture

`context-round9-scope.md` §7 and `context-round11-scope.md` §6 carry forward in full. These are additional and specific to a generative surface. Every one of them is a thing an ungoverned model will do unprompted.

- **No rate, fee, day rate, percentage or salary figure, ever, under any framing.** Canon keeps rates off the public site and inside the gated Blueprint. A model asked "what does an SAP FICO contractor cost in Dubai" will estimate one. It must refuse and route.
- **No commitment on Yallo's behalf.** "72-hour shortlist" is a **shortlist** claim and nothing more. The Phase 1 benchmark flags this conflation explicitly against Hays' reported nine-day time-to-fill: a model will turn a shortlist claim into a fill guarantee. **Ruled 3 August: there is no no-fee guarantee and none is planned** — Sumeet declined it on abuse risk, closing benchmark §6 item 3. That tightens this rule rather than loosening it: there is now no guarantee for the assistant to extend the claim into, so any risk-reversal language it produces is invented. It may state the shortlist claim as the site states it, and must not extend, restate, quantify or attach conditions to it.
- **No invented client, metric, quotation, source, case study, person or date.** Clients may be named **only** as the eight published case studies name them, and only with the outcomes those studies state. Nothing beyond the page.
- **No characterisation of the five named leaders beyond name, role and link.** Identical to §1.4's bio ruling in round 12. Sumeet's published history is quotable because it is already on `/why-yallo`; nothing else is.
- **No candidate, CV, availability or bench claim.** It must never imply a named or countable pool. Round 10's fabricated `/jobs` listings are the cautionary case: a real candidate could have acted on them.
- **No legal, immigration, visa, tax, IR35 or employment-law advice.** EOR questions route to the page and then to a human.
- **No "GCC", no banned canon vocabulary, no em dashes, UK English.** The terminology lint governs generated output as much as authored copy; assert this in the system prompt and test it.
- **No discussion of unpublished, draft or `published: false` content**, and no acknowledgement that it exists.
- **No group framing.** Yallo Talent only, per R1 and R2. It does not describe saasinator, the Academy or Yallo Group beyond the single reason-to-believe line the site already carries.

---

## 6. Privacy, and the gate before it opens

**A conversation log plus a brief is personal data.** The corridor is Middle East and Europe, so UAE PDPL and EU GDPR both apply. **Retention ruled 3 August: transcripts are kept 12 months, then deleted. Briefs persist as commercial records.** Also required before the flag is turned on: a line in `/privacy` describing the assistant by name, what it stores and for how long; a disclosure in the launcher that the conversation is recorded; and no capture of anything the brief form does not already capture.

**The pilot gate.** Flag on for Sumeet and a small internal set first. **Sumeet reads the first 50 to 100 real conversations** before it opens to traffic. There is no automated substitute for this: the failure mode is a plausible, fluent, wrong sentence, and no gate detects that. Any refusal-boundary breach found in the pilot is a canon fix, not a prompt tweak.

---

## 7. Gates and acceptance

Existing gates apply unchanged: `check:terms`, `check:a11y` including the axe experimental pass round 12 adds, `check:reflow`, `check:contrast`, `check:type-render`, `check:prose`. New, and each must be watched failing on its own motivating case before it counts:

1. **A refusal suite.** A fixture set of adversarial prompts — asking for a rate, a guarantee, a candidate name, a colleague's background, legal advice, an unpublished page, a competitor comparison — asserted to refuse and route. This is the gate that matters.
2. **A grounding assertion.** Every factual claim in a sampled response traces to a corpus document. An ungrounded answer fails.
3. **Terminology on generated output**, not only on authored files.
4. **A bundle assertion**: the assistant contributes nothing to the initial payload on any route. Fail the build if it does.
5. **Accessibility**: keyboard reachable, focus trapped and restored, announced to screen readers, `prefers-reduced-motion` honoured, AA in both registers at 360 and 1280. A chat panel is the most common place an otherwise accessible site fails.
6. **A capture assertion**: a validated payload that cannot be delivered downstream is persisted and never reported to the user as sent. This closes L1 for both surfaces.

---

## 8. Ratified 3 August — nothing in this section is open

| Item | Ruling |
|---|---|
| Durable capture | **Ratified.** §2.1 builds it. |
| Interim CRM | **None.** No HubSpot, no Vincere push. One Hub connector when Hub lands, expected end of August. §2.1. |
| Transcript retention | **12 months.** Briefs persist as commercial records. §6. |
| The risk-reversal commitment | **Declined.** The 72-hour shortlist claim stands as already published; **no no-fee guarantee, on abuse risk.** Benchmark §6 item 3 closes as declined, with the reason recorded so a later benchmark refresh does not reopen it as an oversight. §5. |
| Public response-time promise | **None.** Chat's decision under delegated authority, logged for veto: an assistant promising a reply window into an inbox folder is a commitment nobody has made. It says the brief reaches the people who screen, and stops. |
| Brief recipient | Sumeet's `brief@yallo.co` and `hello@yallo.co` aliases, with an inbox routing folder. Long-term routing revisited when volume justifies it. |

Still to send Raphy, and it is not Code's: the `RESEND_FROM` change to a yallo.co sender with SPF and DKIM aligned (L2), and confirmation of the `RESEND_TO` target now that the aliases exist.

---

## 8a. Also in this round: the Intelligence nav card

Carried in because it is a live canon breach on every page's nav and it must not reach cutover. Not into round 12 — that round's bolt-on states the build must not change once measurement starts, and a `nav-config.ts` edit would invalidate the Phase 8 run.

**The defect.** `src/components/layout/nav-config.ts`, the Intelligence group's `featured` card:

```
title: "Talent research briefings",
copy:  "Compensation windows, availability signals and hiring notes...",
href:  "/insights",
```

**It is not a dead link** — `/insights` exists, which is why no gate fired. `check:yallo-case` proves every href resolves and `check:no-redirects` proves there is no hop. Neither checks whether a card's promise matches its destination.

**It is a canon breach, and the same one was fixed one item above it in the same file.** The AI talent item's own comment reads: *"'AI Talent Atlas — AI roles, scarcity and comp windows' promised two things the page is forbidden to publish: R-AI3 bans a scarcity figure and a rate outright. A nav description is a claim like any other, and this one could never have been met by the page behind it."* That was found, ruled and fixed. "Compensation windows, availability signals" then survived one entry below it. Fix-the-instance rather than fix-the-class.

**And the promise is unmeetable in principle, not just today.** `context-round14-research.md` §1 records the measured finding that the LTI corpus contains **no compensation data of any kind**. No page built on that evidence base could ever have delivered compensation windows.

**The fix.** Repoint the card at `/intelligence` and rewrite the copy to describe what that hub actually holds. No compensation language, no availability-signal language, no count. It repoints again to `/intelligence/research` when round 14 ships that route; until then `/intelligence` is the honest destination.

**The gate, and it is the more valuable half.** A card's promise and its destination are a new assertion class: no existing gate compares copy against the page behind it. Add a check that every `NavFeatured` and every `NavItem` description is consistent with its target — at minimum, that no nav copy contains terminology the destination page is forbidden to publish, driven from the same banned-vocabulary source `check:terms` already uses. Then reintroduce the compensation wording, watch the gate fail on it, revert. A gate nobody has watched fail is not a gate.

---

## 9. Explicitly out of scope

- **The candidate variant.** Clients only this round, with a quiet punchout to `/jobs`. Build the corpus and the transport generic so the candidate assistant is a second system prompt plus a corpus filter, never a rebuild.
- **The job board.** `/jobs` continues to punch out to Volcanic. Talent Engine (CORE.03) and the eventual own-built board and candidate portal replace both Volcanic and Vincere on their own schedule; nothing here anticipates that beyond keeping the punchout swappable.
- **Hub integration.** CORE.02's schema and CORE.02's decision. This round makes the data exist and be readable; it does not model a pipeline.
- **Any claim that this improves search or AI-answer visibility.** §1.
