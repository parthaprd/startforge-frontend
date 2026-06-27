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
      const token = localStorage.getItem('ba_session_token');
      if (token) {
        // Send as Cookie header — Better Auth reads the session_token cookie
        config.headers['Cookie'] = `better-auth.session_token=${token}`;
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
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthPage) {
        localStorage.removeItem('ba_session_token');
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
