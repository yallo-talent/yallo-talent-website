# Yallo Talent — Claude Code Session Handover

**30 July 2026 · Project GTM.01 · For the next Claude Code session**
Repo: `github.com/yallo-talent/yallo-talent-website`
Written because the previous session's context filled. Everything is committed and pushed —
there is no uncommitted work to recover.

---

## 0. Start here, in this order

1. `AGENTS.md` / `CLAUDE.md` — ownership, ground rules, fixed phase order, the pre-launch gate
2. `PRODUCT.md` — product truth. Users, positioning, taxonomy, banned terminology, and the
   absences that must not be filled by invention
3. `DESIGN.md` — the visual system. Tokens are normative. Ends with a record of every
   departure from the design prototype and why
4. `README.md` — how to run it, the guards, the traps
5. `docs/relays/CODE-TO-CHAT-RELAY-v1.0.md` — **the strategic state.** Nine findings awaiting a
   Chat-lens decision, six canon amendments needed. Sumeet has sent this to Chat Opus and
   **is waiting on answers.** Do not pre-empt those decisions
6. `prototype/CLAUDE-CODE-COMBINED-RELAY.md` — the original ratified dispatch (§1–§13)
7. `prototype/SESSION-STATE-and-DESIGN-CANON.md` — the canon the relay implements

If a change contradicts any of these, raise it rather than working around it.

---

## 1. State of the build

**Nothing is merged to `main`.** Two branches, both pushed:

| Branch | Commits | Contains |
|---|---|---|
| `design/tokens-and-themes` | 4 | PRODUCT.md, DESIGN.md, token system, homepage rebuild, logo assets, case-study port |
| `refactor/taxonomy-and-geography` | 3 on top | Taxonomy, terminology sweep, platform pages, defect register, relays |

`HEAD` is `9a8bc65` on `refactor/taxonomy-and-geography`. Working tree clean apart from
untracked `prototype/` (Sumeet's source docs — deliberately untracked; the logo pack was
copied into `assets/client-logos/` so the build scripts are reproducible without it).

Tag `pre-design-2026-07-30` marks the pre-design state if you need to diff or revert.

### Content inventory

- **15** case studies in `content/case-studies/` — all real, ported verbatim from yallo.co
- **21** insights in `content/insights/` — 13 real legacy, 4 unpublished stubs with a
  `rewriteBrief`, 4 unpublished thought-leadership pieces awaiting rewrite
- **18** consented clients in `content/clients.yaml`, all with a real logo
- **4** metrics in `content/metrics.yaml` — the only four published

### Gates, all currently green

```
pnpm check:terms      # 0 banned terms in 175 files
pnpm check:contrast   # 32/32 pairs, WCAG 2.2 AA, both themes
pnpm check:visual     # served-markup + both themes at 1280 and 360 (needs a server)
pnpm test             # 2 playwright specs, incl. zero dead internal links
pnpm typecheck        # 0 errors
pnpm exec biome check .  # 0 errors, 2 known warnings (see §5)
```

All except `check:visual` and `test` also run in CI (`.github/workflows/ci.yml`).

---

## 2. Servers

Two were left running by the previous session. Check before starting more:

```bash
lsof -ti:3000   # dev, hot reload — this is the one Sumeet watches
lsof -ti:3100   # production build
```

Start them:

```bash
pnpm dev                                    # :3000
pnpm build && PORT=3100 pnpm start          # :3100
```

**`preview_start`'s dev-server launcher is broken in this environment** — it fails with
`spawn .../Helpers/disclaimer ENOENT`. Start servers with a backgrounded Bash command
instead, and say so rather than switching silently. `preview_start {url}` for an already-
running server still works.

Sumeet asked to keep **:3000 up so he can watch changes land.** If you restart it, tell him.

---

## 3. Traps that cost the previous session real time

Read this section. Every item here was learned the hard way.

1. **Never `rm -rf .next` while the dev server is running.** It deletes the manifests the
   running server needs and every request 500s with
   `ENOENT .next/dev/server/pages/_app/build-manifest.json`. Stop dev first, or use a
   separate build. This broke the server Sumeet was watching.

2. **`content/*.yaml` is not part of Next's build-cache key.** Edit a YAML content file,
   rebuild, and you will serve the *previous* prerender. Symptom: your change is provably in
   the file and provably absent from the page. `rm -rf .next` before rebuilding after any
   content edit.

3. **A stale server process will lie to you.** After a rebuild, confirm the process on the
   port is the new one (`kill -9 $(lsof -ti:3100)` then restart). A `pkill -f "next start"`
   did not match the actual process name once and cost twenty minutes of confusion.

