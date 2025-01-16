import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.your-domain.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const _token = token ? JSON.parse(token)?.token : null;
    if (_token) {
      config.headers.Authorization = `Bearer ${_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., 401 unauthorized)
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 