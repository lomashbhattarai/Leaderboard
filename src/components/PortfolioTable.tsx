import React from "react";
import TableView, { ColumnConfig } from "./common/TableView";
import { PortfolioStock } from "../types/api";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";
import { Button, Box, Typography, Stack } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { Link as RouterLink } from "react-router-dom";
import StopLossChip from "./StopLossChip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useMediaQuery } from "@mui/material";

const PORTFOLIO_TABLE_HEADERS_FROM_DB: Array<ColumnConfig> = [
  {
    label: "Stock",
    key: "stock",
    getValue: (portfolioStock: PortfolioStock) => portfolioStock.stock?.symbol,
    render: (value) => (
      <RouterLink
        // to={`/stock/${value}`}
        to={`https://nepsealpha.com/trading/chart?symbol=${value}`}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </RouterLink>
    ),
  },
  {
    label: "Closing Price",
    key: "latestClosingPrice",
    render: (value) => formatAmount(value, true),
  },
  {
    label: "Quantity",
    key: "quantity",
    render: (value) => value,
  },
  {
    label: "Value at LTP",
    key: "valueAtLTP",
    render: (value) => formatAmount(value, true),
  },
  {
    label: "1 Day",
    key: "performance1D",
    render: (value) => formatPerformance(value),
  },
  {
    label: "1 Week",
    key: "performance1W",
    render: (value) => formatPerformance(value),
  },
  {
    label: "1 Month",
    key: "performance1M",
    render: (value) => formatPerformance(value),
  },
  {
    label: "Buy Price",
    key: "buyPrice",
  },
  {
    label: "Stop Loss",
    key: "stopLoss",
    minWidth: 150,
    render: (_, stock: PortfolioStock, _index) => (
      <StopLossAction stock={stock} />
    ),
  },
];

interface PortfolioTableProps {
  portfolioStocksFromDb: PortfolioStock[];
  onEdit: (stock: PortfolioStock) => void;
  onDelete: (stockId: number) => void;
}

const StopLossAction: React.FC<{
  stock: PortfolioStock;
}> = ({ stock }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const activeStopLosses = stock.stopLosses || [];

  if (activeStopLosses.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-end", sm: "flex-start" },
        }}
      >
        <RouterLink
          to={`/stop-loss/${stock.stock?.symbol}`}
          state={{
            portfolioStockId: stock.id,
            stockSymbol: stock.stock?.symbol,
          }}
        >
          <Button
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "0.7rem",
              minWidth: 0,
              px: 0.5,
              py: 0.25,
            }}
          >
            Set stop loss
          </Button>
        </RouterLink>
      </Box>
    );
  }

  return (
    <RouterLink
      to={`/stop-loss/${stock.stock?.symbol}`}
      state={{ portfolioStockId: stock.id, stockSymbol: stock.stock?.symbol }}
      style={{ textDecoration: "none" }}
    >
      <Stack
        direction="column"
        alignItems={{ xs: "flex-end", sm: "flex-start" }}
        spacing={0.5}
        sx={{
          minWidth: 0,
          maxWidth: "100%",
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={{ xs: "flex-end", sm: "flex-start" }}
          spacing={0.5}
        >
          <StopLossChip
            key={activeStopLosses[0].id}
            type={activeStopLosses[0].type}
            value={activeStopLosses[0].value}
            status={activeStopLosses[0].status}
          />
          {activeStopLosses.length > 1 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "0.7rem",
              }}
            >
              +{activeStopLosses.length - 1}
            </Typography>
          )}
        </Stack>
      </Stack>
    </RouterLink>
  );
};

const ExpandedStopLossView: React.FC<{ stock: PortfolioStock }> = ({
  stock,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Stop Losses for {stock.stock?.symbol}
      </Typography>
      <Stack spacing={2}>
        {stock.stopLosses?.map((sl) => (
          <Box
            key={sl.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <StopLossChip type={sl.type} value={sl.value} status={sl.status} />
            {/* <Typography variant="body2">Quantity: {sl.quantity}</Typography> */}
            {sl.triggeredAt && (
              <Typography variant="body2" color="text.secondary">
                Triggered: {new Date(sl.triggeredAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        ))}
        <RouterLink
          to={`/stop-loss/${stock.stock?.symbol}`}
          state={{
            portfolioStockId: stock.id,
            stockSymbol: stock.stock?.symbol,
          }}
        >
          <Button
            size="small"
            startIcon={<TrendingDownIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
            }}
          >
            Set stop loss
          </Button>
        </RouterLink>
      </Stack>
    </Box>
  );
};

const Actions: React.FC<{ stock: PortfolioStock }> = ({ stock }) => {
  return (
    <Stack direction="row" spacing={1}>
      <StopLossAction stock={stock} />
    </Stack>
  );
};

const PortfolioTable: React.FC<PortfolioTableProps> = ({
  portfolioStocksFromDb,
  onEdit,
  onDelete,
}) => {
  return (
    <TableView
      columns={PORTFOLIO_TABLE_HEADERS_FROM_DB}
      tableData={portfolioStocksFromDb}
      onEdit={onEdit}
      onDelete={onDelete}
      showActions={true}
      isCompact
      // renderExpandedRow={(row) => <ExpandedStopLossView stock={row} />}
      // expansionTriggerColumnKey="stopLoss"
    />
  );
};

export default PortfolioTable;
