/**
 * One definition of "the study's own words", shared by every harness that needs
 * it.
 *
 * Round 25 proved the import by rendering; round 25b has to prove that the
 * production flip changed nothing, which is the same comparison against a
 * baseline captured before the merge instead of against a live second server.
 * Two copies of this selector set would be two chances to drift, and a drifted
 * baseline compares clean while the page has changed. So the extraction lives
 * here and both `verify-import.mjs` and `capture-case-study-prose.mjs` call it.
 */

/** Every slug the given index page links to, in the order the index lists them. */
export async function slugsFromIndex(base) {
  const res = await fetch(`${base}/case-studies`);
  if (!res.ok) throw new Error(`${base}/case-studies answered HTTP ${res.status}`);
  const html = await res.text();
  const slugs = [];
  for (const m of html.matchAll(/\/case-studies\/([a-z0-9-]+)/g)) {
    if (!slugs.includes(m[1])) slugs.push(m[1]);
  }
  return slugs;
}

/**
 * The three slots `Movements` renders, plus the H1, and nothing else.
 *
 * The rest of the page carries the client rail, the related studies and the
 * brief CTA, all of which legitimately differ between two builds.
 */
export async function prose(page, base, slug) {
  const res = await page.goto(`${base}/case-studies/${slug}`, {
    waitUntil: "domcontentloaded",
  });
  if (!res?.ok()) return { error: `HTTP ${res?.status() ?? "none"}` };
  return page.evaluate(() => {
    const texts = (sel) =>
      [...document.querySelectorAll(sel)].map((e) => e.innerText.trim());
    return {
      h1: document.querySelector("h1")?.innerText.trim() ?? "",
      labels: texts('[class*="movementLabel"]'),
      subheads: texts('[class*="movementSubhead"]'),
      bodies: texts('[class*="movementBody"]'),
    };
  });
}
