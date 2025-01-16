import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useStocks } from "../api/queries";

type StockMap = Record<string, number>;

interface StockContextType {
  stockMap: StockMap;
  setStockMap: React.Dispatch<React.SetStateAction<StockMap>>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stockMap, setStockMap] = useState<StockMap>({});

  const { data: stocks, isLoading, error } = useStocks();

  useEffect(() => {
    if (stocks) {
      setStockMap(
        stocks.reduce((acc, stock) => {
          acc[stock.symbol] = stock.id;
          return acc;
        }, {} as StockMap)
      );
    }
  }, [stocks]);

  return (
    <StockContext.Provider value={{ stockMap, setStockMap }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStockContext must be used within a StockProvider");
  }
  return context;
};
