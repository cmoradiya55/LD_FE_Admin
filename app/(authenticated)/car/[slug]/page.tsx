'use client';

import React from 'react'
import { useParams } from 'next/navigation';
import CarDetailsComponent from './CarDetailsComponent';
import { sampleCars } from '../data';

export default function CarDetailsPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const car = sampleCars.find(c => c.id === slug);

    if (!car) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Car Not Found</h2>
                    <p className="text-gray-600">The car you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return <CarDetailsComponent car={car} />;
}