# Code to Chat — session B, content, data and IA

**v3.0 · 2 August 2026 · branch `feat/round4-content`, cut from the merged `main`**
Succeeds `docs/relay/capabilities-v2.0.md`. Answers
`docs/design/context-round4-rulings.md` §4.1, §4.2, §4.3, §6 and §7, and
`docs/design/context-education-universities.md`.

Three commits, `f6e0464` to `e017d5d`. Every claim below was measured, and the
measurements were taken on a **production build** (`NEXT_DIST_DIR=.next-b-prod`,
`next start` on 3102, port ownership confirmed with `lsof` first), not on the dev
server. `pnpm typecheck`, `check:terms`, `check:taxonomy`, `check:type`,
`check-gate-coverage`, `check-rendered-type`, `check-yallo-case` and `check:a11y`
are all clean. `pnpm lint` fails with 624 errors, and it fails identically on the
merge base with my changes stashed, so it is inherited and not mine.

---

## 1. The ground was clean this time

§1 of the rulings worked. Every `context-*.md` the brief named was already in the
branch, committed by A in `2205025`, and the AGENTS.md rule is there beside it.
Nothing was blocked, nothing was copied across from a sibling worktree, and the
near miss of round 3 did not repeat. Worth saying out loud because the fix is
cheap to let rot.

---

## 2. What shipped

### 2.1 Education & Universities, the seventh industry — `f6e0464`

Eight functions, all eight populated, built to **finance's shape rather than
retail's**. `/industries/education` and seven of the eight L2 routes return 200.

The one that does not is `institutional-back-office`, and that is the ruling
rather than a gap: §2.5 of the authored source makes institutional finance, HR
and procurement a **cross-link**, not a restatement. The card carries no `tools`,
its `href` routes straight to `/platforms/oracle`, and Workday and Microsoft sit
in `related`. Nothing links to the 404, so it is unreachable rather than broken.
Its three role pills are lifted **verbatim** from the three platform desks it
points at — Oracle Fusion Financials Consultant, Workday HCM Functional
Consultant, D365 F&O Finance Consultant — because minting institutional variants
would have been three invented job titles.

**All three of your §3 differentiators are in the copy**, not asserted about it:

| §3 point | Where it lands |
|---|---|
| The academic calendar cannot move | H2 of the intro block, and `screeningContext` |
| Student records have no acceptable error rate | Intro paragraph two, and function 08's screening line |
| The region is standing institutions up, not only upgrading | Intro paragraph three, and the `new-institutions` segment |

**Three things are deliberately absent**, each a §5 forbidden item rather than an
oversight. No scarce rail — "any scarcity flag or rate" is banned here, so the
six-field block is omitted rather than filled with `high` flags nothing supports.
No insights row — every insight card on the other six sectors is an unpublished
placeholder, and a seventh set would be seven more things that do not exist. No
figure anywhere, in a stat card or in prose.

The six segments are **customer-shaped by construction**: universities, school
groups, international branch campuses, new institutions and campuses, technical
and vocational institutes, research institutes. That is the same rule §6.5
applied to finance retrospectively, applied here from the start.

Research administration is named generically, as §2.4 instructs, and I found no
repo evidence for a named platform, so nothing was added.

### 2.2 The sector index — `f6e0464`

**Order is now data.** `industriesIndex` carries the mega menu's canonical order
and every label, and `sectorRegistry` is reordered to match because
`platforms/derive.ts` iterates it to build each platform's sector rail, and two
orders inside one taxonomy is the fault itself.

**Healthcare & Life Sciences, plural, is applied.** The mega menu's singular was
the only surface disagreeing with the index, the L1, the homepage and six
capability desks. Corrected to the plural, not the other way round.

Education's mega-menu row loses `published: false`, because the route now exists.

**A supplies the derivation and it will land on data that is already correct.**
I fixed the six rails as instances as well as supplying the index, deliberately:
if the derivation slips, the pages are right anyway; if it lands, it has nothing
to repair first.

### 2.3 The Data Science desk — `cca8401`

Eighth card on Data & Analytics. Six sub-desks, ten tools, nine roles, exactly as
§7 authored them. Model deployment and monitoring is cross-linked to MLOps rather
than restated.

