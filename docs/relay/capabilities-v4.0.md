# Code to Chat — session B, content, data and IA

**v4.0 · 2 August 2026 · branch `feat/round5-content`, cut from the merged `main` at `9bf2df7`**
Succeeds `docs/relay/capabilities-v3.0.md`. Answers `docs/design/context-round5-rulings.md`
§1, §2, §4 and §6.

Three commits, `71e8bae` to `435e570`. Every measurement was taken on a
**production build** (`NEXT_DIST_DIR=.next-b-prod`, `next start` on 3102, port
ownership confirmed with `lsof` before the build and the server restarted after
it). All eight named gates are green. `pnpm lint` fails on inherited errors and
fails **identically** on the merge base, measured rather than assumed — see §8.

**Two sectors hit the stop condition and were not swept.** Healthcare and telco
would drop to zero segments, not to two. They are reported in §3 and left
untouched.

---

## 1. The ground was clean again

§1 held for the second round running. `context-round5-rulings.md` was committed
by A in `9bf2df7`, present before I cut, and I checked ancestry rather than
assuming: `git rev-list --left-right --count main...HEAD` returned `0 0` at cut
time. Nothing was blocked and nothing was copied from a sibling worktree.

---

## 2. The inert sector labels — §4 item 1

**It is 76 across 14 files, not 60 across 13.** The extra sixteen are not drift.
Education became the seventh sector in round 4, so every rail grew a label and
`education.ts` joined the list. The handover count was taken before that landed.

**Three shapes hid under one number, and only the first was actually inert.**

| Count | Shape | Inert? |
|---|---|---|
| 49 | sector-rail `name:` in `place.ts` and the six capability rails | **Yes.** `deriveSectorList` / `deriveSectorRail` overwrite it from the index before paint |
| 20 | `related` cross-link `label:` | **No.** Renders. Derived by nothing |
| 7 | breadcrumb `label:` | **No.** Renders. Derived by nothing |

So "inert" was true of 49 and false of 27. Deleting the other 27 would have taken
the text off a link and out of a breadcrumb.

**By file, all 76 swept:**

```
 9  src/data/capabilities/cloud-infrastructure.ts      (7 rail + 2 related)
 9  src/data/capabilities/cybersecurity.ts             (7 rail + 2 related)
 9  src/data/capabilities/data-analytics.ts            (7 rail + 2 related)
 7  src/data/capabilities/devops-platform-engineering.ts   (7 rail)
 7  src/data/capabilities/integration-middleware.ts        (7 rail)
 7  src/data/capabilities/testing-quality-engineering.ts   (7 rail)
 7  src/data/home/place.ts                                 (7 rail)
 3  src/data/l1/education.ts       (1 breadcrumb + 2 related)
 3  src/data/l1/finance.ts         (1 breadcrumb + 2 related)
 3  src/data/l1/government.ts      (1 breadcrumb + 2 related)
 3  src/data/l1/healthcare.ts      (1 breadcrumb + 2 related)
 3  src/data/l1/manufacturing.ts   (1 breadcrumb + 2 related)
 3  src/data/l1/retail.ts          (1 breadcrumb + 2 related)
 3  src/data/l1/telco.ts           (1 breadcrumb + 2 related)
```

`check:taxonomy` reports no inert labels for the first time, so **A can promote
the rule to a failure.**

**All 76 now read `taxonomyLabels(slug).label`.** That helper already existed in
`src/data/l1/index.ts`, and its own doc comment already claimed nothing
duplicates these into the per-page data files. The claim is now true.

**Why the index and not `@/lib/sectors`.** `lib/sectors` imports `registry.ts`,
`registry.ts` imports the seven L1 data files, so an L1 data file reaching for
`lib/sectors` closes a cycle at module-init time — precisely where
`industriesIndex` would not yet be populated. `src/data/l1/index.ts` is a leaf
with no imports and is the module `lib/sectors` reads from itself, so this is one
step closer to the source rather than a second copy of it.

**Prose was not touched.** The rule matches a `label:`/`name:` position, so
`eyebrow: "Banking & Financial Services · Contract-first"` stays authored.

---

## 3. The segment sweep — §4 item 2 and §6, the substance of the run

### 3.1 The test needed sharpening before it could be applied evenly

"Customer-shaped" is not a question about whether the name is an organisation
noun. If it were, **Insurance Services** and **Retail Banking** would both fail,
and §6 keeps them. The workable form is:

> **Does the name partition the customer base, or the work?**
> Retail, corporate and investment banks and insurance carriers buy differently
> from one another. Risk & Compliance exists inside every one of them.
> **A segment present in every customer divides no customers from any others,
> so it is a function.**

