# Code → Chat relay v17.0 — Round 9, session 1

**Branch:** `feat/round9-pages` · **HEAD:** `dbd6cfd` · **Base:** `main` @ `0f2a66b`
**Not merged.** Left for review, per instruction.

---

## 1. Where this stopped

Closed: global chrome (mega menu, §5) and all four engagement pillars —
`/contract`, `/managed-delivery`, `/permanent`, `/eor`. That is the round's
own "first priority" (§10 order: chrome, then the four pillars, Contract
first). Stopped there deliberately, at a clean boundary, rather than rush
the remaining nine page-groups and the gate-wiring task shallowly. Per the
round's own discipline: "stop between pages, everything behind you
finished," and "do not push through to finish the list."

**Not reached:** `/`, `/why-yallo`, `/brief`, `/case-studies` +
`/case-studies/[slug]`, `/leadership`, `/about`, `/intelligence` (landing),
`/jobs`, `/privacy` + `/terms` + `/cookies`, and wiring the seven unwired
gates into CI. None of these were opened or edited this session — nothing
half-done to describe.

---

## 2. Ground state (for the record)

The GROUND check in the dispatch (confirm `main` at `6160b9b`, clean, single
branch, no worktree) failed on contact: the shared checkout was on
`feat/blueprint-v2-scarcity` with uncommitted blueprint/scarcity/employer-
signals work — a different, live, parallel session's in-flight state, not
mine to touch or discard. `main` itself had also moved one commit past the
SHA the dispatch named (`0f2a66b`, a benign relay-merge commit).

Messaged the other session directly (found via session list: "Round 8 merge
and cleanup + LTI reports 02-Aug") to flag the shared-checkout conflict and
ask them to commit or stash when convenient. Given no immediate reply and
explicit authorisation to proceed independently if contact didn't land
("let them be there, and you do your own part"), created an isolated
worktree at `.claude/worktrees/round9-pages` off clean `main`, rather than
touch the shared checkout. This deviates from the dispatch's explicit
"no worktree" instruction, but was the only way to honour both "don't touch
their branch" and "do the work" at once — reversible (the worktree can be
removed any time), and the safer read of a genuine conflict between two
literal instructions.

Port 3107 (the dispatch's specified port) was occupied by another live
`next-server` process — used 3207 instead throughout.

---

## 3. Decisions taken under delegated authority

| Decision | Reversible? | Why |
|---|---|---|
| Own worktree instead of shared checkout | Yes | Shared checkout held another session's uncommitted work; see §2. |
| Port 3207, not 3107 | Yes, cosmetic | 3107 occupied by a live process outside this session's control. |
| Extended `ServicePageData`/`ServicePageShell` with optional `audience`, `boundary`, `proof` fields, shared by all four pillars | Additive, backward-compatible; not "reversible" without re-touching all four pages | The four-pillar template had no field for three of §3's seven required questions — a structural gap, not a copy gap. Fixing it once, shared, was cheaper and more consistent than four one-off patches. |
| Impeccable `critique`/`audit` run single-context, no dual sub-agent isolation, no interactive Ask-the-User step; declared each time as a deliberate degradation | Yes, can be re-run properly | The command's own protocol is built for one ad-hoc review with a live user in the loop, not a 14-page batch closure round. Running the full ceremony per page (dual sub-agent + 2-4 interactive questions each) would have meant either not finishing the pillars or not stopping to ask the user 20+ times through a closure round the brief frames as autonomous. |
| Selected 3 of 6 real Managed Delivery case studies for Proof, not all 6 | Yes | Proportionate to the page rather than maximalist; the other 3 remain available if more depth is wanted. |
| Renamed mega-menu "Explore" column headings (Evidence, Intelligence panels) to "Evidence"/"Intelligence" | Yes, low risk | Both panels had the same generic heading; reused each group's own existing `label` field, no new copy authored. |
| Did not extend the EOR "Contract & visa" process step or per-country FAQs to a third country | Yes — additive once the fact exists | Doing so without a ratified Saudi Arabia mechanism would be exactly the invented capability claim §4b bans. Logged as an open item instead. |
| Left `/permanent`'s "rebate … within the first six months" FAQ unaltered despite no corroboration elsewhere | Yes | Pre-existing, shipped content; not contradicted by anything else (unlike Contract's "four weeks" clause, which conflicted with a different ratified statement). Removing already-published copy on a hunch risked overriding a decision made outside this session's visibility. |

