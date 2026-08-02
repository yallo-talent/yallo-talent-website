#!/usr/bin/env node
/**
 * check-gate-coverage — the guard on the guards.
 *
 * WHY THIS EXISTS. Twice in round 3 the LIST failed, not the rule. /ai-talent
 * shipped six classes at 13px sans against A4's 14px floor and check-rendered-type
 * would have caught every one of them on sight; it never looked, because the page
 * was not on its list. Every gate that enumerates routes is only as good as its
 * enumeration, and three page families landed in one round.
 *
 * A standing rule in AGENTS.md says a new template joins every enumerating guard
 * in the commit that introduces it. A rule nobody can forget is better than a
 * rule everybody is told to remember, so this checks it.
 *
 * HOW. Route templates come from the filesystem, which cannot be out of date, and
 * example URLs come from the live sitemap, so a dynamic template resolves to a
 * real slug rather than a guess someone has to maintain. Then each enumerating
 * gate's own list is read out of its source and mapped back to templates.
 *
 *   node scripts/check-gate-coverage.mjs [baseUrl]
 *
 * FAILS when a template is covered by NO enumerating gate at all. Reports, per
 * gate, which templates it omits: the gates have genuinely different remits —
 * check-motion visits animated pages, not /terms — so a per-gate gap is a
 * judgement, and a template nothing visits is a hole.
 */

import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3001";

/** Every enumerating gate, and the binding it declares its list under. */
const GATES = [
  "check-interaction",
  "check-motion",
  "check-reflow",
  "check-rendered-type",
  "check-yallo-case",
  /* Round 7. A new page template joins every enumerating guard in the commit
     that introduces it, and a new enumerating guard joins this list the same
     way — otherwise the coverage report describes a smaller set of gates than
     the repository actually runs. check-marks enumerates the pages that render
     a mark; check-crawler-access enumerates HOSTS rather than routes, so it is
     deliberately absent. */
  "check-marks",
];

/* ------------------------------------------------------- route templates -- */

const templates = globSync("src/app/**/page.tsx")
  .map((f) => f.replace(/^src\/app/, "").replace(/\/page\.tsx$/, "") || "/")
  // Route groups (folders in parentheses) are not URL segments.
  .map((t) => t.replace(/\/\([^/]+\)/g, "") || "/")
  .sort();

const segsOf = (p) => p.split("/").filter(Boolean);

/* The unit of coverage is the SHELL, not the route file. Six sector pages are
   six page.tsx files and one L1PageShell, so visiting retail visits all six —
   demanding a gate visit each would be noise, and noise is how a list stops
   being read. A page that renders no shared shell is its own unit: bespoke is
   exactly the case nothing else covers. /ai-talent proved that one. */
const SHELLS =
  /\b(L1PageShell|L1HubShell|L2PageShell|ServicePageShell|LegalPageShell|PlatformModuleShell|EditorialShell)\b/;

function shellOf(template) {
  const file =
    template === "/"
      ? "src/app/page.tsx"
      : `src/app/${template.slice(1)}/page.tsx`;
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    return `bespoke:${template}`;
  }
  const imports = [...src.matchAll(/^import\s+\{([^}]+)\}\s+from/gm)]
    .flatMap((m) => m[1].split(","))
    .map((s) => s.trim().split(/\s+as\s+/)[0]);
  const shell = imports.find((n) => SHELLS.test(n));
  return shell ?? `bespoke:${template}`;
}

/** Which template renders a concrete path. Literal segments beat dynamic ones. */
function templateFor(path) {
  const seg = segsOf(path);
  const hits = templates.filter((t) => {
    const ts = segsOf(t);
    if (ts.length !== seg.length) return false;
    return ts.every((s, i) => s === seg[i] || /^\[.+\]$/.test(s));
  });
  if (!hits.length) return null;
  const literalCount = (t) => segsOf(t).filter((s) => !s.startsWith("[")).length;
  return hits.sort((a, b) => literalCount(b) - literalCount(a))[0];
}

/* ------------------------------------------------------------- sitemap ---- */

let live = [];
try {
  const xml = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  live = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    new URL(m[1]).pathname.replace(/\/$/, "") || "/",
  );
} catch {
  console.error(
    `Could not read ${BASE}/sitemap.xml. Start the dev server first, or pass its base URL.`,
  );
  process.exit(1);
}

/** One real URL per template, so a dynamic route is exercised with a real slug. */
const example = new Map();
for (const path of live) {
  const t = templateFor(path);
  if (t && !example.has(t)) example.set(t, path);
}

/* ------------------------------------------------------------ the lists -- */

const listOf = (gate) => {
  const src = readFileSync(`scripts/${gate}.mjs`, "utf8");
  const m = src.match(/const (?:PAGES|ROUTES) = (\[[\s\S]*?\]);/);
  if (!m) return null;
  return [...m[1].matchAll(/"(\/[^"]*)"/g)].map((x) => x[1].replace(/\/$/, "") || "/");
};

/** shell -> { templates, reachable example, gates that visit it } */
const units = new Map();
for (const t of templates) {
  const key = shellOf(t);
  if (!units.has(key))
    units.set(key, { templates: [], example: null, gates: new Set() });
  const u = units.get(key);
  u.templates.push(t);
  if (!u.example && example.has(t)) u.example = example.get(t);
}

const problems = [];
for (const gate of GATES) {
  const list = listOf(gate);
  if (!list) {
    problems.push(`${gate}: no PAGES or ROUTES list found — has it been renamed?`);
    continue;
  }
  for (const path of list) {
    const t = templateFor(path);
    if (!t) {
      problems.push(`${gate}: "${path}" matches no route template — a stale entry`);
      continue;
    }
    units.get(shellOf(t)).gates.add(gate);
  }
}

/* ------------------------------------------------------------- report ---- */

const reachable = [...units.entries()].filter(([, u]) => u.example);
const unreachable = [...units.entries()].filter(([, u]) => !u.example);

console.log(
  `Gate coverage · ${templates.length} route templates in ${units.size} rendering unit(s) · ` +
    `${live.length} live URLs · ${GATES.length} enumerating gates\n`,
);

for (const gate of GATES) {
  const gaps = reachable.filter(([, u]) => !u.gates.has(gate));
  console.log(
    `  ${gate.padEnd(22)} ${reachable.length - gaps.length}/${reachable.length} units`,
  );
  if (gaps.length)
    console.log(`    omits: ${gaps.map(([k]) => k.replace("bespoke:", "")).join(" ")}`);
}

if (unreachable.length)
  console.log(
    `\n  ${unreachable.length} unit(s) with no live URL, so nothing can visit them:\n` +
      unreachable
        .map(([k, u]) => `    ${k.replace("bespoke:", "")}  (${u.templates.join(" ")})`)
        .join("\n"),
  );

if (problems.length) {
  console.error(`\n${problems.length} list problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
}

const holes = reachable.filter(([, u]) => u.gates.size === 0);
if (holes.length || problems.length) {
  if (holes.length) {
    console.error(`\n${holes.length} unit(s) visited by NO enumerating gate:`);
    for (const [k, u] of holes)
      console.error(`  ${k.replace("bespoke:", "").padEnd(28)} e.g. ${u.example}`);
    console.error(
      "\nAGENTS.md: a new template joins every enumerating guard in the commit that\n" +
        "introduces it. Add these to the gates whose remit covers them, then re-run.",
    );
  }
  process.exit(1);
}

console.log(
  `\nEvery rendering unit with a live URL is visited by at least one gate. ` +
    `${GATES.length} lists read from source, none stale.`,
);
