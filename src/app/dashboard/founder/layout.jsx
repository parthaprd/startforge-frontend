import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function FounderLayout({ children }) {
  return <ProtectedRoute allowedRoles={['founder']}>{children}</ProtectedRoute>;
}
