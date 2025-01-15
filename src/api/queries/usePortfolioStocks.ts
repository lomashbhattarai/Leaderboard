import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { PortfolioStock, PortfolioStockDTO } from '../../types/api';

// Query keys
export const portfolioStockKeys = {
  all: ['portfolioStocks'] as const,
  lists: (portfolioId: number) => [...portfolioStockKeys.all, 'list', portfolioId] as const,
  detail: (portfolioId: number, id: number) => [...portfolioStockKeys.all, 'detail', portfolioId, id] as const,
};

// Queries
export const usePortfolioStocks = (portfolioId: number) => {
  return useQuery<PortfolioStock[]>({
    queryKey: portfolioStockKeys.lists(portfolioId),
    queryFn: async () => {
      const { data } = await apiClient.get<PortfolioStock[]>(
        ENDPOINTS.PORTFOLIO_STOCKS.LIST(portfolioId)
      );
      return data;
    },
  });
};

export const usePortfolioStock = (portfolioId: number, id: number) => {
  return useQuery<PortfolioStock>({
    queryKey: portfolioStockKeys.detail(portfolioId, id),
    queryFn: async () => {
      const { data } = await apiClient.get<PortfolioStock>(
        ENDPOINTS.PORTFOLIO_STOCKS.DETAIL(portfolioId, id)
      );
      return data;
    },
  });
};

// Mutations
export const useCreatePortfolioStock = (portfolioId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation<PortfolioStock, Error, PortfolioStockDTO>({
    mutationFn: async (stockData) => {
      const { data } = await apiClient.post<PortfolioStock>(
        ENDPOINTS.PORTFOLIO_STOCKS.CREATE(portfolioId),
        stockData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: portfolioStockKeys.lists(portfolioId) 
      });
    },
  });
};

export const useUpdatePortfolioStock = (portfolioId: number, id: number) => {
  const queryClient = useQueryClient();

  return useMutation<PortfolioStock, Error, Partial<PortfolioStockDTO>>({
    mutationFn: async (stockData) => {
      const { data } = await apiClient.patch<PortfolioStock>(
        ENDPOINTS.PORTFOLIO_STOCKS.UPDATE(portfolioId, id),
        stockData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: portfolioStockKeys.detail(portfolioId, id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: portfolioStockKeys.lists(portfolioId) 
      });
    },
  });
};

export const useDeletePortfolioStock = (portfolioId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(ENDPOINTS.PORTFOLIO_STOCKS.DELETE(portfolioId, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: portfolioStockKeys.lists(portfolioId) 
      });
    },
  });
}; 