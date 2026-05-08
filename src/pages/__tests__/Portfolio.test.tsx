import React from "react";
import { screen } from "@testing-library/react";
import Portfolio from "../Portfolio";
import { usePortfolio } from "../../hooks/usePortfolio";
import { renderWithProviders } from "../../test-utils/render";
import { mockPortfolio, mockPortfolioStocks } from "../../test-utils/mockData";

jest.mock("../../hooks/usePortfolio");
jest.mock("../../api/queries", () => ({
  useCreateJournal: () => ({ mutateAsync: jest.fn() }),
  useJournals: () => ({ data: [] }),
}));
jest.mock("../../api/queries/usePortfolioStocks", () => ({
  useCreatePortfolioStock: () => ({ mutateAsync: jest.fn() }),
  useUpdatePortfolioStock: () => ({ mutateAsync: jest.fn() }),
  useDeletePortfolioStock: () => ({ mutateAsync: jest.fn() }),
}));
jest.mock("../../api/queries/useStockTransactions", () => ({
  useStockTransactions: () => ({ data: { data: { transactions: [], summary: {} } } }),
  useCreateStockTransaction: () => ({ mutateAsync: jest.fn() }),
  useUpdateStockTransaction: () => ({ mutateAsync: jest.fn() }),
  useDeleteStockTransaction: () => ({ mutateAsync: jest.fn() }),
  useCreateTransactionWithStock: () => ({ mutateAsync: jest.fn() }),
}));
jest.mock("../../components/PortfolioChart", () => () => <div />);
jest.mock("../../components/charts/AllocationChart", () => () => <div />);
jest.mock("../../components/charts/PerformanceChart", () => () => <div />);

const mockedUsePortfolio = jest.mocked(usePortfolio);

describe("Portfolio page", () => {
  it("renders portfolio summary and holdings", () => {
    mockedUsePortfolio.mockReturnValue({
      portfolio: mockPortfolio,
      portfolioStocksFromDb: mockPortfolioStocks,
      portfolioId: mockPortfolio.id,
      portfolioName: mockPortfolio.name,
      privacy: mockPortfolio.privacy,
      addPortfolio: jest.fn(),
    } as any);

    renderWithProviders(<Portfolio />, { authState: "authenticated" });

    expect(screen.getByTestId("portfolio-summary")).toBeInTheDocument();
    expect(screen.getByTestId("portfolio-stocks-table")).toBeInTheDocument();
    expect(screen.getByText("NABIL")).toBeInTheDocument();
    expect(screen.getByText("NICA")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /transaction history/i })).toBeInTheDocument();
  });

  it("handles empty portfolio state", () => {
    mockedUsePortfolio.mockReturnValue({
      portfolio: undefined,
      portfolioStocksFromDb: [],
      portfolioId: 0,
      portfolioName: "",
      privacy: "PRIVATE",
      addPortfolio: jest.fn(),
    } as any);

    renderWithProviders(<Portfolio />, { authState: "authenticated" });

    expect(screen.getByText(/login to your meroshare account/i)).toBeInTheDocument();
    expect(screen.getByText(/no holdings found/i)).toBeInTheDocument();
  });
});
