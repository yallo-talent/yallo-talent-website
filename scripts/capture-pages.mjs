#!/usr/bin/env node
/**
 * Checkpoint screenshot harness.
 *
 *   node scripts/capture-pages.mjs --tag <checkpoint> [--routes /,/contract] \
 *     [--widths 1280,390] [--themes light,dark] [--ambient spectrum]
 *
 * Writes docs/status/screens/<tag>/<route>-<width>-<theme>[-<ambient>].png
 *
 * Traps this encodes (learned the hard way, see the session handover):
 *   - networkidle never settles on pages with lazy images: use load + settle.
 *   - next/image lazy-loads; scroll the page and wait for image completion
 *     before a fullPage capture, or logos capture as empty tiles.
 *   - Theme is data-theme on <html>; the init script reads localStorage, so
 *     set both before navigation.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : dflt;
};

const tag = arg("tag", "adhoc");
const routes = arg("routes", "/").split(",");
const widths = arg("widths", "1280,390").split(",").map(Number);
const themes = arg("themes", "light,dark").split(",");
const ambients = arg("ambient", "").split(",").filter(Boolean);
const base = process.env.CAPTURE_BASE ?? "http://localhost:3000";

const dir = `docs/status/screens/${tag}`;
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();

for (const width of widths) {
  for (const theme of themes) {
    for (const ambient of ambients.length ? ambients : [null]) {
      const ctx = await browser.newContext({
        viewport: { width, height: width < 700 ? 844 : 800 },
        reducedMotion: "no-preference",
        colorScheme: theme === "dark" ? "dark" : "light",
      });
      await ctx.addInitScript(
        ([t, a]) => {
          try {
            localStorage.setItem("yallo-theme", t);
          } catch {}
          const stamp = () => {
            document.documentElement.setAttribute("data-theme", t);
            if (a) document.documentElement.setAttribute("data-ambient", a);
          };
          stamp();
          document.addEventListener("DOMContentLoaded", stamp);
        },
        [theme, ambient],
      );

      for (const route of routes) {
        const page = await ctx.newPage();
        await page.goto(base + route, { waitUntil: "load", timeout: 30000 });

        // Walk the page so lazy images request, then wait for completion.
        await page.evaluate(async () => {
          const step = window.innerHeight;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
        });
        await page
          .waitForFunction(
            () =>
              [...document.images]
                .filter((i) => i.loading !== "lazy" || i.getBoundingClientRect().width > 0)
                .every((i) => i.complete),
            { timeout: 8000 },
          )
          .catch(() => {}); // rail images legitimately never load — capture anyway
        await page.waitForTimeout(350);

        const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
        const name = `${slug}-${width}-${theme}${ambient ? `-${ambient}` : ""}.png`;
        await page.screenshot({ path: `${dir}/${name}`, fullPage: true });
        console.log(`${dir}/${name}`);
        await page.close();
      }
      await ctx.close();
    }
  }
}

await browser.close();
