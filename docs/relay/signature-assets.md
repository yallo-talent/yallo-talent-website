# Relay, signature assets: animated GIF and hosted signature page

**Single session, brand round. 9 August 2026.**
Branch `feat/email-signature-gif`, cut from `main` at `811fe0d`.
Isolated in a worktree at `../yallo-talent-sig`.
Rulings: `docs/design/context-signature-assets.md`, committed first at `3fb24ce`.

Both items were reached and finished. Nothing was left half done. Nothing was
merged and nothing was deployed.

---

## 1. Isolation, and why

The main checkout was parked on branch `round25` with a commit 68 minutes old
and its index touched at the same time. `git status` was otherwise clean, but
switching a shared checkout off another round's branch is the failure this
repository has already paid for once. So the round took a worktree:

    git worktree add ../yallo-talent-sig -b feat/email-signature-gif main

`round25` was never touched. Its working tree, its branch and its index are as
they were. The one file that crossed between them was the context document,
copied in and committed here, and a copy of `.env.local`, which is gitignored
and whose original stayed where it was.

**The worktree still exists and holds the fonts and the local `resvg` install.**
Do not `git worktree remove --force` it without reading section 8 first.

---

## 2. What shipped

| # | Item | Commit | State |
|---|---|---|---|
| 0 | Context document into the tree before the work | `3fb24ce` | Done |
| 1 | `public/images/email/signature-animated.gif` and its generator | `78bad92` | Done |
| 2 | `public/signature.html` | `dbf4302` | Done |
| 3 | Verification, gate suite, branch pushed | see §6, §7 | Done |

---

## 3. The GIF, measured

Every figure below was read off the encoded file or off a browser, never
estimated.

| Property | Measured |
|---|---|
| **File size** | **194,436 bytes: 189.9 KiB, 194.4 kB** |
| **Dimensions** | **600 x 170 (1x)** |
| **Frame count** | **21** |
| Loop | infinite |
| Hold per variant | 3,700 ms |
| Cross-fade | 480 ms in 6 intermediate frames |
| Total loop | 12.54 s |
| Frame 1 fidelity | max channel delta **0** against an independent render |
| Fade banding | worst frame 0.225% of pixels visibly off, mean 0.073% |

Budget was 300KB. The file is under it on either reading of KB, with 110 KiB
of headroom.

### Frame 1

Frame 1 is `light-72h-shortlist`. It was verified twice and independently of
the generator: the GIF's first frame was decoded and compared against a fresh
`resvg` render of that variant built from the SVG source in the same process,
and it came back **max channel delta 0, zero differing bytes**. The same
comparison against the other two variants returns deltas of 224 and 221, so
the check can tell them apart and is not passing on a constant.

### 1x, not 2x, and this was forced rather than chosen

2x was tried first, as the ruling directs. It cannot be had:

| At 1200 x 340 | Smallest measured | Verdict |
|---|---|---|
| Exact frame 1 and intact fades | 425.1 KiB | over budget |
| Exact frame 1, fades degraded | 353.7 KiB | over budget |
| Under 300KB | 253.6 KiB | frame 1's worst pixel 36 levels out |

Every 2x encoding that fits the budget pays for it in frame 1 or in the fades.
The ruling settles that trade in advance in favour of frame 1, because the
static-fallback audience never sees anything else. So 1x.

**The consequence is real and worth stating plainly: the banner is now soft on
a HiDPI screen.** It is 600 x 170 displayed at 600 x 170, so it is exact on a
1x display and upscaled on a retina one. That was the ratified trade, but it
has stopped being hypothetical.

### Encoder choice

**sharp 0.35.3 (libvips 8.18.3, cgif).** Already a dependency of the site, so
nothing new ships at runtime and no devDependency was added for encoding. It
also carries the two controls that decided the outcome, which a simpler
encoder would not have.

`@resvg/resvg-js` is installed **local to `scripts/brand/`**, through a new
`scripts/brand/package.json`. That file exists for a mechanical reason: without
a package.json in that directory `npm install` walks up into the pnpm root and
fails with `Cannot read properties of null (reading 'matches')`. The README
already told people to install resvg there; now it works.

### The settings, and the one that mattered

    colours: 256, dither: 0, interFrameMaxError: 10, interPaletteMaxError: 0

