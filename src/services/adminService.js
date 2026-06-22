import api from '@/lib/api';

export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/admin/users/${id}/unblock`),
  getStartups: (params) => api.get('/admin/startups', { params }),
  approveStartup: (id) => api.put(`/admin/startups/${id}/approve`),
  rejectStartup: (id) => api.put(`/admin/startups/${id}/reject`),
  deleteStartup: (id) => api.delete(`/admin/startups/${id}`),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
};
