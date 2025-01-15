import { useState, useEffect, useCallback } from "react";
import { ScriptInPortfolio } from "../types/portfolio";
import { getPortfolio, savePortfolio } from "../utils/localStorage";
import { useCreateBulkPortfolio, usePortfolios } from "../api/queries";

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<ScriptInPortfolio[]>([]);
  const createBulkPortfolio = useCreateBulkPortfolio();

  useEffect(() => {
    const storedPortfolio = getPortfolio();
    setPortfolio(storedPortfolio);
  }, []);

  const { data: portfolios } = usePortfolios();


  const addPortfolio = useCallback(async (portfolio: Array<ScriptInPortfolio>) => {
    setPortfolio((prev) => {
      savePortfolio(portfolio);
      return portfolio;
    });

    try {
      const name = "First Portfolio";
      const stocks = portfolio.map((stock) => ({
        stockSymbol: stock.script,
        quantity: stock.currentBalance,
      }));
      await createBulkPortfolio.mutateAsync({
        name,
        stocks,
      });
    } catch (error) {
      console.error("Failed to create portfolio:", error);
    }
  }, []);

  return { portfolio, addPortfolio, portfolioStocksFromDb: portfolios?.[0]?.portfolioStocks || [] };
};
