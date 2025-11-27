import type { Metadata } from 'next';
import React from 'react'
import CityComponent from '@/app/(authenticated)/city/CityComponent';

export const metadata: Metadata = {
  title: 'City Management',
  description: 'Manage and view city information and locations',
};

export default function CityPage() {
    return <CityComponent />;
}