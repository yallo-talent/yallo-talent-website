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
  "/leadership",
  /* Added round 16. The synthesis page carries the research gate, which is
     the round's only new interactive surface: three inputs and a submit, all
     of which have to clear the 24px target floor. */
  "/intelligence/research/corridor",
];

/** Tab stops allowed before the header's primary CTA. */
const MAX_STOPS_TO_CTA = 12;
/** A phrase this long, repeated this often, is a tell rather than a motif. */
const PHRASE_WORDS = 4;
const MAX_REPEATS = 2;

/* ── The styled-enough floor, relative rather than absolute ────────────────
   It was a flat `rules < 600`, calibrated on the heaviest template, and it
   failed /platforms/sap/sap-datasphere at 451 rules. Nothing was wrong with that
   page: it is simply lighter than /platforms/sap, which delivers 743. A gate
   that fires on a page's weight rather than on its state is a gate defect, and
   this one blocked a green run.

   A STORED per-route baseline was the obvious fix and it is wrong, which only
   showed up on measuring it: the same datasphere page delivers 451 rules under
   `next dev` and 842 under `next start`, because the two chunk CSS differently.
   A figure recorded in one mode fails the other, so the file would have to be
   re-recorded per mode and would rot between them.

   So the floor is derived inside the run instead. Every page in one run shares
   one build, so the heaviest page is the honest yardstick and RATIO of it is the
   floor. Self-calibrating, no stored state, correct in dev and in production.

   ABSOLUTE catches the case the relative check cannot — a build where EVERY page
   is partial, so the maximum is degraded too. 300 sits below the lightest real
   template measured in either mode (451) and above the 153-rule partial build
   that got through the old ">= 100 rules" check. */
const RATIO = 0.5;
const ABSOLUTE = 300;
const ruleCounts = new Map();

const browser = await chromium.launch();
const failures = [];
const notes = [];
let tabStopsProbed = 0;

/* Two viewports. Both paired plateau passes found the same SC 2.4.11 failure
   independently and both named the same cause: this gate opened ONE 1280x900
   page and sampled three arbitrary fractions of page height, so a defect that
   lives at 390px and at the scroll offsets Tab itself produces was unreachable.
   The fix is not a bigger threshold, it is visiting the conditions a keyboard
   user actually creates. */
const VIEWPORTS = [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
];

/* KNOWN LATENT FLAKE, left in place deliberately and recorded so the next
   session does not spend the time twice.

   The three `networkidle` waits below are the same hazard that made
   check-rendered-type time out on 2 Aug 2026: on `/`, networkidle takes over
   30,000ms against a cold next/image optimiser cache and 801ms against a warm
   one, because the client rail is five logos across four srcset widths and
   `next start` optimises on first request. A run straight after a clean build
   can therefore time out where the identical commit passes a minute later.

   Not changed here, and the reason is not caution about churn. This gate drives
   hover, focus and Tab, so it needs React hydrated; `domcontentloaded` is the
   right wait for the type gate precisely because that one only reads computed
   styles, and it would be the wrong wait here. Removing the flake properly
   means waiting on a hydration signal rather than on the network, which is a
   change worth making on its own evidence rather than as a side effect.

   Until then: warm the cache before a cold-build run, or expect one retry. */
