import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

interface StockLinkProps {
  symbol: string;
}

const StockLink: React.FC<StockLinkProps> = ({ symbol }) => {
  const { currentTheme } = useTheme();

  return (
    <RouterLink
      to={`https://nepsealpha.com/trading/chart?symbol=${symbol}`}
      className="hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: currentTheme.accent.primary,
        textDecoration: "none",
        fontWeight: currentTheme.typography.fontWeights.heading,
      }}
    >
      {symbol}
    </RouterLink>
  );
};

export default StockLink;
