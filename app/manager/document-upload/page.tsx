import { Metadata } from 'next';
import React from 'react'
import ManagerDocument from './ManagerDocument';

export const metadata: Metadata = {
    title: 'Manager Document Upload',
    description: 'Manager document upload page',
}

const ManagerDocumentPage = () => {
    return (
        <ManagerDocument />
    )
}

export default ManagerDocumentPage;