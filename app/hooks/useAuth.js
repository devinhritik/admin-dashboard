import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn, getToken } from '@/lib/auth';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated] = useState(() => isLoggedIn());
  const [token] = useState(() => getToken());
  const [isLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return {
    isAuthenticated,
    isLoading,
    token,
  };
};