import { Metadata } from 'next';
import React from 'react'
import StaffDashboardComponent from './StaffDashboardComponent';

export const metadata: Metadata = {
    title: 'Staff Dashboard',
    description: 'Staff dashboard overview with statistics and key metrics',
}

const StaffDashboardPage = () => {
    return (
        <StaffDashboardComponent />
    )
}

export default StaffDashboardPage;