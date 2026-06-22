import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - normalize the response payload and handle 401 globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Clear the stale token so AuthContext.checkAuth() / ProtectedRoute can
      // make the redirect decision during the normal React render cycle.
      // We deliberately do NOT hard-redirect here: a forced
      // window.location.href on every 401 (including the initial /auth/me
      // check on page refresh) was kicking freshly-authenticated users out
      // and causing the "logged out on refresh" bug.
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
