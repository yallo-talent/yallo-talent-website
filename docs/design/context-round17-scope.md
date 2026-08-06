# Context — Round 17: the cutover closeout, and the Admin cockpit

**v1.0 · 6 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Standing rules: `context-round13-scope.md` §8, cited never retyped, **as amended by §1.1 below**.

Single session. Sumeet has ruled one port and one build, round 16 wrote that into `AGENTS.md`, and the territory split failed under his live direction in both rounds 14 and 15. This round expects live direction again, because it needs two credentials from him mid-flight.

---

## 1. Round 16 adjudication

`v24` read in full. It is the best relay of this build and it caught five errors of mine.

### 1.1 R-A9, ratified, and the §8.5 amendment it carries

**R-A9. Publishing decisions are Sumeet's.** Neither lens editorialises on what appears on the site, softens or defers a ratified instruction, or asks him whether he is sure. Where either disagrees with a commercial, positioning, tone or taste decision, it executes and says nothing.

**One carve-out, and it is his canon rather than a lens's judgement.** Where a lens believes a figure is factually wrong or unsourced, or that something is being written about a real named person which that person did not supply, it says so **once, in the relay, after the work is done**. Never as a question mid-task. Never as a reason to pause, soften or defer. Sumeet reads it or he does not.

**This amends §8.5.** The relay contract gains one line: a factual concern about published content belongs in the relay, after the fact, stated once. It does not belong in a mid-round question. `AGENTS.md` records R-A9 so a future session reads the rule rather than inferring it.

**How this was decided, recorded because the reasoning matters more than the rule.** Sumeet was asked to choose the scope and answered by doing it instead: he checked the 80% renewal figure against the renewal register and instructed execution. That is the shape. He verifies on his own evidence and the lens executes. The 80% ships exactly as written, and the cohort-and-window question I raised is closed by his check, not by his agreement with me.

### 1.2 My errors, five of them

| What I asserted | What is true |
|---|---|
| Azure DevOps at 48.7% is the highest ratio in the dataset | Highest in the **cloud family**. Salesforce Marketing Cloud is 60.3%, Oracle E-Business Suite 58.6% |
| 573 professionals hold Bedrock, Foundry or Vertex AI | 573 **declarations**. I summed three overlapping counts, which constraint 2 of my own dispatch forbade |
| "The Gulf" figures | Not a column in the extract. My numbers reproduce only under an unweighted mean of the Saudi and UAE ratios, verified across four figures, none of which reproduce pooled |
| Fourteen dist directories, 5.7 GB | Three, 405 MB. Eleven went with the worktrees round 15 deleted, and I carried the count forward without checking |
| Metric definitions are missing, the last cutover blocker | All four are written and render beneath their values |

Plus two slugs that do not exist: `data-ai` and `digital-devops`, corrected to `data-analytics` and `devops-platform-engineering`.

**All three conclusion corrections are accepted.** Each is a factual correction, so reverting any of them reintroduces a false claim. The 573 rewording to "declarations" reads as the stronger finding.

### 1.3 Accepted outright

| Item | Position |
|---|---|
| The flag comparison **inverts rather than flips**, so only the exact string `"false"` disables and an unset, blank or misspelt value lands on the on default | **Accepted, and better than the instruction.** The instruction said set the default true; this makes the default unreachable by typo. |
| `instrumentation.ts` gates the banner on `isProductionHost` rather than `NODE_ENV`, because `next start` sets `NODE_ENV=production` | **Accepted.** Gating on `NODE_ENV` would have excluded the one server the banner exists for. |
| No figure typed anywhere: `build-research-dataset.mjs` generates `dataset.ts`, and every ratio, headcount, comparison and superlative resolves through it, gate proven red by perturbing one value | **Accepted, and it is the correct answer to my own error class.** A derived superlative cannot drift; a typed one did, twice. |
| Emitting biome-formatted source so the pre-commit hook cannot rewrite the generated file into permanent gate failure | **Accepted.** A second-order failure caught before it happened. |
| The PDF refusing to write below five headings or 2,000 characters, because a blank PDF is a valid PDF | **Accepted.** |
| The empty `RESEND_*` keys being a **genuine** override with `""` rather than an apparent one, fixed in `mail-config.ts` for every machine rather than by deleting two lines on one | **Accepted, and it supersedes my instruction.** `??` does not fall back on an empty string, so Resend would have been asked to send from an empty sender. I asked for the one-machine fix. |
| `check-asset-case` reading `git ls-files` rather than the directory, because the filesystem is what hides the defect | **Accepted.** |
| Correcting its own bundle probe rather than the gate, having read the hydrated DOM instead of the server HTML | **Accepted.** Corrected before it was reported as fact, which is the standard. |
| Declining to change `api/cv`'s live sender as an adjacent fix | **Accepted.** An outward-facing address is not an adjacent fix. Ruled in §2.4. |
| Disclosing that it ran the forbidden redaction command shape, having printed no value | **Accepted as disclosed.** The prohibition was categorical for a reason and the boolean probe it moved to was right. No further action. |

