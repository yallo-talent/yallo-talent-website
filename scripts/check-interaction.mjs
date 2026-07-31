/**
 * check-interaction — the four classes no other gate can see.
 *
 * Why this exists. Four rounds of critique converged on one pattern: the design
 * system held under adversarial measurement while every new P1 arrived in a
 * category nothing instrumented. Pass 2 found A4 role minimums, pass 3 found
 * keyboard traversal of shared chrome and fixed-overlay occlusion, pass 4 found
 * drawer modality and effective-vs-declared hover cues. Each was fixed at the
 * site the critique named, and the next pass found the same class elsewhere.
 *
 * These are the four the last pass proposed. None needs a canon amendment, and
 * every one of them caught a real defect during this run:
 *
 *   1. DISMISSIBLE (WCAG SC 1.4.13). The header mega panels opened on focus and
 *      Escape did nothing, so reaching the primary CTA took 33 tab stops because
 *      forward traversal opened all four panels and walked each. axe cannot see
 *      it.
 *   2. OCCLUSION. Two sticky surfaces each reduced a live read-next link to zero
 *      clickable area — one at 80% scroll, one at the terminal position where
 *      End lands.
 *   3. HEADING LEVEL vs ROLE. Two top-level sections had an h3 as their only
 *      heading among h2 peers, so assistive tech nested the page's
 *      differentiating product as a child of the section above it. axe's
 *      heading-order passes, because 2 to 3 is not a skip.
 *   4. REPETITION. "72 hours" appeared eight times on one page and a hero dot
 *      restated the stats strip verbatim 70px below it — canon §2's copy tell.
 *
 * Usage: node scripts/check-interaction.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3100";

const PAGES = [
  "/",
  "/platforms/sap",
  "/platforms/sap/sap-datasphere",
  "/capabilities/data-analytics",
  "/industries/retail",
];

/** Tab stops allowed before the header's primary CTA. */
const MAX_STOPS_TO_CTA = 12;
/** A phrase this long, repeated this often, is a tell rather than a motif. */
const PHRASE_WORDS = 4;
const MAX_REPEATS = 2;

