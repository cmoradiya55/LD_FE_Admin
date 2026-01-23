"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import TextInput from "@/components/FormComponent/TextInput";
import TextArea from "@/components/FormComponent/TextArea";
import DateInput from "@/components/FormComponent/DateInput";
import SelectInput from "@/components/FormComponent/SelectInput";
import { Button } from "@/components/Button/Button";
import {
    CheckCircle2,
    ArrowLeft,
    FileText,
    Calendar,
    Shield,
    AlertTriangle,
    Sparkles,
    Plus,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { patchAddAdditionalDetails, getCarDetails } from "@/utils/axios/auth";
import { OwnerType } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

interface ChallanDetail {
    challan_number: string;
    challan_date: string;
    challan_amount: string;
    challan_reason: string;
}

interface InspectionFormData {
    registartion_date: string;
    fitness_valid_until: string;
    insurance_valid_until: string;
    puc_valid_until: string;
    has_challan: boolean;
    challan_detail: ChallanDetail[];
    loan_status: boolean;
    owner: number; // OwnerType enum
    registration_place: string;
    is_blacklisted: boolean;
    is_rto_noc_issued: boolean;
    is_party_peshi: boolean;
    is_hypothecated: boolean;
    is_converted: boolean;
    is_migrated: boolean;
    adapted_for_special_use: boolean;
    criminal_cases: number;
    civil_cases: number;
    road_accidents: number;
    compensation_cases: number;
    other_cases: number;
    staff_remarks: string;
}

const StaffInspectionForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const carId = searchParams.get("carId") || "";
    const [isSaving, setIsSaving] = useState(false);

    // Fetch car details to get car name
    const { data: carDetailsData } = useQuery({
        queryKey: ['GET_CAR_DETAILS', carId],
        queryFn: async () => {
            if (!carId) return null;
            const response = await getCarDetails(carId);
            if (response?.code === 200 && response?.data) {
                return Array.isArray(response.data) ? response.data[0] : response.data;
            }
            return null;
        },
        enabled: !!carId,
        retry: false,
        refetchOnWindowFocus: false,
    });

    // Get car name from car details
    const carName = carDetailsData?.displayName
        ? (carDetailsData?.variantName ? `${carDetailsData.displayName} ${carDetailsData.variantName}` : carDetailsData.displayName)
        : carDetailsData?.car?.displayName
            ? (carDetailsData?.car?.variantName ? `${carDetailsData.car.displayName} ${carDetailsData.car.variantName}` : carDetailsData.car.displayName)
            : carDetailsData?.brand && carDetailsData?.model
                ? `${carDetailsData.brand} ${carDetailsData.model}${carDetailsData.variant ? ` ${carDetailsData.variant}` : ''}`
                : carDetailsData?.car?.brand && carDetailsData?.car?.model
                    ? `${carDetailsData.car.brand} ${carDetailsData.car.model}${carDetailsData.car.variant ? ` ${carDetailsData.car.variant}` : ''}`
                    : null;

    const { control, watch, handleSubmit, setValue, formState: { errors } } = useForm<InspectionFormData>({
        defaultValues: {
            registartion_date: "",
            fitness_valid_until: "",
            insurance_valid_until: "",
            puc_valid_until: "",
            has_challan: false,
            challan_detail: [],
            loan_status: false,
            owner: OwnerType.FIRST,
            registration_place: "",
            is_blacklisted: false,
            is_rto_noc_issued: false,
            is_party_peshi: false,
            is_hypothecated: false,
            is_converted: false,
            is_migrated: false,
            adapted_for_special_use: false,
            criminal_cases: 0,
            civil_cases: 0,
            road_accidents: 0,
            compensation_cases: 0,
            other_cases: 0,
            staff_remarks: "",
        },
    });

    const ownerOptions = [
        { value: OwnerType.FIRST, label: "1st Owner" },
        { value: OwnerType.SECOND, label: "2nd Owner" },
        { value: OwnerType.THIRD, label: "3rd Owner" },
        { value: OwnerType.FOURTH, label: "4th Owner" },
        { value: OwnerType.FIFTH, label: "5th Owner" },
    ];

    const hasChallan = watch("has_challan");
    const challans = watch("challan_detail") || [];

    useEffect(() => {
        if (hasChallan && challans.length === 0) {
            setValue("challan_detail", [
                { challan_number: "", challan_date: "", challan_amount: "", challan_reason: "" }
            ]);
        }
    }, [hasChallan, challans.length, setValue]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formValues = watch();
            toast.success("Draft saved successfully");
        } catch (error) {
            toast.error("Failed to save draft");
        } finally {
            setIsSaving(false);
        }
    };

    const onSubmit = async (data: InspectionFormData) => {
        try {
            // Convert challan array to object format
            let challanDetailsObj: any = {};
            if (data.has_challan && data.challan_detail.length > 0) {
                data.challan_detail.forEach((challan, index) => {
                    if (challan.challan_number || challan.challan_date || challan.challan_amount || challan.challan_reason) {
                        challanDetailsObj[index] = {
                            challanNumber: challan.challan_number || "",
                            challanDate: challan.challan_date || "",
                            challanAmount: challan.challan_amount || "",
                            challanReason: challan.challan_reason || "",
                        };
                    }
                });
            }

            const payload = {
                registrationDate: data.registartion_date,
                fitnessValidUntil: data.fitness_valid_until,
                insuranceValidUntil: data.insurance_valid_until,
                pucValidUntil: data.puc_valid_until,
                challanDetails: challanDetailsObj,
                loanStatus: data.loan_status,
                owner: data.owner,
                registrationPlace: data.registration_place,
                isBlacklisted: data.is_blacklisted,
                isRtoNocIssued: data.is_rto_noc_issued,
                isPartyPeshi: data.is_party_peshi,
                isHypothecated: data.is_hypothecated,
                isConverted: data.is_converted,
                isMigrated: data.is_migrated,
                adaptedForSpecialUse: data.adapted_for_special_use,
                criminalCases: Number(data.criminal_cases) || 0,
                civilCases: Number(data.civil_cases) || 0,
                roadAccidents: Number(data.road_accidents) || 0,
                compensationCases: Number(data.compensation_cases) || 0,
                otherCases: Number(data.other_cases) || 0,
                staffRemarks: data.staff_remarks || "",
            };

            const response = await patchAddAdditionalDetails(carId, payload);

            if (response?.code === 200 || response?.code === 201) {
                toast.success("Inspection details submitted successfully");
                router.push("/staff/carList");
            } else {
                const errorMessage = response?.message || response?.errors?.map((e: any) => e.message).join(", ") || "Failed to submit inspection details";
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error("Error submitting inspection:", error);
            const errorMessage = error?.response?.data?.message || error?.response?.data?.errors?.map((e: any) => e.message).join(", ") || "Failed to submit inspection details";
            toast.error(errorMessage);
        }
    };

    if (!carId) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-red-600 mb-4">Car ID is required</p>
                <Button onClick={() => router.push("/staff/carList")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Car List
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            <Button
                variant="outline"
                onClick={() => router.push("/staff/carList")}
                className="hidden sm:flex"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            {/* Enhanced Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-4 sm:p-5 shadow-xl">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between">

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white">
                                    Staff Inspection Form
                                </h1>
                            </div>
                            <p className="text-blue-50 text-xs sm:text-sm mt-1">
                                Complete the inspection details for car:
                                <span className="font-semibold text-white ml-1">{carName}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">

                    {/* Section 1: Registration & Documents */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                                    <Calendar className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Registration & Documents
                                </h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <DateInput
                                    name="registartion_date"
                                    control={control}
                                    label="Registration Date"
                                    required
                                    error={errors.registartion_date}
                                />
                                <DateInput
                                    name="fitness_valid_until"
                                    control={control}
                                    label="Fitness Valid Until"
                                    required
                                    error={errors.fitness_valid_until}
                                />
                                <DateInput
                                    name="insurance_valid_until"
                                    control={control}
                                    label="Insurance Valid Until"
                                    required
                                    error={errors.insurance_valid_until}
                                />
                                <DateInput
                                    name="puc_valid_until"
                                    control={control}
                                    label="PUC Valid Until"
                                    required
                                    error={errors.puc_valid_until}
                                />
                                <TextInput
                                    name="registration_place"
                                    control={control}
                                    label="Registration Place"
                                    placeholder="Enter registration place"
                                    required
                                    error={errors.registration_place}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Status & Ownership */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                                    <Shield className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Status & Ownership
                                </h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <SelectInput
                                    name="owner"
                                    control={control}
                                    label="Owner"
                                    options={ownerOptions}
                                    required
                                    error={errors.owner}
                                />

                                {/* Boolean Fields Grid */}
                                <div className="sm:col-span-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {[
                                            { name: "loan_status", label: "Loan Status" },
                                            { name: "is_blacklisted", label: "Blacklisted" },
                                            { name: "is_rto_noc_issued", label: "RTO NOC Issued" },
                                            { name: "is_party_peshi", label: "Party Peshi" },
                                            { name: "is_hypothecated", label: "Hypothecated" },
                                            { name: "is_converted", label: "Converted" },
                                            { name: "is_migrated", label: "Migrated" },
                                            { name: "adapted_for_special_use", label: "Adapted for Special Use" },
                                        ].map((field) => (
                                            <div key={field.name} className="bg-white rounded-lg py-1.5 px-3 border border-gray-200 hover:border-blue-300 transition-colors">
                                                <label className="block text-xs font-semibold text-primary-700">
                                                    {field.label}
                                                </label>
                                                <Controller
                                                    name={field.name as keyof InspectionFormData}
                                                    control={control}
                                                    render={({ field: formField }) => (
                                                        <div className="flex items-center gap-3">
                                                            {[
                                                                { value: true, label: "Yes" },
                                                                { value: false, label: "No" },
                                                            ].map((option) => (
                                                                <label
                                                                    key={String(option.value)}
                                                                    className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md transition-all ${(formField.value as boolean) === option.value
                                                                        ? "text-blue-700"
                                                                        : "text-gray-600"
                                                                        }`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        checked={(formField.value as boolean) === option.value}
                                                                        onChange={() => formField.onChange(option.value)}
                                                                        className="w-3.5 h-3.5 accent-primary-700 border-gray-300"
                                                                    />
                                                                    <span className="text-xs font-medium">{option.label}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Legal & Cases */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                                    <AlertTriangle className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Legal & Cases
                                </h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { name: "criminal_cases", label: "Criminal Cases", error: errors.criminal_cases },
                                    { name: "civil_cases", label: "Civil Cases", error: errors.civil_cases },
                                    { name: "road_accidents", label: "Road Accidents", error: errors.road_accidents },
                                    { name: "compensation_cases", label: "Compensation Cases", error: errors.compensation_cases },
                                    { name: "other_cases", label: "Other Cases", error: errors.other_cases },
                                ].map((field) => (
                                    <TextInput
                                        key={field.name}
                                        name={field.name as keyof InspectionFormData}
                                        control={control}
                                        label={field.label}
                                        type="number"
                                        placeholder="0"
                                        error={field.error}
                                        // rules={{ min: { value: 0, message: "Cannot be negative" } }}
                                        // onWheel={(e: any) => e.target.blur()}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Additional Information */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Additional Information
                                </h2>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {/* Challan Section */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <label className="block text-xs font-semibold text-gray-900 mb-2">
                                    Has Challan?
                                </label>
                                <Controller
                                    name="has_challan"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-4">
                                            {[
                                                { value: true, label: "Yes" },
                                                { value: false, label: "No" },
                                            ].map((option) => (
                                                <label
                                                    key={String(option.value)}
                                                    className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-md transition-all ${field.value === option.value
                                                        ? "text-blue-700 border border-blue-500"
                                                        : "text-gray-600 border border-gray-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        checked={field.value === option.value}
                                                        onChange={() => {
                                                            field.onChange(option.value);
                                                            if (!option.value) {
                                                                setValue("challan_detail", []);
                                                            } else if (watch("challan_detail").length === 0) {
                                                                setValue("challan_detail", [
                                                                    { challan_number: "", challan_date: "", challan_amount: "", challan_reason: "" }
                                                                ]);
                                                            }
                                                        }}
                                                        className="w-3.5 h-3.5 accent-primary-700 border-gray-300"
                                                    />
                                                    <span className="text-xs font-medium">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                />

                                {/* Challan Detail Fields - Show only if Yes */}
                                {watch("has_challan") && (
                                    <div className="mt-3 space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-semibold text-gray-900">Challan Details</h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const currentChallans = watch("challan_detail") || [];
                                                    setValue("challan_detail", [
                                                        ...currentChallans,
                                                        { challan_number: "", challan_date: "", challan_amount: "", challan_reason: "" }
                                                    ]);
                                                }}
                                                className="text-xs"
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add Challan
                                            </Button>
                                        </div>

                                        {(watch("challan_detail") || []).map((_, index) => (
                                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 space-y-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xs font-semibold text-gray-700">
                                                        Challan {index + 1}
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const currentChallans = watch("challan_detail") || [];
                                                            const newChallans = currentChallans.filter((_, i) => i !== index);

                                                            if (newChallans.length === 0) {
                                                                setValue("has_challan", false);
                                                                setValue("challan_detail", []);
                                                            } else {
                                                                setValue("challan_detail", newChallans);
                                                            }
                                                        }}
                                                        className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-all"
                                                        title="Delete Challan"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <TextInput
                                                        name={`challan_detail.${index}.challan_number`}
                                                        control={control}
                                                        label="Challan Number"
                                                        placeholder="Enter challan number"
                                                        error={errors.challan_detail?.[index]?.challan_number}
                                                    />
                                                    <DateInput
                                                        name={`challan_detail.${index}.challan_date`}
                                                        control={control}
                                                        label="Challan Date"
                                                        error={errors.challan_detail?.[index]?.challan_date}
                                                    />
                                                    <TextInput
                                                        name={`challan_detail.${index}.challan_amount`}
                                                        control={control}
                                                        label="Challan Amount"
                                                        type="number"
                                                        placeholder="Enter amount"
                                                        error={errors.challan_detail?.[index]?.challan_amount}
                                                    />
                                                    <TextInput
                                                        name={`challan_detail.${index}.challan_reason`}
                                                        control={control}
                                                        label="Reason"
                                                        placeholder="Enter challan reason"
                                                        error={errors.challan_detail?.[index]?.challan_reason}
                                                        className="sm:col-span-2"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                            <TextArea
                                name="staff_remarks"
                                control={control}
                                label="Staff Remarks"
                                placeholder="Enter any additional remarks or notes..."
                                rows={4}
                                error={errors.staff_remarks}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                            <Button
                                type="submit"
                                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Submit Inspection
                            </Button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default StaffInspectionForm;
