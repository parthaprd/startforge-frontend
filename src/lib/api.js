import axios from 'axios';
import { getToken, clearToken } from '@/services/authService';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token on every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const isAuthPage =
        window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthPage) {
        clearToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(
      error.response?.data || { success: false, message: error.message || 'Something went wrong' }
    );
  }
);

export default api;
