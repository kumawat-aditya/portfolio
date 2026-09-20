import { test, expect } from "@playwright/test";

test("opening scene renders at 1080p", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForSelector("[data-opening]", { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Aditya");

  await page.waitForTimeout(1500);
  await page.screenshot({
    path: "design-studies/playwright-opening.png",
    fullPage: false,
  });
});
