"use client";
import { OverviewStatCard, PageHeader, LoadingSpinner } from '@/components/common';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Car, CarFront, Clock3, CheckCircle2, UserCheck, UserRound, Filter, FileText } from 'lucide-react';
import { CarData } from '@/lib/CarData';
import CarCard from '@/components/car/CarCard';
import { getInspectors, assignToInspectorOrSelf, getCarListForManager } from '@/utils/axios/auth';
import { Button } from '@/components/Button/Button';
import { toast } from 'sonner';
import { KilometerDriven, OwnerType, UsedCarListingStatus } from "@/lib/data";
import { useRouter } from "next/navigation";
import AssignInspectorDialog from '@/app/manager/component/AssignInspectorDialog';
import InspectionReportDialog from '@/components/InspectionReport/ViewAllInspectionReport';

const carsOverviewCardConfig = [
    { label: "Total Cars", icon: Car, background: "linear-gradient(135deg, #4b6bfb 0%, #3b82f6 100%)", accentCircleColor: "rgba(255,255,255,0.4)" },
    { label: "Pending Inspection", icon: Clock3, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", accentCircleColor: "rgba(255,255,255,0.35)" },
    { label: "Inspection Complete", icon: CheckCircle2, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", accentCircleColor: "rgba(255,255,255,0.35)" },
    { label: "Assigned Cars", icon: CarFront, background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", accentCircleColor: "rgba(255,255,255,0.35)" },
];

const PAGE_SIZE = 6;

const getKilometerDrivenLabel = (value: KilometerDriven): string => {
    const kmDrivenMap: Record<KilometerDriven, string> = {
        [KilometerDriven.ZERO_TO_10K]: '0-10K km',
        [KilometerDriven.TEN_TO_20K]: '10K-20K km',
        [KilometerDriven.TWENTY_TO_30K]: '20K-30K km',
        [KilometerDriven.THIRTY_TO_40K]: '30K-40K km',
        [KilometerDriven.FORTY_TO_50K]: '40K-50K km',
        [KilometerDriven.FIFTY_TO_60K]: '50K-60K km',
        [KilometerDriven.SIXTY_TO_70K]: '60K-70K km',
        [KilometerDriven.SEVENTY_TO_80K]: '70K-80K km',
        [KilometerDriven.EIGHTY_TO_90K]: '80K-90K km',
        [KilometerDriven.NINTY_TO_1LAKH]: '90K-1L km',
        [KilometerDriven.ONE_LAKH_TO_1_2_LAKH]: '1L-1.2L km',
        [KilometerDriven.ONE_2_LAKH_TO_1_5_LAKH]: '1.2L-1.5L km',
        [KilometerDriven.ONE_5_LAKH_PLUS]: '1.5L+ km',
    };
    return kmDrivenMap[value] || '0 km';
};

const getOwnerTypeLabel = (value: OwnerType): string => {
    const ownerTypeMap: Record<OwnerType, string> = {
        [OwnerType.FIRST]: 'First Owner',
        [OwnerType.SECOND]: 'Second Owner',
        [OwnerType.THIRD]: 'Third Owner',
        [OwnerType.FOURTH]: 'Fourth Owner',
    };
    return ownerTypeMap[value] || '';
};

export type Inspector = {
    id: number;
    managerId: number;
    name: string;
    phone: string;
    imageUrl?: string;
    isActive: boolean;
    documentStatus?: number;
    documentStatusName?: string;
};

type FilterType = 'all' | 'assigned' | 'notAssigned' | 'inspectionPending' | 'inspectionCompleted' | 'detailsUpdated' | 'approvedByManager' | 'approvedByAdmin';

const CarListComponent = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [allCars, setAllCars] = useState<(CarData & { inspectorId?: number; status?: number; inspector?: { id: number; name: string; mobileNumber: string; role: number; roleLabel: string } | null })[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
    const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    const { data: carsResponse, isLoading, isError, refetch: refetchCars } = useQuery({
        queryKey: ['GET_MANAGER_USED_CAR_LIST', currentPage],
        queryFn: async () => {
            const response = await getCarListForManager(currentPage, PAGE_SIZE);
            if (response?.code === 200 && response?.data) {
                const cars: (CarData & { inspectorId?: number; status?: number; inspector?: { id: number; name: string; mobileNumber: string; role: number; roleLabel: string } | null })[] = response.data.map((item: any) => ({
                    id: item.id?.toString() || '',
                    name: item.displayName ? (item.variantName ? `${item.displayName} ${item.variantName}` : item.displayName) : 'Unknown Car',
                    year: item.registrationYear || new Date().getFullYear(),
                    price: item.price > 0 ? `₹${(item.price / 100000).toFixed(2)} Lakh` : '₹ 0',
                    image: item.customerPhotos?.[0]?.url || '',
                    fuelType: item.fuelType || '',
                    transmission: item.transmissionType || '',
                    kmsDriven: item.kmDriven ? getKilometerDrivenLabel(item.kmDriven) : '0 km',
                    location: `${item.areaName || ''} ${item.cityName || ''}`.trim(),
                    owner: item.ownerType ? getOwnerTypeLabel(item.ownerType) : '',
                    badgeType: (item.status === 100 || item.inspector) ? 'assured' : 'private',
                    inspectorId: item.inspector?.id,
                    status: item.status,
                    inspector: item.inspector || null,
                    customerExpectedPrice: item.customerExpectedPrice > 0 ? `₹${item.customerExpectedPrice}` : "₹ 0 /-",
                    linkDrivePrice: item.linkDrivePrice > 0 ? `₹${item.linkDrivePrice}` : "₹ 0 /-",
                    managerSuggestedPrice: item.managerSuggestedPrice > 0 ? `₹${item.managerSuggestedPrice.toLocaleString('en-IN')}` : undefined,
                }));

                const meta = response.meta || {};
                const total = meta.total || response.data.length;
                const totalPages = meta.totalPages || Math.ceil(total / PAGE_SIZE);

                return { cars, total, hasMore: currentPage < totalPages };
            }
            return { cars: [], total: 0, hasMore: false };
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const { data: inspectorsResponse, isLoading: isLoadingInspectors, isError: isInspectorsError, refetch: refetchInspectors } = useQuery({
        queryKey: ['GET_INSPECTORS'],
        queryFn: async () => {
            const response = await getInspectors();
            if (response?.code === 200 && response?.data) {
                return response.data.map((item: any) => ({
                    id: item.id,
                    managerId: item.managerId,
                    name: item.name || '',
                    phone: item.countryCode && item.mobileNo ? `+${item.countryCode} ${item.mobileNo}` : item.mobileNo || '',
                    isActive: item.isActive,
                    imageUrl: item.selfieImage || undefined,
                    documentStatus: item.documentStatus,
                    documentStatusName: item.documentStatusName || 'Pending Verification',
                }));
            }
            return [];
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const managerId = useMemo(() => {
        if (inspectorsResponse && inspectorsResponse.length > 0) {
            return inspectorsResponse[0]?.managerId;
        }
        return null;
    }, [inspectorsResponse]);

    const activeInspectors = useMemo(() =>
        (inspectorsResponse || []).filter((i: Inspector) => i.isActive && (i.documentStatus === 3 || i.documentStatusName === 'Verified')), [inspectorsResponse]
    );


    useEffect(() => {
        if (!carsResponse) return;
        setAllCars(prev => currentPage === 1 ? carsResponse.cars : [...prev, ...carsResponse.cars]);
        setHasMore(carsResponse.hasMore);
        setIsLoadingMore(false);
    }, [carsResponse, currentPage]);

    const filteredCars = useMemo(() => {
        if (activeFilter === 'all') return allCars;

        return allCars.filter((car: any) => {
            const status = car.status;

            switch (activeFilter) {
                case 'assigned':
                    return status === UsedCarListingStatus.INSPECTOR_ASSIGNED || car.inspectorId; //200
                case 'notAssigned':
                    return status === UsedCarListingStatus.PENDING && !car.inspectorId; //100
                case 'inspectionPending':
                    return (status === UsedCarListingStatus.INSPECTOR_ASSIGNED ||
                        status === UsedCarListingStatus.INSPECTION_STARTED) &&
                        status !== UsedCarListingStatus.INSPECTION_COMPLETED; //300
                case 'inspectionCompleted':
                    return status === UsedCarListingStatus.INSPECTION_COMPLETED; //400
                case 'detailsUpdated':
                    return status === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF; //500
                case 'approvedByManager':
                    return status === UsedCarListingStatus.APPROVED_BY_MANAGER; //600
                case 'approvedByAdmin':
                    return status === UsedCarListingStatus.APPROVED_BY_ADMIN; //700 
                default:
                    return true;
            }
        });
    }, [allCars, activeFilter]);

    const carsOverviewStats = useMemo(() => {
        const totalCars = allCars.length || (carsResponse?.total || 0);
        const valuesMap: Record<string, string> = {
            "Total Cars": totalCars.toString(),
            "Pending Inspection": Math.floor(totalCars * 0.3).toString(),
            "Inspection Complete": Math.floor(totalCars * 0.5).toString(),
            "Assigned Cars": Math.floor(totalCars * 0.2).toString(),
        };
        return carsOverviewCardConfig.map((card) => ({ ...card, value: valuesMap[card.label] ?? "0" }));
    }, [allCars, carsResponse]);

    useEffect(() => {
        if (!hasMore || isLoading || isLoadingMore) return;

        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting || isLoadingMore) return;
                setIsLoadingMore(true);
                setCurrentPage(prev => prev + 1);
            },
            { root: null, rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, isLoading, isLoadingMore]);

    const handleAssignClick = (car: CarData) => {
        setSelectedCar(car);
        setSelectedInspector(null);
        setIsAssignDialogOpen(true);
    };

    const handleInspectorSelect = (inspector: Inspector) => {
        setSelectedInspector(inspector);
    };

    const handleCloseDialog = () => {
        setIsAssignDialogOpen(false);
        setSelectedCar(null);
        setSelectedInspector(null);
    };

    const handleAssignInspection = async () => {
        if (!selectedCar || !selectedInspector) return;

        const payload = {
            inspectorId: selectedInspector.id,
            usedCarId: parseInt(selectedCar.id)
        };

        try {
            const response = await assignToInspectorOrSelf(payload);
            if (response?.code === 200) {
                handleCloseDialog();
                toast.success('Inspector assigned successfully');
                refetchCars();
            } else {
                console.error('Failed to assign inspector:', response);
                toast.error(response?.message || 'Failed to assign inspector');
            }
        } catch (error) {
            console.error('Error assigning inspector:', error);
            toast.error('An error occurred while assigning inspector');
        }
    };

    const handleAssignToSelf = async (car: CarData) => {
        if (!managerId) {
            toast.error('Manager ID not available. Please wait for inspectors to load.');
            return;
        }

        try {
            const payload = {
                managerId: parseInt(managerId.toString()),
                usedCarId: parseInt(car.id)
            };

            const response = await assignToInspectorOrSelf(payload);
            if (response?.code === 200) {
                toast.success('Car assigned to self successfully');
                refetchCars();
                refetchInspectors();
            } else {
                console.error('Failed to assign to self:', response);
                toast.error(response?.message || 'Failed to assign to self');
            }
        } catch (error) {
            console.error('Error assigning to self:', error);
            toast.error('An error occurred while assigning to self');
        }
    };

    if (isLoading && currentPage === 1) {
        return (
            <div>
                <PageHeader title="Car List" description="View and manage all cars in your inspection center" />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <LoadingSpinner size="lg" />
                        <p className="text-slate-600">Loading cars...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <PageHeader title="Car List" description="View and manage all cars in your inspection center" />
                <div className="mt-6 p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-dashed border-red-300 rounded-2xl">
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-gradient-to-br from-red-100 to-red-200 p-4 mb-4">
                            <Car className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Error loading cars</h3>
                        <p className="text-sm text-slate-500">There was an error fetching the cars. Please try again later.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <PageHeader
                title="Car List"
                description="View and manage all cars in your inspection center"
            />

            {/* Cars Overview Stats */}
            <div className="mt-4 mb-4 grid grid-cols-2 gap-2">
                {carsOverviewStats.map((card) => <OverviewStatCard key={card.label} {...card} />)}
            </div>

            {/* Filter */}
            <div className="mt-4 mb-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Filter className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Filter Cars</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { key: 'all' as FilterType, label: 'All Cars' },
                        { key: 'assigned' as FilterType, label: 'Assigned' },
                        { key: 'notAssigned' as FilterType, label: 'Not Assigned' },
                        { key: 'inspectionPending' as FilterType, label: 'Inspection Pending' },
                        { key: 'inspectionCompleted' as FilterType, label: 'Inspection Completed' },
                        { key: 'detailsUpdated' as FilterType, label: 'Details Updated by Staff' },
                        { key: 'approvedByManager' as FilterType, label: 'Approved (Manager)' },
                        { key: 'approvedByAdmin' as FilterType, label: 'Approved (Admin)' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`px-1 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all duration-200 text-center shadow-md ${activeFilter === filter.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-50 text-gray-700 border border-gray-200'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cars List */}
            <div className="mt-6 mb-8">
                {filteredCars.length === 0 ? (
                    <div className="p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl">
                        <div className="flex flex-col items-center">
                            <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-4 mb-4">
                                <Car className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No cars found</h3>
                            <p className="text-sm text-slate-500">No cars are available at the moment.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {filteredCars.map((car) => {
                                const status = car.status;
                                const statusBadgeText =
                                    status === UsedCarListingStatus.APPROVED_BY_ADMIN
                                        ? "Approved by Admin"
                                        : status === UsedCarListingStatus.APPROVED_BY_MANAGER
                                            ? "Approved by Manager"
                                            : status === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF
                                                ? "Details Updated by Staff"
                                                : status === UsedCarListingStatus.INSPECTION_COMPLETED
                                        ? "Inspection Completed"
                                        : status === UsedCarListingStatus.INSPECTION_STARTED ||
                                            status === UsedCarListingStatus.INSPECTOR_ASSIGNED
                                            ? "Inspection Pending"
                                            : status === UsedCarListingStatus.PENDING && !car.inspectorId
                                                ? "Not Assigned"
                                                : "Assigned";

                                return (
                                    <div key={car.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                                        <CarCard
                                            car={car}
                                            showStatusBadge={true}
                                            status={car.status}
                                        />
                                        {(car as any).inspector && (
                                            <div className="px-4 pt-2 pb-2">
                                                <div className={`flex items-center gap-2 px-1.5 py-1 border rounded-lg ${car.status === UsedCarListingStatus.APPROVED_BY_ADMIN
                                                        ? 'bg-purple-50 border-purple-200'
                                                        : car.status === UsedCarListingStatus.APPROVED_BY_MANAGER
                                                            ? 'bg-indigo-50 border-indigo-200'
                                                            : car.status === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF
                                                                ? 'bg-amber-50 border-amber-200'
                                                                : car.status === UsedCarListingStatus.INSPECTION_COMPLETED
                                                    ? 'bg-emerald-50 border-emerald-200'
                                                    : 'bg-blue-50 border-blue-200'
                                                    }`}>
                                                    <UserCheck
                                                        className={`h-3 w-3 flex-shrink-0 ${car.status === UsedCarListingStatus.APPROVED_BY_ADMIN
                                                                ? 'text-purple-600'
                                                                : car.status === UsedCarListingStatus.APPROVED_BY_MANAGER
                                                                    ? 'text-indigo-600'
                                                                    : car.status === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF
                                                                        ? 'text-amber-600'
                                                                        : car.status === UsedCarListingStatus.INSPECTION_COMPLETED
                                                            ? 'text-emerald-600'
                                                            : 'text-blue-600'
                                                            }`}
                                                    />
                                                    <span className={`text-[11px] font-medium ${car.status === UsedCarListingStatus.APPROVED_BY_ADMIN
                                                            ? 'text-purple-700'
                                                            : car.status === UsedCarListingStatus.APPROVED_BY_MANAGER
                                                                ? 'text-indigo-700'
                                                                : car.status === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF
                                                                    ? 'text-amber-700'
                                                                    : car.status === UsedCarListingStatus.INSPECTION_COMPLETED
                                                        ? 'text-emerald-700'
                                                        : 'text-blue-700'
                                                        }`}>
                                                        {car.status === UsedCarListingStatus.APPROVED_BY_ADMIN ||
                                                            car.status === UsedCarListingStatus.APPROVED_BY_MANAGER ||
                                                            car.status === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF ||
                                                            car.status === UsedCarListingStatus.INSPECTION_COMPLETED
                                                            ? 'Inspection by: '
                                                            : 'Assigned to: '}
                                                        {(car as any).inspector.name}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Buttons based on status */}
                                        {car.status === UsedCarListingStatus.INSPECTOR_ASSIGNED && (car as any).inspector && (
                                            <div className="px-4 pb-4 flex gap-2">
                                                <Button
                                                    onClick={() => handleAssignClick(car)}
                                                    variant="primary"
                                                    className="flex-1 flex items-center justify-center gap-2 text-[11px]"
                                                >
                                                    <UserCheck className="h-3.5 w-3.5" />
                                                    Assign to Other
                                                </Button>
                                                <Button
                                                    onClick={() => handleAssignToSelf(car)}
                                                    variant="secondary"
                                                    className="flex-1 flex items-center justify-center gap-2 text-[11px]"
                                                >
                                                    <UserRound className="h-3.5 w-3.5" />
                                                    Assign to Self
                                                </Button>
                                            </div>
                                        )}

                                        {/* Assign Inspector and Assign to Self */}
                                        {car.status === UsedCarListingStatus.PENDING && !(car as any).inspector && (
                                            <div className="px-4 pb-4 flex gap-2">
                                                <Button
                                                    onClick={() => handleAssignClick(car)}
                                                    variant="primary"
                                                    className="flex-1 flex items-center justify-center gap-2 text-[11px]"
                                                >
                                                    <UserCheck className="h-3.5 w-3.5" />
                                                    Assign Inspector
                                                </Button>
                                                <Button
                                                    onClick={() => handleAssignToSelf(car)}
                                                    variant="secondary"
                                                    className="flex-1 flex items-center justify-center gap-2 text-[11px]"
                                                >
                                                    <UserRound className="h-3.5 w-3.5" />
                                                    Assign to Self
                                                </Button>
                                            </div>
                                        )}

                                        {/* View Inspection Report */}
                                        {car.status === UsedCarListingStatus.INSPECTION_COMPLETED && (
                                            <div className="px-4 pt-2 pb-4">
                                                <Button
                                                    onClick={() => setSelectedCarId(car.id)}
                                                    variant="primary"
                                                    className="w-full flex items-center justify-center gap-2 text-[11px]"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    View Inspection Report
                                                </Button>
                                            </div>
                                        )}

                                        {/* Approve Inspection Report */}
                                        {car.status === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF && (
                                            <div className="px-4 pt-2 pb-4">
                                                <Button
                                                    onClick={() => setSelectedCarId(car.id)}
                                                    variant="primary"
                                                    className="w-full flex items-center justify-center gap-2 text-[11px]"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    Approve Inspection Report
                                                </Button>
                                            </div>
                                        )}

                                        {/* View Approved Report */}
                                        {car.status === UsedCarListingStatus.APPROVED_BY_MANAGER && (
                                            <div className="px-4 pt-2 pb-4">
                                                <Button
                                                    onClick={() => setSelectedCarId(car.id)}
                                                    variant="primary"
                                                    className="w-full flex items-center justify-center gap-2 text-[11px] bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    View Approved Report
                                                </Button>
                                            </div>
                                        )}

                                        {/* View Final Report */}
                                        {car.status === UsedCarListingStatus.APPROVED_BY_ADMIN && (
                                            <div className="px-4 pt-2 pb-4">
                                                <Button
                                                    onClick={() => setSelectedCarId(car.id)}
                                                    variant="primary"
                                                    className="w-full flex items-center justify-center gap-2 text-[11px] bg-purple-600 hover:bg-purple-700"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    View Final Report
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {hasMore && (
                            <div ref={loadMoreRef} className="mt-4 h-8 flex items-center justify-center text-xs text-gray-500">
                                {isLoadingMore ? (
                                    <div className="flex items-center gap-2">
                                        <LoadingSpinner size="sm" />
                                        <span>Loading more cars…</span>
                                    </div>
                                ) : 'Scroll to load more cars'}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Assign Inspector Dialog */}
            <AssignInspectorDialog
                isOpen={isAssignDialogOpen}
                onClose={handleCloseDialog}
                selectedCar={selectedCar}
                selectedInspector={selectedInspector}
                onInspectorSelect={handleInspectorSelect}
                onAssign={handleAssignInspection}
                isLoadingInspectors={isLoadingInspectors}
                isInspectorsError={isInspectorsError}
                activeInspectors={activeInspectors}
            />

            {/* Inspection Report Dialog */}
            <InspectionReportDialog
                isOpen={!!selectedCarId}
                onClose={() => setSelectedCarId(null)}
                carId={selectedCarId}
            />
            
        </div>
    );
};

export default CarListComponent;
