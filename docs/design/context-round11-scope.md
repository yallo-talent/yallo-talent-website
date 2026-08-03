# Context — Round 11: close the build

**v1.0 · 3 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`.
Carries forward whole: `context-round9-scope.md` §6 (rubric), §7 (forbidden), §9 (Impeccable), §10 (close-out loop); `context-round10-scope.md` §11.5 (things confirmed good).

Round 11 is the last build round before cutover. Cutover itself — CDN, DNS, redirect deployment, WordPress teardown — is out of scope and sits with Raphy.

---

## 1. Adjudication of round 10

All three relays ruled. Nothing below is reopened.

### 1.1 Accepted, and the three worth naming

| Finding | Ruling |
|---|---|
| **B: six fabricated job listings on `/jobs`** — named roles, cities, "Immediate start", on a page with no ATS behind it | **Accepted, and the most valuable catch of the round.** A real candidate could have acted on those. Replacing them with the six real desks derived from `screen.ts` rather than a second hand-typed list was exactly right. |
| **B: five invented consultant personas on `/leadership`** with specific tenure and employer claims | **Accepted.** Removing them was correct and stays correct. The founder's name is a separate question, answered in §2. |
| **A: WCAG 2.5.3 Label in Name failure on the header brand link, every page, six rounds** | **Accepted.** Two causes, both needed, both verified, no visual change. The reason it survived matters more than the fix: `label-content-name-mismatch` is an axe **experimental** rule the repo's gate does not run, and it carries **zero weight** in the Lighthouse accessibility category, so `/brief` scored 100 while failing it. Neither existing gate could see it. See §4.4. |

### 1.2 Accepted without further comment

| Item | Ruling |
|---|---|
| A: retracted the mobile-drawer P0 after finding it was a hidden-preview-pane rAF artefact, and reverted the speculative fix before commit | **Accepted, and this is the discipline working.** The rule it produced — never conclude anything about a Framer Motion animation from JS sampling in a hidden pane — is now standing. |
| A: extended the `setState`-in-effect fix from the mega panel to the mobile drawer, finding the drawer survived browser-back with the page scroll-locked and the header `inert` | **Accepted.** Same defect class, materially worse instance, and browser-back is the one route change no click handler covers. |
| A: merged `feat/round9-pages` at `68a495a` rather than the named `4f49c23`, the delta being one docs-only commit | **Accepted.** |
| A: the pre-adjudicated `check-terminology.mjs` conflict auto-merged; A read the merged file and confirmed both halves survived rather than trusting git | **Accepted, and correct.** An auto-merge is not a verified merge. |
| A: fixed `ThemeToggle` in place after finding it is imported by nothing | **Accepted.** Disposition ruled in §3.6. |
| A: used `&apos;` so no rendered copy changed | **Accepted.** Copy was not A's this round. |
| B: edited `BriefForm.tsx`, `LegalPageShell.tsx` and `CvUploadForm`'s consumer inside A's nominal territory, after `grep`-confirming single-consumer status each time | **Accepted.** The ownership rule exists to prevent forking a component another session is replacing. Confirming single-consumer first is the rule's purpose, satisfied. Do the same again where it applies. |
| B: `/brief` light-theme contrast at 1.07:1 on the h2, root-caused to a hand-set dark background that did not compose `band-dark` and so never restated the Layer 2c aliases | **Accepted.** Same bug class already documented on `EditorialLayout`. It survived because nothing had ever run `check:a11y` against `/brief` specifically. |
| B: `/brief` silent validation — no `aria-invalid`, `aria-describedby`, `role="alert"`, live region or focus movement | **Accepted.** |
| B: `/intelligence` "Nine AI role families" against ten in the data, fixed by removing the count rather than updating it, per the rule `/ai-talent` already documents | **Accepted, and this is fix-the-class applied properly.** |
| B: `/terms` claimed licensed Unsplash photography, contradicting `/cookies` and canon | **Accepted.** |
| B: legal pages' footer routed every privacy question to the commercial brief form | **Accepted.** Reusing the already-published `privacy@yallo.co` rather than inventing a channel was right. |
| C: `X-Robots-Tag` via `middleware.ts` rather than per-page metadata | **Accepted, and better than the brief asked for.** The real gap was that the homepage has no metadata export at all and inherits a root layout with no `robots` field, so the highest-traffic page defaulted indexable. Middleware covers every page regardless of opt-in. |
| C: `check:crawlers` on a daily schedule plus `workflow_dispatch` rather than as a PR gate | **Accepted, and the reasoning is right.** Gating merges on a live external host pre-cutover would fail PRs for reasons unrelated to the diff. The 24-hour detection window is the correct trade. Revisit after cutover. |
| C: proved each of the six PR gates can fail with the exact CI invocation, then reverted | **Accepted.** This is what "watched it fail" means. |
| C: refused to fabricate an `Organization.sameAs` URL | **Accepted, and correct.** Still open, §4.3. |
| C: `llms.txt` labels humanised mechanically from each path's last segment, accepting odd acronyms ("Sap", "Eor") as the price of zero invented copy | **Accepted.** The odd casing is a smaller cost than a hand-typed label set that drifts. |
| C: extracted `publishedPaths()` and verified `sitemap.ts` output byte-identical before removing the inline version | **Accepted.** |
| B and C: no-JS fallback on `/brief` confirmed absent and logged rather than built | **Accepted.** Ruled in §3.7. |

### 1.3 Reversed or amended

| Item | Ruling |
|---|---|
| The `/leadership` "no names" instruction | **My error, amended in §2.** The ruling was about not inventing consultants. It did not carve out the founder, B read it as blanket and followed it faithfully. The fix is a new roster, not a criticism of B. |
| `.sectionAlt` composing `band-dark` | **B is right and this is fixed in round 11.** See §3.3. B measured that in dark theme the plain `.section`'s inherited background resolves to the identical `rgb(14, 15, 17)`, so five sections collapse into one undifferentiated surface with no rhythm. `globals.css` documents `band-dark` as reserved for the footer, closing CTA and hero plates. This is `.sectionAlt` reaching for the wrong token. |
| `CvUploadForm` left without accessible validation | **Amended: fix it this round.** §3.5. `/jobs` is candidate-facing, the pattern is now established on `BriefForm`, and shipping an accessible form beside an inaccessible one is worse than having neither fixed. |
| The Phase 8 runner left in a scratchpad | **Amended: commit it.** §3.2. A's own recommendation, and it is right — an unreproducible number gets re-derived by hand every round. |

---

## 2. The leadership roster — ratified 3 August, and the constraints on it

**Sumeet's ruling: the leadership team is named on the site, with short bios, for credibility.** The four below are ratified for public naming, with these roles and these LinkedIn URLs. More will follow later.

| Name, as Sumeet wrote it | Role | LinkedIn |
|---|---|---|
| Sumeet Goenka | Founder & CEO | *(not supplied this round)* |
| Chandrashekar Kolar | Head of Managed Delivery | `https://www.linkedin.com/in/chandrasekharkolar/` |
| Niharika Patir | Head of Talent Operations | `https://www.linkedin.com/in/patirniharika/` |
| Raphy Varghese | Head of Marketing & Growth | `https://www.linkedin.com/in/vargheseraphy/` |
| Kritika Poddar | Head of Finance & PMO | `https://www.linkedin.com/in/kritikapo/` |

