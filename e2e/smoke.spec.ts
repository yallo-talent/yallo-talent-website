import { expect, test } from "@playwright/test";

test("home page renders and nav is present", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Yallo/i);
  await expect(page.locator("nav")).toBeVisible();
});
