# Context — Round 7 close-out and integration

**v1.0 · 2 August 2026 · Chat lens, adjudicating relay v12.0 (A), capabilities v6.0 (B) and casestudy v1.0 (C)**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. Supersedes nothing; completes `context-round7-rulings.md`.

**Do not merge to `main` before §3 is done.** Three branches are individually green and collectively broken. That is the expected shape of a three-session round, not a failure of one, but it means round 7 needs an integration pass before it closes.

---

## 1. What the round produced

All three sessions did the substance they were sent for.

**A** found that the mark normalisation had been live and inert simultaneously: `build-logos.mjs` solved a display height per mark and then clamped it to 20–46px, and **nine of fifteen marks sat pinned at the 46px ceiling**, so for those nine no normalisation ran at all. Rendered ink area spanned **6.07x** across the rail. That is why the complaint came back twice after being fixed twice, and it is the best answer available to why hand-tuning kept failing. Worst deviation is now 12.8% on the rail, 0.4% on the case cards, 0.8% on the platform axis.

**A also closed the biggest open question in the discoverability scope with a measurement rather than a meeting.** The legacy "Block AI Bots" toggle on the yallo.co zone is **off**, and all fourteen documented crawlers plus the control are served the real page today.

**B** audited every case study against its own `sourceUrl` on the live site rather than against the count I supplied, and found ten real published sources, not eight. Four entries were deleted: three whose `sourceUrl` 404s or resolves to an unrelated article, and the placeholder-client card.

**C** rebuilt the detail template and landing page, and caught a defect in my own ruling before shipping it.

---

## 2. Adjudication

### 2.1 Reversed against myself, twice

**C is right about "WHAT YALLO DID".** §5.3 specified that label, and the template renders section labels in fixed mono uppercase. That string is exactly what canon §2 bans and exactly what this round's own `check:yallo-case` extension was built to catch. I specified a label that the round's new gate would have failed on. C's replacement, **"THE APPROACH"**, is accepted and is better than what it replaces: the four now read THE CONTEXT, THE CHALLENGE, THE APPROACH, THE OUTCOME, which is parallel where mine was not.

**B is right that the count is ten, not eight.** §7 said "eight sources means at most eight entries", and B correctly read that as conditioned on eight existing, verified that ten do, and refused to invent deletions to hit a number nobody had checked. My eight came from memory and was never measured. B's instinct not to reconcile silently is the behaviour to keep.

The two MAF and Alshaya multi-vendor entries that read as one story against two clients are **both real and independently published**. Yallo's own case-study copy reuses a template across genuine engagements. My §7 named them as the visible defect; they were the honest twins, and the actual duplicates were the three with broken source links.

### 2.2 Accepted

| Item | Position |
|---|---|
| A constraining the **ink box** rather than the image box, because Wipro's file is 56.4% padding and Workday's 46.0% | **Accepted.** Charging a mark for its own transparent margins pushes ink below the legibility floor for no reason a reader could see |
| A refusing to lower the 15px ink floor to make its own gate green | **Accepted, and it is the right instinct stated correctly.** Moving a floor to improve a metric is the gate lying |
| A's `check:marks` reading the painted box from the DOM and multiplying by the manifest's ink fraction, so neither number comes from the library under test | **Accepted.** That is a composite measurement rather than a library agreeing with itself |
| The `next/image` integer-attribute finding — SAP's aspect rounding to 2.111 against a true 2.021 and inflating its ink by 5.2% | **Accepted.** A mark failing its own normalisation through a rounding error in the attribute the optimiser reads is worth recording as a class |
| The control user-agent in the crawler probe | **Accepted.** Without it the placeholder's ordinary 404 read as fifteen crawler blocks |
| C rendering the region chip as plain text | **Accepted.** No `/regions/*` route exists, so §5.3's "each an internal link" could not be literal. Correct to report rather than invent a destination |
| C leaving the sector filter absent rather than empty | **Accepted.** No case study populates `industry`; an empty filter row is worse than none |
| C matching `platform` by containment against the canonical label set rather than a synonym table | **Accepted.** A hand-written synonym table is the derivation class waiting to happen |
| B refusing to set `consentOnFile: false` for Sephora, Wickes and Radwell | **Accepted, and the reasoning is exactly right.** That flag means no permission to name the client anywhere, which is the wrong scope for a missing asset |
| B leaving `TheScreen.tsx`, `Evidence.tsx` and `LogoRail.tsx` to be wired by someone who owns them | **Accepted.** The file split held, which is why the breaks in §3 are visible rather than latent |

### 2.3 Reversed

**"Undisclosed enterprise" is restorable, and §7.5 was wrong once B measured it.** I wrote that clause unconditionally. B then found the entry is real, live and published, and that the **source itself anonymises the client the same way**. That is not a placeholder invented by a session; it is a published case study with an anonymous client, which is precisely what canon's `clientPublic: false` descriptor pattern exists for.

The deletion stands for now because it is safely recoverable from the live source, but the entry should come back in round 8 with a proper descriptor rather than the string "Undisclosed enterprise". Logged at §5.

### 2.4 Escalated

Two, both at §5, neither blocking the merge.

---

## 3. The integration pass — six carry-overs, two of them build failures

Individually green, collectively broken. Each is mechanical.

