#!/usr/bin/env node
/**
 * check-phase8.mjs — the Phase 8 performance gate, made reproducible.
 *
 * AGENTS.md sets the gate before the DNS switch: Lighthouse Mobile 90+,
 * LCP < 2.5s, CLS < 0.1, INP < 200ms, WCAG 2.2 AA. This script owns the first
 * four. WCAG stays with `check:a11y`, which tests both registers at two widths
 * and is the stronger instrument for it — Lighthouse's accessibility category
 * gives an axe experimental rule zero weight, so a category score cannot stand
 * in for it (round 10: `/brief` scored 100 while failing WCAG 2.5.3).
 *
 * Why this exists as a committed gate rather than a one-off run. Round 10
 * measured the baseline in a scratchpad directory, which meant the numbers were
 * honest but unreproducible: nobody could dispute them, and the next round would
 * re-derive the whole table by hand. A performance number that cannot be
 * re-run is an assertion, not a measurement.
 *
 * NOT a PR gate, and deliberately. It is slow (eight routes x two passes), and
 * its scores drift with content and with the host machine's load, so gating
 * merges on it would fail PRs for reasons unrelated to the diff. It runs on a
 * schedule and on demand, the same reasoning `check:crawlers` already applies.
 *
 * Usage:
 *   node scripts/check-phase8.mjs [--base URL] [--passes N] [--route PATH]...
 *                                 [--json FILE] [--label TEXT]
 *
 * Requires a server already listening on --base. Point it at `next start` on a
 * production build, never `next dev`: dev-mode compilation and unoptimised
 * images make every number meaningless. The script verifies the target responds
 * before it measures, but it cannot tell a stale build from a fresh one — that
 * check is yours, and it has burned this repo before.
 *
 * LIGHTHOUSE IS PINNED EXACTLY, to 12.8.2 in package.json, and it must stay
 * pinned. Two reasons, both learned by doing it wrong first. Lighthouse 13
 * recalibrated the performance scoring curve, so the same build measured 83-98
 * on 13.4.1 and 79-88 on 12.8.2 — a spread wide enough to read as a fix that
 * never happened. It also replaced the legacy diagnostic audits with an
 * `*-insight` set, so `largest-contentful-paint-element`,
 * `render-blocking-resources` and `font-display` are simply absent, and the
 * three diagnostics this repo's font work depends on come back empty. A caret
 * range would let a patch bump silently rewrite the number this gate reports.
 * Re-baselining on a newer Lighthouse is a deliberate act: measure the whole
 * eight-route set on both versions in one sitting and publish the pair.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { sampleCaseStudySlug } from "./lib/case-study-sample.mjs";

/* The gate, from AGENTS.md. Absolute rather than relative to a previous run:
   these are the canon thresholds, not a regression guard. */
const GATE = {
  performance: 90, // Lighthouse Mobile performance score, out of 100
  lcpMs: 2500,
  cls: 0.1,
  /* Lighthouse cannot emit INP: it is a field metric that needs real
     interactions. TBT is the documented lab proxy and is what this reports.
     A real INP measurement needs a driven-interaction harness, which is a
     separate instrument. Do not read a green TBT as a green INP. */
  tbtMsProxy: 200,
};

/* §3.3's route set, one per rendering unit that carries distinct weight:
   homepage, one engagement pillar, one platform desk, one capability desk, one
   industry L1, one industry L2, one case study, and the conversion surface.
   Kept as a literal list because the point is comparability across rounds — a
   derived list would change under it and silently break the comparison. */
const ROUTES = [
  "/",
  "/contract",
  "/platforms/sap",
  "/capabilities/data-analytics",
  "/industries/retail",
  "/industries/retail/customer-experience",
  `/case-studies/${sampleCaseStudySlug()}`,
  "/brief",
];

