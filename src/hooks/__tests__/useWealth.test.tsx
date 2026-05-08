import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useWealth } from "../useWealth";
import { mockWealthEntries } from "../../test-utils/mockData";
import * as wealthApi from "../../api/wealth";

jest.mock("../../api/wealth");

const mockedWealthApi = jest.mocked(wealthApi);

const Harness = () => {
  const {
    wealthEntries,
    loading,
    error,
    netWorth,
    addWealthEntry,
    updateWealthEntry,
    deleteWealthEntry,
  } = useWealth();

  return (
    <div>
      <p>loading:{String(loading)}</p>
      <p>error:{error || "none"}</p>
      <p>count:{wealthEntries.length}</p>
      <p>net:{netWorth}</p>
      <button
        onClick={() =>
          addWealthEntry({
            name: "Broker Balance",
            assetType: "Cash",
            description: "Cash collateral",
            amount: 15000,
            type: "asset",
          }).catch(() => undefined)
        }
      >
        add wealth
      </button>
      <button
        onClick={() =>
          updateWealthEntry("401", {
            name: "Updated Fund",
            assetType: "Cash",
            description: "Updated",
            amount: 125000,
            type: "asset",
          }).catch(() => undefined)
        }
      >
        update wealth
      </button>
      <button onClick={() => deleteWealthEntry("402").catch(() => undefined)}>
        delete wealth
      </button>
    </div>
  );
};

describe("useWealth", () => {
  beforeEach(() => {
    mockedWealthApi.getWealthEntries.mockResolvedValue(mockWealthEntries);
    mockedWealthApi.createWealthEntry.mockResolvedValue({
      id: "403",
      name: "Broker Balance",
      assetType: "Cash",
      description: "Cash collateral",
      amount: 15000,
      type: "asset",
    });
    mockedWealthApi.updateWealthEntry.mockResolvedValue({
      id: "401",
      name: "Updated Fund",
      assetType: "Cash",
      description: "Updated",
      amount: 125000,
      type: "asset",
    });
    mockedWealthApi.deleteWealthEntry.mockResolvedValue();
  });

  it("loads wealth entries and calculates net worth as assets minus liabilities", async () => {
    render(<Harness />);

    expect(await screen.findByText("loading:false")).toBeInTheDocument();
    expect(screen.getByText("count:2")).toBeInTheDocument();
    expect(screen.getByText("net:75000")).toBeInTheDocument();
  });

  it("adds, updates, and deletes wealth entries", async () => {
    render(<Harness />);

    expect(await screen.findByText("count:2")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /add wealth/i }));
    await screen.findByText("count:3");
    expect(screen.getByText("net:90000")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /update wealth/i }));
    expect(await screen.findByText("net:115000")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /delete wealth/i }));
    await waitFor(() => expect(mockedWealthApi.deleteWealthEntry).toHaveBeenCalledWith(402));
    expect(await screen.findByText("count:2")).toBeInTheDocument();
    expect(screen.getByText("net:140000")).toBeInTheDocument();
  });

  it("surfaces fetch and mutation errors", async () => {
    mockedWealthApi.getWealthEntries.mockRejectedValueOnce({
      response: { data: { message: "Fetch failed" } },
    });
    render(<Harness />);

    expect(await screen.findByText("error:Fetch failed")).toBeInTheDocument();
  });

  it("surfaces create errors", async () => {
    mockedWealthApi.createWealthEntry.mockRejectedValueOnce({
      response: { data: { message: "Create failed" } },
    });
    render(<Harness />);

    expect(await screen.findByText("count:2")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /add wealth/i }));

    expect(await screen.findByText("error:Create failed")).toBeInTheDocument();
  });
});
