# Context — Round 16: one build, the research family, and what cutover now waits for

**v2.0 · 6 August 2026 · Chat lens · Project GTM.01**
Supersedes v1.0 of this file in place. Sumeet ruled on eight open items on 6 August; three of his rulings reverse decisions I had taken on his behalf, and one removes an entire round from the critical path.
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Standing rules: `context-round13-scope.md` §8, cited never retyped. §8.3 and §8.5 unchanged.

---

## 1. Sumeet's rulings, 6 August

| # | Ruling | What it reverses or changes |
|---|---|---|
| R-A1 | **The assistant ships on and stays available on the site.** | Reverses the ratified ships-dark-through-cutover position. `NEXT_PUBLIC_ASSISTANT_ENABLED` becomes `true` as the **committed** default. |
| R-A2 | **One database. No second local database.** | Reverses my §2.1 ruling in v1.0 of this file. He accepts that real and test briefs will mix, and will revisit if the outcome differs from expectation. |
| R-A3 | **The five research pieces publish, live, with the right linkages**, on my drafted conclusions. Amend after go-live if anything reads wrong. | Overrules three sessions' correct refusal to build without his ruling. The refusals were right at the time; the ruling now exists. |
| R-A4 | **One PDF lead magnet** alongside the five pieces. | New scope. |
| R-A5 | **A full Admin cockpit**, including adding and reordering case studies, viewing brief submissions and viewing chat history. | Reverses my round 14 ruling that lead data gets an ops script rather than a UI. Round 17. |
| R-A6 | **Cutover waits for the research pieces live and the cockpit working.** The Phase 8 lab miss is accepted. | **Removes Phase 8 engineering from the critical path.** |
| R-A7 | `Absolute Labs.png` deletion was intentional. | Removes round 15's prohibition on it. |
| R-A8 | He will set `secrets.DATABASE_URL` himself. | Closes the nightly-purge-failure risk. |

**The consequence that matters most.** Phase 8's two remaining causes, render-blocking CSS and font delivery, were the expensive work and they are now post-cutover. That releases round 16 for R-A3 and R-A4, which are on the path.

**Round 16 runs single-session.** Two sessions require two dist directories and two ports, which is the thing Sumeet asked to end. His own instruction forbids the split, which also retires the territory rule that failed under live direction in rounds 14 and 15.

---

## 2. Rulings new this round

### 2.1 One build, one port, no flag branch at all

**R-A1 dissolves the problem rather than working around it.** v1.0 of this file ruled a local `.env.local` override because the committed default had to stay `false`. That constraint is gone. Set the committed default to `true`. There is then one build shape, one port, and no configuration in which Sumeet sees something different from what ships.

**Consequences to handle rather than discover:**

- `check-assistant-bundle` asserts the assistant contributes nothing to the initial payload. With the flag true this is no longer satisfied by tree-shaking; it must hold because the island is deferred. **Re-run it and report the real numbers.** If it now fails, that is a finding about the deferral, not a reason to loosen the gate.
- `/privacy`'s assistant section is gated on the flag. It now renders always, which is correct, because the assistant now always exists.
- The five assistant gates required a flag-on build to run. They now run against the ordinary build. Simplification, not a change in what they test.
- Whatever gets measured for performance is now the shipped configuration. Nothing to tear down.

**R-A2: one database.** Do not create a second. Sumeet has accepted mixed real and test rows. **Keep one thing from the discarded ruling: a loud non-production startup warning** that the database and mail targets are live, so a stray submission is deliberate rather than accidental. **[REC]** point `RESEND_TO` at Sumeet's own address in local `.env.local` only, which he has not ruled on and which costs nothing to leave until he does. A stray row is noise; a stray email into the business is a different nuisance.

### 2.2 The build-directory sweep, and disposition

Unchanged from v1.0. Fourteen `.next-*` directories, 5.7 GB, all gitignored, all regenerable, none referenced. Sweep all but the current one.

`AGENTS.md` amendment: the single-session default is one dist directory and one port, the per-session convention stays documented for any future parallel round, and **any session that creates a per-session dist directory deletes it at the end of its round.** The convention was never wrong. Nothing ever required cleanup, and that omission is the whole cause.

### 2.3 The research family: five pieces, published, plus one gated PDF

**Route shape**, per `context-round14-research.md`: `/intelligence/research/{slug}`, slugs reusing the existing platform and capability slugs so a piece and its desk are one concept rather than two.

**The five conclusions are below, verbatim, because they exist nowhere in the repository.** Every figure is carried from round 14's brief §2, measured from the LTI extract on 3 August. The analysis is Yallo's, which is both the licence mitigation and the quality bar. **Do not restate LinkedIn's tables.**

**1 · SAP** (`sap`). The pool is weighted toward the phase that ends rather than the phase that persists. Data migration is the largest named skill at 27.4%, highest in the UAE at 32.1%; security is thinnest at 11.0%. The regional market has declared its skills around go-live events. A rollout can therefore staff its migration workstream from the pool and will struggle to staff its security workstream, and security is the line that gets cut at business-case stage. Integration running 4.3 points higher in the Gulf is consistent with a region that bought a lot of platforms and then had to join them.

