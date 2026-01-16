'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/Button/Button';
import TextInput from '@/components/FormComponent/TextInput';
import MobileInput from '@/components/FormComponent/MobileInput';
import OverviewStatCard from '@/components/common/OverviewStatCard';
import {
    Plus,
    Users,
    UserCheck,
    UserX,
    Phone,
    X,
    FileText,
    Verified,
} from 'lucide-react';
import { toast } from 'sonner';
import { createUser, getAllUsers } from '@/utils/axios/auth';
import DocumentsPreviewModal from '@/components/DocumentsPreviewModal/DocumentsPreviewModal';

type StaffMember = {
    id: number;
    name: string;
    phone?: string;
    imageUrl?: string;
    enabled: boolean;
    assignedDate?: string;
    documentStatus?: number;
    selfieImage?: string | null;
    aadharFrontImage?: string | null;
    aadharBackImage?: string | null;
    panImage?: string | null;
    aadharNumber?: string | null;
    panNumber?: string | null;
};

type StaffFormValues = {
    name: string;
    mobileNo: string;
    phoneCountryCode: string;
};

const AdminStaffComponent = () => {
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

    const { data: staffResponse, isLoading, isError, refetch: refetchStaff } = useQuery({
        queryKey: ['GET_ALL_STAFF'],
        queryFn: async () => {
            try {
                const response = await getAllUsers(4);
                if (response?.code === 200 && response?.data) {
                    const formatDate = (dateStr: string) => {
                        if (!dateStr) return '';
                        try {
                            const date = new Date(dateStr);
                            return !isNaN(date.getTime())
                                ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                                : dateStr;
                        } catch {
                            return dateStr;
                        }
                    };

                    const staffData = Array.isArray(response.data)
                        ? response.data.filter((item: any) => item.roleId === 4 || item.role_id === 4)
                        : [];

                    return staffData.map((item: any) => ({
                        id: item.id,
                        name: item.name || '',
                        phone: item.countryCode && item.mobileNo ? `+${item.countryCode} ${item.mobileNo}` : item.mobileNo || '',
                        imageUrl: item.document?.selfieImage || undefined,
                        enabled: item.isActive ?? true,
                        assignedDate: formatDate(item.createdAt),
                        documentStatus: item.documentStatus,
                        selfieImage: item.document?.selfieImage || null,
                        aadharFrontImage: item.document?.aadharFrontImage || null,
                        aadharBackImage: item.document?.aadharBackImage || null,
                        panImage: item.document?.panImage || null,
                        aadharNumber: item.document?.aadharNumber || null,
                        panNumber: item.document?.panNumber || null,
                    }));
                }
                return [];
            } catch (error) {
                console.error("Error fetching staff:", error);
                throw error;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const staff: StaffMember[] = staffResponse || [];

    const {
        control: staffControl,
        handleSubmit: handleStaffSubmit,
        reset: resetStaffForm,
        formState: { errors: staffErrors },
    } = useForm<StaffFormValues>({
        defaultValues: {
            name: '',
            mobileNo: '',
            phoneCountryCode: '+91',
        },
    });

    const handleViewDocuments = (staffMember: StaffMember) => {
        setSelectedStaff(staffMember);
        setIsDocumentsModalOpen(true);
    };

    const selectedStaffDocuments = selectedStaff ? {
        selfieImage: selectedStaff.selfieImage ?? null,
        aadharFrontImage: selectedStaff.aadharFrontImage ?? null,
        aadharBackImage: selectedStaff.aadharBackImage ?? null,
        panImage: selectedStaff.panImage ?? null,
        aadharNumber: selectedStaff.aadharNumber ?? null,
        panNumber: selectedStaff.panNumber ?? null,
        name: selectedStaff.name,
    } : null;

    const handleAddStaff = () => {
        resetStaffForm({
            name: '',
            mobileNo: '',
            phoneCountryCode: '+91',
        });
        setIsStaffModalOpen(true);
    };

    const onSubmitStaff = async (data: StaffFormValues) => {
        const payload = {
            roleId: 4,
            name: data.name,
            countryCode: 91,
            mobileNo: Number(data.mobileNo),
            managerId: 1,
        };

        try {
            const response = await createUser(payload);
            if (response?.code === 201) {
                await refetchStaff();
                resetStaffForm({ name: '', mobileNo: '', phoneCountryCode: '+91' });
                setIsStaffModalOpen(false);
                toast.success('Staff member added successfully');
            }
        } catch (error) {
            console.error('Failed to create staff:', error);
            toast.error("Failed to create staff");
        }
    };

    const stats = useMemo(() => ({
        total: staff.length,
        enabled: staff.filter((s) => s.enabled).length,
        disabled: staff.filter((s) => !s.enabled).length,
    }), [staff]);

    return (
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                            Staff Management
                        </p>
                        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                            Staff Members
                        </h1>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Manage and view all staff members and verify their documents.
                        </p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full px-3 text-[11px] sm:px-4 sm:text-xs"
                    onClick={handleAddStaff}
                >
                    <Plus className="mr-1.5 h-3 w-3" />
                    Add Staff
                </Button>
            </div>

            {/* Stats Card */}
            <div className="grid gap-4 sm:grid-cols-3">
                <OverviewStatCard
                    label="Total Staff"
                    value={stats.total}
                    icon={Users}
                    background="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                    accentCircleColor="rgba(255,255,255,0.2)"
                    valueClassName="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight"
                    labelClassName="text-[10px] sm:text-xs font-medium"
                />

                <OverviewStatCard
                    label="Active"
                    value={stats.enabled}
                    icon={UserCheck}
                    background="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    accentCircleColor="rgba(255,255,255,0.2)"
                    valueClassName="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight"
                    labelClassName="text-[10px] sm:text-xs font-medium"
                />

                <OverviewStatCard
                    label="Inactive"
                    value={stats.disabled}
                    icon={UserX}
                    background="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    accentCircleColor="rgba(255,255,255,0.2)"
                    valueClassName="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight"
                    labelClassName="text-[10px] sm:text-xs font-medium"
                />
            </div>

            {/* Staff List */}
            <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="border-b bg-gray-50/80 px-4 py-3 sm:px-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                Staff List
                            </p>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                {staff.length} staff
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {isLoading && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                            Loading staff...
                        </div>
                    )}
                    {isError && (
                        <div className="px-4 py-8 text-center text-sm text-red-500 sm:px-5">
                            Error loading staff. Please try again.
                        </div>
                    )}
                    {!isLoading && !isError && staff.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                            No staff members added yet. Use{' '}
                            <span className="font-semibold text-blue-600">
                                Add Staff
                            </span>{' '}
                            to add your first team member.
                        </div>
                    )}
                    {!isLoading && !isError && staff.map((member: StaffMember) => (
                        <div
                            key={member.id}
                            className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
                        >
                            <div className="flex flex-1 items-start gap-3 sm:items-center">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full overflow-hidden ${member.enabled ? 'bg-blue-50' : 'bg-gray-100'
                                    }`}>
                                    {member.imageUrl ? (
                                        <Image
                                            src={member.imageUrl}
                                            alt={member.name}
                                            width={44}
                                            height={44}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className={`text-xs font-semibold uppercase sm:text-sm ${member.enabled ? 'text-blue-700' : 'text-gray-600'
                                            }`}>
                                            {member.name?.charAt(0).toUpperCase() ?? 'S'}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <p className="text-sm font-semibold text-gray-900 sm:text-base">
                                            {member.name}
                                        </p>
                                        {member.documentStatus === 3 && (
                                            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                                                <Verified className="h-3 w-3 text-green-500" />
                                                Verified
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                                        {member.phone && (
                                            <span className="inline-flex items-center gap-1">
                                                <Phone className="h-3 w-3 text-gray-400" />
                                                <span>{member.phone}</span>
                                            </span>
                                        )}
                                        {member.assignedDate && (
                                            <span className="text-gray-400">
                                                Assigned: {member.assignedDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Document Verify Button */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-3 text-[11px] sm:px-4 sm:text-xs"
                                    onClick={() => handleViewDocuments(member)}
                                >
                                    <FileText className="mr-1.5 h-3 w-3" />
                                    Document Verify
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Staff Modal */}
            {isStaffModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl border bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    Staff Management
                                </p>
                                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                                    Add Staff
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200"
                                onClick={() => setIsStaffModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleStaffSubmit(onSubmitStaff)}
                            className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 sm:py-5"
                        >
                            <TextInput
                                name="name"
                                control={staffControl}
                                label="Staff Name"
                                placeholder="Enter staff full name"
                                required
                                error={staffErrors.name}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <MobileInput
                                name="mobileNo"
                                control={staffControl}
                                label="Mobile Number"
                                required
                                error={staffErrors.mobileNo}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <div className="flex justify-end gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-3 text-[11px]"
                                    onClick={() => setIsStaffModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="rounded-full px-4 text-[11px]"
                                >
                                    Add Staff
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Documents Modal */}
            <DocumentsPreviewModal
                isOpen={isDocumentsModalOpen}
                onClose={() => {
                    setIsDocumentsModalOpen(false);
                    setSelectedStaff(null);
                    refetchStaff();
                }}
                documents={selectedStaffDocuments}
                userId={selectedStaff?.id}
                documentStatus={selectedStaff?.documentStatus}
                onAccept={async () => {
                    await refetchStaff();
                }}
                onReject={async () => {
                    await refetchStaff();
                }}
            />
        </div>
    );
};

export default AdminStaffComponent;