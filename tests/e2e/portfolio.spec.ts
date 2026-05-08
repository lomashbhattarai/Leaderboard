import { expect, test } from "@playwright/test";
import { loginViaStorage, mockApi, resetMutableMocks } from "./fixtures";

test.beforeEach(async ({ page }) => {
  resetMutableMocks();
  await mockApi(page);
  await loginViaStorage(page);
});

test("authenticated user sees portfolio summary and holdings", async ({ page }) => {
  await page.goto("/#/my-portfolio");

  await expect(page.getByTestId("portfolio-summary")).toBeVisible();
  await expect(page.getByTestId("portfolio-stocks-table")).toBeVisible();
  await expect(page.getByRole("link", { name: "NABIL" })).toBeVisible();
  await expect(page.getByRole("button", { name: /transaction history/i })).toBeVisible();
});

test("transaction history route renders BUY and SELL transactions", async ({ page }) => {
  await page.goto("/#/portfolio/201/transactions");

  await expect(page.getByText(/transaction history for regression portfolio/i)).toBeVisible();
  await expect(page.getByText("BUY", { exact: true })).toBeVisible();
  await expect(page.getByText("SELL", { exact: true })).toBeVisible();
  await expect(page.getByTestId("transaction-row").first().getByText("NABIL")).toBeVisible();
});
