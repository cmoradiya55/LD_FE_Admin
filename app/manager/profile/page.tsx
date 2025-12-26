"use client";
import React from 'react';
import ProfileScreen from '../../../components/ProfileScreen/ProfileScreen';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

const metadata: Metadata = {
    title: 'Profile',
    description: 'Profile',
}

const ProfilePage = () => {
    const router = useRouter();

    return <ProfileScreen onBack={() => {
        router.push('/admin/adminDashboard');
    }} />;
}

export default ProfilePage;