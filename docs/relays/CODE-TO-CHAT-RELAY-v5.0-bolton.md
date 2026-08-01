# Code → Chat relay v5.0 — the bolt-on run

**1 August 2026 · branch `main` · pushed · HEAD `eb269b0` · nine CI gates 9/9 green**
For Sumeet to consult with Chat. Covers the bolt-on `/goal`: S1–S3, R6–R15 and
the seven-item ORDER. Supersedes v4.0 (the plateau run).

Authorities, not restated here: `docs/design/yallo-talent-CANON.md`,
`docs/status/BOLTON-RUN-REPORT.md`, `QUESTIONS.md`,
`docs/design/blue-yonder-evidence.md`, `docs/design/ia-change-log.md`.

---

## 1. TL;DR

The bolt-on is **executed end to end**. S1–S3 and R6–R15 are in canon and shipped;
ORDER 1–7 are addressed; `plateau-run` is merged to `main` and pushed; nine gates
are green.

**One P0 and nine P1s were found and closed.** The P0 was mine and it was the
worst class the canon names: the site asserted three client programmes for a
vendor with zero supporting records.

**Two of my own earlier reports were wrong, and both are corrected in place.**
R11 was reported shipped when only its tokens resolved — the class that paints the
identity hue was applied to nothing on any page. And two "gate failures" were
phantoms from a stale server on the port the gates default to.

What is genuinely left is **three business facts only Sumeet holds** (Q11, Q12,
Q19b) — no build work is blocked behind anything else.

---

## 2. What shipped, against the bolt-on's own list

| Item | State | Evidence |
|---|---|---|
| **S1** zero-P1 exit | Met on all three scored surfaces | §3 |
| **S2** freeze / batch / classes | Followed; freeze `bolton-freeze-1` = `96bf6bc` held across all three passes | 11 commits after the freeze, none during |
| **S3** delegate, never idle | 5 decisions taken and logged; Q1 and Q19a closed this session | §6 |
| **R6** L2 depth by joining | Shipped; depth slot reserved and deliberately empty | — |
| **R7** stop the loops | Shipped; canon §5 reads "pause on hover **plus a control**" | Q18 closed |
| **R8** orb ban | Shipped — **8 sites, not the 4 reported** | Q14 closed |
| **R9** two vendor marks | Shipped as keyed art or NAME text | Q15 closed |
| **R10** compose every abstention | Shipped | Q16 closed |
| **R11** identity hues | **Delivered this session, after I over-reported it** | §4 |
| **R12** light is the register | In canon §5 | Q3 closed |
| **R13** Blue Yonder from evidence | Shipped, 8 modules, evidence table logged | Q9 closed |
| **R14** case-study deletions | Shipped, removals logged | Q2 closed |
| **R15** logo | Shipped **variant B**; four alternates captured | §7 |
| **ORDER 1** SAP IA round 2 | Four S/4HANA variants folded into one with deployment variants inside; was/now/why logged | — |
| **ORDER 2–4** SAP, D&A, Blue Yonder to zero P1 | Done | §3 |
| **ORDER 5** mega menu | Done — the flicker was a remount | §5 |
| **ORDER 6** client rail | Done — the **cap**, not the cell, was binding | §5 |
| **ORDER 7** replicate | Measured across 7 routes in 3 families | §5 |
| **Descoped** insights/blogs | Not touched, not ported, not templated | — |

---

## 3. The P0, and the nine P1s

### The P0 — an invented attribution, and it was mine

`/platforms/blue-yonder/blue-yonder-wms` rendered **"Blue Yonder programmes we
have staffed."** above three case studies naming **Majid Al Futtaim** (×2) and
**Alshaya Group**. `grep -rli "blue yonder" content/case-studies/` returns **0**.

All three arrived through the `multi-platform` limb of the evidence join **I wrote
for R6**. My reasoning — a multi-platform programme spans suites by definition —
defends *showing* those studies. It does not license a *heading that names the
suite*. The page converted "spanned several suites" into "was a Blue Yonder
programme" about two real, named clients.

It landed worst on the one suite with no corpus — the suite R13 built under a hard
rule to avoid guessing. The page omitted six real Blue Yonder products for want of
a mapped role, then asserted three client programmes on strictly less evidence.

**Fix:** the tag must NAME the suite. Blue Yonder renders no evidence section;
SAP keeps its 1 real study, Oracle 3.

**For Chat:** this is the failure mode worth generalising. The rule "invent
nothing" was honoured at the data layer and broken at the *heading* layer. A join
can be individually defensible and still make the page assert something false once
a label is placed over it. Worth a canon clause: **a heading may only assert what
every row beneath it satisfies.**

### The nine P1s

