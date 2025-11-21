import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("should have correct metadata and elements", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Nepse Leader - Your Stock Market Leaderboard"
    );
    await expect(
      page.getByRole("heading", {
        name: "NEPSE LEADER",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Stocks",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Leaderboard",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Journals",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Portfolio",
      })
    ).toBeVisible();
  });

  test("should have correct navigation links", async ({ page }) => {
    await page
      .getByRole("link", {
        name: "Stocks",
      })
      .click();

    await expect(page).toHaveURL("http://localhost:3000/#/stocks");

    await page
      .getByRole("link", {
        name: "Leaderboard",
      })
      .click();
    await expect(page).toHaveURL("http://localhost:3000/#/leaderboard");
  });
});


test.describe('Stocks Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/#/stocks");
  });

  test('Should have the correct heading', async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Nepal Stock Exchange Listed Companies",
      })
    ).toBeVisible();
  });

  test("should have the search input", async ({ page }) => {
    await expect(
      page.getByRole("textbox", {
        name: "Search by symbol or company name...",
      })
    ).toBeVisible();
  });
});
