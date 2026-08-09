══════════════════════════════════════════════════════════════════
HANDOVER — GTM.01 Yallo Talent website, Chat-lens session continuation
Date: 2026-08-09, evening
Inheriting from: cutover weekend supervision — rounds 22 to 25b adjudicated, 25c dispatched
Mode: open fresh Chat session in the GTM.01 project
Compaction trigger: context window exhausted after a 2-day cutover-and-build run
══════════════════════════════════════════════════════════════════

0. FILE UPLOADS NEEDED
None. This project reads the repo directly over the yallo-talent-fs MCP mount
(/Users/sumeetgoenka/Claude/Claude-code/yallo-talent-website/). At session
start run list_allowed_directories, then read: docs/design/yallo-talent-CANON.md,
AGENTS.md, docs/design/context-cockpit-v3.md, docs/design/context-round25c-scope.md,
and the newest docs/relay/v*.md. LESSON FROM THIS SESSION: documents pasted
into chat sometimes arrive empty — when Sumeet says "Code's update pasted",
read docs/relay/ from the repo FIRST rather than asking him to re-upload.

1. WHERE WE ARE
- yallo.co is LIVE (cutover 8 Aug). Since 9 Aug it serves articles and case
  studies FROM THE DATABASE, no git copy, no PR in any content path — Sumeet's
  four rulings of 9 Aug, folded into canon by round 25. The flip was proven
  byte-identical (v35 §1, evidence committed under docs/status/round25b/).
- Cockpit state on main after PR #26 merges: four roles (owner/admin/editor/ops,
  env break-glass = owner), instant publish with 9 enforced refusals, the full
  TipTap editor with autosave/revisions/preview, dynamic sitemap + llms.txt.
- Relay ledger: v33, v34, v35 all adjudicated and accepted; the standing
  practices they created are in §5 below. Round 25c is DISPATCHED (prompt given
  to Sumeet 9 Aug evening; scope file docs/design/context-round25c-scope.md
  carries the v35 adjudication and rulings R-25c.1–3). Round 25c covers: SEO/GEO
  remainder, media library, /insights filters + 21 taxonomy landing pages,
  drag-and-drop ordering, unpublish guard, fixture-collision fix, stripper
  red-proof, dev-droplet firewall, Dependabot four.
- NEXT AFTER v36: adjudicate it, then scope ROUND 26 — briefs and conversations
  as the lead funnel. Spec seed exists: context-cockpit-v3.md §11 plus
  context-cockpit-v2.md Phase 2 (pipeline states, owner, SLA clock against the
  72-hour claim, Resend notification on arrival, conversations origin_path
  analytics, export). Audit log should ride with it (multiple real users soon).

2. NEW WORKSTREAMS THIS SESSION (LinkedIn estate + brand)
- Yallo Talent page (127K followers): fully rebranded EXCEPT the name — verified
  pages need a LinkedIn support ticket; Sumeet filed/was filing it. Watch for
  "did the rename land". URL now /company/yallotalent.