### 2.1 Bios are NOT supplied, and must not be written

This is the hard constraint on this section and it outranks the instruction to add bios.

Sumeet asked for short bios. **He did not supply any.** A fabricated career claim about a real, named colleague who will read the page is the most damaging invention available on this site — worse than an invented statistic, because it is a claim about a person's professional history that they did not make and may not endorse.

**Ruling:**

- **The four named colleagues ship with name, role and a LinkedIn link. No bio, no tenure figure, no named past employer, no capability claim, no "20+ years of", nothing.** The role line is the only descriptive text.
- **Sumeet's own entry may carry a short bio, assembled only from facts already asserted elsewhere on this site** — the Richemont / Landmark Group / Alshaya EMEA history, which `/why-yallo`'s credentials section, `/leadership`'s own hero copy and the homepage already state consistently. Nothing new. If a sentence cannot be traced to existing site copy, it does not go in.
- **Four bio slots come back as open items**, each one edit to fill.

A page that names five real people with their real roles and links to their real profiles is credible. A page that invents what they have done is a liability.

### 2.2 No photographs this round, and why it is a bigger question than it looks

Sumeet offered monochrome images. Two reasons this waits:

1. **No files have been supplied, and Code must not fetch images from LinkedIn.** That is scraping, and the rights position is not ours.
2. **Canon bans photography sitewide** — PetalPlate, generated deterministically from the slug, is the only imagery system, and it is CI-enforced. Team portraits are therefore a **canon amendment**, not an asset drop. It is a defensible amendment: the Phase 1 benchmark found named consultants with faces to be the category's widest open flank, cleared only by Forsyth Barnes. But it needs Sumeet's ratification, a carve-out in the imagery gate scoped to `public/team/**` only, and a rule that the carve-out never widens.

