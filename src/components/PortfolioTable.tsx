import React from "react";
import TableView from "./common/TableView";
import { ScriptInPortfolio } from "../types/portfolio";
import { Portfolio, PortfolioStock } from "../types/api";
import { getValue } from "@testing-library/user-event/dist/utils";

const PORTFOLIO_TABLE_HEADERS = [
  {
    label: "SN",
    key: "serialNumber",
  },
  {
    label: "Script",
    key: "script",
  },
  {
    label: "Current Balance",
    key: "currentBalance",
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
    label: "Last Transaction Price",
    key: "lastTransactionPrice",
  },
  {
    label: "Value at LTP",
    key: "valueAtLTP",
  },
];

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
  // {
  //   label: "Portfolio ID",
  //   key: "portfolioId",
  // },
  // {
  //   label: "Stock ID",
  //   key: "stockId",
  // },
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
  // {
  //   label: "Created At",
  //   key: "createdAt",
  // },
  // {
  //   label: "Updated At",
  //   key: "updatedAt",
  // },
  // Optional fields can be added if needed
  // {
  //   label: "Portfolio",
  //   key: "portfolio",
  // },
];

const PortfolioTable: React.FC<{
  portfolio: ScriptInPortfolio[];
  portfolioStocksFromDb: PortfolioStock[];
}> = ({ portfolio, portfolioStocksFromDb }) => {
  return (
    <div>
      {/* <TableView
        columns={PORTFOLIO_TABLE_HEADERS}
        tableData={portfolio}
        onDeleteTransaction={(x: number) => {}}
      /> */}
      <TableView
        columns={PORTFOLIO_TABLE_HEADERS_FROM_DB}
        tableData={portfolioStocksFromDb}
      />
    </div>
  );
};

export default PortfolioTable;
