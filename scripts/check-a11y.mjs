#!/usr/bin/env node
/**
 * Local accessibility audit — axe-core, both themes, desktop and the 360px
 * floor. Canon's accessibility floor is WCAG 2.2 AA on every surface in both
 * themes independently, so this runs each route four times.
 *
 * Lighthouse is deliberately NOT here: it needs the real host, and a score
 * measured against a dev server would be a number with no meaning.
 *
 *   node scripts/check-a11y.mjs [--routes /,/ai-talent] [--base http://…]
 *
 * Exits non-zero on any serious or critical violation. Moderate and minor are
 * reported but do not fail — they are the backlog, not the gate.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};

const base = arg("base", "http://localhost:3000");
const routes = arg(
  "routes",
  "/,/ai-talent,/platforms/microsoft,/contract,/case-studies,/industries/retail",
).split(",");

/**
 * Exemptions, each with the clause that grants it. WCAG 1.4.3 does not apply to
 * logotypes or to purely incidental text, and axe cannot know which is which.
 * A selector belongs here only with a reason; anything else is a defect.
 */
const EXEMPT = [
  {
    rule: "color-contrast",
    match: /brandMark/,
    why: "WCAG 1.4.3 exempts text that is part of a logo or brand name. This is the Yallo wordmark inside the lockup, set in the brand gold taken from the mark itself.",
  },
  {
    rule: "color-contrast",
    match: /__ghost/,
    why: "WCAG 1.4.3 exempts incidental text. These are the aria-hidden ghost numerals bled off the step cards — texture, carrying no information, and DESIGN.md specifies them as barely-there by intent.",
  },
];

const exemptFor = (ruleId, target) =>
  EXEMPT.find((e) => e.rule === ruleId && e.match.test(target));

const browser = await chromium.launch();
const blocking = [];
const advisory = [];
const exempted = new Set();

for (const theme of ["light", "dark"]) {
  for (const width of [1280, 360]) {
    const ctx = await browser.newContext({
      viewport: { width, height: width < 700 ? 800 : 900 },
      colorScheme: theme,
    });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("yallo-theme", t);
      } catch {}
      const stamp = () =>
        document.documentElement.setAttribute("data-theme", t);
      stamp();
      document.addEventListener("DOMContentLoaded", stamp);
    }, theme);

    for (const route of routes) {
      const page = await ctx.newPage();
      // `domcontentloaded`, not `load` — the same change and the same reason as
      // in capture-home.mjs. `load` additionally waits for every subresource,
      // including the eighteen optimised client marks, and on a cold CI runner
      // that exceeded 30s and failed the gate on a timing artefact rather than
      // on anything about the page. Stylesheets are render-blocking, so they are
      // applied before DOMContentLoaded fires, which is what axe actually needs
      // to compute contrast and target geometry. The rule set below is unchanged.
      await page.goto(base + route, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(400);

      // Positive assertion that the CSS actually arrived, because axe on an
      // unstyled page does not error — it reports a wall of plausible-looking
      // target-size and contrast failures. A stale local server serving a
      // deleted build (500 on every CSS chunk) produced exactly that, and the
      // findings read as real defects until the computed styles were inspected.
      const styled = await page.evaluate(() => {
        const cs = getComputedStyle(document.body);
        return {
          sheets: document.styleSheets.length,
          // globals.css sets these; unstyled they are the browser defaults.
          font: cs.fontFamily,
          bg: cs.backgroundColor,
        };
      });
      if (!styled.sheets || !/inter|newsreader|plex/i.test(styled.font)) {
        console.error(
          `\n✗ ${route} ${theme}/${width}: stylesheets did not apply ` +
            `(${styled.sheets} sheet(s), body font ${styled.font}, bg ${styled.bg}).\n` +
            "  Refusing to report axe results for an unstyled page. Check the " +
            "server is serving the current build.",
        );
        process.exit(1);
      }

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      for (const v of violations) {
        // Drop exempt nodes first, then judge what is left.
        const nodes = v.nodes.filter((n) => {
          const ex = exemptFor(v.id, n.target.join(" "));
          if (ex) {
            exempted.add(`${v.id} ${ex.match.source}: ${ex.why}`);
            return false;
          }
          return true;
        });
        if (!nodes.length) continue;

        const line = `${route} ${theme}/${width}  [${v.impact}] ${v.id}: ${v.help} (${nodes.length} node${nodes.length === 1 ? "" : "s"})\n      ${nodes[0].target.join(" ")}`;
        if (v.impact === "serious" || v.impact === "critical") blocking.push(line);
        else advisory.push(line);
      }
      await page.close();
    }
    await ctx.close();
  }
}

await browser.close();

if (advisory.length) {
  console.log(`\n${advisory.length} moderate/minor finding(s) — backlog:`);
  for (const a of [...new Set(advisory)]) console.log(`  ${a}`);
}

if (blocking.length) {
  console.error(`\n${blocking.length} serious/critical violation(s):\n`);
  for (const b of [...new Set(blocking)]) console.error(`  ${b}`);
  process.exit(1);
}

if (exempted.size) {
  console.log(`\n${exempted.size} exemption(s) applied, each with its clause:`);
  for (const e of exempted) console.log(`  ${e}`);
}

console.log(
  `\naxe clean: no serious or critical violations across ${routes.length} routes x 2 themes x 2 widths.`,
);
