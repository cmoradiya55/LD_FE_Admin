"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import CarCard from '@/components/car/CarCard';
import { Button } from '@/components/Button/Button';
import SelectInput from '@/components/FormComponent/SelectInput';
import { OwnerType, UsedCarListingStatus, ExteriorFields, EngineAndTransmissionFields, SteeringSuspensionAndBrakesFields, AirConditioningFields, ElectricalFields, InteriorFields, SeatsFields } from '@/lib/data';
import { CarData } from '@/lib/CarData';
import { FileText, Filter, MapPin, UserRound, Clock, CheckCircle2, BadgeCheck, XCircle, AlertCircle, Ban } from 'lucide-react';
import { getAllUsedCars, getInspectionCentersData, getUsedCarDetails } from '@/utils/axios/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/common';
import ViewAllInspectionReport from '@/components/InspectionReport/ViewAllInspectionReport';
import InspectionSummary from '@/components/InspectionReport/InspectionSummary';
import StaffInspectionReport from '@/components/InspectionReport/StaffInspectionReport';

type AdminCar = CarData & {
    status: UsedCarListingStatus;
    city: string;
    manager: string;
};

type ApiManager = {
    id: number;
    name: string;
    countryCode: number;
    mobileNumber: number;
    email: string | null;
    isActive: boolean;
    documentStatus: number;
    documentStatusName: string;
    remarks: string | null;
    selfieImage: string | null;
    aadharFrontImage: string | null;
    aadharBackImage: string | null;
    panImage: string | null;
    aadharNumber: string | null;
    panNumber: string | null;
    inspectorCount: number;
};

type ApiInspectionCenterData = {
    id: number;
    stateName: string;
    cityName: string;
    isActive: boolean;
    inspectionCentre: any | null;
    managers: ApiManager[];
};

const statusFilters = [
    { key: UsedCarListingStatus.PENDING, label: 'Inspection Pending' },
    { key: UsedCarListingStatus.INSPECTOR_ASSIGNED, label: 'Inspector Assigned' },
    { key: UsedCarListingStatus.INSPECTION_STARTED, label: 'Inspection Started' },
    { key: UsedCarListingStatus.INSPECTION_COMPLETED, label: 'Inspection Completed' },
    { key: UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF, label: 'Details Updated by Staff' },
    { key: UsedCarListingStatus.APPROVED_BY_MANAGER, label: 'Approved (Manager)' },
    { key: UsedCarListingStatus.APPROVED_BY_ADMIN, label: 'Approved (Admin)' },
    { key: UsedCarListingStatus.LISTED, label: 'Listed' },
    { key: UsedCarListingStatus.REJECTED_BY_ADMIN, label: 'Rejected (Admin)' },
];

const getOwnerTypeLabel = (value: OwnerType): string => {
    const ownerTypeMap: Record<OwnerType, string> = {
        [OwnerType.FIRST]: '1st Owner',
        [OwnerType.SECOND]: '2nd Owner',
        [OwnerType.THIRD]: '3rd Owner',
        [OwnerType.FOURTH]: '4th Owner',
    };
    return ownerTypeMap[value] || '';
};

const reportButtonLabels: Partial<Record<UsedCarListingStatus, string>> = {
    [UsedCarListingStatus.INSPECTION_COMPLETED]: 'Inspector Inspection Report',
    [UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF]: 'Staff Inspection Report',
    [UsedCarListingStatus.APPROVED_BY_MANAGER]: 'Approved by Manager Inspection Report',
    [UsedCarListingStatus.APPROVED_BY_ADMIN]: 'All Inspection Report',
    [UsedCarListingStatus.LISTED]: 'View Car Details',
    [UsedCarListingStatus.REJECTED_BY_ADMIN]: 'Rejected by Admin Inspection Report',
};

type FilterFormData = {
    city: string;
    manager: string;
};

