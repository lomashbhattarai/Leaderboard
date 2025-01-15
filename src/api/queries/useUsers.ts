import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { User, CreateUserDTO, UpdateUserDTO, LoginCredentials, AuthResponse } from '../../types/api';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};

// Queries
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: { status: string ,users: User[] } }>(ENDPOINTS.USERS.LIST);
      return data.data.users; // todo: remove extra data from the backend
    },
  });
};

export const useUser = (id: number) => {
  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<User>(ENDPOINTS.USERS.DETAIL(id));
      return data;
    },
  });
};

// Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, CreateUserDTO>({
    mutationFn: async (userData) => {
      const { data } = await apiClient.post<User>(ENDPOINTS.USERS.CREATE, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserDTO>({
    mutationFn: async (userData) => {
      const { data } = await apiClient.patch<User>(ENDPOINTS.USERS.DETAIL(id), userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.USERS.LOGIN, credentials);
      return data;
    },
  });
}; 