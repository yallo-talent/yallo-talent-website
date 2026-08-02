#!/usr/bin/env node
/**
 * The estate band's role-chip interaction — context-round6-rulings.md §3.4.
 *
 *   node scripts/check-estate-interaction.mjs [baseUrl]
 *
 * WHY THIS IS A GATE AND NOT A ONE-OFF CHECK. §3.4 attaches three conditions to
 * the interaction, and every one of them is behavioural: keyboard reachable,
 * paired with a non-motion cue, and every fact readable with the interaction
 * never triggered. None is visible in a diff, none is visible in a screenshot,
 * and all three regress silently — the cheapest way to "simplify" this band
 * later is to hide the unlit tools, which passes every other gate on the repo
 * and destroys the third condition outright.
 *
 * Needs `next start`, not `next dev`: the band is a client component and the
 * check drives real focus events against the production bundle.
 *
 * The four assertions, and what each one is protecting:
 *
 *   1. NOTHING LIT AT REST. If the band ships with tools already lit, the
 *      interaction is decoration rather than an affordance.
 *
 *   2. KEYBOARD FOCUS LIGHTS TOOLS, ACROSS MORE THAN ONE ZONE. Driven by
 *      `.focus()` alone, never a mouse event, because "keyboard reachable" is
 *      the condition and a hover-only implementation would otherwise pass. More
 *      than one zone, because the whole point is the role-to-tool leg spanning
 *      the estate — a family lit only inside its own layer proves nothing.
 *
 *   3. BLUR CLEARS IT. A latched highlight accumulates as a reader tabs through
 *      and ends with everything lit, which is assertion 1 by another route.
 *
 *   4. EVERY FACT PRESENT AND VISIBLE UNTRIGGERED. On a page nobody has
 *      interacted with, no descendant of the band may be `display: none`,
 *      `visibility: hidden` or under full opacity. This is the condition that
 *      says the interaction is an affordance over the data and never the route
 *      to it.
 *
 * Proven by reintroducing the defect, per the standing rule: with the `data-lit`
 * attribute removed from the tool elements the run fails assertion 2, and with
 * `onBlur` removed it fails assertion 3.
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3100";

/** Both levels: the L1 renders every zone, the L2 renders the filtered variant. */
const PAGES = [
  { path: "/ai-talent", band: "#ai-estate" },
  { path: "/ai-talent/llm-engineer", band: "#stacks" },
];

const failures = [];
const notes = [];

const browser = await chromium.launch();

for (const { path, band } of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(300);

  const lit = () => page.locator(`${band} [data-lit="true"]`).count();

  /* 1 — nothing lit at rest. */
  const atRest = await lit();
  if (atRest !== 0)
    failures.push(
      `${path}  ${atRest} tool(s) lit with no interaction. The lit state is an ` +
        `affordance, so at rest it must be empty.`,
    );

  /* 2 — keyboard focus, no mouse event anywhere in this block. */
  const chip = page.locator(`${band} a[class*=chip]`).first();
  const chipCount = await page.locator(`${band} a[class*=chip]`).count();
  if (chipCount === 0) {
    failures.push(`${path}  no role chips found in ${band}. The band did not render.`);
    await page.close();
    continue;
  }
  const chipText = (await chip.textContent())?.trim();
  await chip.focus();
  await page.waitForTimeout(120);
  const onFocus = await lit();
  const zones = await page.evaluate((sel) => {
    const z = new Set();
    for (const el of document.querySelectorAll(`${sel} [data-lit="true"]`)) {
      const zone = el.closest('[class*="__layer"], [class*="__rail"]');
      const h = zone?.querySelector("h4");
      if (h) z.add(h.textContent.trim());
    }
    return [...z];
  }, band);

  if (onFocus === 0)
    failures.push(
      `${path}  keyboard focus on "${chipText}" lit nothing. §3.4 requires the ` +
        `interaction to be reachable without a mouse.`,
    );
  else if (zones.length < 2)
    failures.push(
      `${path}  focus on "${chipText}" lit ${onFocus} tool(s) in only ${zones.length} ` +
        `zone(s). The interaction exists to show a family's reach ACROSS the estate.`,
    );

  /* 3 — blur clears it.
     Blur the focused element directly rather than tabbing away, and that is a
     correction this check earned on its first run. `Shift+Tab` from the first
     chip landed on the NEXT chip, whose own onFocus lit its family — correct
     behaviour reported as 23 tools still lit, which would have been a false
     failure on the L2 every time. Moving focus is not the same event as losing
     it, and only one of them is what this assertion is about. */
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(120);
  const afterBlur = await lit();
  if (afterBlur !== 0)
    failures.push(
      `${path}  ${afterBlur} tool(s) still lit after blur. A latched highlight ` +
        `accumulates as a reader tabs and ends with the whole band lit.`,
    );

  /* 4 — the untriggered page. A fresh context, so nothing above has touched it. */
  const fresh = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await fresh.goto(BASE + path, { waitUntil: "load" });
  await fresh.waitForTimeout(200);
  const untriggered = await fresh.evaluate((sel) => {
    const root = document.querySelector(sel);
    const hidden = [];
    for (const el of root.querySelectorAll("*")) {
      if (el.getAttribute("aria-hidden") === "true") continue;
      const cs = getComputedStyle(el);
      if (
        cs.display === "none" ||
        cs.visibility === "hidden" ||
        Number(cs.opacity) < 1
      )
        hidden.push(
          `${el.tagName.toLowerCase()}.${(el.className || "").toString().split("__").pop()}`,
        );
    }
    return {
      tools: root.querySelectorAll('li[class*="__tool"]').length,
      chips: root.querySelectorAll('[class*="__chip"]').length,
      /* The COUNT is every offending element; the names are deduplicated,
         because 47 identical `li.tool` lines say nothing the first one did
         not. Reporting the deduplicated length as the count read "1 element"
         for a whole faded layer, which understated it by 46. */
      hiddenCount: hidden.length,
      hidden: [...new Set(hidden)],
    };
  }, band);
  await fresh.close();

  if (untriggered.hidden.length)
    failures.push(
      `${path}  ${untriggered.hiddenCount} element(s) hidden or faded before any ` +
        `interaction, of ${untriggered.hidden.length} kind(s): ${untriggered.hidden.slice(0, 5).join(", ")}.\n` +
        `      §3.4: every fact must be readable with the interaction never triggered.`,
    );

  notes.push(
    `${path}: ${untriggered.tools} tools and ${untriggered.chips} chips readable untriggered; ` +
      `focus lit ${onFocus} across ${zones.length} zone(s)`,
  );

  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(
    `\ncheck-estate-interaction FAILED with ${failures.length} problem(s):\n`,
  );
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(`Estate interaction clean. ${notes.join(" | ")}.`);
