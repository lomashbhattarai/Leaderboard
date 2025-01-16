import React from "react";
import { ScriptInPortfolio } from "../types/portfolio";
import { Paper, Typography } from "@mui/material";
import { formatAmount } from "../utils/helper";
import AmountSummary from "./common/AmountSummary";
import { PortfolioStock } from "../types/api";

const PortfolioValue: React.FC<{ portfolioStocksFromDb: PortfolioStock[] }> = ({
  portfolioStocksFromDb,
}) => {
  const totalValue = portfolioStocksFromDb.reduce(
    (acc, item) => acc + (item.latestClosingPrice || 1) * item.quantity,
    0
  );
  return <AmountSummary label="Total Value" value={totalValue} />;
};

export default PortfolioValue;
