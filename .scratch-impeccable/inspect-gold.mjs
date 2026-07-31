import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });
await ctx.addInitScript(() => { try { localStorage.setItem("yallo-theme","light"); } catch {} });
const page = await ctx.newPage();
await page.goto("http://localhost:3100/platforms/sap", { waitUntil: "domcontentloaded" });
await page.evaluate(() => { document.documentElement.dataset.theme = "light"; });
await page.waitForTimeout(600);

const info = await page.evaluate(() => {
  const results = [];
  for (const el of document.querySelectorAll("em, svg, path, title")) {
    const cs = getComputedStyle(el);
    if (cs.color === "rgb(212, 168, 67)" || cs.stroke === "rgb(212, 168, 67)") {
      let ancestorClasses = [];
      let p = el.parentElement;
      let depth = 0;
      while (p && depth < 6) { ancestorClasses.push(p.tagName + (p.className ? "."+String(p.className).slice(0,40) : "")); p = p.parentElement; depth++; }
      results.push({
        tag: el.tagName,
        className: el.className,
        outerHTMLSnippet: el.outerHTML.slice(0, 200),
        ancestors: ancestorClasses,
      });
    }
  }
  return results;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
