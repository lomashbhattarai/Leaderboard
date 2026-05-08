import React from "react";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import Stocks from "../Stocks";
import { useStocksWithPerformance } from "../../api/queries";
import { useUploadStockPrices } from "../../api/queries/useStockPrices";
import { renderWithProviders } from "../../test-utils/render";
import { mockStocks } from "../../test-utils/mockData";

jest.mock("../../api/queries", () => ({
  useStocksWithPerformance: jest.fn(),
}));
jest.mock("../../api/queries/useStockPrices", () => ({
  useUploadStockPrices: jest.fn(),
}));
jest.mock("../../components/AddToWatchListHover", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockedUseStocks = jest.mocked(useStocksWithPerformance);
const mockedUseUpload = jest.mocked(useUploadStockPrices);

describe("Stocks page", () => {
  beforeEach(() => {
    mockedUseStocks.mockReturnValue({
      data: mockStocks,
      isLoading: false,
      error: null,
    } as any);
    mockedUseUpload.mockReturnValue({ mutateAsync: jest.fn() } as any);
  });

  it("renders stock list from mocked API data", () => {
    renderWithProviders(<Stocks />, { authState: "authenticated" });

    expect(screen.getByTestId("stocks-list")).toBeInTheDocument();
    expect(screen.getByText("NABIL")).toBeInTheDocument();
    expect(screen.getByText("Nabil Bank Limited")).toBeInTheDocument();
    expect(screen.getByText("NICA")).toBeInTheDocument();
  });

  it("search filters by symbol or company name", async () => {
    renderWithProviders(<Stocks />, { authState: "authenticated" });

    await userEvent.type(screen.getByTestId("stock-search-input"), "nabil");

    expect(screen.getByText("NABIL")).toBeInTheDocument();
    expect(screen.queryByText("NICA")).not.toBeInTheDocument();
  });

  it("clicking a stock navigates to detail route", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/stock/:symbol" element={<p>stock detail opened</p>} />
      </Routes>,
      { route: "/stocks", authState: "authenticated" }
    );

    await userEvent.click(within(screen.getByTestId("stocks-list")).getByText("NABIL"));

    expect(await screen.findByText("stock detail opened")).toBeInTheDocument();
  });
});
