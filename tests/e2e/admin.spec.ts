import { expect, test } from "@playwright/test";
import { adminUser, loginViaStorage, mockApi, resetMutableMocks } from "./fixtures";

test.beforeEach(async ({ page }) => {
  resetMutableMocks();
  await mockApi(page);
});

test("normal user cannot access admin dashboard", async ({ page }) => {
  await loginViaStorage(page);
  await page.goto("/#/admin/dashboard");

  await expect(page.getByText(/access denied/i)).toBeVisible();
});

test("admin user can access admin dashboard", async ({ page }) => {
  await loginViaStorage(page, adminUser);
  await page.goto("/#/admin/dashboard");

  await expect(page.getByText(/admin dashboard/i)).toBeVisible();
});
