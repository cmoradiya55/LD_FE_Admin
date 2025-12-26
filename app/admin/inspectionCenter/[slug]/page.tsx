'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import InspectorListComponent from './InspectorListComponent';

export default function InspectorListPage() {
    const params = useParams();
    const slug = params?.slug as string; // manager id

    if (!slug) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid City</h2>
                    <p className="text-gray-600">Please select a valid inspection center.</p>
                </div>
            </div>
        );
    }

    return <InspectorListComponent managerId={slug} />;
}
