import axios from 'axios';

// For auth endpoints, use same-origin (proxied via Next.js rewrite) so that
// session cookies are always sent on the same domain.  Non-auth endpoints
// still hit the backend directly.
const authApi = axios.create({
  baseURL: '', // same origin — /api/auth/* is rewritten to the backend
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Strip envelope so callers get response.data directly (consistent with `api`)
authApi.interceptors.response.use((res) => res.data);

export const authService = {
  register: (data) => authApi.post('/api/auth/sign-up/email', data),
  login: (data) => authApi.post('/api/auth/sign-in/email', data),
  logout: () => authApi.post('/api/auth/sign-out'),
  getSession: () => authApi.get('/api/auth/get-session'),
  getMe: () => authApi.get('/api/auth/me'),
  updateProfile: (data) => authApi.put('/api/auth/update-profile', data),
};
