import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Update your account password and security settings',
};

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

