import React from 'react'
import CarListComponent from './carListComponent'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Car List',
    description: 'Car List',
}

const CarListPage = () => {
    return <CarListComponent />;
}

export default CarListPage;