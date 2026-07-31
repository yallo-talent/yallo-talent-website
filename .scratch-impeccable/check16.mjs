import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3100/platforms/sap", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);
const res = await page.evaluate(() => {
  let scriptCount = 0, nonScript16 = [];
  document.querySelectorAll("body *").forEach(el => {
    let hasText = false;
    for (const node of el.childNodes) { if (node.nodeType===3 && node.textContent.trim()) { hasText = true; break; } }
    if (!hasText) return;
    if (el.tagName === "SCRIPT") { scriptCount++; return; }
    if (parseFloat(getComputedStyle(el).fontSize) === 16) nonScript16.push({tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0,40)});
  });
  return { scriptCount, nonScript16 };
});
console.log(JSON.stringify(res, null, 2));
await browser.close();
