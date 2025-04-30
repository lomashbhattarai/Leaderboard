import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import type { WatchListEntry, WatchListResponse, AddToWatchListDTO } from '../../types/api'

// Query keys
export const watchListKeys = {
  all: ['watchList'] as const,
  lists: () => [...watchListKeys.all, 'list'] as const,
  detail: (id: number) => [...watchListKeys.all, 'detail', id] as const,
}

// Queries
export const useWatchList = () => {
  return useQuery<WatchListEntry[]>({
    queryKey: watchListKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get<WatchListResponse>(ENDPOINTS.WATCHLIST.LIST)
      return data.watchList
    },
  })
}

// Mutations
export const useAddToWatchList = () => {
  const queryClient = useQueryClient()

  return useMutation<WatchListEntry, Error, AddToWatchListDTO>({
    mutationFn: async (watchListData) => {
      const { data } = await apiClient.post<WatchListResponse>(ENDPOINTS.WATCHLIST.CREATE, watchListData)
      return data.watchList[0] // Assuming the API returns the newly created entry
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchListKeys.lists() })
    },
  })
}

export const useRemoveFromWatchList = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(ENDPOINTS.WATCHLIST.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchListKeys.lists() })
    },
  })
} 