`interPaletteMaxError: 0` is the whole result. On the encoder's default the
mid-fade frames inherit a neighbouring frame's palette, and the worst fade
frame misses on **7.27%** of its pixels. Forcing a fresh local palette per
frame takes that to **0.225%**, and costs about 3 KiB. That single parameter is
worth more on this art than dithering and colour count together, both of which
turned out to do nothing measurable here because the banners are flat panels
and type rather than photographs.

`interFrameMaxError: 10` is the smallest file that still passes: 12 falls off a
cliff, 0.2% to 5.3%. Sitting one step from a cliff is only safe because it is
measured on every build, and `signature-gif.mjs` exits non-zero when any
constraint breaks. A future copy change that tips the encoder over fails loudly
instead of shipping soft.

### Fonts

The ruling says locate them, and stop rather than substitute. They were absent
everywhere: `scripts/brand/fonts/` does not exist in a fresh checkout, and
`scripts/brand/.gitignore` says so deliberately, because the pipeline fetches
its inputs rather than storing them. They were obtained by running the
committed `scripts/brand/setup.sh`, which is regeneration of pinned instances,
not substitution.

That claim is proved rather than asserted. After fetching the fonts, the
existing `signature-banners.mjs` was re-run and **all four ratified PNGs came
back byte-identical**, `git status` clean. Wrong fonts cannot produce identical
bytes, so the faces are the brand faces.

---

## 4. The signature page

`public/signature.html`, body verbatim from context §3. No layout, no nav, no
footer, no heading, no instruction text, no script or stylesheet link.

Verified mechanically against the production build rather than by reading it:

| Assertion | Result |
|---|---|
| `/signature.html` serves | 200, `text/html`, 1,766 bytes |
| Served bytes match the file on disk | identical |
| `noindex` present in the served head | yes |
| Select all, copy: top-level elements in the fragment | exactly one, `TABLE` |
| Copied fragment contains nav, header, footer or heading | no |
| Present in `sitemap.xml` | no |
| Present in `llms.txt` | no |
| GIF serves from `/images/email/` | 200, `image/gif`, 194,436 bytes, identical to disk |

The select-all check was run the way a member of staff runs it: select the
whole body, clone the selection range, and inspect what the clipboard would
carry. It carries the table and nothing else.

---

## 5. Animation, verified in a browser

The GIF animates. Sampled from a real Chromium at 600 ms intervals over 13.8 s,
the painted image produced **5 distinct frames**, in this shape:

    hold 1 (0 to 3000ms) - fade - hold 2 (4200 to 7200ms) - fade -
    hold 3 (7800 to 11400ms) - fade - hold 1 again from 12600ms

The frame at 12,600 ms hashes **identical** to the frame at 0 ms, so the loop
closes on frame 1 rather than drifting. The three holds were read visually and
are the 72h-shortlist banner, the AI-talent banner and the dark corridor
banner, in the ratified order.

This result only counts because the harness was validated first. See §8.

---

## 6. Gate suite

Run locally in the order of the `full` lane in `.github/workflows/ci.yml`, with
that file's exact invocations, on the production build. Real exit codes, one
per gate, captured individually rather than inferred from a suite.

**32 gates run, 32 exit 0. Nothing failed and nothing was skipped silently.**

| # | Gate | Exit |
|---|---|---|
| 1 | `biome check .` | 0 |
| 2 | `tsc --noEmit` | 0 |
| 3 | `check:terms` | 0 |
| 4 | `check:orbs` | 0 |
| 5 | `check:contrast` | 0 |
| 6 | `check:taxonomy` | 0 |
| 7 | `check-case-study-excerpts --selftest` | 0 |
| 8 | `check:cs-excerpts` | 0 |
| 9 | `check:type` | 0 |
| 10 | `check:published-manifest` | 0 |
| 11 | `check-sources --selftest` | 0 |
| 12 | `build` | 0 |
| 13 | `check:robots` | 0 |
| 14 | `playwright (pnpm test)` | 0 |
| 15 | `check:prose` | 0 |
| 16 | `check:visual` | 0 |
| 17 | `check:a11y` | 0 |
| 18 | `check-rendered-type` | 0 |
| 19 | `check:motion` | 0 |
| 20 | `check-interaction` | 0 |
| 21 | `check:reflow` | 0 |
| 22 | `check:yallo-case` | 0 |
| 23 | `check-estate-interaction` | 0 |
| 24 | `check-marks` | 0 |
| 25 | `check-gate-coverage` | 0 |
| 26 | `check-no-redirect-hops` | 0 |
| 27 | `check-redirects` | 0 |
| 28 | `check-metrics-attribution` | 0 |
| 29 | `check-research-pdf` | 0 |
| 30 | `check-admin-isolation` | 0 |
| 31 | `check:write-path` | 0 |
| 32 | `check:metrics` | 0 |

