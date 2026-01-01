import React from 'react';
import InspectorListComponent from './InspectorListComponent';

// Required for static export with dynamic routes
// Since manager IDs come from API, return placeholder
// Pages will still work client-side with dynamic routing
export function generateStaticParams() {
    // Return a placeholder - actual routes will work client-side
    return [{ slug: 'placeholder' }];
}

interface InspectorListPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function InspectorListPage({ params }: InspectorListPageProps) {
    const { slug } = await params; // manager id

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