for (const viewport of VIEWPORTS) {
for (const path of PAGES) {
  const page = await browser.newPage({ viewport });
  const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (!res?.ok()) {
    failures.push(`${path} @${viewport.width}  did not load (HTTP ${res?.status() ?? "none"})`);
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
  ruleCounts.set(`${path}@${viewport.width}`, styled.rules);
  if (styled.rules < ABSOLUTE) {
    failures.push(
      `${path} @${viewport.width}  only ${styled.rules} CSS rules, under the ${ABSOLUTE} smoke floor — a partial build, refusing to judge it`,
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
        `${path} @${viewport.width}  trigger ${i} opens on FOCUS — SC 1.4.13, and it puts the panel's contents in the tab sequence`,
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
        `${path} @${viewport.width}  trigger ${i} cannot be dismissed with Escape — SC 1.4.13 (Dismissible)`,
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
      `${path} @${viewport.width}  ${stops + 1} tab stops to the header CTA, over the ${MAX_STOPS_TO_CTA} budget`,
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
        // Bound the target on BOTH axes. Checking only the vertical was a bug in
        // this probe: a link scrolled off to the right inside a horizontal
        // scroller sits at x=424 in a 390px viewport, elementFromPoint returns
        // null there, and null was being counted as "covered". That produced ten
        // false positives against one real defect.
        if (r.bottom < 0 || r.top > innerHeight) continue;
        if (r.right < 0 || r.left > innerWidth) continue;
        if (fixed.some((f) => f.contains(a))) continue; // the overlay's own controls
        // And require an overlay to actually intersect the target before judging.
        const overlaps = fixed.some((f) => {
          const g = f.getBoundingClientRect();
          return !(g.right < r.left || g.left > r.right || g.bottom < r.top || g.top > r.bottom);
        });
        if (!overlaps) continue;
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
    /* ADVISORY, not failing, and the distinction is the success criterion.
       SC 2.4.11 is about the element that has FOCUS — that is what the Tab-driven
       probe below tests, and that is the hard gate. A link merely sitting under a
       fixed overlay at some scroll offset is something a reader scrolls past; it
       is worth knowing and it is not a conformance failure. Reporting it as one
       would make this gate cry wolf, which is how a gate gets ignored. */
    for (const bl of blocked) {
      notes.push(
        `${path} @${viewport.width} @${Math.round(frac * 100)}% scroll  a fixed overlay covers "${bl}" — reachable by scrolling`,
      );
    }
  }

  // Focus-driven occlusion: Tab through the page and check, at each stop, that
  // no fixed overlay covers the element the browser just scrolled to. This is
  // the case three arbitrary scroll fractions cannot reach — SC 2.4.11 fails on
  // ENTIRELY hidden, and a Tab-produced offset put a taxonomy link 100% under
  // the sticky prompt at 390px.
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press("Tab");
    // Let smooth scrolling settle, or the reading races the scroll.
    await page.waitForTimeout(180);
    const hidden = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const r = a.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      if (r.bottom < 0 || r.top > innerHeight) return null;
      if (r.right < 0 || r.left > innerWidth) return null;
      const fixed = [...document.querySelectorAll("*")].filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.position === "fixed" &&
          cs.visibility !== "hidden" &&
          cs.display !== "none" &&
          !el.contains(a) &&
          el.getBoundingClientRect().width > 0
        );
      });
      if (!fixed.length) return null;
      let covered = 0;
      const pts = 9;
      for (let x = 1; x <= 3; x++) {
        for (let y = 1; y <= 3; y++) {
          const el = document.elementFromPoint(
            r.x + (r.width * x) / 4,
            r.y + (r.height * y) / 4,
          );
          if (el && fixed.some((f) => f === el || f.contains(el))) covered++;
        }
      }
      if (covered < pts) return null; // partial is SC 2.4.11 Minimum-compliant
      return (a.textContent ?? "").trim().slice(0, 34) || a.tagName;
    });
    tabStopsProbed += 1;
    if (hidden) {
      failures.push(
        `${path} @${viewport.width}  tab stop ${i + 1} "${hidden}" is ENTIRELY under a fixed overlay — SC 2.4.11`,
      );
      break; // one report per template is enough to act on
    }
  }

  /* ── 2b. Latent total occlusion, judged on geometry rather than on scroll ──
     Round 24 found the FAB entirely covering the client rail's pause control at
     390px, and the two probes above caught it only INTERMITTENTLY: both judge
     the layout at whatever scroll offset they happen to produce, so they see the
     defect only when the control is on screen AND inside the overlay's vertical
     band. On this machine that never happened in five consecutive runs; on CI's
     slower runner it did. The defect was constant the whole time. A gate whose
     truth depends on scroll timing is a gate that will be re-run until it is
     quiet, which is exactly the paper-over R-25.1 was ratified to prevent.

     The class, stated without reference to scroll: a control in normal flow
     sweeps the WHOLE viewport vertically as the page scrolls, so it will pass
     through every fixed overlay's band sooner or later. If a fixed overlay's
     horizontal range then fully CONTAINS that control's, the control has no
     horizontal escape and is, at some scroll offset, entirely covered. That is
     SC 2.4.11 for a keyboard user and lost pointer events for a touch user, and
     it is decidable from one measurement at rest.

     Two exclusions, both principled rather than convenient:

     - A control pinned by a `fixed` or `sticky` ancestor does NOT sweep the
       viewport; its vertical band is bounded. The header hamburger is the live
       case — sticky at the top, 342..378, horizontally inside the launcher's
       324..378, and it never meets the launcher, which sits at bottom:84. So for
       those, require an actual vertical intersection as well.
     - An overlay spanning essentially the whole viewport width contains every
       control by construction and cannot be moved aside; that is a different
       class with a different mitigation (reserved space, scroll-padding), and
       the focus probe above is what judges it. StickyBriefCTA below 640px is
       12..378 of 390 and is deliberately out of scope here. */
  const contained = await page.evaluate(async () => {
    const settle = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    /* `behavior: instant` explicitly. globals.css sets scroll-behavior: smooth,
       and a plain scrollTo inside one evaluate animates: every rect read back in
       the same task is the pre-scroll rect. Measured while writing this — the
       first version reported "never on screen" for every control on the page. */
    const go = async (y) => {
      window.scrollTo({ top: y, behavior: "instant" });
      await settle();
    };
    const visibleFixed = () =>
      [...document.querySelectorAll("*")].filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.position === "fixed" &&
          cs.visibility !== "hidden" &&
          cs.display !== "none" &&
          el.getBoundingClientRect().width > 0
        );
      });
    const pinned = (el) => {
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const p = getComputedStyle(n).position;
        if (p === "fixed" || p === "sticky") return true;
      }
      return false;
    };

    /* The box that matters is the one a reader can hit and see the ring on, and
       for a STRETCHED LINK those are not the anchor's own border box. The exp
       cards put an `::after { position: absolute; inset: 0 }` on a 30x30 corner
       circle so the whole 285px card is the target; measuring the circle would
       report a card-sized control as trapped inside a 183px overlay. Detect the
       pattern from the computed pseudo-element and use the positioned ancestor
       it stretches to. The focus ring is moved to that same ancestor in
       L1PageShell.module.css, so the two agree. */
    const effectiveRect = (el) => {
      const cs = getComputedStyle(el, "::after");
      const stretched =
        cs.content !== "none" &&
        cs.position === "absolute" &&
        ["top", "right", "bottom", "left"].every((s) => cs[s] === "0px");
      const host = stretched ? el.offsetParent : null;
      return (host ?? el).getBoundingClientRect();
    };

    await go(0);
    const fixedAtRest = visibleFixed();
    // Anything this wide is page furniture, not an edge-anchored control.
    const overlays = fixedAtRest.filter(
      (f) => f.getBoundingClientRect().width < innerWidth * 0.9,
    );
    if (!overlays.length) return [];

    // Pair each contained control with the scroll offset that would put it
    // wholly inside the overlay's band, and keep only the reachable ones.
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const candidates = [];
    for (const a of document.querySelectorAll("a[href], button")) {
      const r = effectiveRect(a);
      if (r.width < 4 || r.height < 4) continue;
      if (fixedAtRest.some((f) => f === a || f.contains(a))) continue;
      if (pinned(a)) continue;
      for (const f of overlays) {
        const g = f.getBoundingClientRect();
        if (!(g.left <= r.left && g.right >= r.right)) continue;
        if (r.height > g.height) continue; // taller than the band: partial only
        const docTop = r.top + window.scrollY;
        const lo = Math.ceil(docTop + r.height - g.bottom);
        const hi = Math.floor(docTop - g.top);
        const y = Math.min(Math.max(lo, 0), Math.min(hi, maxScroll));
        if (y < lo || y > hi) continue; // the band is out of scroll range
        candidates.push({
          el: a,
          overlay: f,
          y,
          control: (a.textContent ?? "").trim().slice(0, 24) || a.tagName,
          cls: a.className?.toString?.().slice(0, 48) ?? "",
          range: `${Math.round(r.left)}..${Math.round(r.right)}`,
          orange: `${Math.round(g.left)}..${Math.round(g.right)}`,
        });
        break;
      }
    }

    /* Then MEASURE at that offset rather than infer. An overlay may withdraw
       before it ever meets the control — AssistantLauncher yields to the footer,
       which is round 16's fix for exactly this collision with the footer's legal
       links — and inferring occlusion from geometry alone reports that fix as a
       defect. Nine sample points, the same test the focus probe applies. */
    const out = [];
    for (const c of candidates) {
      await go(c.y);
      const r = effectiveRect(c.el);
      const cs = getComputedStyle(c.overlay);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (!c.overlay.isConnected) continue;
      let covered = 0;
      for (let x = 1; x <= 3; x++) {
        for (let y2 = 1; y2 <= 3; y2++) {
          const el = document.elementFromPoint(
            r.x + (r.width * x) / 4,
            r.y + (r.height * y2) / 4,
          );
          if (el && (el === c.overlay || c.overlay.contains(el))) covered++;
        }
      }
      if (covered === 9) {
        out.push({
          control: c.control,
          cls: c.cls,
          range: c.range,
          orange: c.orange,
          y: c.y,
          overlay: `${c.overlay.tagName}.${c.overlay.className?.toString?.().slice(0, 48) ?? ""}`,
        });
      }
    }
    await go(0);
    return out;
  });
  for (const c of contained) {
    failures.push(
      `${path} @${viewport.width}  "${c.control}" [${c.cls}] at x ${c.range} is horizontally CONTAINED by fixed overlay ${c.overlay} at x ${c.orange}, and at scrollY ${c.y} it is ENTIRELY covered — SC 2.4.11`,
    );
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
          `${path} @${viewport.width}  a top-level section leads with h${o.level} while its peers use h${modal} — "${o.text}"`,
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
    notes.push(`${path} @${viewport.width}  "${phrase}" rendered ${n}x — canon §2 copy tell`);
  }

  await page.close();
}
}

