import { expect, type Page, type Route } from "@playwright/test";

const DEFAULT_API_BASE_URL = "http://localhost:3333";

export const apiBaseUrl = (
  process.env.PLAYWRIGHT_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

const apiOrigin = new URL(apiBaseUrl).origin;

const isMockedApiRequest = (requestUrl: string) => {
  const url = new URL(requestUrl);
  return url.origin === apiOrigin;
};

export const user = {
  id: 1,
  fullName: "Test Investor",
  email: "investor@example.com",
  role: "user",
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
};

export const adminUser = {
  ...user,
  id: 2,
  fullName: "Admin Investor",
  email: "admin@example.com",
  role: "admin",
};

export const stocks = [
  {
    id: 11,
    symbol: "NABIL",
    name: "Nabil Bank Limited",
    latestPrice: 612,
    performance1D: 1.25,
    performance1W: 3.5,
    performance1M: 6.75,
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: 12,
    symbol: "NICA",
    name: "NIC Asia Bank Limited",
    latestPrice: 421,
    performance1D: -0.5,
    performance1W: 1.1,
    performance1M: 2.25,
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
  },
];

export const portfolio = {
  id: 201,
  name: "Regression Portfolio",
  userId: user.id,
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
  privacy: "SHARE_ALL",
  initialInvestment: 38500,
  currentValue: 43230,
  profitLoss: { value: 4730, percentage: 12.29 },
  performance: { daily: 1.1, weekly: 2.4, monthly: 5.6 },
  historicalValues: {
    oneDayAgo: { value: 42760, change: 470, percentage: 1.1 },
    oneWeekAgo: { value: 42215, change: 1015, percentage: 2.4 },
    oneMonthAgo: { value: 40938, change: 2292, percentage: 5.6 },
  },
  portfolioStocks: [
    {
      id: 101,
      portfolioId: 201,
      stockId: 11,
      quantity: 50,
      buyPrice: 500,
      latestClosingPrice: 612,
      performance1D: 1.25,
      performance1W: 3.5,
      performance1M: 6.75,
      performance1Y: 18,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-01-15T10:00:00.000Z",
      stock: stocks[0],
      stopLosses: [],
    },
  ],
};

export const transactions = [
  {
    id: 301,
    portfolioStockId: 101,
    stockId: 11,
    transactionType: "BUY",
    quantity: 50,
    price: 500,
    transactionDate: "2025-12-01",
    notes: "Initial buy",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
    stock: stocks[0],
    portfolioStock: { ...portfolio.portfolioStocks[0], portfolio },
    capitalBalance: 25000,
    sharesBalance: 50,
    realizedPL: 0,
    avgCostBasis: 500,
  },
  {
    id: 302,
    portfolioStockId: 101,
    stockId: 11,
    transactionType: "SELL",
    quantity: 10,
    price: 550,
    transactionDate: "2026-01-10",
    notes: "Partial sell",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
    stock: stocks[0],
    portfolioStock: { ...portfolio.portfolioStocks[0], portfolio },
    capitalBalance: 19500,
    sharesBalance: 40,
    realizedPL: 500,
    avgCostBasis: 500,
    transactionPL: 500,
  },
];

let journals = [
  {
    id: 501,
    userId: user.id,
    portfolioStockId: null,
    stopLossId: null,
    title: "Market Review",
    content: "NABIL strength guided the trading plan.",
    tags: "review",
    journalType: "general",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
  },
];

let wealthEntries = [
  {
    id: 401,
    name: "Emergency Fund",
    assetType: "Cash",
    description: "Bank balance",
    amount: 100000,
    type: "asset",
  },
  {
    id: 402,
    name: "Margin Loan",
    assetType: "Other",
    description: "Broker loan",
    amount: 25000,
    type: "liability",
  },
];

export const resetMutableMocks = () => {
  journals = [
    {
      id: 501,
      userId: user.id,
      portfolioStockId: null,
      stopLossId: null,
      title: "Market Review",
      content: "NABIL strength guided the trading plan.",
      tags: "review",
      journalType: "general",
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-01-15T10:00:00.000Z",
    },
  ];
  wealthEntries = [
    {
      id: 401,
      name: "Emergency Fund",
      assetType: "Cash",
      description: "Bank balance",
      amount: 100000,
      type: "asset",
    },
    {
      id: 402,
      name: "Margin Loan",
      assetType: "Other",
      description: "Broker loan",
      amount: 25000,
      type: "liability",
    },
  ];
};

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });

