import { expect, test } from "@playwright/test";
import { loginViaStorage, mockApi, resetMutableMocks } from "./fixtures";

test.beforeEach(async ({ page }) => {
  resetMutableMocks();
  await mockApi(page);
  await loginViaStorage(page);
});

test("journals render and can create a new entry", async ({ page }) => {
  await page.goto("/#/journals");

  await expect(page.getByText("Market Review")).toBeVisible();
  await page.getByRole("button", { name: /add/i }).click();
  await page.getByLabel(/content/i).fill("A disciplined e2e journal entry.");
  await page.getByRole("button", { name: /create journal/i }).click();

  await expect(
    page.getByTestId("journal-list").getByText("A disciplined e2e journal entry.")
  ).toBeVisible();
});

test("journals can delete an entry", async ({ page }) => {
  await page.goto("/#/journals");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByTestId("journal-row").getByRole("button").last().click();

  await expect(page.getByText("Market Review")).toBeHidden();
});
