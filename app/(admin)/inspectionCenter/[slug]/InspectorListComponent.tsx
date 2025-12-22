'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button/Button';
import TextInput from '@/components/FormComponent/TextInput';
import MobileInput from '@/components/FormComponent/MobileInput';
import SelectInput from '@/components/FormComponent/SelectInput';
import {
    ArrowLeft,
    Users,
    UserCircle2,
    Phone,
    Mail,
    Plus,
    ShieldCheck,
    MapPin,
    X,
} from 'lucide-react';

type Inspector = {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: 'active' | 'inactive';
    assignedDate: string;
    imageUrl?: string;
};

// Mock data - in real app, fetch based on manager id
const getInspectorsByManagerId = (managerId: string): Inspector[] => {
    // Sample data - replace with API call
    const inspectors: Record<string, Inspector[]> = {
        '1': [
            {
                id: 1,
                name: 'Vikram Mehta',
                phone: '+91 98765 12345',
                email: 'vikram.mehta@example.com',
                status: 'active',
                assignedDate: '2024-01-15',
            },
            {
                id: 2,
                name: 'Priya Desai',
                phone: '+91 98765 23456',
                email: 'priya.desai@example.com',
                status: 'active',
                assignedDate: '2024-02-20',
            },
            {
                id: 3,
                name: 'Rahul Joshi',
                phone: '+91 98765 34567',
                email: 'rahul.joshi@example.com',
                status: 'active',
                assignedDate: '2024-03-10',
            },
            {
                id: 4,
                name: 'Anjali Shah',
                phone: '+91 98765 45678',
                email: 'anjali.shah@example.com',
                status: 'inactive',
                assignedDate: '2024-01-05',
            },
            {
                id: 5,
                name: 'Kiran Patel',
                phone: '+91 98765 56789',
                email: 'kiran.patel@example.com',
                status: 'active',
                assignedDate: '2024-04-01',
            },
        ],
        '3': [
            {
                id: 6,
                name: 'Harsh Trivedi',
                phone: '+91 98765 67890',
                email: 'harsh.trivedi@example.com',
                status: 'active',
                assignedDate: '2024-01-20',
            },
            {
                id: 7,
                name: 'Neha Gupta',
                phone: '+91 98765 78901',
                email: 'neha.gupta@example.com',
                status: 'active',
                assignedDate: '2024-02-15',
            },
            {
                id: 8,
                name: 'Manoj Kumar',
                phone: '+91 98765 89012',
                email: 'manoj.kumar@example.com',
                status: 'active',
                assignedDate: '2024-03-25',
            },
        ],
        '4': [
            {
                id: 9,
                name: 'Suresh Patel',
                phone: '+91 98765 90123',
                email: 'suresh.patel@example.com',
                status: 'active',
                assignedDate: '2024-01-10',
            },
            {
                id: 10,
                name: 'Meera Shah',
                phone: '+91 98765 01234',
                email: 'meera.shah@example.com',
                status: 'active',
                assignedDate: '2024-02-05',
            },
            {
                id: 11,
                name: 'Rajesh Kumar',
                phone: '+91 98765 12340',
                email: 'rajesh.kumar@example.com',
                status: 'active',
                assignedDate: '2024-03-15',
            },
            {
                id: 12,
                name: 'Divya Patel',
                phone: '+91 98765 23401',
                email: 'divya.patel@example.com',
                status: 'active',
                assignedDate: '2024-04-10',
            },
            {
                id: 13,
                name: 'Amit Shah',
                phone: '+91 98765 34012',
                email: 'amit.shah@example.com',
                status: 'active',
                assignedDate: '2024-05-01',
            },
            {
                id: 14,
                name: 'Kavita Desai',
                phone: '+91 98765 40123',
                email: 'kavita.desai@example.com',
                status: 'inactive',
                assignedDate: '2024-01-25',
            },
            {
                id: 15,
                name: 'Nilesh Mehta',
                phone: '+91 98765 01230',
                email: 'nilesh.mehta@example.com',
                status: 'active',
                assignedDate: '2024-06-01',
            },
        ],
        '6': [
            {
                id: 16,
                name: 'Pankaj Joshi',
                phone: '+91 98765 12301',
                email: 'pankaj.joshi@example.com',
                status: 'active',
                assignedDate: '2024-01-12',
            },
            {
                id: 17,
                name: 'Sunita Patel',
                phone: '+91 98765 23012',
                email: 'sunita.patel@example.com',
                status: 'active',
                assignedDate: '2024-02-18',
            },
            {
                id: 18,
                name: 'Ramesh Shah',
                phone: '+91 98765 30123',
                email: 'ramesh.shah@example.com',
                status: 'active',
                assignedDate: '2024-03-20',
            },
            {
                id: 19,
                name: 'Geeta Desai',
                phone: '+91 98765 01231',
                email: 'geeta.desai@example.com',
                status: 'active',
                assignedDate: '2024-04-15',
            },
        ],
    };

    return inspectors[managerId] || [];
};

interface InspectorListComponentProps {
    managerId: string;
}

type InspectorFormValues = {
    name: string;
    phone: string;
    phoneCountryCode: string;
    email: string;
    status: 'active' | 'inactive';
};