**2 · Oracle** (`oracle`). The one family where the Gulf is the deep end of the corridor at 45.3%, with Financials 8.4 points higher and Fusion 6.5 points higher. Depth is not evenness: inside that comparatively strong pool, Payroll is the scarcest named skill in the whole set at 103 professionals across all three markets. Payroll is also the workstream that cannot slip, because it is legally dated and touches every employee. For a Fusion programme in the Gulf: staff finance locally, treat payroll as a corridor role from day one. That is the same friction the EOR pillar exists to remove.

**3 · Salesforce** (`salesforce`). Not scarcity, absence. Sixty-five professionals in Saudi Arabia is a roster rather than a market, and Commerce Cloud at zero means a Saudi commerce programme has no local starting point at all. Any Salesforce programme in Riyadh is a corridor programme by arithmetic. The planning question is not whether specialists come from outside, it is whether the mobilisation plan admits that at business case or discovers it at week six.

**4 · Cloud and DevOps** (`cloud-infrastructure`, cross-linking `digital-devops`). The one layer where declared skills are genuinely broad: Azure DevOps Services at 48.7% is the highest ratio in the dataset, AWS 45.5%. A pool that broad is a poor filter, which moves the entire burden from sourcing to screening. The GCP finding deserves its own paragraph because it contradicts the received assumption that the Gulf is Azure-first: 19.1% in Saudi Arabia against 10.4% in the UK. State honestly that LTI's net here spans two desks.

**5 · AI and data** (`data-ai`). The distance between a title and a tool, stated twice. 128,813 data professionals with Databricks at 3.6% says the market has data people, not data platform people. The AI figures are the sharper version: 573 professionals across three markets hold any of Bedrock, Foundry or Vertex AI, each under 1% of a 22,853 pool. That number replaces the adjective in "the AI talent nobody else can find". For AI work the pool is small enough to be a named-individual exercise rather than a funnel.

**The PDF lead magnet (R-A4): the cross-market synthesis.** The corridor runs both ways. Oracle is deep in the Gulf and Salesforce is deep in the UK, so the two ends specialise rather than one being short. That is more defensible than scarcity alone and harder for a competitor to copy.

**Gating, per the discoverability brief §4.3.** An ungated summary layer is retrievable and the quantities sit behind the gate. A fully gated asset cannot be cited at all, and a citation with no numbers still names Yallo. So: the five pieces publish open; the PDF is gated behind the existing capture layer, with an ungated summary of its argument on the page.

**Generate the PDF from the same content source as the page**, not by hand. A hand-made PDF is a second copy of every figure, and this build's signature defect is the second copy.

**Four hard constraints, three from round 14's brief §1 and one new:**

1. **No compensation or rate figure anywhere**, in any piece or the PDF. The corpus contains none, and canon bans rates on the public site regardless.
2. **No pie or stacked charts.** The skill counts overlap and can exceed 100% together, so those chart types would assert a false whole.
3. **No time-to-fill or "hardest to hire" claim.** This is supply-side data. It says nothing about demand.
4. **New: the Salesforce piece must read as why mobilisation planning matters, never as a verdict on Saudi Arabia.** Yallo sells into that market. The finding stays as it is; the framing is "this is what a programme plan has to account for, and it is why the corridor exists", not "there is no talent there." Same discipline for any market a piece finds thin.

**Linkage, since R-A3 specifies it.** Reachable from the Intelligence navigation and from `/intelligence`; present in `sitemap.xml` and `llms.txt`; the per-page OG image generated by the same PetalPlate route as everything else; each piece cross-linked to its platform or capability desk and each desk to its piece, derived from the shared slug rather than hand-linked.

**The corpus grows, so the assistant changes.** `corpus.ts` is generated from `src/data/**` and `content/**`, so five new pieces enter what the assistant can cite. **Re-run `check:assistant-refusal` and `check:assistant-grounding` after they land**, and confirm the refusal suite still holds on rate questions now that the corpus discusses scarcity at length. That is a new adjacency, not a formality.

### 2.4 Metric definitions: report, so I can draft them

Sumeet does not know what this asks of him, which is a failure of how it has been put to him rather than an open item on him. **Report the current headline metrics block verbatim** — every number, its label, its stated source, its `asAt` date, and the file it lives in. I draft a definition, a date and a proposed refresh owner for each, and he approves or corrects. That converts the last cutover blocker from something he authors into something he ticks.

### 2.5 Phase 8, descheduled

**No Phase 8 work this round, and no measurement either.** R-A6 accepts the lab miss and the two remaining causes are the expensive ones. It resumes after cutover, when field data from real Chrome users exists and the argument can be made from that rather than from a throttled emulator. `docs/status/PHASE8-BASELINE-r15.md` stands as the record.

