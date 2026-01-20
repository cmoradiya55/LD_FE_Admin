"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OverviewStatCard, LoadingSpinner } from '@/components/common';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    UserCheck,
    UserX,
    Phone,
    Calendar,
    Eye,
    ShieldCheck,
    CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { getInspectors } from '@/utils/axios/auth';
import DocumentsPreviewModal from '@/components/DocumentsPreviewModal/DocumentsPreviewModal';

type Inspector = {
    id: number;
    name: string;
    phone: string;
    assignedDate: string;
    imageUrl?: string;
    documentStatus?: number;
    isVerified?: boolean;
    isActive: boolean;
    documentStatusName?: string;
    selfieImage?: string | null;
    aadharFrontImage?: string | null;
    aadharBackImage?: string | null;
    panImage?: string | null;
    aadharNumber?: string | null;
    panNumber?: string | null;
};

const InspectorListComponent = () => {
    const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
    const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) {
            return new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-');
        }
        try {
            const dateMatch = dateString.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
            if (dateMatch) {
                const [, day, monthName, year] = dateMatch;
                const monthMap: Record<string, string> = {
                    'january': '01', 'february': '02', 'march': '03', 'april': '04',
                    'may': '05', 'june': '06', 'july': '07', 'august': '08',
                    'september': '09', 'october': '10', 'november': '11', 'december': '12'
                };
                const month = monthMap[monthName.toLowerCase()] || '01';
                return `${day.padStart(2, '0')}-${month}-${year}`;
            }
            const parsedDate = new Date(dateString);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).replace(/\//g, '-');
            }
            return dateString;
        } catch {
            return dateString;
        }
    };

    const statusMap: Record<number, string> = {
        1: 'Pending Verification',
        2: 'Under Review',
        3: 'Verified',
        4: 'Rejected',
    };

    const { data: inspectorsResponse, isLoading, isError } = useQuery({
        queryKey: ['GET_INSPECTORS'],
        queryFn: async () => {
            const response = await getInspectors();
            if (response?.code === 200 && response?.data) {
                return response.data.map((item: any) => ({
                    id: item.id,
                    name: item.name || '',
                    phone: item.countryCode && item.mobileNo
                        ? `+${item.countryCode} ${item.mobileNo}`
                        : item.mobileNo || '',
                    isActive: item.isActive,
                    assignedDate: formatDate(item.createdAt),
                    imageUrl: item.selfieImage || undefined,
                    documentStatus: item.documentStatus,
                    documentStatusName: statusMap[item.documentStatus] || 'Pending Verification',
                    isVerified: item.documentStatus === 3 || item.isVerified || false,
                    selfieImage: item.selfieImage || null,
                    aadharFrontImage: item.aadharFrontImage || null,
                    aadharBackImage: item.aadharBackImage || null,
                    panImage: item.panImage || null,
                    aadharNumber: item.aadharNumber || null,
                    panNumber: item.panNumber || null,
                }));
            }
            return [];
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const inspectors: Inspector[] = inspectorsResponse || [];

    const handleViewDocuments = (inspector: Inspector) => {
        setSelectedInspector(inspector);
        setIsDocumentsModalOpen(true);
    };

    const selectedInspectorDocuments = selectedInspector ? {
        selfieImage: selectedInspector.selfieImage ?? null,
        aadharFrontImage: selectedInspector.aadharFrontImage ?? null,
        aadharBackImage: selectedInspector.aadharBackImage ?? null,
        panImage: selectedInspector.panImage ?? null,
        aadharNumber: selectedInspector.aadharNumber ?? null,
        panNumber: selectedInspector.panNumber ?? null,
        name: selectedInspector.name,
    } : null;

    const stats = useMemo(() => ({
        total: inspectors.length,
        active: inspectors.filter((i) => i.isActive).length,
        inactive: inspectors.filter((i) => !i.isActive).length,
    }), [inspectors]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-slate-600">Loading inspectors...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-dashed border-red-300 rounded-2xl shadow-sm">
                <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gradient-to-br from-red-100 to-red-200 p-4 mb-4 ring-4 ring-red-50">
                        <UserX className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Error loading inspectors</h3>
                    <p className="text-sm text-slate-500 mb-4 max-w-md">
                        There was an error fetching the inspectors. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>

            {/* Page Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Inspector List
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base">
                            Manage and view all inspectors assigned to you
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3">
                <OverviewStatCard
                    label="Total Inspectors"
                    value={stats.total}
                    icon={Users}
                    background="linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(37,99,235,1) 50%, rgba(29,78,216,1) 100%)"
                />

                <div className="grid grid-cols-2 gap-3">
                    <OverviewStatCard
                        label="Active Inspectors"
                        value={stats.active}
                        icon={UserCheck}
                        background="linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(22,163,74,1) 50%, rgba(21,128,61,1) 100%)"
                    />
                    <OverviewStatCard
                        label="Inactive Inspectors"
                        value={stats.inactive}
                        icon={UserX}
                        background="linear-gradient(135deg, rgba(148,163,184,1) 0%, rgba(100,116,139,1) 50%, rgba(71,85,105,1) 100%)"
                    />
                </div>
            </div>

            {/* Inspectors Grid */}
            {inspectors.length === 0 ? (
                <div className="p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl shadow-sm">
                    <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-4 mb-4 ring-4 ring-blue-50">
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No inspectors found</h3>
                        <p className="text-sm text-slate-500 mb-4 max-w-md">
                            No inspectors have been assigned to you yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {inspectors.map((inspector) => (
                        <div
                            key={inspector.id}
                            className="group relative overflow-hidden bg-white border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] rounded-3xl"
                        >
                            {/* Background Pattern */}
                            <div className={`absolute inset-0 opacity-5 ${inspector.isActive
                                ? 'bg-gradient-to-br from-blue-400 via-indigo-400 to-blue-500'
                                : 'bg-gradient-to-br from-slate-400 via-slate-400 to-slate-500'
                                }`} />
                            {/* Side accent bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${inspector.isActive
                                ? 'bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-600'
                                : 'bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600'
                                }`} />

                            <div className="relative p-5">
                                {/* Top Section - Redesigned Avatar, Name, Status */}
                                <div className="flex items-start gap-4 mb-4">
                                    {/* Avatar Section - Redesigned */}
                                    <div className="relative flex-shrink-0">
                                        {/* Glow effect */}
                                        <div className={`absolute -inset-2 rounded-full ${inspector.isActive
                                            ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                                            : 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500'
                                            } opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />

                                        {/* Avatar with ring */}
                                        <div className="relative">
                                            <div className={`h-16 w-16 border-4 rounded-full overflow-hidden ${inspector.isActive
                                                ? 'border-blue-200 ring-2 ring-blue-100'
                                                : 'border-slate-200 ring-2 ring-slate-100'
                                                } shadow-xl transition-all duration-300 group-hover:scale-105`}>
                                                {inspector.imageUrl ? (
                                                    <Image
                                                        src={inspector.imageUrl}
                                                        alt={inspector.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover w-full h-full rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                                        <span className="text-xl font-bold text-white">
                                                            {inspector.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status indicator ring */}
                                            <div className={`absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-4 border-white ${inspector.isActive ? 'bg-green-500' : 'bg-slate-400'} shadow-lg`} />
                                        </div>
                                    </div>

                                    {/* Name and Status Section */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                                            {inspector.name}
                                        </h3>
                                        <Badge
                                            className={`inline-flex items-center gap-1.5 ${inspector.isActive
                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/60'
                                                : 'bg-slate-50 text-slate-600 border-slate-200/60'
                                                } border font-semibold px-3 py-1 rounded-full text-xs shadow-sm`}
                                            variant="outline"
                                        >
                                            <div className={`h-2 w-2 rounded-full ${inspector.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                                            <span className="font-medium">{inspector.isActive ? 'Active' : 'Inactive'}</span>
                                        </Badge>
                                    </div>
                                </div>

                                {/* Contact Info - Horizontal Layout */}
                                <div className="space-y-1 mb-3">
                                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${inspector.isActive
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            <Phone className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-700 flex-1 truncate">{inspector.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${inspector.isActive
                                            ? 'bg-indigo-100 text-indigo-600'
                                            : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            <Calendar className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-700 flex-1 truncate">
                                            {inspector.assignedDate || 'Not assigned'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-1.5">
                                    {inspector.isVerified ? (
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-xl font-semibold cursor-default"
                                            disabled
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Verified
                                        </Button>
                                    ) : (
                                        <Button
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg rounded-xl font-semibold transition-all duration-300"
                                            disabled
                                        >
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Verify
                                        </Button>
                                    )}
                                    <Button
                                        variant="primary"
                                        className="rounded-full px-3 text-[11px] sm:px-4 sm:text-xs"
                                        onClick={() => handleViewDocuments(inspector)}
                                    >
                                        <Eye className="mr-2 h-5 w-5" />
                                        <span className="font-semibold">View</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Documents Preview Modal */}
            <DocumentsPreviewModal
                isOpen={isDocumentsModalOpen}
                onClose={() => {
                    setIsDocumentsModalOpen(false);
                    setSelectedInspector(null);
                }}
                documents={selectedInspectorDocuments}
                userId={selectedInspector?.id}
                documentStatus={selectedInspector?.documentStatus}
            />

        </div>
    );
};

export default InspectorListComponent;