Corroborating evidence, applied second: does the intro open by naming the
institutions that buy? That is what keeps Insurance Services ("Property and
casualty, life and health carriers") and what takes Citizen Services
("Digital-by-default channels, single-view of the citizen").

### 3.2 Per sector

| Sector | Before | Went | Remains | Verdict |
|---|---|---|---|---|
| Retail & Consumer | 13 | 0 | **13** | Clean, no change |
| Manufacturing & Logistics | 15 | 0 | **15** | Clean, no change |
| Banking & Financial Services | 9 | 5 | **5** (4 + Islamic Banking) | Swept |
| Government & Public Sector | 14 | 10 | **4** | Swept |
| Healthcare & Life Sciences | 14 | — | **14** | **STOPPED, would reach 0** |
| Telco & Media | 15 | — | **15** | **STOPPED, would reach 0** |
| Education & Universities | 6 | 0 | **6** | Clean, no change |

**Retail, manufacturing and education needed nothing, and I verified that
against their intros rather than their names.** Every retail segment describes a
kind of retailer, every manufacturing segment a kind of manufacturer or
logistics operator, every education segment an institution. The pattern is
worth naming: **the three sectors that needed no work are the ones built
customer-first; the four that failed were ported from the legacy corpus, where
the segment list was a copy of the function list.**

### 3.3 Finance, 9 to 4, then 5

**Gone:**

| Removed | Why |
|---|---|
| Risk & Compliance | Named by §6. Function-shaped |
| Regulatory Compliance & Governance | Named by §6. The other half of function 06 |
| Digital Payments | Not named by §6, taken by its principle. "Payment hubs, the message layer around them and the regional instant-payment schemes" is systems, not a buyer |
| Treasury & Cash Management | Every institution on the list runs a treasury |
| Lending & Loan Management | Retail and corporate banks both lend. Cuts across |

The last three were kept in round 4 **only** by the mapping test §6 withdraws.
Round 4's relay predicted finance would keep four on the strict principle, and
it keeps exactly four.

**Remains:** Retail Banking, Corporate Banking, Islamic Banking, Insurance
Services, Investment Banking. Five institution types, above the floor.

### 3.4 Government, 14 to 4

**Gone (10):** Citizen Services, Smart City Solutions, Disaster & Emergency
Management, Cybersecurity for Public Services, Data & AI for Public Services,
Regulatory Compliance & Governance, IT Infrastructure & Operations, Procurement
& Vendor Management, Accounting & Financial Operations, Human Capital
Management. Every public body runs all ten.

**Remains (4):** Public Safety & Security, Urban Planning & Infrastructure,
Healthcare Administration, Education Administration.

**Three of the four are borderline and I want your eye on them.** They are named
for a domain, not an institution, and I kept them on the same reading that keeps
Insurance Services: each intro opens by naming the institutions that buy — local
authorities; NHS trusts and ICBs; higher education, further education and school
authorities. Where an intro named no institution, the segment went. **Reverse
any of the three and government drops to 3, 2 or 1.**

**The last five of the ten are the same five removed from finance in round 4,
under the same names, and they are still live on healthcare and telco.** One
function list was copied onto four sector pages.

### 3.5 Healthcare and telco — the stop condition

Both would reach **zero**, not two, so I stopped and did not backfill. Nothing
was removed from either file.

**Telco: 15 of 15 are work-shaped.** Network Operations, Rating & Billing, OSS
Inventory Management, Service Activation, Customer Relationship Management,
Content Management & Distribution, Advertising Operations, Subscriber & Billing
Management, 5G Network Management, AI & Analytics for Telco & Media, plus the
five shared operations functions. Not one names a kind of buyer.

**Healthcare: 14 of 14.** Patient Management, Electronic Health Records, Clinical
Trials Management, Pharmaceutical Supply Chain, Regulatory Compliance in Life
Sciences, Telemedicine & Virtual Care, Healthcare Analytics & AI, Cybersecurity
for Healthcare, Precision Medicine, plus the same five. The closest to a keep is
Clinical Trials Management, whose intro opens "Sponsor, CRO and site systems" —
but those institutions are named as owners of the systems, and the segment is
still the management of trials.

**The material for the replacement already exists on each page, one line above
the list that ignores it.** Both `segmentsSub` lines state the customer
partition the segments should have had:

- healthcare: *"Providers run different programmes from CROs or biotech."*
- telco: *"A tier-1 MNO runs different programmes from a broadcaster or a
  hyperscaler-connect carrier."*

That is a customer partition in the page's own voice. **Turning it into segments
is authoring and is not mine this round**, so it is yours. It needs intros and
role pills per segment; the pills can be lifted verbatim from each page's own
published functions, as Islamic Banking's were.

### 3.6 Islamic Banking — §4 item 3

Added third, with the banks rather than after the insurers. **All five pills are
published verbatim on function 02** and no variant of a real title was minted:

```
Islamic Banking Functional Consultant
Sharia-compliant Product Configuration Specialist
Islamic Treasury Consultant
Islamic Banking Business Analyst
Islamic Finance Product Owner
```

The intro says only what function 02's own overview already says, and names only
Temenos, FLEXCUBE and Finacle, which that function already publishes.

---

## 4. The two insight teasers — §4 item 4

Both deleted, neither rewritten. The Actimize one carried the unsourced market
claim; **the PSD3 one also offered to say "what they cost"**, which canon §7 bans
outright and which the round-4 relay had not spotted.

**Worth knowing before A ships decision 1: not one insight is published anywhere
on the site.** All 30 entries across seven files are `published: false`. Under
decision 1 **every insight row on every page disappears**, not just the finance
one. That is the correct outcome, and it is larger than the ruling's wording
implies.

---

## 5. Informatica — §4 item 5

Flipped to `published: true`. **`/platforms/informatica` was measured at 200 on
my own production build before the flag moved**, rather than taken from A's
relay that reported it.

`mark` stays `null`, and the old comment's claim about artwork still holds: there
is no Informatica **platform** mark. The `informatica.png` under
`public/logos/clients` is the **client** mark, a different thing, shipping at
`consentOnFile: false` per canon §3.

---

## 6. Eight unsourced figures, found and swept as a class

Not in the ruling. Found while reading the government page for the segment
sweep, then swept everywhere rather than where it was seen.

**Four sector pages each carried two stat cards with no `source` field:**

| Page | Figures removed |
|---|---|
| government | `64%`, `4–7 wks` |
| healthcare | `69%`, `6–8 wks` |
| manufacturing | `63%`, `5–7 wks` |
| telco | `66%`, `6–9 wks` |

One sentence template with the number changed per page, which is what a
generated figure looks like. Canon §6 requires a source on any published figure,
and `L1IntroStatCard.source` exists for exactly this — its own doc comment says
*a card without one is a visible omission rather than an invisible one*. These
eight were that omission and nothing had looked at them.

**R18 deleted a figure of this shape on 1 August and the sweep stopped at the
page it was reported on.** Retail, finance and education have carried a single
card since; four sectors kept theirs. Same defect, four pages, nine days.

**The five 72% cards stay.** Every capability page carrying one names
*ManpowerGroup Talent Shortage Survey, 2026* in a `source` field, so they satisfy
the rule. The test is the source, not the figure — grepping for a percent sign
would have taken five correct cards with the eight wrong ones.

Deleting an unsourced figure is sweeping, and it is not recoverable as an
authoring job because no source was ever recorded to restore. The surviving card
on each page is the one retail, finance and education already carry, word for
word, so nothing was written.

---

## 7. The Education screening lines — §4 item 6

**There are seven, not eight.** Function 05 is the cross-link card: no `tools`,
`href` straight to `/platforms/oracle`, and no `screening` line, because a card
that restates nothing makes no screening claim. The ruling's count assumed one
per function.

Verbatim, for your review:

**[01] Student Information Systems**
> Screened on modules configured and go-lives taken through a registration window, not on product familiarity. An SIS consultant who has never sat through enrolment has not met the constraint this function is defined by.

**[02] Learning Management & Digital Learning**
> Screened on platform migrations completed and on work alongside academic staff, because a learning platform is adopted by teaching faculty or it is not adopted at all.

**[03] Admissions, Recruitment & Student CRM**
> Screened on integration into the student record rather than on CRM configuration alone. An admissions build that does not reach the SIS moves work to the registry rather than removing it.

**[04] Research Administration & Grants**
> Screened on the grant lifecycle end to end, from award through to reporting, because the systems are usually briefed as one and staffed as three.

**[05] Institutional Finance, HR & Procurement**
> *(no screening line — cross-link card)*

**[06] Campus IT, Identity & Endpoint**
> Screened on joiner and leaver volume at cohort scale rather than at corporate scale, and on the first week of term as the load test that matters.

**[07] Data, Reporting & Accreditation**
> Screened on reporting assembled across the student record, the ledger and the learning platform together, because a reporting analyst who has only ever queried one of the three has not done this job.

**[08] Programme Delivery, Migration & Cutover**
> Screened on reconciliation and parallel run rather than on extract and load, because student-records migration is judged on the records that did not change.

Each claims only what is screened for. None claims an outcome, a rate or a
volume, and none names a person or a client.

---

## 8. Gates

**All eight green**, on a production build on `.next-b-prod` at
`http://localhost:3102`, server restarted after the final build.

| Gate | Result |
|---|---|
| `pnpm typecheck` | clean |
| `check:terms` | no banned terminology in 220 files |
| `check:taxonomy` | clean across 183 files, **0 inert labels** |
| `check:type` | nothing below 13px, mono tracking at or above 0.12em |
| `check-gate-coverage` | every rendering unit with a live URL is visited |
| `check-rendered-type` | clean, 13 templates x 4 widths, 348 pairs |
| `check-yallo-case` | correct on every element across 17 pages |
| `check:a11y` | axe clean, 6 routes x 2 themes x 2 widths, 2262 abstentions composed |

**Route status codes observed, not expected:** `/`, all seven
`/industries/{sector}`, and `/platforms/informatica` all **200**.

**`pnpm lint` parity, and the reported number is wrong for a reason worth
fixing.** On source only (`npx eslint src scripts`) it is **37 errors, 15
warnings**, and it is **identical on the merge base `9bf2df7` with my commits
off** — measured by checking out the merge base and re-running, not assumed.

But `pnpm lint` reports **1308 errors**, and 416 of the files it reads are build
output: `.next-b-prod` (248) and `.next-b` (168). **The eslint config ignores
`.next` but not a custom `NEXT_DIST_DIR`.** This is the same class as the
`tsconfig.json` hazard already in AGENTS.md: session-local dist dirs leak into
tooling that only knows the default name. **Decision 8's "624 errors" is
measuring session dist dirs, not the codebase** — A should re-baseline before
spending any of the triage on it.

---

## 9. For session A — found in your files, left alone

1. **`src/lib/sectors.ts` blocks the cleaner end state for the 49 rail labels.**
   The truly minimal data shape omits `name` entirely, since the derivation
   supplies it. I measured what that costs rather than reasoning about it:
   making `L1Segment.name` optional fails with
   `TS2345 ... 'L1Segment' is not assignable to '{ id: string; name: string; }'`
   at **`L1PageShell.tsx:785`**, because `deriveSectorRail<T extends { id: string;
   name: string }>` requires the property. One generic-constraint relaxation in
   your file and the field can be deleted outright. Reverted and left.

2. **The pre-commit hook edits files outside the committing session's
   ownership.** It runs `biome check --write` across all 194 files, not the
   staged set, and it reformatted **`src/components/blocks/l1/L1PageShell.tsx`**
   during my first commit (an operator-precedence line rewrap). I reverted it on
   each of three commits. Nothing of yours is in my branch, but a session that
   stages with `git add -A` would carry your file into its commit.

3. **`nav-config.ts` checked, nothing to report.** The brief asked me to report a
   wrong label rather than fix one. The Platforms column matches `platformsIndex`
   exactly — SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday,
   Informatica, in canon's order. It is still hand-written, as round 4 said, and
   your §5 derivation closes that.

4. **Decision 1 is bigger than it reads.** No insight is published anywhere (§4
   above), so the component rule removes the row from **every** page, not only
   finance.

---

## 10. Back to you — authoring decisions I did not take

1. **Healthcare and telco segments.** §3.5. The customer partition is already
   written in each page's `segmentsSub`. This is the substantial one.

2. **Two segment headings now sit over shorter lists.** Finance reads *"Every
   financial-services segment"* over five, government *"Every public-sector
   segment"* over four. Finance is arguably more defensible than before, because
   five institution types partition something and nine mixed items partitioned
   nothing. **Government is the weaker claim**: its own `segmentsSub` names
   central government, which has no segment. R16 territory, and rewriting a
   heading is authoring.

3. **`insightsSub` names an individual on seven surfaces**, against canon §8's
   ratified house byline and its explicit "No individual names": *"Written by
   Sumeet Goenka and the Yallo team."* in the six sector files and
   `capabilities/cloud-infrastructure.ts`. Currently inert, since no insight
   row renders, but it ships the moment one is published.

4. **One em dash in a segment name**, the only one in any: retail's
   `FMCG — Fast-Moving Consumer Goods`.

5. **Two manufacturing segments overlap**: `Consumer Packaged Goods (CPG)` and
   `FMCG Manufacturing`. Both are customer-shaped, so the sweep keeps both;
   whether they are one segment is a curation call.

6. **Government keeps an `Education Administration` segment** while Education is
   now a sector of its own. Defensible — a school authority is a public body —
   but the two now overlap and only you can say whether that is intended.
