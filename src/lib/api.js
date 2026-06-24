import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // CRITICAL: Send cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header if token exists (fallback for cross-origin)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Only redirect if not already on auth pages
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthPage) {
        localStorage.removeItem('auth-token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(
      error.response?.data || {
        success: false,
        message: error.message || 'Something went wrong',
      }
    );
  }
);

export default api;