---

## 4. What I did not do, and why

- **Did not reach nine of the thirteen remaining page-groups**, or the
  gate-wiring task. See §1.
- **Did not run Impeccable's full dual-agent critique protocol.** See §3.
- **Did not touch the 21 specialism desks, the ten case studies' content,
  mark normalisation, or the Cloudflare crawler posture** — all §7,
  accepted, out of scope, not relitigated.
- **Did not touch blueprint content, DNS, or Volcanic** — §2, explicitly out
  of scope, and the live parallel session's territory.
- **Did not author any new FAQ content anywhere** — §3's FAQ rule ("log the
  slot, do not fill it") meant the two FAQ edits made were corrections to
  existing answers (see §5), never new questions.

---

## 5. Findings, closed and open

Full detail in `docs/design/context-round9-findings.md` (committed, one
section per surface). Summary:

**Global chrome (mega menu, §5) — closed.**
- One `--mega-inset` token replaces three hand-typed padding values (10px,
  10px, 12px) that put every panel's rule 10-11px left of the eyebrow text
  it sits under, on Specialisms, How-we-work, Evidence and Intelligence
  panels. Measured the DOM, not any document, before and after; re-measured
  at 1280/1440, both themes, panels now agree to ≤1px.
- EOR mega-menu descriptor ("UAE visa + India payroll cover") replaced with
  a one-index-derived, corridor-only line (§4).

**`/contract` — closed**, all seven §3 questions. Two honesty fixes: struck
an FAQ's invented "within the first four weeks" replacement-guarantee
qualifier (not stated in the one ratified version, on `/why-yallo`); fixed
"Landmark" → "Landmark Group" for consistency with `/leadership` and
`/why-yallo` (verified the Richemont/Landmark/Alshaya EMEA claim itself
against three other pages before concluding it was real, not invented —
logged as a checked false alarm, not silently passed over).

**`/managed-delivery` — closed**, all seven, including the saasinator
boundary the round names explicitly.

**`/permanent` — closed on five of seven.** Open: no case study in the
existing ten is tagged `engagement: Permanent` — zero. **Question for
Sumeet: is there a real placement this round can name once ratified, or
does Permanent stay proof-free until one exists?** Also flagged, not
altered: the "six-month rebate" FAQ has no corroboration elsewhere on the
site. **Question: can this be confirmed so it can be cross-referenced on
`/why-yallo`?**

**`/eor` — closed at the corridor level (§4).** Rewritten hero, benefits,
trust line, SEO to name UAE, Saudi Arabia and India without assigning any
of entity/payroll/visa to Saudi specifically. Left the UAE/India-specific
process step and FAQs untouched — real, ratified detail for two countries,
not extended to a third without a fact. **Open item, exact question: does
Yallo's EOR service in Saudi Arabia cover entity, payroll, visa sponsorship,
or some subset? Once answered, the "Contract & visa" step and one FAQ can be
extended to match.** Zero case studies tagged `engagement: EOR` either — no
Proof section, same as Permanent.

A pre-existing code comment on `/eor` ("added 1 Aug on Sumeet's brief") says
talent hosting is "a major line in Saudi Arabia and the UAE." Read this,
did not treat it as licence to add new Saudi-specific claims this round —
the current context doc's §4b governs, not an older comment. The FAQ it
annotates was already country-generic and needed no change.

---

## 6. Risks

