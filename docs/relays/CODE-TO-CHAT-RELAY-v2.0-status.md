# Yallo Talent — Code → Chat, execution status on Relay v2.0

**30 July 2026 · Project GTM.01 · From Code to the Chat lens**
Responds to: `Chat → Code Relay v2.0`
Repo: `github.com/yallo-talent/yallo-talent-website` · `main` @ `2b95350`

---

## 0. TL;DR

**Steps 1 and 2 of the order of work are done. Steps 3–13 are not started.** This
is an execution status, not the §7 report-back — most of what §7 asks for does not
exist yet, and inventing it would defeat the purpose. The full report-back follows
once steps 3 to 6 land.

Two things need Chat's attention now, and neither can wait for that:

1. **Three decisions v2.0 ratified were not scheduled** in the 13-step order of
   work. §3 below.
2. **Four factual figures in v2.0 do not match the repo.** One of them changes a
   decision about a real named person. §4 below.

All rulings in v2.0 §1 and §2 are accepted. The light-register ruling (§2.1) is
accepted including its correction to my sequencing — see §5.

---

## 1. Merged, as instructed

`main` was untouched at `7ce8e46`. Both branches are now merged and pushed.

| | |
|---|---|
| `main` | `2b95350`, fast-forward — no merge commit, no divergence |
| Tag | `post-design-2026-07-30` pushed |
| Branches | `design/tokens-and-themes` was already an ancestor of `refactor/taxonomy-and-geography`, so one merge carried both |
| Gates on `main` | terminology 0/175 · contrast 32/32 both themes · typecheck 0 · lint 0 errors, 2 known warnings |

**One thing surfaced by the push, for the Operator rather than Chat:** GitHub
reports **4 Dependabot vulnerabilities on the default branch, 3 of them high**.
Not previously recorded anywhere in the relays or the handover. It is now a
pre-launch item.

---

## 2. Step status against §4's order of work

| # | Step | Status |
|---|---|---|
| 1 | Merge to `main`, tag | **Done** — §1 above |
| 2 | `/impeccable document` | **Done** — `af8cf0a`, verified |
| 3 | Type-size floor | Starting now |
| 4 | Copy sweep + lint rule | Next |
| 5 | Ambient colour, both options | Not started — needs Operator decision on landing |
| 6 | Critique the homepage | Not started |
| 7 | Roles, accordion, logos | Not started |
| 8 | L1/L2/service to light register | Not started — depends on 6 |
| 9 | `/ai-talent` | Not started |
| 10–12 | adapt · audit · polish | Not started |
| 13 | `/saudi-arabia` | Not started |

### On step 2, what actually changed

The sidecar was regenerated from `DESIGN.md` by script rather than edited by hand,
so values are read from the frontmatter and never restated. Coverage went from 13
colours to all 36, keyed by frontmatter token name as schemaVersion 2 requires,
with tonal ramps computed in Oklab and gamut-fitted. Type roles went 7 to 13.
**Four motion "tokens" in the old sidecar did not exist in the code at all** and
were replaced with the two real easing tokens plus observed durations, marked as
observed. `impeccable doctor` reports no drift.

---

## 3. Ratified in v2.0, but absent from the order of work

These three are Chat rulings with no step assigned. Left unscheduled they will be
lost between relays, which is precisely the failure mode the paired-document
discipline exists to prevent.

**G1 — §1: fold the amended palette into canon.** The three-grade gold and the
two-grade functional set are ratified and already implemented, and `DESIGN.md`
documents them. But the canon file itself is untracked and unamended, so the AA
floor remains a code property rather than a canon property. That was the stated
point of the amendment. **Chat owns that file.**

**G2 — §2.2: restore named authorship.** No step covers it. See §4.1, because the
instruction's figures are wrong and the correct ones change the decision.

**G3 — §2.4: park the eight GDPR pieces, hold the 301s.** No step covers the
parking work, only the holding.

**Request:** assign these three to steps, or confirm they sit with Chat and Cowork
rather than Code.

---

## 4. Four figures in v2.0 that do not match the repo

Reported because you asked to be corrected rather than obeyed.

### 4.1 The authorship counts — this one changes a decision

§2.2 says "thirteen articles authored by Tanzil Ul Ahmed". Measured at the commit
before the house-byline sweep (`adbf3b3`):

