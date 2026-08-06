# Context — Round 18: the rules nothing enforces, and the Why Yallo page

**v1.0 · 6 August 2026 · Chat lens · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md` and `DESIGN.md`. Standing rules: `context-round13-scope.md` §8, as amended by round 17 §1.1 (**R-A9**). Single session, one port, one dist directory.

**The theme of this round, stated once.** Sumeet reviewed `/why-yallo` in a browser and found four things. Three of them are the same defect: a rule that exists in canon, is claimed to be enforced, and is not. Banned vocabulary in an H1 with `check:terms` green. Orbs banned in `DESIGN.md`, killed once in round 14, back in a different file. A four-entity count typed rather than derived, now disagreeing with its own label. **In each case the gate comes before the copy, or the copy returns.**

---

## 1. Round 17 adjudication

`v25` read in full. Every open item ruled below. **None of this reopens.**

### 1.1 Accepted outright

| Item | Position |
|---|---|
| `check:robots` **parses rather than greps**, because `Disallow: /` and `Disallow: /api/` both contain the same substring and telling a blanket lockdown from a path exclusion is the one distinction the gate exists to make | **Accepted, and it is the sharpest gate design of this build.** A grep would have passed a total lockdown. |
| The robots policy moved to `src/lib/robots-policy.json`, read by `robots.ts` and by the gate, production origin moved with it | **Accepted.** Derived, one source. |
| The production robots branch measured for the first time: 15 named agents plus `*`, all four disallows, one sitemap line, proven red three ways | **Accepted.** It had never executed anywhere before. |
| The attribution line composed from the same `source` and `asAt` fields it names, with `metrics.ts` throwing at build if the four stop reducing to one line | **Accepted.** A derived sentence cannot drift from the data it describes. |
| **`check:metrics-attribution` found a real defect the moment it ran**, on seven `/platforms/*` pages: `"2:1"`, `"80%"` and `"72h"` published as first-party claims with no source and no date, typed into `src/data/platforms/why.ts` beyond the quarterly refresh, with a comment above the rail stating the reverse of the truth | **Accepted, and the comment is the lesson.** It said three figures were derived and one was a canon metric; the reverse was true, which is precisely how it survived review. Fixed by class through `publishedFigure()`. |
| The PDF gate using a size-plus-SHA and a whitespace-collapsed text fingerprint rather than a byte diff, because two runs of the same content produced two different SHA-256s | **Accepted, with the reasoning as the point.** A gate that fails every run teaches everyone to skip it, which is worse than no gate. |
| Stripping `<script>` before fingerprinting, because `body.textContent` includes the RSC hydration payload with the build id in it: 78,136 characters against 16,216 | **Accepted, and caught the right way.** Found by reading the character count before the gate was committed, not by watching it fail afterwards. |
| The route group `(cockpit)` so the layout `auth()` guard runs before any child renders or queries, with `/admin/sign-in` outside it because a sign-in page inside its own guard redirects to itself | **Accepted.** A pane added later inherits the guard by being in the directory, which is the structural version of the fix rather than the remembered one. |
| `pnpm admin:hash` with terminal echo off, scrypt, no plaintext anywhere; the verifier running both comparisons unconditionally so an unknown email is not measurably faster than the real one; auth config checked at call time so `next build` works without secrets | **All accepted.** The timing-leak point in particular was not asked for. |
| `check:admin-isolation` proven red six ways, including two that needed a rebuild | **Accepted.** |
| The corpus assertion sweeping `src/data/**`, `content/**` and `src/lib/assistant/**` and deliberately over-approximating, word-boundaried so `/privacy`'s new "administrator" sentence does not trip a gate looking for `/admin` | **Accepted.** §2.3 predicted this was the exclusion that would be forgotten; it got the most reasoning instead. |
| Killing a stale `next-server` occupying 3115 from a previous session, serving a stale build on the non-production robots branch | **Accepted.** Third round the standing rule has caught this. |
| `check:crawlers` retrying a refused probe once and printing that it did | **Accepted**, with its own caveat carried to §4: if that line appears every run, the zone is intermittently refusing an Agent crawler and that is a finding, not noise. |
| Declining to touch `.env.local` or echo any value from it | **Accepted.** |

### 1.2 The retraction, and the standing rule it earns

Code reported `check:type` at exit 0, truthfully, having run it **before** writing `src/app/admin/Admin.module.css` and never again after the round's last CSS change. CI caught a colliding duplicate `.signOut` declaration where the later block silently won at equal specificity, so the `4px 2px` written for the 24px target floor shipped nowhere. Real, not cosmetic. Fixed, re-run green.

**The rule this earns, and it applies to me as much as to Code:** a static gate run early in a round is not evidence about code written later. **The last file touched in a round is the one nothing has looked at.** Twenty-seven local gate runs missed it and CI found it, which is the one real finding CI produced all round.

Two perturbations that failed to perturb were also caught and re-run: a `perl` substitution missing because the sitemap is newline-separated between tags, and an `EXIT=0` that was `head`'s status after a pipe rather than the gate's. Both re-run properly, and every exit code in `v25` came from a directly captured status.

### 1.3 My errors

**The `order` frontmatter field, and this one would have undone a previous round.** §2.3 instructed an `order` field on the case-study frontmatter, on the stated premise that order falls out of the directory and dates. **The premise was stale.** `content/case-studies/order.yaml` already exists, `src/lib/case-study-order.ts` already enforces it, and that file's own doc comment records that a per-file `featured` integer was *replaced* by the manifest because reranking meant editing fourteen files. Adding the field back would have restored the defect a previous round removed.

**Sixth premise error of the same class**, after the two conclusion figures, the Gulf column, the dist-directory count and the metric definitions. All six share one shape: I asserted a fact about the repository or the extract flat, without measuring it, in a document whose whole purpose is to be authoritative. Code has caught all six. **Reordering uses `order.yaml`. The `order` field instruction is withdrawn.**

**Path scoping does not exist**, which §2.3 hedged with "if the platform permits" and it does not. GitHub fine-grained tokens have no path scope. Ruled in §2.4.

### 1.4 Where R-A9 worked, and it is worth recording

Code found **Wickes** in the identical position to Radwell: listed in `content/clients.yaml`, consented, no asset, silently dropped by `hasLogoAsset()`. §8.3's adjacent-fix policy would call that the same class and pull it into scope. Code did not touch it, reasoning that whether a client's name appears on the site is a publishing decision and extending a ruling about one named client to another by analogy is exactly the editorialising R-A9 forbids.

**That is R-A9 applied with judgement rather than literalism, and it is the correct reading.** R-A9 outranks §8.3 on anything that decides what appears on the site. Recorded so the precedent holds. Wickes is Sumeet's, one line either way.

---

## 2. Rulings new this round

### 2.1 The terminology lint has a hole, and a banned word is in an H1

**Measured from Sumeet's own screenshots of the served page, not from source.**

- **"operator" is live on `/why-yallo`** in at least three places: the section H2 "Operators who ran the programmes you're running", a table cell "Depth-tested by an operator who has run the role", and the card label "Richemont — Enterprise IT operator". It is on the standing banned AI-tell list in canon.
- **Em dashes are live**: "This is our operating rhythm — not marketing", "Specialist-led — the person who screened them stays involved", "Four entities — London, Dubai, Riyadh, Bengaluru".
- **`check:terms` reports exit 0 across 282 files.**

**So the gate that exists to enforce the banned list does not reach the copy a buyer reads.** Round 13 built em-dash checking into `check-assistant-terms` for generated output, and the sitewide lint either does not carry these rules or does not reach these data files. Either way the claim the gate makes is false.

**Ruling: the gate first, then the copy, in that order and in separate commits.** Fix the copy first and it will come back, because nothing stops the next round re-adding it. Specifically:

- **Diagnose and report why `check:terms` passed**, before changing it. Which files it reads, which it does not, and whether "operator" and the em dash are in its rule set at all. The answer determines whether this is a coverage gap or a rule gap, and they need different fixes.
- **The rule set derives from one source.** If canon's banned list exists as prose only, it becomes data that the lint reads, so the list and the enforcement cannot disagree.
- **Coverage is derived, not enumerated.** Every file that can produce rendered copy, discovered rather than listed.
- **Proven red on the real live instances** above, then green after the copy fix.
- **Expect a large first run.** If it finds many pre-existing instances beyond `/why-yallo`, fix every instance of these two rules and report the count. Do not narrow the rule to make the run small.

### 2.2 The glow: banned in `DESIGN.md`, killed in round 14, back again

**Sumeet's instruction is unambiguous: remove it from every page.** His words: it looks horrible, and it is on many other pages.

**This is the second recurrence.** Round 14 found `.heroBgA` and `.heroBgB` in `EditorialLayout.module.css` rendering as two radial-gradient orbs on nine surfaces, against `DESIGN.md`'s explicit anti-reference, with a round-8 comment claiming they had been deleted when only one rule had been touched. They were neutralised there. They are now on `/why-yallo`, which means a different file carries an equivalent layer.

**Ruling.**

- **Find every instance by sweeping for the technique**, not by fixing the page Sumeet named. Unbounded radial-gradient or large soft-glow background layers behind hero and band surfaces, wherever they live.
- **Remove them.** Not opacity-reduced, not conditional. `DESIGN.md` bans them.
- **Add a gate**, because a rule enforced by nothing gets re-added every few rounds and this is the second time. It fails on the technique in hero and band contexts, is proven red against the instances found this round, and names the file and rule.
- **Report the count and the files.** If the sweep finds instances on surfaces Sumeet has not seen, they are still in scope: his instruction was every page.

**One thing the gate cannot see, filed rather than fixed.** `check:contrast` is source-level, so it cannot detect text losing legibility against a gradient behind it, which is exactly what Sumeet's screenshot shows happening to the sub-line under the "Four numbers" heading. Removing the glow closes the instance. **A rendered-pixel contrast check is the class fix and it is not in this round.** File it with a severity.

### 2.3 The four-entity number disagrees with its own label

**Measured from the screenshot.** A card on `/why-yallo` renders the value **3** under the heading "Four entities — London, Dubai, Riyadh, Bengaluru". The label says four, it lists four, the number says three.

**This is the retired stat's leftover.** Game plan H3 retired "3 delivery regions" because it conflated supply with demand. Canon §1 fixes four entities, and the discoverability brief §5 requires the site to state them identically everywhere, derived from one source rather than hand-typed.

**Ruling: the value is 4, and it derives from the same single source canon's four entities come from.** Not typed. If no such single source exists in the data layer yet, create it, because the count and the list disagreeing is what happens when they are two separate literals. Sweep for any other statement of the entity count or the city list and derive those too.

### 2.4 The cockpit write pane: PR with auto-merge, and it is round 19

**The write pane did not start**, correctly, because no token arrived and Code will not report a commit path as working without watching it commit. **It is now the only thing between Sumeet and cutover**, and it is waiting on two values from him.

**Ruling on path scoping, since the platform does not offer it.** A fine-grained token cannot be scoped to `content/`. Code proposed enforcing the restriction in the cockpit's commit path and requiring a PR rather than a push. **Take both, and add the piece that removes the cost:**

- The cockpit **opens a PR and enables GitHub's native auto-merge**, so it merges when required checks pass and Sumeet does nothing in the happy path.
- The `content/` restriction is enforced in the commit path as well. A compromised cockpit holding the token could bypass it, which is why the PR exists: the restriction has CI behind it rather than only code.
- **CI therefore runs before anything publishes**, which the direct-push design skipped. The cockpit already validates against CI's schema, but CI also catches build failures, dead links and terminology, and a malformed case study reaching `main` breaks the site.
- If auto-merge is disabled on the repository, **report it rather than falling back to a direct push.**
- **A GitHub App with a narrower installation is the properly scoped answer** and is post-cutover hardening, not now.

### 2.5 `/why-yallo`'s substance: the line, the section, the table

**The over-specific line.** Sumeet: too specific, not needed. The current copy names Richemont, Landmark and Alshaya EMEA as places the screening team worked, and four cards beneath repeat it as a gallery.

**The context that decides this.** Canon deleted a "people who screen" section because Sumeet is the calibrating architect and a named-architect gallery overclaims. He has restated the same constraint in his own words: he is one person with a team he is training, and he cannot oversell. Naming three clients as employers also asserts employment history against consented client names.

**Ruling.** Replace the line. Draft, and Sumeet changes it in one line if he wants:

> **Screened to a written standard.** Every shortlist is calibrated by someone who has run these programmes, then screened against a standard your hiring manager can read.

**On the four cards: check canon before touching them.** If canon's deletion of the named-architect gallery covers this section, it is a ratified deletion that has returned in a new shape and the client names come off. If it does not, report that and leave them. **Do not decide it from the shape alone.**

**"operator" as a word.** Ratified site terminology is **specialist-screened** and **specialist-led**. Replace every instance with specialist or with role language, and prefer describing what is checked over who checks it, which cannot overclaim. "Depth-tested by an operator who has run the role" becomes a specialist formulation. Sumeet's framing to respect: he is building a system and a standard, not a cast.

**The comparison table, which game plan §7 already ratified rebuilding.** Sumeet has supplied the legacy "Beyond Recruitment. Beyond Consulting." table, fifteen rows across Pure Recruitment, Pure Consulting and Yallo Group, and asked for the best of it folded into "Different by design", which is currently six rows across two columns.

**Ruling: three columns, nine rows.** The three-column axis is the stronger idea and the two-column version loses the actual position, which is that Yallo sits between volume recruitment and the consultancies. Columns: **volume recruiters · consultancies and integrators · Yallo Talent.**

Rows, drawn from the legacy set and filtered:

1. How candidates are screened
2. Brief to shortlist
3. Platform depth at module level
4. Who owns the shortlist
5. Engagement models
6. Commercial transparency
7. When a placement does not work
8. Scaling a team mid-programme
9. Accountability after placement

**What does not come across, with reasons, so it is not re-litigated.** *Strategic Tech Advisory* and *Innovation + Co-Design* are the consulting proposition R1 strips from this site. *Real-time Performance Monitoring* and *Industry-Specific Playbooks* assert capabilities nothing else on the site supports. *Cost vs Value Efficiency* invites a rate comparison with the integrators, which is the one axis §3 of the game plan says never to compete on. *Embedded Knowledge Sharing* carries no claim.

**Hard constraints on the table.**

- **Every cell in the Yallo column states a claim already published elsewhere on the site.** A comparison table is where unevidenced claims enter, and this one must not become that. If a row has no supported claim, cut the row.
- **No superlatives.** The legacy version's "Fast, top quality & full spectrum" is exactly the interchangeable register the Phase 1 benchmark found across the whole category.
- **Real table markup with text or CSS marks, never images.** The legacy table's ticks are images, which the project instructions name specifically as the accessibility failure not to repeat.
- **Do not carry the legacy subtitle.** "Seamless, Scalable Solutions" contains banned vocabulary twice over.
- **Naming the integrators is Sumeet's call, not Code's.** He named Tata, Infosys and Capgemini in describing the table. Whether competitor names appear on the site is a publishing decision under R-A9. **Use the category, not the names, and flag it in the relay for him to overrule.**

---

## 3. Forbidden this round

- **No Phase 8 work or measurement.** R-A6, unchanged.
- **No write-pane work**, and no commit path reported as working that has not been watched committing. §2.4, round 19.
- **No narrowing of a terminology rule to make its first run small.** §2.1.
- **No opacity-reducing or conditionally hiding the glow.** Removed. §2.2.
- **No question to Sumeet about published content.** R-A9. Factual concerns go in the relay, once, afterwards.
- **No competitor names in the comparison table** without his ruling. §2.5.
- **No new claim in the Yallo column** that is not already published elsewhere. §2.5.
- **No `order` frontmatter field.** Withdrawn, §1.3. Reordering uses `order.yaml`.
- **No touching Wickes.** §1.4, Sumeet's.
- **No biography, specialism or contact detail for any real named person**, and no `Person` schema beyond the four authorised fields. Unchanged.

---

## 4. The tail, and what is filed rather than fixed

**In this round, after the work above:**

- **The CI red that has stood for four or more pushes.** `check:visual` fails on the runner only: horizontal overflow 362 against 360 on the homepage, both themes. Locally `check:visual` and `check:reflow` pass across 174 routes at 320 and 360. Code's hypothesis is font fallback measuring wider on Linux. **It is answerable in one run:** capture the offending element's width and computed `font-family` on the runner and compare with local. Report the answer; fix only if the cause is clear. **This is a cutover blocker in the sense that matters, because the only environment that disagrees is the one that would gate a deploy.**
- **Rerun CI on `e0ca04c`** once GitHub Actions recovers from the partial outage that blocked seven attempts. That is the one outstanding piece of evidence in `v25`.
- **`check:assistant-*` did not run**, and `check:assistant-terms` crashed on `ECONNREFUSED` against a default port 3000 rather than the base-URL convention the other gates use. **Fix the base URL, then run all five.**

**Filed with severities, not fixed here:**

- **P1: `src/data/home/hero.ts` and `src/data/home/engage.ts` still type `"2:1"`, `"72h"` and `"50+"`** beyond the quarterly refresh. Blocked by a real boundary, since `Instrument.tsx` and `Engage.tsx` are client components and `metrics.ts` reads the file system. The fix is a generator from `content/metrics.yaml` to a client-safe module with a `--check` flag, the shape `build-research-dataset.mjs` already proved. **Last known instance of this class on the site's own figures.** Round 19.
- **P1: rendered-pixel contrast checking.** §2.2. Source-level contrast cannot see text over a gradient.
- **P2: the admin panes have no rendered accessibility or type-scale measurement.** They are absent from the sitemap so no enumerating gate visits them. Code notes the "internal surface, one user" argument was made about `/ai-talent` before it shipped six classes under the type floor. Round 19, with the write pane, since the panes will change.
- **The client-bundle leak assertion in `check:admin-isolation` has never executed**, because no admin secrets exist in that environment. It says so rather than passing silently. **Must run once with the real environment before cutover.**
- **`next-auth` at `5.0.0-beta.32`**, pinned exactly, on the auth path. Accepted as what Auth.js v5 currently is.

---

## 5. Open with Sumeet

1. **The two credentials.** `ADMIN_GITHUB_TOKEN` with Contents read and write, plus `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` from `pnpm admin:hash`. **The write pane cannot start without them, and it is the last thing between him and cutover.**
2. **One sign-in has never been executed.** Everything anonymous is verified; the authenticated path has not run once. Needed before cutover.
3. **Wickes**: retire the row or supply the asset. Recommend retiring, his call.
4. **Competitor names in the comparison table.** He named Tata, Infosys and Capgemini. Shipping as the category unless he says otherwise.
5. **The replacement line and the four client-named cards** in §2.5.
6. **`/privacy`'s new sentence**, logged for veto: "Recorded conversations can be read by one named administrator at Yallo, and by nobody else."
7. **R-AI3**, still awaiting veto, and now overdue: the research cites scarcity throughout while `/ai-talent` may not.
8. **The heading fade** on `/permanent` and `/contract`, still unchecked.
9. Carried: a specialism and contact route for the five named leaders; the go-live date and production `RESEND_*` with SPF and DKIM, both Raphy's; deleting the credential backup directory.
