/**
 * Shell derivation, shared. check-gate-coverage.mjs and check-a11y.mjs both
 * need "which distinct rendering unit does this route belong to" — the unit
 * being the SHELL a page composes, or the page itself when it composes none.
 * One implementation, so a shell added to the design system is recognised
 * by both without being taught to each by hand. See
 * docs/design/context-round14-scope.md §2.2.
 */
import { globSync, readFileSync } from "node:fs";

const SHELLS =
  /\b(L1PageShell|L1HubShell|L2PageShell|ServicePageShell|LegalPageShell|PlatformModuleShell|EditorialShell)\b/;

/** Every route template in the app tree, route groups stripped. */
export function routeTemplates() {
  return globSync("src/app/**/page.tsx")
    .map((f) => f.replace(/^src\/app/, "").replace(/\/page\.tsx$/, "") || "/")
    .map((t) => t.replace(/\/\([^/]+\)/g, "") || "/")
    .sort();
}

/** The shared shell a template's page.tsx imports, or the template itself. */
export function shellOf(template) {
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

const segsOf = (p) => p.split("/").filter(Boolean);

/** Which template renders a concrete path. Literal segments beat dynamic ones. */
export function templateFor(path, templates) {
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

/**
 * One live URL per distinct shell — every reachable rendering unit exactly
 * once, selected by shell identity rather than a hand-picked route list.
 * This is the derivation §2.2 requires for check-a11y's default (PR-gate)
 * run: visiting one example per unit visits every unit, without visiting
 * every URL.
 */
export function sampleOnePerShell(livePaths) {
  const templates = routeTemplates();
  const example = new Map();
  for (const path of livePaths) {
    const t = templateFor(path, templates);
    if (!t) continue;
    const key = shellOf(t);
    if (!example.has(key)) example.set(key, path);
  }
  return [...example.values()];
}