export const mockApi = async (page: Page) => {
  await page.addInitScript(() => {
    window.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent =
        ".tsqd-parent-container { display: none !important; pointer-events: none !important; }";
      document.head.appendChild(style);
    });
  });

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    if (!isMockedApiRequest(request.url())) {
      await route.continue();
      return;
    }

    if (path === "/auth/login" && method === "POST") {
      return json(route, { token: { token: "e2e-token" }, user });
    }
    if (path === "/settings") {
      return json(route, {
        status: "success",
        data: { id: 1, userId: user.id, isAnonymous: false },
      });
    }
    if (path === "/watchlist") {
      return json(route, {
        status: "success",
        watchList: [
          {
            id: 601,
            userId: user.id,
            stockId: 11,
            name: "Nabil Bank Limited",
            symbol: "NABIL",
            latestPrice: 612,
            performance1D: 1.25,
            performance1W: 3.5,
            performance1M: 6.75,
          },
        ],
      });
    }
    if (path === "/api/stocks/with-performance") {
      return json(route, { status: "success", stocks });
    }
    if (path === "/api/stocks") {
      return json(route, { status: "success", stocks });
    }
    if (path.match(/^\/api\/stocks\/\d+\/prices$/)) {
      return json(route, {
        status: "success",
        prices: [
          {
            id: 1,
            stockId: 11,
            date: "2026-01-15",
            openingPrice: 600,
            high: 620,
            low: 595,
            closingPrice: 612,
            volume: 1000,
          },
        ],
      });
    }
    if (path === "/public/portfolios/leaderboard") {
      return json(route, {
        leaderboard: [
          {
            portfolioId: 201,
            portfolioName: "Regression Portfolio",
            privacy: "SHARE_ALL",
            performance1D: 1.1,
            performance1W: 2.4,
            performance1M: 5.6,
            performance1Y: 18.3,
            rank1D: 1,
            rank1W: 1,
            rank1M: 2,
            rank1Y: 3,
            userName: "Test Investor",
            updatedAt: "2026-01-15T10:00:00.000Z",
            userId: user.id,
            topStocks: [{ symbol: "NABIL", name: "Nabil Bank Limited", percentage: 65 }],
          },
        ],
      });
    }
    if (path === "/user/portfolios") {
      return json(route, { status: "success", portfolios: [portfolio] });
    }
    if (path === "/portfolios/201/transactions") {
      return json(route, {
        status: "success",
        data: {
          portfolio,
          transactions,
          summary: {
            totalCapitalInvested: 38500,
            currentCapitalBalance: 19500,
            totalRealizedPL: 500,
            totalSharesHeld: 40,
            avgCostBasis: 500,
          },
        },
      });
    }
    if (path.match(/^\/stocks\/\d+\/my-transactions$/)) {
      return json(route, {
        status: "success",
        data: {
          stock: stocks[0],
          transactions,
          stats: {
            totalBought: 50,
            totalSold: 10,
            totalBuyValue: 25000,
            totalSellValue: 5500,
            currentHoldings: 40,
            avgBuyPrice: 500,
            avgSellPrice: 550,
          },
          summary: {
            totalCapitalInvested: 38500,
            currentCapitalBalance: 19500,
            totalRealizedPL: 500,
            totalSharesHeld: 40,
            avgCostBasis: 500,
          },
        },
      });
    }
    if (path === "/wealth-entries" && method === "GET") {
      return json(route, { status: "success", data: wealthEntries });
    }
    if (path === "/wealth-entries" && method === "POST") {
      const created = {
        id: 403,
        name: "Broker Cash",
        assetType: "Cash",
        description: "Cash collateral",
        amount: 15000,
        type: "asset",
      };
      wealthEntries = [...wealthEntries, created];
      return json(route, { status: "success", data: created });
    }
    if (path.match(/^\/wealth-entries\/\d+$/) && method === "DELETE") {
      const id = Number(path.split("/").pop());
      wealthEntries = wealthEntries.filter((entry) => entry.id !== id);
      return json(route, { status: "success" });
    }
    if (path === "/journals" && method === "GET") {
      return json(route, journals);
    }
    if (path === "/journals" && method === "POST") {
      const payload = await request.postDataJSON();
      const created = {
        id: 502,
        userId: user.id,
        portfolioStockId: null,
        stopLossId: null,
        title: payload.title || " ",
        content: payload.content,
        tags: payload.tags || null,
        journalType: payload.journalType || "general",
        createdAt: "2026-01-15T10:00:00.000Z",
        updatedAt: "2026-01-15T10:00:00.000Z",
      };
      journals = [...journals, created];
      return json(route, created);
    }
    if (path.match(/^\/journals\/\d+$/) && method === "DELETE") {
      const id = Number(path.split("/").pop());
      journals = journals.filter((journal) => journal.id !== id);
      return json(route, { status: "success" });
    }
    if (path.startsWith("/admin/dashboard")) {
      if (path === "/admin/dashboard/stats") {
        return json(route, {
          totalUsers: 2,
          activeUsers: 1,
          weeklyLogins: 4,
          totalPortfolios: 1,
          totalTransactions: 2,
        });
      }
      if (path === "/admin/dashboard/users/top-active") {
        return json(route, [
          {
            rank: 1,
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            lastLogin: "2026-01-15T10:00:00.000Z",
            createdAt: "2026-01-15T10:00:00.000Z",
          },
        ]);
      }
    }
    if (path === "/admin/dashboard/nepse/logs") {
      return json(route, []);
    }
    if (path === "/admin/dashboard/nepse/latest") {
      return json(route, null);
    }

    return json(route, { status: "success", data: [] });
  });
};

export const loginViaStorage = async (page: Page, loginUser = user) => {
  await page.addInitScript(({ currentUser }) => {
    window.localStorage.setItem("token", JSON.stringify({ token: "e2e-token" }));
    window.localStorage.setItem("user", JSON.stringify(currentUser));
  }, { currentUser: loginUser });

  if (!page.url().startsWith("about:blank")) {
    await page.evaluate(({ currentUser }) => {
      window.localStorage.setItem("token", JSON.stringify({ token: "e2e-token" }));
      window.localStorage.setItem("user", JSON.stringify(currentUser));
    }, { currentUser: loginUser });
  }
};

export const expectLoggedOut = async (page: Page) => {
  await expect(page.getByTestId("login-form")).toBeVisible();
};
