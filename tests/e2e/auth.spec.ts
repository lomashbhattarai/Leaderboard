import { expect, test } from "@playwright/test";
import { adminUser, expectLoggedOut, loginViaStorage, mockApi, resetMutableMocks } from "./fixtures";

test.beforeEach(async ({ page }) => {
  resetMutableMocks();
  await mockApi(page);
});

test("unauthenticated users are blocked from protected routes", async ({ page }) => {
  await page.goto("/#/wealth-tracker");
  await expectLoggedOut(page);

  await page.goto("/#/my-portfolio");
  await expectLoggedOut(page);
});

test("login form stores authenticated state and allows protected route access", async ({ page }) => {
  await page.goto("/#/login");

  await page.getByTestId("email-input").fill("investor@example.com");
  await page.getByTestId("password-input").fill("password123");
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/#\/my-portfolio/);
  await expect(page.getByTestId("portfolio-summary")).toBeVisible();
  await expect(
    page.evaluate(() => window.localStorage.getItem("token"))
  ).resolves.toContain("e2e-token");
});

test("logout returns user to logged-out state", async ({ page }) => {
  await loginViaStorage(page);
  await page.goto("/#/my-portfolio");

  await page.getByRole("button", { name: /account settings/i }).click();
  await page.getByText("Logout").click();

  await expect(page).toHaveURL(/#\/login/);
  await expectLoggedOut(page);
});

test("admin route authorizes admin and rejects normal logged-in users", async ({ page }) => {
  await loginViaStorage(page);
  await page.goto("/#/admin/dashboard");
  await expect(page.getByText(/access denied/i)).toBeVisible();

  await page.evaluate(() => window.localStorage.clear());
  await loginViaStorage(page, adminUser);
  await page.reload();
  await page.goto("/#/admin/dashboard");
  await expect(page.getByText(/admin dashboard/i)).toBeVisible();
});
