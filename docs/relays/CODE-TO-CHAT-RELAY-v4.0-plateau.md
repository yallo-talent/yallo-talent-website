# Code → Chat relay v4.0 — the plateau run

**31 July 2026 · branch `plateau-run` · 49 commits · HEAD `e7c398a` = tag `plateau-freeze-4`**
For Sumeet to consult with Chat. Written after four freeze-4 passes were
launched and before they returned.

---

## 1. TL;DR

The **design system has converged** — five independent critique passes, each
composing every one of axe's abstentions by hand (424, 334, 320, 206 and 65
nodes), found **zero** contrast failures, and type, focus, motion, reflow, target
size, font realisation, glass and terminology all hold under adversarial
measurement. Nine CI gates are green.

The **plateau condition has not been met on any surface**, and I now think part
of the reason is that one half of it is not measurable at the precision we have.
Three raters scoring an *identical* frozen build returned **28, 29 and 31 of 36**.
"No gain over the previous pass" is inside that noise. The other half — no
critical/high findings — is measurable, and it is the one worth keeping.

**The run is slow, and the main cause was mine:** for the first fifteen or so
passes the loop was critique → fix → critique, with commits landing while a pass
was still measuring. Under that loop the plateau condition is unreachable *by
construction*, because every pass scores a different artefact. I proposed
freezing the build late. Once frozen, the picture resolved immediately.

---

## 2. Where the four surfaces stand

| Surface | Pass scores | "No gain"? | P1s open | Blocked by |
|---|---|---|---|---|
| Homepage | 25 → 25 → 27 → **31 / 28** (paired, same build) → 29 | ✅ in-spread | 0 | — |
| `/industries/retail` | 68.8% → 65.6% → 71.9% → **72.2%** | ✅ flat | 0 | — |
| `/platforms/sap` | 67% → 71% → 64% → **64%** | ✅ flat | **1** | **Q17** |
| `/capabilities/data-analytics` | 23 → 22 → 29 → 25 → **29/36** | ❌ +4 | 0 | — |

**Running now:** two passes each on the homepage and retail, against one frozen
build. That is the first structurally valid test of plateau in this run.

Even a clean result gives **two of four**. SAP cannot plateau while Q17 is open,
and Data & Analytics needs one more round to show a flat reading.

---

## 3. What shipped

Highlights only; the full log is in `docs/status/PLATEAU-RUN-REPORT.md`.

| Area | Landed |
|---|---|
| **R1–R5** | Ratified into canon (`d6284c7`) |
| **R4 identity hues** | Lead trio live and verified painting; full 18-domain mapping proposed in `docs/design/identity-palette-proposal.md` |
| **R5 IA** | SAP 14 → 17 modules, 3 retired; was/now/why table in `docs/design/ia-change-log.md` |
| **SAP L2** | New template + 17 routes, drill-down wired, metric definitions rendering |
| **Type** | **92 of 181 font-weight declarations named a face that never loads** — every heading on the site was browser-synthesised. Corrected to the three real weights; new browser gate enforces it |
| **A3 glass** | Had never rendered. Lightning CSS was dropping the unprefixed `backdrop-filter`; now live on the scrolled header |
| **WCAG closed** | 2.4.7 (12 links with no visible focus ring), 2.4.11 (overlay covering focused content), 1.4.10 (40px scroll at 320px), 1.4.12 (clamps losing content), 1.4.3 (label over ambient at 3.95:1), 1.4.13 (mega panels not dismissible; 33 tab stops → 8) |
| **New gates** | 4 added: rendered type (4 widths, scrolls + focuses), font weights, interaction (450 focused stops), A5 hover pairing. Reflow now asserts 320 **and** 360 |

---

## 4. What I need from you — five rulings

Each one is logged in `QUESTIONS.md` with measurements.

