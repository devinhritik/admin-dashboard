'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { isLoggedIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to products
    if (isLoggedIn()) {
      router.push('/products');
    }
  }, [router]);

  return <LoginForm />;
}