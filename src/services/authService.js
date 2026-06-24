import api from '@/lib/api';

export const authService = {
  // Better Auth endpoints on backend
  register: (data) => api.post('/auth/sign-up/email', data),
  login: (data) => api.post('/auth/sign-in/email', data),
  logout: () => api.post('/auth/sign-out'),
  getSession: () => api.get('/auth/get-session'),
  getMe: () => api.get('/auth/me'), // Custom endpoint
  updateProfile: (data) => api.put('/auth/update-profile', data),
};
