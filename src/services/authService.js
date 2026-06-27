import axios from 'axios';

// Auth endpoints go directly to the backend (not through the Next.js proxy).
// This ensures session cookies and API calls work consistently in both
// development and production (Vercel), where rewrites are unreliable for
// cross-origin cookie flows.
const backendURL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

const authApi = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Strip envelope so callers get response.data directly (consistent with `api`)
authApi.interceptors.response.use((res) => res.data);

export const authService = {
  register: (data) => authApi.post('/api/auth/sign-up/email', data),
  login: (data) => authApi.post('/api/auth/sign-in/email', data),
  logout: () => authApi.post('/api/auth/sign-out', {}, { headers: { Origin: backendURL } }),
  getSession: () => authApi.get('/api/auth/get-session'),
  getMe: () => authApi.get('/api/auth/me'),
  updateProfile: (data) => authApi.put('/api/auth/update-profile', data),
};
