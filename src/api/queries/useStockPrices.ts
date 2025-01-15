import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { StockPrice, StockPriceDTO } from '../../types/api';

// Query keys
export const stockPriceKeys = {
  all: ['stockPrices'] as const,
  lists: (stockId: number) => [...stockPriceKeys.all, 'list', stockId] as const,
  detail: (stockId: number, id: number) => [...stockPriceKeys.all, 'detail', stockId, id] as const,
};

// Queries
export const useStockPrices = (stockId: number) => {
  return useQuery<StockPrice[]>({
    queryKey: stockPriceKeys.lists(stockId),
    queryFn: async () => {
      const { data } = await apiClient.get<StockPrice[]>(
        ENDPOINTS.STOCK_PRICES.LIST(stockId)
      );
      return data;
    },
  });
};

export const useStockPrice = (stockId: number, id: number) => {
  return useQuery<StockPrice>({
    queryKey: stockPriceKeys.detail(stockId, id),
    queryFn: async () => {
      const { data } = await apiClient.get<StockPrice>(
        ENDPOINTS.STOCK_PRICES.DETAIL(stockId, id)
      );
      return data;
    },
  });
};

// Mutations
export const useCreateStockPrice = (stockId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation<StockPrice, Error, StockPriceDTO>({
    mutationFn: async (priceData) => {
      const { data } = await apiClient.post<StockPrice>(
        ENDPOINTS.STOCK_PRICES.CREATE(stockId),
        priceData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: stockPriceKeys.lists(stockId) 
      });
    },
  });
};

export const useUpdateStockPrice = (stockId: number, id: number) => {
  const queryClient = useQueryClient();

  return useMutation<StockPrice, Error, Partial<StockPriceDTO>>({
    mutationFn: async (priceData) => {
      const { data } = await apiClient.patch<StockPrice>(
        ENDPOINTS.STOCK_PRICES.UPDATE(stockId, id),
        priceData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: stockPriceKeys.detail(stockId, id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: stockPriceKeys.lists(stockId) 
      });
    },
  });
};

export const useDeleteStockPrice = (stockId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(ENDPOINTS.STOCK_PRICES.DELETE(stockId, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: stockPriceKeys.lists(stockId) 
      });
    },
  });
}; 