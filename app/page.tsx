'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Directly navigate to login page when website opens
    router.push('/login');
  }, [router]);

  // Show nothing while redirecting
  return null;
}