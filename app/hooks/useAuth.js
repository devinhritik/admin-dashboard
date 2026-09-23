import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js navigation
import { isLoggedIn, getToken } from '@/lib/auth';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const authenticated = isLoggedIn();
    setIsAuthenticated(authenticated);
    setToken(getToken());
    setIsLoading(false);

    // If not authenticated, redirect to login
    if (!authenticated) {
      router.push('/login');
    }
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    token,
  };
};