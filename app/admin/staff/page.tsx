import { Metadata } from 'next';
import React from 'react'
import StaffComponent from './StaffComponent';

export const metadata: Metadata = {
    title: 'Staff',
    description: 'Manage staff members',
};

const StaffPage = () => {
    return (
        <StaffComponent />
    );
};

export default StaffPage;