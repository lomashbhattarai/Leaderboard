import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  type Transaction,
  useEarningsCalculator,
} from "../useEarningsCalculator";
import { saveTransactions } from "../../utils/localStorage";

const makeTransaction = (
  overrides: Partial<Transaction> = {}
): Omit<Transaction, "id"> => ({
  sn: 1,
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-02-01"),
  amount: 1000,
  type: "earning",
  description: "Bonus",
  name: "Bonus",
  ...overrides,
});

const Harness = () => {
  const {
    transactions,
    addTransaction,
    addMultipleTransactions,
    deleteTransaction,
    totalWealth,
  } = useEarningsCalculator();

  return (
    <div>
      <p>count:{transactions.length}</p>
      <p>total:{totalWealth}</p>
      <button onClick={() => addTransaction(makeTransaction())}>
        add earning
      </button>
      <button
        onClick={() =>
          addTransaction(makeTransaction({ type: "expense", amount: 250 }))
        }
      >
        add expense
      </button>
      <button
        onClick={() =>
          addTransaction(
            makeTransaction({
              type: "salary",
              amount: 1000,
              startDate: new Date("2026-01-01"),
              endDate: new Date("2026-04-01"),
            })
          )
        }
      >
        add salary
      </button>
      <button
        onClick={() =>
          addMultipleTransactions([
            { ...makeTransaction(), id: "a" },
            { ...makeTransaction({ amount: 500 }), id: "b" },
          ])
        }
      >
        add many
      </button>
      <button onClick={() => deleteTransaction(0)}>delete first</button>
    </div>
  );
};

describe("useEarningsCalculator", () => {
  it("starts with localStorage transactions if present", async () => {
    saveTransactions([{ ...makeTransaction({ amount: 700 }), id: "stored" }]);

    render(<Harness />);

    expect(await screen.findByText("count:1")).toBeInTheDocument();
    expect(screen.getByText("total:700")).toBeInTheDocument();
  });

  it("adds one or many transactions and persists them", async () => {
    render(<Harness />);

    await userEvent.click(screen.getByRole("button", { name: /add earning/i }));
    await userEvent.click(screen.getByRole("button", { name: /add many/i }));

    expect(screen.getByText("count:3")).toBeInTheDocument();
    expect(screen.getByText("total:2500")).toBeInTheDocument();
    expect(localStorage.getItem("wealth_calculator_transactions")).toContain(
      "Bonus"
    );
  });

  it("deletes a transaction", async () => {
    render(<Harness />);

    await userEvent.click(screen.getByRole("button", { name: /add earning/i }));
    await userEvent.click(screen.getByRole("button", { name: /add many/i }));
    await userEvent.click(screen.getByRole("button", { name: /delete first/i }));

    expect(screen.getByText("count:2")).toBeInTheDocument();
    expect(screen.getByText("total:1500")).toBeInTheDocument();
  });

  it("calculates salary across months and subtracts expenses", async () => {
    render(<Harness />);

    await userEvent.click(screen.getByRole("button", { name: /add salary/i }));
    await userEvent.click(screen.getByRole("button", { name: /add expense/i }));

    expect(screen.getByText("total:2750")).toBeInTheDocument();
  });
});
