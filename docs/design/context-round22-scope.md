# Context — Round 22: closure. The migration, one redirect row, the empty hub, the runbook

**v1.0 · 8 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Standing rules: `context-round13-scope.md` §8 as amended by round 17 §1.1 (R-A9). Single session, one port (3115). This round is deliberately small: it closes v29's four open items so the runbook can execute.

---

## 1. Round 21 adjudication

Relay v29 read in full. **Accepted in its entirety.** Zero retractions and no result stated ahead of evidence — the v28 pattern did not recur. Specifically ratified: all nine delegated decisions, including moving the map to middleware with `skipTrailingSlashRedirect` (the sitewide-canonicalisation risk is accepted and gated), the generated published manifest, `linkLabel` required, keeping "How to read these numbers" in the PDF, and the mega-menu class fix taken mid-round. The two real reds (Button on a gated route) and the two method faults are recorded as v29 states them. `check:assistant-refusal`'s non-determinism is accepted as reported-with-caveat.

Rulings on v29's open items:

| Item | Ruling |
|---|---|
| `/white-papers/` | **`/intelligence`**, reversing round 21 §5. Game plan §8 row 7 names `/intelligence` as the 301 target explicitly; the §7 table row saying `/insights` is the contradicting entry and Chat propagated the wrong one. Editorially: legacy white papers are documents, and the live document family sits under `/intelligence`; `/insights` is an empty hub at cutover. §3 below. |
| Double-slash | Cloudflare fronts the app at cutover; one edge redirect rule there. Runbook v1.1 Phase 2 carries it, Phase 3 verifies it. The in-app two-hop chain stands as the gate-named exception until then. |
| Insights at cutover | Unpublished corpus is **intended** (Sumeet's 30 July descoping ruling; articles are Raphy's post-cutover). The hub's empty state is measured in §4. |
| Runbook | Authored Chat-side; Sumeet saves `CUTOVER-RUNBOOK.md` v1.1 to `docs/status/`; committed this round at ground. |
| `/privacy` clause | **Kept** unless Sumeet vetoes. Accurate disclosure of a true fact. |
| `ANTHROPIC_API_KEY` in CI | Returned to Sumeet with a recommendation to set it; the gate's Part B has proven its class twice. Not a build item. |
| The watched auto-merge publish | Sumeet's alone, correctly: entering credentials is outside what a session may do, throwaway or not. That refusal is ratified as the standing rule. |

## 2. The migration runs now

Run `0003_transcript_origin.sql` against the live database this round (`pnpm db:migrate`), rather than leaving it as deploy-ordering discipline. Grounds: v29 measured the failure mode as silent transcript loss, and the migration is `add column if not exists` — additive, measured safe, idempotent. After running: verify the column exists, then verify end to end that a panel conversation writes a transcript row carrying `origin_path`. The runbook's ordering note survives as the standing rule for every future migration; this specific window closes today.

## 3. One redirect row

`/white-papers` and `/white-papers/` → `/intelligence`, per §1's ruling. One edit in `src/data/redirects.mjs`; `check:redirects` re-run; the readiness report's redirect section updated. Nothing else in the table changes.

## 4. The empty hub

Measure what `/insights` actually renders with zero published articles, in both themes. If it presents an empty grid or an index of nothing, ship a quiet hub state: one short paragraph in canon voice noting that insight articles are being prepared, with a single link to the research family under `/intelligence`. No new surface, no placeholder cards, no "coming soon" theatre, no invented article stubs. If the page already degrades gracefully, report that and change nothing.

## 5. The runbook lands in the repo

Commit `docs/status/CUTOVER-RUNBOOK.md` (v1.1, saved by Sumeet) at ground, and update `docs/status/CUTOVER-READINESS.md` so its cross-reference resolves: runbook present, migration applied (§2), redirect row settled (§3), hub state (§4), and the two items that remain manual — the watched auto-merge publish and the Cloudflare edge rule at cutover — named with their owner. Anything red named with its owner.

## 6. Forbidden this round

- **Scope is closed at the five sections above.** No other copy, design or feature work; cutover items belong to the runbook.
- No invented article content or placeholder cards on `/insights`.
- No credential entry of any kind; the auto-merge watch is Sumeet's.
- No result stated in the relay before its evidence exists.
- UK English, no em dashes, canon vocabulary; explicit commit paths; Sumeet's uncommitted files untouched.

## 7. After this round

Relay v30 adjudicated, then the runbook executes: Sumeet's Phase 0 gates, the DNS flip, Phase 3 verification. Round 23, post-cutover, is already shaped: the Articles pane with a scoped second login for Raphy, the GitHub App hardening, Phase 8 measured on the production host, and the `/saudi-arabia` page.
