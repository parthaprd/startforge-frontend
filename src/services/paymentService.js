import api from '@/lib/api';

export const paymentService = {
  createCheckout: (data) => api.post('/payments/create-checkout-session', data),
  verifyPremium: () => api.get('/payments/verify-premium'),
  getMyTransactions: () => api.get('/payments/my-transactions'),
};
