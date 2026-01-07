import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  ShowChart as ShowChartIcon,
} from "@mui/icons-material";
import {
  usePortfolioTransactions,
  useUpdateStockTransaction,
  useDeleteStockTransaction,
} from "../api/queries/useStockTransactions";
import TransactionTimeline from "../components/TransactionTimeline";
import TransactionForm from "../components/TransactionForm";
import { StockTransactionWithBalance } from "../types/api";
import { showToast } from "../utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "../api/queries/usePortfolios";
import { formatAmount } from "../utils/helper";

const TransactionHistory: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<StockTransactionWithBalance | null>(null);

  const { data, isLoading, error } = usePortfolioTransactions(
    Number(portfolioId) || 0
  );
  const updateTransaction = useUpdateStockTransaction(
    selectedTransaction?.id || 0
  );
  const deleteTransaction = useDeleteStockTransaction();

  const handleBack = () => {
    navigate("/my-portfolio");
  };

  const handleEditTransaction = (transaction: StockTransactionWithBalance) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction.mutateAsync(transactionId);
        showToast.success("Transaction deleted successfully");
        queryClient.invalidateQueries({
          queryKey: portfolioKeys.userPortfolios(),
        });
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        showToast.error("Failed to delete transaction. Please try again.");
      }
    }
  };

  const handleTransactionSubmit = async (data: any) => {
    try {
      if (selectedTransaction) {
        await updateTransaction.mutateAsync(data);
        showToast.success("Transaction updated successfully");
      }
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.userPortfolios(),
      });
      setIsFormOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      showToast.error("Failed to save transaction. Please try again.");
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading transactions. Please try again.
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const portfolio = data?.data?.portfolio;
  const transactions = data?.data?.transactions || [];
  const summary = data?.data?.summary;

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Transaction History for {portfolio?.name}
        </Typography>
      </Box>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccountBalanceIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2" color="text.secondary">
                    Capital Invested
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {formatAmount(summary.totalCapitalInvested, true)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total money invested
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <ShowChartIcon sx={{ mr: 1, color: "info.main" }} />
                  <Typography variant="body2" color="text.secondary">
                    Current Balance
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {formatAmount(summary.currentCapitalBalance, true)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Capital after sells
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {summary.totalRealizedPL >= 0 ? (
                    <TrendingUpIcon sx={{ mr: 1, color: "success.main" }} />
                  ) : (
                    <TrendingDownIcon sx={{ mr: 1, color: "error.main" }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Realized P/L
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    color:
                      summary.totalRealizedPL >= 0
                        ? "success.main"
                        : "error.main",
                  }}
                >
                  {summary.totalRealizedPL >= 0 ? "+" : ""}
                  {formatAmount(summary.totalRealizedPL, true)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Profit/Loss from sales
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <ShowChartIcon sx={{ mr: 1, color: "secondary.main" }} />
                  <Typography variant="body2" color="text.secondary">
                    Current Holdings
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {summary.totalSharesHeld}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total shares owned
                  {summary.avgCostBasis > 0 && (
                    <> (Avg: {formatAmount(summary.avgCostBasis, true)})</>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ p: 3, maxHeight: "calc(100vh - 350px)", overflow: "auto" }}>
        <TransactionTimeline
          transactions={transactions}
          summary={summary}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          isLoading={isLoading}
        />
      </Paper>

      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <TransactionForm
              key={selectedTransaction.id}
              initialData={selectedTransaction}
              portfolioStockId={selectedTransaction.portfolioStockId}
              currentHoldings={0}
              onSubmit={handleTransactionSubmit}
              onCancel={handleFormClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TransactionHistory;