`check-gate-coverage` passing matters more than the rest here, since it is the
guard on the guards: it reads the route tree from the filesystem and each
gate's own list from source, and it did not report a rendering unit visited by
no gate. `public/signature.html` is a static file rather than a rendering unit,
so it is outside that model by construction, which is also why it cannot enter
the sitemap.

CI's browser-gate discipline was reproduced rather than approximated: the
server that served `check:visual` was retired and a fresh one started before
the browser gates, because a starved `next/image` optimiser stays wedged for
the life of the process. The server's working directory was confirmed to be
this worktree before any measurement was believed.

**Two CI steps were NOT run, and neither is a pass:**

| Step | Why not |
|---|---|
| Admin cockpit renders (signed in) | needs `ADMIN_TEST_EMAIL`, `ADMIN_TEST_PASSWORD`, `ADMIN_PASSWORD_HASH` and `AUTH_SECRET`, which are throwaway repository secrets held by CI and not present locally |
| Assistant link integrity | needs `ANTHROPIC_API_KEY`, a paid key CI reports as absent |

Neither can be affected by this round's changes: one signs into `/admin` and
the other asks the model questions. Both will run in CI on the pull request in
the usual way.

---

## 7. HEAD and branch state

Branch `feat/email-signature-gif`, four commits on top of `main` at `811fe0d`:

| Commit | Subject |
|---|---|
| `3fb24ce` | `docs(design): the signature assets context enters the tree before the work` |
| `78bad92` | `feat(brand): the signature banner becomes one animated gif` |
| `dbf4302` | `feat(brand): the signature copy source becomes a hosted page` |
| HEAD | the commit adding this relay |

`main` is untouched at `811fe0d`. `round25` is untouched at `4abe214`. Every
commit staged explicit paths; `git add -A` was never used, and `tsconfig.json`
was never touched, since no `next dev` ran in this round.

**Not merged, not deployed, as instructed.** Sumeet merges and confirms
production personally.

---

## 8. Retractions

Required even when empty. It is not empty.

**Two measurements were reported wrong during the round, both instrument
faults, neither reaching a commit.**

1. **The first quality thresholds were the wrong instrument.** Frame-1 and fade
   quality were initially gated on whole-frame RMSE. On art that is mostly flat
   panels, RMSE is diluted to nothing by the flat majority, and a 2x config
   passed at RMSE 1.41 while its worst pixel was 36 levels out. Frame 1 is now
   held to max channel delta, and banding to the share of pixels off by more
   than 6, which is a population property and is what banding actually is.
   Corrected before any encoding was committed.

2. **The GIF was twice measured as not animating, and both readings were
   false.** A canvas `drawImage` sample showed one distinct frame across a full
   loop, and a screenshot run agreed. Neither was a defect in the file. The
   screenshot run was passing its arguments through `node --input-type=module
   -e`, where user arguments start at `argv[1]` rather than `argv[2]`, so it
   pointed at a nonsense URL and screenshotted a blank box. What caught it was
   a **control**: a two-frame red and green flasher, which hashed identically
   to the banner. Two different images cannot hash the same, so the instrument
   was wrong, not the file. With the control passing, the real GIF animates.
   The lesson is the one already in this repository's memory in another form:
   a green or red result from an uncalibrated instrument is not a result.

Nothing else is retracted. No figure, date, name, title or quotation was
invented anywhere in this round or in the assets.

---

## 9. Decisions taken under delegated authority

All reversible. Each says how.

| # | Decision | Why | Reversibility |
|---|---|---|---|
| 1 | sharp as the encoder | already a dependency, no new runtime dep, and it carries the palette controls that decided the result | swap the `encode` function in `signature-gif.mjs` |
| 2 | 1x rather than 2x | forced by measurement, per the ruling's own fallback (§3) | one field in `CHOSEN` |
| 3 | Frames flattened onto `#ffffff` | GIF has no partial alpha, and the card's rounded corner is antialiased. Binary transparency would jag that corner in every client, and the signature block sits on white | the `MATTE` constant |
| 4 | Banding defined as pixels off by more than 6, ceiling 1% of the frame | the ruling says "mild or better" without a number, and a number was needed to choose between configurations | `VISIBLE_DELTA` and `FADE_VISIBLE_PCT_MAX` |
| 5 | `signature-banners.mjs` exports its render path | so the GIF and the PNGs cannot drift apart; guarded on `argv[1]` so importing it writes nothing | revert the file; the four PNGs re-render byte-identical either way |
| 6 | `scripts/brand/package.json` added | `npm install` in that directory fails without it | delete it and install resvg some other way |

