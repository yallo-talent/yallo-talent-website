import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { parse as parseYaml } from "yaml";

/**
 * Guards the movement item groups under every case study (Context, Challenge,
 * The approach, The outcome): they must render as real <ul><li> markup, and
 * the marker Tailwind's preflight strips must be visibly restored. A bullet
 * glyph on non-list elements would read as a list to a sighted reader and not
 * to a screen reader, so this asserts structure, not just appearance.
 */

const ORDER_PATH = join(process.cwd(), "content", "case-studies", "order.yaml");
const { order: slugs } = parseYaml(readFileSync(ORDER_PATH, "utf8")) as {
  order: string[];
};

for (const slug of slugs) {
  test(`${slug}: movement item groups are semantic lists with a visible marker`, async ({
    page,
  }) => {
    await page.goto(`/case-studies/${slug}`);

    const items = page.locator('[class*="movementBody"] ul > li');
    const count = await items.count();
    expect(
      count,
      "at least one bulleted movement item on this study",
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
        "marker ::before has a rendered width",
      ).toBeGreaterThan(0);
    }
  });
}
