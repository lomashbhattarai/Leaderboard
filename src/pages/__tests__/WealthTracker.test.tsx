import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WealthTracker from "../WealthTracker";
import { useWealth } from "../../hooks/useWealth";
import { renderWithProviders } from "../../test-utils/render";
import { mockWealthEntries } from "../../test-utils/mockData";

jest.mock("../../hooks/useWealth");
jest.mock("../../components/WealthChart", () => () => <div />);
jest.mock("../../components/WealthProjectionChart", () => () => <div />);

const mockedUseWealth = jest.mocked(useWealth);

describe("Wealth tracker page", () => {
  const addWealthEntry = jest.fn();
  const updateWealthEntry = jest.fn();
  const deleteWealthEntry = jest.fn();

  beforeEach(() => {
    mockedUseWealth.mockReturnValue({
      wealthEntries: mockWealthEntries,
      addWealthEntry,
      updateWealthEntry,
      deleteWealthEntry,
      addMultipleWealthEntries: jest.fn(),
      netWorth: 75000,
      loading: false,
      error: null,
    } as any);
  });

  it("renders wealth entries and calculated net worth", () => {
    renderWithProviders(<WealthTracker />, { authState: "authenticated" });

    expect(screen.getByText(/total wealth/i)).toBeInTheDocument();
    expect(screen.getByText(/75,000/)).toBeInTheDocument();
    expect(screen.getByTestId("wealth-entries-table")).toBeInTheDocument();
    expect(screen.getByText("Emergency Fund")).toBeInTheDocument();
    expect(screen.getByText("Margin Loan")).toBeInTheDocument();
  });

  it("can submit a new wealth entry with mocked mutation", async () => {
    renderWithProviders(<WealthTracker />, { authState: "authenticated" });

    await userEvent.click(screen.getByRole("button", { name: /add new asset/i }));
    await userEvent.type(screen.getByLabelText(/asset name/i), "Broker Cash");
    await userEvent.type(screen.getByLabelText(/description/i), "Cash collateral");
    await userEvent.type(screen.getByLabelText(/current amount/i), "15000");
    await userEvent.click(screen.getByRole("button", { name: /add asset/i }));

    await waitFor(() =>
      expect(addWealthEntry).toHaveBeenCalledWith({
        name: "Broker Cash",
        assetType: "Cash",
        description: "Cash collateral",
        amount: 15000,
      })
    );
  });

  it("can delete an entry", async () => {
    renderWithProviders(<WealthTracker />, { authState: "authenticated" });

    await userEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);

    expect(deleteWealthEntry).toHaveBeenCalledWith("401");
  });
});
