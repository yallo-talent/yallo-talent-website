# Context — Round 20: the first real commit, cockpit v2, and cutover readiness

**v1.0 · 7 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Standing rules: `context-round13-scope.md` §8, as amended by round 17 §1.1 (**R-A9**). Single session, one port (3115), one dist directory.

**The theme.** This is intended as the final build round before cutover. Its four jobs: watch the first real commit land through the write pane and harden case-study management to full lifecycle; give the transcript pane a summarised view with filters; close every red and every unwired gate; and produce a measured cutover-readiness report so what remains is exactly the human items, enumerated.

---

## 1. Round 19 adjudication

Relay v27 read in full, including the in-place correction and the retraction discipline around it. **Accepted in its entirety.** Specifically accepted: the 404 diagnosis (the linker re-wrapping model-written markdown; the grounding gate agreeing with itself by construction), `check:assistant-links` red-proven through the real path; the brevity measurement and the measurement-backed refusal to lower `MAX_OUTPUT_TOKENS` (closed, do not reopen); the `shortName`/`linkLabel` find; the metrics class guard, including its correction of the scope file's "last known drift" claim — that claim was Chat's premise error, the same class as the six on record; all four contrast-gate measurement fixes; the throwaway-credential conduct around the first sign-in; the write pane's structural invariants and the refusal to claim an unwatched commit. All six delegated decisions ratified, notably `check:metrics` reporting prose figures rather than failing (the 42 occurrences are Sumeet's under R-A9) and `check:admin-render` failing rather than skipping without credentials.

Rulings Sumeet ratified on 7 August, closing v27 §7:

