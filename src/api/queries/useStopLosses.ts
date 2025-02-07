import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { StopLoss, StopLossDTO } from '../../types/api'

export const stopLossKeys = {
  all: ['stopLosses'] as const,
  lists: () => [...stopLossKeys.all, 'list'] as const,
  list: (portfolioStockId: number) => [...stopLossKeys.lists(), portfolioStockId] as const,
  details: () => [...stopLossKeys.all, 'detail'] as const,
  detail: (id: number) => [...stopLossKeys.details(), id] as const,
}

export const useStopLosses = (portfolioStockId: number) => {
  return useQuery({
    queryKey: stopLossKeys.list(portfolioStockId),
    queryFn: async () => {
      const { data } = await apiClient.get<{ status: string; data: { stopLosses: StopLoss[] } }>(
        `/portfolio-stocks/${portfolioStockId}/stop-losses`
      )
      return data.data.stopLosses
    },
  })
}

export const useCreateStopLoss = (portfolioStockId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (stopLoss: StopLossDTO) => {
      const { data } = await apiClient.post<{ status: string; data: { stopLoss: StopLoss } }>(
        `/portfolio-stocks/${portfolioStockId}/stop-losses`,
        stopLoss
      )
      return data.data.stopLoss
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stopLossKeys.list(portfolioStockId) })
    },
  })
}

export const useUpdateStopLoss = (id: number, portfolioStockId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (stopLoss: Partial<StopLossDTO>) => {
      const { data } = await apiClient.put<{ status: string; data: { stopLoss: StopLoss } }>(
        `/stop-losses/${id}`,
        stopLoss
      )
      return data.data.stopLoss
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stopLossKeys.list(portfolioStockId) })
    },
  })
}

export const useDeleteStopLoss = (portfolioStockId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete<{ status: string; message: string }>(
        `/stop-losses/${id}`
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stopLossKeys.list(portfolioStockId) })
    },
  })
} 