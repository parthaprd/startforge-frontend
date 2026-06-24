import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Better-auth handles authentication via session cookies automatically
    // No need to manually add Authorization headers
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Session expired or invalid - better-auth will handle session cleanup
      // Clear any stale localStorage auth state
      localStorage.removeItem('token');
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
