import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS } from '../endpoints'
import type { Journal, JournalDTO } from '../../types/api'
import { apiClient } from '../client'

export const journalKeys = {
  all: ['journals'] as const,
  lists: () => [...journalKeys.all, 'list'] as const,
  list: (params?: { portfolioStockId?: number; stopLossId?: number; journalType?: string }) => 
    [...journalKeys.lists(), params] as const,
  details: () => [...journalKeys.all, 'detail'] as const,
  detail: (id: number) => [...journalKeys.details(), id] as const,
}

const fetchJournals = async (params?: { portfolioStockId?: number; stopLossId?: number; journalType?: string }) => {
  const response = await apiClient.get<Journal[]>(ENDPOINTS.JOURNALS.LIST, { params })
  return response.data
}

const createJournal = async (data: JournalDTO) => {
  const response = await apiClient.post<Journal>(ENDPOINTS.JOURNALS.CREATE, data)
  return response.data
}

const updateJournal = async ({ id, data }: { id: number; data: JournalDTO }) => {
  const response = await apiClient.put<Journal>(ENDPOINTS.JOURNALS.UPDATE(id), data)
  return response.data
}

const deleteJournal = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.JOURNALS.DELETE(id))
  return response.data
}

export const useJournals = (params?: { portfolioStockId?: number; stopLossId?: number; journalType?: string }) => {
  return useQuery<Journal[]>({
    queryKey: journalKeys.list(params),
    queryFn: () => fetchJournals(params),
  })
}

export const useCreateJournal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createJournal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.all })
    },
  })
}

export const useUpdateJournal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateJournal,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.all })
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(id) })
    },
  })
}

export const useDeleteJournal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteJournal,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.all })
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(id) })
    },
  })
} 