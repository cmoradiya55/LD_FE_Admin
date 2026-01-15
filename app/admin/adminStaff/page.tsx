import { Metadata } from 'next';
import React from 'react'
import AdminStaffComponent from './AdminStaffComponent';

export const metadata: Metadata = {
    title: 'Admin Staff',
    description: 'Manage admin staff members',
};

const AdminStaffPage = () => {
    return (
        <AdminStaffComponent />
    );
};

export default AdminStaffPage;