4. **The Layer 2c compatibility shim cannot follow a local override.** Aliases like
   `--wa60: var(--text-2)` are declared on `:root`, so they compute against `:root`'s values
   and descendants inherit the *computed* result. `.band-invert` cannot reach them. If a
   legacy component needs the dark register, put it inside **`.band-dark`**, which restates
   both token layers. This is documented in `globals.css` at the shim.

5. **Inline styles beat classes.** `hueStyle()` used to write per-sector hues as inline
   custom properties, which defeated `.band-dark` and painted a light gold wash over dark
   panels. Those functions now return `{}`. **Do not reintroduce per-sector hues** — canon
   retires them, one accent always.

6. **commitlint is strict.** Type must be one of
   `feat|fix|chore|data|style|perf|docs|test|refactor|ci`, and the subject must be
   **lowercase**. `content(...)` and `docs(relay): Code to Chat…` were both rejected. Content
   changes use `data:`.

7. **The pre-commit hook blocks on biome *errors*** (warnings pass) and on **raw hex outside
   `src/app/globals.css`**. Do not work around the colour hook; add the token.

8. **React 19 SSR inserts `<!-- -->` between adjacent text expressions.** `{50}{"+"}`
   serialises as `50<!-- -->+`. A naive string assertion against served HTML will fail on
   correct markup — strip the markers first. `scripts/capture-home.mjs` does.

9. **`next/image` lazy-loads, and a Playwright `fullPage` screenshot does not trigger it.**
   Scroll the page and *poll until images complete* before capturing, or every logo captures
   as an empty tile and looks like a broken asset.

10. **Images inside the horizontal case-study rail are legitimately never loaded** at 360px —
    vertical scrolling does not reveal later slides. `capture-home.mjs` excludes them from the
    completeness assertion by design. Do not "fix" that by forcing them eager.

11. **`networkidle` never settles** on a page with lazy images. Use `load` plus an explicit
    wait for the element the assertion depends on.

12. **Be careful with broad regex edits to `.tsx`.** One over-greedy pattern ate unrelated
    code in `L1PageShell.tsx` and required a `git checkout --`, which silently discarded
    uncommitted work in that file. Prefer literal replacements; commit before bulk edits.

13. **`scripts/check-terminology.mjs` allow-lists lines *before* replacing, not after.** An
    earlier version audited afterwards and rewrote the very comment documenting the ban into
    nonsense. Keep that ordering.

---

## 4. Where things live

```
PRODUCT.md  DESIGN.md            product and visual truth, both at repo root
.impeccable/design.json          DESIGN.md sidecar — STALE, see §6
docs/relays/                     this file + the Code→Chat relay
prototype/                       untracked: canon, the v0.3 prototype, source relays

src/app/                         routes
  platforms/[platform]/          NEW — derived platform-depth pages
  industries/[sector]/[fn]/      L2 function pages
src/components/blocks/home/      the homepage, one section per file, one shared stylesheet
src/components/blocks/l1,l2/     sector and function templates — DARK register, see §7
src/components/ui/PetalPlate.tsx drawn graphics; replaced all stock photography
src/config/theme.ts              build-time default + the pre-paint init script
src/data/                        ALL copy. Components hold no user-facing strings
  l1/registry.ts                 the single sector registry
  l1/index.ts                    taxonomy labels + the TaxonomyLabel branded type
  platforms/derive.ts            platform coverage, derived from sector data
  pending/ai-talent-source.ts    AI content parked verbatim for /ai-talent
src/lib/routes.ts                single source of route truth — ask it, don't remember
src/lib/jsonld.ts                Organization + four LocalBusiness entities
content/                         MDX + the YAML registers
scripts/                         the guards and the content pipelines
assets/client-logos/             source logo pack for scripts/build-logos.mjs
```

If you find a user-facing string in a component, it belongs in `src/data/`.

---

## 5. Known-good warnings

`pnpm exec biome check .` reports **2 warnings, 0 errors**. Both are pre-existing and
deliberate:

- `L1PageShell.module.css:3098` `noDescendingSpecificity` — a hover rule declared before the
  base rule in a 3,000-line legacy stylesheet. Reordering risks visual regressions in a file
  scheduled for rework
- `NavBar.tsx:146` `suppressions/unused` — a `biome-ignore` whose rule no longer fires

Do not "fix" these casually; they are noted so you know the baseline is 2, not 0.

---

## 6. Immediately actionable, in priority order

### 6.1 Refresh the stale Impeccable sidecar — do this first

