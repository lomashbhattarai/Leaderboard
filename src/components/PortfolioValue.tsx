import React from "react";
import AmountSummary from "./common/AmountSummary";
import { PortfolioStock } from "../types/api";

const PortfolioValue: React.FC<{
  portfolioName: string;
  portfolioStocksFromDb: PortfolioStock[];
}> = ({ portfolioName, portfolioStocksFromDb }) => {
  const totalValue = portfolioStocksFromDb.reduce(
    (acc, item) => acc + (item.latestClosingPrice || 1) * item.quantity,
    0
  );
  return <AmountSummary label={`${portfolioName}`} value={totalValue} />;
};

export default PortfolioValue;