**Ruling: ship without photographs. No silhouettes, no initials monograms, no PetalPlate-as-portrait treatment** — the last of these is what round 10 correctly removed and it must not return under a different name. A name, a role and a link, set as type.

### 2.3 Two facts to flag, not reconcile

- **The name spelling.** Sumeet wrote "Chandrashekar Kolar"; the LinkedIn slug reads "chandrasekharkolar". Two transliterations of the same name. **Use Sumeet's spelling for display and the URL exactly as given for the link. Do not reconcile them, do not "correct" either one, and do not derive the display name from the slug.** Flag it as a verification item.
- **Niharika Patir's title.** Recorded elsewhere in this project as Head of Talent Acquisition. Sumeet's 3 August ruling says **Head of Talent Operations**, which supersedes.

### 2.4 Positioning constraint

These are Yallo Group leaders and yallo.co is ratified as a Yallo Talent property with all group content stripped (R1). **Present them as Yallo Talent's leadership. Do not introduce group structure, a group org chart, or any framing that reintroduces the Yallo Group shell the relaunch exists to remove.**

### 2.5 `Person` schema

Now permissible in principle — the people are real and ratified. **Deferred to a follow-up round anyway.** It depends on the team index landing first, it is cheap to add later, and adding structured data about real named people at speed on the last build day is the wrong trade. Logged, not scoped.

### 2.6 Restore the founder on `/about`

Round 10 removed Sumeet's name from the founding timeline for consistency with the `/leadership` ruling. **Restore it.** The line was "Sumeet Goenka and a small team of enterprise operators start Yallo Talent."

---

## 3. Session A — integrate, then close the performance gate

Territory: the merge, `src/components/**`, `src/styles/**`, `globals.css`, `nav-config.ts`, `scripts/**`, `.github/workflows/**`, `package.json`. **A does not touch `src/app/**` or `src/data/**`** — with one exception, named in §3.1.

### 3.1 The merge, and the one exception

Three branches, all off `fd459bc`, none merged:

| Branch | HEAD | Contents |
|---|---|---|
| `feat/round10-chrome` | `0919155` | Route-scoped nav state, Escape focus, brand-link Label in Name, entities, rebate removal |
| `feat/round10-pages` | `0e27a6c` | Nine page-groups closed |
| `feat/round10-seo` | `54506e0` | Crawler policy, six CI gates, no-redirect gate, OG images, `llms.txt` |

**Merge order: `feat/round10-chrome`, then `feat/round10-pages`, then `feat/round10-seo`.** Chrome first because it changed shared components every page consumes, so later merges resolve against the settled component layer. Pages second because it touched three of chrome's files. SEO last because it is almost entirely new files and can absorb whatever landed.

**The overlaps to expect, pre-adjudicated:**

