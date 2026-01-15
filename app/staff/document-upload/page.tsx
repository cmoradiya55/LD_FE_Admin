import { Metadata } from 'next';
import React, { Suspense } from 'react'
import StaffDocument from './StaffDocument';
import { LoadingSpinner } from '@/components/common';

export const metadata: Metadata = {
    title: 'Staff Document Upload',
    description: 'Staff document upload page',
}

const StaffDocumentPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <StaffDocument />
        </Suspense>
    )
}

export default StaffDocumentPage;

