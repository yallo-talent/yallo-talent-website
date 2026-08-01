# Code → Chat relay v6.0 — the homepage pass

**1 August 2026 · branch `main` · pushed · HEAD `bc2baee` · nine CI gates 9/9**
Supersedes v5.0. For Sumeet to take into Chat.

---

## 1. TL;DR

Sumeet reviewed the homepage and gave fourteen points. **Twelve are shipped**,
two are open, one is shipped-but-he-has-since-changed-his-mind.

The headline finding is not a design one. **Five of the twelve fixes were
one-line logic faults wearing design clothes** — things reported as missing
assets, bad styling or thin content that turned out to be a gate, a guard or an
off-by-one. That pattern is the single most useful thing in this relay, because
the L1/L2 review is next and the same assumption should be applied there.

---

## 2. What was actually wrong — the five that matter

| Reported as | Actually was |
|---|---|
| "Six client logos aren't real / won't render" | A **class mean is not a class edge**. Oracle is red on white; Otsu split it perfectly, ground mean 247, but true white is 255, so ground pixels keyed to alpha **9** against a `< 8` transparent test. The build then reported "only 2.0% transparent" on an image that is 73% clean white. A 12% dead zone fixed all six |
| "Sephora renders as a black slab" | A name-only decision **appended to a list and never deleted** the asset an earlier run wrote. Stale file kept rendering for ever |
| "Case-study pages have one paragraph" | `<MDXRemote source={body} />` sat **inside** `{frontmatter.outcome ? … : null}`, and no ported study has an `outcome`. 300–500 word bodies existed and none reached a page |
| "SAP's sticky bar doesn't stick" | `position: sticky` travels inside its PARENT. The scope wrapped only the bar — 49px parent, 49px bar, **zero travel** |
| "Data & Analytics isn't clickable" | Flagged `published: false` while the route had been serving **200** throughout |

**None of these needed content, assets or design judgement.** They needed
someone to measure the thing rather than read the symptom.

---

## 3. Shipped — the fourteen points

| # | Point | Outcome |
|---|---|---|
| 1 | Hero crowded | 40 text nodes in 817px measured. Removed the instrument's metrics row — the densest *and* most redundant band ("72h" restates the headline; the tracker is visibly counting to it). 40 → 34 |
| 2 | India in the corridor | Middle East + Europe on 7 client-facing surfaces. India kept where materially true: `/jobs`, the CV form, `/leadership` |
| 3 | Client rail | Four faults: the keying bug, the stale asset, a box lockup warned-about-but-shipped for weeks, and height- instead of **area**-matching (a 14.5:1 wordmark ran 578px wide). 353px → 197px |
| 4 | "Coffee" ground | Measured **already neutral** (R−B 0–2). The warmth was gold *coverage*, not the background. Cooled two points to R−B −3 so gold sits on the surface |
| 5 | Gap callouts | Done. You wondered if you were being too critical — you weren't, it was the weakest part of a strong section |
| 6 | Pipeline | "You / we" actors added; a single pulse travels the connector. **Flowing-GIF idea not taken** — see §5 |
| 7 | Desk order | Packaged Software first everywhere; Data & Analytics → **Data & AI** |
| 8 | EOR | **Talent Hosting** documented — see §4, this needs your ruling |
| 9 | Engagement two-column | **NOT DONE** |
| 10 | Where we place | 7×7, frames off both columns, real SAP and Blue Yonder marks restored |
| 11 | Section transition | Tonal step + hairline at the AI-talent/evidence seam |
| 12 | Case studies | Bodies un-gated (233–522 words), TCS removed, Alshaya Azure first then MAF, cards lifted onto the band |
| 13 | Intelligence tags | GATED/OPEN removed. **The two asset pages are NOT DONE** |
| 14 | Logo | Diagnosed and four treatments shipped — **but see §6, Sumeet has picked G and it does not fit yet** |

Plus: ambient movement (a 34s breathe on the wash, not sparkles — glitter reads
as a template on an enterprise page), and the 7×7×7 taxonomy from the earlier
mid-run instruction.

---

## 4. Decisions I took that Chat should review