| # | Question | Blocks |
|---|---|---|
| **Q17** | The SAP module L2 returns content **byte-identical** to its parent L1 card — same scope line, same role list. Net new information: zero. Fixing it needs authored depth from the corpus, and "invent nothing" means I cannot write it. | **SAP plateau.** The only P1 I cannot close |
| **Q18** | SC 2.2.2 (Level A). The client rail (64s) and hero instrument (~12s) pause on **hover only** — no mechanism for keyboard or touch. Canon §5 literally says "pause on hover", so the build honours the clause and the clause is the defect. Needs a pause **control**, which is new UI on the two most restrained surfaces | A Level A criterion |
| **Q16** | `check-a11y` cannot distinguish an *abstention* from a pass. axe returns 113 `color-contrast` nodes as `incomplete` on one page — a real 3.26:1 failure hid there for a round. Making the gate compose contrast itself is substantial work | Gate confidence |
| **Q14** | Canon §5 bans blurred orbs; four pseudo-element rule sites survive (~11 instances). Either the ban covers them or the clause needs narrowing | One line either way |
| **Q15** | Two vendor marks (`blue-yonder`, `sap`) still render as light slabs on the dark band — canon §8's "never a mark on a white card" | Rail integrity |

Plus **Q9** (Blue Yonder's desks — you were naming them) and **Q11–Q13**.

---

## 5. Why it has been slow — honestly

Five causes, in order of cost.

1. **The loop could not terminate.** Critique → fix → critique means each pass
   scores a new build, so "no gain" never compares two readings of one artefact,
   and every round's fixes guarantee the next pass finds something. ~15 passes ran
   this way. **Mine to own — I should have frozen the build at pass 2.**
2. **I fixed instances, not classes — four times.** One line-clamp removed and
   three left live. One motion-only hover fixed and fifteen left. One `<cite>`
   un-italicised and one missed. One card's stretched link fixed, the sibling
   template's not. Each recurrence cost a full round.
3. **My own gates had blind spots that only a pass could find.** The type gate
   never scrolled, never focused, ran one viewport, and counted declarations
   rather than effective changes. Each hole cost a round to discover and close.
4. **Each pass costs 25–50 minutes** and returns a very long report.
5. **Blocked work cannot be closed by me at all** — Q17 and Q18 need your
   decisions, and Q17 needs content.

---

## 6. Three recommendations

**(a) Redefine the exit as "no P1", and drop the "no gain" limb.** It is below
the rubric's resolution: 28, 29 and 31 on one build. Keeping it means chasing
noise. **This is the single biggest speed-up available** and it costs nothing in
rigour, because the P1 limb is what actually protects quality.

**(b) Rule on Q17 and Q18 now.** Q17 is the only P1 I cannot close, so SAP is
stuck until it is answered. Three options for Q17: author the depth (needs
corpus work), reduce the L2 to a thin router, or descope the L2 and send the L1
card straight to the brief.

**(c) Accept this as the ratification point.** Your goal said "Sumeet reviews,
then we replicate". The system is converged and evidenced; the remaining P1s are
**product-layer** decisions — a link label, a card's affordance, how deep an L2
goes. Those want your judgement more than another critique round.

---

## 7. Two process lessons worth keeping

**Always restart the server before trusting a browser gate.** I reported two gate
failures I then could not reproduce three times running. Both were a stale
`next start` over a rebuilt `.next`. The tell was in the output — `control 1`
where it should read `control 41`, meaning nothing animated in *either* mode.

**Substring class selectors produce false P1s.** `[class*=expCard]` matches
`expCardOpenLink`, so a card measured 30×30 and looked 1.28% clickable. A pass
reported that as a P1; hit-testing says 100%. I then made the identical mistake
while checking it. Match class tokens exactly.

---

## 8. State

- Branch `plateau-run`, 49 commits, pushed. Tags `plateau-freeze-1` … `-4`.
- Nine gates green: terms, contrast, type, motion, rendered-type (7 templates ×
  4 widths), reflow (320 + 360), a11y, interaction (450 focused stops), visual.
- Servers on **3000** (yours) and **3100** (gates).
- Screenshots: `docs/status/shots/plateau-r2/` — 4 surfaces × 2 themes × 2 widths.
- Not merged to `main`. Awaiting your review.
