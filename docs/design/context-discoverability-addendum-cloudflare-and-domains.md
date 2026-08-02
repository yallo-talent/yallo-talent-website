# Addendum — Cloudflare posture and domain architecture

**v1.0 · 2 August 2026 · Chat lens · appends §10 and §11 to `context-discoverability-scope-v1.0.md`**
Sources verified by search on 2 August 2026. Facts, assumptions and recommendations tagged distinctly.

---

## 10. Cloudflare — the target configuration, and a deadline

Raphy confirmed Cloudflare handles CDN and WAF but could not say what is configured. That is normal and it is not a blocker, because the posture is measurable rather than something anyone needs to remember.

### 10.1 The deadline

**[FACT]** On 1 July 2026 Cloudflare split crawler controls into three behaviour categories — Search, Agent and Training — each independently blockable, with a per-category choice of block on all pages, block only on pages displaying ads, or do not block. The controls are live now on every plan including Free.

**[FACT]** From **15 September 2026**, domains newly onboarding to Cloudflare receive defaults in which Training and Agent are blocked on ad-displaying pages while Search stays allowed. Existing zones keep their current settings and are not swept into the new defaults.

**[FACT]** The consequential change applies to everyone: multi-purpose crawlers are evaluated under all of their behaviours. A site blocking Training therefore also blocks **Googlebot, Applebot and BingBot**, even where Search is explicitly allowed. Cloudflare states this includes the legacy one-click "Block AI Bots" toggle. **[FACT]** Cloudflare's own figure is that 36% of crawler activity now comes from mixed-use crawlers that blend Search and Training in a single bot.

**Why this matters to Yallo specifically.** yallo.co carries no advertising, so the ad-page defaults are largely inert here. The exposure is entirely the legacy toggle. If it was flipped during the WordPress era — one click, heavily promoted from July 2025 — then the site is already invisible to the retrieval layer, and from 15 September it would also lose Googlebot. Nobody would see either from the repository.

### 10.2 Target configuration for the yallo.co zone

**[REC]** Ratify this as the posture, and treat it as canon rather than a setting.

| Control | Setting | Reasoning |
|---|---|---|
| **Search** category | Do not block | Citation eligibility in AI answers. Non-negotiable |
| **Agent** category | Do not block | A buyer handing a Yallo page to their assistant is the highest-intent event on the site. Blocking breaks the moment it happens |
| **Training** category | Do not block | Yallo holds no licensing leverage and the content is a lead engine, not a corpus for sale. Decisive reason: on Cloudflare, blocking Training blocks Googlebot |
| **Legacy "Block AI Bots" toggle** | Confirmed off | The single most important check in this document |
| **Bot Fight Mode / Super Bot Fight Mode** | **[⚠] Verify** | Challenges non-verified automated traffic and is a documented source of accidental crawler blocking. Confirm behaviour toward verified AI bots before relying on it |
| **WAF custom rules and rate limiting** | **[⚠] Audit** | Confirm no rule matches the AI user-agents or their ASNs. A rule written against scrapers in 2023 does not know these bots exist |
| **Pay per crawl** | Not applicable | **[FACT]** In limited rollout. Built for publishers monetising a corpus. Yallo's content exists to generate briefs |

**[FACT]** BotBase, Cloudflare's searchable bot directory, is Enterprise Bot Management only, so it is not a route available here.

### 10.3 The probe gate — round 7, session A

The posture does not need to be asked about, because it can be measured, and the live WordPress site sits behind the same zone. **This runs today, against yallo.co, before cutover.**

`scripts/check-crawler-access.mjs`:

