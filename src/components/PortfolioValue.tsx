import React from "react";
import { ScriptInPortfolio } from "../types/portfolio";
import { Paper, Typography } from "@mui/material";
import { formatAmount } from "../utils/helper";
import AmountSummary from "./common/AmountSummary";

const PortfolioValue: React.FC<{ portfolio: ScriptInPortfolio[] }> = ({
  portfolio,
}) => {
  const totalValue = portfolio.reduce((acc, item) => acc + item.valueAtLTP, 0);
  const totalProfitLoss = portfolio.reduce(
    (acc, item) => acc + item.valueAtLTP - item.valueAtPreviousClosing,
    0
  );
  return <AmountSummary label="Total Value" value={totalValue} />;
};

export default PortfolioValue;
