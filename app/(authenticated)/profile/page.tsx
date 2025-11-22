"use client";

import { useRouter } from 'next/navigation';
import ProfileScreen from '@/components/ProfileScreen';

export default function ProfilePage() {
  const router = useRouter();

  return <ProfileScreen onBack={() => router.push('/dashboard')} />;
}