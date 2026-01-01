import { Metadata } from 'next';
import React, { Suspense } from 'react'
import InspectorDocument from './InspectorDocument';
import { LoadingSpinner } from '@/components/common';

export const metadata: Metadata = {
    title: 'Inspector Document Upload',
    description: 'Inspector document upload page',
}

const InspectorDocumentPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <InspectorDocument />
        </Suspense>
    )
}

export default InspectorDocumentPage;