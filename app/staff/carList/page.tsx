import { Metadata } from 'next';
import React from 'react';
import CarListComponent from './carListComponent';

export const metadata: Metadata = {
    title: 'Car List - Staff',
    description: 'Browse and manage all available cars',
};

const CarListPage = () => {
    return (
        <CarListComponent />
    );
};

export default CarListPage;