---

## 10. Not done, and why

- **Nothing was merged or deployed.** Instructed.
- **The four PNGs were not touched.** Instructed, and verified: they re-render
  byte-identical.
- **`dark-measured` is not in the GIF.** The ruling names three variants for
  the sequence and that is not one of them.
- **No gate was weakened and `signature.html` was not tokenised.** See §11.

---

## 11. Open items, each with the question that unblocks it

1. **The raw-colour gate does not cover this file, and not by exception.**
   `.claude/hooks/check-colours.js` filters to `.css`, `.tsx` and `.ts`, so
   `public/signature.html` is outside its scope by file extension. It did not
   object, so there was nothing to weaken and nothing was weakened. The gate
   was left exactly as it is.
   *Recommendation:* leave it. The hex in that file is a correctness
   requirement, since email clients cannot resolve CSS variables, and widening
   the gate to `public/**/*.html` would mean adding a permanent allowlist entry
   for the one file that must be exempt.
   **Question:** do you want `public/**/*.html` brought into the gate's scope
   with this file allowlisted, or left out of scope as it is now?

2. **The Impeccable design hook flags this page, seven findings.** Four literal
   colours, Arial twice (`design-system-font` and `overused-font`), and
   `flat-type-hierarchy`. All seven are false positives against a ratified
   email template rather than defects:

   - The colours are hex-inlined because email clients cannot resolve CSS
     variables. Context §3 rules this deliberate.
   - Arial and Helvetica are the email-safe stack. A distinctive face is
     exactly what an email client will not load.
   - The type sizes are 12.5px to 17px because that is a signature block, not
     a page. Its hierarchy is carried by the serif name, the italic role and
     the gold labels rather than by size ratio, and every value is ratified
     verbatim, so widening the ratio would breach the ruling.

   Nothing was changed and nothing was suppressed, because a hook waiver is
   your call and not a lens's.
   **Question:** confirm these are intentional and they can be recorded as a
   scoped ignore for this file, or leave the hook flagging it on every edit.

3. **The page points at production, which does not carry the GIF yet.** The
   `<img src>` is the absolute `https://yallo.co/images/email/signature-animated.gif`,
   as ratified. Until this branch is merged and deployed, that URL 404s, and
   the page renders with a broken image.
   **Question:** none, but a sequencing constraint: **the rollout email cannot
   go out before the deploy is live**, or every recipient gets a broken banner.

4. **Nothing compares the committed GIF against its generator.** The generator
   is deterministic and self-checking when it runs, but no gate runs it, so a
   hand-edited or stale `signature-animated.gif` would pass CI. This is the
   same class of gap `check:research-pdf` and `check:published-manifest` exist
   to close, and it is filed rather than fixed because a new `scripts/check-*`
   and a new package script are both outside this round's territory.
   **Question:** should a later round add a `check:signature-gif` that re-runs
   the generator and compares against the committed file?

5. **The four PNGs are now unused by the standardised signature.** They remain
   committed and served. Not touched, since they are outside this round's
   territory and the ruling protects them.
   **Question:** do they stay as-is, or does a later round retire the three the
   GIF supersedes?

---

## 12. Risks

- **The rollout email must follow the deploy, not lead it.** §11.3. This is the
  one that turns a green branch into a visible defect.
- **The banner is soft on HiDPI.** §3. Ratified, but now real.
- **Older desktop Outlook shows frame 1 and nothing else.** By design, and the
  reason frame 1 was verified to byte equality. Worth stating in the rollout
  email so nobody reports it as a fault.
- **`interFrameMaxError` sits one step from a quality cliff.** Mitigated: the
  generator measures on every run and exits non-zero rather than shipping a
  degraded file.
- **The worktree holds unversioned inputs.** `scripts/brand/fonts/`, the local
  `node_modules`, and a copy of `.env.local`. `git worktree remove --force`
  destroys untracked files. Nothing there is irreplaceable, since `setup.sh`
  and `npm install` rebuild the first two and the original `.env.local` is
  still in the main checkout, but remove it knowingly rather than by reflex.
