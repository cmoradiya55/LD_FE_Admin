"use client";

import { useRouter } from 'next/navigation';
import ChangePasswordScreen from '@/app/(authenticated)/settings/change-password/ChangePasswordScreen';

export default function ChangePasswordPage() {
  const router = useRouter();

  return <ChangePasswordScreen onBack={() => router.push('/settings')} />;
}