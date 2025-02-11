import { useState, useEffect, useCallback } from "react";
import { ScriptInPortfolio } from "../types/portfolio";
import {
  useCreateBulkPortfolio,
  usePortfolios,
  useUserPortfolios,
} from "../api/queries";
import { useAuthContext } from "../contexts/AuthContext";
import { PortfolioPrivacy } from "../types/api";

export const usePortfolio = () => {
  const createBulkPortfolio = useCreateBulkPortfolio();

  const { user } = useAuthContext();

  const { data: portfolios } = useUserPortfolios();

  const addPortfolio = useCallback(
    async (portfolio: Array<ScriptInPortfolio>) => {
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
    },
    []
  );

  return {
    portfolio: portfolios?.[0],
    addPortfolio,
    portfolioStocksFromDb: portfolios?.[0]?.portfolioStocks || [],
    portfolioId: portfolios?.[0]?.id || 0,
    portfolioName: portfolios?.[0]?.name || "",
    privacy: portfolios?.[0]?.privacy || PortfolioPrivacy.PRIVATE,
  };
};
