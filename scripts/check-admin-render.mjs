#!/usr/bin/env node
/**
 * check-admin-render — the cockpit's panes measured to the same standard as the
 * public site: axe on the rendered pane, and A4's type-scale floors.
 *
 * WHY, round 19 §5.3. The admin panes are absent from the sitemap, and every
 * enumerating gate in this repository reads its route list from the sitemap or
 * from /llms.txt. So no gate has ever visited them. The panes change this round
 * with the write pane, and "internal surface, one user, it does not need the
 * same bar" was already proven wrong once on /ai-talent, where six classes
 * shipped under the A4 type floor because the page was on no gate's list.
 *
 * WHY IT NEEDS A CREDENTIAL, and why it fails rather than skipping without one.
 * Every pane redirects an anonymous caller to sign-in, which is the property
 * check:admin-isolation exists to assert. There is therefore nothing to measure
 * without a session, and a gate that quietly reports clean because it could not
 * sign in is worse than no gate: it is a green tick over an unmeasured surface,
 * which is the exact shape §5.3 was filed against. It exits 1 and says what is
 * missing.
 *
 * Supply a THROWAWAY pair, never the real operator password:
 *
 *   ADMIN_TEST_EMAIL=... ADMIN_TEST_PASSWORD=... \
 *     node scripts/check-admin-render.mjs [baseUrl]
 *
 * The server under test must be running with ADMIN_EMAIL and an
 * ADMIN_PASSWORD_HASH generated from that same throwaway password
 * (`pnpm admin:hash`), which is how round 19 exercised the authenticated path
 * for the first time without handling anyone's real credential.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";
const EMAIL = process.env.ADMIN_TEST_EMAIL ?? "";
const PASSWORD = process.env.ADMIN_TEST_PASSWORD ?? "";

const PANES = [
  "/admin",
  "/admin/sign-in",
  "/admin/briefs",
  "/admin/case-studies",
  "/admin/conversations",
  "/admin/articles",
];

/**
 * The conversation DETAIL template, which has no fixed URL.
 *
 * Round 20 §3.1 moved the full transcript one click below the list, so there is
 * now a rendering unit whose address is a transcript id. It cannot be written
 * into PANES: the id depends on what the database holds, and a hardcoded one
 * would 404 on every machine but the one it was copied from.
 *
 * So it is DISCOVERED — the first row's link on /admin/conversations — and when
 * the list is empty the run REPORTS that the template went unvisited rather than
 * passing quietly. An empty database is a legitimate state and a gate that
 * cannot tell it apart from a broken template is the failure this repository
 * keeps rediscovering.
 */
const DETAIL_FROM = "/admin/conversations";
const WIDTHS = [1280, 360];
const THEMES = ["light", "dark"];

if (!EMAIL || !PASSWORD) {
  console.error(
    "\ncheck:admin-render cannot run: ADMIN_TEST_EMAIL and ADMIN_TEST_PASSWORD are\n" +
      "not both set. Every pane redirects an anonymous caller to sign-in, so without\n" +
      "a session there is nothing to measure. This is a failure rather than a skip:\n" +
      "a green tick over an unmeasured surface is what §5.3 was filed against.\n",
  );
  process.exit(1);
}

const blocking = [];
const advisory = [];
let panesMeasured = 0;
/** Contexts in which the conversation-detail template had no row to render. */
let detailUnvisited = 0;

/**
 * Signs in once per context and leaves the session cookie on it.
 *
 * Retried once. The very first sign-in against a freshly started `next start`
 * failed while the four that followed succeeded: the server action and its CSRF
 * cookie are not ready on the process's first POST, and a cold start is not the
 * defect this gate is looking for. A SECOND failure is reported, because a
 * credential that never works is exactly what it should catch.
 */
async function signIn(ctx) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const page = await ctx.newPage();
    await page.goto(`${BASE}/admin/sign-in`, { waitUntil: "networkidle" });
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForTimeout(attempt * 800);
    const signedIn = !page.url().includes("/admin/sign-in");
    await page.close();
    if (signedIn) return true;
  }
  return false;
}

/* A4's floors, identical to scripts/check-rendered-type.mjs. Restated rather
   than imported for the same reason every check-* script restates them: these
   are plain Node scripts that do not resolve the `@/` alias and nothing under
   scripts/ imports src/. The three numbers are asserted against that file below
   so the two cannot drift apart unnoticed. */