### 2.6 The gate defects and the tail

Both gate defects are the class this build keeps paying for and both still get fixed.

- **`check-gate-coverage.mjs` over-credits `check-a11y`.** `listOf()` tests `fetchPublishedPaths(` before `sampleOnePerShell(`, and `check-a11y.mjs` contains both, so the line added for it never runs and it is credited with every published URL instead of its per-shell sample. True only by coincidence today. Reorder it.
- **`check-assistant-terms` reports green on the error path.** It printed three sampled replies clean when all three were the 502 error string. **It fails, it does not warn.** A gate that never reached the model and asserts a clean result is worse than a missing gate.
- **`build-logos.mjs:86`'s comment** names `BlueYonder.png` where the map reads `BlueYonder-icon.jpeg`.
- **The case-collision check.** On macOS `Informatica.png` and `informatica.png` are one file, which is how worktree B silently overwrote the client wordmark with the platform icon. Fail on two source filenames differing only by case.
- **`Absolute Labs.png`** now gets removed, per R-A7, from the asset folder, `build-logos.mjs`'s map and `clients.yaml` if present. All three, or it half-exists.
- **The two empty `RESEND_FROM` and `RESEND_TO` keys** in the main checkout's `.env.local`: delete the empty lines so the code defaults are unambiguous rather than apparently overridden by nothing.
- **`radwell.svg` and `capgemini.svg`** are committed vectors the script measures but never generates. Report what they are for; delete nothing.

### 2.7 The Admin cockpit: architecture ruled, spec pending

**Round 17, not this one.** Recorded here so round 16 does not accidentally foreclose it.

**Ruled: one custom cockpit, not a third-party editor beside a separate viewer.** Sumeet has now twice said he wants one place rather than several, and the answer to a sprawl complaint cannot be another surface. So: one login, database reads for briefs and transcripts, repository writes for content.

**Reasoning, and the cost.** Case studies live as files in `content/case-studies/` and the authoring guide justified that on search performance, reviewability and having no vendor. Moving them into a database to get instant publishing abandons all three and requires a migration. Writing files from the cockpit keeps every one of them, at the cost that publishing triggers a rebuild rather than appearing instantly. That is the right trade for a site whose articles are its organic engine.

**Reordering needs an explicit order field or a manifest**, because order currently falls out of the directory and dates. That is a content-model change, small, and it must be derived in one place.

**Four things round 17's spec has to settle before anyone builds:**

1. **Auth.** Golden path is Auth.js v5. A single admin identity, and the decision about who else ever gets one.
2. **The cockpit must not leak into any generated surface.** It is excluded from `sitemap.xml`, `llms.txt`, `robots.ts` and, most easily forgotten, `corpus.ts`, which is generated from the same trees. An assistant that can describe the admin surface is the failure mode.
3. **Transcripts are visitor conversations.** `/privacy` currently states retention. If a named administrator can read them, the copy should say so, because that is a different statement about the visitor's data.
4. **Writing to the repository from a web request** needs a credential with write scope. Where it lives, and what it can reach, is a security decision and not an implementation detail.

Per Sumeet's own rule, this gets an alignment pass on intent, scope and audience before a long spec exists.

---

## 3. Forbidden this round

- **No Phase 8 work and no Phase 8 measurement.** §2.5.
- **No second database.** R-A2.
- **No compensation figure, rate, pie chart, stacked chart, time-to-fill claim or hardest-to-hire claim** in any research piece or the PDF. §2.3.
- **No hand-made PDF.** Generated from the page's own source. §2.3.
- **No cockpit work.** Round 17, and it needs a spec pass first. §2.7.
- **No loosening of `check-assistant-bundle`** if the flag change makes it fail. Report the numbers; that is a finding.
- **No deletion of the credential backup directory**, which is Sumeet's once he is satisfied the main checkout is complete, and **nothing in `assets/client-logos/` except `Absolute Labs.png`**.
- **No widening of `briefFormSchema`'s `region` enum**, and no biography, specialism or contact detail for any named person. Unchanged.
- **No `Person` schema beyond the four authorised fields.** Unchanged.

---

## 4. Open with Sumeet after this round

1. **The metric definitions**, which I draft from §2.4's report rather than asking him to author.
2. **The R-AI3 amendment**, still awaiting his veto: `/ai-talent` may cite a sourced, dated scarcity figure; rates stay banned outright. Now more relevant, since the research pieces cite scarcity throughout.
3. **The cockpit spec pass**, per §2.7.
4. **The heading fade**, which Code pauses mid-round to have him check once the consolidated build is serving.
5. **Local `RESEND_TO`**, if he wants it pointed at his own address.
6. **A specialism and contact route for the five named leaders**, four of whom have no biography at all.
7. **The go-live date**, which needs Raphy, plus production `RESEND_FROM` and `RESEND_TO` with SPF and DKIM aligned, also Raphy.
8. **Deleting the credential backup directory** once he is satisfied.
