# Code to Chat — session B, content, data and IA

**v2.0 · 2 August 2026 · branch `feat/content-depth`, cut from the merged platform round**
Succeeds `docs/relay/code-to-chat-capabilities-v1.1.md`. Answers
`docs/design/context-round3-rulings.md` §1, §3 and §5, and
`docs/design/context-finance-depth.md`.

Eight commits, `cbb2c1b` to `80cd564`. Everything below was measured on a dev
server on port 3002 with its own `NEXT_DIST_DIR`, and the branch builds: 234
static pages, `pnpm typecheck`, `check:terms` and `check:taxonomy` clean.

---

## 1. Something you should know before anything else

**Both source documents the brief named were missing from this branch.**
`context-finance-depth.md` and `context-round3-rulings.md` existed only as
uncommitted files in session A's working folder. I read them there, copied them
into this worktree and committed them with the finance work, so the branch now
carries its own source. If A commits the same bytes there is no conflict; if A
has edited the rulings document since, mine is the 2 Aug copy.

The third path the brief named, `capabilities-v2.0.md`, was this file waiting to
be written rather than a missing input. It is the v2.0 successor to
`code-to-chat-capabilities-v1.1.md`.

The P0 was very nearly reported as blocked on that basis. It is worth knowing
that the handover mechanism, not the content, was the near miss.

---

## 2. What shipped

### 2.1 `/industries/finance`, the P0 — `cbb2c1b`

Nine authored functions replacing twenty dead ends. All nine L2 routes return
200, the retired slugs 404, and the grid renders nine cards with nine distinct
hrefs.

**Kept and mapped, seven:** core banking, digital channels and onboarding,
payments, treasury, risk, lending, insurance.
**Folded in, four:** cards-issuing into payments; investment-banking into
treasury and capital markets; kyc-aml and reg-compliance into risk.
**Removed as out of domain for the five platforms, nine:** wealth, fs-crm,
fpna, finance-ops, data-ai-fs, cybersecurity-fs, procurement, hcm-fs,
it-infra-fs. The last two of those live on capability desks and are cross-linked
rather than restated.

No retired title survives as an empty card. A card with no `tools` is exactly
the dead end this commit existed to remove.

Hero `sub` promised "wealth" and the expertise heading claimed "every finance
function area". Both rewritten, and neither states a count, per R21.

**Backbase is flagged and not built**, as §2.3 asks. It is genuinely widespread
in Middle East banks and would sit naturally in digital channels. It is outside
the five platforms you named, so it is a one-line addition whenever you nod.

### 2.2 The tenth AI role family — `be3eb89`

"AI Data Engineer, retrieval and RAG pipelines", authored to the full depth of
the nine. Retrieval ownership was **moved** out of the Prompt and LLM Engineer
rather than duplicated: the design and pipeline claims left, and telling a
retrieval fault from a prompt fault stayed, because that diagnosis is the join
between the two roles rather than either one's property.

Estate overlay re-checked and measured on the rendered DOM, not reasoned about:
experience 3, orchestration 5, models 5, data 4, systems of record 2, evaluation
rail 4, governance rail 2. No band carries most of ten.

### 2.3 The contract-perm badges — in `cbb2c1b`

Verification, as §5.4 asks, and the answer is short.

| Desk | Badged role | Grade | Action |
|---|---|---|---|
| Finance | nCino Loan Origination **Specialist** | wrong | **moved** to Oracle FLEXCUBE Solution Architect |
| Government | Bentley Systems Infrastructure Lead | correct | none |
| Healthcare | Salesforce Health Cloud Solution Architect | correct | none |
| Manufacturing | Siemens Teamcenter PLM Architect | correct | none |
| Retail | Retail Assortment Planning Lead | correct | none |
| Telco | Salesforce Communications Cloud Architect | correct | none |

One badge per desk, five of six already right. **No desk lacks an architect- or
lead-grade role**: every one carries four or five, so the data question §5.4
anticipated does not arise.

### 2.4 Cloud & Infrastructure against DevOps — `d9bc82d`

One line on each L1 naming the split in the site's voice, and eleven peer links
between the six shared sub-desks. `twin` is an array because the mapping is not
one to one: DevOps holds observability and reliability as one desk where Cloud
runs them as two.

### 2.5 The rest — `174d995`, `85a1f1f`, `5e58f10`, `61bada9`

- **Informatica's support line.** It was missing from the taxonomy index
  entirely, which is why its row was the only bare one in the panel. All seven
  platform rows now carry a line, verified in the open menu.
- **Platform return cross-links.** Seven one-way links reciprocated; re-measured
  after, zero unreciprocated pairs remain.
- **Blue Yonder's roles.** Authored titles now beat the generics they duplicate,
  by suffix containment rather than a hand-maintained list. Zero generics with a
  specific twin remain in any published bench, down from four across three
  platforms.
- **Twenty retail screening bands**, each anchored on that function's real
  failure mode. Twenty pages, twenty distinct paragraphs, verified on the DOM.
- **`/ai-talent` sub-nav.** Not blocked after all: `L1SubNav` was already
  exported and on the branch. Six sections, sticky at top 64px inside 6,018px of
  travel.

---

## 3. Three things I did differently from the brief, and why

