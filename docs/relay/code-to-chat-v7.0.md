# Code → Chat relay v7.0

**2 August 2026 · yallo-talent-website · `main` · HEAD `a719eba` · nine gates 9/9**

Filed at the path the goal named. I first put it in `docs/relays/` alongside
v1.0 to v6.0 and flagged the difference; the instruction was explicit, so this
is the canonical copy and `docs/relays/README.md` points here. **Relays v1.0 to
v6.0 remain in `docs/relays/`.** Worth settling which folder is canonical before
v8.0, because two folders one character apart is a trap for whoever reads this
next.

---

## 1. TL;DR

Seven of the nine work items shipped complete, one was already done and needed
verifying rather than building, and one is partially done and blocked on
content that cannot be invented. Twenty-seven new routes
went live: Informatica as the seventh platform with nine desks, the AI talent
family with nine role families and the stack matrix, and the Programme Staffing
Blueprint with three archetypes under a new `/intelligence` hub.

The more useful half of the night was what measuring found. **Seventy indexable
pages had never been in the sitemap.** The homepage shipped a **live 404**. The
"sectors running X" band rendered a one-item grid on all seven platform pages
and a heading over **zero** rows on Workday. None of those were in the brief and
all three were the classes the discipline told me to sweep for.

I also shipped an accessibility regression into the working tree and the gate
caught it before the push, which is the process working rather than a near miss
to gloss over. It is written up in §5.

---

## 2. What shipped

| # | Item | Outcome |
|---|---|---|
| 1 | **Logo G** | Shipped at the 0.12em floor per ruling 4. 360px header measures scrollWidth 360 with the farthest element at 356.8 |
| 2 | **Point 9, engagement two-column** | Shipped. The section was already a two-column grid; the *panel* split again, so it painted three |
| 3 | **Informatica** | L1 plus nine module L2s, canon §3 amended and dated, client rail at `consentOnFile: false`, mark built and keyed |
| 4 | **AI talent** | L1 rebuilt to the ratified band order, nine role-family L2s, 44-entry stack matrix as one source for both levels |
| 5 | **Blueprint** | Index plus three archetypes, and `/intelligence` now exists to link them from |
| 6 | **SAP L1 narrative** | Shipped. Four sections, SAP now paints eight against retail's eight, 1,291 words to 2,010 |
| 7 | **Signavio and LeanIX** | **Already shipped.** Both are live modules with real roles and no scarcity fields. Verified, not rebuilt |
| 8 | **Sectors running SAP** | Shipped as a class fix across all seven platforms, not just SAP |
| 9 | **L1/L2 impeccable pass** | Five surfaces audited, zero P1 on the measurable classes. One P1 found that Code cannot fix — see §4 |

**Route count: 27 new.** 10 Informatica, 10 AI talent, 4 Blueprint and
`/intelligence`, 2 hub pages. Sitemap 67 → 152 URLs.

---

## 3. The three defects measuring found, none of which were in the brief

**1 · Seventy indexable pages were missing from the sitemap.** Noticed because
Informatica listed one URL against ten live routes. It was not an Informatica
fault: every platform module L2 on every platform had been absent for as long as
the template has existed. The industry L2s were listed and the platform L2s were
not. Now read from `publishedModuleParams`, the same function the route's own
`generateStaticParams` uses, so the file cannot drift from the route set again.
All seventy verified 200.

**2 · The homepage shipped a live 404.** Found by crawling every internal link
on all 152 routes; `/industries/education` was the only dead one, and it was
linked from the homepage. Education is marked `published: false` in
`place.ts` **and** in `nav-config.ts`, and both of those honoured it, which is
exactly why the flag looked like it worked. The platforms column in
`WherePlace` has always checked it. The sectors column beside it never did.
**The data was right in both files.** Re-crawled after: 278 unique links, none
dead.