**The boundary is stated once.** It is in the `overview`, and the `twin` band
carries the route. Rendered, the page says: *"Data science models a company's own
data. AI Talent builds on foundation models. The AI Data Engineer is the role
that serves both, and it is briefed from there."* Nothing about retrieval,
evaluation or foundation models is repeated on this desk.

**The reverse link is not built, and that is deliberate.** See §4.1.

### 2.4 Backbase and the finance sweep — `e017d5d`

Backbase is one entry on digital channels, four roles, all four already published
on that function.

**The hero moved with it.** It named five platforms; function 03 now carries a
sixth. Leaving the hero at five would have recreated the precise defect the sweep
exists to remove, so it names six and adds digital channels to the programme
list.

**Scarce rail, three off.** The test applied is: does the entry map to one of the
nine published functions *and* to a tool inside one of them.

| Removed | Why |
|---|---|
| nCino Loan Origination Specialist | Lending is function 07, but its tools are Temenos, FLEXCUBE and Finacle. nCino is a seventh platform the desk does not staff. |
| PSD2 / Open Banking Integration Architect | A European regulation rather than a product, on a desk weighted to the Middle East. Open banking survives as a role inside function 03. |
| AML / Actimize Transaction Monitoring Lead | The financial-crime card is a category on purpose and names no product. Actimize is not one of the platforms behind it. |

Nothing was added to backfill. Five true entries beat eight that promise a bench
the grid cannot show. **Onfido and Jumio appear in no file in this repository**,
so there was nothing to remove.

**Segments, six off.** The five you named, plus one:

| Removed | Why |
|---|---|
| Procurement & Vendor Management | Function-shaped, and mirrors the removed `procurement` function |
| IT Infrastructure & Operations | Function-shaped, mirrors removed `it-infra-fs` |
| Financial Planning & Analytics | Function-shaped, mirrors removed `fpna` |
| Data & AI in Financial Services | Function-shaped, mirrors removed `data-ai-fs` |
| Cybersecurity for Banking | Function-shaped, mirrors removed `cybersecurity-fs` |
| **Wealth & Asset Management** | Not on your list, but `wealth` is on the removed-functions list and the hero had already been rewritten for promising it. Your own rule, "anything mapping to a removed function goes", takes it. |

**And the second half, which is the one that was easy to miss.** The rail's role
pills named roughly **thirty vendors that appear nowhere in the grid**: Finastra
Loan IQ, Kyriba, Duck Creek, Fiserv, ACI, Marqeta, SAS, Wolters Kluwer, AxiomSL,
MetricStream, ION, Calypso, Salesforce FSC, SAP TRM among them. A hero naming six
platforms above a rail naming thirty-six is the defect; the pill is only where it
shows. Every title on the rail now is published verbatim on one of the nine
functions.

---

## 3. Education everywhere else: both lists, as §4.2 asks

**Added, and every one of them genuinely true.**

| Surface | How |
|---|---|
| All six capability desks with a sector rail | Seventh segment on each, roles drawn from that desk's own vocabulary or the education L1 |
| `/platforms/oracle` | **Derived**, from PeopleSoft Campus Solutions on function 01 |
| `/platforms/workday` | **Derived**, from Workday Student on function 01 |
| `/platforms/salesforce` | **Derived**, from Education Cloud on function 03 |
| `/platforms/microsoft` | **Derived**, from Dynamics 365 on 03, and Microsoft 365 Education and Entra ID on 06 |
| `/platforms/informatica` | **Derived**, from the Informatica card on function 07 |
| `industriesIndex`, the mega menu, `/industries`, the sitemap, `routeExists` | All read the index; nothing was hand-added |

**Nothing on a platform rail was typed by hand.** `platforms/derive.ts` builds
each rail from the `vendor` field on sector tool cards, so a platform can only
claim a sector a sector page already claims. Verified rendered:

- Oracle: Retail & Consumer, Banking & Financial Services **and Education & Universities**
- Microsoft, Salesforce, Informatica: Retail & Consumer **and Education & Universities**
- Workday: **Education & Universities** (its first derived sector)

**Not added, and why.**

