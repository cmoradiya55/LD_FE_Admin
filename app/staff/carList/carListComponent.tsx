"use client";

import { useState, useMemo } from 'react';
import { LoadingSpinner, OverviewStatCard } from '@/components/common';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Car, CarFront, Clock3, CheckCircle2, Eye, MapPin, Fuel, Gauge, FileText, User, Calendar, GaugeCircle, Image as ImageIcon, AlertCircle, CheckCircle, Cog, ShipWheel, AirVent, Plug, SquareStack, RockingChair, Camera } from 'lucide-react';
import { CarData } from '@/lib/CarData';
import { Button } from '@/components/Button/Button';
import { getAllVehicles, getCarDetails } from '@/utils/axios/auth';
import { KilometerDriven, OwnerType, ExteriorFields, EngineAndTransmissionFields, SteeringSuspensionAndBrakesFields, AirConditioningFields, ElectricalFields, InteriorFields, SeatsFields } from '@/lib/data';
import StaffInspectionReport from '../../../components/InspectionReport/StaffInspectionReport';

export const getKilometerDrivenLabel = (value: KilometerDriven): string => {
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

export const getOwnerTypeLabel = (value: OwnerType): string => {
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
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: carsResponse, isLoading, isError } = useQuery({
        queryKey: ['GET_ALL_VEHICLES'],
        queryFn: async () => {
            const response = await getAllVehicles();
            if (response?.code === 200 && response?.data) {
                const cars: (CarData & { status?: number; registrationNumber?: string })[] = response.data.map((item: any) => {
                    return {
                        id: item.id?.toString() || '',
                        name: item.displayName ? (item.variantName ? `${item.displayName} ${item.variantName}` : item.displayName) : 'Unknown Car',
                        year: item.registrationYear || new Date().getFullYear(),
                        price: item.price > 0 ? `₹${item.price}` : '₹ 0 /-',
                        image: item.customerPhotos?.[0]?.url || '',
                        fuelType: item.fuelType || '',
                        transmission: item.transmissionType || '',
                        kmsDriven: item.kmDriven ? getKilometerDrivenLabel(item.kmDriven) : '0 km',
                        location: `${item.areaName || ''}, ${item.cityName || ''}`.trim(),
                        owner: item.ownerType ? getOwnerTypeLabel(item.ownerType) : '',
                        registrationYear: item.registrationYear?.toString() || new Date().getFullYear().toString(),
                        registrationNumber: item.registrationNumber || item.registration_number || '',
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

    // Fetch car details for staff inspection report (includes inspection data if available)
    const { data: carDetailsData, isLoading: isLoadingCarDetails } = useQuery({
        queryKey: ['GET_CAR_DETAILS', selectedCarId],
        queryFn: async () => {
            if (!selectedCarId) return null;
            const response = await getCarDetails(selectedCarId);
            if (response?.code === 200 && response?.data) {
                // Response is an array, get first item
                return Array.isArray(response.data) ? response.data[0] : response.data;
            }
            return null;
        },
        enabled: !!selectedCarId && isDialogOpen,
        retry: false,
        refetchOnWindowFocus: false,
    });

    // Create formValues from carDetailsData if it contains inspection data
    // Otherwise return empty values (inspection summary won't show)
    const formValues = useMemo(() => {
        // If carDetailsData has inspection images/data, use it
        // Otherwise return empty values
        if (!carDetailsData || !carDetailsData.inspectionImages) {
            return {
                registration_number: "",
                registartion_year: 0,
                km_driven: 0,
                rc_image: "",
                insurance_image: "",
            };
        }

        const allFields = [
            ...ExteriorFields,
            ...EngineAndTransmissionFields,
            ...SteeringSuspensionAndBrakesFields,
            ...AirConditioningFields,
            ...ElectricalFields,
            ...InteriorFields,
            ...SeatsFields,
        ];

        const values: Record<string, any> = {
            // Basic inspection info
            registration_number: carDetailsData?.registrationNumber || "",
            registartion_year: carDetailsData?.registrationYear || 0,
            km_driven: carDetailsData?.inspectedKmDriven || carDetailsData?.kmDriven || 0,
            rc_image: carDetailsData?.rc_image || "",
            insurance_image: carDetailsData?.insurance_image || "",
        };

        if (carDetailsData.inspectionImages && Array.isArray(carDetailsData.inspectionImages)) {
            carDetailsData.inspectionImages.forEach((imageData: any) => {
                const matchingField = allFields.find(
                    (field) => field.type === imageData.type && field.sub_type === imageData.sub_type
                );

                if (matchingField) {
                    const fieldValue: any = {
                        damage: imageData.is_damage ? "yes" : "no",
                        remarks: imageData.remarks || "",
                        image: imageData.image_url || "",
                        title: imageData.title || "",
                    };

                    // Handle tyre fields with tread_depth
                    if (matchingField.fieldType === "tyre" && imageData.tread_depth !== undefined) {
                        fieldValue.treadDepth = imageData.tread_depth.toString();
                    }

                    // Handle ORVM fields
                    if (matchingField.fieldType === "orvm") {
                        if (imageData.orvm_type) fieldValue.orvm_type = imageData.orvm_type;
                        if (imageData.folding_mirror_working !== undefined) {
                            fieldValue.folding_mirror_working = imageData.folding_mirror_working ? "yes" : "no";
                        }
                        if (imageData.mirror_adjust_motor !== undefined) {
                            fieldValue.mirror_adjust_motor = imageData.mirror_adjust_motor ? "yes" : "no";
                        }
                    }

                    // Handle electrical fields with is_power
                    if (matchingField.fieldType === "electrical" && imageData.is_power !== undefined) {
                        fieldValue.electrical_type = imageData.is_power ? "electric" : "manual";
                    }

                    values[matchingField.name] = fieldValue;
                }
            });
        }

        return values;
    }, [carDetailsData]);

    const allCars = carsResponse || [];
    const filteredCars = allCars;

    // Calculate stats
    const stats = {
        total: filteredCars.length,
        available: filteredCars.length,
        pending: Math.floor(filteredCars.length * 0.2),
        completed: Math.floor(filteredCars.length * 0.8),
    };

    const carsOverviewStats = [
        {
            label: "Total Cars",
            value: stats.total.toString(),
            icon: Car,
            background: "linear-gradient(135deg, #4b6bfb 0%, #3b82f6 100%)",
            accentCircleColor: "rgba(255,255,255,0.4)",
        },
        {
            label: "Available",
            value: stats.available.toString(),
            icon: CarFront,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            accentCircleColor: "rgba(255,255,255,0.35)",
        },
        {
            label: "Pending",
            value: stats.pending.toString(),
            icon: Clock3,
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            accentCircleColor: "rgba(255,255,255,0.35)",
        },
        {
            label: "Completed",
            value: stats.completed.toString(),
            icon: CheckCircle2,
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            accentCircleColor: "rgba(255,255,255,0.35)",
        },
    ];

    const handleInspectionReport = (carId: string) => {
        router.push(`/staff/staffInspection?carId=${carId}`);
    };

    const handleViewReport = (carId: string) => {
        setSelectedCarId(carId);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedCarId(null);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900">Car List</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Browse and manage all available cars</p>
                </div>
                {filteredCars.length > 0 && (
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{filteredCars.length}</span> cars
                    </p>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
                {carsOverviewStats.map((stat) => (
                    <OverviewStatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        background={stat.background}
                        accentCircleColor={stat.accentCircleColor}
                    />
                ))}
            </div>

            {/* Cars List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <CarFront className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load cars</h3>
                    <p className="text-sm text-gray-600 text-center max-w-sm">There was an error loading the car list. Please try again later.</p>
                </div>
            ) : filteredCars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <CarFront className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars available</h3>
                    <p className="text-sm text-gray-600 text-center max-w-sm">There are no cars in the list at the moment.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[2fr,1.5fr,1fr,auto] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/80 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        <span>Car</span>
                        <span>Location</span>
                        <span className="text-center">Action</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredCars.map((car) => (
                            <div
                                key={car.id}
                                className="px-4 sm:px-6 py-4 flex flex-col sm:grid sm:grid-cols-[2fr,1.5fr,1fr,auto] gap-3 sm:gap-4 hover:bg-blue-50/40 transition-colors"
                            >
                                {/* Car main info */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                        <CarFront className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {car.name}
                                        </p>
                                        <div className="mt-0.5 flex flex-col gap-0.5 text-xs text-gray-500">
                                            <p>
                                                Reg. No.: <span className="font-medium text-gray-700">{car.registrationNumber}</span>
                                            </p>
                                            <p>
                                                Reg. Year: <span className="font-medium text-gray-700">{car.registrationYear}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col justify-center gap-1 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                        <span className="truncate">{car.location || 'Location not available'}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center justify-start sm:justify-end">
                                    {car.status === 500 ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full sm:w-auto border-blue-300 text-blue-700 hover:bg-blue-50"
                                            onClick={() => handleViewReport(car.id)}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            View Report
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="w-full sm:w-auto"
                                            onClick={() => handleInspectionReport(car.id)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Inspection Report
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Inspection Report Dialog */}
            <StaffInspectionReport
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                isLoading={isLoadingCarDetails}
                inspectionData={carDetailsData}
                formValues={formValues}
                carDetailsData={carDetailsData}
            />

        </div>
    );
};

export default CarListComponent;

