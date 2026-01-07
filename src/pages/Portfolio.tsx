import React from "react";
import { useNavigate } from "react-router-dom";
import MeroshareImport from "../components/MeroshareImport";
import PortfolioChart from "../components/PortfolioChart";
import PortfolioTable from "../components/PortfolioTable";
import PortfolioValue from "../components/PortfolioValue";
import { usePortfolio } from "../hooks/usePortfolio";
import { useCreateJournal } from "../api/queries";

import { Add as AddIcon, History as HistoryIcon } from "@mui/icons-material";

import {
  Alert,
  Stack,
  Button,
  Drawer,
  IconButton,
  Typography,
  Box,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PortfolioStockForm from "../components/PortfolioStockForm";
import AddTransactionForm from "../components/AddTransactionForm";
import JournalForm from "../components/JournalForm";
import TransactionForm from "../components/TransactionForm";
import TransactionTimeline from "../components/TransactionTimeline";
import {
  useCreatePortfolioStock,
  useUpdatePortfolioStock,
  useDeletePortfolioStock,
} from "../api/queries/usePortfolioStocks";
import {
  useStockTransactions,
  useCreateStockTransaction,
  useUpdateStockTransaction,
  useDeleteStockTransaction,
  useCreateTransactionWithStock,
} from "../api/queries/useStockTransactions";
import { useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "../api/queries/usePortfolios";
import type {
  PortfolioStock,
  PortfolioStockDTO,
  StockTransaction,
  StockTransactionWithBalance,
  StockTransactionDTO,
  StockTransactionWithStockDTO,
} from "../types/api";
import { useTheme } from "../contexts/ThemeContext";
import PortfolioInfo from "../components/PortfolioInfo";
import { showToast } from "../utils/toast";
import AllocationChart from "../components/charts/AllocationChart";
import PerformanceChart from "../components/charts/PerformanceChart";

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { portfolioStocksFromDb, portfolioId, addPortfolio, portfolio } =
    usePortfolio();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isJournalDrawerOpen, setIsJournalDrawerOpen] = React.useState(false);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] =
    React.useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] =
    React.useState(false);
  const [selectedStock, setSelectedStock] =
    React.useState<PortfolioStock | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<StockTransactionWithBalance | null>(null);

  const createStock = useCreatePortfolioStock(portfolioId);
  const updateStock = useUpdatePortfolioStock(
    portfolioId,
    selectedStock?.id || 0
  );
  const deleteStock = useDeletePortfolioStock(portfolioId);
  const createJournal = useCreateJournal();
  const createTransactionWithStock = useCreateTransactionWithStock(portfolioId);

  const { data: transactionsData } = useStockTransactions(
    selectedStock?.id || 0
  );
  const createTransaction = useCreateStockTransaction(selectedStock?.id || 0);
  const updateTransaction = useUpdateStockTransaction(
    selectedTransaction?.id || 0
  );
  const deleteTransaction = useDeleteStockTransaction();

  const { currentTheme } = useTheme();

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedStock(null);
  };

  const handleStockSubmit = async (data: PortfolioStockDTO) => {
    try {
      if (selectedStock) {
        await updateStock.mutateAsync(data);
        showToast.success("Stock updated successfully");
      } else {
        await createStock.mutateAsync(data);
        showToast.success("Stock added to portfolio");
      }
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.userPortfolios(),
      });
      handleDrawerClose();
    } catch (error) {
      console.error("Failed to save stock:", error);
      showToast.error("Failed to save stock. Please try again.");
    }
  };

  const handleAddTransactionSubmit = async (
    data: StockTransactionWithStockDTO
  ) => {
    try {
      await createTransactionWithStock.mutateAsync(data);
      showToast.success("Transaction added successfully");
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.userPortfolios(),
      });
      handleDrawerClose();
    } catch (error: any) {
      console.error("Failed to add transaction:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to add transaction. Please try again.";
      showToast.error(errorMessage);
    }
  };

  const handleEdit = (stock: PortfolioStock) => {
    console.log("handleEdit", stock);
    setSelectedStock(stock);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (stockId: number) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      try {
        await deleteStock.mutateAsync(stockId);
        showToast.success("Stock deleted successfully");
        queryClient.invalidateQueries({
          queryKey: portfolioKeys.userPortfolios(),
        });
      } catch (error) {
        console.error("Failed to delete stock:", error);
        showToast.error("Failed to delete stock. Please try again.");
      }
    }
  };

  const handlePortfolioAdd = async (data: any) => {
    try {
      await addPortfolio(data);
      showToast.success("Portfolio imported successfully");
    } catch (error) {
      showToast.error("Failed to import portfolio");
    }
  };

  const handleJournalSubmit = async (data: any) => {
    try {
      const portfolioStockId = selectedStock?.id;

      if (portfolioStockId) {
        data.journalType = "stock";
      } else {
        data.journalType = "general";
      }

      data.title = data.title || " ";

      await createJournal.mutateAsync({
        ...data,
        portfolioStockId,
      });
      showToast.success("Journal created successfully");
      setIsJournalDrawerOpen(false);
      setSelectedStock(null);
    } catch (error) {
      console.error("Failed to create journal:", error);
      showToast.error("Failed to create journal. Please try again.");
    }
  };

  const handleJournalClick = (stock: PortfolioStock) => {
    setSelectedStock(stock);
    setIsJournalDrawerOpen(true);
  };

  const handleViewTransactions = (stock: PortfolioStock) => {
    setSelectedStock(stock);
    setIsTransactionDrawerOpen(true);
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsTransactionFormOpen(true);
  };

  const handleAddTransactionFromPortfolio = () => {
    setSelectedStock(null);
    setIsDrawerOpen(true);
  };

  const handleEditTransaction = (transaction: StockTransactionWithBalance) => {
    setSelectedTransaction(transaction);
    setIsTransactionFormOpen(true);
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

  const handleTransactionSubmit = async (data: StockTransactionDTO) => {
    try {
      if (selectedTransaction) {
        await updateTransaction.mutateAsync(data);
        showToast.success("Transaction updated successfully");
      } else {
        await createTransaction.mutateAsync(data);
        showToast.success("Transaction added successfully");
      }
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.userPortfolios(),
      });
      setIsTransactionFormOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      showToast.error("Failed to save transaction. Please try again.");
    }
  };

  const handleTransactionDrawerClose = () => {
    setIsTransactionDrawerOpen(false);
    setIsTransactionFormOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 2, px: "0 !important" }}>
        {!portfolioId && (
          <Alert severity="info" sx={{ mb: 4 }}>
            Login to your Meroshare account and go to "My Portfolio" page. Click
            on the "CSV" button to import the CSV of your portfolio to your
            computer. Upload the CSV file by clicking the button below.
          </Alert>
        )}

        <Box sx={{ px: { xs: 2, sm: 0 } }}>
          <PortfolioInfo />
        </Box>

        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            width="100%"
            sx={{
              "& > *:first-of-type": {
                flex: 1,
                minWidth: { xs: "100%", md: "auto" },
              },
              "& > *:last-of-type": {
                flex: 1,
                minWidth: { xs: "100%", md: "auto" },
              },
            }}
          >
            <PortfolioValue portfolio={portfolio} />
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 4 }}
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddTransactionFromPortfolio}
                sx={{
                  backgroundColor: currentTheme.accent.primary,
                  "&:hover": {
                    backgroundColor: currentTheme.accent.secondary,
                  },
                }}
              >
                Add Transaction
              </Button>
              {portfolioId && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<HistoryIcon />}
                  onClick={() =>
                    navigate(`/portfolio/${portfolioId}/transactions`)
                  }
                  sx={{
                    borderColor: currentTheme.accent.primary,
                    color: currentTheme.accent.primary,
                    "&:hover": {
                      borderColor: currentTheme.accent.secondary,
                      backgroundColor: `${currentTheme.accent.primary}10`,
                    },
                  }}
                >
                  Transaction History
                </Button>
              )}
            </Stack>
            <MeroshareImport
              addPortfolio={handlePortfolioAdd}
              buttonVariant="outlined"
              buttonColor="primary"
            />
          </Stack>

          <Box sx={{ mb: 2, mt: 2.5 }}>
            <PortfolioTable
              portfolioStocksFromDb={portfolioStocksFromDb}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onJournal={handleJournalClick}
              onViewTransactions={handleViewTransactions}
            />
          </Box>
          <Box sx={{ order: 3 }}>
            <PortfolioChart portfolioStocksFromDb={portfolioStocksFromDb} />
          </Box>
        </Stack>
        {/* 
        <div className="mt-10 h-[300px]">
          <PerformanceChart />
        </div>

        <div className="mt-10 h-[300px]">
          <AllocationChart />
        </div> */}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: 400,
              p: 2.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: currentTheme.typography.fontWeights.heading,
                color: currentTheme.text.primary,
              }}
            >
              {selectedStock ? "Edit Stock" : "Add Transaction"}
            </Typography>
            <IconButton
              onClick={handleDrawerClose}
              edge="end"
              aria-label="close"
              sx={{ color: currentTheme.text.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedStock ? (
            <PortfolioStockForm
              initialData={selectedStock}
              onSubmit={handleStockSubmit}
              portfolioId={portfolioId}
            />
          ) : (
            <AddTransactionForm
              portfolioId={portfolioId}
              onSubmit={handleAddTransactionSubmit}
              onCancel={handleDrawerClose}
            />
          )}
        </Drawer>

        <Drawer
          anchor="right"
          open={isJournalDrawerOpen}
          onClose={() => {
            setIsJournalDrawerOpen(false);
            setSelectedStock(null);
          }}
          PaperProps={{
            sx: {
              width: 400,
              p: 2.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: currentTheme.typography.fontWeights.heading,
                color: currentTheme.text.primary,
              }}
            >
              Add Journal for {selectedStock?.stock?.symbol}
            </Typography>
            <IconButton
              onClick={() => {
                setIsJournalDrawerOpen(false);
                setSelectedStock(null);
              }}
              edge="end"
              aria-label="close"
              sx={{ color: currentTheme.text.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <JournalForm
            onSubmit={handleJournalSubmit}
            portfolioStockId={selectedStock?.id}
          />
        </Drawer>

        <Drawer
          anchor="right"
          open={isTransactionDrawerOpen}
          onClose={handleTransactionDrawerClose}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: 600 },
              p: 2.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: currentTheme.typography.fontWeights.heading,
                color: currentTheme.text.primary,
              }}
            >
              Transactions for {selectedStock?.stock?.symbol}
            </Typography>
            <IconButton
              onClick={handleTransactionDrawerClose}
              edge="end"
              aria-label="close"
              sx={{ color: currentTheme.text.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {isTransactionFormOpen ? (
            <TransactionForm
              key={selectedTransaction?.id || "new"}
              initialData={selectedTransaction || undefined}
              portfolioStockId={selectedStock?.id || 0}
              currentHoldings={selectedStock?.quantity || 0}
              onSubmit={handleTransactionSubmit}
              onCancel={() => {
                setIsTransactionFormOpen(false);
                setSelectedTransaction(null);
              }}
            />
          ) : (
            <TransactionTimeline
              transactions={transactionsData?.data.transactions || []}
              summary={transactionsData?.data.summary}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onAddNew={handleAddTransaction}
            />
          )}
        </Drawer>
      </Container>
    </Box>
  );
};

export default Portfolio;
