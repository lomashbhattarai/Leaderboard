import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Stock, StockDTO, StockWithPerformance } from '../../types/api';

// Query keys
export const stockKeys = {
  all: ['stocks'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  detail: (id: number) => [...stockKeys.all, 'detail', id] as const,
};

// Queries
export const useStocks = () => {
  return useQuery<Stock[]>({
    queryKey: stockKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get<{ status: string; stocks: Stock[] }>(ENDPOINTS.STOCKS.LIST);
      return data.stocks;
    },
  });
};

export const useStock = (id: number) => {
  return useQuery<Stock>({
    queryKey: stockKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Stock>(ENDPOINTS.STOCKS.DETAIL(id));
      return data;
    },
  });
};

export const useStocksWithPerformance = () => {
  return useQuery<StockWithPerformance[]>({
    queryKey: [...stockKeys.lists(), 'withPerformance'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ status: string; stocks: StockWithPerformance[] }>(
        '/api/stocks/with-performance'
      );
      return data.stocks;
    },
  });
};

// Mutations
export const useCreateStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Stock, Error, StockDTO>({
    mutationFn: async (stockData) => {
      const { data } = await apiClient.post<Stock>(ENDPOINTS.STOCKS.CREATE, stockData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
};

export const useUpdateStock = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<Stock, Error, StockDTO>({
    mutationFn: async (stockData) => {
      const { data } = await apiClient.patch<Stock>(ENDPOINTS.STOCKS.DETAIL(id), stockData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(ENDPOINTS.STOCKS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}; 