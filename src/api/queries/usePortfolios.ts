import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Portfolio, PortfolioDTO, BulkPortfolioCreationPayload, PublicPortfolio } from '../../types/api';

// Query keys
export const portfolioKeys = {
  all: ['portfolios'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  detail: (id: number) => [...portfolioKeys.all, 'detail', id] as const,
  userPortfolios: (userId: number) => [...portfolioKeys.all, 'user', userId] as const,
  public: (id: number) => [...portfolioKeys.all, 'public', id] as const,
};

// Queries
export const usePortfolios = () => {
  return useQuery<Portfolio[]>({
    queryKey: portfolioKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get<{  portfolios: Portfolio[]  }>(ENDPOINTS.PORTFOLIOS.LIST);
      return data.portfolios;
    },
  });
};

export const usePortfolio = (id: number) => {
  return useQuery<Portfolio>({
    queryKey: portfolioKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Portfolio>(ENDPOINTS.PORTFOLIOS.DETAIL(id));
      return data;
    },
  });
};

export const useUserPortfolios = (userId: number) => {
  return useQuery<Portfolio[]>({
    queryKey: portfolioKeys.userPortfolios(userId),
    queryFn: async () => {
      const { data } = await apiClient.get<Portfolio[]>(`/users/${userId}/portfolios`);
      return data;
    },
  });
};

export const usePublicPortfolio = (id: number) => {
  return useQuery<PublicPortfolio>({
    queryKey: portfolioKeys.public(id),
    queryFn: async () => {
      const { data } = await apiClient.get<{ status: string, publicPortfolio: PublicPortfolio }>(ENDPOINTS.PORTFOLIOS.PUBLIC(id));
      return data.publicPortfolio;
    },
  });
};

// Mutations
export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Portfolio, Error, PortfolioDTO>({
    mutationFn: async (portfolioData) => {
      const { data } = await apiClient.post<Portfolio>(ENDPOINTS.PORTFOLIOS.CREATE, portfolioData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.userPortfolios(data.userId) 
      });
    },
  });
};

export const useUpdatePortfolio = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<Portfolio, Error, Partial<PortfolioDTO>>({
    mutationFn: async (portfolioData) => {
      const { data } = await apiClient.patch<Portfolio>(
        ENDPOINTS.PORTFOLIOS.DETAIL(id), 
        portfolioData
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.userPortfolios(data.userId) 
      });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(ENDPOINTS.PORTFOLIOS.DELETE(id));
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      // Note: We might want to invalidate user portfolios here too, 
      // but we don't have userId in the current context
    },
  });
};

export const useCreateBulkPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkPortfolioCreationPayload) =>
      apiClient.post<Portfolio>(ENDPOINTS.PORTFOLIOS.CREATE_BULK, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}; 