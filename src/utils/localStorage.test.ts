import {
  getTransactions,
  saveTransactions,
} from "./localStorage";
import type { Transaction } from "../hooks/useEarningsCalculator";

describe("localStorage transaction utilities", () => {
  const transaction: Transaction = {
    id: "tx-1",
    sn: 1,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-02-01"),
    amount: 1000,
    type: "earning",
    description: "Bonus",
    name: "Bonus",
  };

  it("reads empty transactions safely", () => {
    expect(getTransactions()).toEqual([]);
  });

  it("persists transactions and restores date fields", () => {
    saveTransactions([transaction]);

    const stored = getTransactions();

    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ id: "tx-1", amount: 1000 });
    expect(stored[0].startDate).toBeInstanceOf(Date);
    expect(stored[0].endDate).toBeInstanceOf(Date);
  });
});
