import { Metadata } from 'next';
import React from 'react'
import InspectorDocument from './InspectorDocument';

export const metadata: Metadata = {
    title: 'Inspector Document Upload',
    description: 'Inspector document upload page',
}

const InspectorDocumentPage = () => {
    return (
        <InspectorDocument />
    )
}

export default InspectorDocumentPage;