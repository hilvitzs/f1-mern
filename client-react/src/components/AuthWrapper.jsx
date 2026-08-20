import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router';

export function AuthWrapper({ children }) {
  const authStore = useAuthStore();

  const isLoggedIn = !!authStore.token;

  if (isLoggedIn) {
    return children;
  }

  return <Navigate to="/login" />;
}