- **`BriefForm.tsx` / `.module.css`, `LegalPageShell.tsx`** — B edited these after confirming single-consumer; A reports it did not fork or restructure any shared component signature. A textual conflict is unlikely. **If one presents, B's version wins on the form and shell internals, A's wins on anything touching the brand lockup or nav.**
- **`ServicePageShell.tsx` and `L1HubShell.tsx`** — A changed only an escaped apostrophe. Keep both sides.
- **`scripts/check-terminology.mjs`** — already a union of two branches. If a third change lands, **all halves are load-bearing**. Run `check:terms` tree-wide after and confirm 0.
- **`sitemap.ts`** — C refactored the internals to extract `publishedPaths()`. B added no routes. Keep C's version.

**After all three merges, run the full gate suite plus `pnpm build` before doing anything else.** Report the state. A green three-way merge is the precondition for everything in §3.2.

**The one exception to A's territory:** the §2.6 `/about` restoration and the whole of the team roster are B's. A does not touch them.

### 3.2 The Phase 8 gate — the round's centre of gravity

**Sumeet's ruling, 3 August: "given perf is critical, I won't want you to put time pressure on you for delivery, so do what is right here."** Full authority, one limit, stated below.

Round 10 established the baseline honestly. Perf 79–88 against a 90 floor and LCP 3.87–5.52s against a 2.5s ceiling, on eight of eight routes. CLS 0.000 everywhere. INP 56–128ms lab equivalent. The binding cause is measured and is not a page defect: **the LCP element is a text node on all eight routes**, so LCP waits on font and CSS delivery, and 188 KiB of preloaded font across three families sits in front of it. Also present: 123 KiB unused JavaScript, 33.6 KiB render-blocking CSS attributed 307–457ms, 13 KiB unused CSS, 13 KiB legacy JS. Ruled out by measurement, so do not re-investigate: CLS, server response time (10ms), image formats, `font-display` (already `swap`), third-party requests (zero).

**Work it in this order, re-measuring after each step so each change's effect is attributable:**

1. **`preload: false` on IBM Plex Mono.** It is used for small data labels only, never for an LCP element. Highest ratio of gain to risk on the site.
2. **Audit every loaded weight and style against actual usage** across all three families, and drop what nothing renders. Mechanical, no design decision.
3. **Confirm Latin subsetting** is in effect and no unused subset is being fetched.
4. **The unused JavaScript.** 123 KiB of 353 KiB. Establish what is actually shipping it before touching it.
5. **The render-blocking CSS**, if anything remains after 1 to 4.

**Re-measure the full eight-route set, two passes, and report the numbers exactly as round 10 did.** The table is the deliverable, not a verdict.

**The limit on the authority.** If the gate still misses after all five steps, **stop and report with a named recommendation. Do not drop a type family.** Newsreader, Inter and IBM Plex Mono are ratified in canon and `DESIGN.md`; removing one is a canon amendment and a design decision, and it must not arrive as a side effect of a performance run. Say what it would buy, in measured milliseconds, and let Sumeet rule.

**Commit the runner** as `scripts/check-phase8.mjs` with a `check:phase8` script, per A's own round 10 recommendation. Lighthouse becomes a devDependency — A owns `package.json` this round, so this is in territory. Wire it into CI as a scheduled job, not a PR gate: it is slow and its numbers drift with content, so gating merges on it would block work for reasons unrelated to a diff. Same reasoning C applied to `check:crawlers`, and it was right.

### 3.3 `.sectionAlt` — the dark-theme collapse

B measured it and B is right. `.sectionAlt` in `src/components/blocks/editorial/EditorialLayout.module.css` composes `band-dark`, a permanently dark surface identical in both themes. In light theme the alternation works. In dark theme the plain `.section`'s inherited background resolves to the identical `rgb(14, 15, 17)`, so every mid-page section collapses into one undifferentiated dark surface with no rhythm at all.

`globals.css` documents `band-dark` as reserved for the footer, the closing CTA and the L1/L2/service hero plates. This is the wrong token for a mid-page alternation.

