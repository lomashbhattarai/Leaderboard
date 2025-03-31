import React from "react";
import MeroshareImport from "../components/MeroshareImport";
import StopLoss from "../components/StopLoss";
import PortfolioChart from "../components/PortfolioChart";
import PortfolioTable from "../components/PortfolioTable";
import PortfolioValue from "../components/PortfolioValue";
import ReportsAnalysis from "../components/ReportsAnalysis";
import BankReportScanner from "../components/BankReportScanner";
import { usePortfolio } from "../hooks/usePortfolio";

import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Edit as EditIcon,
  FileUpload as FileUploadIcon,
  Info as InfoIcon,
  Public as PublicIcon,
  ShowChart as ShowChartIcon,
} from "@mui/icons-material";

import {
  Alert,
  Stack,
  Button,
  Drawer,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PortfolioStockForm from "../components/PortfolioStockForm";
import {
  useCreatePortfolioStock,
  useUpdatePortfolioStock,
  useDeletePortfolioStock,
} from "../api/queries/usePortfolioStocks";
import { useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "../api/queries/usePortfolios";
import type { PortfolioStock, PortfolioStockDTO } from "../types/api";
import { useTheme } from "../contexts/ThemeContext";
import PortfolioInfo from "../components/PortfolioInfo";
import { showToast } from "../utils/toast";
import InvestmentPerformance from "../components/InvestmentPerformance";

const Portfolio: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    portfolioStocksFromDb,
    portfolioId,
    addPortfolio,
    portfolioName,
    privacy,
    portfolio,
  } = usePortfolio();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedStock, setSelectedStock] =
    React.useState<PortfolioStock | null>(null);

  const createStock = useCreatePortfolioStock(portfolioId);
  const updateStock = useUpdatePortfolioStock(
    portfolioId,
    selectedStock?.id || 0
  );
  const deleteStock = useDeletePortfolioStock(portfolioId);

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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {!portfolioId && (
          <Alert severity="info" sx={{ mb: 4 }}>
            Login to your Meroshare account and go to "My Portfolio" page. Click
            on the "CSV" button to import the CSV of your portfolio to your
            computer. Upload the CSV file by clicking the button below.
          </Alert>
        )}

        <PortfolioInfo />

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
                startIcon={<AddIcon />}
                onClick={() => setIsDrawerOpen(true)}
              >
                Add Stock to Portfolio
              </Button>
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
            />
          </Box>
          <Box sx={{ order: 3 }}>
            <PortfolioChart portfolioStocksFromDb={portfolioStocksFromDb} />
          </Box>
        </Stack>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: 400,
              p: 2.5,
              borderRadius: currentTheme.shape.borderRadius,
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
              }}
            >
              {selectedStock ? "Edit Stock" : "Add Stock"}
            </Typography>
            <IconButton
              onClick={handleDrawerClose}
              edge="end"
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <PortfolioStockForm
            initialData={selectedStock || undefined}
            onSubmit={handleStockSubmit}
            portfolioId={portfolioId}
          />
        </Drawer>
      </Container>
    </Box>
  );
};

export default Portfolio;