/* ---------------------------------------------------------------------------
   RULE 5. Every interactive element on the intelligence and research surfaces
   is styled as a control — round 21 §2.4.

   THE THIRD TIME THIS CLASS SHIPPED. Assistant links first, then the two on
   this surface: the post-gate download link wore the class for the grey
   sentence under the form, and the "Get the synthesis" submit asked for
   `btn btn-primary`, two class names that exist nowhere in the repository. Both
   rendered as body text. Nothing could see it, because affordance is a painted
   fact and every gate here reads either source or structure.

   The test is deliberately conservative: an element fails only if it is
   indistinguishable from the prose around it — no underline, no border, no
   background of its own, no colour difference from its own container, and too
   small to be reading as a card. One of those five is enough to pass, so a
   block card link whose affordance is the card is not a false positive.

   THE THREE GATE STATES. The download link only exists after a successful
   submission, so the states are driven here rather than described: the form as
   it loads, the submit mid-flight, and the surface after success. The API is
   stubbed at the network so the gate needs no database, no mail provider and no
   captured lead, and so the "done" state is reachable identically on every
   machine that runs it.
   --------------------------------------------------------------------------- */

/** The surfaces §2.4 governs. */
const DELIVERY_SURFACES = [
  "/intelligence",
  "/intelligence/research",
  "/intelligence/research/corridor",
];