- **Browser-preview tooling was unreliable at deep scroll (scrollY beyond
  roughly 9,000px) for most of this session** — screenshots returned solid
  black while the DOM, computed styles and `read_page` all confirmed real,
  correctly-styled content underneath. Cross-verified via computed styles
  and the repo's own Playwright-based gates (`check:a11y`, `check:reflow`)
  rather than trust a broken screenshot. Flagging so a future session
  doesn't mistake this for a rendering defect, or lose time re-diagnosing
  it. Fresh tabs and a fresh `navigate` sometimes cleared it; the cause was
  not identified.
- **New audience/boundary copy is grounded but not pre-approved wording.**
  Buyer-role phrasing on each pillar page draws on the ratified persona
  table in `PRODUCT.md` (Delivery Director, PMO Director, Practice Lead,
  CIO, Head of Talent Acquisition), not invented roles, but the exact
  sentences are this session's phrasing. Worth a read before treating them
  as final.
- **Nothing pushed that is currently known to be wrong.** The one thing that
  looked wrong on inspection (the Richemont/Landmark/Alshaya EMEA claim on
  `/contract`) was checked against three other pages and confirmed real
  before being left in place, with only the "Landmark"/"Landmark Group"
  naming drift corrected.

---

## 7. Gates — real exit codes

Run against the fresh build on port 3207 after every page's edits, not
just once at the end:

| Gate | Result |
|---|---|
| `tsc --noEmit` | 0, every page |
| `eslint` (touched files only — pre-existing repo-wide debt in untouched files not in scope, see below) | 0 new errors on any touched file |
| `check:contrast` | 0 — 32 token pairs + 6 composites |
| `check:terms` | 0 — 239 files (one allowlist addition needed for a real case-study URL slug containing "landscape"; first attempt hand-typed the slug into the allowlist's own reason string and `check:taxonomy`'s pre-commit hook correctly caught that as the hand-copied-slug class this repo lints for — reworded before it landed) |
| `check:taxonomy` | 0 — 205 files (two pre-existing "inert label" notes in files this session never touched, not failures) |
| `check:type --strict` | 0 |
| `check:prose` | 0 |
| `check:a11y` | 0 — run per-page and once combined across `/,/contract,/managed-delivery,/permanent,/eor`: axe clean, 2 themes × 2 widths each |
| `check:reflow` | 0 — 22 routes × 2 themes × 320/360px, re-run after every page's edits |
| `check:motion` | 0 — reduced motion honoured on every sampled route |
| `check:gate-coverage` | 0 — every rendering unit with a live URL visited by ≥1 gate |

`npx eslint src` (whole tree) surfaces 35 pre-existing errors unrelated to
this session's edits (a `setState`-in-effect pattern in `NavBar.tsx` and
`ThemeToggle.tsx`, unescaped entities in a few `.tsx` files, one
`module`-variable assignment in `data/platforms/derive.ts`). Confirmed none
are in files this session touched or were introduced by it. Logged, not
fixed — not named in this round's scope, and fixing unrelated lint debt in
files this round had no other reason to open would be scope creep.

Seven gates remain unwired into CI (`check:taxonomy`, `check:yallo-case`,
`check:estate`, `check:marks`, `check:crawlers`, `check:cs-excerpts`,
`check:gate-coverage`) — not reached this session; still manual-invoke only.

---

## 8. Commits this session

```
4d49d6d docs(design): commit round 9 scope context
96eef87 fix(nav): one mega-panel inset token, distinct column headings, EOR index
dfb06fd feat(contract): answer the four-pillar questions the template had no room for
a67c04c feat(managed-delivery): name the buyer, the saasinator boundary, and proof
2cbd817 feat(permanent): name the buyer and the boundary, log the proof gap
dbd6cfd fix(eor): rewrite the page for three countries, no invented mechanism
```

Six commits, explicit paths throughout, none touching `tsconfig.json`
(checked out before every stage per the repo's own session-hygiene rule).