---

## 2. Rulings new this round

### 2.1 The closeout goes first, because it is what cutover waits on

Three things from `v24` §7 are cutover-critical and small. They precede the cockpit so that if the cockpit consumes the run, nothing blocking the switch has been lost.

**The PDF drifts silently.** It is committed rather than built, so changing a figure in the extract moves every page and leaves the PDF behind until someone runs `pnpm research:pdf` against a running server. `check:research-dataset` does not catch it. **This is this build's signature defect in a new shape**, and the eleventh instance: a second copy of a value that no gate compares. Fix by regenerating and diffing in CI, so the PDF cannot disagree with the pages that produced it.

**`robots.ts`'s production branch has been reviewed, not executed.** `NEXT_PUBLIC_SITE_URL` is inlined at build time, so localhost only ever exercises the non-production branch. The `/downloads/` and print disallows are therefore read from source, never measured. **Build once with the production URL set and assert the real output.** A crawler directive that has never run is a claim, not a configuration, and this one guards a gated asset.

**Five gates and the Playwright specs did not run.** `check-crawlers` and `check-no-redirects` first, both cutover gates, then `check-motion`, `check-marks`, `check-estate` and the specs. `check-phase8` stays descheduled per R-A6.

### 2.2 The metrics block: one dated attribution line, not four labels

**Ruled, and Sumeet has delegated it.** Code chose to render the four definitions and hide `source` and `asAt`, reasoning that four repetitions of "Yallo internal record" look defensive while inviting a challenge that cannot be answered publicly.

**Right about the repetition, wrong about the conclusion, so neither of the two positions we were arguing wins.** One compact line beneath the block, naming the delivery, shortlist, placement and programme records once, with a single "as at" date. Not four labels, and not silence.

**Why the date is not optional.** Canon requires a visible source, game plan §10.1 requires an explicit "as at" date, and the Phase 1 benchmark's central finding was that every firm in the category publishes claims nobody can attribute. A dated first-party number is the one proof asset the competitors do not have. Four defensive labels would have been worse than none; one dated line is the differentiator.

**`asAt` does not move to the go-live date.** Moving it would assert the figures were pulled then. Re-pull all four at cutover and set it to the real pull date; if they cannot be re-pulled, `2026-07-30` stands and reads as a month old, which is normal.

**The refresh owner ships as the role, "Head of Talent Acquisition", not a personal name.** Niharika has not made that quarterly commitment and it is not mine to record against her. Sumeet may replace it with her name in one line.

### 2.3 The Admin cockpit

**Ruled: one custom cockpit.** Not a third-party editor beside a separate viewer. Sumeet has twice said he wants one place, and the answer to a sprawl complaint cannot be another surface.

**Route `/admin`.** Three panes.

**Auth.** Auth.js v5 per the golden path. A single admin identity, credential supplied by Sumeet. No public sign-up, no second account until one is actually needed. The session is server-side; **no credential and no token ever reaches the browser bundle.**

**Pane 1, Briefs. Read only.** `submissions` rows, newest first, with endpoint, source, delivery status and payload. No delete. This replaces the round 14 ops script as the thing consulted when Resend has failed.

**Pane 2, Conversations. Read only.** `assistant_transcripts`, the newest snapshot per `transcriptId`, viewable as a conversation. No delete: the purge owns deletion, and a second deletion path would race it.

**Pane 3, Case studies. Read, create, reorder.**

