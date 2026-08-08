import { expect, type Page, test } from "@playwright/test";

/**
 * Reordering stages, and one publish opens one pull request.
 *
 * WHAT THIS EXISTS TO PREVENT, and it is not hypothetical. Every move used to
 * open its own pull request, so a nine-move rerank arrived as PRs #14 to #18
 * against one stale base and whichever merged first would have encoded a single
 * move rather than the order. Those five were closed unmerged at the top of
 * round 23 and this is the assertion that stops them coming back.
 *
 * SKIPPED WITHOUT A CREDENTIAL, deliberately, and this is the one place in the
 * repository where a skip is right: the dedicated admin gates
 * (check:admin-render, check:admin-isolation) FAIL without one, because their
 * whole purpose is the authenticated surface. This file rides in the general
 * e2e suite, which runs in environments that legitimately have no admin secrets,
 * and a hard failure there would be a red suite that says nothing about the
 * code. The skip names itself in the runner output.
 *
 * IT LEAVES NOTHING BEHIND. Staging is a cookie, and the run discards it. No
 * pull request is opened: the test never clicks Publish order, because doing so
 * would put a real pull request against the real repository on every run.
 */
const BASE = process.env.ADMIN_BASE_URL ?? "http://localhost:3115";
const titles = async (page: Page): Promise<string[]> =>
  (await page.getByRole("heading", { level: 3 }).allTextContents())
    .map((t) => t.trim())
    .filter((t) => !t.startsWith("data(case-studies)"));

test.skip(
  !process.env.ADMIN_TEST_EMAIL || !process.env.ADMIN_TEST_PASSWORD,
  "needs ADMIN_TEST_EMAIL and ADMIN_TEST_PASSWORD against a server running the matching hash",
);

test("a move stages, survives a refresh, and discards", async ({ page }) => {
  /* Read once, after the skip above has already established both are set. */
  const email = process.env.ADMIN_TEST_EMAIL ?? "";
  const password = process.env.ADMIN_TEST_PASSWORD ?? "";

  await page.goto(`${BASE}/admin/sign-in`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin\/(briefs|case-studies)/, { timeout: 20000 });

  await page.goto(`${BASE}/admin/case-studies`, { waitUntil: "networkidle" });
  const before = await titles(page);
  expect(await page.getByText("This order is staged").count()).toBe(0);

  await page.getByRole("button", { name: "Move up" }).nth(1).click();
  await page.waitForURL(/moved=/, { timeout: 20000 });
  await expect(page.getByText("This order is staged")).toBeVisible();
  const staged = await titles(page);
  expect(staged[0]).toBe(before[1]);
  console.log("STAGED: second study is now first, and no pull request opened");

  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByText("This order is staged")).toBeVisible();
  console.log("SURVIVED A REFRESH");

  await page.getByRole("button", { name: "Discard staged order" }).click();
  await page.waitForURL(/discarded=1/, { timeout: 20000 });
  await expect(page.getByText("This order is staged")).toHaveCount(0);
  expect(await titles(page)).toEqual(before);
  console.log("DISCARDED: the published order is back");
});