**3 · "Sectors running X" was a grid of one on all seven platforms, and a
heading over nothing on Workday.** The zero-row case is R16 outright: a plural
heading asserting rows that do not exist. The fix is *not* five sectors of
authored tool data, which is the D12 trap and would manufacture coverage on five
pages at once. The band is gated at three and returns by itself when the sector
files carry enough real tools. The subnav entry is gated on the same condition,
because gating only the section would have left a sticky link to `#sectors`
scrolling to nothing on all seven pages.

---

## 4. Item 9, and the one thing I did not do

**Item 9 reached zero P1 on everything measurable, and found one P1 it cannot
fix.** Five surfaces audited: `/industries/retail`, `/capabilities/data-analytics`,
`/industries/retail/merchandising`, `/industries/retail/point-of-sale`,
`/platforms/sap`. Clean on every named sweep class — sticky elements all have
real travel in their own parent (the smallest is 3,207px), no dead in-page
anchors, no skipped heading levels, exactly one H1 each, no empty or
dash-filled states, no tap target under 24px, no duplicated H2.

**The P1 it did find: two retail L2 pages are 79% identical in their prose
bands.** Measured properly rather than eyeballed, and measured three times
because the first two numbers were wrong in the interesting way. Whole page:
12% distinct, which is meaningless because it counts site chrome. `<main>` only:
16%, still meaningless because the sidebar carries all eight function names on
every page and that is navigation, not duplication. Prose and role bands with
the sidebar excluded: **39 lines, of which 8 are page-specific.** The screening
promise, the four engagement models and the ask are correctly identical; the
differentiating content per function page is the title, one overview paragraph
and the tool cards.

That is "boilerplate around a swapped noun", which the AI talent context names
as the thing to avoid, and **fixing it means authoring per-function content that
does not exist in the repo.** I am not permitted to invent it and did not.
**This is a Chat or Sumeet authoring job across the eight retail L2s**, and the
same template serves every other sector, so the decision is worth making once.

**The tenth AI role family.** "AI Data Engineer, retrieval and RAG pipelines" is
proposed and not ratified, so it is absent rather than waved through. It is a
real gap in the set — retrieval engineering is currently split across the LLM
engineer and agentic developer families. **Needs Sumeet's yes or no.**

**Twelve pre-existing duplicate CSS classes.** Surfaced by the new guard, not
fixed. Some are deliberate second blocks by the same component and some may be
live collisions; telling them apart needs a per-case look, and turning the build
red on twelve at 2am would have taught everyone to skip the gate. Listed on
every gate run. **Worth a short dedicated pass.**

---

## 5. The regression I shipped, and what it cost

The Blueprint's phase rail declared `.phaseName`. The homepage instrument has
owned `.phaseName` since it was built. A CSS module scopes by **file**, and
`Home.module.css` is ~3,000 lines shared by every home block — so the later rule
won on equal specificity from further down the cascade. The homepage pipeline
repainted to `--text` on `--dk-2`: **1.00:1, two serious axe violations on the
busiest page on the site**, and it silently killed the `.phaseActive` and
`.phaseDone` states that key off the same class.

Neither file was wrong on its own. That is what makes it worth a guard rather
than a fix, and `scripts/check-type-scale.mjs` now reports any class opened
twice at top level in one module.

**It cost nothing, because the gate ran before the push and not after.** That
is the same discipline that failed in v6.0 when the logo's opacity regression
went out. Recording it as a win for the process rather than burying it.

---

## 6. Decisions I took that you should review

