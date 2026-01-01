"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Filter, Car, UserX, UserCheck, Users, CheckCircle2, Clock, ClipboardList } from "lucide-react";
import { OverviewStatCard, LoadingSpinner } from "@/components/common";
import CarCard from "@/components/car/CarCard";
import { CarData } from "@/app/admin/car/data";
import { getInspectorUsedCarList, startInspection } from "@/utils/axios/auth";
import { KilometerDriven, OwnerType, UsedCarListingStatus } from "@/lib/data";
import { Button } from "@/components/Button/Button";
import { toast } from "sonner";

type FilterType = "all" | "pending" | "completed";

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

const CarListComponent = () => {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [loadingCarId, setLoadingCarId] = useState<string | null>(null);


    const handleStartInspection = async (car: CarData & { vehicleId?: number }) => {
        // setLoadingCarId(car.id);
        // try {
        //     const vehicleId = car.vehicleId || parseInt(car.id, 10);
        //     const response = await startInspection({ vehicleId });
            
        //     if (response?.code === 200) {
                router.push(`/inspector/carInspection?carId=${car.id}`);
        //     } else {
        //         console.error("Failed to start inspection:", response?.message || "Unknown error");
        //         toast.error(response?.message || "Failed to start inspection");
        //     }
        // } catch (error) {
        //     console.error("Error starting inspection:", error);
        //     toast.error("An error occurred while starting inspection");
        // } finally {
        //     setLoadingCarId(null);
        // }
    };

    const { data: carsResponse, isLoading, isError } = useQuery({
        queryKey: ['GET_INSPECTOR_USED_CAR_LIST'],
        queryFn: async () => {
            const response = await getInspectorUsedCarList();
            if (response?.code === 200 && response?.data) {
                const cars: (CarData & { status?: number; vehicleId?: number })[] = response.data.map((item: any) => {
                    return {
                        id: item.id?.toString() || '',
                        vehicleId: item.id,
                        name: item.displayName ? (item.variantName ? `${item.displayName} ${item.variantName}` : item.displayName) : 'Unknown Car',
                        year: item.registrationYear || new Date().getFullYear(),
                        price: item.price > 0 ? `₹${item.price}` : '₹ 0 /-',
                        image: item.customerPhotos?.[0]?.url || '',
                        fuelType: item.fuelType || '',
                        transmission: item.transmissionType || '',
                        kmsDriven: item.kmDriven ? getKilometerDrivenLabel(item.kmDriven) : '0 km',
                        location: `${item.areaName || ''} ${item.cityName || ''}`.trim(),
                        owner: item.ownerType ? getOwnerTypeLabel(item.ownerType) : '',
                        registrationYear: item.registrationYear?.toString() || new Date().getFullYear().toString(),
                        badgeType: (item.status === 100 || item.inspector) ? 'assured' : 'private',
                        customerExpectedPrice: item.customerExpectedPrice > 0 ? `₹${item.customerExpectedPrice}` : "₹ 0 /-",
                        linkDrivePrice: item.linkDrivePrice > 0 ? `₹${item.linkDrivePrice}` : "₹ 0 /-",
                        status: item.status,
                    };
                });
                return cars;
            }
            return [];
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const cars = carsResponse || [];

    const filteredCars = useMemo(() => {
        if (activeFilter === "all") return cars;

        return cars.filter((car: any) => {
            const status = car.status;

            switch (activeFilter) {
                case "pending":
                    return (status === UsedCarListingStatus.INSPECTOR_ASSIGNED ||
                        status === UsedCarListingStatus.INSPECTION_STARTED) &&
                        status !== UsedCarListingStatus.INSPECTION_COMPLETED;
                case "completed":
                    return status === UsedCarListingStatus.INSPECTION_COMPLETED;
                default:
                    return true;
            }
        });
    }, [cars, activeFilter]);

    const stats = useMemo(() => {
        const pending = cars.filter((car: any) => {
            const status = car.status;
            return (status === UsedCarListingStatus.INSPECTOR_ASSIGNED ||
                status === UsedCarListingStatus.INSPECTION_STARTED) &&
                status !== UsedCarListingStatus.INSPECTION_COMPLETED;
        }).length;

        const completed = cars.filter((car: any) => {
            return car.status === UsedCarListingStatus.INSPECTION_COMPLETED;
        }).length;

        return {
            total: cars.length,
            pending,
            completed,
        };
    }, [cars]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-slate-600">Loading cars...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen">
                <div className="px-2 py-2">
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-red-200">
                        <Car className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-slate-700">Error loading cars</p>
                        <p className="text-slate-500 mt-1">Please try again later</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="px-2 py-2 space-y-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Car List</h1>
                    <p className="text-slate-600 mt-1">Manage and inspect assigned cars</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-3">
                    <OverviewStatCard
                        label="Total Cars"
                        value={stats.total}
                        icon={Users}
                        background="linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(37,99,235,1) 50%, rgba(29,78,216,1) 100%)"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <OverviewStatCard
                            label="Inspection Pending"
                            value={stats.pending}
                            icon={UserX}
                            background="linear-gradient(135deg, rgba(245,158,11,1) 0%, rgba(217,119,6,1) 50%, rgba(180,83,9,1) 100%)"
                        />
                        <OverviewStatCard
                            label="Inspection Completed"
                            value={stats.completed}
                            icon={UserCheck}
                            background="linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(22,163,74,1) 50%, rgba(21,128,61,1) 100%)"
                        />
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Filter className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">Filter Cars</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { key: "all" as FilterType, label: "All Cars" },
                            { key: "pending" as FilterType, label: "Inspection Pending" },
                            { key: "completed" as FilterType, label: "Inspection Completed" },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`px-1 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 text-center shadow-md ${activeFilter === filter.key
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-50 text-gray-700 border border-gray-200"
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Car List */}
                {filteredCars.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
                        <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-slate-700">No cars found</p>
                        <p className="text-slate-500 mt-1">Try adjusting your filter criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredCars.map((car) => {
                            const isCompleted = car.status === UsedCarListingStatus.INSPECTION_COMPLETED;
                            const isPending = car.status === UsedCarListingStatus.INSPECTOR_ASSIGNED ||
                                car.status === UsedCarListingStatus.INSPECTION_STARTED;

                            return (
                                <div key={car.id} className="group relative overflow-hidden bg-white border border-slate-200 shadow-sm transition-all duration-500 hover:scale-[1.02] rounded-xl">
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3 z-10">
                                        {isCompleted ? (
                                            <div className="flex items-center gap-1.5 bg-green-500 text-white px-2 py-1 rounded-full shadow-lg">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span className="text-[11px] font-semibold">Completed</span>
                                            </div>
                                        ) : isPending ? (
                                            <div className="flex items-center gap-1.5 bg-amber-500 text-white px-2 py-1 rounded-full shadow-lg">
                                                <Clock className="h-3 w-3" />
                                                <span className="text-[11px] font-semibold">Pending</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <CarCard
                                        car={car}
                                        showStatusBadge={false}
                                    />

                                    {isPending && (
                                        <div className="px-2 pb-2">
                                            <Button
                                                variant="primary"
                                                className="w-full text-[11px]"
                                                size="sm"
                                                onClick={() => handleStartInspection(car)}
                                                disabled={loadingCarId === car.id}
                                            >
                                                {loadingCarId === car.id ? (
                                                    <>
                                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Starting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ClipboardList className="h-3.5 w-3.5 mr-2" />
                                                        Start Inspection
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default CarListComponent;
