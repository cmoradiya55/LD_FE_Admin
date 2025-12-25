'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/Button/Button';
import TextInput from '@/components/FormComponent/TextInput';
import SelectInput from '@/components/FormComponent/SelectInput';
import MobileInput from '@/components/FormComponent/MobileInput';
import {
    Building2,
    MapPin,
    UserCircle2,
    Phone,
    Mail,
    Plus,
    X,
    Users,
    ArrowRight,
    Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getInspectionCentersData, putUpdateInspectionCenter, createUser, getCitySuggestions, getInspectorByManager } from '@/lib/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Manager = {
    id: number;
    name: string;
    phone: string;
    isPrimary?: boolean;
    inspectorCount?: number;
    imageUrl?: string;
};

type InspectionCenter = {
    id: number;
    city: string;
    isCityActive: boolean;
    centerName: string;
    addressLine?: string;
    landmark?: string;
    pincode?: string;
    pincodeId?: string;
    pincodeDisplay?: string;
    manager?: Manager | null;
    inspectionCentreId?: number | null;
};

type AddressFormValues = {
    addressLine: string;
    landmark: string;
    pincode: string;
};

type ManagerFormValues = {
    fullName: string;
    mobile: string;
};

// API Response Types
type ApiManager = {
    id: number;
    name: string;
    countryCode: number;
    mobileNumber: number;
    isActive: boolean;
};

type ApiInspectionCentre = {
    id: number;
    address: string;
    landmark: string;
    pincode: string;
    isActive: boolean;
};

type ApiInspectionCenterData = {
    id: number;
    stateName: string;
    cityName: string;
    isActive: boolean;
    inspectionCentre: ApiInspectionCentre | null;
    managers: ApiManager[];
};

type ApiResponse = {
    code: number;
    type: string;
    message: string;
    data: ApiInspectionCenterData[];
};


