/**
 * check-font-weights — no synthesised bold, anywhere.
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
 * Usage: node scripts/check-font-weights.mjs [baseUrl]
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
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} synthesised weight(s):`);
  for (const f of failures) console.error(`  ${f}`);
  console.error(
    "\nEvery weight must be a face layout.tsx loads. Use --fw-body/--fw-medium/" +
      "--fw-strong (and --fw-mono-strong, since Plex Mono ships no 600) rather " +
      "than a literal. Canon §5: 'Display Newsreader 500/600'.",
  );
  process.exit(1);
}

console.log(
  `Font weights clean: ${pairsChecked} family/weight pairs across ${PAGES.length} templates, every one a real loaded face.`,
);
