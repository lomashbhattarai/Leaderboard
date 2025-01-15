import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  fullName: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.post(ENDPOINTS.USERS.LOGIN, credentials);
  return response.data;
};

export const signup = async (credentials: SignupCredentials) => {
  const response = await apiClient.post(ENDPOINTS.USERS.CREATE, credentials);
  return response.data;
}; 