import React from "react";
import TableView from "./common/TableView";
import { PortfolioStock } from "../types/api";

const PORTFOLIO_TABLE_HEADERS_FROM_DB = [
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
  },
  {
    label: "Value at LTP",
    key: "valueAtLTP",
  },
  {
    label: "1 Day",
    key: "performance1D",
  },
  {
    label: "1 Week",
    key: "performance1W",
  },
  {
    label: "1 Month",
    key: "performance1M",
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
