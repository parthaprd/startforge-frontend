// Token helpers — re-exported from authService for backwards compatibility
export { getToken, saveToken, clearToken } from '@/services/authService';

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('sf_token');
};