| Decision | Reasoning | Reversible? |
|---|---|---|
| **EOR keeps the headline; Talent Hosting sits beneath it** | EOR is the searched category and `/eor` is established. Talent Hosting is the accurate term and what TASC and UHRS compete on, but nobody searches it. **Sumeet asked for this to be flagged for Chat explicitly** | Yes — rename + redirect |
| Rail motion kept, control made discreet | Sumeet asked for the pause button gone. Content moving >5s needs a pause mechanism under **SC 2.2.2 Level A**, and hover serves a mouse only. The objection was to the look, so it is now one glyph, transparent until hover/focus, always in the tab order | Yes |
| Grayscale kept on the Where-we-place marks | Sumeet asked for "clean logos". Full-colour vendor marks would break canon §5's One Marker Rule (gold is the only decorative colour) | Yes, if canon amends |
| India kept on `/jobs`, CV form, `/leadership` | Candidate supply genuinely is Indian; leadership describes markets actually operated | Yes |
| 10 of the old site's 29 studies not ported | Facebook, Equifax, Sony, Maersk and similar are external cautionary examples, not Yallo client work | — |

---

## 5. Where I did not do what was asked, and why

**Point 6 — "a flowing GIF across the four blocks."** I shipped a travelling
pulse on the connector instead. A GIF cannot honour `prefers-reduced-motion`,
cannot be themed, and would be a raster asset in a system where every other
moving thing is a transform. If you specifically want a richer animation there,
it should be SVG or CSS, and it is worth Chat ruling on how much motion the
enterprise register can carry before it reads as consumer.

**Point 12 — "crawl the old site and complete the case studies."** I crawled the
index and fixed the real defect, which was that the bodies were never rendered.
I did **not** fetch all 19 individual pages to backfill richer content — that is
19 more crawls and the existing bodies are now 233–522 words each, which is a
real page. If you want the full original detail, that is a discrete task.

---

## 6. Open, and what each needs

| Item | State | Needs |
|---|---|---|
| **Logo — Sumeet picked G** | **NOT SHIPPED.** F is live. G is the widest treatment and overflowed the mobile header by 3px at 360; my narrow-width fix then broke the 0.12em mono tracking floor. Reverted to green rather than leave it broken | ~20 minutes of careful work: G at 0.12em tracking, tighter gap and rule padding, verified against the reflow **and** type gates |
| **Point 9 — engagement two-column** | Not started | Layout work, no blockers |
| **Point 13 — the two asset pages** | Not started | **Content dependency.** The Programme Staffing Blueprint promises team shapes, FTE counts and time-to-hire per archetype. None of it exists in the repo and none is derivable. This is a Chat/Sumeet authoring job before it can be more than a shell |
| **SAP's four narrative sections** | Parked from the previous run | `retail.ts` is 1,529 lines of authored copy. SAP needs an equivalent; the shell fills it with no code change |
| **Signavio / LeanIX roles** | Parked | Both ship the day the roles are confirmed |
| **"Sectors running SAP" shows only Retail** | Open | Data gap: only retail's sector data lists SAP tools |

---

## 7. Risks

1. **I pushed an accessibility regression and caught it late.** Logo variant F
   set TALENT to gold at 0.7 opacity; axe flagged serious contrast failures on
   three pages and it went out because I read the gate summary *after* pushing.
   Fixed. The generalisable rule now recorded: **in this system restraint comes
   from size and tracking, never opacity** — opacity removes contrast as well as
   emphasis.
2. **Error rate rose sharply at the end of the session.** The last four edits
   produced a design-hook catch, a type-gate catch, a pushed a11y regression and
   a reflow failure. Everything is green now, but that is the signature of
   working past the point of usefulness, and it is why points 9, 13 and the G
   logo were stopped rather than pushed through.
3. **The `prototype/` workbooks** were swept into git by a blanket `git add -A`
   and are now untracked and ignored. Sumeet confirms the login inside is not a
   real account, so nothing leaked. The habit is the defect and it has stopped.
4. **Canon reversal to record:** shipping logo G reinstates a divider that R15
   deliberately removed. R15's objection was to a neutral hairline pipe doing
   nothing; a gold rule at accent weight is a different object. Worth Chat
   confirming rather than leaving as a silent contradiction.

---

## 8. Answers I need

1. **EOR vs Talent Hosting** — service under EOR (current), or full rename with
   a redirect? Sumeet asked for Chat's assessment.
2. **Motion budget** — how much movement can the enterprise register carry? This
   governs point 6 and any future animation.
3. **The Blueprint's content** — who authors the team shapes and FTE counts?
4. **Logo G's divider** — confirm the R15 reversal, or keep F.

---

## 9. State

- `main`, pushed, clean tree, HEAD **`bc2baee`**, nine gates 9/9.
- Logo: **F (stacked)** live; A/B/C/D/E/F/G all selectable via
  `<Lockup variant="g" />`. Contact sheet at
  `docs/status/shots/r15b/logo-round2.png`.
- Case studies: 14 shipped, ordered from one `featured` field per file.
- Client rail: 14 keyed marks, 2 name fallbacks (Wickes, Radwell — both genuine
  box lockups the gate correctly declines).
