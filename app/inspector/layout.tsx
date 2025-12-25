"use client";

import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <AdminLayout>{children}</AdminLayout>
    </FavoritesProvider>
  );
}
