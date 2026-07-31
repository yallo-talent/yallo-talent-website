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
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const failures = [];
let pairsChecked = 0;

for (const path of PAGES) {
  const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (!res?.ok()) {
    failures.push(`${path}  did not load (HTTP ${res?.status() ?? "no response"})`);
    continue;
  }
  await page.evaluate(() => document.fonts.ready);

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
        `${path}  ${family} ${weight}${style === "italic" ? " italic" : ""} is SYNTHESISED — ${count} element(s), e.g. .${sample}`,
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

      // Uppercase mono tracking, with text-transform resolved rather than read.
      if (mono && cs.textTransform === "uppercase") {
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
    failures.push(`${path}  sans text below A4's 14px floor — ${s}`);
  for (const c of roles.control)
    failures.push(`${path}  filled control below A4's 15px button/nav role — ${c}`);
  for (const t of roles.tracking)
    failures.push(`${path}  uppercase mono below A4's 0.12em tracking — ${t}`);
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
  `Rendered type clean across ${PAGES.length} templates: ${pairsChecked} family/weight pairs all real, ` +
    "no sans under 14px, no filled control under 15px, no under-tracked uppercase mono.",
);
