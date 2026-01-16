import React from 'react'
import CarInspectionForm from '@/components/carInspectionForm/carInspectionForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Car Inspection',
    description: 'Car Inspection',
}

const CarInspectionPage = () => {
    return (
        <CarInspectionForm />
    )
}

export default CarInspectionPage;