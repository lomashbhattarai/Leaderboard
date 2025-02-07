import React from "react";
import TableView, { ColumnConfig } from "./common/TableView";
import { PortfolioStock } from "../types/api";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";
import { useStopLosses, useCreateStopLoss } from "../api/queries/useStopLosses";
import { Button, Drawer, Box, Typography, Stack } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StopLossForm from "./StopLossForm";
import { StopLossDTO } from "../types/api";
import { StopLossType } from "../types/api";
import { Link } from "react-router-dom";

const PORTFOLIO_TABLE_HEADERS_FROM_DB: Array<ColumnConfig> = [
  {
    label: "Stock",
    key: "stock",
    getValue: (portfolioStock: PortfolioStock) => portfolioStock.stock?.symbol,
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Closing Price",
    key: "latestClosingPrice",
    render: (value) => formatAmount(value, true),
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
    render: (_, stock: PortfolioStock) => <StopLossAction stock={stock} />,
  },
  // {
  //   label: "Buy Date",
  //   key: "buyDate",
  // },
];

interface PortfolioTableProps {
  portfolioStocksFromDb: PortfolioStock[];
  onEdit: (stock: PortfolioStock) => void;
  onDelete: (stockId: number) => void;
}

const StopLossAction: React.FC<{ stock: PortfolioStock }> = ({ stock }) => {
  return (
    <Link
      to={`/stop-loss/${stock.stock?.symbol}`}
      state={{ portfolioStockId: stock.id, stockSymbol: stock.stock?.symbol }}
    >
      <Button size="small" startIcon={<TrendingDownIcon />}>
        Stop Loss
      </Button>
    </Link>
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
    />
  );
};

export default PortfolioTable;