| # | Break | Where | Fix |
|---|---|---|---|
| 1 | **Build fails.** `order.yaml` carries fourteen slugs; B deleted four of the files. A's library **throws on a slug that resolves to nothing**, by design | `content/case-studies/order.yaml` | Delete the four lines: `rapid-recruitment-for-critical-supply-chain-roles`, `rapidly-building-a-high-performing-azure-data-engineering-team`, `reducing-time-and-materials-cost-for-majid-al-futtaim`, `enabling-accurate-asset-governance-through-oracle-fusion-fixed-assets` |
| 2 | **Build fails.** B removed the `actor` field; the component still reads it. `tsc` reports exactly one error | `TheScreen.tsx` ~44–48 | Delete the comment and the `<span className={styles.stepActor}>{s.actor}</span>` |
| 3 | Two parallel implementations of the same two things ship | C's `interim-order.ts` and `client-lookup.ts` | Swap `interimOrderedCaseStudies` for `orderedCaseStudies` in `[slug]/page.tsx` and `page.tsx`; swap the `LogoImage` call sites in `ClientCard.tsx` and `CaseStudyCard.tsx` for `<ClientMark>`. Then delete `interim-order.ts` and the interim path in `client-lookup.ts` |
| 4 | The Sephora card still reads "Sephora Middle East" | `Evidence.tsx` ~32 | Call B's `clientDisplayNameFor(s.frontmatter.client)` instead of reading `client` directly |
| 5 | Sephora, Wickes and Radwell still render as **text inside a mark rail** | `LogoRail.tsx` | Change the fallback branch to exclude them from `LogoItems`, not to render `<span className={styles.wordmark}>` |
| 6 | `featured` is dead data once ordering derives from `order.yaml` | case study frontmatter | Sweep, but **only after carry-over 3**, because C's interim ordering still reads it |

**Merge order: A, then B, then C.** A carries the libraries the other two consume.

**Three pre-adjudicated conflicts.**

- `.claude/launch.json` — all three touched it. **Take A's version wholesale**; it already carries all three sessions with correct ports and dist directories, and A owns the file.
- `package.json` — A added `check:marks` and `check:crawlers`, C added `check:cs-excerpts`. Union of the script lines. Drop none.
- `tsconfig.json` — both B and C report `next dev` rewriting it for their custom dist dirs, and both reverted. Confirm it is clean before staging anything.

---

## 4. Rulings needed before the integration runs

**4.1 Blue Yonder renders as text until a transparent asset exists.** A measured `blue-yonder.png` as an **opaque plate**: 100% ink, no alpha, aspect 7.0. It cannot take the monochrome treatment and would paint a solid black bar. B's path fix is correct and removes a false vendor association; shipping it as-is replaces a wrong logo with a black bar.

Set `mark: null` for `blue-yonder` in `place.ts`, so it renders as a text label beside Informatica. Least-overclaiming: no false mark, no black bar, one line to reverse when the asset lands.

**This leaves two of seven platform entries as text, which is visibly inconsistent, and two files from Sumeet close it entirely.** Recorded plainly rather than presented as resolved.

**4.2 The rail keeps its 15px ink floor and its 12.8% tolerance.** A's sweep offers 0.0% at a 12px floor. Keep 15px. The complaint that started this was a 6.07x spread — 507% — and 12.8% is not visible to a reader, while 12px would put Richemont at the edge of legibility. A was right not to take this decision itself.

**4.3 `check:yallo-case` must be green before the push.** It is red by design on A's branch, reporting 58 occurrences across fourteen files. B swept 27 across the ten survivors and the other four files went with the deletions. Verify green after the merge rather than assuming the arithmetic works.

---

## 5. Still with Sumeet

1. **Three asset requests, all one-line unblocks.** A transparent monochrome `blue-yonder` mark; a monochrome `informatica.svg`; and Sephora, Wickes and Radwell. On the last three: the files supplied in `assets/client-logos/` were declined by the build gate — Radwell as a box lockup, Sephora as a filled plate with knockout text on what appears to be an opaque white ground, and Wickes is not in the converted set. A did not rerun the conversion because that changes assets outside the round's scope, which was the right call.
2. **An eleventh published case study exists that this site has never had a file for** — "Ensuring Reliable Oracle EBS Integrations for Mission-Critical Enterprise Systems", TCS, Saudi Arabia. Real and live. Adding it is authoring, and it is worth adding: TCS is an integrator and Saudi Arabia is a named market, so it carries two things the current set is thin on.
3. **Restore the Oracle Fusion Fixed Assets case study** with a `clientPublic: false` descriptor rather than the placeholder string, per §2.3.
4. **The rail's 12.8%**, if §4.2 is not the call you want.
5. **Bot Fight Mode and the WAF custom-rule audit** remain the only Cloudflare items not measurable from the repository. The probe would catch either if it started blocking, which is the point of running it on a cadence.

---

## 6. Round 8, logged

- `check:crawlers` into CI against production, on the addendum's cadence.
- **Unify the gate base-URL conventions.** A counted four across five gates and lost two false failures to it. Deferred here deliberately: touching five gates during an integration pass is how a real regression gets mistaken for a convention error.
- `/case-studies` into `check:yallo-case`'s page list — the landing hub's card titles and excerpts are exactly the surface §3.5 was written for.
- The engagement strip needs `roles`, `count` and `duration` frontmatter fields; C correctly rendered only what the schema carries.
- Everything already logged in `context-round7-rulings.md` §10.