**Fix: `.sectionAlt`'s mid-page use composes `band-invert`. `band-dark` stays on `.hero` and `.bottomCta` only.** This shell is consumed by `/why-yallo`, `/about`, `/leadership`, `/jobs` and `/insights`, so verify all five in both themes at 360 and 1280, and confirm the Two Band Rule in `DESIGN.md` is not breached on any of them — at most two inverted bands per page.

### 3.4 The axe experimental-rules gate

A's strongest recommendation and it earns its place. A WCAG 2.5.3 Level A failure sat on every page of the site for six rounds because `check:a11y` does not run axe experimental rules and the Lighthouse accessibility category gives that audit zero weight. Two green gates, one Level A failure, no contradiction visible anywhere.

**Add an experimental-rules pass.** Either a flag on the existing gate or a second script, whichever fits the existing shape. Then do what round 10's gate work did: **reintroduce the brand-link defect, watch the new gate fail on it, revert.** A gate nobody has watched fail on its own motivating case is not a gate.

Expect it to surface pre-existing findings elsewhere. Fix what is cheap and in territory; log the rest with severity rather than fixing everything at speed on the last build day.

### 3.5 `CvUploadForm` — the same fix as `BriefForm`

Round 10 logged this rather than fixing it, and the reasoning was sound at the time. It is now inconsistent: `/brief` announces its errors properly and `/jobs` does not, and `/jobs` is the candidate-facing one.

Bring `CvUploadForm` to the pattern `BriefForm` now establishes: `aria-invalid` and `aria-describedby` per field wired to a `role="alert"` error with a stable id, a `role="status" aria-live="polite"` status line, client-side validation before the fetch, and focus movement to the first invalid field on failure. Server-side validation is already solid — file type and size checks, zod, HTML-escaped body — so this is the client half only.

The component is A's; its consumer page is B's. **Confirm single-consumer before editing, as B did, and if the page needs a change, log it for B rather than making it.**

### 3.6 `ThemeToggle` — leave it dormant

It exists, it is now correct, and it is imported by nothing. **Do not mount it and do not delete it.** Canon sets light as the default register, `prefers-color-scheme` already reaches the dark theme, and mounting a user-facing theme switch is a product decision Sumeet has not made. Deleting a working component to tidy up is the more expensive mistake of the two. Add a one-line comment recording that it is deliberately unmounted, so the next session does not re-raise it.

### 3.7 Two register questions, ruled so they stop recurring

- **Legal pages stay permanently dark.** `LegalPageShell`'s `.body` composing `band-dark` is correctly implemented and passes contrast and axe. B flagged that it disagrees with `/case-studies/[slug]`'s light register for the same "Read mode" class. They are different classes in practice: legal pages are reference material nobody reads for pleasure, case studies are evidence in a sales path. **Record the decision in a comment in the CSS** so it is not raised a fourth time. No code change.
- **`/brief` gets no no-JS fallback this round.** Confirmed absent, correctly logged. Closing it properly means a classic POST with a server-rendered response or a Server Action, on the site's only conversion surface, and the buyer is a CHRO or programme director on a corporate laptop. **Logged as a candidate for a post-cutover round, not built.**

---

## 4. Session B — the people, and the homepage's metadata

Territory: `src/app/**`, `src/data/**`, `content/**`. **B does not touch `src/components/**`, `src/styles/**`, `globals.css`, `nav-config.ts`, `scripts/**`, `.github/workflows/**` or `package.json`** — all A's this round, and A is actively changing the component layer. Confirm single-consumer before any exception, and log rather than fork.

### 4.1 The leadership roster

§2 in full, and §2.1 is the constraint that binds hardest: **no bios for the four, a traceable bio for Sumeet only, no photographs, no monograms, no PetalPlate portraits.**

Author the roster as **one index** — `src/data/team/index.ts` or the nearest existing convention — and have `/leadership` map over it. Do not hand-type the five entries into the page component. This repo has hit the hand-copied-list class six times, and a team roster is exactly the shape that grows and drifts.