| Item | Ruling |
|---|---|
| §7.1 token | Sumeet pastes `ADMIN_GITHUB_TOKEN` and adds `ADMIN_GITHUB_REPO` per the step list he holds. **Expected, not measured — verify at ground.** The repo slug comes from `git remote -v`, never from either document's memory. |
| §7.2 auto-merge | **Enable** (Sumeet's setting to flip). If it is still off at ground, proceed: open the PR, report waiting; never merge from the module. |
| §7.3 contrast | **Darken the foreground tokens within hero context; never touch the washes.** The hero visuals are ratified. Scoped context tokens, light theme, clearing the floors with margin: ≥4.6:1 for the two muted tokens, ≥3.2:1 for the 62px gold. Once green, wire `check:contrast-render` into CI and the pre-commit hook. |
| §7.4 `workflow_dispatch` | Approved. Add the block to `ci.yml`. |
| §7.5 CI credentials | Approved. Generate a throwaway pair, set `ADMIN_TEST_EMAIL`, `ADMIN_TEST_PASSWORD` and the matching CI `ADMIN_PASSWORD_HASH` as repository secrets from this session; values never reused anywhere, never written to any tracked file. Wire `check:admin-render` and `check:assistant-links` into CI. |
| §7.7 the 2px | **The class fix**: `min-width: 0` on the NavBar's flex children so the row compresses at any font metrics. It cannot be verified locally; capped at **three** pushes, then report and stop. A third shave is forbidden. |
| Purge workflow | Sumeet sets the `DATABASE_URL` repository secret. Diagnose the failing `db:purge-transcripts` run; if the cause is the missing secret, verify green after it lands; if it is anything else, name it. |

## 2. The write pane: watch the commit, then full lifecycle

### 2.1 The watched commit — the cutover gate closes here

With the token, repo variable and (expectedly) auto-merge in place: execute one real publish from the pane and **watch the entire round trip** — branch created, PR opened, CI runs, auto-merge lands it, the content change visible on `main` and rendered by the site. Report each stage as observed, not inferred. If auto-merge is off, watch through to the open PR and report waiting. This is the one claim nobody has been allowed to make; make it only by watching it.

Use a reversible edit for the watched commit (a reorder via `order.yaml` is ideal: real, small, undoable by a second reorder).

### 2.2 Case-study management, full lifecycle — Sumeet's stated priority

The case studies are the site's proof point; the backend must be robust. Extend the pane from add/reorder to:

- **Edit** an existing study (frontmatter and body), through the same PR path.
- **Unpublish** (`published: false`), same path. Never a file deletion from the pane.
- **Validation surfaced in the pane before any PR opens**: the same schema, taxonomy-slug, sources and length rules the build enforces, run server-side on the draft, errors named field-by-field. A PR that CI will fail should be impossible to open from the happy path.
- **PR and CI status visible in the cockpit**: each publish shows its PR state (checks running, waiting for auto-merge, merged, or failed with the failing check named). No polling theatre; a refresh action is fine.
- **`clientPublic` enforced in the UI**: the flag rendered prominently per study; a client name or logo can never ship with the flag false, and the pane says so rather than silently anonymising.

Every mutation stays on the PR + auto-merge path. `check:write-path` extends to cover edit and unpublish, red-proven on one new invariant before trusted. Rendered admin gates re-run after the pane changes.

### 2.3 What remains out

No GitHub App migration (post-cutover hardening). No multi-user auth. No direct push under any failure, unchanged.

## 3. Transcripts v2 and the Articles shell

### 3.1 Transcript summarised view — ratified by Sumeet, 7 August

The conversations pane gains a **summary list as the default view**: date, page of origin, message count, whether a brief was captured, and the visitor's opening question as the summary line. **Deterministic, from stored fields — no model calls, no new cost, no new personal-data surface.** Filters: date range, has-brief, page of origin. The full transcript sits one click deeper, unchanged. Retention and purge rules unchanged; a derived summary is still personal data and lives and dies with its transcript.

### 3.2 The Articles shell — a placeholder, deliberately

Add an **Articles** entry to the cockpit nav rendering a disabled pane that states the plan in one short paragraph: articles are authored as MDX in `content/insights/` per the authoring guide, the build validates them, and cockpit authoring arrives post-cutover with team access. **No functionality. Do not build authoring, upload, or any watcher/scheduled-publish mechanism — the Cowork-watcher idea was evaluated and rejected (7 August): an unattended job holding repo credentials is a direct push wearing a different hat.** The pane exists so the nav is honest about what is coming and where articles live meanwhile.

## 4. Gates: close every red, wire every orphan

1. **Contrast**: apply §1's ruling to the three findings; `check:contrast-render` green, then into CI and the hook.
2. **The 2px**: the class fix per §1; three-push cap.
3. **CI wiring**: `workflow_dispatch` added; `check:assistant-links` and `check:admin-render` into CI with the throwaway secrets per §1; `check:write-path` and `check:metrics --check` into CI if not already.
4. **The purge workflow**: diagnose per §1's last row.
5. After the final source change: the full gate table re-run, every exit code real, CI on the final HEAD. The goal this round is **CI green end to end for the first time** — if anything is still red, it is named with its owner.

## 5. The cutover-readiness report

Produce `docs/status/CUTOVER-READINESS.md`, every line measured this round, no aspiration:

- **Build gates**: the full gate table with exit codes; CI state on final HEAD.
- **Parity checks**: sitemap count vs route count; every internal href resolving in one hop; `llms.txt` matching published routes; robots/`noindex` behaviour on the placeholder host vs the env-driven production policy (assert both branches).
- **The write pane**: what was watched (§2.1's round trip), stated exactly.
- **Assistant**: gates green, retention/purge working, ships ON.
- **Human items, enumerated with owners** — Sumeet: Wickes (retire or asset), heading fade in incognito, one attributed testimonial, sourced FAQ questions, client-logo `consentOnFile` flags, the 42 prose figures (R-A9), credential-backup directory deletion, go-live date. Raphy (game plan §12): DNS and cutover, redirect map deployment, WordPress teardown, Volcanic wiring, CDN/WAF retrieval-crawler confirmation, production `RESEND_*` with SPF/DKIM. Rides with cutover: top-50 rank baseline, server-log baseline, citation-share snapshot.
- **Out of scope, ruled**: Phase 8 (resumes post-cutover on field data), GitHub App, multi-user cockpit auth, cockpit article authoring, `/saudi-arabia` and regional pages, FAQ blocks (content-gated), testimonial slot population.

This report is the artefact Sumeet takes the go-live decision on. It states what is true, not what is hoped.

## 6. Forbidden this round

- **No direct push from the cockpit under any failure.** No merge simulated from the module.
- **No model calls in transcript summaries.** Deterministic fields only.
- **No article authoring functionality.** Shell only, per §3.2.
- **No fourth 2px shave.** The class fix or nothing, three-push cap.
- **No wash or ambient-art changes** for the contrast fixes; scoped foreground tokens only.
- **No invented person, client, metric, quotation or date**; the 42 prose figures are reported, never rewritten (R-A9).
- **No touching Sumeet's uncommitted files** (`.env.example`, the two admin-password files) or `docs/gtm/`.
- **No question to Sumeet about published content mid-round**; concerns go in the relay once, afterwards.
- **No new surface, page family or feature not named in this file.** Final round; scope is closed.

## 7. Open with Sumeet after this round

Whatever `CUTOVER-READINESS.md` §5 lists under his name, plus the go-live date. Nothing else should remain.
