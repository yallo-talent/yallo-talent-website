/**
 * check-rendered-type — A4 and canon §5, judged on what the browser PAINTS.
 *
 * Why this file exists at all, and why it is not check-type-scale. The static
 * guard reads source, so it sees a token and a literal. It cannot see what a
 * declaration RESOLVES to, and every rule below turned out to need exactly
 * that:
 *
 *   - which real font face a declared weight lands on (nothing in the source
 *     says whether it loaded);
 *   - whether 13px text is mono, when the family is inherited from a parent;
 *   - whether uppercase applies, when `text-transform` is inherited. This one
 *     is not hypothetical: .expertiseHiddenCount renders uppercase mono at
 *     0.100em against A4's 0.12em floor and the static guard reported CLEAN,
 *     because it looks for `text-transform` inside the same rule block and the
 *     uppercase comes from .expertiseShowAll above it. text-transform
 *     inherits; a block-scoped model does not.
 *
 * Two independent critique passes reached the same conclusion independently:
 * A4's per-role minimums were unenforced, so each round fixed the sites the
 * critique happened to name and the next round found the same defect in
 * components it had not sampled. Eleven fresh sites on one page. A guard that
 * covers the CLASS is the only thing that stops a third round finding a twelfth.
 *
 * Why this exists. Two independent critique passes converged on the same
 * defect, and every existing gate was green while it shipped: 92 of 181
 * font-weight declarations named a face the site never loads. layout.tsx
 * requests Newsreader 400/500/600, Inter 400/500/600 and IBM Plex Mono 400/500;
 * the modules asked for 300, 550, 700, 800 and 900. The browser does not fail
 * on that — it SYNTHESISES, smearing the nearest real face geometrically. The
 * result degraded the largest type on the site: at 2x zoom the H1's counters
 * visibly closed, which is exactly the failure that layout.tsx's own comment
 * says Newsreader's optical sizing was chosen to avoid.
 *
 * Why it has to run in a browser. check-type-scale reads source and can see a
 * literal, but it cannot see the resolution — which real face a declared weight
 * lands on, whether the face loaded, or that Plex Mono has no 600 at all. Only
 * `document.fonts` knows what actually arrived, so the check is empirical:
 * enumerate every rendered family/weight/style pair, and require each one to
 * exist in the loaded set.
 *
 * Scope. Only families the site actually loads are judged. A system fallback
 * (ui-sans-serif, monospace) is not our face and not our business, so it is
 * skipped rather than reported — otherwise the gate would fail on Tailwind's
 * preflight stack and teach everyone to ignore it.
 *
 * Usage: node scripts/check-rendered-type.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3100";

// One page per template, not one per route: the defect lives in the shared
// stylesheets, so a template is the unit that can fail independently.
const PAGES = [
  "/",
  "/platforms/sap",
  "/platforms/sap/sap-datasphere",
  "/capabilities/data-analytics",
  "/industries/retail",
  "/contract",
  "/brief",
  /* Added 2 Aug, and the reason is a live breach this gate could not see.
     /ai-talent's estate diagram shipped SIX classes at 13px SANS — layerIndex,
     layerContents, railNote, railItem, caption and an uppercase overlay label —
     against A4's 14px sans floor. Every rule this gate enforces would have
     caught it on sight. It never looked, because the page was not on this list.

     "One page per template" is the right principle and it was applied to the
     templates that existed when it was written. Three page FAMILIES have landed
     since, each with its own components and none of them audited. A template
     that is not listed here is not covered, and the list is the only thing
     saying which templates exist. */
  "/ai-talent",
  "/ai-talent/agentic-ai-developer",
  /* An INDUSTRY L2. The list already had a platform module L2, and the two use
     different shells — L2PageShell versus PlatformModuleShell — so covering one
     never covered the other. L2PageShell was putting --fs-data, a mono-only
     token, on six SANS rules: 46 nodes of 13px Inter on every industry L2 on
     the site, under A4's 14px sans floor, unaudited. */
  "/industries/retail/customer-experience",
  "/intelligence/programme-staffing-blueprint/sap-s4hana",
  /* Added 2 Aug by check-gate-coverage rather than by a critique finding a
     breach, which is the point of that gate: these two rendering units were
     visited by no enumerating guard at all. The blueprint ARCHETYPE was listed
     and its index was not, and they are different components. */
  "/intelligence",
  "/case-studies/oracle-hyperion-financial-management-hfm-implementation",
  /* Added at the round 7 close, for the same reason the two above were: the
     detail template was listed and its LANDING HUB was not, and they are
     different components with their own CSS module. The detail page failed this
     gate on three classes the moment it was looked at, so the hub is not
     assumed clean by family resemblance. AGENTS.md: a new template joins every
     enumerating guard in the commit that introduces it. */
  "/case-studies",
];