const AFFORDANCE = () => {
  const opaque = (c) => c && c !== "transparent" && !c.endsWith(", 0)");
  const out = [];
  const main = document.querySelector("main");
  if (!main) return out;
  for (const el of main.querySelectorAll("a[href], button")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") continue;

    const parent = el.parentElement;
    const ps = parent ? getComputedStyle(parent) : null;

    const underlined = s.textDecorationLine.includes("underline");
    const bordered = ["Top", "Right", "Bottom", "Left"].some(
      (side) =>
        Number.parseFloat(s[`border${side}Width`]) > 0 &&
        s[`border${side}Style`] !== "none",
    );
    const filled = opaque(s.backgroundColor);
    const recoloured = ps ? s.color !== ps.color : false;
    /* Big enough that the reader is looking at a card, not a run of prose. */
    const isCard = r.height >= 56;

    if (!(underlined || bordered || filled || recoloured || isCard)) {
      out.push(
        `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 48)}"`,
      );
    }
  }
  return out;
};

for (const path of DELIVERY_SURFACES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
    const bare = await page.evaluate(AFFORDANCE);
    for (const el of bare) {
      failures.push(
        `${path}  ${el} renders with no control affordance — no underline, ` +
          "border, fill or colour of its own. It reads as body text.",
      );
    }
  } finally {
    await page.close();
  }
}

