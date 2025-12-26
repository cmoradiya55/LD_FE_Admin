import type { Metadata } from 'next';
import UserComponent from '@/app/admin/users/UserComponent';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage users, tenants, landlords, and staff members',
};

export default function UsersPage() {
  return <UserComponent />;
}


































// "use client";

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function UsersPage() {
//   const router = useRouter();

//   useEffect(() => {
//     // Redirect to tenants page by default
//     router.replace('/users/tenants');
//   }, [router]);

//   return null;
// }