import React from "react";
import TableView from "./common/TableView";
import { PortfolioStock } from "../types/api";

const PORTFOLIO_TABLE_HEADERS_FROM_DB = [
  {
    label: "ID",
    key: "id",
  },
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
    label: "Buy Price",
    key: "buyPrice",
  },
  {
    label: "Buy Date",
    key: "buyDate",
  },
  {
    label: "Previous Closing Price",
    key: "previousClosingPrice",
  },
  {
    label: "Value at Previous Closing",
    key: "valueAtPreviousClosing",
  },
  {
    label: "Last Closing Price",
    key: "latestClosingPrice",
  },
  {
    label: "Value at LTP",
    key: "valueAtLTP",
  },
];

const PortfolioTable: React.FC<{
  portfolioStocksFromDb: PortfolioStock[];
}> = ({ portfolioStocksFromDb }) => {
  return (
    <div>
      <TableView
        columns={PORTFOLIO_TABLE_HEADERS_FROM_DB}
        tableData={portfolioStocksFromDb}
      />
    </div>
  );
};

export default PortfolioTable;
