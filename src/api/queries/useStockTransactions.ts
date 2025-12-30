import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { StockTransaction, StockTransactionDTO, StockTransactionWithStockDTO, StockTransactionsResponse, PortfolioStock } from '../../types/api';
import { portfolioKeys } from './usePortfolios';

// Query keys
export const stockTransactionKeys = {
  all: ['stockTransactions'] as const,
  lists: (portfolioStockId: number) => [...stockTransactionKeys.all, 'list', portfolioStockId] as const,
  byStockId: (stockId: number) => [...stockTransactionKeys.all, 'stockId', stockId] as const,
};

// Queries
export const useStockTransactions = (portfolioStockId: number) => {
  return useQuery<{ status: string; data: { transactions: StockTransaction[] } }>({
    queryKey: stockTransactionKeys.lists(portfolioStockId),
    queryFn: async () => {
      const response = await apiClient.get(
        ENDPOINTS.STOCK_TRANSACTIONS.LIST(portfolioStockId)
      );
      return response.data;
    },
    enabled: portfolioStockId > 0,
  });
};

export const useMyStockTransactions = (stockId: number) => {
  return useQuery<StockTransactionsResponse>({
    queryKey: stockTransactionKeys.byStockId(stockId),
    queryFn: async () => {
      const response = await apiClient.get(
        ENDPOINTS.STOCK_TRANSACTIONS.BY_STOCK_ID(stockId)
      );
      return response.data;
    },
    enabled: stockId > 0,
  });
};

// Mutations
export const useCreateStockTransaction = (portfolioStockId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation<{ status: string; data: { transaction: StockTransaction } }, Error, StockTransactionDTO>({
    mutationFn: async (transactionData) => {
      const response = await apiClient.post(
        ENDPOINTS.STOCK_TRANSACTIONS.CREATE(portfolioStockId),
        transactionData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: stockTransactionKeys.lists(portfolioStockId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.userPortfolios() 
      });
    },
  });
};

export const useUpdateStockTransaction = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<{ status: string; data: { transaction: StockTransaction } }, Error, Partial<StockTransactionDTO>>({
    mutationFn: async (transactionData) => {
      const response = await apiClient.patch(
        ENDPOINTS.STOCK_TRANSACTIONS.UPDATE(id),
        transactionData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: stockTransactionKeys.all
      });
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.userPortfolios() 
      });
    },
  });
};

export const useDeleteStockTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(ENDPOINTS.STOCK_TRANSACTIONS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: stockTransactionKeys.all
      });
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.userPortfolios() 
      });
    },
  });
};

export const useCreateTransactionWithStock = (portfolioId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    { status: string; data: { transaction: StockTransaction; portfolioStock: PortfolioStock } }, 
    Error, 
    StockTransactionWithStockDTO
  >({
    mutationFn: async (transactionData) => {
      const response = await apiClient.post(
        ENDPOINTS.STOCK_TRANSACTIONS.CREATE_WITH_STOCK,
        transactionData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: stockTransactionKeys.all
      });
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.userPortfolios() 
      });
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.detail(portfolioId) 
      });
    },
  });
};

