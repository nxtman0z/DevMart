import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isAuthenticated, isLoading, fetchUser, logout } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setInitializing(false);
    };
    init();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    initializing,
    isSeller: user?.role === 'seller',
    logout,
  };
}
