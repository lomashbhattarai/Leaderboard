import { Link } from "react-router-dom";

interface StockSymbolLinkProps {
  symbol: string;
  className?: string;
}

const StockSymbolLink = ({ symbol, className = "" }: StockSymbolLinkProps) => {
  return (
    <Link
      to={`https://nepsealpha.com/trading/chart?symbol=${symbol}`}
      className={`text-blue-600 hover:underline ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {symbol}
    </Link>
  );
};

export default StockSymbolLink;
