import React, { useMemo } from "react";
import { Button } from "@mui/material";
import { Transaction } from "../hooks/useEarningsCalculator";
import TableView, { ColumnConfig } from "./common/TableView";
import { formatAmount } from "../utils/helper";

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (sn: number) => void;
}

interface TransactionTableData extends Transaction {
  totalAmount: number;
  cumulativeAmount: number;
  months: number;
  days: number;
}

const tableHeaders: ColumnConfig[] = [
  {
    label: "S.N",
    key: "sn",
  },
  {
    label: "Name",
    key: "name",
  },
  {
    label: "Type",
    key: "type",
  },
  {
    label: "Start Date",
    key: "startDate",
  },
  {
    label: "End Date",
    key: "endDate",
  },
  // {
  //   label: "No. of Days",
  //   key: "days",
  // },
  {
    label: "No. of Months",
    key: "months",
  },
  {
    label: "Monthly Amount",
    key: "amount",
    render: (value: number, row: TransactionTableData) =>
      row.type === "salary" ? formatAmount(value) : "-",
  },
  {
    label: "Total Amount",
    key: "totalAmount",
    render: (value: number) => formatAmount(value),
  },
  // {
  //   label: "Cumulative Amount",
  //   key: "cumulativeAmount",
  // },
];

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  const tableData = useMemo(() => {
    let cumulativeAmount = 0;
    return transactions.map((transaction, index) => {
      const startDate = new Date(transaction.startDate);
      const endDate = new Date(transaction.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

      const totalAmount =
        transaction.type === "salary"
          ? transaction.amount * diffMonths
          : transaction.amount;

      if (transaction.type === "expense") {
        cumulativeAmount -= totalAmount;
      } else {
        cumulativeAmount += totalAmount;
      }

      return {
        sn: index + 1,
        name: transaction.name, // Add this line
        type: transaction.type,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        days: diffDays,
        months: diffMonths
          ? `${diffMonths} (${(diffMonths / 12).toFixed(1)} years)`
          : "",
        amount: transaction.amount,
        totalAmount: totalAmount,
        cumulativeAmount: cumulativeAmount,
      };
    });
  }, [transactions]);

  const exportToCSV = () => {
    const headers = [
      "S.N",
      "Name",
      "Type",
      "Start Date",
      "End Date",
      "No. of Days",
      "No. of Months",
      "Monthly Amount",
      "Total Amount",
      "Cumulative Amount",
    ];

    const csvContent = [
      headers.join(","),
      ...tableData.map((row) =>
        [
          row.sn,
          row.name,
          row.type,
          row.startDate,
          row.endDate,
          row.days,
          row.months,
          row.amount?.toFixed(2),
          row.totalAmount?.toFixed(2),
          row.cumulativeAmount?.toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={exportToCSV}
        style={{ marginBottom: "1rem" }}
      >
        Export as CSV
      </Button>
      <TableView
        columns={tableHeaders}
        tableData={tableData}
        onDeleteTransaction={onDeleteTransaction}
      />
    </>
  );
};

export default TransactionTable;
