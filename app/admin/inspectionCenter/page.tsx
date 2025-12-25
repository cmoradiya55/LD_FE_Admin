import type { Metadata } from 'next';
import React from 'react'
import InspectionCenterComponent from '@/app/admin/inspectionCenter/InspectionCenterComponent';

export const metadata: Metadata = {
  title: 'Inspection Center',
  description: 'Manage inspection centers and their operations',
};

const InspectionCenterPage = () => {
    return <InspectionCenterComponent />;
}

export default InspectionCenterPage;