| Surface | Why not |
|---|---|
| **Blue Yonder** | Supply-chain planning is not a university system. Its rail still reads Retail & Consumer only. Adding it for completeness is the invention rule. |
| **SAP** | **No repo evidence.** `platforms/authored.ts` carries sixteen SAP modules and not one is an education product; SLcM appears nowhere in this repository. Its rail still reads Retail & Consumer only. Left out, and said so, exactly as §4.2 instructs. |
| **`/ai-talent`** | The seventh discipline **publishes no sector rail at all** — no segments, no industry cross-links, nothing. There is nowhere to add education without inventing a surface, which is a design decision rather than a data one. Flagged, not built. |

---

## 4. For session A

### 4.1 One shell change I need, and it is small

**The Data Science ↔ AI Talent cross-link is only built one way.** Data Science →
AI Talent is live via the `twin` band. The reverse needs a link from `/ai-talent`
(or from `/ai-talent/ai-data-engineer`) to
`/capabilities/data-analytics/data-science`, and there is **no data-side slot for
it**: `AiRoleFamily.adjacent` is typed `RoleFamilySlug[]` and takes AI families
only, and `estateBridge` is platform-shaped, so putting a discipline link in it
would be wrong. It needs either a new field plus its render, or one link in the
existing adjacent band. I stopped rather than half-build it into a shell I do not
own. §7 asks for both directions and this is the missing half.

### 4.2 Two things I found and left alone

- **`_L1CrossSector` in `L1PageShell.tsx:488`** is dead code (underscore prefix,
  never called) carrying a hardcoded six-sector array and the sentence "a single
  bench across six industries". It renders nowhere, so it is not a live defect —
  but it is a seventh hand-copied taxonomy sitting in the file where the sixth
  was found, and it will be copied back into life by someone one day. Delete it
  or derive it.
- **The Platforms column of the mega menu** is still hand-written, as its own
  comment admits. Same class as the Industries column I just corrected.

### 4.3 Boundary notes

I touched exactly one file outside `src/data/**`:
`src/components/layout/nav-config.ts`, for the two label facts §4.3 and §6.2
assign to me — the Healthcare plural and Education's `published` flag. I did not
convert the Industries column to a derivation, because the sector derivation is
yours and two people writing the same one is a conflict for nothing.

`src/app/industries/education/page.tsx` is fourteen lines and identical to its six
siblings. No shell change.

---

## 5. Back to you, and none of it blocks A

1. **Islamic Banking is function 02 with no segment beside it.** The finance
   segments panel is headed "Every financial-services segment", and Islamic banks
   and conventional banks running Islamic windows are a customer segment this
   desk explicitly staffs — it is the desk's stated regional weighting. Adding a
   tenth segment is a content decision the ruling did not take, so I did not take
   it. One line from you and it is ten minutes.
2. **Two finance insight teasers still name removed platforms.** "AML analytics:
   why NICE Actimize modellers are the hardest hire in FS this year" and "PSD3 and
   open banking". Both are `published: false` placeholders, so no article exists
   behind either. The Actimize excerpt also carries an unsourced market claim
   ("Every large bank now runs its financial-crime programme through Actimize or a
   Snowflake-native equivalent") of the same class as the stat cards removed on
   2 Aug. Rewriting article titles is authoring, not sweeping, so I left them.
3. **Two finance segments remain function-shaped and both map to function 06.**
   Risk & Compliance and Regulatory Compliance & Governance are the two halves of
   one published function. Your stated principle — a segment is customer-shaped by
   definition — would take both; your stated test — every segment must map to a
   published function — keeps both. I applied the test, differentiated their role
   pills so they no longer read as near-duplicates, and am reporting the tension
   rather than choosing for you. On the strict principle, finance would keep four
   segments, not nine.
4. **Education's `screening` lines are authored by me**, one per function, in the
   pattern round 3 ratified. They make no claim beyond what is screened for. Worth
   your eye because a screening claim is the page's most load-bearing one.

---

## 6. What was accepted with no work needed, per §6.6

Engagement bands stay uniform; LlamaIndex stays under Retrieval; `ai-data-engineer`
renders no blueprint band. Confirmed untouched.