Full table in the run report §3. The pattern worth Chat's attention: **five of the
nine were class-level defects that had been fixed once as instances** — a
hardcoded `72px` header offset that was the fourth of its kind and the only one
never migrated; a hover ladder inverted across the whole L1 shell; a module sort
that silently took its order from unrelated seed data.

**Two were caused by my own R11 change**: the gold grades were calibrated against
`--paper-3` (225), and R11 moved the real painted ground to 205–229. A *darker*
ground lowers contrast for mid-dark ink. I had written "AA held throughout". It
did not — 2.78:1 and 4.36:1 against 3.0 and 4.5 thresholds. Fixed by darkening the
ink ~6% rather than weakening the wash, because **the wash is R11**.

---

## 4. R11 — what was actually wrong

This is the most useful finding of the run.

R11 said: *"iterate until visibly distinct, not until tokens resolve."* **I
reported it shipped when the tokens resolved.** That is precisely the failure the
wording named.

The tokens were correct throughout — plum on Retail, teal on Data & Analytics,
indigo on SAP, at the ratified alphas. The defect was that **`.amb-wash`, the
class carrying the gradient that consumes `--amb`, appeared ZERO times in any
`.tsx`.** The rule existed, was well tuned, and painted nothing. Identity reached
only the petal plates. That is the entire explanation for "every page reads the
same coffee-brown".

Three faults:

1. **No wash hosts.** `.amb-1` sat on `.page` — the whole document, 7,235px on
   Retail. The gradient sizes in percentages of its host, so on a box that tall it
   scales to the document and reads as nothing at viewport scale. Canon §5 already
   said the wash "lives on bands and panel edges".
2. **`.band-dark` inherited the light ambient tuning.** It restates grounds, text
   and the Layer 2c aliases but not `--amb-alpha` — so in light theme a permanently
   dark surface laid a 20% tint chosen for a 233 ground over a 15 ground. SAP's
   hero measured `rgb(15,15,15)`: no hue at all, so SAP had nothing to be distinct
   from Retail *with*.
3. **It could not restate the hue either**, because hue is per-domain and
   `data-identity` sits on an ancestor, so `--id` arrives pre-resolved to the light
   variant. 18 domain-paired rules now hand `.band-dark` the dark variant.

**After, hero band mean, ΔE76** (2.3 just-noticeable, 5.0 distinct):

| Pair | Light | Dark |
|---|---|---|
| **SAP vs Oracle** — the real test, same register, hue is the only variable | **7.3** | **7.3** |
| SAP vs Retail | 73.2 (mostly register) | 5.7 |
| Retail vs Data & Analytics | 5.0 | 8.7 |

Before: 3.8 on the hero, and **0.0** where the washes should have been.

AA held — contrast and a11y re-run after the washes darkened every ground.

**For Chat:** the generalisable lesson is that *token resolution is not evidence of
rendering*. A design token can be correct, inherited correctly, and consumed by a
rule that no element carries. Any future "is X live?" check should assert a
**painted pixel**, not a computed custom property.

---

## 5. ORDER 5, 6 and 7

**Mega menu.** Hover-intent, route-change close and the dark panel tone were
already in. The flicker was a **remount**: each group owned its own
`AnimatePresence`, so 60ms into a switch there were **two** panels on screen at
opacity 0.32 and 0.67, cross-fading at different x positions. `.megaPanel` is
`position: fixed; left: 0; right: 0` — never positioned by its group wrapper — so
hoisting it out of the loop cost nothing. One panel, content swaps, max 1 panel
across five rapid switches. Selection also did not close it, because a link to the
route you are already on changes no pathname.

**Client rail.** "Still too tiny" — and **the cap, not the cell, was binding**. At
a 48px cap a wide mark filled 267px of its 268px cell while a square one rendered
48×48, 18% of the cell width. Cap → 68, cell → 300×112, build constants moved with
them so the legibility tests measure what ships. Narrowest mark 48 → 68px.

**Replicate.** Measured across 7 routes in 3 families rather than assumed:
identity hue now covers all three families; **zero ragged grids** anywhere; measure
≤ **80ch** with no paragraph over 80, so AAA 1.4.8 already holds; chips already
humanised (role chips 15.5px sentence case; the only uppercase ones are 13px meta
labels the type gate mandates). One critique per family is in the run report §10.

I reported a density defect here and then **disproved it myself** — 8 bordered
boxes in SAP's first viewport was a detector counting `border-top` dividers as
boxes. True count 4. Nothing to fix.

---

## 6. S3 decisions taken without you

Each is the least-overclaiming option. Reverse any of them cheaply.

| Question | Decision |
|---|---|
| May a `multi-platform` study sit under a suite-named heading? | **No.** The tag must name the suite. Applies to SAP and Oracle too |
| Fulfillment vs Fulfilment | Product name keeps the vendor's spelling; our prose stays UK |
| Blue Yonder name treatment | Two-line tracked small caps — refused to shrink below the A4 floor to hide a layout fault |
| Gold grades vs field strength | Darken the ink, keep the wash. The wash is R11; the ink carries no ratified lightness |
| Non-interactive hover lift | Remove it. A lift promises a click these cards do not have |