- Yallo AI Academy page: rebranded from stealth "Enterprise AI Skills";
  soft launch THIS WEEK, big-bang early September (cross-promo post from the
  Talent page is the planned amplifier). Academy has its OWN design system
  (dark, coral #ec7b63 / rose #c76d90, four-rounded-squares mark by Raphy) —
  deliberately NOT Talent's paper-and-gold. Both hexes and the wordmark
  typeface are PROVISIONAL pending Raphy's ratification. academy.yallo.co
  answered 503 all weekend — Raphy owns the holding page; the website field
  and soft-launch post wait on it.
- Brand pipeline: email signature banners regenerate from scripts/brand/ in the
  repo (committed, served at yallo.co/images/email/). The LinkedIn/Academy
  banner generators lived only in this session's container and ARE GONE —
  regenerate from design tokens if variants are requested; the shipped PNGs
  are in Sumeet's hands.

3. CANONICAL PATHS (repo-side; no Notion in this project)
docs/design/yallo-talent-CANON.md · DESIGN.md · AGENTS.md ·
docs/design/context-cockpit-v3.md (cockpit specification) ·
docs/design/canon-amendment-2026-08-09.md (the four rulings, folded) ·
docs/design/context-round25b-scope.md + context-round25c-scope.md ·
docs/relay/v33.md v34.md v35.md · docs/status/round25b/ (flip evidence) ·
scripts/brand/ (signature pipeline).

4. PENDING SUMEET ADJUDICATIONS (carry until he closes them)
1. Merge PR #26 (round 25b), then create the real accounts in /admin/users:
   his owner, Raphy admin, editors, ops. No session ever creates accounts.
2. Which of the 21 imported articles publish, if any. No session chooses.
3. Taxonomy values for the nine case studies (dropdowns exist; him or Raphy).
4. Shareable draft-preview URL: yes/no + expiry rules. Parked until ruled.
5. Dev droplet destroy-or-keep (25c firewalls it as interim).
6. eslint vs biome: deferred to design-system extraction, on record.
7. Verify the signature GIF URL answers 200 on production BEFORE any rollout
   email goes to the team (PR #27 constraint).
8. Veto window standing on: R-25b.1–7, R-25c.1–3, D25b-1–6, and the LinkedIn
   AWS/Azure/GCP platform strip divergence from site canon (flagged once, his).

5. GOVERNANCE POINTERS (standing practices accreted this weekend — bind Code
   prompts and your adjudications)
- R-A9: no editorialising on publishing decisions; factual concerns logged once.
- Capture a failing CI log BEFORE any re-run; a red is never re-run to green.
- NEVER capture an exit code through a pipe (v35 retraction).
- Retiring anything = the script + the package entry + every invocation by
  either name (v34 §8b).
- Ground commits go through round branches, never direct to main (v33 ruling).
- Fix classes, not instances; red-prove both directions; fixtures self-remove.
- /goal prompts: ≤3,800 chars measured by script, § symbols, no em dashes,
  provenance on every premise, ORDER OF WORK + DISCIPLINE + RELAY shape.
- Round files carry adjudication + rulings; the cockpit spec is never re-derived.

6. BEHAVIOURAL (Pattern A, this project's shape)
- You are Chat: canon custody, relay adjudication, round scoping, /goal
  authorship, brand assets, LinkedIn strategy. You WRITE to the repo over MCP
  ONLY for context/design docs into a quiescent tree; never code, never commits.
- Sumeet: "decide for me" means decide, one recommendation + the key trade-off,
  logged for veto. Corrections are absorbed plainly, no self-flagellation.
  AskUserQuestion only for batched consequential decisions. Lead with the
  answer. UK English. No em dashes anywhere, including artefacts.

7. IMMEDIATE NEXT ACTIONS
TRACK A (reactive — v36 lands): read docs/relay/v36.md from the repo; adjudicate
  with RETRACTIONS first, then the owed red-proofs (R-25b.4, R-25c.1, R-25c.2
  recipe outcome, R-25b.6 evidence, Dependabot table); then author
  context-round26-scope.md (briefs funnel per §1 above) and the /goal.
TRACK B (independent, can start immediately): Academy identity ratification
  nudge (hexes + typeface with Raphy); September big-bang content sequence for
  the Academy launch; Talent-page rename ticket status.
SEQUENCED: after round 26 ships, cockpit v3 is complete — open the design-system
  extraction conversation (GTM.02) and the saasinator/Academy site builds.

8. WHAT YOU'LL SEE AT SESSION START
(a) "Code finished, update pasted" → repo-first: read v36, adjudicate, next
    prompt. (b) Screenshots of the cockpit or LinkedIn → visual QA or asset
    work; regenerate assets from tokens, never eyeball-copy. (c) "Merged,
    accounts created" → round 26 scoping directly. (d) A Volcanic/Search
    Console screenshot → the 158-error job sitemap thread may resurface; its
    error class was never confirmed. (e) Anything about publishing an article →
    the publish path is live; content decisions are his, mechanics are yours.

9. ONE LAST THING
The relay discipline peaked this weekend — v34 and v35 both carried genuine
retractions and unfudged failure logs. That quality is the asset that makes
overnight autonomy safe; protect it by always adjudicating the RETRACTIONS
section first, because that is where the truth lives. Push.

══════════════════════════════════════════════════════════════════
END HANDOVER — 2026-08-09 evening
══════════════════════════════════════════════════════════════════
