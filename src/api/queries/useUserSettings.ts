import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { UserSetting, UserSettingResponse, ToggleAnonymousResponse } from '../../types/api';

// Query keys
export const userSettingKeys = {
  all: ['userSettings'] as const,
  settings: () => [...userSettingKeys.all, 'settings'] as const,
};

// Queries
export const useUserSettings = () => {
  return useQuery<UserSetting>({
    queryKey: userSettingKeys.settings(),
    queryFn: async () => {
      const { data } = await apiClient.get<UserSettingResponse>('/settings');
      return data.data;
    },
  });
};

// Mutations
export const useToggleAnonymous = () => {
  const queryClient = useQueryClient();
  
  return useMutation<boolean, Error>({
    mutationFn: async () => {
      const { data } = await apiClient.post<ToggleAnonymousResponse>(
        '/settings/toggle-anonymous'
      );
      return data.data.isAnonymous;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userSettingKeys.settings() });
    },
  });
}; 