"use client";

import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </FavoritesProvider>
  );
}