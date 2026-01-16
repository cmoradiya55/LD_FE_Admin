import React from 'react';
import NotificationScreen from '@/components/NotificationScreen/NotificationScreen';
import { Metadata } from 'next';

const metadata: Metadata = {
    title: 'Notifications',
    description: 'Notifications',
}

const NotificationsPage = () => {
    return <NotificationScreen />;
}

export default NotificationsPage;