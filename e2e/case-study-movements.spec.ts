import { expect, test } from "@playwright/test";

/**
 * Guards the movement item groups under every case study (Context, Challenge,
 * The approach, The outcome): they must render as real <ul><li> markup, and
 * the marker Tailwind's preflight strips must be visibly restored. A bullet
 * glyph on non-list elements would read as a list to a sighted reader and not
 * to a screen reader, so this asserts structure, not just appearance.
 *
 * ROUND 25: THE SLUGS COME FROM THE INDEX, NOT FROM order.yaml. Canon A1 moved
 * case studies into the database and the order file went with them, so this
 * spec read a file that no longer exists and failed at module load — before a
 * single assertion ran, which is why it failed on CI and not on the gates that
 * take a base URL.
 *
 * ONE TEST OVER EVERY STUDY, rather than one test per study generated at load.
 * The published set is a runtime fact now: it can change between a publish and
 * this run, and Playwright needs its test list before it can ask a server
 * anything. Reading the index inside the test is the only ordering that works,
 * and it keeps the assertion identical.
 */

test("every published case study renders its movement lists as semantic lists", async ({
  page,
}) => {
  await page.goto("/case-studies");
  const slugs = [
    ...new Set(
      (
        await page
          .locator('a[href^="/case-studies/"]')
          .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""))
      )
        .map((href) => href.replace("/case-studies/", "").split(/[?#]/)[0])
        .filter(Boolean),
    ),
  ];
  expect(slugs.length, "the index links at least one study").toBeGreaterThan(0);

  for (const slug of slugs) {
    await page.goto(`/case-studies/${slug}`);

    const items = page.locator('[class*="movementBody"] ul > li');
    const count = await items.count();
    expect(
      count,
      `at least one bulleted movement item on /case-studies/${slug}`,
    ).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const li = items.nth(i);
      expect(await li.evaluate((el) => el.tagName)).toBe("LI");
      expect(await li.evaluate((el) => el.parentElement?.tagName)).toBe("UL");

      const markerWidth = await li.evaluate((el) => {
        const before = getComputedStyle(el, "::before");
        return Number.parseFloat(before.width) || 0;
      });
      expect(
        markerWidth,
        `marker ::before has a rendered width on /case-studies/${slug}`,
      ).toBeGreaterThan(0);
    }
  }
});
