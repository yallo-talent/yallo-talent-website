# Context — Admin Cockpit v2: design document

**v1.0 · 8 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `AGENTS.md` (R-A9).
Status: Phase 1 ratified by Sumeet 8 Aug (RBAC fully live, articles pane, batch publish, CI fast lane). Phases 2 and 3 are a roadmap pending his ratification, recorded now so the Phase 1 architecture does not foreclose them.

## 1. What the cockpit is for

The site's primary objective is lead generation and new customer acquisition for the Talent business. The cockpit is where site activity becomes pipeline: briefs are leads, assistant conversations are intent signals, articles and case studies are demand capture. Every pane earns its place against that objective; publishing mechanics are the means, not the point.

Standing invariants, unchanged from v1 and not negotiable in any phase: nothing in the cockpit writes `main` directly; every content change travels branch → PR → CI → auto-merge; validation runs before a PR opens; no deletion path for transcripts or briefs; the `X-Robots-Tag: noindex` and four-way admin exclusion stand.

## 2. Roles (Phase 1, ratified — model logged for Sumeet's veto)

| Role | Sees and does |
|---|---|
| **admin** | Everything: all panes, conversations, briefs, users. Sumeet. |
| **editor** | Articles and case studies only — full authoring lifecycle through the PR path. Raphy and pod. No briefs, no conversations, no users. |
| **ops** | Briefs, read-only (lead follow-up). No content panes, no conversations, no users. Talent Ops. |

Constraint carried from `/privacy`: the published clause says one named administrator can read conversations. The conversations pane is therefore **admin-only** in every phase, and `/privacy` copy is not edited by any session (R-A9 — Sumeet's).

Accounts are created by an admin in the Users pane. No session ever creates a real user row: never invent a person applies to credentials as much as copy.

## 3. Phase 1 — round 23, in build

RBAC live on Auth.js v5 with a `users` table (Neon Postgres); env-credential sign-in retained as break-glass mapping to admin; Users pane (create, disable, reset — admin only); Articles pane enabled with the full lifecycle; batch publish for ordering; CI content-fast lane. Full spec in `context-round23-scope.md`.

## 4. Phase 2 — lead-gen workflow (next, for ratification)

1. **Briefs become a pipeline, not a table.** Status per brief (new / contacted / qualified / closed), owner, timestamps. An SLA clock against the 72-hour shortlist commitment, visible per brief — the site's central claim, instrumented. Email notification on arrival via the existing Resend path. CSV export. The Vincere handoff stays manual until CORE.03; one Hub connector when CORE.02 lands (already ruled).
2. **Conversations as signal.** Aggregate `origin_path` (shipped in 0003): which pages start assistant conversations, weekly counts. Read-only analytics, admin-only, no new retention surface.
3. **Metrics editor.** `content/metrics.yaml` editable with `asAt` enforced on every change — a stale as-at date is refused, which operationalises the quarterly refresh rule (canon §6).
4. **Consent switchboard.** Client-logo `consentOnFile` and case-study `clientPublic` flags in one pane, so flipping consent when paperwork lands is one click, not a Code session.

## 5. Phase 3 — hardening and reach (later)

GitHub App replaces the fine-grained token (already a round 23+ candidate) · audit log of cockpit actions (who published what, when — becomes necessary the day a second real user exists, so it should follow fast behind Phase 1 in priority) · testimonial slot manager (renders nothing until all four fields are real, per canon §8) · Programme Staffing Blueprint gate + lead capture wired to the briefs pipeline · article scheduling · a traffic pane reading Cloudflare Web Analytics or GA4 once the consent-mode work ships · Search Console API read for the migration watch.

## 6. Explicitly out, all phases

No CMS vendor (the authoring guide's trigger rule stands — a git-backed editor only if a non-Code publisher needs one, and the cockpit is now that editor). No cockpit path that bypasses CI. No transcript deletion. No rate/fee data surfaced anywhere the editor or ops roles can see.
