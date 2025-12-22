import type { Metadata } from 'next';
import AdminDashboard from '@/app/(admin)/adminDashboard/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard overview with statistics and key metrics',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}