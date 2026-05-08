import { expect, test } from "@playwright/test";
import { mockApi, resetMutableMocks } from "./fixtures";

test.beforeEach(async ({ page }) => {
  resetMutableMocks();
  await mockApi(page);
});

test("home route loads public leaderboard", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /nepse leaderboard/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Regression Portfolio" })).toBeVisible();
});

test("leaderboard route displays mocked leaderboard data", async ({ page }) => {
  await page.goto("/#/leaderboard");

  await expect(page.getByTestId("leaderboard-list")).toBeVisible();
  await expect(page.getByRole("link", { name: "Regression Portfolio" })).toBeVisible();
});

test("stocks route supports search and stock detail navigation", async ({ page }) => {
  await page.goto("/#/stocks");

  await expect(page.getByRole("link", { name: "NABIL" })).toBeVisible();
  await page.getByTestId("stock-search-input").fill("nica");
  await expect(page.getByRole("link", { name: "NICA" })).toBeVisible();
  await expect(page.getByRole("link", { name: "NABIL" })).toBeHidden();

  await page.getByRole("link", { name: "NICA" }).click();
  await expect(page).toHaveURL(/#\/stock\/NICA/);
  await expect(page.getByRole("heading", { name: "NICA" })).toBeVisible();
});
