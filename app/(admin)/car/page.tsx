import type { Metadata } from 'next';
import React from 'react'
import CarComponent from '@/app/(admin)/car/CarComponent';

export const metadata: Metadata = {
  title: 'Car Management',
  description: 'Manage and view car information and details',
};

export default function CarPage() {
    return <CarComponent />;
}