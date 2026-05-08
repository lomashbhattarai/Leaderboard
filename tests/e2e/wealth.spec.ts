import { expect, test } from "@playwright/test";
import { loginViaStorage, mockApi, resetMutableMocks } from "./fixtures";

test.beforeEach(async ({ page }) => {
  resetMutableMocks();
  await mockApi(page);
  await loginViaStorage(page);
});

test("wealth tracker renders assets, liabilities, and net worth", async ({ page }) => {
  await page.goto("/#/wealth-tracker");

  await expect(page.getByText("Emergency Fund")).toBeVisible();
  await expect(page.getByText("Margin Loan")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 4 }).filter({ hasText: /75,000/ })
  ).toBeVisible();
});

test("wealth tracker can add and delete an entry", async ({ page }) => {
  await page.goto("/#/wealth-tracker");

  await page.getByRole("button", { name: /add new asset/i }).click();
  await page.getByLabel(/asset name/i).fill("Broker Cash");
  await page.getByLabel(/description/i).fill("Cash collateral");
  await page.getByLabel(/current amount/i).fill("15000");
  await page.getByRole("button", { name: /add asset/i }).click();

  await expect(page.getByText("Broker Cash")).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByTestId("wealth-entries-table").getByRole("button", { name: /delete/i }).first().click();
  await expect(page.getByText("Emergency Fund")).toBeHidden();
});