const browser = await chromium.launch();
const failures = [];
const notes = [];

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (!res?.ok()) {
    failures.push(`${path}  did not load (HTTP ${res?.status() ?? "none"})`);
    await page.close();
    continue;
  }

  // The styled assert. Every critique that skipped this produced false findings,
  // and a weak threshold is worse than none: a 153-rule partial build passed a
  // ">= 100 rules" check with the right body colour AND the right font.
  const styled = await page.evaluate(() => {
    let rules = 0;
    for (const s of document.styleSheets) {
      try {
        rules += s.cssRules.length;
      } catch {
        /* cross-origin, ignore */
      }
    }
    return { rules, bg: getComputedStyle(document.body).backgroundColor };
  });
  if (styled.rules < 600) {
    failures.push(
      `${path}  only ${styled.rules} CSS rules — a partial build, refusing to judge it`,
    );
    await page.close();
    continue;
  }

  // ── 1. SC 1.4.13: every popup trigger must be dismissible ────────────────
  const triggers = page.locator('[aria-haspopup="true"]');
  const nTriggers = await triggers.count();
  for (let i = 0; i < nTriggers; i++) {
    const t = triggers.nth(i);
    await t.focus();
    await page.waitForTimeout(120);
    // Focus alone must not open it: focus-to-open is what inflates tab traversal.
    if ((await t.getAttribute("aria-expanded")) === "true") {
      failures.push(
        `${path}  trigger ${i} opens on FOCUS — SC 1.4.13, and it puts the panel's contents in the tab sequence`,
      );
      continue;
    }
    await t.press("Enter");
    await page.waitForTimeout(200);
    if ((await t.getAttribute("aria-expanded")) !== "true") continue; // not a toggle
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    if ((await t.getAttribute("aria-expanded")) === "true") {
      failures.push(
        `${path}  trigger ${i} cannot be dismissed with Escape — SC 1.4.13 (Dismissible)`,
      );
    }
  }

  // Tab stops to the header's primary CTA.
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  let stops = 0;
  let reached = false;
  for (; stops < 40; stops++) {
    await page.keyboard.press("Tab");
    const hit = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a) return false;
      const inHeader = !!a.closest("header");
      const href = a.getAttribute?.("href") ?? "";
      return inHeader && href.startsWith("/brief");
    });
    if (hit) {
      reached = true;
      break;
    }
  }
  if (reached && stops + 1 > MAX_STOPS_TO_CTA) {
    failures.push(
      `${path}  ${stops + 1} tab stops to the header CTA, over the ${MAX_STOPS_TO_CTA} budget`,
    );
  }

  // ── 2. Fixed overlays must not cover interactive content ─────────────────
  // Checked at rest, at 80% and at the terminal scroll position, because the
  // defect this catches appeared at 0.807 and again where End lands.
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (const frac of [0.4, 0.8, 1]) {
    await page.evaluate((f) => window.scrollTo(0, document.documentElement.scrollHeight * f), frac);
    await page.waitForTimeout(1100);
    const blocked = await page.evaluate(() => {
      const out = [];
      const fixed = [...document.querySelectorAll("*")].filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.position === "fixed" &&
          cs.visibility !== "hidden" &&
          cs.display !== "none" &&
          el.getBoundingClientRect().width > 0
        );
      });
      if (fixed.length === 0) return out;
      for (const a of document.querySelectorAll("a[href], button")) {
        const r = a.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        if (r.bottom < 0 || r.top > innerHeight) continue;
        if (fixed.some((f) => f.contains(a))) continue; // the overlay's own controls
        let hits = 0;
        for (let i = 1; i <= 3; i++) {
          for (let j = 1; j <= 3; j++) {
            const el = document.elementFromPoint(
              r.x + (r.width * i) / 4,
              r.y + (r.height * j) / 4,
            );
            if (el && (a === el || a.contains(el))) hits++;
          }
        }
        if (hits === 0) {
          out.push(
            `${(a.textContent ?? "").trim().slice(0, 30)} [${a.getAttribute("href") ?? "button"}]`,
          );
        }
      }
      return out;
    });
    for (const bl of blocked) {
      failures.push(
        `${path} @${Math.round(frac * 100)}% scroll  a fixed overlay fully covers "${bl}" — 0 of 9 hit points`,
      );
    }
  }

  // ── 3. A section's first heading must match its peers' level ─────────────
  await page.evaluate(() => window.scrollTo(0, 0));
  const outline = await page.evaluate(() => {
    const sections = [...document.querySelectorAll("main section")].filter(
      (s) => !s.closest("section section"),
    );
    const levels = [];
    for (const s of sections) {
      const h = s.querySelector("h1, h2, h3, h4");
      if (h) levels.push({ level: +h.tagName[1], text: (h.textContent ?? "").trim().slice(0, 40) });
    }
    return levels;
  });
  if (outline.length > 2) {
    const counts = new Map();
    for (const o of outline) counts.set(o.level, (counts.get(o.level) ?? 0) + 1);
    const [modal] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    for (const o of outline) {
      if (o.level !== modal && o.level !== 1) {
        failures.push(
          `${path}  a top-level section leads with h${o.level} while its peers use h${modal} — "${o.text}"`,
        );
      }
    }
  }

  // ── 4. Canon §2's copy tell: the same phrase said three times ────────────
  const repeats = await page.evaluate(
    ([words, max]) => {
      /* Prose only. A role name repeating across module cards is DATA — "SAP CPI
         Integration Developer" appears on five SAP modules because the same desk
         is staffed on five of them, and flagging that as a copy tell would train
         everyone to ignore this check. Chips, role lists and index links are
         excluded; headings, ledes and paragraphs are not. */
      const main = document.querySelector("main")?.cloneNode(true);
      if (!main) return [];
      for (const el of main.querySelectorAll(
        '[class*="role-pill"], [class*="RolePill"], [class*="expCardRole"], ' +
          '[class*="scarceRowName"], [class*="moduleIndex"], [class*="rtag"], ' +
          '[class*="segRoles"], [class*="roleList"]',
      )) {
        el.remove();
      }
      const text = (main.innerText ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9\s·]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      const seen = new Map();
      for (let i = 0; i + words <= text.length; i++) {
        const k = text.slice(i, i + words).join(" ");
        seen.set(k, (seen.get(k) ?? 0) + 1);
      }
      return [...seen.entries()]
        .filter(([, n]) => n > max)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    },
    [PHRASE_WORDS, MAX_REPEATS],
  );
  for (const [phrase, n] of repeats) {
    notes.push(`${path}  "${phrase}" rendered ${n}x — canon §2 copy tell`);
  }

  await page.close();
}

await browser.close();

if (notes.length) {
  console.log(`\n${notes.length} repetition note(s) — advisory, not failing:`);
  for (const n of notes) console.log(`  ${n}`);
}

if (failures.length) {
  console.error(`\n${failures.length} interaction violation(s):`);
  for (const f of failures) console.error(`  ${f}`);
  console.error(
    "\nSC 1.4.13 requires popups be dismissible without moving focus. A fixed " +
      "overlay must never fully cover an interactive target. A top-level " +
      "section's first heading should match its peers, or assistive tech nests " +
      "it as their child.",
  );
  process.exit(1);
}

console.log(
  `\nInteraction clean across ${PAGES.length} templates: every popup dismissible, ` +
    "no fixed overlay covering a control, section heading levels consistent.",
);
