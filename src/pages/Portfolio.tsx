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
  Alert,
  Stack,
  Button,
  Drawer,
  IconButton,
  Typography,
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

const Portfolio: React.FC = () => {
  const queryClient = useQueryClient();
  const { portfolioStocksFromDb, portfolioId, addPortfolio } = usePortfolio();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedStock, setSelectedStock] =
    React.useState<PortfolioStock | null>(null);

  const createStock = useCreatePortfolioStock(portfolioId);
  const updateStock = useUpdatePortfolioStock(
    portfolioId,
    selectedStock?.id || 0
  );
  const deleteStock = useDeletePortfolioStock(portfolioId);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedStock(null);
  };

  const handleStockSubmit = async (data: PortfolioStockDTO) => {
    try {
      if (selectedStock) {
        await updateStock.mutateAsync(data);
      } else {
        await createStock.mutateAsync(data);
      }
      // Invalidate user portfolios query after successful mutation
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.userPortfolios(),
      });
      handleDrawerClose();
    } catch (error) {
      console.error("Failed to save stock:", error);
      alert("Failed to save stock. Please try again.");
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
        // Invalidate user portfolios query after successful deletion
        queryClient.invalidateQueries({
          queryKey: portfolioKeys.userPortfolios(),
        });
      } catch (error) {
        console.error("Failed to delete stock:", error);
        alert("Failed to delete stock. Please try again.");
      }
    }
  };

  const stockDrawer = (
    <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
      <div style={{ width: "400px", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h6">
            {selectedStock ? "Edit Stock" : "Add Stock"}
          </Typography>
          <IconButton onClick={handleDrawerClose} edge="end" aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
        <PortfolioStockForm
          initialData={selectedStock || undefined}
          onSubmit={handleStockSubmit}
          portfolioId={portfolioId}
        />
      </div>
    </Drawer>
  );

  return (
    <div className="portfolio-container">
      <div className="portfolio-grid">
        <Alert severity="info" className="mb-4">
          Login to your Meroshare account and go to "My Portfolio" page. Click
          on the "CSV" button to import the CSV of your portfolio to your
          computer. Upload the CSV file by clicking the button below.
        </Alert>

        <MeroshareImport addPortfolio={addPortfolio} />
        {/* <div>Print Portfolio summary</div> */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          width="100%"
          sx={{
            "& > *": {
              flex: 1,
              minWidth: { xs: "100%", md: "auto" },
            },
          }}
          className="mt-16"
        >
          <PortfolioValue portfolioStocksFromDb={portfolioStocksFromDb} />
          <PortfolioChart portfolioStocksFromDb={portfolioStocksFromDb} />
        </Stack>

        <Stack direction="row" spacing={2} className="mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsDrawerOpen(true)}
          >
            Add Stock to Portfolio
          </Button>
        </Stack>

        <PortfolioTable
          portfolioStocksFromDb={portfolioStocksFromDb}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {stockDrawer}

        {/* <StopLoss />
        <ReportsAnalysis />
        <BankReportScanner /> */}
      </div>
    </div>
  );
};

export default Portfolio;