const InspectorListComponent: React.FC<InspectorListComponentProps> = ({
    managerId,
}) => {
    const router = useRouter();

    const managerCityMap: Record<string, string> = {
        '1': 'Rajkot',
        '3': 'Ahmedabad',
        '4': 'Surat',
        '6': 'Vadodara',
    };

    const cityName = managerCityMap[managerId] || 'Unknown City';

    const [inspectors, setInspectors] = useState<Inspector[]>(getInspectorsByManagerId(managerId));
    const activeCount = inspectors.filter((i) => i.status === 'active').length;
    const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);

    const {
        control: inspectorControl,
        handleSubmit: handleInspectorSubmit,
        reset: resetInspectorForm,
        formState: { errors: inspectorErrors },
    } = useForm<InspectorFormValues>({
        defaultValues: {
            name: '',
            phone: '',
            phoneCountryCode: '+91',
            email: '',
            status: 'active',
        },
    });

    const handleAddInspector = () => {
        resetInspectorForm({
            name: '',
            phone: '',
            phoneCountryCode: '+91',
            email: '',
            status: 'active',
        });
        setIsInspectorModalOpen(true);
    };

    const onSubmitInspector = (data: InspectorFormValues) => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY format

        const newInspector: Inspector = {
            id: Date.now(), // In real app, this would come from the API
            name: data.name,
            phone: `${data.phoneCountryCode} ${data.phone}`,
            email: data.email,
            status: data.status,
            assignedDate: formattedDate,
        };

        setInspectors((prev) => [...prev, newInspector]);
        setIsInspectorModalOpen(false);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            {/* Back Button */}
            <Button
                variant="outline"
                size="sm"
                className="rounded-full px-3 text-[11px]"
                onClick={() => router.push('/inspectionCenter')}
            >
                <ArrowLeft className="mr-1.5 h-3 w-3" />
                Back
            </Button>

            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                            Inspector Team
                        </p>
                        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                            {cityName} Inspectors
                        </h1>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Manage and view all inspectors assigned to this inspection center.
                        </p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full px-3 text-[11px] sm:px-4 sm:text-xs"
                    onClick={handleAddInspector}
                >
                    <Plus className="mr-1.5 h-3 w-3" />
                    Add Inspector
                </Button>
            </div>

            {/* Stats Card */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                    <div className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    Total Inspectors
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {inspectors.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                    <div className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    Active
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {activeCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                    <div className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    City
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {cityName}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inspectors List */}
            <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="border-b bg-gray-50/80 px-4 py-3 sm:px-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                Inspector List
                            </p>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                {inspectors.length} inspectors
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {inspectors.map((inspector) => (
                        <div
                            key={inspector.id}
                            className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
                        >
                            <div className="flex flex-1 items-start gap-3 sm:items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-11 sm:w-11 overflow-hidden">
                                    {inspector.imageUrl ? (
                                        <Image
                                            src={inspector.imageUrl}
                                            alt={inspector.name}
                                            width={44}
                                            height={44}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-semibold uppercase text-blue-700 sm:text-sm">
                                            {inspector.name?.charAt(0).toUpperCase() ?? 'I'}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <p className="text-sm font-semibold text-gray-900 sm:text-base">
                                            {inspector.name}
                                        </p>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold sm:text-xs ${inspector.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-amber-50 text-amber-500'
                                                }`}
                                        >
                                            <span
                                                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${inspector.status === 'active'
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-500'
                                                    }`}
                                            />
                                            {inspector.status === 'active'
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                                        <span className="inline-flex items-center gap-1">
                                            <Phone className="h-3 w-3 text-gray-400" />
                                            <span>{inspector.phone}</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            <span>{inspector.email}</span>
                                        </span>
                                        <span className="text-gray-400">
                                            Assigned: {inspector.assignedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {inspectors.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                            No inspectors assigned to this center yet. Use{' '}
                            <span className="font-semibold text-blue-600">
                                Add Inspector
                            </span>{' '}
                            to assign your first team member.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Inspector Modal */}
            {isInspectorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl border bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    {cityName}
                                </p>
                                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                                    Add Inspector
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200"
                                onClick={() => setIsInspectorModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleInspectorSubmit(onSubmitInspector)}
                            className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 sm:py-5"
                        >
                            <TextInput
                                name="name"
                                control={inspectorControl}
                                label="Inspector Name"
                                placeholder="Enter inspector full name"
                                required
                                error={inspectorErrors.name}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <MobileInput
                                name="phone"
                                control={inspectorControl}
                                label="Mobile Number"
                                required
                                error={inspectorErrors.phone}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <TextInput
                                name="email"
                                control={inspectorControl}
                                label="Email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                error={inspectorErrors.email}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <SelectInput
                                name="status"
                                control={inspectorControl}
                                label="Status"
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ]}
                                required
                                error={inspectorErrors.status}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <div className="flex justify-end gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-3 text-[11px]"
                                    onClick={() => setIsInspectorModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="rounded-full px-4 text-[11px]"
                                >
                                    Add Inspector
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectorListComponent;