const useInspectionCentersData = () => {
    return useQuery<ApiInspectionCenterData[]>({
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
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

type PincodeOption = { value: string; label: string };

const useCitySuggestions = (query: string, cityId: number | null) => {
    return useQuery<PincodeOption[]>({
        queryKey: ['GET_CITY_SUGGESTIONS', cityId, query],
        enabled: !!cityId && !!query && query.trim().length >= 2,
        queryFn: async () => {
            const response = await getCitySuggestions({
                q: query,
                page: 1,
                limit: 20,
                cityId,
            });
            console.log('response', response);

            const mapped = response.data.map((item: any) => {
                return {
                    value: item.pincode_id,
                    label: item.formatted,
                };
            });

            return mapped as PincodeOption[];
        },
    });
};



const InspectionCenterComponent = () => {
    const router = useRouter();
    const { data: inspectionCentersData, isLoading, isError } = useInspectionCentersData();
    const { refetch: refetchInspectionCentersData } = useInspectionCentersData();

    // Transform API data to component format
    const transformedCenters: InspectionCenter[] = useMemo(() => {
        if (!inspectionCentersData || !Array.isArray(inspectionCentersData) || inspectionCentersData.length === 0) {
            return [];
        }

        return inspectionCentersData.map((item: ApiInspectionCenterData) => {
            const manager = item.managers && item.managers.length > 0
                ? {
                    id: item.managers[0].id,
                    name: item.managers[0].name,
                    phone: `+${item.managers[0].countryCode} ${item.managers[0].mobileNumber}`,
                    isPrimary: true,
                }
                : null;

            return {
                id: item.id,
                city: item.cityName,
                isCityActive: item.isActive,
                centerName: `${item.cityName} Inspection Center`,
                addressLine: item.inspectionCentre?.address || '',
                landmark: item.inspectionCentre?.landmark || '',
                pincode: item.inspectionCentre?.pincode || '',
                pincodeId: undefined,
                pincodeDisplay: item.inspectionCentre?.pincode || '',
                manager: manager,
                inspectionCentreId: item.inspectionCentre?.id || null,
            };
        });
    }, [inspectionCentersData]);

    const [centers, setCenters] = useState<InspectionCenter[]>([]);
    const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null);
    const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
    const [isEditingManager, setIsEditingManager] = useState(false);

    // Local state for pincode search input & dropdown visibility
    const [pincodeSearch, setPincodeSearch] = useState('');
    const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);

    // Update centers when API data changes - ensure city data from API is used
    useEffect(() => {
        if (transformedCenters.length > 0) {
            setCenters(transformedCenters);
            // Set selected center if not already set
            if (selectedCenterId === null && transformedCenters[0]?.id) {
                setSelectedCenterId(transformedCenters[0].id);
            }
        } else if (transformedCenters.length === 0 && !isLoading) {
            // Clear centers if API returns empty data
            setCenters([]);
            setSelectedCenterId(null);
        }
    }, [transformedCenters, selectedCenterId, isLoading]);


    const selectedCenter =
        centers.find((center) => center.id === selectedCenterId) ?? centers[0];

    const hasAddress =
        !!selectedCenter?.addressLine && selectedCenter.addressLine.trim().length > 0;
    const hasManager = !!selectedCenter?.manager;

    // Fetch inspectors for the selected manager
    const { data: inspectorsData } = useQuery({
        queryKey: ['GET_INSPECTORS_BY_MANAGER', selectedCenter?.manager?.id],
        queryFn: async () => {
            if (!selectedCenter?.manager?.id) return [];
            try {
                const response = await getInspectorByManager(String(selectedCenter.manager.id));
                if (response?.code === 200 && response?.data) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Error fetching inspectors:", error);
                toast.error("Error fetching inspectors");
                return [];
            }
        },
        enabled: !!selectedCenter?.manager?.id,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const inspectorCount = inspectorsData?.length ?? 0;

    const {
        control: addressControl,
        handleSubmit: handleAddressSubmit,
        reset: resetAddressForm,
        watch: watchAddressForm,
        formState: { errors: addressErrors },
    } = useForm<AddressFormValues>({
        defaultValues: {
            addressLine: '',
            landmark: '',
            pincode: '',
        },
    });

    const {
        data: pincodeOptions = [],
        isLoading: isPincodeLoading,
    } = useCitySuggestions(pincodeSearch, selectedCenterId);

    const {
        control: managerControl,
        handleSubmit: handleManagerSubmit,
        reset: resetManagerForm,
        formState: { errors: managerErrors },
    } = useForm<ManagerFormValues>({
        defaultValues: {
            fullName: '',
            mobile: '',
        },
    });

    const handleAddCity = () => {
        console.log('Add City clicked');
    };

    const handleAddAddress = () => {
        // Open in "create" mode with empty fields
        setIsEditingAddress(false);
        resetAddressForm({
            addressLine: '',
            landmark: '',
            pincode: '',
        });
        setPincodeSearch('');
        setShowPincodeSuggestions(false);
        setIsAddressModalOpen(true);
    };

    const onSubmitAddress = async (data: AddressFormValues) => {
        if (!selectedCenterId || !selectedCenter?.inspectionCentreId) {
            setIsAddressModalOpen(false);
            return;
        }

        const payload = {
            id: selectedCenter.inspectionCentreId,
            address: data.addressLine,
            landmark: data.landmark,
            cityId: selectedCenterId,
            pincodeId: parseInt(data.pincode, 10),
        };

        try {
            const response = await putUpdateInspectionCenter(payload);
            if (response?.code === 200) {
                await refetchInspectionCentersData();
                toast.success("Address updated successfully");
                setIsAddressModalOpen(false);
            }

        } catch (error) {
            console.error('Failed to update address:', error);
            toast.error("Failed to update address");
        }
    };

    const handleAddManager = () => {
        if (!selectedCenterId) {
            console.error('No inspection center selected');
            return;
        }

        setIsEditingManager(false);
        resetManagerForm({
            fullName: '',
            mobile: '',
        });
        setIsManagerModalOpen(true);
    };

    const onSubmitManager = async (data: ManagerFormValues) => {
        if (!selectedCenterId || !selectedCenter?.inspectionCentreId) {
            setIsManagerModalOpen(false);
            return;
        }

        const payload = {
            roleId: 2,
            name: data.fullName,
            countryCode: 91,
            mobileNo: Number(data.mobile),
            inspectionCentreId: selectedCenter.inspectionCentreId,
        };

        try {
            const response = await createUser(payload);
            console.log('Response:', response);

            if (response?.code === 200) {
                await refetchInspectionCentersData();
                toast.success("Manager created successfully");
            }

            setIsManagerModalOpen(false);
            setIsEditingManager(false);
            resetManagerForm({
                fullName: '',
                mobile: '',
            });
        } catch (error) {
            console.error('Failed to create user:', error);
            toast.error("Failed to create user");
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Network
                    </p>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        Inspection Centers
                    </h1>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        Manage city-wise inspection centers, their managers, and addresses
                        in one clean view.
                    </p>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
                {/* City List */}
                <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                    <div className="border-b bg-gray-50/80 px-4 py-3 sm:px-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600 sm:h-4 sm:w-4" />
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Cities
                                </p>
                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                    {centers.length} cities
                                </span>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                className="rounded-full px-3 text-[11px]"
                                onClick={handleAddCity}
                            >
                                <Plus className="mr-1.5 h-3 w-3" />
                                Add City
                            </Button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {isLoading && (
                            <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                                Loading inspection centers...
                            </div>
                        )}
                        {isError && (
                            <div className="px-4 py-8 text-center text-sm text-red-500 sm:px-5">
                                Error loading inspection centers. Please try again.
                            </div>
                        )}
                        {!isLoading && !isError && centers.map((center) => {
                            const isActive = center.id === selectedCenter?.id;
                            const hasCityManager = !!center.manager;

                            return (
                                <button
                                    key={center.id}
                                    type="button"
                                    onClick={() => { setSelectedCenterId(center.id); setSelectedCityName(center.city) }}
                                    className={`group flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors sm:px-5 sm:py-3.5 ${isActive
                                        ? 'bg-blue-50/80'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-gray-900 sm:text-sm">
                                            {center.city}
                                        </p>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-700'
                                                }`}
                                        >
                                            {hasCityManager ? '1 manager' : 'No manager'}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-[11px] text-gray-500">
                                        {center.centerName}
                                    </p>
                                </button>
                            );
                        })}

                        {!isLoading && !isError && centers.length === 0 && (
                            <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                                No cities configured yet. Use{' '}
                                <span className="font-semibold text-blue-600">Add City</span> to
                                create your first inspection center.
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="space-y-4 sm:space-y-5">
                    {/* Address Card */}
                    <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                        <div className="border-b bg-gray-50/80 px-4 py-3 sm:px-5">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Inspection Center Address
                                    </p>
                                    {selectedCenter && (
                                        <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-[10px] font-medium text-white">
                                            {selectedCenter.city}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasAddress ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full px-3 text-[11px]"
                                            onClick={() => {
                                                if (!selectedCenter) return;
                                                setIsEditingAddress(true);
                                                resetAddressForm({
                                                    addressLine: selectedCenter.addressLine || '',
                                                    landmark: selectedCenter.landmark || '',
                                                    pincode: selectedCenter.pincodeId || selectedCenter.pincode || '',
                                                });
                                                setPincodeSearch(
                                                    selectedCenter.pincodeDisplay ||
                                                    selectedCenter.pincode ||
                                                    '',
                                                );
                                                setShowPincodeSuggestions(false);
                                                setIsAddressModalOpen(true);
                                            }}
                                        >
                                            <MapPin className="mr-1.5 h-3 w-3" />
                                            Edit Address
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full px-3 text-[11px]"
                                            onClick={handleAddAddress}
                                        >
                                            <MapPin className="mr-1.5 h-3 w-3" />
                                            Add Address
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedCenter ? (
                            hasAddress ? (
                                <div className="space-y-2 px-4 py-4 sm:space-y-3 sm:px-5 sm:py-5">
                                    <p className="text-sm font-semibold text-gray-900 sm:text-base">
                                        {selectedCenter.centerName}
                                    </p>
                                    <div className="space-y-1.5 text-[11px] text-gray-600 sm:text-xs">
                                        <p>{selectedCenter.addressLine}</p>
                                        {selectedCenter.landmark && (
                                            <p className="text-gray-500">
                                                {selectedCenter.landmark}
                                            </p>
                                        )}
                                        {selectedCenter.pincode && (
                                            <p className="text-gray-500">
                                                <span className="font-medium">{selectedCenter.pincode}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="px-4 py-4 text-[11px] text-gray-500 sm:px-5 sm:py-4 sm:text-xs">
                                    <p className="mb-2">
                                        No address added for this city yet. Click{' '}
                                        <span className="font-semibold text-blue-600">
                                            Add Address
                                        </span>{' '}
                                        to create one.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="px-4 py-6 text-sm text-gray-500 sm:px-5">
                                Select a city from the left to view its inspection center
                                details.
                            </div>
                        )}
                    </div>

                    {/* Manager */}
                    <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                        <div className="border-b bg-gray-50/80 px-4 py-3 sm:px-5">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <UserCircle2 className="h-4 w-4 text-blue-600" />
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Manager
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasManager && selectedCenter?.manager ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full px-3 text-[11px]"
                                            onClick={() => {
                                                if (!selectedCenter?.manager) return;
                                                setIsEditingManager(true);
                                                resetManagerForm({
                                                    fullName: selectedCenter.manager.name || '',
                                                    mobile: selectedCenter.manager.phone || '',
                                                });
                                                setIsManagerModalOpen(true);
                                            }}
                                        >
                                            <UserCircle2 className="mr-1.5 h-3 w-3" />
                                            Edit Manager
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full px-3 text-[11px]"
                                            onClick={handleAddManager}
                                        >
                                            <UserCircle2 className="mr-1.5 h-3 w-3" />
                                            Add Manager
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedCenter && hasManager && selectedCenter.manager ? (
                            <div className="px-4 py-4 sm:px-5 sm:py-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 sm:items-center">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-10 sm:w-10 overflow-hidden">
                                            {selectedCenter.manager.imageUrl ? (
                                                <Image
                                                    src={selectedCenter.manager.imageUrl}
                                                    alt={selectedCenter.manager.name}
                                                    width={40}
                                                    height={40}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-semibold uppercase text-blue-700 sm:text-sm">
                                                    {selectedCenter.manager.name
                                                        ?.charAt(0)
                                                        .toUpperCase() ?? 'M'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-900 sm:text-sm">
                                                    {selectedCenter.manager.name}
                                                </p>
                                                {selectedCenter.manager.isPrimary && (
                                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 sm:text-xs">
                                                <span className="inline-flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                    <span>{selectedCenter.manager.phone}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inspector Team Section */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (selectedCenter?.manager) {
                                                router.push(
                                                    `/inspectionCenter/${selectedCenter.manager.id}`,
                                                );
                                            }
                                        }}
                                        className="group w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50/50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                                                    <Users className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-900">
                                                        Inspector Team
                                                    </p>
                                                    <p className="text-[11px] text-gray-500">
                                                        {inspectorCount}{' '}
                                                        inspector
                                                        {inspectorCount !== 1
                                                            ? 's'
                                                            : ''}{' '}
                                                        assigned
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-sm text-gray-500 sm:px-5">
                                No managers linked to this center yet. Use{' '}
                                <span className="font-semibold text-blue-600">Add Manager</span>{' '}
                                to assign one.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl border bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    {selectedCenter?.city || 'City'}
                                </p>
                                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                                    {isEditingAddress
                                        ? 'Edit Inspection Center Address'
                                        : 'Add Inspection Center Address'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200"
                                onClick={() => setIsAddressModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddressSubmit(onSubmitAddress)}
                            className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 sm:py-5"
                        >
                            <TextInput
                                name="addressLine"
                                control={addressControl}
                                label="Address"
                                placeholder="House / Flat, Street, Area"
                                required
                                error={addressErrors.addressLine}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <TextInput
                                name="landmark"
                                control={addressControl}
                                label="Landmark"
                                placeholder="Nearby known place (optional)"
                                error={addressErrors.landmark}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-blue-700">
                                    Pincode <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="pincode"
                                    control={addressControl}
                                    rules={{
                                        required: 'Pincode is required',
                                    }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={pincodeSearch}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setPincodeSearch(value);
                                                    setShowPincodeSuggestions(true);
                                                    // Clear selected value in form until user picks one
                                                    field.onChange('');
                                                }}
                                                onFocus={() => {
                                                    if (pincodeOptions.length > 0) {
                                                        setShowPincodeSuggestions(true);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    // Delay hiding suggestions to allow click events
                                                    setTimeout(
                                                        () => setShowPincodeSuggestions(false),
                                                        200,
                                                    );
                                                }}
                                                placeholder={
                                                    isPincodeLoading
                                                        ? 'Loading pincodes...'
                                                        : 'Start typing pincode, city or area'
                                                }
                                                className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 ${addressErrors.pincode
                                                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-gray-200 bg-slate-50 focus:border-primary focus:ring-primary/20 focus:bg-white'
                                                    }`}
                                            />

                                            {showPincodeSuggestions &&
                                                pincodeSearch.trim().length >= 2 && (
                                                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                                        {isPincodeLoading &&
                                                            pincodeOptions.length === 0 ? (
                                                            <div className="p-3 text-center text-xs text-slate-500">
                                                                Loading suggestions...
                                                            </div>
                                                        ) : pincodeOptions.length > 0 ? (
                                                            <div className="py-1">
                                                                {pincodeOptions.map((option: { value: string | number; label: string }) => (
                                                                    <button
                                                                        key={option.value}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            field.onChange(
                                                                                String(option.value),
                                                                            );
                                                                            setPincodeSearch(
                                                                                option.label,
                                                                            );
                                                                            setShowPincodeSuggestions(
                                                                                false,
                                                                            );
                                                                        }}
                                                                        className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-primary-50 hover:text-primary"
                                                                    >
                                                                        {option.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-3 text-center text-xs text-slate-500">
                                                                No pincodes found. Try a different search
                                                                term.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                />
                                {addressErrors.pincode && (
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500">
                                        {addressErrors.pincode.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-3 text-[11px]"
                                    onClick={() => setIsAddressModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="rounded-full px-4 text-[11px]"
                                >
                                    {isEditingAddress
                                        ? 'Update Address'
                                        : 'Save Address'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manager Modal */}
            {isManagerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl border bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    {selectedCenter?.city || 'City'}
                                </p>
                                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                                    {isEditingManager ? 'Edit Manager Details' : 'Add Manager Details'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200"
                                onClick={() => setIsManagerModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleManagerSubmit(onSubmitManager)}
                            className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 sm:py-5"
                        >
                            <TextInput
                                name="fullName"
                                control={managerControl}
                                label="Manager Name"
                                placeholder="Enter manager full name"
                                required
                                error={managerErrors.fullName}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <MobileInput
                                name="mobile"
                                control={managerControl}
                                label="Mobile Number"
                                required
                                error={managerErrors.mobile}
                                inputClassName="px-3 py-2 text-sm"
                            />

                            <div className="flex justify-end gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-3 text-[11px]"
                                    onClick={() => setIsManagerModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="rounded-full px-4 text-[11px]"
                                >
                                    {isEditingManager ? 'Update Manager' : 'Save Manager'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InspectionCenterComponent;