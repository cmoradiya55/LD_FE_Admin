import React from 'react'
import InspectorListComponent from './inspectorListComponent'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Inspector List',
    description: 'Inspector List',
}

const InspectorListPage = () => {
    return <InspectorListComponent />;
}

export default InspectorListPage;