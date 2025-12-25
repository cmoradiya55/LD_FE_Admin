import { Metadata } from 'next';
import React from 'react'
import CreateStaffComponent from './CreateStaffComponent';

export const metadata: Metadata = {
    title: 'Create Staff',
    description: 'Create a new staff member',
};

const CreateStaffPage = () => {
    
    return (
        <CreateStaffComponent />
    );
};

export default CreateStaffPage;