**Engagement bands are unchanged.** §5.5.4 asked for Screening *and* Engagement
to differ per function. Screening now does. Engagement is the four commercial
models in canon §7, and those do not vary by function: the same contract,
permanent, EOR and managed-delivery terms apply whichever desk you brief. Making
them differ would mean inventing distinctions that do not exist, so that half of
the sameness is correct and stays.

**The fourth orphaned capability area is named, not ported.** Of the four, three
already have better homes in the role families. The fourth, Data Science, is
genuinely absent from all ten families and all seven Data & Analytics cards, and
it is still not ported: all seven of those cards carry `tools`, so a card without
them would be the page's only dead end and would reintroduce the finance defect
on the same day it was fixed. There is no ratified source for a Data Science
desk's products and roles. **This needs one authored desk from you, the same
shape as the finance document, and then it lands as an eighth card.**

**Three boundary crossings into session A's files**, all additive, none touching
CSS, and A had touched none of these files on its branch when I wrote them:
`L2Twin` in `L2PageShell` (§2.4 has no other way to express a sub-desk link), a
fourth rail in `L1ReadNext` (see §4.2), and `fn.screening` threaded into the
screening band. Plus one data-only fix in `src/lib/routes.ts`.

---

## 4. Findings you did not ask for

### 4.1 Every L2 on the site over-claims the headline metric

The L2 hero reads **"contractors, deployed in 72 hours."** Canon §6 publishes
"72h Brief to shortlist (three screened candidates from a complete brief)".
Shortlisted in 72 hours and deployed in 72 hours are not the same promise, and
the second is the one a buyer would hold us to. It is hardcoded in
`L2PageShell.tsx:103`, so it is on every L2 on the site. Session A's file and a
copy decision, so I have not touched it. **Recommend it changes before the DNS
switch.**

### 4.2 A silent-drop bug that ate four authored cross-links

`L1ReadNext` bucketed `related` into exactly Industry, Platform and Capability.
Anything else fell through the if/else and rendered nothing while still reading
as a shipped link in the data file. I found it by adding an "Intelligence" entry
to finance, going to verify it, and finding it absent.

Measured rather than patched at my own instance: four links in two files, three
of them "Blueprint" entries on Testing & Quality Engineering, authored and inert
since they were written. Fixed with a fourth rail rather than by deleting four
deliberate links.

### 4.3 `NEXT_DIST_DIR` rewrites `tsconfig.json`

`next dev` with a custom dist dir adds `.next-b/types/**` to `include` and
reformats the whole file. It is a shared file, so in a two-session round it is a
conflict waiting to happen. I kept it out of every commit. **Worth a line in
AGENTS.md next to the `NEXT_DIST_DIR` guidance.**

---

## 5. Open questions for you

1. **Backbase**, per §2.3 of the finance document. One entry in digital channels
   whenever you nod.
2. **A Data Science desk** for Data & Analytics, per §3 above. Nine products and
   their roles is all it needs.
3. **Finance still names platforms outside the ratified five**, outside the
   expertise grid where the restriction was applied. The scarce-roles rail
   carries nCino, Actimize, PSD2 and Onfido/Jumio; the segments panel carries
   Backbase, Kyriba, Duck Creek, Calypso and others. Those sections were not in
   the ratified scope so I left them, but the page now argues for five platforms
   in its hero and grid and something wider a screen further down. **A sweep is a
   small job; it is a decision rather than a defect.**
4. **The finance segments panel still lists sixteen segments**, five of which are
   function-shaped rather than customer-shaped and mirror functions the ruling
   just removed: Procurement & Vendor Management, IT Infrastructure & Operations,
   FP&A, Data & AI, Cybersecurity. Same call as above, and the same reason I did
   not act on it.
5. **`ai-data-engineer` has no blueprint archetypes.** The three archetypes carry
   no AI or retrieval content to check an association against, and the type is
   explicit that none may be invented to fill the band. Empty renders nothing.
6. **LlamaIndex moved** from "Agent and orchestration frameworks" to "Retrieval
   and vector stores". It is a retrieval framework first and it is the tenth
   family's most obvious tool, and the move is also what keeps the orchestration
   layer off six of ten. It does have agent features, so this is a judgement and
   it reverses in one line.

---

## 6. For session A

- Three additive crossings into your files, listed in §3, each commented at the
  site of the change with the reason and the measurement.
- `src/lib/routes.ts` gained a `/capabilities/{cap}/{fn}` branch. The sector
  equivalent had been there since the cross-links went data-driven; the
  capability one had not, so every capability sub-desk href fell through to the
  permissive default and was never checked.
- `.claude/launch.json` gained a second configuration, `yallo-talent-b`, on port
  3002 with its own dist dir. Yours is untouched.
- The `tsconfig.json` hazard in §4.3 affects you too.
- No rebase was needed and none was done. Nothing was staged with `git add -A`.
- **One design-gate finding on your side, left for you deliberately.** The
  Impeccable hook flags `.heroGrid` in `L2PageShell.module.css:89` as a
  decorative grid-line background, the generated-UI tell. I did not touch that
  stylesheet on this branch and I have not suppressed the rule. Reading it, it
  looks like a false positive against a decision already taken and documented in
  place: canon §5's North Star is the site as the screening artefact, which makes
  a measurement grid the one texture that is load-bearing here, and it runs at 3%
  alpha behind a radial mask. The comment also records that an earlier opaque
  version was a real defect and was fixed. Your file, your call, and it needs
  Sumeet's word before anyone adds an ignore.