1. Request a known-good path on the production host once per documented user-agent, recording status code, response size and any challenge page. The set: `Googlebot`, `Bingbot`, `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `DuckAssistBot`, `Amazonbot`, `MistralAI-User`, `meta-externalagent`, plus one control string that identifies the probe honestly.
2. Fail on any non-200 for `Googlebot`, `Bingbot`, or any Search or Agent family member.
3. Fail on a 200 that returns a challenge or interstitial rather than the page. A 200 carrying a Cloudflare challenge is the failure mode a status-code check misses, so assert on a known string from the page body, not on the code alone.
4. Report the full matrix regardless of pass or fail, so the posture is recorded as a dated artefact rather than a memory.
5. Run against the placeholder host too. **[⚠]** The DigitalOcean preview may not sit behind Cloudflare at all, in which case `robots.ts` is the only control on it and §1's environment-driven policy is the whole defence.

**Cadence.** Once now, once before cutover, once immediately after, then in CI against production. A zone setting changed by anyone at any time is exactly the class of defect a gate exists to catch, and it is invisible to every other gate on the project.

**Standing rule applies.** The gate is not trusted until it has been watched to fail — point it at a path that is genuinely blocked, or temporarily block one user-agent, and confirm it names it.

### 10.4 Sequencing

The check runs before 15 September regardless of the go-live date, because the multi-purpose rule bites existing zones on that date and go-live is not yet set. If the toggle is found on, turning it off is a one-click fix with no build dependency, which is the best possible outcome for a risk of this size.

---

## 11. Domain architecture

### 11.1 yallo.co is already ratified as the destination

Game plan R15 records it: talent.yallo.co is a temporary placeholder, yallo.co is the destination, and §7's redirect map already targets yallo.co paths. Nothing needs changing and there was no competing assumption in play — the placeholder appears in this project's documents only as the thing defect B6 exists to keep out of the index.

**The instinct about inheritance is right, and it is the reason B6 matters.** A subdomain is a distinct host. It does not inherit the root domain's accumulated authority wholesale, so indexing the placeholder would not bank three or four years of yallo.co equity; it would start a second, weaker property and then force a domain migration to undo it.

### 11.2 Yallo AI Academy — recommendation

**[REC] `yallo.co/academy` for the marketing surface, with the LMS application on its own subdomain (`learn.yallo.co`).**

The split follows what each layer needs. The marketing surface is where domain authority compounds and where internal links from the Talent site do work, so it belongs on the root. The application — login, enrolment, progress — has no retrieval value, has a different performance profile, and should never sit on the critical path of the marketing domain's deploys.

**Precedent already exists on this estate.** Volcanic serves yallo.co/jobs today, so path-based routing to a separately owned platform under the root domain is how this domain already works. The Academy is the same pattern with a different vendor.

**Against `yalloacademy.ai`.** It takes the worst of both options. A new domain starts at zero authority and needs its own link acquisition, and because the brand is already called Yallo AI Academy, a separate domain buys no brand independence in exchange. saasinator earned its own domain because it carries a genuinely distinct name and a distinct proposition; Academy does not. For a boutique with finite content velocity, splitting link equity three ways rather than two is a multi-year cost with no offsetting gain. **[REC]** register it defensively, park it, `noindex` it, do not build on it.

**[ASSUMPTION], and this is the pivot.** Practitioner consensus is that subfolders consolidate authority more effectively than subdomains; Google's stated position is that it treats them similarly. The recommendation above assumes a curated Academy catalogue in the low tens of pages. **Pivot to `academy.yallo.co` if either holds:** the catalogue will run to a hundred or more course and module pages, in which case game plan D12's scaled-content-abuse exposure lands on the crown-jewel domain; or GTM.03's deploy cadence cannot be decoupled from the Talent site's. Both are questions for GTM.03, not for this project, and the decision is cheap to defer until the catalogue size is known — but not cheap to reverse afterwards.

**This needs an R1 amendment.** R1 reads one vertical, one site, and yallo.co as a Yallo Talent property full stop. A bounded `/academy` section makes yallo.co carry two verticals. R1's purpose was positioning purity — stripping the consulting and TS/EA propositions out of a Talent site — and a clearly separated section with its own IA is not that failure. But it is a change to a ratified decision and it should be recorded as one rather than absorbed quietly.

### 11.3 One hard rule for the long term

**[REC] yallo.co is never 301'd to yallogroup.com.** When the umbrella site stands up, it links outward to the verticals and is never a canonical destination for anything that already ranks. Redirecting the domain that carries the equity into a new domain that carries none is the single most expensive mistake available in this architecture, and it becomes tempting precisely at the moment the group narrative starts to matter. Recording it now, while nobody wants to do it.
