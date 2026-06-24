import api from '@/lib/api';

export const authService = {
  // Better Auth endpoints on backend
  register: (data) => api.post('/auth/sign-up/email', data),
  login: async (data) => {
    const response = await api.post('/auth/sign-in/email', data);
    // If backend returns a token, store it
    if (response.token) {
      localStorage.setItem('auth-token', response.token);
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('auth-token');
    return api.post('/auth/sign-out');
  },
  getSession: () => api.get('/auth/get-session'),
  getMe: () => api.get('/auth/me'), // Custom endpoint
  updateProfile: (data) => api.put('/auth/update-profile', data),
};
