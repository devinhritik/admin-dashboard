'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure router is ready
    const timer = setTimeout(() => {
      if (isLoggedIn()) {
        router.push('/products');
      } else {
        router.push('/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  // Render same loading state on both server and client
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Redirecting...</p>
      </div>
    </div>
  );
}