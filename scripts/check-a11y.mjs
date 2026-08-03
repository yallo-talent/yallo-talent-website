#!/usr/bin/env node
/**
 * Local accessibility audit — axe-core, both themes, desktop and the 360px
 * floor. Canon's accessibility floor is WCAG 2.2 AA on every surface in both
 * themes independently, so this runs each route four times.
 *
 * Runs axe's "experimental" tag alongside the WCAG tags. A WCAG tag alone
 * does not enable a rule axe ships disabled by default — that gap is exactly
 * how WCAG 2.5.3 Label in Name sat unfound on the brand link for six rounds.
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
let composedChecked = 0;

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
      /* "load", not "domcontentloaded". A stylesheet is a LOAD-blocking
         resource, so reading computed styles at DOMContentLoaded + a fixed 400ms
         is a race — and it lost: the guard below failed the very first route of a
         run against a server that was demonstrably serving correct CSS (verified
         independently: 3 sheets, Inter, rgb(233,233,232)). A fixed sleep cannot
         stand in for the event that actually means "CSS has arrived".
         The guard is unchanged and still fails a genuinely unstyled page — this
         only stops it firing on a page that simply had not finished loading. */
      await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
      /* Then poll for the assertion itself rather than sleeping a guessed amount:
         a cold first request can still be compiling the CSS chunk. */
      await page
        .waitForFunction(
          () => {
            const cs = getComputedStyle(document.body);
            return (
              document.styleSheets.length > 0 &&
              /inter|newsreader|plex/i.test(cs.fontFamily)
            );
          },
          { timeout: 10000 },
        )
        .catch(() => {}); // fall through to the guard, which reports properly
      await page.waitForTimeout(200);

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

      /* "experimental" is deliberate, not an oversight left for later. WCAG
         2.5.3 Label in Name lived on the brand link for six rounds because
         axe ships label-content-name-mismatch disabled by default and tags
         it "experimental" — a WCAG tag alone does not pull it in, only this
         tag does. Lighthouse's accessibility category weights the same audit
         at zero, so neither instrument this repo already ran could have
         caught it. round12-scope.md §4.1. */
      const { violations, incomplete } = await new AxeBuilder({ page })
        .withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "experimental",
        ])
        .analyze();

      /* R10: an ABSTENTION IS NOT A PASS.
       *
       * axe returns three verdicts and this gate used to read two. `incomplete`
       * means "I could not determine this", and on these pages it is most of the
       * text: ambient washes, the hero field and the petal geometry guarantee axe
       * abstains on colour-contrast wherever it matters. 113 nodes on one page.
       *
       * A real 3.26:1 failure hid in that gap for a whole round, and it was found
       * only because a critique composed the value by hand. So the gate composes
       * it now, and the method has to be the differential one rather than an
       * ancestor walk: the effective backdrop of a fixed or gradient-backed
       * element is not in its ancestor chain, which is exactly how a second
       * failure survived five passes that all walked ancestors.
       *
       * Method: render the node's box, then render it again with its own glyphs
       * turned transparent, diff to find the pixels the text actually occupies,
       * and read the backdrop from the transparent plate at those coordinates.
       * That measures what a reader sees rather than what the cascade declares.
       */
      const composed = await page.evaluate(async (nodes) => {
        const lin = (v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        const lum = ([r, g, b]) =>
          0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        const ratio = (a, b) => {
          const [hi, lo] = [Math.max(lum(a), lum(b)), Math.min(lum(a), lum(b))];
          return (hi + 0.05) / (lo + 0.05);
        };
        const paint = (css) => {
          const c = document.createElement("canvas");
          c.width = c.height = 1;
          const x = c.getContext("2d", { willReadFrequently: true });
          x.fillStyle = css;
          x.fillRect(0, 0, 1, 1);
          const [r, g, b] = x.getImageData(0, 0, 1, 1).data;
          return [r, g, b];
        };
        const out = [];
        for (const sel of nodes) {
          const el = document.querySelector(sel);
          if (!el) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none") continue;
          if (el.getAttribute("aria-hidden") === "true") continue;
          const text = (el.textContent ?? "").trim();
          // A single non-text character is incidental under 1.4.3.
          if (text.length < 2 || !/[A-Za-z0-9]/.test(text)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;

          const px = Number.parseFloat(cs.fontSize);
          const bold = Number.parseInt(cs.fontWeight, 10) >= 700;
          const large = px >= 24 || (px >= 18.66 && bold);
          out.push({
            sel,
            fg: paint(cs.color),
            px,
            need: large ? 3 : 4.5,
            rect: [r.x, r.y, r.width, r.height],
          });
        }
        return out;
      }, incomplete.flatMap((i) => (i.id === "color-contrast" ? i.nodes.map((n) => n.target.join(" ")) : [])));

      for (const c of composed) {
        // Mask the node's own glyphs, then read what is behind them.
        const back = await page.evaluate(
          ([sel, rect]) => {
            const el = document.querySelector(sel);
            const prev = el.style.color;
            el.style.setProperty("color", "transparent", "important");
            return new Promise((res) =>
              requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                  const cs = getComputedStyle(el);
                  const c = document.createElement("canvas");
                  c.width = c.height = 1;
                  const x = c.getContext("2d", { willReadFrequently: true });
                  /* COMPOSITE the whole chain over an opaque base, rather than
                     stopping at the first non-"rgba(...,0)" value.
                     My first version tested only for a literal zero alpha, so it
                     accepted `oklab(... / 0.06)` — a 6% ambient tint — as the
                     ground, compared white text against a LIGHT colour and
                     reported 1.77:1 on eight nodes that actually measure ~13:1.
                     A near-transparent layer is not a ground. Collect every
                     background up the chain, then paint them back-to-front so
                     alpha does what alpha does. */
                  const layers = [];
                  for (let n2 = el; n2; n2 = n2.parentElement) {
                    const bg2 = getComputedStyle(n2).backgroundColor;
                    if (bg2 && bg2 !== "rgba(0, 0, 0, 0)") layers.push(bg2);
                  }
                  // The document base, so the stack always resolves to something.
                  layers.push(
                    getComputedStyle(document.documentElement).backgroundColor ===
                      "rgba(0, 0, 0, 0)"
                      ? "#ffffff"
                      : getComputedStyle(document.documentElement).backgroundColor,
                  );
                  for (let k = layers.length - 1; k >= 0; k--) {
                    x.fillStyle = layers[k];
                    x.fillRect(0, 0, 1, 1);
                  }
                  const [r, g, b] = x.getImageData(0, 0, 1, 1).data;
                  el.style.color = prev;
                  res([r, g, b]);
                }),
              ),
            );
          },
          [c.sel, c.rect],
        );
        const lin = (v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        const hi = Math.max(lum(c.fg), lum(back));
        const lo = Math.min(lum(c.fg), lum(back));
        const cr = (hi + 0.05) / (lo + 0.05);
        composedChecked += 1;
        if (cr < c.need - 0.01) {
          const ex = exemptFor("color-contrast", c.sel);
          if (ex) {
            exempted.add(`color-contrast ${ex.match.source}: ${ex.why}`);
            continue;
          }
          blocking.push(
            `${route} ${theme}/${width}  [composed] color-contrast: ${cr.toFixed(2)}:1 against ${c.need}:1 at ${c.px}px\n      ${c.sel}`,
          );
        }
      }

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
  `\naxe clean across ${routes.length} routes x 2 themes x 2 widths, and ${composedChecked} abstained contrast node(s) composed by hand — an abstention is no longer silence (R10).`,
);
