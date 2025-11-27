import type { Metadata } from 'next';
import Dashboard from '@/app/(authenticated)/dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard overview with statistics and key metrics',
};

export default function DashboardPage() {
  return <Dashboard />;
}