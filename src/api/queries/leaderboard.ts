import { useQuery } from '@tanstack/react-query';
import { LeaderboardEntry } from '../../types/api';
import { LEADERBOARD } from '../endpoints';
import { apiClient } from '../client';

const QUERY_KEYS = {
  leaderboard: ['leaderboard']
} as const;

export const useLeaderboard = () => {
  return useQuery<LeaderboardEntry[]>({
    queryKey: QUERY_KEYS.leaderboard,
    queryFn: async () => {
      const { data } = await apiClient.get<{ leaderboard: LeaderboardEntry[] }>(LEADERBOARD.GET);
      console.log({
        data,
      });
      return data.leaderboard;
    }
  })
}; 