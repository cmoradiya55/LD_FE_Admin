import { Metadata } from 'next';
import React, { Suspense } from 'react'
import ManagerDocument from './ManagerDocument';
import { LoadingSpinner } from '@/components/common';

export const metadata: Metadata = {
    title: 'Manager Document Upload',
    description: 'Manager document upload page',
}

const ManagerDocumentPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ManagerDocument />
        </Suspense>
    )
}

export default ManagerDocumentPage;