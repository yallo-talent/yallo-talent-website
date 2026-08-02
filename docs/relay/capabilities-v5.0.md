# Capabilities v5.0 — session B, round 6

**2 August 2026 · branch `feat/round6-content` · one commit, `b6ec013`**
Answers `docs/design/context-round6-rulings.md` §4, read against
`docs/design/yallo-talent-CANON.md` §1, §2, §4, §5.

---

## 1. Process — §1 held for the third round

`git rev-list --left-right --count main...HEAD` returned `0 0` at cut time, and
all eleven `docs/design/context-*.md` were present including this round's. Cut
from the merged `main` A handed over, ancestry checked rather than assumed,
nothing copied from a sibling worktree.

`src/data/ai-talent/**` was not entered. Five flagged platform labels live there
and were left for A.

**One thing to fix on A's side.** The pre-commit hook ran `biome check --write`
repo-wide and rewrote `src/components/blocks/l1/L1PageShell.tsx` — A's file, not
staged by me — on both the commit and the amend. Staging explicit paths kept it
out of the commit both times, and I reverted the working-tree edit each time.
§3.5's scoping of the hook to the staged set is confirmed necessary, not
theoretical.

---

## 2. The label sweep — §4.1

### 2.1 The count is 119, and 112 were swept

`check:taxonomy` reports **70 platform labels across 18 files and 49 discipline
labels across 14** — not the handover's 70 + 48 across 18 + 13. Five platform
ones are in `src/data/ai-talent/index.ts`, so **114 were in scope**. 112 are now
derived. Two are deliberately not, and that is §2.3.

### 2.2 Inert versus live, by shape — and the first measurement was wrong

§4.1 asked me to check each renders nowhere before sweeping. I did, by sentinel:
every flagged site got a unique token, the site was built, and each token was
looked for in the built pages.

**The first pass grepped the `.html` files whole and reported 88 live, 26 inert.
That number is wrong and the reason is worth carrying forward.** A Next.js
prerendered page ships its own props back inside a
`<script>self.__next_f.push(…)</script>` RSC payload, so a field that a
derivation overwrites before paint is still present in the file as *data*. The
grep was reading the data, not the page.

Re-run with `<script>` and `<style>` blocks and all tags stripped first — the
same visible-text extraction used for the behaviour diff in §2.4 — the answer is:

| Count | Shape | Renders? |
|---|---|---|
| 39 | `related[].label`, L1 sector and capability cross-links | **No.** `deriveLinkLabels` overwrites from the href's index |
| 8 | `narrative.ts related.links[].label`, platform pages | **No.** Same deriver, applied at `platforms/[platform]/page.tsx:604` |
| 7 | `home/place.ts platforms[].name`, the homepage platform axis | **No.** `derivePlatformList` |
| 7 | `platforms/authored.ts <platform>.name` | **No.** `derive.ts:219` takes `platformLabel(slug) ?? authored.name` |
| 4 | `blueprint/index.ts desks[].name` | **No.** `derivePlatformList` |
| 40 | remaining `related[].label` on the six capability files and seven L1s | **No.** `deriveLinkLabels` |
| **105** | **total inert** | |
| 6 | capability breadcrumb `{ label: … }`, last crumb | **Yes** |
| 1 | `data-analytics.ts:478` `twin[].label` → AI Talent | **Yes** |
| 2 | the two false positives in §2.3 | **Yes**, and not discipline/platform labels |
| **9** | **total live** | |

So "inert" was true of **105** and false of **9** — the mirror image of round 5's
sectors, where 49 were inert and 27 live. The reason is that A shipped
`src/lib/taxonomy-links.ts` in round 5, and it already stands in front of every
`related` rail in the repo. **The report is still a handover list rather than a
proof — it was just wrong in the safe direction this time.**

All 112 read `taxonomyLabels(slug).label` from `src/data/l1/index.ts`, the same
helper the sector sweep used. That module is a leaf with no imports, so a data
file reaching for it cannot close an initialisation cycle the way `@/lib/*`
would. Three files gained the import and carry a comment saying why.

