import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

interface DashboardStats {
  activeUsers: number;
  weeklyLogins: number;
  totalUsers: number;
  totalPortfolios: number;
  totalTransactions: number;
}

interface TopUser {
  rank: number;
  id: number;
  email: string;
  fullName: string | null;
  lastLogin: string | null;
  createdAt: string;
}

interface NepseFetchLog {
  id: number;
  fetchDate: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attemptNumber: number;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  triggeredBy: {
    id: number;
    email: string;
    fullName: string | null;
  } | null;
  duration: number | null;
}

export function useAdminDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD_STATS);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useTopActiveUsers() {
  return useQuery<TopUser[]>({
    queryKey: ['admin', 'users', 'top-active'],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN.TOP_ACTIVE_USERS);
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useNepseLogs(limit: number = 50) {
  return useQuery<NepseFetchLog[]>({
    queryKey: ['admin', 'nepse', 'logs', limit],
    queryFn: async () => {
      const response = await apiClient.get(ENDPOINTS.ADMIN.NEPSE_LOGS, {
        params: { limit },
      });
      return response.data;
    },
    staleTime: 10 * 1000, // 10 seconds
  });
}

export function useLatestNepseStatus() {
  return useQuery<NepseFetchLog | null>({
    queryKey: ['admin', 'nepse', 'latest'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.ADMIN.NEPSE_LATEST);
        return response.data;
      } catch (error) {
        console.error('Error fetching latest NEPSE status:', error);
        return null;
      }
    },
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval: 10 * 1000, // Poll every 10 seconds
  });
}

export function useTriggerNepseFetch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(ENDPOINTS.ADMIN.NEPSE_TRIGGER);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['admin', 'nepse'] });
    },
  });
}