- Lists what exists in `content/case-studies/`.
- Creates new ones through a form matching the frontmatter schema in the content authoring guide.
- **`clientPublic` defaults to `false` and requires an explicit tick**, with the consent rule stated in the interface. That is Sumeet's own canon: it stays `false` until written consent to name the client and use their logo is on file.
- **The form never prefills, generates or suggests content.** No invented client, metric, quotation or date, and no placeholder that could be published by accident.
- **Reordering needs an explicit `order` field** on the frontmatter schema, because order currently falls out of the directory and dates. Derived in one place, rendered from that one place, and a reorder rewrites `order` across the affected files in a single commit.

**Writes go to the repository, not to a database.** Case studies stay files, because the authoring guide justified that on search performance, reviewability and having no vendor, and moving them into a database abandons all three and needs a migration. The cost is that publishing triggers a rebuild rather than appearing instantly, which is the right trade for a site whose articles are its organic engine.

**The cockpit validates before it commits, using the same schema CI validates against.** That is what makes a direct commit acceptable: the check has already run. If branch protection refuses the token, **report it, do not work around it.**

**The write credential is a fine-grained GitHub token with contents write on this repository only**, server-side, never in the client bundle. Scoped to `content/` if the platform permits path scoping, so a compromised cockpit can publish a bad case study and cannot reach application code.

**`check-admin-isolation`, a new gate, proven red.** `/admin` and everything beneath it absent from `sitemap.xml`, absent from `llms.txt`, absent from the generated assistant corpus, disallowed in `robots.ts`, and linked from no published page. **The corpus is the one that will be forgotten**, because it is generated from `src/data/**` and `content/**`, and an assistant that can describe the admin surface is the failure mode.

**`/privacy` states that a named administrator can read conversations.** Retention alone is a different statement to a visitor than "a person at Yallo can read this". Taken as a factual statement about data handling rather than a positioning choice, and logged for Sumeet's veto.

**Stop condition, because this is the largest single item of the build.** If the run is exhausted, **ship the read panes complete and relay the write pane unstarted.** A cockpit that reads is immediately useful. A half-built write path that commits to `main` is not.

### 2.4 The tail

- **`api/cv`'s sender aligns to `brief@yallo.co`** unless `bench@yallo.co` is deliberate, which Sumeet has not said it is. Code was right not to treat a live sender as an adjacent fix.
- **`radwell`'s row retires from `clients.yaml`.** The asset is absent, `hasLogoAsset()` already drops the entry, so nothing breaks either way, and a named row with no asset is a hand-maintained claim with nothing behind it.
- **The two empty `RESEND_*` lines stay.** `mail-config.ts` now treats blank as unset, so they are inert on every machine rather than one.
- **Local `RESEND_TO` stays as it is.** Harmless now, and Sumeet's if he wants it changed.
- **`docs/gtm/platform-employer-signals-2026-08-02.md` stays untracked.** Not Code's to file, and Code was right to leave it.

---

## 3. Forbidden this round

- **No Phase 8 work and no Phase 8 measurement.** R-A6, unchanged. It resumes after cutover on field data.
- **No question to Sumeet about published content.** R-A9. Factual concerns go in the relay, once, afterwards.
- **No prefilled, generated or suggested case-study content** in the cockpit form, and no invented client, metric, quotation or date anywhere.
- **No delete path** for briefs or transcripts. The purge owns transcript deletion.
- **No second account** on the cockpit, no public sign-up, and no credential or token in the client bundle.
- **No workaround if branch protection refuses the write token.** Report it.
- **No moving `asAt` to the go-live date.** §2.2.
- **No personal name as the metrics refresh owner.** §2.2.
- **No widening of `briefFormSchema`'s `region` enum**, and no `Person` schema beyond the four authorised fields. Unchanged.

---

## 4. What Sumeet supplies mid-round

Code pauses once and asks for both together, rather than twice:

1. **A fine-grained GitHub token**, contents write, this repository only.
2. **The admin login** he wants.

Code reports exactly where each goes and never echoes either.

Also outstanding and not blocking: **the heading fade on `/permanent` and `/contract`**, which he has not yet been able to check, and **R-AI3**, still awaiting his veto, now that the research cites scarcity throughout while `/ai-talent` may not.
