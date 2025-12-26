"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner } from '@/components/common';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && authState.isAuthenticated) {
      const user = authState.user;
      const {roleId, documentStatus} = user || {};

      // Redirect authenticated users away from public routes
      if (roleId === 1) {
        router.push('/admin/adminDashboard');
      } 
      else if (roleId == 2) {
        if (documentStatus == 1) {
          console.log('User Document Status:', documentStatus);
          router.push('/manager/document-upload?status=1'); // not upload documents
        } else if (documentStatus == 2) {
          router.push('/manager/document-upload?status=2'); // documents under review
        } else if (documentStatus == 3) {
          router.push('/manager/document-upload?status=3'); // documents rejected
        }else if(documentStatus == 4){
          router.push('/manager/managerDashboard'); // documents approved
        }
      }
      else if (roleId == 3) {
       if (documentStatus === 1) {
          router.push('/inspector/document-upload?status=1'); // not upload documents
        } else if (documentStatus === 2) {
          router.push('/inspector/document-upload?status=2'); // documents under review
        } else if (documentStatus === 3) {
          router.push('/inspector/document-upload?status=3'); // documents rejected
        }else {
          router.push('/inspector/inspectorDashboard'); // documents approved
        }
      }
    }
  }, [router, authState]);

  // Show loading spinner while checking auth
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if authenticated (will redirect in useEffect)
  if (authState.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