**Closed this session under S3:** Q1 (the 8%/14% cap it asked about no longer
exists — canon records 20%/30%) and **Q19a** (its premise was wrong: the six-hue
positional rhythm is not "retired", canon explicitly keeps it for pages with no
`data-identity`, naming the homepage as unaffected).

---

## 7. R15 — the logo, and a canon-versus-code conflict

Pipe divider gone. TALENT as tracked mono small caps at 13px — exactly the A4 mono
floor — with a −0.3em right margin so the trailing tracking space does not leave
the object optically short.

| Variant | Treatment | Cap-top delta | Verdict |
|---|---|---|---|
| A | Baseline (pre-R15) | 8.22px | Rejected — reads raised |
| **B** | **Cap height, 0.055em** | **0.72px** | **SHIPPED** |
| C | Optical x-height centring | 6.22px | Rejected — loses the step-down hierarchy |
| D | Cap height, 0.035em | 0.45px | Same treatment as B, 0.27px away |

**Self-critique including a correction:** I first wrote that D was "the only
variant where the cap tops agree". Measured, B and D are both cap-aligned and
0.27px apart — assertion dressed as measurement. Since that is below
perceptibility the choice is not about the mark but the CSS, so **B ships on the
simpler rule**.

Contact sheet: `docs/status/shots/r15-logo/ALL-FOUR-contact-sheet.png`. Override
is one attribute: `<Lockup variant="d" />`.

**Conflict found and closed:** canon said B ships; the CSS block header and the
`Lockup` prop doc both said D — leftovers from before that correction. Canon was
right (`:not([data-lockup])` is paired with `[data-lockup="b"]`, and the default
measures 0.72px). Both comments corrected. Had I trusted the comments I would have
reported the wrong shipped mark.

---

## 8. What still needs Sumeet — three items, all business facts

| # | Question | Why I cannot close it |
|---|---|---|
| **Q11** | "Active bench across 3 markets" against §2's supply/demand ban | Turns on whether there is a genuine bench in all three markets — a fact about the business. S3's least-overclaiming move is to soften the line, but softening a *ratified positioning line* is a bigger step than S3 contemplates, so it is recorded and not applied |
| **Q12** | The 68% figure and the "4–6 wks" claim | Needs a **source**, not a decision. If they are real they return with attribution. Both sit on the Data & Analytics page |
| **Q19b** | Three dark bands render in light on the homepage — `#place`, `#start`, `footer`, all `rgb(15,15,15)` — against §5's two-dark-band ceiling | Dropping a band changes the homepage's closing rhythm; reading the ceiling as excluding footer chrome amends canon. Either way it is a design call |

**Also flagged, not blocking:** the service family (`/managed-delivery`, `/eor`)
carries no identity hue. They are not platforms, disciplines or sectors, so they
sit outside ORDER 7's scope — I flagged this rather than inventing a 19th domain
hue.

---

## 9. Process lessons worth keeping

1. **Restart every port a gate can target, not just the one you are using.** The
   gates default to `localhost:3000`; I drove 3100 by hand and left 3000 stale
   across several rebuilds. A stale `next start` answers **200** and serves a build
   whose CSS chunks are gone — which produced an unstyled-page failure *and* a
   fictitious "29 offsets tweened under reduced motion" on `/contract`, because
   with no CSS there is no reduced-motion block to honour. Restarting 3000 turned
   7/9 into 9/9 with **no code change**.
2. **Wait for `load`, not `domcontentloaded`.** A stylesheet is load-blocking, so
   reading computed styles at DOMContentLoaded plus a fixed sleep is a race —
   `check-a11y` did exactly that and failed a server verifiably serving correct CSS.
3. **Measure the thing, not its container.** This run made that error **four
   times**: two identity ΔE readings comparing a dark hero band to light ones
   (65.1, 86.3 — meaningless), a wash sampled at the one corner both gradients
   avoid, and a density count that scored `border-top` dividers as boxes. Every one
   produced a confident, wrong number. Three were caught only by re-measuring with
   a different instrument.
4. **Token resolution is not rendering.** See §4.

---

## 10. State

- Branch `main`, pushed, clean tree, HEAD `eb269b0`.
- Nine gates green, run against two restarted and CSS-verified ports.
- Freeze `bolton-freeze-1` = `96bf6bc`; 11 commits after it, none during a pass.
- Evidence: `docs/status/shots/bolton/` (identity pairs, rail),
  `docs/status/shots/r15-logo/` (16 captures + contact sheet).
- Full detail: `docs/status/BOLTON-RUN-REPORT.md`.