const TYPE_ROLES = () => {
  const SANS_FLOOR = 14;
  const CONTROL_FLOOR = 15.5;
  const TRACKING_FLOOR = 0.1195;
  const strip = (el) =>
    [...el.classList][0]?.replace(/^[A-Za-z0-9]+-module__[A-Za-z0-9]+__/, "") ??
    el.tagName.toLowerCase();

  const out = { sans: new Set(), control: new Set(), tracking: new Set() };
  for (const el of document.querySelectorAll("*")) {
    const ownText = [...el.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
    );
    if (!ownText) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;

    const px = Number.parseFloat(cs.fontSize);
    const mono = /Plex Mono/i.test(cs.fontFamily);
    const name = strip(el);

    if (!mono && px < SANS_FLOOR) out.sans.add(`${name} @ ${px}px`);

    const filled = !/^rgba?\(0, 0, 0, 0\)$|^transparent$/.test(
      cs.backgroundColor,
    );
    const control =
      el.tagName === "BUTTON" || (el.tagName === "A" && el.hasAttribute("href"));
    if (control && filled && !mono && px < CONTROL_FLOOR)
      out.control.add(`${name} @ ${px}px`);

    const txt = [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent)
      .join("");
    const letters = txt.replace(/[^A-Za-z]/g, "");
    const nativeCaps = letters.length >= 3 && letters === letters.toUpperCase();
    if (mono && (cs.textTransform === "uppercase" || nativeCaps)) {
      const ls = Number.parseFloat(cs.letterSpacing) || 0;
      if (ls / px < TRACKING_FLOOR)
        out.tracking.add(`${name} @ ${px}px, ${(ls / px).toFixed(3)}em`);
    }
  }
  return {
    sans: [...out.sans],
    control: [...out.control],
    tracking: [...out.tracking],
  };
};

