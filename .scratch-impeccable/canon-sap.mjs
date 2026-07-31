import { chromium } from "@playwright/test";

const base = "http://localhost:3100";
const route = "/platforms/sap";

const browser = await chromium.launch();

function selOf(el) {
  return el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : "") +
    (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0,3).join(".") : "");
}

const pageScript = () => {
  const out = {};

  // Tokens off :root
  const rootCS = getComputedStyle(document.documentElement);
  const tokenNames = [
    "--gold","--gold-deep","--gold-ink",
    "--amb-indigo-l","--amb-indigo-d",
    "--amb-1","--amb-2","--amb-3","--amb-4","--amb-5","--amb-6",
    "--id-sap-l","--id-sap-d","--id"
  ];
  out.tokens = {};
  for (const t of tokenNames) out.tokens[t] = rootCS.getPropertyValue(t).trim();

  out.dataTheme = document.documentElement.dataset.theme;
  out.dataAmbient = document.documentElement.dataset.ambient;
  const idEl = document.querySelector('[data-identity]');
  out.dataIdentity = idEl ? idEl.getAttribute('data-identity') : null;
  out.idResolved = idEl ? getComputedStyle(idEl).getPropertyValue('--id').trim() : null;

  // --fs-* tokens
  out.fsTokens = {};
  for (const prop of rootCS) {
    if (prop.startsWith('--fs-')) out.fsTokens[prop] = rootCS.getPropertyValue(prop).trim();
  }

  function selectorFor(el) {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (el.className && typeof el.className === 'string' && el.className.trim()) {
      s += '.' + el.className.trim().split(/\s+/).slice(0,3).join('.');
    }
    return s;
  }

  // (a) TYPE FLOOR
  const fontSizes = new Map(); // size -> [{selector, text}]
  const allEls = document.querySelectorAll('body *');
  for (const el of allEls) {
    let hasDirectText = false;
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim().length > 0) { hasDirectText = true; break; }
    }
    if (!hasDirectText) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    if (!fontSizes.has(size)) fontSizes.set(size, []);
    if (fontSizes.get(size).length < 5) {
      fontSizes.get(size).push({ selector: selectorFor(el), text: el.textContent.trim().slice(0,40) });
    }
  }
  out.fontSizes = [...fontSizes.entries()].sort((a,b) => a[0]-b[0]).map(([size, examples]) => ({ size, examples, count: [...allEls].filter(el => {
    let hasDirectText = false;
    for (const node of el.childNodes) { if (node.nodeType===3 && node.textContent.trim()) { hasDirectText = true; break; } }
    return hasDirectText && parseFloat(getComputedStyle(el).fontSize) === size;
  }).length }));

  // (b) RADIUS SIGNATURE
  const radiusEls = [];
  const circleEls = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const corners = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
    const nonZero = corners.filter(c => parseFloat(c) > 0);
    if (nonZero.length === 0) continue;
    const rect = el.getBoundingClientRect();
    const isSquareBox = Math.abs(rect.width - rect.height) < 2;
    const isFullyRound = corners.every(c => {
      const v = parseFloat(c);
      return v >= rect.width/2 - 1 || cs.borderRadius.includes('9999') || v > 999;
    });
    if (isSquareBox && isFullyRound && nonZero.length === 4) {
      circleEls.push({ selector: selectorFor(el), w: rect.width, h: rect.height, radius: corners });
    } else {
      radiusEls.push({ selector: selectorFor(el), corners, nonZeroCount: nonZero.length, w: rect.width, h: rect.height });
    }
  }
  out.radiusEls = radiusEls;
  out.circleEls = circleEls;

  // (c) GOLD USAGE + (d) IDENTITY HUE LEAKAGE
  const goldVals = new Set([out.tokens['--gold'], out.tokens['--gold-deep'], out.tokens['--gold-ink']].filter(Boolean));
  function toRgb(str) {
    // normalize via canvas-less trick: create temp element
    const d = document.createElement('div');
    d.style.color = str;
    document.body.appendChild(d);
    const rgb = getComputedStyle(d).color;
    document.body.removeChild(d);
    return rgb;
  }
  const goldRgb = new Set([...goldVals].map(toRgb));

  const ambVals = [out.tokens['--amb-indigo-l'], out.tokens['--amb-indigo-d'], out.tokens['--amb-1'],out.tokens['--amb-2'],out.tokens['--amb-3'],out.tokens['--amb-4'],out.tokens['--amb-5'],out.tokens['--amb-6']].filter(Boolean);
  const ambRgb = new Set(ambVals.map(toRgb));

  const goldFindings = { interactive: [], eyebrow: [], decorative: [], violations: [] };
  const identityFindings = [];

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const props = { color: cs.color, borderColor: cs.borderColor, backgroundColor: cs.backgroundColor, fill: cs.fill, stroke: cs.stroke };
    let matchedGold = null;
    for (const [k,v] of Object.entries(props)) {
      if (v && goldRgb.has(v)) { matchedGold = { prop: k, val: v }; break; }
    }
    if (matchedGold) {
      const isInteractive = !!el.closest('a,button,[role=button],input,summary');
      const isEyebrow = el.className && typeof el.className === 'string' && /eyebrow|label|mono/i.test(el.className);
      const isDecorative = el.className && typeof el.className === 'string' && /petal|dot|wash|pulse|decor/i.test(el.className);
      const rec = { selector: selectorFor(el), prop: matchedGold.prop, val: matchedGold.val, text: el.textContent.trim().slice(0,30) };
      if (isInteractive) goldFindings.interactive.push(rec);
      else if (isEyebrow) goldFindings.eyebrow.push(rec);
      else if (isDecorative) goldFindings.decorative.push(rec);
      else goldFindings.violations.push(rec);
    }

    // identity hue leakage: color, border-color, or opaque bg behind body copy
    for (const [k,v] of Object.entries({color: cs.color, borderColor: cs.borderColor, backgroundColor: cs.backgroundColor})) {
      if (v && ambRgb.has(v) && v !== 'rgba(0, 0, 0, 0)') {
        // check has text
        let hasText = false;
        for (const node of el.childNodes) { if (node.nodeType===3 && node.textContent.trim()) { hasText = true; break; } }
        identityFindings.push({ selector: selectorFor(el), prop: k, val: v, hasDirectText: hasText, text: el.textContent.trim().slice(0,30) });
      }
    }
  }
  out.gold = goldFindings;
  out.identityLeakage = identityFindings;

  // (f) TOUCH TARGETS
  const touchTargets = [];
  for (const el of document.querySelectorAll('a,button,summary,[role=button]')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.width < 44 || r.height < 44) {
      touchTargets.push({ selector: selectorFor(el), text: el.textContent.trim().slice(0,40), w: Math.round(r.width), h: Math.round(r.height) });
    }
  }
  out.touchTargets = touchTargets;

  // (g) OVERFLOW
  out.overflow = {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  };
  if (out.overflow.scrollWidth > out.overflow.clientWidth) {
    let widest = null, widestRight = 0;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > widestRight) { widestRight = r.right; widest = { selector: selectorFor(el), right: r.right, width: r.width, text: el.textContent.trim().slice(0,30) }; }
    }
    out.overflow.widest = widest;
  }

  // (h) MODULE LINKS
  const moduleLinks = [];
  for (const a of document.querySelectorAll('a[href^="/platforms/sap/"]')) {
    const cs = getComputedStyle(a);
    moduleLinks.push({
      href: a.getAttribute('href'),
      text: a.textContent.trim().slice(0,60),
      textDecoration: cs.textDecorationLine,
      borderBottom: cs.borderBottomWidth + ' ' + cs.borderBottomStyle + ' ' + cs.borderBottomColor,
      color: cs.color,
    });
  }
  out.moduleLinks = moduleLinks;

  // (j) RESTING ELEVATION
  const shadowEls = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      shadowEls.push({ selector: selectorFor(el), boxShadow: cs.boxShadow });
    }
  }
  out.shadowEls = shadowEls;

  return out;
};

const results = {};

for (const width of [1280, 390]) {
  for (const theme of ['light','dark']) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, colorScheme: theme });
    await ctx.addInitScript((t) => { try { localStorage.setItem('yallo-theme', t); } catch {} }, theme);
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
    await page.waitForTimeout(600);
    const key = `${theme}_${width}`;
    results[key] = await page.evaluate(pageScript);
    await page.close();
    await ctx.close();
  }
}

// (i) MOTION with reduced-motion
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { localStorage.setItem('yallo-theme','light'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  await page.waitForTimeout(600);
  const motion = await page.evaluate(() => {
    function selectorFor(el) {
      let s = el.tagName.toLowerCase();
      if (el.id) s += '#' + el.id;
      if (el.className && typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0,3).join('.');
      return s;
    }
    const found = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      const td = parseFloat(cs.transitionDuration);
      const ad = parseFloat(cs.animationDuration);
      if (td > 0 || ad > 0) {
        found.push({ selector: selectorFor(el), transitionDuration: cs.transitionDuration, animationDuration: cs.animationDuration });
      }
    }
    return found;
  });
  results.reducedMotion = motion;
  await page.close();
  await ctx.close();
}

await browser.close();

console.log(JSON.stringify(results, null, 2));