### 2.3 Two flagged sites are NOT dead copy, and both block A's rule promotion

Both are the same gate blind spot: a `name:`/`label:` position matched on the
wrong axis. The rule cannot see which taxonomy a position belongs to.

**`src/data/home/screen.ts:73` — `"Cloud & Infrastructure"`.** This is one of the
**six specialist desks**, the array the homepage renders under "Screened by six
specialist desks". Canon §3 names the desks as a different axis that
legitimately and permanently shares two labels with the discipline set, and says
the two taxonomies **may not resolve into each other**. Deriving this would be
relay v6.0's error in the opposite direction. Rule 7 already has a
`SPECIALIST_DESKS` exemption, but it is scoped to a declaration of that name and
this array is `export const desks`, so the gate cannot tell them apart.

**`src/data/l1/education.ts` — `"Informatica"` as a tool-card `name`.** Its
siblings in the same array are authored product names ("Institutional data
warehouses"). Canon §2 allow-lists product names from every rewrite, and
deriving it would bind `name` to `platformsIndex` one line under a hand-typed
`vendor: "Informatica"`. I swept it in the first pass and reverted it; the file
now carries a comment recording why.

**Rules 6 and 7 cannot be promoted to hard failures until the exemption is
widened to cover both.** The clean widening is to exempt a `name:` that sits
beside a `vendor:` in the same object, and to key the desk exemption off the
array's contents rather than its variable name. That is A's file.

### 2.4 Behaviour is measured, not asserted

The merge base and `b6ec013` were each built to their own dist dir, and **all 238
prerendered pages compared as visible text**. Three pages differ:

```
industries/finance.html    Every financial-services segment. → Financial-services segments.
industries/government.html Every public-sector segment.      → Public-sector segments.
industries/retail.html     FMCG — Fast-Moving…               → FMCG (Fast-Moving…)
```

Nothing else. The 112 derivations resolve to byte-identical strings everywhere.

**And the derivation was proved live in the other direction**, per the standing
rule that a mechanism is not trusted until watched to move: renaming
`Salesforce` and `Cybersecurity & Risk` in `l1/index.ts` and rebuilding moved the
rendered label on **237 and 43 pages** respectively.

### 2.5 What that reverse test also found — for A or round 7

One page still carried the stale name after the index moved:
`capabilities/cybersecurity.html`, six times, from **two source strings**.

`check:taxonomy` cannot see either, because its `keyed` rule needs the label to
be the *whole* value and these embed it in a template:

```
src/data/capabilities/cybersecurity.ts:37   eyebrow:      "Cybersecurity & Risk · Contract-first"
src/data/capabilities/cybersecurity.ts:51   introEyebrow: "Why us for Cybersecurity & Risk"
src/data/capabilities/cybersecurity.ts:497  seo.title:    "Cybersecurity & Risk Contractors · Yallo Talent"
```

The `seo.title` alone paints four slots — `<title>`, `og:title`,
`og:image:alt`, `twitter:title`. **The class is 18 composed strings across the
six capability files**, all three fields, all six pages.

**I did not sweep them, and the reason is a copy judgement rather than caution.**
The sector files carry the same `eyebrow` shape but their `introEyebrow` is a
lowercase sentence-register variant — "Why us for banking & financial services",
"Why us for government" — which is authored copy, not a label copy. Deciding
which of eyebrow / H1 / introEyebrow / seo.title must track the index and which
is prose is a ruling, not a mechanical sweep, and §4.1 scoped me to what the gate
enumerates. Flagged here so it is not lost.

The equivalent platform residue is **not** a defect: 86 pages still say
"Salesforce" after the rename, and nearly all of it is product names — Salesforce
Marketing Cloud, Salesforce Commerce Cloud — which canon §2 allow-lists.

---

## 3. The byline — §4.2

`insightsSub` carried **"Written by Sumeet Goenka and the Yallo team.
Opinionated, specific, useful."** on exactly seven surfaces: `retail`,
`finance`, `government`, `healthcare`, `manufacturing`, `telco` and
`capabilities/cloud-infrastructure`. The authorship clause is deleted from all
seven. No replacement byline was minted.

**The field is not emptied, so it stays.** "Opinionated, specific, useful."
remains and is not an authorship claim. `capabilities/data-analytics` was the
eighth `insightsSub` and never carried the clause — it reads "Specific, sourced,
and written for the person doing the hiring." — so it is untouched.

Nothing changed on any rendered page, which is the ruling's own point: `L1Insights`
returns `null` when no insight is `published`, and none is anywhere. It ships
with the first published article.

---

## 4. The segment headings — §4.3

| Page | Was | Now | Segments beneath |
|---|---|---|---|
| finance | "Every financial-services segment. Specialists who know the context." | "Financial-services segments. Specialists who know the context." | 5 |
| government | "Every public-sector segment. Specialists who know the context." | "Public-sector segments. Specialists who know the context." | 4 |

The completeness claim is one word, so one word came out. No count replaces it,
and the second sentence is untouched.

**Five more headings carry the identical shape and I left them**, because the
ruling named two and §8's canon amendment banning the form is drafted, not
ratified: `retail` ("Every retail segment"), `manufacturing`, `education`
("Every kind of institution"), plus `healthcare` and `telco`, which decision 9
puts out of bounds this round. The four capability pages carry a different shape
— "Every sector runs a data programme — we staff them all" — which asserts
completeness about *Yallo's coverage* rather than about the list beneath it, and
is a separate question. **All of it becomes a class sweep the moment §8's
amendment is ratified.**

---

## 5. The em dash — §4.4

`FMCG — Fast-Moving Consumer Goods` → `FMCG (Fast-Moving Consumer Goods)`, in
`src/data/l1/retail.ts`. Verified as the only em dash in any segment name across
every L1 and capability file.

---

## 6. The CPG overlap — §4.4, and the answer is "leave both"

**`FMCG Manufacturing`'s role pills are NOT a subset of `Consumer Packaged Goods
(CPG)`'s. Both stay.** Both sets verbatim, in file order, from
`src/data/l1/manufacturing.ts`:

| `Consumer Packaged Goods (CPG)` | `FMCG Manufacturing` |
|---|---|
| Blue Yonder Demand Lead | SAP IBP Specialist |
| SAP IBP Consultant | Blue Yonder Demand Lead |
| TPM Functional Specialist | TPM Functional Consultant |
| SAP EWM Consultant | Route-to-Market Architect |
| Route-to-Market Architect | Distribution Management Lead |
| Anaplan Supply Planner | SAP CRM Consultant |
| Coupa Procurement Lead | CPG Analytics Consultant |
| SAP CRM Consultant | SAP EWM Lead |
| CPG Analytics Architect | Supply Planning Specialist |

Nine each. **Three are shared exactly** — Blue Yonder Demand Lead,
Route-to-Market Architect, SAP CRM Consultant. Six are not, so the test fails and
neither segment is deleted.

**One observation, not an action.** Four of the six unshared pairs are the same
role at a different suffix: SAP IBP *Specialist* / *Consultant*, TPM Functional
*Consultant* / *Specialist*, CPG Analytics *Consultant* / *Architect*, SAP EWM
*Lead* / *Consultant*. Read as roles rather than as strings the overlap is seven
of nine, and the two segments are close to the same desk under two names. The
test was applied literally as instructed and returns "leave both"; whether the
suffix drift is itself the defect is Sumeet's call, and no pills were merged and
no name was chosen.

---

## 7. Not touched, as instructed

Healthcare and telco segments — untouched, decision 9. `docs/lti-reports/` —
untouched. `src/data/ai-talent/**` — untouched. The seven Education screening
lines, government's `Education Administration`, and government keeping four —
all recorded closed, none reopened.

---

## 8. Measurement

Production build, `NEXT_DIST_DIR=.next-b-prod`, `next start -p 3012`, ownership
confirmed with `lsof -ti:3012` before every gate and the server restarted after
the final build. Freshness confirmed by pulling a swept string off the live
server, not by assuming.

| Gate | Result |
|---|---|
| `typecheck` | clean |
| `check:terms` | no banned terminology in 223 files |
| `check:taxonomy` | clean across 186 files; 6 platform + 1 discipline remaining, all accounted for in §2.1 and §2.3 |
| `check:type` | clean, nothing below 13px, all 13px mono tracking ≥ 0.12em |
| `check:contrast` | 32 token pairs + 6 composites, all AA |
| `check:hue-separation` | 7 hues, all clear the 7.94 ground floor |
| `check:type-render` | clean, 13 templates × 4 widths, 348 family/weight pairs |
| `check:yallo-case` | clean, 18 pages, 135 internal links all resolve |
| `check:a11y` | axe clean, 6 routes × 2 themes × 2 widths, 2,262 abstentions composed |
| `check:motion` | reduced motion honoured on every animated route |
| `check:reflow` | no overflow, 22 routes × 2 themes at 320 and 360 |
| `check:interaction` | clean, 5 templates × 2 widths, 450 focus stops |
| `check:gate-coverage` | every rendering unit with a live URL is visited; 5 lists read from source, none stale |

**Lint, source only.** `npx eslint src scripts` returns **37 errors and 13
warnings**, and the merge base returns **the identical 37 and 13** — measured by
stashing `src/data` and re-running, not inferred. No regression. The raw
`pnpm lint` number is not reported because it is mostly `.next-b-prod` build
output. §6 of the rulings says 38; the merge base measures 37 on source.

### 8.1 Two phantom failures, and how they were separated from real ones

`check-a11y` and `check-interaction` both crashed with
`page.goto: Timeout 60000ms exceeded … waiting until "load"` on `/`, on a build
whose homepage `curl`s 200 in 8ms.

The blocked resource was `/_next/image` on four client logos. **`curl` on those
URLs returned in 25ms and proved nothing** — without a browser `Accept:
image/avif,image/webp` header Next serves the original format. With the header,
one PNG did not return in 300 seconds.

It is not a defect in this branch. The merge base was built to its own dist dir
and served on port 3013, and the same request returned in **0.10s**; the same
request against `.next-b-prod` on a quiet machine returned in **0.07s**. The
cause was four Chromium instances left alive by running the gates back to back
in one shell command, starving the AVIF encode. Re-run one gate per invocation,
both pass. **Recorded because it presents exactly as a regression in the change
under test, and cost a merge-base rebuild to rule out.**

---

## 9. For Chat and Sumeet

1. **A must widen `check:taxonomy`'s exemptions before promoting rules 6 and 7.**
   Two sites (§2.3) are correct code the rules cannot distinguish from dead copy.
   Promoting as-is fails the build on the specialist desks and on a product name.
2. **`scripts/check-headings.mjs` does not exist and never has** — `git log --all`
   on the path is empty. Canon §9 R16 and the §9 clause both name it as the
   enforcement for "a heading may only assert what every row beneath it
   satisfies". The completeness claims in §4 above are exactly what it would have
   caught, and nothing was watching. Either the gate gets written or canon stops
   claiming it.
3. **The 18 composed discipline strings** in §2.5 — a ruling on which of
   `eyebrow` / `introEyebrow` / `seo.title` tracks the index would let this be
   swept mechanically next round.
4. **The five remaining completeness headings** in §4 — a one-line ratification
   of §8's drafted §2 amendment turns them into a class sweep.
5. **The CPG suffix drift** in §6 — seven of nine roles are arguably the same
   under two grades. Naming and merging are both authoring, so both wait on you.
