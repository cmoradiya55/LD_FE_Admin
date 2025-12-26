'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button/Button';
import { Plus, UserCircle2, Mail, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

type StaffMember = {
    id: number;
    name: string;
    role: string;
    email: string;
    enabled: boolean;
};

const initialStaff: StaffMember[] = [
    {
        id: 1,
        name: 'Arjun Mehta',
        role: 'Sales Manager',
        email: 'arjun.mehta@example.com',
        enabled: true,
    },
    {
        id: 2,
        name: 'Priya Sharma',
        role: 'Support Lead',
        email: 'priya.sharma@example.com',
        enabled: true,
    },
    {
        id: 3,
        name: 'Rohan Gupta',
        role: 'Inspection Officer',
        email: 'rohan.gupta@example.com',
        enabled: false,
    },
];

const StaffComponent = () => {
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
    const router = useRouter();

    const handleToggleStatus = (id: number) => {
        setStaff((prev) =>
            prev.map((member) =>
                member.id === id ? { ...member, enabled: !member.enabled } : member,
            ),
        );
    };

    const handleCreateStaff = () => {
        router.push('/staff/createStaff');
    };

    return (
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Team
                    </p>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        Staff Management
                    </h1>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        View all staff members, enable or disable access, and add new team
                        members.
                    </p>
                </div>

                <Button
                    onClick={handleCreateStaff}
                    className="h-9 rounded-full px-4 text-xs font-semibold sm:h-10 sm:px-5"
                >
                    <Plus className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Create Staff</span>
                </Button>
            </div>

            {/* Staff List */}
            <div className="overflow-hidden rounded-2xl border bg-white/70 shadow-sm backdrop-blur-sm">

                <div className="divide-y divide-gray-100">
                    {staff.map((member) => (
                        <div
                            key={member.id}
                            className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
                        >
                            {/* Profile + Meta */}
                            <div className="flex flex-1 items-start gap-3 sm:items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-11 sm:w-11">
                                    <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>

                                <div className="space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <p className="text-sm font-semibold text-gray-900 sm:text-base">
                                            {member.name}
                                        </p>
                                        <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                            {member.role}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                                        <span className="inline-flex items-center gap-1">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            <span>{member.email}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status + Actions */}
                            <div className="flex items-center justify-between gap-3 sm:w-auto sm:justify-end">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold sm:text-xs ${member.enabled
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'bg-amber-50 text-amber-500'
                                        }`}
                                >
                                    <span
                                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${member.enabled ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`}
                                    />
                                    {member.enabled ? 'Enabled' : 'Disabled'}
                                </span>

                                <Button
                                    variant={member.enabled ? 'outline' : 'secondary'}
                                    className={`h-8 rounded-full px-3 text-[11px] sm:h-8 sm:px-3 sm:text-xs ${member.enabled
                                        ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    onClick={() => handleToggleStatus(member.id)}
                                >
                                    {member.enabled ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </div>
                    ))}

                    {staff.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                            No staff members yet. Use{' '}
                            <span className="font-semibold text-blue-600">
                                Create Staff
                            </span>{' '}
                            to add your first team member.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffComponent;