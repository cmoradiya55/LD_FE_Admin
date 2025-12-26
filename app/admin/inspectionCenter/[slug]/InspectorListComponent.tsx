'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/Button/Button';
import TextInput from '@/components/FormComponent/TextInput';
import MobileInput from '@/components/FormComponent/MobileInput';
import {
    ArrowLeft,
    Users,
    Phone,
    Mail,
    Plus,
    ShieldCheck,
    MapPin,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { createUser, getInspectionCentersData, getInspectorByManager } from '@/utils/axios/auth';

type Inspector = {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: 'active' | 'inactive';
    assignedDate: string;
    imageUrl?: string;
};

interface InspectorListComponentProps {
    managerId: string;
}

type InspectorFormValues = {
    name: string;
    mobileNo: string;
    phoneCountryCode: string;
    email: string;
};

const InspectorListComponent: React.FC<InspectorListComponentProps> = ({
    managerId,
}) => {
    const router = useRouter();

    const { data: inspectionCentersData } = useQuery({
        queryKey: ['GET_INSPECTION_CENTERS_DATA'],
        queryFn: async () => {
            try {
                const response = await getInspectionCentersData();
                if (response?.code === 200 && response?.data) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Error fetching inspection centers data:", error);
                toast.error("Error fetching inspection centers data");
                return [];
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const cityName = useMemo(() => {
        if (!inspectionCentersData || !managerId) return 'Unknown City';
        
        for (const center of inspectionCentersData) {
            if (center.managers && center.managers.length > 0) {
                const manager = center.managers.find((m: any) => String(m.id) === String(managerId));
                if (manager) {
                    return center.cityName || 'Unknown City';
                }
            }
        }
        return 'Unknown City';
    }, [inspectionCentersData, managerId]);

    const { data: inspectorsData, isLoading, isError, refetch: refetchInspectors } = useQuery<Inspector[]>({
        queryKey: ['GET_INSPECTORS_BY_MANAGER', managerId],
        queryFn: async () => {
            try {
                const response = await getInspectorByManager(managerId);
                if (response?.code === 200 && response?.data) {
                    return response.data.map((item: any) => {
                        let assignedDate = '';
                        if (item.createdAt) {
                            try {
                                const dateMatch = item.createdAt.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
                                if (dateMatch) {
                                    const [, day, monthName, year] = dateMatch;
                                    const monthMap: Record<string, string> = {
                                        'january': '01', 'february': '02', 'march': '03', 'april': '04',
                                        'may': '05', 'june': '06', 'july': '07', 'august': '08',
                                        'september': '09', 'october': '10', 'november': '11', 'december': '12'
                                    };
                                    const month = monthMap[monthName.toLowerCase()] || '01';
                                    const paddedDay = day.padStart(2, '0');
                                    assignedDate = `${paddedDay}-${month}-${year}`;
                                } else {
                                    const parsedDate = new Date(item.createdAt);
                                    if (!isNaN(parsedDate.getTime())) {
                                        assignedDate = parsedDate.toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }).replace(/\//g, '-');
                                    } else {
                                        assignedDate = item.createdAt;
                                    }
                                }
                            } catch (error) {
                                assignedDate = item.createdAt;
                            }
                        } else {
                            assignedDate = new Date().toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            }).replace(/\//g, '-');
                        }

                        return {
                            id: item.id,
                            name: item.name || '',
                            phone: item.countryCode && item.mobileNo 
                                ? `+${item.countryCode} ${item.mobileNo}`
                                : '',
                            email: item.email || '',
                            status: item.isActive !== undefined 
                                ? (item.isActive ? 'active' as const : 'inactive' as const)
                                : 'active' as const,
                            assignedDate: assignedDate,
                            imageUrl: item.selfie_image || undefined,
                        };
                    });
                }
                return [];
            } catch (error) {
                console.error("Error fetching inspectors:", error);
                throw error;
            }
        },
        enabled: !!managerId,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const inspectors = inspectorsData || [];
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
            mobileNo: '',
            phoneCountryCode: '+91',
        },
    });

    const handleAddInspector = () => {
        resetInspectorForm({
            name: '',
            mobileNo: '',
            phoneCountryCode: '+91',
        });
        setIsInspectorModalOpen(true);
    };

    const onSubmitInspector = async (data: InspectorFormValues) => {
        if (!managerId) {
            console.error('No manager ID available');
            return;
        }

        const payload = {
            roleId: 3,
            name: data.name,
            countryCode: 91,
            mobileNo: Number(data.mobileNo),
            managerId: Number(managerId),
        };

        try {
            const response = await createUser(payload);
            console.log('Response:', response);

            if (response?.code === 201 || response?.code === 200) {
                await refetchInspectors();
                resetInspectorForm({
                    name: '',
                    mobileNo: '',
                    phoneCountryCode: '+91',
                });
                setIsInspectorModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to create inspector:', error);
            toast.error("Failed to create inspector");
        }
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
                    {isLoading && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                            Loading inspectors...
                        </div>
                    )}
                    {isError && (
                        <div className="px-4 py-8 text-center text-sm text-red-500 sm:px-5">
                            Error loading inspectors. Please try again.
                        </div>
                    )}
                    {!isLoading && !isError && inspectors.map((inspector) => (
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
                                        <span className="text-gray-400">
                                            Assigned: {inspector.assignedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!isLoading && !isError && inspectors.length === 0 && (
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
                                name="mobileNo"
                                control={inspectorControl}
                                label="Mobile Number"
                                required
                                error={inspectorErrors.mobileNo}
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
