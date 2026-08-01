# Code → Code handover v6.0

**For the next Code session on `yallo-talent-website`. Read this before touching
anything.** Chat's relay covers strategy and decisions; this covers the traps.

**State:** `main`, pushed, clean, HEAD `bc2baee`, nine gates 9/9.

---

## 1. Start here, in this order

```bash
pnpm build
for p in 3000 3100; do lsof -ti:$p | xargs -r kill -9; done; sleep 3
pnpm next start -p 3000 &   # gates default to 3000
pnpm next start -p 3100 &
```

Then **verify CSS is actually served before believing any gate**:

```bash
node --input-type=module -e 'import{chromium}from"@playwright/test";
const b=await chromium.launch(),p=await b.newPage();
await p.goto("http://localhost:3000/",{waitUntil:"load"});
console.log(await p.evaluate(()=>{let n=0;for(const s of document.styleSheets){try{n+=s.cssRules.length}catch{}}
return{cssRules:n,font:getComputedStyle(document.body).fontFamily.slice(0,12)}}));await b.close();'
```

Expect **~1085 rules and Inter**. Anything like 202 rules or Times means a stale
server and every gate result is worthless.

---

## 2. The four traps that cost the most time

**1 · Stale server / stale build.** Cost me time in *every single session*,
three times in the last one alone. Two failure modes:
- gates default to **port 3000** — restarting only 3100 leaves them measuring a
  dead build that still answers **200** with no CSS;
- reverting source without rebuilding leaves the server serving the old build,
  so gates fail against code that no longer exists.

Symptoms: `only 202 CSS rules`, `body font Times`, or a motion gate reporting
tweened offsets (no CSS means no `prefers-reduced-motion` block to honour).
**Restart every port and rebuild after every revert.**

**2 · Measure the thing, not its container.** Made this error **five times**.
Comparing a dark hero band to light ones (ΔE 65, then 86 — both meaningless);
sampling a gradient at the one corner it avoids; counting `border-top` dividers
as "bordered boxes"; measuring `#place`'s near-black band instead of the SVG on
it. Every one produced a confident, wrong number. **Sample the element, at the
place the property actually paints.**

**3 · Substring class selectors.** `[class*=expCard]` matches `expCardOpenLink`,
so a card measured 30×30 and looked 1.28% clickable. Match exact class tokens.

**4 * Declared ≠ rendered.** The system's most expensive bug class. `--id`
resolving is not the hue painting; `.amb-wash` existed, was well-tuned and was
applied to **zero elements** for weeks. A body can be written and gated behind an
unrelated optional field. **Assert a painted pixel or a rendered node, never a
computed custom property.**

---

## 3. Repo-specific rules that bite

- **`git add -A` is banned here.** It swept 13 untracked reference workbooks into
  a commit. Stage explicit paths.
- **Biome reformats on pre-commit without staging its own writes** — a successful
  commit leaves a dirty tree. Commit the reformat separately.
- **Commitlint**: lowercase subject, ≤100-char body lines, blank line before the
  footer.
- **`check-colours`** blocks raw hex *including in comments*. It caught me twice.
- **Gate the commit on the gates.** I once ran gates and `git commit` in one
  compound command and pushed at 7/9. The failures turned out to be phantoms —
  that was luck, not process.
- **Type floors are hard**: sans 14px, mono 13px at **≥0.12em** tracking. Three
  separate edits of mine broke these. Never shrink type to solve a layout fault
  — the Blue Yonder name slot and the mega-menu pill both taught this.
- **Never dim with opacity for restraint.** It removes contrast too. That is
  exactly how I shipped an a11y regression in the logo.

---

## 4. Where things live

| Thing | Path |
|---|---|
| Design authority | `docs/design/yallo-talent-CANON.md` (R1–R21, S1–S3) |
| Open questions | `QUESTIONS.md` |
| SAP IA | `docs/design/sap-ia-round-3.md` |
| Last two run reports | `docs/status/PARITY-RUN-REPORT.md`, `BOLTON-RUN-REPORT.md` |
| Logo variants + sheet | `src/components/layout/Lockup.module.css`, `docs/status/shots/r15b/` |
| Logo build + gates | `scripts/build-logos.mjs` (keying, dead zone, density + perimeter tests) |
| Case studies | `content/case-studies/*.mdx`, ordered by `featured:` |
| Nav taxonomy | `src/components/layout/nav-config.ts` (7×7×7) |

---

## 5. First task next session

**Logo variant G**, which Sumeet has chosen and which is *not* shipped. F is live.

G is the widest of the four treatments. At 360px it pushes the header to
scrollWidth 363 — a 3px overflow the reflow gate correctly refuses. My narrow
-width fix set tracking to 0.10em and broke the 0.12em mono floor on eight
routes. I reverted rather than leave it broken.

**The fix is bounded:** at ≤420px use tracking exactly `0.12em` (that alone
reclaims ~3px across six characters), plus a tighter gap and rule padding. Then
verify against **both** `check-reflow` and `check-rendered-type` before
committing — those two pull in opposite directions here, which is the whole
difficulty.

Also note: shipping G reinstates a divider R15 removed. Chat has been asked to
confirm. Don't ship it silently as a regression.

**Then:** point 9 (engagement two-column), point 13 (the two asset pages — but
the Blueprint needs authored content that does not exist yet).

---

## 6. Do not re-litigate

These are settled; changing them needs Sumeet, not judgement:

- Insight articles and blogs are **descoped permanently**. Do not port, rewrite
  or template them.
- Identity hues are **accepted**. Do not touch the 18-domain mapping.
- The score-bar `width` animation is a **confirmed exception** in
  `.impeccable/config.json`. Leave it.
- The service family (`/managed-delivery`, `/eor`) correctly has **no identity
  hue**. No 19th.
- Packaged Software leads the desk list; "Data & AI", not "Data & Analytics".
- Client corridor is **Middle East + Europe**. India only where materially true.
