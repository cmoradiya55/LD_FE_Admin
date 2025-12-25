import { Metadata } from 'next';
import React from 'react'
import ManagerDashboard from './ManagerDashboard';

export const metadata: Metadata = {
    title: 'Manager Dashboard',
    description: 'Manager dashboard overview with statistics and key metrics',
}

const ManagerDashboardPage = () => {
    return (
        <ManagerDashboard />
    )
}

export default ManagerDashboardPage;