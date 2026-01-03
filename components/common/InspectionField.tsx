"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Control, Controller, FieldError, useWatch, useFormContext, UseFormSetValue } from "react-hook-form";
import UploadBox from "@/components/common/UploadBox";
import TextArea from "@/components/FormComponent/TextArea";
import { AlertCircle, CheckCircle2, Sparkles, AlertTriangle, Check, Notebook, ChevronDown, ChevronUp, LifeBuoy } from "lucide-react";
import { TreadDepthEnum } from "@/lib/data";

export type FieldType = "pillar" | "light" | "orvm" | "tyre" | "exhaust" | "engine" | "engineSound" | "engineMounting" | "clutch" | "gearShifting" | "engineOil";

interface InspectionFieldProps {
    name: string;
    control: Control<any>;
    label: string;
    fieldType: FieldType;
    uploadLabel?: string;
    error?: FieldError;
    existingImage?: string;
    onImageUpload?: (url: string) => void;
    setValue?: UseFormSetValue<any>;
}

interface DamageOption {
    id: string;
    label: string;
    showInLight?: boolean;
    showInORVM?: boolean;
}

interface ORVMSubOption {
    id: string;
    label: string;
}

interface TyreSubOption {
    id: string;
    label: string;
}

const InspectionField: React.FC<InspectionFieldProps> = ({
    name,
    control,
    label,
    fieldType,
    uploadLabel,
    error,
    existingImage,
    onImageUpload,
    setValue: setValueProp,
}) => {
    // Use useWatch to watch form values
    const damageFieldValue = useWatch({
        control,
        name: `${name}.damage`,
    });

    const orvmTypeFieldValue = useWatch({
        control,
        name: `${name}.orvm_type`,
    });

    const foldingMirrorValue = useWatch({
        control,
        name: `${name}.folding_mirror_working`,
    });

    const mirrorMotorValue = useWatch({
        control,
        name: `${name}.mirror_adjust_motor`,
    });

    const threadDepthValue = useWatch({
        control,
        name: `${name}.thread_depth`,
    });

    // Watch all engine option values individually to trigger re-renders
    // This ensures remarks update when engine options change
    const watchedEngineRepaired = useWatch({ control, name: `${name}.repaired` });
    const watchedEngineLongCranking = useWatch({ control, name: `${name}.long_cranking` });
    const watchedEngineElectricalWiring = useWatch({ control, name: `${name}.electrical_wiring_damaged` });
    const watchedEngineSoundBlowBy = useWatch({ control, name: `${name}.permissible_blow_by_on_idle` });
    const watchedEngineSound = useWatch({ control, name: `${name}.engine_sound` });
    const watchedEngineMountingVibration = useWatch({ control, name: `${name}.excess_vibration` });
    const watchedEngineMountingAbnormal = useWatch({ control, name: `${name}.engine_mounting_abnormal` });
    const watchedClutchHard = useWatch({ control, name: `${name}.hard` });
    const watchedGearShiftingNoise = useWatch({ control, name: `${name}.abnormal_noise_while_shifting` });
    const watchedGearShiftingHard = useWatch({ control, name: `${name}.gear_shifting_hard` });
    const watchedGearShiftingAxle = useWatch({ control, name: `${name}.front_drive_axle_noise` });
    const watchedEngineOilLeaking = useWatch({ control, name: `${name}.leaking` });

    // Get setValue and getValues from useFormContext or use the prop
    const formContext = useFormContext();
    const setValue = setValueProp || formContext?.setValue;
    const getValues = formContext?.getValues;

    if (!setValue) {
        console.error("setValue is required for InspectionField");
    }

    const [damageValue, setDamageValue] = useState<string>(damageFieldValue || "");
    const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
    const [orvmType, setOrvmType] = useState<"manual" | "electrical" | "">("");
    const [orvmSubOptions, setOrvmSubOptions] = useState<Record<string, boolean>>({});
    const [remarks, setRemarks] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>(existingImage || "");
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Sync damageValue with form field
    useEffect(() => {
        if (damageFieldValue !== damageValue) {
            setDamageValue(damageFieldValue || "");
        }
    }, [damageFieldValue]);

    // Sync orvmType with form field
    useEffect(() => {
        if (orvmTypeFieldValue && orvmTypeFieldValue !== orvmType) {
            setOrvmType(orvmTypeFieldValue as "manual" | "electrical");
        }
    }, [orvmTypeFieldValue]);

    // Common damage options
    const commonOptions: DamageOption[] = [
        { id: "dented", label: "Dented" },
        { id: "scratched", label: "Scratched" },
        { id: "repainted", label: "Repainted" },
        { id: "damaged", label: "Damaged" },
        { id: "surface_rust", label: "Surface Rust" },
        { id: "replaced", label: "Replaced" },
    ];

    // Light-specific option
    const lightOption: DamageOption = { id: "faded", label: "Faded", showInLight: true };

    // ORVM sub-options
    const orvmSubOptionsList: ORVMSubOption[] = [
        { id: "folding_mirror_working", label: "Folding Mirror Working" },
        { id: "mirror_adjust_motor", label: "Mirror Adjust Motor" },
    ];

    const engineOptionsList: DamageOption[] = [
        { id: "repaired", label: "Repaired" },
        { id: "long_cranking", label: "Long cranking due to weak compression" },
        { id: "electrical_wiring_damaged", label: "Electrical wiring damaged" },
    ];

    const engineSoundOptionsList: DamageOption[] = [
        { id: "permissible_blow_by_on_idle", label: "Permissible blow by on idle" },
        { id: "engine_sound", label: "Engine Sound" },
    ];

    const engineMountingOptionsList: DamageOption[] = [
        { id: "excess_vibration", label: "Excess Vibration" },
        { id: "engine_mounting_abnormal", label: "Broken" },
    ];

    const clutchOptionsList: DamageOption[] = [
        { id: "hard", label: "Hard" },
    ];

    const gearShiftingOptionsList: DamageOption[] = [
        { id: "abnormal_noise_while_shifting", label: "Abnormal noise while shifting" },
        { id: "gear_shifting_hard", label: "Gear shifting Hard" },
        { id: "front_drive_axle_noise", label: "Front drive axle noise" },
    ];

    const engineOilOptionsList: DamageOption[] = [
        { id: "leaking", label: "Leaking" },
    ];

    // Get options to display based on field type
    const getDisplayOptions = () => {
        const options = [...commonOptions];
        if (fieldType === "light") {
            options.push(lightOption);
        }
        return options;
    };

    // Get engine-specific options based on field type
    const getEngineOptions = (): DamageOption[] => {
        switch (fieldType) {
            case "engine":
                return engineOptionsList;
            case "engineSound":
                return engineSoundOptionsList;
            case "engineMounting":
                return engineMountingOptionsList;
            case "clutch":
                return clutchOptionsList;
            case "gearShifting":
                return gearShiftingOptionsList;
            case "engineOil":
                return engineOilOptionsList;
            default:
                return [];
        }
    };

    // Check if field type is engine-related
    const isEngineFieldType = fieldType === "engine" || fieldType === "engineSound" || fieldType === "engineMounting" || fieldType === "clutch" || fieldType === "gearShifting" || fieldType === "engineOil";

    // Thread depth options mapping - memoized to prevent recreation on every render
    const threadDepthOptions = useMemo(() => [
        { value: TreadDepthEnum.LESS_THAN_3MM, label: "< 3 mm" },
        { value: TreadDepthEnum.BETWEEN_3MM_AND_4MM, label: "3-4 mm" },
        { value: TreadDepthEnum.BETWEEN_4MM_AND_5MM, label: "4-5 mm" },
        { value: TreadDepthEnum.BETWEEN_5MM_AND_6MM, label: "5-6 mm" },
        { value: TreadDepthEnum.BETWEEN_6MM_AND_7MM, label: "6-7 mm" },
        { value: TreadDepthEnum.BETWEEN_7MM_AND_8MM, label: "7-8 mm" },
        { value: TreadDepthEnum.BETWEEN_8MM_AND_9MM, label: "8-9 mm" },
        { value: TreadDepthEnum.BETWEEN_9MM_AND_MM, label: "9-10 mm" },
    ], []);

    // Update remarks when options change
    useEffect(() => {
        if (damageValue === "yes") {
            const activeLabels: string[] = [];

            // Skip remarks generation for tyre type (thread depth should not appear in remarks)
            if (fieldType !== "tyre") {
                // Add engine-specific options (yes selections only)
                if (isEngineFieldType) {
                    const engineOptions = getEngineOptions();
                    // Map of option IDs to their watched values
                    const watchedValuesMap: Record<string, string> = {
                        "repaired": watchedEngineRepaired,
                        "long_cranking": watchedEngineLongCranking,
                        "electrical_wiring_damaged": watchedEngineElectricalWiring,
                        "permissible_blow_by_on_idle": watchedEngineSoundBlowBy,
                        "engine_sound": watchedEngineSound,
                        "excess_vibration": watchedEngineMountingVibration,
                        "engine_mounting_abnormal": watchedEngineMountingAbnormal,
                        "hard": watchedClutchHard,
                        "abnormal_noise_while_shifting": watchedGearShiftingNoise,
                        "gear_shifting_hard": watchedGearShiftingHard,
                        "front_drive_axle_noise": watchedGearShiftingAxle,
                        "leaking": watchedEngineOilLeaking,
                    };
                    
                    engineOptions.forEach((option) => {
                        const optionValue = watchedValuesMap[option.id];
                        if (optionValue === "yes") {
                            activeLabels.push(option.label);
                        }
                    });
                } else {
                    // Add common and light-specific options
                    getDisplayOptions().forEach((option) => {
                        if (selectedOptions[option.id]) {
                            activeLabels.push(option.label);
                        }
                    });

                    // Add ORVM sub-options if electrical (add both yes and no)
                    if (fieldType === "orvm" && orvmType === "electrical") {
                        if (foldingMirrorValue === "no") {
                            activeLabels.push("Folding Mirror Not Working");
                        }
                        if (mirrorMotorValue === "no") {
                            activeLabels.push("Mirror Adjust Motor Not Working");
                        }
                    }
                }
            }

            const newRemarks = activeLabels.join(", ");
            // Only update if remarks actually changed to prevent infinite loops
            if (newRemarks !== remarks) {
                setRemarks(newRemarks);
                if (setValue) {
                    setValue(`${name}.remarks` as any, newRemarks, { shouldValidate: true });
                }
            }
        } else if (damageValue === "no") {
            // Only update if remarks is not already empty
            if (remarks !== "") {
                setRemarks("");
                if (setValue) {
                    setValue(`${name}.remarks` as any, "", { shouldValidate: true });
                }
            }
        }
    }, [selectedOptions, orvmType, fieldType, damageValue, name, setValue, foldingMirrorValue, mirrorMotorValue, threadDepthValue, threadDepthOptions, remarks, isEngineFieldType, watchedEngineRepaired, watchedEngineLongCranking, watchedEngineElectricalWiring, watchedEngineSoundBlowBy, watchedEngineSound, watchedEngineMountingVibration, watchedEngineMountingAbnormal, watchedClutchHard, watchedGearShiftingNoise, watchedGearShiftingHard, watchedGearShiftingAxle, watchedEngineOilLeaking]);

    const handleImageUpload = (url: string) => {
        setImageUrl(url);
        if (setValue) {
            setValue(`${name}.image` as any, url, { shouldValidate: false });
        }
        if (onImageUpload) {
            onImageUpload(url);
        }
    };

    const isRemarksRequired = damageValue === "yes";

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300">

            {/* Decorative gradient header */}
            <div className="relative bg-blue-50 px-4 py-2 border-b border-slate-100">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="p-1 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
                            <Sparkles className="h-2.5 w-2.5 text-white" />
                        </div>
                        <h3 className="text-[13px] font-semibold text-primary-700">
                            {label}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {imageUrl && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-200">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                <span className="text-[10px] font-semibold text-green-700">Uploaded</span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 rounded-md hover:bg-blue-100 transition-colors duration-200"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-primary-700" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-primary-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 space-y-4">

                    {/* Upload Box */}
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                        <div className="relative">
                            <UploadBox
                                label={uploadLabel || `Upload ${label} Image`}
                                category="car"
                                existingImage={imageUrl}
                                onUploadComplete={handleImageUpload}
                                onUploadError={(error) => {
                                    console.error("Image upload error:", error);
                                }}
                            />
                        </div>
                    </div>

                    {/* Thread Depth - Only for Tyre type */}
                    {fieldType === "tyre" && (
                        <div className="space-y-2 py-2 px-3 rounded-xl bg-gradient-to-br from-primary-50/50 via-primary-50/30 to-primary-50/50 border border-primary-200/60">
                            <div className="flex items-center justify-between gap-3">
                                <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 whitespace-nowrap">
                                    <LifeBuoy className="h-3.5 w-3.5 text-primary-600" />
                                    Thread Depth
                                    <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <Controller
                                name={`${name}.thread_depth`}
                                control={control}
                                rules={{ required: "Please select thread depth" }}
                                render={({ field }) => (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                        {threadDepthOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`group relative flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-all duration-200 ${field.value === option.value.toString()
                                                    ? "border-primary-500 bg-gradient-to-br from-primary-50 via-primary-100/50 to-primary-50 shadow-sm shadow-primary-200/50"
                                                    : "border-slate-300 bg-white hover:border-primary-300 hover:bg-primary-50/30"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value.toString()}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                    }}
                                                    className="hidden"
                                                />
                                                <div
                                                    className={`relative w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 ${field.value === option.value.toString()
                                                        ? "border-primary-600 bg-primary-600"
                                                        : "border-slate-400 bg-white"
                                                        }`}
                                                >
                                                    {field.value === option.value.toString() && (
                                                        <>
                                                            <div className="absolute inset-0 rounded-full bg-primary-400/30 animate-ping"></div>
                                                            <Check className="w-2.5 h-2.5 text-bold text-white relative z-10" />
                                                        </>
                                                    )}
                                                </div>
                                                <span className={`text-[12px] font-medium ${field.value === option.value.toString()
                                                    ? "text-primary-900"
                                                    : "text-slate-700"
                                                    }`}>
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {/* Damage Yes/No */}
                    <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-1 text-[13px] font-bold text-slate-700 whitespace-nowrap">
                            <AlertTriangle className="h-3.5 w-3.5 text-warning mr-1" />
                            Damage Status
                            <span className="text-error">*</span>
                        </label>
                        <Controller
                            name={`${name}.damage`}
                            control={control}
                            rules={{ required: "Please select damage status" }}
                            render={({ field }) => (
                                <div className="flex items-center gap-10">
                                    {["yes", "no"].map((value) => (
                                        <label
                                            key={value}
                                            className={`group relative flex items-center gap-1.5 cursor-pointer transition-all duration-300 overflow-hidden text-sm font-normal ${field.value === value
                                                ? value === "yes"
                                                    ? "text-red-700"
                                                    : "text-green-700"
                                                : "text-slate-700"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={value}
                                                checked={field.value === value}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    setDamageValue(e.target.value);
                                                    if (e.target.value === "no") {
                                                        setSelectedOptions({});
                                                        setOrvmSubOptions({});
                                                        setOrvmType("");
                                                        setRemarks("");
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <div
                                                className={`relative w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 ${field.value === value
                                                    ? value === "yes"
                                                        ? "border-red-500 bg-red-500"
                                                        : "border-green-500 bg-green-500"
                                                    : "border-slate-600 bg-white"
                                                    }`}
                                            >
                                                {field.value === value && (
                                                    <>
                                                        <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                                                        <Check className="w-3 h-3 text-bold text-white relative z-10" />
                                                    </>
                                                )}
                                            </div>
                                            <span className="font-normal capitalize text-[13px]">{value === "yes" ? "Yes" : "No"}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    {/* Options Section - Only show if damage is yes and fieldType is not tyre */}
                    {damageValue === "yes" && fieldType !== "tyre" && (
                        <div className="space-y-2">
                            {/* Engine-specific Options with Yes/No format */}
                            {isEngineFieldType ? (
                                <div className="space-y-2">
                                    {getEngineOptions().map((option) => (
                                        <div key={option.id} className="flex items-center justify-between gap-3 flex-wrap">
                                            <label className="flex items-center gap-1 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                                               • {option.label}
                                            </label>
                                            <Controller
                                                name={`${name}.${option.id}`}
                                                control={control}
                                                render={({ field: optionField }) => (
                                                    <div className="flex items-center gap-8">
                                                        {["yes", "no"].map((value: string) => (
                                                            <label
                                                                key={value}
                                                                className={`group relative flex items-center gap-1.5 cursor-pointer transition-all duration-300 overflow-hidden text-sm font-normal ${optionField.value === value
                                                                    ? value === "yes"
                                                                        ? "text-red-700"
                                                                        : "text-green-700"
                                                                    : "text-slate-700"
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    value={value}
                                                                    checked={optionField.value === value}
                                                                    onChange={(e) => {
                                                                        optionField.onChange(e.target.value);
                                                                    }}
                                                                    className="hidden"
                                                                />
                                                                <div
                                                                    className={`relative w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 ${optionField.value === value
                                                                        ? value === "yes"
                                                                            ? "border-red-500 bg-red-500"
                                                                            : "border-green-500 bg-green-500"
                                                                        : "border-slate-600 bg-white"
                                                                        }`}
                                                                >
                                                                    {optionField.value === value && (
                                                                        <>
                                                                            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                                                                            <Check className="w-3 h-3 text-bold text-white relative z-10" />
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <span className="font-normal capitalize text-[13px]">{value === "yes" ? "Yes" : "No"}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {/* Common and Light-specific Options */}
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-700">
                                            Damage Types
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {getDisplayOptions().map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedOptions((prev) => ({
                                                            ...prev,
                                                            [option.id]: !prev[option.id],
                                                        }));
                                                    }}
                                                    className={`inline-flex items-center gap-1.5 p-1.5 rounded-md border transition-all duration-200 ${selectedOptions[option.id]
                                                        ? "border-primary-500 bg-primary-50 text-primary-700"
                                                        : "border-slate-300 bg-white text-slate-600"
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${selectedOptions[option.id]
                                                            ? "border-primary-500 bg-primary-500"
                                                            : "border-slate-400"
                                                            }`}
                                                    >
                                                        {selectedOptions[option.id] && (
                                                            <Check className="w-2.5 h-2.5 text-bold text-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-[12px] font-normal">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ORVM Type Selection - Only for ORVM */}
                            {fieldType === "orvm" && (
                                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                                    <label className="text-[13px] font-semibold text-slate-700">
                                        ORVM Type <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name={`${name}.orvm_type`}
                                        control={control}
                                        rules={{ required: "Please select ORVM type" }}
                                        render={({ field }) => (
                                            <div className="flex flex-wrap gap-2">
                                                {["manual", "electrical"].map((type) => (
                                                    <label
                                                        key={type}
                                                        className={`inline-flex items-center gap-1.5 cursor-pointer p-1.5 rounded-md border transition-all duration-200 ${field.value === type
                                                            ? "border-primary-500 bg-primary-50 text-primary-700"
                                                            : "border-slate-300 bg-white text-slate-600"
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            value={type}
                                                            checked={field.value === type}
                                                            onChange={(e) => {
                                                                field.onChange(e.target.value);
                                                                setOrvmType(e.target.value as "manual" | "electrical");
                                                                if (e.target.value === "manual") {
                                                                    setOrvmSubOptions({});
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <div
                                                            className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${field.value === type
                                                                ? "border-primary-500 bg-primary-500"
                                                                : "border-slate-400"
                                                                }`}
                                                        >
                                                            {field.value === type && (
                                                                <Check className="w-2.5 h-2.5 text-bold text-white" />
                                                            )}
                                                        </div>
                                                        <span className="text-[12px] font-normal capitalize">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    />

                                    {/* ORVM Sub-options - Always show labels when electrical, yes/no for each */}
                                    {orvmType === "electrical" && (
                                        <div className="space-y-2 pt-2">
                                            <label className="text-[13px] font-semibold underline decoration-primary-700 text-primary-700">
                                                Electrical Features
                                            </label>
                                            <div className="space-y-2">
                                                {orvmSubOptionsList.map((subOption) => (
                                                    <div key={subOption.id} className="flex items-center justify-between gap-3">
                                                        <label className="flex items-center gap-1 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                                                            {subOption.label}
                                                        </label>
                                                        <Controller
                                                            name={`${name}.${subOption.id}`}
                                                            control={control}
                                                            rules={{ required: `Please select status for ${subOption.label}` }}
                                                            render={({ field: subField }) => (
                                                                <div className="flex items-center gap-10">
                                                                    {["yes", "no"].map((value: string) => (
                                                                        <label
                                                                            key={value}
                                                                            className={`group relative flex items-center gap-1.5 cursor-pointer transition-all duration-300 overflow-hidden text-sm font-normal ${subField.value === value
                                                                                ? value === "yes"
                                                                                    ? "text-green-700"
                                                                                    : "text-red-700"
                                                                                : "text-slate-700"
                                                                                }`}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                value={value}
                                                                                checked={subField.value === value}
                                                                                onChange={(e) => {
                                                                                    subField.onChange(e.target.value);
                                                                                    setOrvmSubOptions((prev) => ({
                                                                                        ...prev,
                                                                                        [subOption.id]: e.target.value === "yes",
                                                                                    }));
                                                                                }}
                                                                                className="hidden"
                                                                            />
                                                                            <div
                                                                                className={`relative w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 ${subField.value === value
                                                                                    ? value === "yes"
                                                                                        ? "border-green-500 bg-green-500"
                                                                                        : "border-red-500 bg-red-500"
                                                                                    : "border-slate-600 bg-white"
                                                                                    }`}
                                                                            >
                                                                                {subField.value === value && (
                                                                                    <>
                                                                                        <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                                                                                        <Check className="w-3 h-3 text-bold text-white relative z-10" />
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <span className="font-normal capitalize text-[13px]">{value === "yes" ? "Yes" : "No"}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}

                        </div>
                    )}

                    {/* Remarks TextArea */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            {/* <div className="w-0.5 h-3.5 rounded-full bg-gradient-to-b from-amber-500 to-orange-600"></div> */}
                            <Notebook className="w-3.5 h-3.5 text-amber-500" />
                            Remarks
                            {isRemarksRequired && <span className="text-red-500">*</span>}
                            {!isRemarksRequired && <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>}
                        </label>
                        <div className="relative">
                            <TextArea
                                name={`${name}.remarks`}
                                control={control}
                                label=""
                                hideLabel
                                placeholder={
                                    damageValue === "yes"
                                        ? "Selected options will appear here automatically..."
                                        : "Add any additional remarks (optional)"
                                }
                                required={isRemarksRequired}
                                rows={3}
                                inputClassName="px-3 py-2 text-[13px] border-[1.5px] border-slate-200 focus:border-[1.5px] focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                                error={error}
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            <span className="font-medium">{error.message}</span>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
};

export default InspectionField;