function parseArgs(argv) {
  const out = {
    base: process.env.BASE_URL ?? "http://localhost:3107",
    passes: 2,
    routes: [],
    json: null,
    label: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--base") out.base = argv[++i];
    else if (a === "--passes") out.passes = Number(argv[++i]);
    else if (a === "--route") out.routes.push(argv[++i]);
    else if (a === "--json") out.json = argv[++i];
    else if (a === "--label") out.label = argv[++i];
    else if (a.startsWith("http")) out.base = a; // positional, as the sibling gates accept
    else if (a === "--help" || a === "-h") {
      console.log(
        "node scripts/check-phase8.mjs [--base URL] [--passes N] [--route PATH]... [--json FILE] [--label TEXT]",
      );
      process.exit(0);
    }
  }
  out.base = out.base.replace(/\/$/, "");
  if (!out.routes.length) out.routes = ROUTES;
  if (!Number.isFinite(out.passes) || out.passes < 1) out.passes = 2;
  return out;
}

/**
 * chrome-launcher needs a Chrome binary. A developer Mac has one; a CI runner
 * does not, but it already installs Playwright's Chromium for the other browser
 * gates. Reuse that rather than adding a second browser download to CI.
 */
function resolveChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  try {
    if (chromeLauncher.Launcher.getFirstInstallation()) return undefined;
  } catch {
    /* fall through to Playwright's copy */
  }
  const root = join(homedir(), "Library", "Caches", "ms-playwright");
  const linux = join(homedir(), ".cache", "ms-playwright");
  for (const dir of [root, linux]) {
    if (!existsSync(dir)) continue;
    const builds = readdirSync(dir)
      .filter((d) => /^chromium-\d+$/.test(d))
      .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
    for (const b of builds) {
      for (const rel of [
        join("chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"),
        join("chrome-linux", "chrome"),
      ]) {
        const p = join(dir, b, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  return undefined;
}

function reachable(base) {
  const r = spawnSync(
    "curl",
    ["-sf", "-o", "/dev/null", "-m", "20", "-w", "%{http_code}", base],
    { encoding: "utf8" },
  );
  return r.status === 0 ? r.stdout.trim() : null;
}

const fmtMs = (v) => (v == null ? "n/a" : `${Math.round(v)}ms`);
const fmtS = (v) => (v == null ? "n/a" : `${(v / 1000).toFixed(2)}s`);
const score = (v) => (v == null ? null : Math.round(v * 100));

async function measure(url, chromePort) {
  /* Default config, deliberately. That is the mobile preset: simulated
     throttling, 150ms RTT, 1,474 Kbps down, 4x CPU, mobile form factor —
     the same shape as a bare `npx lighthouse` run, so a number produced here
     and a number produced by hand are the same number. Categories are all four
     because the round 10 table reported all four and the comparison has to hold. */
  const runnerResult = await lighthouse(
    url,
    { port: chromePort, output: "json", logLevel: "error" },
    undefined,
  );
  if (!runnerResult) throw new Error(`Lighthouse returned nothing for ${url}`);
  const lhr = runnerResult.lhr;
  if (lhr.runtimeError?.code) {
    throw new Error(`${lhr.runtimeError.code}: ${lhr.runtimeError.message}`);
  }
  const a = lhr.audits;
  return {
    performance: score(lhr.categories.performance?.score),
    accessibility: score(lhr.categories.accessibility?.score),
    bestPractices: score(lhr.categories["best-practices"]?.score),
    seo: score(lhr.categories.seo?.score),
    lcpMs: a["largest-contentful-paint"]?.numericValue ?? null,
    fcpMs: a["first-contentful-paint"]?.numericValue ?? null,
    cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    tbtMs: a["total-blocking-time"]?.numericValue ?? null,
    siMs: a["speed-index"]?.numericValue ?? null,
    /* The single most useful diagnostic this repo has: if the LCP element is a
       text node, LCP is gated on font and CSS delivery, and no image work can
       move it. Round 10 measured exactly that on eight of eight routes. */
    lcpElement:
      a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]
        ?.node?.snippet ?? null,
    unusedJsKib: kib(a["unused-javascript"]),
    unusedCssKib: kib(a["unused-css-rules"]),
    renderBlockingMs: a["render-blocking-resources"]?.numericValue ?? null,
    fontDisplayPass: a["font-display"]?.score === 1,
    lighthouseVersion: lhr.lighthouseVersion,
  };
}

function kib(audit) {
  const bytes = audit?.details?.overallSavingsBytes;
  return bytes == null ? null : Math.round(bytes / 1024);
}

const args = parseArgs(process.argv.slice(2));

const status = reachable(args.base);
if (!status) {
  console.error(
    `check-phase8: nothing answering on ${args.base}.\n` +
      "Start a PRODUCTION server first and confirm it is the current build:\n" +
      "  NEXT_DIST_DIR=.next-a PORT=3107 pnpm start\n" +
      "  lsof -iTCP:3107 -sTCP:LISTEN\n" +
      "Never measure against `next dev`.",
  );
  process.exit(2);
}

const chromePath = resolveChromePath();
const chrome = await chromeLauncher.launch({
  chromePath,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const results = new Map();
let lhVersion = null;
let hardFailure = null;

try {
  console.log(
    `check-phase8: ${args.routes.length} route(s) x ${args.passes} pass(es) against ${args.base} (HTTP ${status})`,
  );
  if (args.label) console.log(`label: ${args.label}`);
  console.log("");

  for (const route of args.routes) {
    const passes = [];
    for (let p = 1; p <= args.passes; p++) {
      process.stdout.write(`  ${route}  pass ${p}/${args.passes} ... `);
      try {
        const m = await measure(args.base + route, chrome.port);
        lhVersion ??= m.lighthouseVersion;
        passes.push(m);
        console.log(
          `perf ${m.performance}  LCP ${fmtS(m.lcpMs)}  CLS ${m.cls?.toFixed(3)}  TBT ${fmtMs(m.tbtMs)}`,
        );
      } catch (err) {
        console.log(`FAILED — ${err.message}`);
        passes.push(null);
        hardFailure ??= `${route}: ${err.message}`;
      }
    }
    results.set(route, passes);
  }
} finally {
  await chrome.kill();
}

/* ---------- the table, in the shape round 10 reported it ---------- */

const P = args.passes;
console.log(`\n### Per route, ${P} pass(es) — Lighthouse ${lhVersion ?? "?"}\n`);
const perfCols = Array.from({ length: P }, (_, i) => `Perf p${i + 1}`);
const lcpCols = Array.from({ length: P }, (_, i) => `LCP p${i + 1}`);
console.log(
  `| Route | ${perfCols.join(" | ")} | ${lcpCols.join(" | ")} | CLS | TBT | FCP | A11y | BP | SEO |`,
);
console.log(
  `|---|${"---|".repeat(P * 2)}---|---|---|---|---|---|`.replace(/\|$/, "|"),
);

const cell = (passes, pick) => passes.map((m) => (m ? pick(m) : "err"));
const worst = (passes, pick) => {
  const vals = passes.filter(Boolean).map(pick).filter((v) => v != null);
  return vals.length ? Math.min(...vals) : null;
};

for (const [route, passes] of results) {
  const last = passes.filter(Boolean).at(-1);
  console.log(
    `| \`${route}\` | ${cell(passes, (m) => m.performance).join(" | ")} | ` +
      `${cell(passes, (m) => fmtS(m.lcpMs)).join(" | ")} | ` +
      `${last?.cls?.toFixed(3) ?? "err"} | ${fmtMs(last?.tbtMs)} | ${fmtS(last?.fcpMs)} | ` +
      `${last?.accessibility ?? "err"} | ${last?.bestPractices ?? "err"} | ${last?.seo ?? "err"} |`,
  );
}

console.log("\n### Diagnostics, last pass per route\n");
console.log(
  "| Route | LCP element | Unused JS | Unused CSS | Render-blocking | font-display |",
);
console.log("|---|---|---|---|---|---|");
for (const [route, passes] of results) {
  const m = passes.filter(Boolean).at(-1);
  if (!m) {
    console.log(`| \`${route}\` | err | err | err | err | err |`);
    continue;
  }
  const el = (m.lcpElement ?? "n/a").replace(/\s+/g, " ").slice(0, 58);
  console.log(
    `| \`${route}\` | \`${el}\` | ${m.unusedJsKib ?? "n/a"} KiB | ${m.unusedCssKib ?? "n/a"} KiB | ` +
      `${fmtMs(m.renderBlockingMs)} | ${m.fontDisplayPass ? "pass" : "FAIL"} |`,
  );
}

/* ---------- the verdict ---------- */

const misses = [];
const check = (name, routesFailing, detail) => {
  if (routesFailing.length) misses.push({ name, routesFailing, detail });
};

/* WORST pass, not best, and this is deliberate. Run-to-run variance on this
   site is wide — one route measured 96 then 89 with no code change between the
   two passes — so "it reached 90 once" is a statement about variance, not about
   the build. A gate whose green light authorises a DNS cutover has to fail on
   the bad pass. Round 10 read `/platforms/sap`'s 94-then-88 the same way and
   called it variance rather than a pass; this encodes that reading.
   The table above prints every pass, so the spread stays visible either way. */
const perfFails = [...results].filter(([, p]) => {
  const w = worst(p, (m) => m.performance);
  return w == null || w < GATE.performance;
});
const lcpFails = [...results].filter(([, p]) => {
  const vals = p.filter(Boolean).map((m) => m.lcpMs).filter((v) => v != null);
  return !vals.length || Math.max(...vals) >= GATE.lcpMs;
});
const clsFails = [...results].filter(([, p]) => {
  const vals = p.filter(Boolean).map((m) => m.cls).filter((v) => v != null);
  return !vals.length || Math.max(...vals) >= GATE.cls;
});
const tbtFails = [...results].filter(([, p]) => {
  const vals = p.filter(Boolean).map((m) => m.tbtMs).filter((v) => v != null);
  return !vals.length || Math.max(...vals) >= GATE.tbtMsProxy;
});

check("Lighthouse Mobile 90+", perfFails, `floor ${GATE.performance}`);
check("LCP < 2.5s", lcpFails, `ceiling ${GATE.lcpMs}ms`);
check("CLS < 0.1", clsFails, `ceiling ${GATE.cls}`);
check("TBT < 200ms (INP lab proxy)", tbtFails, `ceiling ${GATE.tbtMsProxy}ms`);

const n = results.size;
console.log("\n### Gate\n");
console.log("| Criterion | Result |");
console.log("|---|---|");
for (const [name, detail, failing] of [
  ["Lighthouse Mobile 90+", `floor ${GATE.performance}`, perfFails],
  ["LCP < 2.5s", "ceiling 2500ms", lcpFails],
  ["CLS < 0.1", "ceiling 0.1", clsFails],
  ["TBT < 200ms (INP lab proxy)", "ceiling 200ms", tbtFails],
]) {
  console.log(
    `| ${name} (${detail}) | ${
      failing.length ? `**MISS, ${failing.length} of ${n}**` : `PASS, ${n} of ${n}`
    } |`,
  );
}
console.log(
  "\nWCAG 2.2 AA is not judged here. `check:a11y` owns it: both registers, two widths,\n" +
    "and it sees rules the Lighthouse category weights at zero.",
);
console.log(
  "INP is a field metric. The row above is TBT, its lab proxy. A green TBT is not a green INP.",
);

if (args.json) {
  writeFileSync(
    args.json,
    `${JSON.stringify(
      {
        base: args.base,
        label: args.label,
        passes: P,
        lighthouseVersion: lhVersion,
        measuredAt: new Date().toISOString(),
        gate: GATE,
        routes: Object.fromEntries(results),
      },
      null,
      2,
    )}\n`,
  );
  console.log(`\nRaw results written to ${args.json}`);
}

if (hardFailure) {
  console.error(`\ncheck-phase8: at least one run errored — ${hardFailure}`);
  process.exit(2);
}
if (misses.length) {
  console.error(
    `\ncheck-phase8: gate NOT met — ${misses.map((m) => m.name).join("; ")}`,
  );
  process.exit(1);
}
console.log("\ncheck-phase8: gate met on every route measured.");
