import React from "react";
import { screen } from "@testing-library/react";
import Leaderboard from "../Leaderboard";
import { useLeaderboard, useUserPortfolios, useWatchList } from "../../api/queries";
import { usePortfolio } from "../../hooks/usePortfolio";
import { renderWithProviders } from "../../test-utils/render";
import { mockLeaderboardRows } from "../../test-utils/mockData";

jest.mock("../../api/queries", () => ({
  useLeaderboard: jest.fn(),
  useUserPortfolios: jest.fn(),
  useWatchList: jest.fn(),
}));
jest.mock("../../hooks/usePortfolio");

const mockedUseLeaderboard = jest.mocked(useLeaderboard);
const mockedUseUserPortfolios = jest.mocked(useUserPortfolios);
const mockedUseWatchList = jest.mocked(useWatchList);
const mockedUsePortfolio = jest.mocked(usePortfolio);

describe("Leaderboard page", () => {
  beforeEach(() => {
    mockedUseUserPortfolios.mockReturnValue({ data: [] } as any);
    mockedUseWatchList.mockReturnValue({ data: { watchList: [] } } as any);
    mockedUsePortfolio.mockReturnValue({
      addPortfolio: jest.fn(),
      portfolioId: 0,
      portfolioStocksFromDb: [],
    } as any);
  });

  it("renders leaderboard rows from mocked API data", () => {
    mockedUseLeaderboard.mockReturnValue({
      data: mockLeaderboardRows,
      isLoading: false,
      isError: false,
    } as any);

    renderWithProviders(<Leaderboard />);

    expect(screen.getByTestId("leaderboard-list")).toBeInTheDocument();
    expect(screen.getByText("Regression Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Income Portfolio")).toBeInTheDocument();
  });

  it("handles empty leaderboard state", () => {
    mockedUseLeaderboard.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    renderWithProviders(<Leaderboard />);

    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
  });

  it("handles API error state", () => {
    mockedUseLeaderboard.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    renderWithProviders(<Leaderboard />);

    expect(screen.getByText(/failed to load leaderboard data/i)).toBeInTheDocument();
  });
});
