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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  usePortfolioTransactions,
  useUpdateStockTransaction,
  useDeleteStockTransaction,
} from "../api/queries/useStockTransactions";
import TransactionTimeline from "../components/TransactionTimeline";
import TransactionForm from "../components/TransactionForm";
import { StockTransaction } from "../types/api";
import { showToast } from "../utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "../api/queries/usePortfolios";

const TransactionHistory: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<StockTransaction | null>(null);

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

  const handleEditTransaction = (transaction: StockTransaction) => {
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

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Transaction History for {portfolio?.name}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
        <TransactionTimeline
          transactions={transactions}
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

