import { useState, useEffect, useCallback } from "react";
import { ScriptInPortfolio } from "../types/portfolio";
import { getPortfolio, savePortfolio } from "../utils/localStorage";
import { useCreateBulkPortfolio, usePortfolios, useUserPortfolios } from "../api/queries";
import { useAuthContext } from "../contexts/AuthContext";

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<ScriptInPortfolio[]>([]);
  const createBulkPortfolio = useCreateBulkPortfolio();

    const { user  } = useAuthContext();


  useEffect(() => {
    const storedPortfolio = getPortfolio();
    setPortfolio(storedPortfolio);
  }, []);

  const { data: portfolios } = useUserPortfolios();


  const addPortfolio = useCallback(async (portfolio: Array<ScriptInPortfolio>) => {
    setPortfolio((prev) => {
      savePortfolio(portfolio);
      return portfolio;
    });

    try {
      const name = `${user?.fullName} - Portfolio`;
      const stocks = portfolio.map((stock) => ({
        stockSymbol: stock.script,
        quantity: stock.currentBalance,
        lastTransactionPrice: stock.lastTransactionPrice,
      }));
      await createBulkPortfolio.mutateAsync({
        name,
        stocks,
      });
    } catch (error) {
      console.error("Failed to create portfolio:", error);
    }
  }, []);

  return { portfolio, addPortfolio, portfolioStocksFromDb: portfolios?.[0]?.portfolioStocks || [], portfolioId: portfolios?.[0]?.id || 0 };
};