/* The gate form's three states, on the one surface that carries it. */
{
  const path = "/intelligence/research/corridor";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.route("**/api/research", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          href: "/downloads/yallo-talent-corridor-research.pdf",
        }),
      }),
    );
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });

    const submit = page.getByRole("button", { name: /get the synthesis/i });
    await submit.waitFor({ state: "visible", timeout: 15000 });

    for (const el of await page.evaluate(AFFORDANCE)) {
      failures.push(`${path} [gate: pre-submit]  ${el} reads as body text.`);
    }

    await page.getByLabel("Name").fill("Gate Check");
    await page.getByLabel("Company").fill("Yallo");
    await page.getByLabel("Work email").fill("gate@example.com");
    await submit.click();

    const download = page.getByRole("link", { name: /download the/i });
    await download.waitFor({ state: "visible", timeout: 15000 });

    for (const el of await page.evaluate(AFFORDANCE)) {
      failures.push(`${path} [gate: post-submit]  ${el} reads as body text.`);
    }

    /* The download link is the surface's whole payoff, so it is asserted by
       name as well as by the sweep: a focus ring, and a target that clears
       SC 2.5.8's 24px. */
    const probe = await download.evaluate((el) => {
      el.focus();
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        outlineWidth: Number.parseFloat(s.outlineWidth) || 0,
        height: r.height,
        underlined: s.textDecorationLine.includes("underline"),
      };
    });
    if (!probe.underlined)
      failures.push(`${path} [gate]  the download link is not underlined.`);
    if (probe.height < 24)
      failures.push(
        `${path} [gate]  the download link's target is ${probe.height.toFixed(0)}px, below SC 2.5.8's 24px.`,
      );
    if (probe.outlineWidth <= 0)
      failures.push(
        `${path} [gate]  the download link shows no focus ring when focused.`,
      );
  } finally {
    await page.close();
  }
}

await browser.close();


/* The relative half of the styled assert, which can only run once every page in
   the run has been counted. */
{
  const counts = [...ruleCounts.values()];
  const heaviest = Math.max(...counts, 0);
  const floor = Math.round(heaviest * RATIO);
  const thin = [...ruleCounts.entries()].filter(([, n]) => n < floor);
  for (const [key, n] of thin)
    failures.push(
      `${key}  ${n} CSS rules against ${floor}, half the heaviest page in this run (${heaviest}) — a partial build, refusing to judge it`,
    );
  console.log(
    `\nCSS rule counts, ${Math.min(...counts)} to ${heaviest}, floor ${floor}:`,
  );
  for (const [key, n] of [...ruleCounts.entries()].sort((a, b) => a[1] - b[1]))
    console.log(`  ${key.padEnd(44)} ${n}`);
}

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

/* A gate that cannot be seen to have run is not evidence. If the focus probe
   never reached a stop, something silently broke and "clean" would be a lie. */
if (tabStopsProbed < 20) {
  console.error(
    `\nThe focus-occlusion probe only reached ${tabStopsProbed} tab stops — too few to trust. Refusing to report clean.`,
  );
  process.exit(1);
}

console.log(
  `\nInteraction clean across ${PAGES.length} templates x ${VIEWPORTS.length} widths: ` +
    `every popup dismissible, ${tabStopsProbed} focused stops none entirely obscured, ` +
    "section heading levels consistent.",
);
