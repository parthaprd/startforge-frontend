import api from '@/lib/api';

export const applicationService = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my-applications'),
  getOpportunityApplications: (id) =>
    api.get(`/applications/opportunity/${id}`),
  updateStatus: (id, status) =>
    api.put(`/applications/${id}/status`, { status }),
  withdraw: (id) => api.delete(`/applications/${id}`),
};
