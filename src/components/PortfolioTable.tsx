import React from "react";
import TableView, { ColumnConfig } from "./common/TableView";
import { PortfolioStock } from "../types/api";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";
import {
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { Link as RouterLink } from "react-router-dom";
import StopLossChip from "./StopLossChip";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookIcon from "@mui/icons-material/Book";
import JournalIndicator from "./JournalIndicator";
import StockLink from "./common/StockLink";

const PORTFOLIO_TABLE_HEADERS_FROM_DB: Array<ColumnConfig> = [
  {
    label: "Stock",
    key: "stock",
    getValue: (portfolioStock: PortfolioStock) => portfolioStock.stock?.symbol,
    render: (value, stock: PortfolioStock) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "right", sm: "left" },
          alignItems: "right",
          gap: 1,
        }}
      >
        <StockLink symbol={value} />
        <JournalIndicator portfolioStockId={stock.id} stockSymbol={value} />
      </Box>
    ),
  },
  {
    label: "Quantity",
    key: "quantity",
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    label: "Value at LTP",
    key: "valueAtLTP",
    render: (value) => (
      <Typography variant="body2">{formatAmount(value, true)}</Typography>
    ),
  },
  {
    label: "1 Day",
    key: "performance1D",
    render: (value) => (
      <Typography variant="body2">{formatPerformance(value)}</Typography>
    ),
  },
  {
    label: "1 Week",
    key: "performance1W",
    render: (value) => (
      <Typography variant="body2">{formatPerformance(value)}</Typography>
    ),
  },
  {
    label: "1 Month",
    key: "performance1M",
    render: (value) => (
      <Typography variant="body2">{formatPerformance(value)}</Typography>
    ),
  },
  {
    label: "Buy Price",
    key: "buyPrice",
    render: (value) => (
      <Typography variant="body2">{formatAmount(value, true)}</Typography>
    ),
  },
  {
    label: "Closing Price",
    key: "latestClosingPrice",
    render: (value) => (
      <Typography variant="body2">{formatAmount(value, true)}</Typography>
    ),
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
  onJournal?: (stock: PortfolioStock) => void;
}

const getStopLossColor = (
  stopLossValue: number,
  latestPrice: number
): "default" | "warning" | "error" => {
  const difference = Math.abs(stopLossValue - latestPrice);

  if (stopLossValue >= latestPrice) {
    return "error"; // Red color
  } else if (difference <= 5) {
    // Within 5 point difference of latest price
    return "warning"; // Yellow color
  }
  return "default"; // Default color
};

const StopLossAction: React.FC<{
  stock: PortfolioStock;
}> = ({ stock }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const activeStopLosses = (stock.stopLosses || []).sort(
    (a, b) => b.value - a.value
  ); // Sort by value in descending order

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
          style={{ textDecoration: "none", color: "inherit" }}
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
            color={getStopLossColor(
              activeStopLosses[0].value,
              stock.latestClosingPrice || 0
            )}
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
  onJournal,
}) => {
  const { currentTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const renderRowActions = (row: PortfolioStock, rowIndex: number) => {
    return (
      <Box
        sx={{
          ...(isMobile
            ? {
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                mt: 1,
              }
            : {
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                gap: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                p: 1,
              }),
        }}
      >
        <Tooltip title="Edit stock">
          <IconButton
            onClick={() => onEdit(row)}
            size="small"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete stock">
          <IconButton
            onClick={() => onDelete(row.id)}
            size="small"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {onJournal && (
          <Tooltip title="Add journal">
            <IconButton
              onClick={() => onJournal(row)}
              size="small"
              aria-label="journal"
            >
              <BookIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  return (
    <TableView
      columns={PORTFOLIO_TABLE_HEADERS_FROM_DB}
      tableData={portfolioStocksFromDb}
      onEdit={onEdit}
      onDelete={onDelete}
      showActions={false}
      isCompact
      defaultEmptyMessage="No holdings found. Add stocks to your portfolio."
      rowActions={renderRowActions}
      // renderExpandedRow={(row) => <ExpandedStopLossView stock={row} />}
      // expansionTriggerColumnKey="stopLoss"
    />
  );
};
export default PortfolioTable;