// Two viewports, because one was the gate's second blind axis. Reporting CLEAN
// at 1280 says nothing about 390: NavBar's .ctaPrimary steps DOWN to 14px on a
// gold fill at the mobile width, an A4 breach that a desktop-only sweep can
// never reach. Sizes that change at a breakpoint need the breakpoint measured.
const VIEWPORTS = [
  { width: 1280, height: 900 },
  { width: 1024, height: 900 }, // where the nav's mobile step-down begins
  { width: 768, height: 900 },
  { width: 390, height: 844 },
];

const browser = await chromium.launch();

const failures = [];
let pairsChecked = 0;

for (const viewport of VIEWPORTS) {
const page = await browser.newPage({ viewport });
for (const path of PAGES) {
  /* `domcontentloaded`, not `networkidle`, and not `load` either.

     THE FAILURE WAS A FLAKE, AND THAT IS THE WHOLE POINT. This gate timed out
     at 30s on `/` on a freshly built dist directory, and passed on the same
     commit minutes later. Measured rather than reasoned about: networkidle on
     `/` takes over 30,000ms against a cold image-optimiser cache and 801ms
     against a warm one. `next start` optimises on first request, and the
     client rail is five logos across four srcset widths, so a run that follows
     a clean build pays for twenty optimisations inside one navigation timeout
     while a run that follows any earlier page load pays for none.

     So the gate's verdict depended on whether something had already visited the
     site, which is the property a gate must not have. `load` is hostage to the
     same images and was tried first; it timed out the same way.

     Nothing measured here needs images. The gate reads computed font sizes,
     settled once the stylesheets and fonts are, and `document.fonts.ready`
     below is what actually gates the measurement — it already did. Verified
     after the change by putting an 11px sans class on the site and watching all
     32 violations come back.

     capture-pages.mjs has carried a note about networkidle and lazy images
     since it was written. Two gates never got it. */
  const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  if (!res?.ok()) {
    failures.push(`${path} @${viewport.width}  did not load (HTTP ${res?.status() ?? "no response"})`);
    continue;
  }
  await page.evaluate(() => document.fonts.ready);

  // Reveal the controls that do not exist at rest, because this gate reported
  // CLEAN over two real A4 breaches it simply never saw. The sticky brief CTA
  // mounts only past 1100px of scroll and the skip link is off-screen until
  // focused — both are filled gold controls at 13px. A gate that only inspects
  // the resting, unfocused, unscrolled page audits a fraction of the surface.
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const first = document.querySelector("a[href^='#'], a[href], button");
    if (first instanceof HTMLElement) first.focus();
  });
  await page.waitForTimeout(150);

  const { loaded, used } = await page.evaluate(() => {
    const loaded = new Set();
    document.fonts.forEach((f) => {
      if (f.status === "loaded") {
        loaded.add(`${f.family.replace(/['"]/g, "")}|${f.weight}|${f.style}`);
      }
    });

    const used = new Map();
    for (const el of document.querySelectorAll("*")) {
      // Only elements that render their own text: an ancestor's computed
      // weight is inherited noise and would triple the report.
      const ownText = [...el.childNodes].some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (!ownText) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;

      const family = cs.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
      const key = `${family}|${cs.fontWeight}|${cs.fontStyle}`;
      const seen = used.get(key);
      if (seen) seen.count += 1;
      else {
        used.set(key, {
          count: 1,
          sample: el.className?.toString?.().split(" ")[0] || el.tagName.toLowerCase(),
        });
      }
    }
    return { loaded: [...loaded], used: [...used] };
  });

  const ourFamilies = new Set(loaded.map((k) => k.split("|")[0]));
  const loadedSet = new Set(loaded);

  for (const [key, { count, sample }] of used) {
    const family = key.split("|")[0];
    if (!ourFamilies.has(family)) continue; // a system fallback, not ours
    pairsChecked += 1;
    if (!loadedSet.has(key)) {
      const [, weight, style] = key.split("|");
      failures.push(
        `${path} @${viewport.width}  ${family} ${weight}${style === "italic" ? " italic" : ""} is SYNTHESISED — ${count} element(s), e.g. .${sample}`,
      );
    }
  }

  // ── A4 role minimums, measured on the rendered node ────────────────────
  const roles = await page.evaluate(() => {
    const SANS_FLOOR = 14; // 13px is the MONO label step and nothing else
    const CONTROL_FLOOR = 15.5; // A4: "buttons 15px; nav 15px"
    const TRACKING_FLOOR = 0.1195; // A4: mono uppercase at >=0.12em

    const strip = (el) =>
      [...el.classList][0]?.replace(/^[A-Za-z0-9]+-module__[A-Za-z0-9]+__/, "") ??
      el.tagName.toLowerCase();

    const out = { sans: new Map(), control: new Map(), tracking: new Map() };
    for (const el of document.querySelectorAll("*")) {
      const ownText = [...el.childNodes].some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (!ownText) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;

      const px = Number.parseFloat(cs.fontSize);
      const mono = /Plex Mono/i.test(cs.fontFamily);
      const name = strip(el);

      // Sans text below 14px. --fs-data and --fs-label are 13px MONO roles;
      // A4 puts the card, list and meta floor at 14px for everything else.
      if (!mono && px < SANS_FLOOR) out.sans.set(`${name} @ ${px}px`, true);

      // A filled control. Distinguishing a button from a footer link needs the
      // rendered background: A4 sets buttons and nav at 15px but footer links
      // at 14px, so element type alone cannot decide it.
      const filled = !/^rgba?\(0, 0, 0, 0\)$|^transparent$/.test(
        cs.backgroundColor,
      );
      const control =
        el.tagName === "BUTTON" || (el.tagName === "A" && el.hasAttribute("href"));
      if (control && filled && !mono && px < CONTROL_FLOOR)
        out.control.set(`${name} @ ${px}px`, true);

      // Uppercase mono tracking. Keying on text-transform ALONE missed
      // .axisModules — "ERP, WMS, TMS" is natively capitalised in the data, so
      // it renders as tracked-out caps without ever setting the property. A4
      // governs how uppercase mono LOOKS, not how it was produced, so the test
      // also accepts a string that is already caps.
      const txt = [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join("");
      const letters = txt.replace(/[^A-Za-z]/g, "");
      const nativeCaps = letters.length >= 3 && letters === letters.toUpperCase();
      if (mono && (cs.textTransform === "uppercase" || nativeCaps)) {
        const ls = Number.parseFloat(cs.letterSpacing) || 0;
        if (ls / px < TRACKING_FLOOR)
          out.tracking.set(`${name} @ ${px}px, ${(ls / px).toFixed(3)}em`, true);
      }
    }
    return {
      sans: [...out.sans.keys()],
      control: [...out.control.keys()],
      tracking: [...out.tracking.keys()],
    };
  });

  for (const s of roles.sans)
    failures.push(`${path} @${viewport.width}  sans text below A4's 14px floor — ${s}`);
  for (const c of roles.control)
    failures.push(`${path} @${viewport.width}  filled control below A4's 15px button/nav role — ${c}`);
  for (const t of roles.tracking)
    failures.push(`${path} @${viewport.width}  uppercase mono below A4's 0.12em tracking — ${t}`);
}
await page.close();
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} rendered-type violation(s):`);
  for (const f of failures) console.error(`  ${f}`);
  console.error(
    "\nWeights: every one must be a face layout.tsx loads — use --fw-body/" +
      "--fw-medium/--fw-strong, and --fw-mono-strong since Plex Mono ships no " +
      "600. Canon §5: 'Display Newsreader 500/600'.\n" +
      "Roles: A4 sets the sans floor at 14px (13px is the MONO label step), " +
      "buttons and nav at 15px, and uppercase mono at 0.12em tracking.",
  );
  process.exit(1);
}

console.log(
  `Rendered type clean across ${PAGES.length} templates x ${VIEWPORTS.length} widths: ${pairsChecked} family/weight pairs all real, ` +
    "no sans under 14px, no filled control under 15px, no under-tracked uppercase mono.",
);