Each entry: display name, role, LinkedIn URL, and an optional `bio` field that is absent rather than empty for the four. An absent bio renders nothing, never a stub, never a dash, never "bio to follow".

Confirm each LinkedIn URL resolves before shipping it. A dead link on a named colleague's entry is worse than no link.

### 4.2 Restore the founder on `/about`

§2.6. One line, back as it was.

### 4.3 The homepage metadata export — the highest-value item after the roster

C found and could not fix this: **`src/app/page.tsx` has no `metadata` export at all** and inherits only the root layout's static metadata, which carries neither a `robots` field nor an `openGraph` field. Consequences, both real today:

- The homepage is the only page on the site with **no OG card**. C's per-route generator at `/og/[[...slug]]` produces one for every other published route. The highest-traffic page previews as nothing.
- Structurally, any future per-page metadata on `/` has nowhere to live.

C closed the robots half globally with middleware, so this is the OG half plus the structural fix. **Add a `buildMetadata()` call to `src/app/page.tsx`, matching the pattern every other page in the codebase already uses.** Then confirm `og:image` and `twitter:image` both resolve to a real 1200×630 PNG on `/`.

### 4.4 Re-measure `/` if you touch the hero

A's note, and it matters: **`/` is the site's worst-performing route** — Perf 79/83, LCP 5.52s/4.73s — and its LCP element is `p.Home-module__heroLede`. The LCP element on every service and L1/L2 page is likewise the hero lede or hero sub, **text, not an image**.

So: adding an image above the fold will not hurt LCP much. **Adding words to a hero lede will.** If you change any hero copy, say so in the relay so A can attribute the movement rather than hunt for it.

### 4.5 `Organization.sameAs` is still blocked, and here is the exact gap

C refused to fabricate it, correctly. The URLs Sumeet supplied in §2 are **personal** profiles, not the company page. `Organization.sameAs` needs the **Yallo Talent company LinkedIn page URL**, and no session may guess it from a personal slug or a company-name pattern.

**Log it. Do not build it. Do not use a personal URL as a stand-in.** §5 item 1.

### 4.6 Everything else on the nine pages is closed

Round 10 closed all nine page-groups. Do not reopen them for refinement. If the §4.1–4.3 work surfaces a defect on a closed page, fix that defect and say so; do not re-run the close-out loop across the site.

---

## 5. Open items for Sumeet after round 11

Expected back, each one edit or one decision:

1. **The Yallo Talent company LinkedIn page URL**, for `Organization.sameAs`. §4.5.
2. **Four short bios** — Chandrashekar Kolar, Niharika Patir, Raphy Varghese, Kritika Poddar. §2.1.
3. **Monochrome team portraits**, and with them the canon amendment permitting photography scoped to `public/team/**`. §2.2.
4. **The name spelling** — "Chandrashekar" versus the "chandrasekhar" LinkedIn slug. §2.3.
5. **Client logo consent**, written, per named client. Unchanged from round 10 §7 and still a cutover blocker.
6. **Metric definitions** — one auditable definition each, an "as at" date, a refresh owner. Still a cutover blocker.
7. **The Academy "Launching" marker** in the footer: stays, drops, or becomes a live link at cutover. Carried unanswered through two rounds.
8. **Whether to mount `ThemeToggle`.** Dormant by default per §3.6.
9. **The font budget**, if §3.2 stops short of the gate.
10. **A go-live date**, which needs Raphy's availability for the cutover list, not only Sumeet's.

---

## 6. Forbidden — carried forward, with two additions for this round

`context-round9-scope.md` §7 in full. Two additions, both specific to the roster work:

- **No bio, tenure figure, past employer, capability claim or characterisation for any of the four named colleagues.** Name, role, link. Sumeet's own bio only from sentences already live on this site.
- **No photograph, silhouette, avatar, initials monogram or PetalPlate-as-portrait on any team entry.** Round 10 removed the portrait-surrogate treatment; it does not return under another name.

And the one that matters most on the last build day: **no claim that a gate, score or check passed unless it was run and its real exit code observed.** A fabricated Phase 8 number would authorise a cutover.