/* The floors above must be the floors check-rendered-type.mjs enforces. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(
    new URL("../scripts/check-rendered-type.mjs", import.meta.url),
    "utf8",
  );
  for (const [name, value] of [
    ["SANS_FLOOR", "14"],
    ["CONTROL_FLOOR", "15.5"],
    ["TRACKING_FLOOR", "0.1195"],
  ]) {
    if (!new RegExp(`const ${name} = ${value.replace(".", "\\.")}[;\\s]`).test(src)) {
      blocking.push(
        `${name} is ${value} here but scripts/check-rendered-type.mjs no longer declares that.\n` +
          "      The public site and the cockpit would then be held to different floors,\n" +
          "      which is the whole thing §5.3 exists to prevent.",
      );
    }
  }
}

const browser = await chromium.launch();

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: width < 700 ? 800 : 900 },
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("yallo-theme", t);
      } catch {}
      const stamp = () => document.documentElement.setAttribute("data-theme", t);
      stamp();
      document.addEventListener("DOMContentLoaded", stamp);
    }, theme);

    if (!(await signIn(ctx))) {
      blocking.push(
        `${theme}/${width}: sign-in did not produce a session, so no pane was measured.\n` +
          "      The server must be running with an ADMIN_PASSWORD_HASH generated from\n" +
          "      ADMIN_TEST_PASSWORD.",
      );
      await ctx.close();
      continue;
    }

    /* Resolved per context because a context is a signed-in session and the
       list cannot be read without one. Appended to the pane list so the detail
       template goes through exactly the same axe, type and contrast passes as
       every other. */
    const panes = [...PANES];
    let detail = null;
    {
      const probe = await ctx.newPage();
      try {
        await probe.goto(`${BASE}${DETAIL_FROM}`, {
          waitUntil: "networkidle",
          timeout: 45000,
        });
        detail = await probe.evaluate(() => {
          const a = document.querySelector(
            'a[href^="/admin/conversations/"]',
          );
          return a ? a.getAttribute("href") : null;
        });
      } catch {
        /* Reported below as un-visited rather than thrown: a probe failure and
           an empty list produce the same null, and both are worth saying. */
      }
      await probe.close();
      if (detail) panes.push(detail);
      else detailUnvisited += 1;
    }

    for (const pane of panes) {
      const page = await ctx.newPage();
      try {
        const res = await page.goto(`${BASE}${pane}`, {
          waitUntil: "networkidle",
          timeout: 45000,
        });
        if (!res || res.status() !== 200) {
          blocking.push(
            `${pane} ${theme}/${width}: responded ${res ? res.status() : "no response"}.`,
          );
          await page.close();
          continue;
        }
        if (pane !== "/admin/sign-in" && page.url().includes("/admin/sign-in")) {
          blocking.push(
            `${pane} ${theme}/${width}: redirected to sign-in despite a session, so it\n` +
              "      was not measured.",
          );
          await page.close();
          continue;
        }
        panesMeasured += 1;

        /* The self-test lever, per §6: a gate nobody has watched fail on its own
           rule is not a gate. Injects the two defects this gate exists to catch
           — sans copy under A4's 14px floor, and an image with no accessible
           name — into the rendered pane, without a rebuild. */
        if (process.env.ADMIN_RENDER_SELF_TEST === "true") {
          await page.evaluate(() => {
            const p = document.createElement("p");
            p.className = "selfTestUndersizedCopy";
            p.style.fontSize = "12px";
            p.textContent = "Self-test: sans copy below A4's 14px floor.";
            document.body.appendChild(p);
            const img = document.createElement("img");
            img.src =
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            img.width = 40;
            img.height = 40;
            document.body.appendChild(img);
          });
          await page.waitForTimeout(80);
        }

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

        for (const v of violations) {
          const target = v.nodes[0]?.target.join(" ") ?? "?";
          const line =
            `${pane} ${theme}/${width}  [${v.impact}] ${v.id}: ${v.help}\n      ${target}`;
          if (v.impact === "serious" || v.impact === "critical") blocking.push(line);
          else advisory.push(line);
        }
        /* R10: an abstention is not a pass, and it is not silently a failure
           either. Named, so the next round resolves it by hand rather than
           inheriting an ambiguity nobody can see. */
        for (const i of incomplete.filter((x) => x.id === "color-contrast")) {
          advisory.push(
            `${pane} ${theme}/${width}: axe abstained on color-contrast for ${i.nodes.length} node(s), unresolved.`,
          );
        }

        const roles = await page.evaluate(TYPE_ROLES);
        for (const s of roles.sans)
          blocking.push(`${pane} ${theme}/${width}  sans text below A4's 14px floor — ${s}`);
        for (const c of roles.control)
          blocking.push(`${pane} ${theme}/${width}  filled control below A4's 15px role — ${c}`);
        for (const t of roles.tracking)
          blocking.push(`${pane} ${theme}/${width}  uppercase mono below A4's 0.12em tracking — ${t}`);
      } catch (err) {
        blocking.push(
          `${pane} ${theme}/${width}: gate crashed rather than completing — ${err instanceof Error ? err.message : err}`,
        );
      }
      await page.close();
    }
    await ctx.close();
  }
}

await browser.close();

/* PANES plus, in each context that found one, the discovered detail URL. */
const contexts = WIDTHS.length * THEMES.length;
const expected =
  PANES.length * contexts + (contexts - detailUnvisited);
if (panesMeasured < expected) {
  blocking.push(
    `Only ${panesMeasured} of ${expected} pane renders were measured. A partial run is not\n` +
      "      evidence about the panes it never reached.",
  );
}

if (advisory.length) {
  console.log(`\n${advisory.length} advisory item(s):`);
  for (const a of advisory.sort()) console.log(`  ${a}`);
}

if (blocking.length) {
  console.error(`\ncheck:admin-render FAILED with ${blocking.length} problem(s):\n`);
  for (const b of blocking.sort()) console.error(`  ${b}\n`);
  process.exit(1);
}

console.log(
  `\ncheck:admin-render passed\n` +
    `  ${PANES.length} pane(s) x ${THEMES.length} theme(s) x ${WIDTHS.length} width(s), ` +
    `${panesMeasured} render(s) in total, signed in\n` +
    `  no serious or critical axe violation, and A4's 14px / 15px / 0.12em floors hold\n` +
    (detailUnvisited
      ? `  THE CONVERSATION DETAIL TEMPLATE WAS NOT VISITED in ${detailUnvisited} of ${contexts}\n` +
        `  context(s): the list was empty, so there was no transcript to open. That is a\n` +
        `  legitimate state of the database and it is reported rather than passed over.\n`
      : `  the conversation detail template was reached in all ${contexts} context(s)\n`),
);