const CarComponent = () => {
    const [statusFilter, setStatusFilter] = useState<UsedCarListingStatus | null>(null);
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
    const [selectedCarStatus, setSelectedCarStatus] = useState<UsedCarListingStatus | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { control, watch, setValue } = useForm<FilterFormData>({
        defaultValues: {
            city: 'All Cities',
            manager: 'All Managers',
        },
    });

    const selectedCity = watch('city');
    const selectedManager = watch('manager');
    const hasCityFilter = selectedCity && selectedCity !== 'All Cities';
    const hasManagerFilter = selectedManager && selectedManager !== 'All Managers';

    const { data: inspectionCentersData } = useQuery<ApiInspectionCenterData[]>({
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
                return [];
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const cityToManagersMap = useMemo(() => {
        const map = new Map<string, Map<number, string>>();
        if (!inspectionCentersData?.length) return map;

        inspectionCentersData.forEach((center) => {
            if (center.cityName && center.isActive) {
                if (!map.has(center.cityName)) {
                    map.set(center.cityName, new Map());
                }
                const managersMap = map.get(center.cityName)!;
                center.managers?.forEach((manager) => {
                    if (manager.name && manager.isActive) {
                        managersMap.set(manager.id, manager.name);
                    }
                });
            }
        });
        return map;
    }, [inspectionCentersData]);

    const cityNameToIdMap = useMemo(() => {
        const map = new Map<string, number>();
        if (!inspectionCentersData?.length) return map;

        inspectionCentersData.forEach((center) => {
            if (center.cityName && center.id && center.isActive) {
                map.set(center.cityName, center.id);
            }
        });
        return map;
    }, [inspectionCentersData]);

    const managerNameToIdMap = useMemo(() => {
        const map = new Map<string, number>();
        if (!inspectionCentersData?.length) return map;

        inspectionCentersData.forEach((center) => {
            center.managers?.forEach((manager) => {
                if (manager.name && manager.id && manager.isActive) {
                    map.set(manager.name, manager.id);
                }
            });
        });
        return map;
    }, [inspectionCentersData]);

    const cityOptions = useMemo(() => {
        const cities = new Set<string>();
        if (inspectionCentersData?.length) {
            inspectionCentersData.forEach((center) => {
                if (center.cityName && center.isActive) cities.add(center.cityName);
            });
        }
        const cityArray = Array.from(cities).sort();
        return [
            { value: 'All Cities', label: 'All Cities' },
            ...cityArray.map((city) => ({ value: city, label: city })),
        ];
    }, [inspectionCentersData]);

    const managerOptions = useMemo(() => {
        let managerArray: string[] = [];

        if (!hasCityFilter) {
            const managerMap = new Map<number, string>();
            if (inspectionCentersData && Array.isArray(inspectionCentersData)) {
                inspectionCentersData.forEach((center) => {
                    if (center.managers && Array.isArray(center.managers)) {
                        center.managers.forEach((manager) => {
                            if (manager.name && manager.isActive) {
                                managerMap.set(manager.id, manager.name);
                            }
                        });
                    }
                });
            }
            managerArray = Array.from(managerMap.values()).sort();
        } else {
            const managersMap = cityToManagersMap.get(selectedCity);
            if (managersMap) {
                managerArray = Array.from(managersMap.values()).sort();
            }
        }

        return [
            { value: 'All Managers', label: 'All Managers' },
            ...managerArray.map((manager) => ({ value: manager, label: manager })),
        ];
    }, [selectedCity, inspectionCentersData, cityToManagersMap]);

    useEffect(() => {
        if (hasCityFilter) {
            const managersForCity = cityToManagersMap.get(selectedCity);
            if (managersForCity && hasManagerFilter) {
                const managerExists = Array.from(managersForCity.values()).includes(selectedManager);
                if (!managerExists) {
                    setValue('manager', 'All Managers');
                }
            }
        }
    }, [selectedCity, cityToManagersMap, selectedManager, setValue]);

    const cityId = useMemo(() => {
        if (hasCityFilter) {
            return cityNameToIdMap.get(selectedCity) || null;
        }
        return null;
    }, [hasCityFilter, selectedCity, cityNameToIdMap]);

    const managerId = useMemo(() => {
        if (hasManagerFilter) {
            if (hasCityFilter) {
                const managersMap = cityToManagersMap.get(selectedCity);
                if (managersMap) {
                    const entries = Array.from(managersMap.entries());
                    for (const [id, name] of entries) {
                        if (name === selectedManager) {
                            return id;
                        }
                    }
                }
            }
            return managerNameToIdMap.get(selectedManager) || null;
        }
        return null;
    }, [hasManagerFilter, hasCityFilter, selectedManager, selectedCity, cityToManagersMap, managerNameToIdMap]);

    const { data: carsResponse, isLoading, isError } = useQuery({
        queryKey: ['GET_ALL_USED_CARS_ADMIN', statusFilter, cityId, managerId],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (statusFilter != null) {
                queryParams.append('status', statusFilter.toString());
            }
            if (cityId != null) {
                queryParams.append('cityId', cityId.toString());
            }
            if (managerId != null) {
                queryParams.append('managerId', managerId.toString());
            }

            const filterQuery = queryParams.toString();
            const response = await getAllUsedCars(filterQuery || '', 1, 50);
            if (response?.code === 200 && response?.data) {
                const cars: AdminCar[] = response.data.map((item: any) => ({
                    id: item.id?.toString() || '',
                    name: item.displayName
                        ? (item.variant ? `${item.displayName} ${item.variant}` : item.displayName)
                        : 'Unknown Car',
                    year: new Date().getFullYear(),
                    image: item.imageUrl || '',
                    fuelType: item.fuelType || '',
                    transmission: item.transmissionType || '',
                    kmsDriven: item.kmDriven ? `${item.kmDriven.toLocaleString('en-IN')} km` : '0 km',
                    location: `${item.areaName || ''} ${item.cityName || ''}`.trim(),
                    owner: item.ownerType ? getOwnerTypeLabel(item.ownerType as OwnerType) : '',
                    badgeType: 'assured',
                    customerExpectedPrice:
                        item.customerExpectedPrice != null
                            ? `₹${item.customerExpectedPrice.toLocaleString('en-IN')}`
                            : undefined,
                    linkDrivePrice:
                        item.finalPrice != null
                            ? `₹${item.finalPrice.toLocaleString('en-IN')}`
                            : undefined,
                    managerSuggestedPrice:
                        item.managerSuggestedPrice != null
                            ? `₹${item.managerSuggestedPrice.toLocaleString('en-IN')}`
                            : undefined,
                    status: item.status,
                    city: item.cityName || '',
                    manager: item.managerName || '',
                }));

                return { cars };
            }
            return { cars: [] };
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const filteredCars = useMemo(() => carsResponse?.cars || [], [carsResponse]);

    const { data: carDetailsData, isLoading: isLoadingCarDetails, refetch: refetchCarDetails } = useQuery({
        queryKey: ['GET_USED_CAR_DETAILS', selectedCarId],
        queryFn: async () => {
            if (!selectedCarId) return null;
            const response = await getUsedCarDetails(selectedCarId);
            console.log("carDetailsDataaaa", response);
            if (response?.code === 200 && response?.data) {
                return response.data;
            }
            return null;
        },
        enabled: !!selectedCarId && isModalOpen,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const formValues = useMemo(() => {
        if (!carDetailsData) return {};

        const allFields = [
            ...ExteriorFields,
            ...EngineAndTransmissionFields,
            ...SteeringSuspensionAndBrakesFields,
            ...AirConditioningFields,
            ...ElectricalFields,
            ...InteriorFields,
            ...SeatsFields,
        ];

        // Handle both nested and flat data structures
        const carInfo = carDetailsData.car || carDetailsData;
        const inspectionInfo = carDetailsData.inspection || carDetailsData;

        const values: Record<string, any> = {
            brand: carDetailsData.brand || carInfo.brand || "",
            model: carDetailsData.model || carInfo.model || "",
            variant: carDetailsData.variant || carInfo.variant || "",
            registration_number: carDetailsData.registrationNumber || carInfo.registrationNumber || carInfo.registration_number || "",
            registartion_year: carDetailsData.registrationYear || carInfo.registrationYear || carInfo.registartion_year || carInfo.registration_year || 0,
            km_driven: carDetailsData.kmDriven || inspectionInfo.kmDriven || carDetailsData.km_driven || inspectionInfo.km_driven || 0,
            owner: carDetailsData.owner || carInfo.owner || "",
            fuel_type: carDetailsData.fuelTypeLabel || carInfo.fuelTypeLabel || "",
            transmission_type: carDetailsData.transmissionTypeLabel || carInfo.transmissionTypeLabel || "",
            rc_image: carDetailsData.rcImage || carDetailsData.rc_image || carInfo.rcImage || carInfo.rc_image || "",
            insurance_image: carDetailsData.insuranceImage || carDetailsData.insurance_image || carInfo.insuranceImage || carInfo.insurance_image || "",
        };

        // Handle inspection images from different possible locations
        const inspectionImages = carDetailsData.inspectionImages ||
            carDetailsData.inspection_images ||
            inspectionInfo.inspectionImages ||
            inspectionInfo.inspection_images ||
            [];

        if (Array.isArray(inspectionImages) && inspectionImages.length > 0) {
            inspectionImages.forEach((imageData: any) => {
                const matchingField = allFields.find(
                    (field) => field.type === imageData.type && field.sub_type === (imageData.subType ?? imageData.sub_type)
                );

                if (matchingField) {
                    // Handle isDamage as both boolean and string
                    const isDamage = imageData.isDamage !== undefined ? imageData.isDamage :
                        (imageData.is_damage !== undefined ? imageData.is_damage : false);
                    const damageValue = typeof isDamage === "boolean"
                        ? (isDamage ? "yes" : "no")
                        : (isDamage === "yes" || isDamage === "no" ? isDamage : "no");

                    const fieldValue: any = {
                        damage: damageValue,
                        remarks: imageData.remarks || "",
                        image: imageData.imageUrl || imageData.image_url || "",
                        title: imageData.title || "",
                    };

                    if (matchingField.fieldType === "tyre" && imageData.treadDepth !== undefined) {
                        fieldValue.treadDepth = imageData.treadDepth.toString();
                    }
                    if (matchingField.fieldType === "orvm") {
                        if (imageData.orvmType) fieldValue.orvm_type = imageData.orvmType;
                        if (imageData.foldingMirrorWorking !== undefined) {
                            fieldValue.folding_mirror_working = imageData.foldingMirrorWorking ? "yes" : "no";
                        }
                        if (imageData.mirrorAdjustMotor !== undefined) {
                            fieldValue.mirror_adjust_motor = imageData.mirrorAdjustMotor ? "yes" : "no";
                        }
                    }
                    if (matchingField.fieldType === "electrical" && imageData.isPower !== undefined) {
                        fieldValue.electrical_type = imageData.isPower ? "electric" : "manual";
                    }

                    values[matchingField.name] = fieldValue;
                }
            });
        }

        return values;
    }, [carDetailsData]);

    // Transform car details data to formValues for StaffInspectionReport
    const staffFormValues = useMemo(() => {
        if (!carDetailsData) return {};

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
            registration_number: carDetailsData.car?.registrationNumber || carDetailsData.registrationNumber || "",
            registartion_year: carDetailsData.car?.registrationYear || carDetailsData.registrationYear || 0,
            km_driven: carDetailsData.inspection?.kmDriven || carDetailsData.kmDriven || 0,
            rc_image: carDetailsData.rc_image || carDetailsData.rcImage || "",
            insurance_image: carDetailsData.insurance_image || carDetailsData.insuranceImage || "",
        };

        allFields.forEach((field) => {
            values[field.name] = {
                damage: "",
                remarks: "",
                image: "",
            };
        });

        if (carDetailsData.inspectionImages && Array.isArray(carDetailsData.inspectionImages)) {
            carDetailsData.inspectionImages.forEach((imageData: any) => {
                const matchingField = allFields.find(
                    (field) => field.type === imageData.type && field.sub_type === (imageData.subType ?? imageData.sub_type)
                );

                if (matchingField) {
                    const fieldValue: any = {
                        damage: imageData.isDamage ? "yes" : "no",
                        remarks: imageData.remarks || "",
                        image: imageData.imageUrl || "",
                    };

                    if (matchingField.fieldType === "tyre" && imageData.treadDepth !== undefined) {
                        fieldValue.treadDepth = imageData.treadDepth.toString();
                    }
                    if (matchingField.fieldType === "orvm") {
                        if (imageData.orvmType) fieldValue.orvm_type = imageData.orvmType;
                        if (imageData.foldingMirrorWorking !== undefined) {
                            fieldValue.folding_mirror_working = imageData.foldingMirrorWorking ? "yes" : "no";
                        }
                        if (imageData.mirrorAdjustMotor !== undefined) {
                            fieldValue.mirror_adjust_motor = imageData.mirrorAdjustMotor ? "yes" : "no";
                        }
                    }
                    if (matchingField.fieldType === "electrical" && imageData.isPower !== undefined) {
                        fieldValue.electrical_type = imageData.isPower ? "electric" : "manual";
                    }

                    values[matchingField.name] = fieldValue;
                }
            });
        }

        return values;
    }, [carDetailsData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-gray-600">Loading cars...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-12 text-center bg-white/80 backdrop-blur-sm border-2 border-dashed border-red-300 rounded-2xl">
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Error loading cars</h3>
                    <p className="text-sm text-slate-500">There was an error fetching the cars. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                        <Filter className="h-4 w-4" />
                    </div>
                    Quick Filters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <SelectInput
                        name="city"
                        control={control}
                        label=""
                        options={cityOptions}
                        placeholder="Select City"
                        hideLabel
                        icon={<MapPin className="h-4 w-4 text-gray-500" />}
                        inputClassName="px-3 py-2"
                        className="bg-gray-50 border border-gray-200 rounded-lg"
                    />
                    <SelectInput
                        name="manager"
                        control={control}
                        label=""
                        options={managerOptions}
                        placeholder="Select Manager"
                        hideLabel
                        icon={<UserRound className="h-4 w-4 text-gray-500" />}
                        inputClassName="px-3 py-2"
                        className="bg-gray-50 border border-gray-200 rounded-lg"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setStatusFilter(null)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${statusFilter === null ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                    >
                        All Cars
                    </button>
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setStatusFilter(filter.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${statusFilter === filter.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Car Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.map((car) => (
                    <div key={car.id} className="relative mb-2">
                        <div className='border border-gray-200 rounded-xl'>
                            <CarCard
                                car={car}
                                showFavorite={false}
                                showStatusBadge
                                status={car.status}
                            />
                        </div>
                        {reportButtonLabels[car.status] && (
                            <div className='mt-2'>
                                <Button
                                    variant="primary"
                                    className="text-[11px] px-3 py-1 w-full"
                                    onClick={() => {
                                        setSelectedCarId(car.id);
                                        setSelectedCarStatus(car.status);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    {reportButtonLabels[car.status]}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                {filteredCars.length === 0 && (
                    <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-600">
                        No cars match the selected filters.
                    </div>
                )}
            </div>

            {/* Inspection Report Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) {
                    setSelectedCarId(null);
                    setSelectedCarStatus(null);
                }
            }}>
                <DialogContent className="max-w-[98vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6 scrollbar-thin">
                    <DialogHeader className="mb-4">
                        <DialogTitle>Inspection Report</DialogTitle>
                    </DialogHeader>
                    {(() => {
                        // Status 400: INSPECTION_COMPLETED -> Show InspectionSummary
                        if (selectedCarStatus === UsedCarListingStatus.INSPECTION_COMPLETED) {
                            if (isLoadingCarDetails) {
                                return (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <LoadingSpinner />
                                            <p className="text-slate-600">Loading inspection details...</p>
                                        </div>
                                    </div>
                                );
                            }
                            if (carDetailsData) {
                                return (
                                    <InspectionSummary
                                        formValues={formValues}
                                        allFields={{
                                            exterior: ExteriorFields,
                                            engine: EngineAndTransmissionFields,
                                            mechanical: SteeringSuspensionAndBrakesFields,
                                            ac: AirConditioningFields,
                                            electrical: ElectricalFields,
                                            interior: InteriorFields,
                                            seats: SeatsFields,
                                        }}
                                    />
                                );
                            }
                            return (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-red-600">Failed to load inspection details</p>
                                    </div>
                                </div>
                            );
                        }

                        // Status 500: DETAILS_UPDATED_BY_STAFF -> Show StaffInspectionReport and InspectionSummary
                        if (selectedCarStatus === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF) {
                            if (isLoadingCarDetails) {
                                return (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <LoadingSpinner />
                                            <p className="text-slate-600">Loading inspection report...</p>
                                        </div>
                                    </div>
                                );
                            }
                            if (carDetailsData) {
                                return (
                                    <div className="space-y-6">
                                        {/* Inspection Summary */}
                                        <InspectionSummary
                                            formValues={formValues}
                                            allFields={{
                                                exterior: ExteriorFields,
                                                engine: EngineAndTransmissionFields,
                                                mechanical: SteeringSuspensionAndBrakesFields,
                                                ac: AirConditioningFields,
                                                electrical: ElectricalFields,
                                                interior: InteriorFields,
                                                seats: SeatsFields,
                                            }}
                                        />
                                        {/* Staff Inspection Report */}
                                        <StaffInspectionReport
                                            isLoading={isLoadingCarDetails}
                                            inspectionData={carDetailsData}
                                            formValues={staffFormValues}
                                            carDetailsData={carDetailsData}
                                            renderWithoutDialog={true}
                                            hideVehicleDetails={true}
                                        />
                                    </div>
                                );
                            }
                            return (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-red-600">Failed to load inspection report</p>
                                    </div>
                                </div>
                            );
                        }

                        // Status 600 or 700: APPROVED_BY_MANAGER or APPROVED_BY_ADMIN -> Show ViewAllInspectionReport
                        if (selectedCarStatus === UsedCarListingStatus.APPROVED_BY_MANAGER ||
                            selectedCarStatus === UsedCarListingStatus.APPROVED_BY_ADMIN ||
                            selectedCarStatus === UsedCarListingStatus.REJECTED_BY_ADMIN ||
                            selectedCarStatus === UsedCarListingStatus.LISTED) {
                            if (isLoadingCarDetails) {
                                return (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <LoadingSpinner />
                                            <p className="text-slate-600">Loading car details...</p>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <ViewAllInspectionReport
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    carId={selectedCarId}
                                    carDetailsData={carDetailsData}
                                />
                            );
                        }

                        // Default loading state
                        return (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center gap-4">
                                    <LoadingSpinner />
                                    <p className="text-slate-600">Loading...</p>
                                </div>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CarComponent;