| Decision | Reasoning | Reversible? |
|---|---|---|
| **Point 9 read as "the panel splits again"** | The section grid was already `360px 1fr`, so the item looked done and was reported NOT DONE for a round. Measured, the panel split at `0.95fr/1.05fr` and the band painted three columns: rail, decorative plate, content squeezed into 363px. I collapsed the panel to one column, content first, plate last and wide | Yes |
| **Blueprint tracking at 0.12em, not 0.125em** | Ruling 4 names 0.12em. I had shipped 0.125em reasoning that a floor value puts float noise in charge of the gate; measured, `--fs-label` is a fixed 13px and not a clamp, so the ratio is exactly 0.12 everywhere the gate looks | Yes |
| **The sectors band gated at three, site-wide** | Item 8 named SAP. The same band on the same template was failing identically on six other platforms, and R16 was being breached on Workday | Yes |
| **`/intelligence` built as a hub** | Three nav items pointed into a column with no page behind it. The Blueprint needed a parent and the goal said "linked from `/intelligence`" | Yes |
| **"AI Talent Atlas" relabelled in the nav** | Its description promised "scarcity and comp windows", two things R-AI3 forbids the page from ever publishing. A nav description is a claim like any other | Yes |
| **The four AI capability areas dropped from `/ai-talent`** | Not in the §2 band order, and superseded by nine role families with real pages. The content still exists in `src/data/pending/ai-talent-source.ts` | Yes |
| **Duplicate-class guard reports rather than fails** | Twelve pre-existing cases. A gate that is red on arrival gets ignored | Yes |

---

## 7. Open items, and what each needs

| Item | State | Needs |
|---|---|---|
| **Informatica client rail** | Entry live at `consentOnFile: false`, renders nowhere. Mark built and keyed at 912x224 | **One word from Sumeet.** Flip to `true` and it appears. Code does not flip it |
| **Retail L2 differentiation** | **Open P1.** Prose bands 79% identical between two L2s, 8 distinct lines of 39 | Authored per-function content across the eight retail L2s. Cannot be invented; needs Chat or Sumeet |
| **Tenth AI role family** | Proposed, not ratified | Sumeet's yes or no on "AI Data Engineer, retrieval and RAG pipelines" |
| **`placementHistory` flags** | `false` on all 44 stack entries | Sumeet flips per vendor where there is a placement he will stand behind |
| **Blueprint v2 quantities** | Held back, no field exists for them | Time-to-hire, scarcity, team size, rates. **LinkedIn Talent Insights licence check still outstanding** before any scarcity figure is published |
| **Twelve duplicate CSS classes** | Reported every gate run | A triage pass |
| **`emerging-technologies` 301** | **Confirmed landing.** `/capabilities/emerging-technologies` resolves to `/ai-talent` | Nothing. Note it is a **308**, which is Next's permanent-redirect status and SEO-equivalent to a 301 |

---

## 8. Risks

1. **`/ai-talent` lost a band.** The four capability areas ported from the
   retired data-ai page are no longer rendered anywhere. The §2 band order does
   not include them and nine role families is far more depth, but that is real
   content that is now dark. If you want it back it needs a band in the ratified
   order.

2. **Nine AI L2 pages share one shape.** They are genuinely differentiated on
   the screening tests and the mis-hire, which are the bands that matter, but
   the seniority and programme bands are structurally similar by design. Worth
   your eye on whether that reads as depth or as a template.

3. **A parallel session is writing to this repo.** Three context files appeared
   mid-session and a fourth, `docs/design/context-platform-parity-round.md`,
   appeared while I was working. I left it untracked. `git add -A` remains
   banned here for exactly this reason.

4. **The Blueprint archetypes make claims about programme failure modes** that
   are structural knowledge rather than sourced fact. They carry no figure, no
   client and no date, so nothing is unsourced in the canon §6 sense, but they
   are assertions about how programmes go wrong and they are published under
   Yallo's name.

---

## 9. Gate state

Nine gates green at `a610f18`, run against a rebuilt server on both ports with
CSS confirmed served before the results were trusted.

| Gate | Result |
|---|---|
| reflow | 20 routes x 2 themes at 320 and 360 |
| a11y | axe clean, 6 routes x 2 themes x 2 widths, 1,920 abstentions composed |
| contrast | 32 pairs, all AA |
| rendered type | 7 templates x 4 widths, 184 family/weight pairs |
| type scale | nothing below 13px, all mono tracking at or above 0.12em |
| motion | reduced motion honoured on every animated route |
| interaction | 5 templates x 2 widths, 450 focused stops |
| terminology | 208 files |
| visual | all assertions passed |

Plus `tsc --noEmit` clean, and a full-site link crawl: **152 pages, 278 unique
internal links, none dead.**
