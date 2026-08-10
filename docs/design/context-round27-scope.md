# Context - Round 27: live defects, then handover hardening

**v1.1 - 10 August 2026 - Chat lens - Project GTM.01**
Authority: subordinate to canon as amended and `context-round26-scope.md`. v1.1 reprioritises around three defects Sumeet hit in live use on 10 August (screenshots on file) and puts them ahead of the v1.0 items. Time box: about one hour of Sumeet's attention; strict priority order, stop between items.

## 1. New rulings, 10 August morning

**R-27.5 - P1, the live render error.** Opening a published case study in the cockpit shows "An error occurred in the Server Components render" (digest omitted in production). Reproduce against the exact failing row (`/admin/case-studies/13f9964d-fb36-4002-901b-03782ee0c8de`); if it does not reproduce locally, pull the digest and stack from the runtime logs (`doctl apps logs 4bfc47a0-89de-479c-91cc-cc7e36b383bf --type run`). Do not guess the layer; measure. The gates were green because the fixtures do not match the failing row's shape - so the fix ships WITH a fixture that matches the failing shape, and `check:admin-render` gains that fixture so the class cannot return silently. The editor visibly works despite the banner; the error is still a P1 because Raphy inherits this surface today.

**R-27.6 - The preview is a proper preview.** The side-by-side pane currently renders the real template clipped: at the 1280 setting the page overflows the half-width pane and text is cut at the edge. Rule: the preview renders the signed preview URL in an iframe at the TRUE viewport width for the selected size (360 or 1280) and is scaled with a transform to fit the pane, so the writer sees the whole page smaller, never a cropped page. Add "Open in new tab" on the signed preview URL beside the size controls. Assert: no horizontal clipping of the previewed document at either size, both themes.

**R-27.7 - Surface hierarchy in the cockpit.** Sumeet's words: a mix of white and grey so you can see what's what. Rule: the cockpit page ground takes the design system's grey paper tone; the writing canvas is a white card with a visible border; the preview pane and the drawer carry their own distinct grounds with labelled headers; the sticky rail is visually separate from the canvas. Both themes, tokens only, no new hex. Measured: `check:admin-render` and `check:contrast-render` green across the editor templates, and the impeccable pass re-run on the two editor templates to zero critical and high.

## 2. Carried from v1.0, behind the new items

**R-27.2 - `/admin` gets its own root layout.** No public nav, no assistant launcher (both visible in today's screenshots over the cockpit), cockpit-native theme control, `x-robots-tag: noindex` retained and asserted. The 1280 overlap gone, proven by `check:admin-render` and `check:interaction`. Sequence this WITH R-27.7: they are one visual change to the same shell.

**R-27.1 - `ops` joins `briefsWrite`.** One line in `CAPABILITY_ROLES`; the hand-maintained `e2e/roles.spec.ts` matrix and spec matrix updated deliberately; `check:funnel` gains: ops writes a pipeline state, ops still refused content, conversations and users, capture row untouched.

**R-27.3 - Migration discipline.** (a) `AGENTS.md` gains the instruction: the deploy runs no migrations; `pnpm db:migrate` runs against the production database BEFORE any migration merges. (c) Prove it with `0008`, an index on `assistant_transcripts.origin_path`, applied out of band, `_migrations` row verified. (b) The app-spec pre-deploy job attempt is DROPPED from this round for time; carried as an open item.

**R-27.4 - The pull-quote ignore**, narrowest form per v37 §6a, rationale and reversal in `.impeccable/IGNORES.md`.

**The /jobs host-hop investigation** (v37 smoke observation): measure where the 301 to `www` originates via response headers; repo-origin means fix to one canonical host, infrastructure-origin means file with evidence for Raphy and touch nothing. Droppable if time runs out.

**Deferred unchanged:** the safety-net email job.

**Merge and deploy delegated**, extending R-26.4 on the same four conditions, including one smoke assertion only the new build can satisfy. Any condition fails: stop, branch pushed, no merge.

## 3. Forbidden

- No content rows or leads touched beyond fixtures; the failing row is read, never written.
- No scope beyond §1 and §2. No em dashes. UK English. Canon vocabulary. No new runtime dependencies. No new raw colour values; tokens only.
- No weakening of any gate.

## 4. Relay

`docs/relay/v38.md`, the standing shape: shipped | not reached | retractions (required even if empty) | delegated decisions + reversals | open items with unblocking questions | risks | HEAD, gate exit codes, deploy id if merged. Priority is strict: R-27.5, then R-27.6, then R-27.7 with R-27.2, then R-27.1, then R-27.3(a)(c), then R-27.4, then /jobs. Stop between items; ship what is green.