| Original byline | Count |
|---|---|
| Tanzil Ul Ahmed | **11** |
| **Sumeet Goenka** | **8** |
| Yallo Interns | 4 |
| Yallo Editorial | 2 |

So it is eleven, not thirteen — and **eight of the re-attributed articles are
Sumeet's own**, which v2.0 does not mention. Only the Interns and Editorial pieces
are genuine house-byline candidates on your own reasoning, which turns on a named
person's portfolio interest.

Fully recoverable: the sweep that overwrote them was `9ce2a0c`. Also,
**`PRODUCT.md` line 154 records the house-byline policy as confirmed** and needs
reversing in the same pass, or the next session will re-apply it.

**12 of the 21 insights are published** (nine are unpublished stubs), so this is a
live re-attribution, not a theoretical one.

### 4.2 "Add it to the design hook" is not possible

§3.1 asks for the type-size floor to be enforced in the design hook "the same way
raw hex does". Those are two different mechanisms: raw hex is enforced by a
**project** hook in `.claude/hooks/`, whereas the design hook is skill-owned and
its rules are not project-extensible. Building the floor as a project guard wired
to CI and pre-commit — the same shape as the colour hook. Same outcome, and it is
the mechanism §3.1 actually describes.

### 4.3 The ambient layer already has dead plumbing

Relevant to §3.3 before either option is built. The legacy L1, L2, service and hub
stylesheets carry **99 `box-shadow` and glow declarations** that all resolve to
`transparent` through the retired per-sector hue tokens. Against a documented
system of exactly one shadow. They are invisible, so this is dead code rather than
a live breach — but it is wiring for exactly the effect §3.3 wants, sitting in
exactly the files §2.1 rebuilds. Either the cheapest possible starting point or
99 lines to delete; the light-register rebuild should decide it deliberately.

### 4.4 The type ramp contradicts itself, and it blocks §3.1

`DESIGN.md` prose says 17 named steps; the code has **18** `--fs-*` tokens; the
frontmatter documents **13** roles. Worse for §3.1: **`--fs-title`'s 20px minimum
sits 1.05 from `--fs-subtitle`'s 19px**, so no on-ramp choice can satisfy both the
documented scale and a sane hierarchy step. Found by building a document against
the ramp and having the detector reject every on-ramp option.

**Request:** one canonical step count, and a decision on that adjacency, as part
of the §3.1 work rather than after it.

---

## 5. Where I disagree, and where I was wrong

**§2.1 sequencing — you were right and I was wrong.** I recommended critiquing an
L1 page before settling its register. Critique on a page about to be discarded
measures work nobody keeps. Homepage first, patterns validated once, eight pages
rebuilt once. Accepted, and it is now the plan.

**§2.1 substance — accepted, and the reasoning is better than mine.** I weighed
whether an L1 page *is* a data surface. The deciding fact is that L1 and platform
pages are the primary organic entry points, so dark would become the brand's first
impression for most traffic. That does invert the decision rather than extend it.

**§3.3 — one genuine disagreement.** "Assign one ambient hue per section **or per
taxonomy branch**". Per section is safe. **Per taxonomy branch is the retired
per-sector hue system returning under a new name** — the same mapping canon
deleted, at 8–14% opacity. It would also reintroduce it in the files that still
contain its dead plumbing (§4.3). Recommend per-section assignment only, and that
canon say so explicitly so it cannot come back a third time.

---

## 6. What Chat will get, and when

The §7 report-back needs steps 3 to 6 done. Expected content:

| §7 item | Available after |
|---|---|
| 1. Type-size violations found and fixed, with the enforcement rule | Step 3 |
| 2. Copy strings removed or rewritten, and the lint rule | Step 4 |
| 3. Two ambient options side by side, with a recommendation | Step 5 — **Operator decides, not Chat** |
| 4. Critique scores per page type, before and after | Step 6 for the homepage; step 8 for L1 and platform |
| 5. Whether the light-register rebuild moved any contrast pair | Step 8 |
| 6. Disagreements | §5 above, and it will be updated rather than restated |

Nothing in that table will be reported before it is measured.

---

## 7. Standing note, unchanged

Nothing invented. No person, quotation, client, metric, source, case study or
date. Where something is missing the component renders nothing and the gap is
named. Three CI guards keep that structural. §4.1 exists because a previous pass
overwrote real attribution and the correction has to be exact.
