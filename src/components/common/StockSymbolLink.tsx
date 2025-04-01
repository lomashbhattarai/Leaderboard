import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

interface StockSymbolLinkProps {
  symbol: string;
  className?: string;
}

const StockSymbolLink = ({ symbol, className = "" }: StockSymbolLinkProps) => {
  const { currentTheme } = useTheme();

  return (
    <Link
      to={`https://nepsealpha.com/trading/chart?symbol=${symbol}`}
      className={`hover:underline ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: currentTheme.accent.primary,
        textDecoration: "none",
      }}
    >
      {symbol}
    </Link>
  );
};

export default StockSymbolLink;
