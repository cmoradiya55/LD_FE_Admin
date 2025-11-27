import type { Metadata } from 'next';
import React from 'react'
import InspectionCenterComponent from '@/app/(authenticated)/inspectionCenter/InspectionCenterComponent';

export const metadata: Metadata = {
  title: 'Inspection Center',
  description: 'Manage inspection centers and their operations',
};

export default function InspectionCenterPage() {
    return <InspectionCenterComponent />;
}