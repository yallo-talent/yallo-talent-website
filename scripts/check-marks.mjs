#!/usr/bin/env node
/**
 * check:marks — every mark on every surface carries the same optical weight.
 *
 * Canon §5 as amended round 7: marks are normalised on RENDERED INK AREA against
 * the set median, never on box height or box width. This is the gate for that
 * rule. It fails when any mark's rendered ink area deviates from its surface's
 * median by more than that surface's tolerance.
 *
 * WHY IT RENDERS RATHER THAN COMPUTES. src/lib/mark-scale.ts already solves the
 * heights, so re-deriving them here would only prove the library agrees with
 * itself. What can actually break is the composite: a `max-width` on an ancestor
 * clamping a wide mark, a stale `.logo img` rule outranking the component's own
 * class, an asset replaced without re-running the measurement pass. So this
 * reads the box the browser actually painted and multiplies it by the asset's
 * measured ink fraction. Box from the DOM, ink fraction from the manifest,
 * neither from the thing under test.
 *
 *   node scripts/check-marks.mjs [baseUrl]
 *   node scripts/check-marks.mjs --sweep    # the tolerance curve, no pass/fail
 *
 * Needs `next start`, not `next dev`: the rail's marks are next/image requests
 * and the dev server's on-demand optimiser makes the first paint of each one
 * arrive late enough to race the measurement.
 */
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE =
  process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3107";
const SWEEP = process.argv.includes("--sweep");

const manifest = JSON.parse(
  readFileSync(new URL("../public/logos/manifest.json", import.meta.url), "utf8"),
);

/* The same file src/lib/mark-scale.ts derives from, so the gate's threshold and
   the code it guards cannot drift apart. */
const SURFACES = JSON.parse(
  readFileSync(new URL("../src/lib/mark-surfaces.json", import.meta.url), "utf8"),
);

/** Every page that renders a mark. A new surface joins this list in the commit
 *  that introduces it — see AGENTS.md on enumerating guards. */
const PAGES = ["/", "/case-studies"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

/** surface -> slug -> rendered ink area in px². */
const found = new Map();
const problems = [];

for (const path of PAGES) {
  const res = await page.goto(`${BASE}${path}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  if (!res || res.status() >= 400) {
    problems.push(`${path} returned ${res ? res.status() : "no response"}`);
    continue;
  }
  /* Marks below the fold are lazily loaded, so scroll the document before
     measuring or half the set reports a zero box. */
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");

  const marks = await page.$$eval("[data-mark-slug]", (nodes) =>
    nodes.map((n) => {
      const img = n.querySelector("img");
      const box = img?.getBoundingClientRect();
      return {
        slug: n.getAttribute("data-mark-slug"),
        surface: n.getAttribute("data-mark-surface"),
        w: box ? box.width : 0,
        h: box ? box.height : 0,
      };
    }),
  );

  /* Deduplication is by (surface, slug), not by aria-hidden. The rail renders a
     duplicated marquee track whose copy is aria-hidden decoration, and the case
     cards mark EVERY mark decorative because the client name is in the card
     text beside it — so filtering on aria-hidden dropped a whole surface from
     the gate rather than dropping a duplicate. The map below keys on the slug,
     which collapses the duplicate track on its own. */
  for (const m of marks) {
    const metrics = manifest[m.slug];
    if (!metrics) {
      problems.push(
        `${path}: mark "${m.slug}" is not in public/logos/manifest.json — run scripts/measure-marks.mjs`,
      );
      continue;
    }
    if (m.w < 1 || m.h < 1) {
      problems.push(`${path}: mark "${m.slug}" rendered a zero box`);
      continue;
    }
    const inkArea = m.w * m.h * metrics.ink;
    if (!found.has(m.surface)) found.set(m.surface, new Map());
    found.get(m.surface).set(m.slug, { inkArea, w: m.w, h: m.h, path });
  }
}

await browser.close();

if (found.size === 0) {
  console.error("No marks found on any page. Is the right server on the port?");
  process.exit(1);
}

let failed = problems.length > 0;
for (const p of problems) console.error(`  ${p}`);

for (const [surface, marks] of [...found].sort()) {
  const rows = [...marks].map(([slug, v]) => ({ slug, ...v }));
  const areas = rows.map((r) => r.inkArea).sort((a, b) => a - b);
  const median = areas[Math.floor((areas.length - 1) / 2)];
  for (const r of rows) r.deviation = r.inkArea / median - 1;
  rows.sort((a, b) => a.deviation - b.deviation);

  const spec = SURFACES[surface];
  if (!spec) {
    console.error(
      `  surface "${surface}" renders marks but has no entry in src/lib/mark-surfaces.json`,
    );
    failed = true;
    continue;
  }
  const tolerance = spec.tolerance;
  const worst = Math.max(...rows.map((r) => Math.abs(r.deviation)));

  console.log(
    `\n${surface} — ${rows.length} mark(s), median ink area ${Math.round(median)}px², tolerance ±${(tolerance * 100).toFixed(0)}%`,
  );
  for (const r of rows) {
    const pct = (r.deviation * 100).toFixed(1);
    const over = Math.abs(r.deviation) > tolerance + 1e-9;
    if (over) failed = true;
    console.log(
      `  ${over ? "FAIL" : "    "} ${r.slug.padEnd(20)} ${`${Math.round(r.w)}x${Math.round(r.h)}`.padStart(9)}  ink ${String(Math.round(r.inkArea)).padStart(5)}px²  ${pct.padStart(7)}%`,
    );
  }
  console.log(`  worst deviation ${(worst * 100).toFixed(1)}%`);

  if (SWEEP) {
    /* The curve, so the tolerance is set at the tightest value the current
       assets satisfy rather than at a number chosen in advance. */
    console.log("  tolerance sweep:");
    for (const t of [0.02, 0.04, 0.06, 0.08, 0.1, 0.13, 0.16, 0.2, 0.3]) {
      const over = rows.filter((r) => Math.abs(r.deviation) > t);
      console.log(
        `    ±${(t * 100).toFixed(0).padStart(2)}%  ${String(over.length).padStart(2)} fail  ${over.map((r) => r.slug).join(", ")}`,
      );
    }
    console.log(
      `  tightest tolerance these assets satisfy: ±${(Math.ceil(worst * 100) / 100).toFixed(2)}`,
    );
  }
}

if (SWEEP) {
  console.log("\n--sweep: reporting only, no pass or fail.");
  process.exit(0);
}
if (failed) {
  console.error("\ncheck:marks FAILED.");
  process.exit(1);
}
console.log("\ncheck:marks passed.");
