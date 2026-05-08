import {
  PortfolioPrivacy,
  TransactionType,
  type Journal,
  type LeaderboardEntry,
  type Portfolio,
  type PortfolioStock,
  type StockTransactionWithBalance,
  type StockWithPerformance,
  type User,
  type WatchListEntry,
} from "../types/api";
import type { WealthEntry } from "../types/wealth";

const timestamp = "2026-01-15T10:00:00.000Z";

export const mockUser: User & { role: "user" } = {
  id: 1,
  fullName: "Test Investor",
  email: "investor@example.com",
  role: "user",
  createdAt: timestamp,
  updatedAt: timestamp,
};

export const mockAdminUser: User & { role: "admin" } = {
  ...mockUser,
  id: 2,
  email: "admin@example.com",
  fullName: "Admin Investor",
  role: "admin",
};

export const mockStocks: StockWithPerformance[] = [
  {
    id: 11,
    symbol: "NABIL",
    name: "Nabil Bank Limited",
    latestPrice: 612,
    performance1D: 1.25,
    performance1W: 3.5,
    performance1M: 6.75,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 12,
    symbol: "NICA",
    name: "NIC Asia Bank Limited",
    latestPrice: 421,
    performance1D: -0.5,
    performance1W: 1.1,
    performance1M: 2.25,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export const mockPortfolioStocks: PortfolioStock[] = [
  {
    id: 101,
    portfolioId: 201,
    stockId: 11,
    quantity: 50,
    buyPrice: 500,
    buyDate: "2025-12-01",
    latestClosingPrice: 612,
    performance1D: 1.25,
    performance1W: 3.5,
    performance1M: 6.75,
    performance1Y: 18,
    createdAt: timestamp,
    updatedAt: timestamp,
    stock: mockStocks[0],
    stopLosses: [],
  },
  {
    id: 102,
    portfolioId: 201,
    stockId: 12,
    quantity: 30,
    buyPrice: 450,
    buyDate: "2025-11-15",
    latestClosingPrice: 421,
    performance1D: -0.5,
    performance1W: 1.1,
    performance1M: 2.25,
    performance1Y: 7,
    createdAt: timestamp,
    updatedAt: timestamp,
    stock: mockStocks[1],
    stopLosses: [],
  },
];

export const mockPortfolio: Portfolio = {
  id: 201,
  name: "Regression Portfolio",
  userId: mockUser.id,
  createdAt: timestamp,
  updatedAt: timestamp,
  privacy: PortfolioPrivacy.SHARE_ALL,
  initialInvestment: 38500,
  currentValue: 43230,
  profitLoss: {
    value: 4730,
    percentage: 12.29,
  },
  performance: {
    daily: 1.1,
    weekly: 2.4,
    monthly: 5.6,
  },
  historicalValues: {
    oneDayAgo: { value: 42760, change: 470, percentage: 1.1 },
    oneWeekAgo: { value: 42215, change: 1015, percentage: 2.4 },
    oneMonthAgo: { value: 40938, change: 2292, percentage: 5.6 },
  },
  portfolioStocks: mockPortfolioStocks,
  user: mockUser,
};

export const mockTransactions: StockTransactionWithBalance[] = [
  {
    id: 301,
    portfolioStockId: 101,
    stockId: 11,
    transactionType: TransactionType.BUY,
    quantity: 50,
    price: 500,
    transactionDate: "2025-12-01",
    notes: "Initial NABIL buy",
    createdAt: timestamp,
    updatedAt: timestamp,
    stock: mockStocks[0],
    portfolioStock: { ...mockPortfolioStocks[0], portfolio: mockPortfolio },
    capitalBalance: 25000,
    sharesBalance: 50,
    realizedPL: 0,
    avgCostBasis: 500,
  },
  {
    id: 302,
    portfolioStockId: 102,
    stockId: 12,
    transactionType: TransactionType.SELL,
    quantity: 10,
    price: 460,
    transactionDate: "2026-01-10",
    notes: "Partial NICA sell",
    createdAt: timestamp,
    updatedAt: timestamp,
    stock: mockStocks[1],
    portfolioStock: { ...mockPortfolioStocks[1], portfolio: mockPortfolio },
    capitalBalance: 20400,
    sharesBalance: 20,
    realizedPL: 100,
    avgCostBasis: 450,
    transactionPL: 100,
  },
];

export const mockWealthEntries: WealthEntry[] = [
  {
    id: "401",
    name: "Emergency Fund",
    assetType: "Cash",
    description: "Bank balance",
    amount: 100000,
    type: "asset",
  },
  {
    id: "402",
    name: "Margin Loan",
    assetType: "Other",
    description: "Broker loan",
    amount: 25000,
    type: "liability",
  },
];

export const mockJournals: Journal[] = [
  {
    id: 501,
    userId: mockUser.id,
    portfolioStockId: null,
    stopLossId: null,
    title: "Market Review",
    content: "NABIL strength and NICA weakness drove today's decisions.",
    tags: "review",
    journalType: "general",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export const mockLeaderboardRows: LeaderboardEntry[] = [
  {
    portfolioId: 201,
    portfolioName: "Regression Portfolio",
    privacy: PortfolioPrivacy.SHARE_ALL,
    performance1D: 1.1,
    performance1W: 2.4,
    performance1M: 5.6,
    performance1Y: 18.3,
    rank1D: 1,
    rank1W: 1,
    rank1M: 2,
    rank1Y: 3,
    userName: "Test Investor",
    updatedAt: timestamp,
    userId: mockUser.id,
    topStocks: [{ symbol: "NABIL", name: "Nabil Bank Limited", percentage: 65 }],
  },
  {
    portfolioId: 202,
    portfolioName: "Income Portfolio",
    privacy: PortfolioPrivacy.SHARE_ALL,
    performance1D: -0.2,
    performance1W: 1.2,
    performance1M: 3.4,
    performance1Y: 12.1,
    rank1D: 2,
    rank1W: 3,
    rank1M: 4,
    rank1Y: 5,
    userName: "Income User",
    updatedAt: timestamp,
    userId: 3,
    topStocks: [{ symbol: "NICA", name: "NIC Asia Bank Limited", percentage: 45 }],
  },
];

export const mockWatchList: WatchListEntry[] = [
  {
    id: 601,
    userId: mockUser.id,
    stockId: 11,
    createdAt: timestamp,
    updatedAt: timestamp,
    name: "Nabil Bank Limited",
    symbol: "NABIL",
    latestPrice: 612,
    performance1D: 1.25,
    performance1W: 3.5,
    performance1M: 6.75,
  },
];
