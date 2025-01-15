import React from "react";
import { Typography, Stack, Button, Drawer, IconButton } from "@mui/material";
import RandomTransactionInput from "../components/RandomTransactionInput";
import CSVImport from "../components/CSVImport";
import EarningsChart from "../components/EarningsChart";
import {
  Transaction,
  useEarningsCalculator,
} from "../hooks/useEarningsCalculator";
import TransactionTable from "../components/TransactionTable";
import AmountSummary from "../components/common/AmountSummary";
import CloseIcon from "@mui/icons-material/Close";

const EarningsTracker: React.FC = () => {
  const {
    transactions,
    addTransaction,
    addMultipleTransactions,
    totalWealth,
    deleteTransaction,
  } = useEarningsCalculator();

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleImport = (csvData: string[][]) => {
    const parseDate = (dateString: string) => {
      const [day, month, year] = dateString.split("/").map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed in JS Date
    };

    const transactions: Transaction[] = csvData.slice(1).map((row) => {
      let startDate = parseDate(row[3]);
      let endDate = parseDate(row[4]);
      // Check if the dates are valid
      if (isNaN(startDate.getTime())) {
        console.error(`Invalid start date found in row: ${row}`);
        startDate = new Date();
      }
      if (isNaN(endDate.getTime())) {
        console.error(`Invalid end date found in row: ${row}`);
        endDate = new Date();
      }
      return {
        sn: Number(row[0]),
        id: row[0],
        startDate: startDate,
        endDate: endDate,
        description: "",
        name: row[1],
        amount: parseFloat(row[7]),
        type: row[2].trim().toLowerCase() as "salary" | "earning" | "expense",
      };
    });
    addMultipleTransactions(transactions);
  };

  const transactionDrawer = (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <div style={{ width: "400px", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h6">Add Transaction</Typography>
          <IconButton
            onClick={() => setIsDrawerOpen(false)}
            edge="end"
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <RandomTransactionInput
          onAddTransaction={(transaction) => {
            addTransaction(transaction);
            setIsDrawerOpen(false);
          }}
        />
      </div>
    </Drawer>
  );

  return (
    <div className="p-4">
      {transactionDrawer}

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <AmountSummary label="Total Earnings" value={totalWealth} />
        <div>
          <CSVImport handleImport={handleImport} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsDrawerOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
      </Stack>

      <TransactionTable
        transactions={transactions}
        onDeleteTransaction={deleteTransaction}
      />
      <EarningsChart transactions={transactions} />
    </div>
  );
};

export default EarningsTracker;
