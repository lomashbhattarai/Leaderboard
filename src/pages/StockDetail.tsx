import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import TableView, { ColumnConfig } from "../components/common/TableView";
import { useStockPrices } from "../api/queries/useStockPrices";
import { useStockContext } from "../contexts/StockContext";
import {
  useMyStockTransactions,
  useDeleteStockTransaction,
} from "../api/queries/useStockTransactions";
import TransactionTimeline from "../components/TransactionTimeline";
import TransactionForm from "../components/TransactionForm";
import { formatAmount } from "../utils/helper";
import { showToast } from "../utils/toast";
import { StockTransaction } from "../types/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stock-tabpanel-${index}`}
      aria-labelledby={`stock-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { stockMap } = useStockContext();
  const stockId = stockMap[symbol!];
  const [tabValue, setTabValue] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<StockTransaction | null>(null);

  const {
    data: stockPrices,
    isLoading: pricesLoading,
    error: pricesError,
  } = useStockPrices(stockId || 0);
  const { data: transactionsData, isLoading: transactionsLoading } =
    useMyStockTransactions(stockId || 0);
  const deleteTransaction = useDeleteStockTransaction();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: StockTransaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction.mutateAsync(transactionId);
        showToast.success("Transaction deleted successfully");
      } catch (error) {
        showToast.error("Failed to delete transaction");
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  const columns: ColumnConfig[] = [
    { label: "Date", key: "date", align: "left" },
    { label: "Open", key: "open", align: "right" },
    { label: "High", key: "high", align: "right" },
    { label: "Low", key: "low", align: "right" },
    { label: "Close", key: "closingPrice", align: "right" },
    { label: "Volume", key: "volume", align: "right" },
  ];

  const stats = transactionsData?.data.stats;

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {symbol}
      </Typography>

      {transactionsData && stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Current Holdings
                </Typography>
                <Typography variant="h6">{stats.currentHoldings}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Total Bought
                </Typography>
                <Typography variant="h6">{stats.totalBought}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Avg Buy Price
                </Typography>
                <Typography variant="h6">
                  {formatAmount(stats.avgBuyPrice, true)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Total Sold
                </Typography>
                <Typography variant="h6">{stats.totalSold}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="stock detail tabs"
        >
          <Tab label="Overview" />
          <Tab label="My Transactions" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Company Information
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Details for {symbol} will be displayed here
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Stock Prices
            </Typography>
            {pricesLoading && <Typography>Loading...</Typography>}
            {pricesError && (
              <Typography color="error">Error loading stock prices</Typography>
            )}
            {stockPrices && stockPrices.length > 0 && (
              <TableView
                columns={columns}
                tableData={stockPrices}
                title="Historical Prices"
              />
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 2 }}>
            <TransactionTimeline
              transactions={transactionsData?.data.transactions || []}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onAddNew={handleAddTransaction}
              isLoading={transactionsLoading}
            />
          </Box>
        </TabPanel>
      </Paper>

      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
        <DialogContent>
          {/* Note: TransactionForm requires portfolioStockId which we don't have here.
              This should be called from Portfolio page instead. */}
          <Typography color="text.secondary">
            Please add transactions from the Portfolio page for now.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StockDetail;
