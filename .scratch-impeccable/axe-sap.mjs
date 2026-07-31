import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const base = "http://localhost:3100";
const route = "/platforms/sap";

const configs = [
  { theme: "light", width: 1280, height: 900 },
  { theme: "dark", width: 1280, height: 900 },
  { theme: "light", width: 390, height: 844 },
  { theme: "dark", width: 390, height: 844 },
];

const browser = await chromium.launch();
let anyFailed = false;

for (const cfg of configs) {
  const ctx = await browser.newContext({
    viewport: { width: cfg.width, height: cfg.height },
    colorScheme: cfg.theme,
  });
  await ctx.addInitScript((t) => {
    try { localStorage.setItem("yallo-theme", t); } catch {}
  }, cfg.theme);

  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, cfg.theme);
  await page.waitForTimeout(600);

  const styled = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    return {
      sheets: document.styleSheets.length,
      font: cs.fontFamily,
      bg: cs.backgroundColor,
    };
  });

  console.log(`\n=== ${cfg.theme} ${cfg.width}x${cfg.height} ===`);
  console.log(`  precondition: sheets=${styled.sheets} font="${styled.font}" bg="${styled.bg}"`);

  if (!styled.sheets || !/inter|newsreader|plex/i.test(styled.font) || /rgba?\(0, 0, 0, 0\)|rgb\(255, 255, 255\)/.test(styled.bg)) {
    console.error(`  STOP: CSS did not load or body is unstyled white/transparent. Refusing to report axe results.`);
    anyFailed = true;
    await page.close();
    await ctx.close();
    continue;
  }

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  if (!violations.length) {
    console.log("  axe: clean, 0 violations.");
  } else {
    for (const v of violations) {
      console.log(`  [${v.impact}] ${v.id} (${v.nodes.length} node${v.nodes.length===1?"":"s"}): ${v.help}`);
      for (const n of v.nodes.slice(0, 10)) {
        const ratioMatch = (n.failureSummary || "").match(/contrast ratio of ([\d.]+)/);
        console.log(`      selector: ${n.target.join(" ")}${ratioMatch ? `  ratio=${ratioMatch[1]}` : ""}`);
      }
    }
  }

  await page.close();
  await ctx.close();
}

await browser.close();
process.exit(anyFailed ? 1 : 0);
