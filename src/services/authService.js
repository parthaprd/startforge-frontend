import axios from 'axios';

// Auth endpoints go directly to the backend.
const backendURL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

// ─── Token storage ────────────────────────────────────────────────────────────
// Browsers block cross-origin cookies between two different Vercel domains.
// Instead we store the Better Auth session token in localStorage and manually
// attach it as a Cookie header on every request — this is equivalent to the
// browser sending the cookie, but works cross-origin.
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

// ─── Axios instance ───────────────────────────────────────────────────────────
const authApi = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the session token as a Cookie header on every request.
authApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Cookie'] = `better-auth.session_token=${token}`;
  }
  return config;
});

// Strip axios envelope — callers get response.data directly.
authApi.interceptors.response.use((res) => res.data);

// ─── Service ──────────────────────────────────────────────────────────────────
export const authService = {
  register: (data) => authApi.post('/api/auth/sign-up/email', data),

  login: async (data) => {
    const res = await authApi.post('/api/auth/sign-in/email', data);
    // Better Auth returns { token, user } — persist the token
    if (res?.token) saveToken(res.token);
    return res;
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

  getSession: () => authApi.get('/api/auth/get-session'),
  getMe: () => authApi.get('/api/auth/me'),
  updateProfile: (data) => authApi.put('/api/auth/update-profile', data),
};
