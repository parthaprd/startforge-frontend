import api from '@/lib/api';

export const startupService = {
  getStartups: (params) => api.get('/startups', { params }),
  getStartupById: (id) => api.get(`/startups/${id}`),
  createStartup: (data) => api.post('/startups', data),
  updateStartup: (id, data) => api.put(`/startups/${id}`, data),
  deleteStartup: (id) => api.delete(`/startups/${id}`),
  getMyStartup: () => api.get('/startups/my-startup'),
};
