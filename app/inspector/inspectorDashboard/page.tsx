import { Metadata } from 'next';
import React from 'react'
import InspectorDashboard from './InspectorDashboard';

export const metadata: Metadata = {
    title: 'Inspector Dashboard',
    description: 'Inspector dashboard overview with statistics and key metrics',
}

const InspectorDashboardPage = () => {
    return (
        <InspectorDashboard />
    )
}

export default InspectorDashboardPage;