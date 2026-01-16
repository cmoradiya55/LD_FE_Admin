import InspectionSummary from '@/components/InspectionReport/InspectionSummary';
import StaffInspectionReport from '@/components/InspectionReport/StaffInspectionReport';
import { ElectricalFields, AirConditioningFields, EngineAndTransmissionFields, ExteriorFields, SteeringSuspensionAndBrakesFields, InteriorFields, SeatsFields, UsedCarListingStatus } from '@/lib/data';
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInspectionReport, patchApproveInspectedCar, patchUpdateStatusOfCar } from '@/utils/axios/auth';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/common';
import { Button } from '@/components/Button/Button';
import { IndianRupee, Save, XCircle } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface InspectionReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    carId: string | null;
    carDetailsData?: any;
}

const InspectionReportDialog = ({ isOpen, onClose, carId, carDetailsData }: InspectionReportDialogProps) => {
    const [price, setPrice] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [rejectReason, setRejectReason] = useState<string>('');
    const { authState } = useAuth();
    const isAdmin = authState.user?.roleId === 1;

    // Only fetch inspection report for manager, not for admin
    const { data: inspectionData, isLoading, refetch: refetchInspectionReport } = useQuery({
        queryKey: ['GET_INSPECTION_REPORT', carId],
        queryFn: async () => {
            if (!carId) return null;
            const response = await getInspectionReport(carId);
            if (response?.code === 200 && response?.data) {
                return response.data;
            }
            return null;
        },
        enabled: !!carId && isOpen && !isAdmin, // Only call for manager, not admin
        retry: false,
        refetchOnWindowFocus: false,
    });

    const formValues = useMemo(() => {
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
            registration_number: "",
            registartion_year: 0,
            km_driven: 0,
            rc_image: "",
            insurance_image: "",
        };

        allFields.forEach((field) => {
            values[field.name] = {
                damage: "",
                remarks: "",
                image: "",
            };
        });

        const dataSource = carDetailsData || inspectionData;
        if (!dataSource) {
            return values;
        }

        values.registration_number = carDetailsData?.registrationNumber || inspectionData?.car?.registrationNumber || "";
        values.registartion_year = carDetailsData?.registrationYear || inspectionData?.car?.registrationYear || 0;
        values.km_driven = carDetailsData?.kmDriven || inspectionData?.inspection?.kmDriven || 0;
        values.rc_image = carDetailsData?.rcImage || inspectionData?.rc_image || "";
        values.insurance_image = carDetailsData?.insuranceImage || inspectionData?.insurance_image || "";

        const inspectionImages = carDetailsData?.inspectionImages || inspectionData?.inspectionImages;
        if (inspectionImages && Array.isArray(inspectionImages)) {
            inspectionImages.forEach((imageData: any) => {
                const matchingField = allFields.find(
                    (field) => field.type === imageData.type && field.sub_type === imageData.subType
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
    }, [inspectionData, carDetailsData]);

    useEffect(() => {
        const currentStatus = isAdmin
            ? carDetailsData?.status
            : (inspectionData?.car?.status || inspectionData?.status);

        if (isAdmin) {
            // Admin: status 600 - show manager suggested price in input
            if (currentStatus === UsedCarListingStatus.APPROVED_BY_MANAGER) {
                const managerPrice = carDetailsData?.managerSuggestedPrice;
                if (managerPrice != null && managerPrice !== undefined) {
                    setPrice(managerPrice.toString());
                }
            }
        } else {
            // Manager: status 500 - initialize empty for input
            if (currentStatus === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF) {
                setPrice('');
            }
        }
    }, [isAdmin, carDetailsData, inspectionData]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setPrice(value);
    };

    const handleSubmitPrice = async () => {
        if (!price || parseFloat(price) <= 0 || !carId) {
            return;
        }
        setIsSubmitting(true);
        try {
            if (isAdmin) {
                const payload = {
                    status: 1,
                    price: parseFloat(price)
                };
                const response = await patchUpdateStatusOfCar(carId, payload);
                if (response?.code === 200 || response?.code === 201) {
                    toast.success('Price updated successfully');
                    onClose();
                } else {
                    const errorMessage = response?.message || 'Failed to update price';
                    toast.error(errorMessage);
                }
            } else {
                const payload = {
                    price: parseFloat(price)
                };
                const response = await patchApproveInspectedCar(carId, payload);
                if (response?.code === 200 || response?.code === 201) {
                    toast.success('Price saved and inspection report approved successfully');
                    onClose();
                    refetchInspectionReport();
                } else {
                    const errorMessage = response?.message || 'Failed to save price and approve inspection report';
                    toast.error(errorMessage);
                }
            }
        } catch (error: any) {
            console.error('Error updating price:', error);
            toast.error(error?.message || 'An error occurred while saving the price');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectClick = () => {
        setShowRejectReason(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectReason.trim() || !carId) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                status: 2,
                reason: rejectReason.trim()
            };
            const response = await patchUpdateStatusOfCar(carId, payload);
            if (response?.code === 200 || response?.code === 201) {
                toast.success('Car rejected successfully');
                setShowRejectReason(false);
                setRejectReason('');
                onClose();
                refetchInspectionReport();
            } else {
                const errorMessage = response?.message || 'Failed to reject car';
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error('Error rejecting car:', error);
            toast.error(error?.message || 'An error occurred while rejecting the car');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelReject = () => {
        setShowRejectReason(false);
        setRejectReason('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0 thin-scrollbar">
                {(isLoading || (isAdmin && !carDetailsData)) ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 px-6 pt-6 pb-4 pr-16">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-2">Inspection Report</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-6 space-y-6">
                            {/* Inspector's Inspection Report */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2.5 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg">
                                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900">Inspector's Inspection Report</h3>
                                    </div>
                                </div>
                                <div className="p-4">
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
                                        }} />
                                </div>
                            </div>

                            {/* Staff Inspection Report */}
                            <div>
                                <StaffInspectionReport
                                    isLoading={isAdmin ? false : isLoading}
                                    inspectionData={isAdmin ? carDetailsData : (inspectionData || carDetailsData)}
                                    formValues={formValues}
                                    renderWithoutDialog={true}
                                    hideVehicleDetails={true}
                                />
                            </div>


                            {/* Price Details */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                                {/* Price Details Header */}
                                <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2.5 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg">
                                            <IndianRupee className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900">Price Details</h3>
                                    </div>
                                </div>

                                {/* Price Details Content */}
                                <div className="p-4">
                                    {(() => {
                                        const currentStatus = isAdmin
                                            ? carDetailsData?.status
                                            : (inspectionData?.car?.status || inspectionData?.status);

                                        // Manager Logic
                                        if (!isAdmin) {
                                            // Manager: status 500 - Show input and Save Price button
                                            if (currentStatus === UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF) {
                                                return (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Enter Price
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span className="text-gray-500 text-lg font-medium">₹</span>
                                                                </div>
                                                                <input
                                                                    id="price"
                                                                    type="text"
                                                                    value={price}
                                                                    onChange={handlePriceChange}
                                                                    placeholder="Enter price amount"
                                                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                                                                />
                                                            </div>
                                                            {price && (
                                                                <p className="mt-2 text-xs text-gray-600">
                                                                    Amount: ₹{parseFloat(price || '0').toLocaleString('en-IN')}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <Button
                                                                onClick={handleSubmitPrice}
                                                                disabled={!price || parseFloat(price) <= 0 || isSubmitting}
                                                                variant="primary"
                                                                className="flex items-center gap-2 px-6 py-2.5"
                                                            >
                                                                <Save className="h-4 w-4" />
                                                                {isSubmitting ? 'Saving...' : 'Save Price'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Manager: status 600 - Show price from detail API (read-only)
                                            if (currentStatus === UsedCarListingStatus.APPROVED_BY_MANAGER) {
                                                const managerPrice = inspectionData?.managerSuggestedPrice || inspectionData?.car?.managerSuggestedPrice;
                                                return (
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Manager Suggested Price
                                                        </label>
                                                        <div className="p-4 rounded-lg bg-primary-50 border-2 border-primary-200">
                                                            <p className="text-2xl font-bold text-primary-700">
                                                                ₹{managerPrice != null && managerPrice !== undefined
                                                                    ? managerPrice.toLocaleString('en-IN')
                                                                    : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }

                                        // Admin Logic
                                        if (isAdmin) {
                                            // Admin: status 600 - Show input and Update Price button
                                            if (currentStatus === UsedCarListingStatus.APPROVED_BY_MANAGER) {
                                                return (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Manager Suggested Price (You can modify)
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span className="text-gray-500 text-lg font-medium">₹</span>
                                                                </div>
                                                                <input
                                                                    id="price"
                                                                    type="text"
                                                                    value={price}
                                                                    onChange={handlePriceChange}
                                                                    placeholder="Enter price amount"
                                                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                                                                />
                                                            </div>
                                                            {price && (
                                                                <p className="mt-2 text-xs text-gray-600">
                                                                    Amount: ₹{parseFloat(price || '0').toLocaleString('en-IN')}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {!showRejectReason ? (
                                                            <div className="flex justify-end gap-3">
                                                                <Button
                                                                    onClick={handleSubmitPrice}
                                                                    disabled={!price || parseFloat(price) <= 0 || isSubmitting}
                                                                    variant="accept"
                                                                    className="flex items-center gap-2 px-6 py-2.5"
                                                                >
                                                                    <Save className="h-4 w-4" />
                                                                    {isSubmitting ? 'Updating...' : 'Update Price'}
                                                                </Button>
                                                                <Button
                                                                    onClick={handleRejectClick}
                                                                    disabled={isSubmitting}
                                                                    variant="destructive"
                                                                    className="flex items-center gap-2 px-6 py-2.5"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label htmlFor="rejectReason" className="block text-sm font-semibold text-gray-700 mb-2">
                                                                        Rejection Reason <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <textarea
                                                                        id="rejectReason"
                                                                        value={rejectReason}
                                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                                        placeholder="Please provide a reason for rejecting this car..."
                                                                        rows={4}
                                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                                                                    />
                                                                </div>
                                                                <div className="flex justify-end gap-3">
                                                                    <Button
                                                                        onClick={handleCancelReject}
                                                                        disabled={isSubmitting}
                                                                        variant="outline"
                                                                        className="flex items-center gap-2 px-6 py-2.5"
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        onClick={handleConfirmReject}
                                                                        disabled={!rejectReason.trim() || isSubmitting}
                                                                        variant="destructive"
                                                                        className="flex items-center gap-2 px-6 py-2.5"
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                        {isSubmitting ? 'Rejecting...' : 'Confirm Reject'}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            // Admin: status 700/800 - Show price from detail API (read-only)
                                            if (currentStatus === UsedCarListingStatus.APPROVED_BY_ADMIN || currentStatus === UsedCarListingStatus.LISTED) {
                                                const finalPrice = carDetailsData?.finalPrice;
                                                return (
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Final Price
                                                        </label>
                                                        <div className="p-4 rounded-lg bg-primary-50 border-2 border-primary-200">
                                                            <p className="text-2xl font-bold text-primary-700">
                                                                ₹{finalPrice != null && finalPrice !== undefined
                                                                    ? finalPrice.toLocaleString('en-IN')
                                                                    : 'N/A'} /-
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Admin: status 1100 - Show rejection reason
                                            if (currentStatus === UsedCarListingStatus.REJECTED_BY_ADMIN) {
                                                return (
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Rejection Reason
                                                        </label>
                                                        <div className="p-4 rounded-lg bg-primary-50 border-2 border-primary-200">
                                                            <p className="text-2xl font-bold text-primary-700">
                                                                {carDetailsData?.adminCancelReason || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }

                                        // Default fallback - no price section shown for other statuses
                                        return (
                                            <div className="text-center py-4 text-gray-500">
                                                Price details not available for this status
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default InspectionReportDialog;
