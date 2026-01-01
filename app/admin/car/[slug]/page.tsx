import React from 'react';
import CarDetailsComponent from './CarDetailsComponent';
import { sampleCars } from '../data';

// Required for static export with dynamic routes
export function generateStaticParams() {
    return sampleCars.map((car) => ({
        slug: car.id,
    }));
}

interface CarDetailsPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
    const { slug } = await params;
    const car = sampleCars.find(c => c.id === slug);

    if (!car) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Car Not Found</h2>
                    <p className="text-gray-600">The car you&#39;re looking for doesn&#39;t exist.</p>
                </div>
            </div>
        );
    }

    return <CarDetailsComponent car={car} />;
}