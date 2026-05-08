import React from "react";
import { screen } from "@testing-library/react";
import TransactionHistory from "../TransactionHistory";
import { usePortfolioTransactions } from "../../api/queries/useStockTransactions";
import { renderWithProviders } from "../../test-utils/render";
import { mockPortfolio, mockTransactions } from "../../test-utils/mockData";

jest.mock("../../api/queries/useStockTransactions", () => ({
  usePortfolioTransactions: jest.fn(),
  useUpdateStockTransaction: () => ({ mutateAsync: jest.fn() }),
  useDeleteStockTransaction: () => ({ mutateAsync: jest.fn() }),
}));

const mockedUsePortfolioTransactions = jest.mocked(usePortfolioTransactions);

describe("Transaction history page", () => {
  it("renders BUY and SELL transaction rows", () => {
    mockedUsePortfolioTransactions.mockReturnValue({
      data: {
        status: "success",
        data: {
          portfolio: mockPortfolio,
          transactions: mockTransactions,
          summary: {
            totalCapitalInvested: 38500,
            currentCapitalBalance: 20400,
            totalRealizedPL: 100,
            totalSharesHeld: 70,
            avgCostBasis: 480,
          },
        },
      },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<TransactionHistory />, {
      route: "/portfolio/201/transactions",
      authState: "authenticated",
    });

    expect(screen.getByText(/transaction history for regression portfolio/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("transaction-row")).toHaveLength(2);
    expect(screen.getByText("BUY")).toBeInTheDocument();
    expect(screen.getByText("SELL")).toBeInTheDocument();
    expect(screen.getByText("NABIL")).toBeInTheDocument();
    expect(screen.getByText("NICA")).toBeInTheDocument();
  });

  it("handles empty transaction state", () => {
    mockedUsePortfolioTransactions.mockReturnValue({
      data: {
        status: "success",
        data: {
          portfolio: mockPortfolio,
          transactions: [],
          summary: undefined,
        },
      },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<TransactionHistory />, {
      route: "/portfolio/201/transactions",
      authState: "authenticated",
    });

    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument();
  });
});
