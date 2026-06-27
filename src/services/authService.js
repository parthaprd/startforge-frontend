import axios from 'axios';

const backendURL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

// ─── Token storage ────────────────────────────────────────────────────────────
// Browsers block cross-origin Set-Cookie between two Vercel domains.
// We store the full signed session token in localStorage and send it via the
// custom x-session-token header. The backend injects it into the Cookie header
// before Better Auth processes the request.
const TOKEN_KEY = 'ba_session_token';

export const saveToken = (token) => {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// ─── Axios instances ──────────────────────────────────────────────────────────
const authApi = axios.create({
  baseURL: backendURL,
  withCredentials: true,   // sends browser cookies when available
  headers: { 'Content-Type': 'application/json' },
});

// Attach stored token as x-session-token on every request so the backend
// can resolve the session even when the browser cookie is blocked.
authApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['x-session-token'] = token;
  }
  return config;
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const authService = {
  register: async (data) => {
    const res = await authApi.post('/api/auth/sign-up/email', data);
    return res.data;
  },

  login: async (data) => {
    // The backend injects `signedToken` (full signed cookie value) into the
    // sign-in response so we can store it without a second request.
    const res = await authApi.post('/api/auth/sign-in/email', data);
    const signedToken = res.data?.signedToken || res.data?.token;
    if (signedToken) saveToken(signedToken);
    return res.data;
  },

  logout: async () => {
    try {
      await authApi.post('/api/auth/sign-out', {}, {
        headers: { Origin: backendURL },
      });
    } finally {
      clearToken();
    }
  },

  getSession: async () => {
    const res = await authApi.get('/api/auth/get-session');
    return res.data;
  },

  getMe: async () => {
    const res = await authApi.get('/api/auth/me');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await authApi.put('/api/auth/update-profile', data);
    return res.data;
  },
};
