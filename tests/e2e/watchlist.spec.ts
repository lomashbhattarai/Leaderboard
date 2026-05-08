import { expect, test } from "@playwright/test";
import { loginViaStorage, mockApi, resetMutableMocks } from "./fixtures";

test.beforeEach(async ({ page }) => {
  resetMutableMocks();
  await mockApi(page);
  await loginViaStorage(page);
});

test("authenticated dashboard renders watchlist data", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /your watch list/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "NABIL" })).toBeVisible();
});
