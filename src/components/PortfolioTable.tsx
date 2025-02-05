import React from "react";
import TableView, { ColumnConfig } from "./common/TableView";
import { PortfolioStock } from "../types/api";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";

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