`.impeccable/design.json` predates the last DESIGN.md changes (the departures record, the
17-step type ramp, the five-scale petal). The hook says so on every write. Run
`/impeccable document` and choose **refresh**, so later passes read current truth.

### 6.2 Run the missing Impeccable passes

**This is the largest outstanding item from the original relay §1.** Honest status:

| Step | Status |
|---|---|
| `init`, `document` | Done |
| `shape` | **Never run** |
| `critique` per page type | **Never run** — so relay §12.8's before/after scores do not exist |
| `typeset` · `layout` · `bolder` | **Never run** |
| `adapt` | Partially, by hand — 360px floor works, overflow asserted |
| `audit` | Partially, by hand — contrast and LCP/CLS done; no axe, no Lighthouse |
| `polish` | **Never run** |

The **design hook is live** and every finding it raised was cleared (44 type-ramp and radius
violations among them), so the mechanical floor is met. The judgement-based passes are the gap.

Sequence: `document` → `critique` on homepage, then an L1 page, then a platform page →
`typeset`/`layout`/`bolder` where critique scores low → `adapt` → `audit` → `polish`.

**Run critique on an L1 page before the §7 decision below is settled** — it is exactly the
input that decision needs.

### 6.3 Then, blocked on Chat Opus

Sumeet has sent the Code→Chat relay and is awaiting answers. **Do not pre-empt these.** The
six questions are in §8 of that relay; the two that change code most:

- Ratify L1/L2/service as dark-register pages, or rebuild them into the light register (§7 here)
- Ratify the three-grade gold and two-grade functional palette into canon §2 and §6

### 6.4 Unblocked work, if Sumeet wants progress while waiting

| Item | Note |
|---|---|
| `/saudi-arabia` market page | Benchmark §9 puts it ahead of the generic regional pages: the in-country entity is a differentiator no competitor can claim |
| `/ai-talent` | Source material is parked verbatim in `src/data/pending/ai-talent-source.ts`. Nav lists it first, non-interactive |
| Programme Staffing Blueprint | Needs content. Rate bands live **only** here, never on a public page |
| AI Talent Atlas | Needs content |
| Lighthouse Mobile 90+ | Needs the real host |
| Branch protection on `main` | Not verifiable from the repo — confirm in GitHub settings |
| Newsletter signup on `/insights` | Deferred to Raphy per `docs/handover/newsletter-signup.md` |

---

## 7. The one big open design decision

**L1, L2 and service pages are now dark-register pages.** They were built dark throughout and
rendered dark-ink-on-dark once light became the site default. Rather than patch section by
section, the previous session made each page one coherent dark surface via `.band-dark`.

The argument for it: an L1 page with twenty function areas and scarcity data *is* a data
surface, and canon §2 permits dark for data surfaces.

The argument against: canon §2 also says "never more than two dark bands per page", and an
entirely dark page stretches that. The homepage is light with exactly two inverted bands, as
canon intends — so the site currently has two registers by page type.

**This is question 1 to Chat.** Either ratify it as a deliberate exception, or schedule the
L1/L2 rebuild into the light register. Do not change it unilaterally.

---

## 8. Content input Sumeet owes, that blocks real work

1. **Microsoft module data.** Canon §5 requires Microsoft at *equal depth to Oracle* because
   Yallo is a Microsoft house. The sector data holds 12 SAP modules, 11 Oracle, 9 Blue
   Yonder, 3 Salesforce — and **2 Microsoft, 0 Workday**. Platform pages generate only where
   real data exists, so Microsoft and Workday render non-interactive. **This is the single
   highest-value content input outstanding:** it unlocks the deepest page on the strategic
   wedge.
2. **An attributed testimonial.** The homepage slot is built and renders nothing until all
   four fields are filled in `src/data/home/intelligence.ts`. A real unattributed client
   quote exists on the old MAF page — see Code→Chat relay §4.5.
3. **The Alshaya "financial consolidation" outcome claim** is still live on yallo.co and is
   Hyperion language in a custom-build planning study. Flagged, not edited — Code→Chat §4.2.

---

## 9. The standing rule

Never invent a person, a quotation, a client name, a metric, a source or a case study. If
something is missing, leave a clearly marked slot and say so. Everything published has to
survive a competitor screenshotting it.

Three things enforce this structurally rather than by discipline: `consentOnFile` gating in
`content/clients.yaml`, definitions required on every metric in `content/metrics.yaml`, and
the three CI guards. **A previous pass of this work invented four case studies, eight
insights and a set of publication dates — all now removed or corrected.** The guards exist
because that happened.
