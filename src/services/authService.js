import axios from 'axios';

const backendURL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

// ── Token storage ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'sf_token';

export const saveToken = (token) => {
  if (typeof window !== 'undefined' && token) localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
};

// ── Axios instance ────────────────────────────────────────────────────────────
const authApi = axios.create({
  baseURL: backendURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token on every request
authApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// ── Service ───────────────────────────────────────────────────────────────────
export const authService = {
  register: async (data) => {
    const res = await authApi.post('/api/auth/register', data);
    if (res.data?.token) saveToken(res.data.token);
    return res.data;
  },

  login: async (data) => {
    const res = await authApi.post('/api/auth/login', data);
    if (res.data?.token) saveToken(res.data.token);
    return res.data;
  },

  logout: () => {
    clearToken();
  },

  // Returns { success, data: user } or null
  getMe: async () => {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await authApi.get('/api/auth/me');
      return res.data;
    } catch {
      clearToken();
      return null;
    }
  },

  updateProfile: async (data) => {
    const res = await authApi.put('/api/auth/update-profile', data);
    return res.data;
  },

  // Google OAuth — redirect browser to backend
  loginWithGoogle: () => {
    const callbackURL = encodeURIComponent(`${window.location.origin}/callback`);
    window.location.href = `${backendURL}/api/auth/google?callbackURL=${callbackURL}`;
  },
};
