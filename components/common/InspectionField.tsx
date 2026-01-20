"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Control, Controller, FieldError, useWatch, useFormContext, UseFormSetValue } from "react-hook-form";
import { AlertCircle, CheckCircle2, Sparkles, AlertTriangle, Check, Notebook, ChevronDown, ChevronUp, LifeBuoy } from "lucide-react";
import { TreadDepthEnum, isImageRequired } from "@/lib/data";
import UploadVideoBox from "./UploadVideoBox";
import UploadImageBox from "@/components/common/UploadImageBox";

export type FieldType = "pillar" | "light" | "orvm" | "tyre" | "exhaust"| "engineOilLevelDipstick"| "battery"| "coolant"| "sump"| "engine" | "engineSound" | "engineMounting" | "clutch" | "gearShifting" | "engineOil"| "steering"| "brake"| "suspension" | "airCondition" | "electricalInterior" | "electrical" | "interior" | "seats";

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
    type?: number; 
    sub_type?: number;
    isRequired?: boolean;
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

const YesNoRadio: React.FC<{
    value: string;
    onChange: (value: string) => void;
    name: string;
    className?: string;
    reversed?: boolean;
}> = ({ value, onChange, name, className = "", reversed = false }) => (
    <div className={`flex items-center gap-10 ${className}`}>
        {["yes", "no"].map((val) => {
            const isSelected = value === val;
            const isYes = val === "yes";
            const colorClass = isSelected
                ? reversed
                    ? isYes
                        ? "text-green-700"
                        : "text-red-700"
                    : isYes
                        ? "text-red-700"
                        : "text-green-700"
                : "text-slate-700";
            const borderClass = isSelected
                ? reversed
                    ? isYes
                        ? "border-green-500 bg-green-500"
                        : "border-red-500 bg-red-500"
                    : isYes
                        ? "border-red-500 bg-red-500"
                        : "border-green-500 bg-green-500"
                : "border-slate-600 bg-white";

            return (
                <label
                    key={val}
                    className={`group relative flex items-center gap-1.5 cursor-pointer transition-all duration-300 overflow-hidden text-sm font-normal ${colorClass}`}
                >
                    <input
                        type="radio"
                        value={val}
                        checked={isSelected}
                        onChange={(e) => onChange(e.target.value)}
                        className="hidden"
                    />
                    <div className={`relative w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 ${borderClass}`}>
                        {isSelected && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                                <Check className="w-3 h-3 text-bold text-white relative z-10" />
                            </>
                        )}
                    </div>
                    <span className="font-normal capitalize text-[13px]">{val === "yes" ? "Yes" : "No"}</span>
                </label>
            );
        })}
    </div>
);

const CheckboxButton: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}> = ({ id, label, checked, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`inline-flex items-center gap-1.5 p-1.5 rounded-md border transition-all duration-200 ${
            checked
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-slate-300 bg-white text-slate-600"
        }`}
    >
        <div
            className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                checked ? "border-primary-500 bg-primary-500" : "border-slate-400"
            }`}
        >
            {checked && <Check className="w-2.5 h-2.5 text-bold text-white" />}
        </div>
        <span className="text-[12px] font-normal">{label}</span>
    </button>
);

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
    type,
    sub_type,
    isRequired = false,
}) => {
    const damageFieldValue = useWatch({
        control,
        name: `${name}.damage`,
    });

    const imageFieldValue = useWatch({
        control,
        name: `${name}.image`,
    });

    const remarksFieldValue = useWatch({
        control,
        name: `${name}.remarks`,
    });

    const orvmTypeFieldValue = useWatch({
        control,
        name: `${name}.orvm_type`,
    });

    const electricalTypeFieldValue = useWatch({
        control,
        name: `${name}.electrical_type`,
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
        name: `${name}.tread_depth`,
    });

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
    const watchedEngineOilLevelDipstickLeak = useWatch({ control, name: `${name}.engine_oil_leak` });
    const watchedBatteryDamaged = useWatch({ control, name: `${name}.damaged` });
    const watchedBatteryLowCharge = useWatch({ control, name: `${name}.low_charge` });
    const watchedBatteryCorroded = useWatch({ control, name: `${name}.corroded` });
    const watchedCoolantLowLevel = useWatch({ control, name: `${name}.low_level` });
    const watchedCoolantContaminated = useWatch({ control, name: `${name}.contaminated` });
    const watchedCoolantLeaking = useWatch({ control, name: `${name}.leaking` });
    const watchedSumpDamaged = useWatch({ control, name: `${name}.damaged` });
    const watchedSumpLeaking = useWatch({ control, name: `${name}.leaking` });

    const formContext = useFormContext();
    const setValue = setValueProp || formContext?.setValue;

    const [damageValue, setDamageValue] = useState<string>(damageFieldValue || "");
    const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
    const [orvmType, setOrvmType] = useState<"manual" | "electrical" | "">("");
    const [orvmSubOptions, setOrvmSubOptions] = useState<Record<string, boolean>>({});
    const [electricalType, setElectricalType] = useState<"manual" | "electric" | "">("");
    const [remarks, setRemarks] = useState<string>("");
    const [userRemarks, setUserRemarks] = useState<string>("");
    const [autoRemarks, setAutoRemarks] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>(existingImage || "");
    const [videoUrl, setVideoUrl] = useState<string>(existingImage || "");
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const useVideoUpload = fieldType === "exhaust" || fieldType === "gearShifting" || fieldType === "engineSound";

    useEffect(() => {
        if (damageFieldValue !== damageValue) {
            setDamageValue(damageFieldValue || "");
        }
    }, [damageFieldValue]);

    const fieldObjectValue = useWatch({
        control,
        name: name,
    });

    useEffect(() => {
        const imageFromForm = imageFieldValue || fieldObjectValue?.image;
        if (imageFromForm && imageFromForm !== imageUrl) {
            setImageUrl(imageFromForm);
            if (useVideoUpload) {
                setVideoUrl(imageFromForm);
            }
        } else if (!imageFromForm && imageUrl) {
            setImageUrl("");
            if (useVideoUpload) {
                setVideoUrl("");
            }
        }
    }, [imageFieldValue, fieldObjectValue?.image, name, useVideoUpload]);

    useEffect(() => {
        if (useVideoUpload) {
            const videoFromForm = imageFieldValue || fieldObjectValue?.image;
            if (videoFromForm && videoFromForm !== videoUrl) {
                setVideoUrl(videoFromForm);
            } else if (!videoFromForm && videoUrl) {
                setVideoUrl("");
            }
        }
    }, [imageFieldValue, fieldObjectValue?.image, name, useVideoUpload]);

    useEffect(() => {
        const remarksFromForm = remarksFieldValue !== undefined ? remarksFieldValue : fieldObjectValue?.remarks;
        if (remarksFromForm !== undefined && remarksFromForm !== remarks) {
            const formRemarks = remarksFromForm || "";
            
            if (autoRemarks && formRemarks.startsWith(autoRemarks)) {
                const userPart = formRemarks.substring(autoRemarks.length).trim();
                if (userPart.startsWith(".")) {
                    setUserRemarks(userPart.substring(1).trim());
                } else {
                    setUserRemarks(userPart);
                }
            } else if (!autoRemarks) {
                setUserRemarks(formRemarks);
            }
            
            setRemarks(formRemarks);
        }
    }, [remarksFieldValue, fieldObjectValue?.remarks, name, autoRemarks]);

    useEffect(() => {
        const damageFromForm = damageFieldValue || fieldObjectValue?.damage;
        if (damageFromForm && damageFromForm !== damageValue) {
            setDamageValue(damageFromForm);
        }
    }, [damageFieldValue, fieldObjectValue?.damage, name]);

    useEffect(() => {
        if (useVideoUpload && existingImage) {
            setVideoUrl(existingImage);
            setImageUrl(existingImage);
        }
    }, [existingImage, useVideoUpload, name]);

    useEffect(() => {
        if (orvmTypeFieldValue && orvmTypeFieldValue !== orvmType) {
            setOrvmType(orvmTypeFieldValue as "manual" | "electrical");
        }
    }, [orvmTypeFieldValue]);

    useEffect(() => {
        if (electricalTypeFieldValue && electricalTypeFieldValue !== electricalType) {
            setElectricalType(electricalTypeFieldValue as "manual" | "electric");
        }
    }, [electricalTypeFieldValue]);

    const engineOilLeakValue = fieldObjectValue?.engine_oil_leak;
    const brokenValue = fieldObjectValue?.broken;
    
    const prevValuesRef = useRef<{ engineOilLeak?: string; broken?: string }>({});

    useEffect(() => {
        if (fieldType === "engineOilLevelDipstick") {
            const newEngineOilLeak = engineOilLeakValue === "yes";
            const newBroken = brokenValue === "yes";
            const prevEngineOilLeak = prevValuesRef.current.engineOilLeak === "yes";
            const prevBroken = prevValuesRef.current.broken === "yes";
            
            if (prevEngineOilLeak !== newEngineOilLeak || prevBroken !== newBroken) {
                const newOptions: Record<string, boolean> = {};
                engineOilLevelDipstickOptionsList.forEach((option) => {
                    if (option.id === "engine_oil_leak") {
                        newOptions[option.id] = newEngineOilLeak;
                    } else if (option.id === "broken") {
                        newOptions[option.id] = newBroken;
                    }
                });
                
                setSelectedOptions(newOptions);
                prevValuesRef.current = {
                    engineOilLeak: engineOilLeakValue,
                    broken: brokenValue,
                };
            }
        }
    }, [fieldType, engineOilLeakValue, brokenValue]);

    useEffect(() => {
        if (fieldType === "engineOilLevelDipstick" && setValue) {
            engineOilLevelDipstickOptionsList.forEach((option) => {
                const isSelected = selectedOptions[option.id] || false;
                if (option.id === "engine_oil_leak") {
                    setValue(`${name}.engine_oil_leak` as any, isSelected ? "yes" : "no", { shouldValidate: false });
                } else if (option.id === "broken") {
                    setValue(`${name}.broken` as any, isSelected ? "yes" : "no", { shouldValidate: false });
                }
            });
        }
    }, [selectedOptions, fieldType, name]);

    const commonOptions: DamageOption[] = [
        { id: "dented", label: "Dented" },
        { id: "scratched", label: "Scratched" },
        { id: "repainted", label: "Repainted" },
        { id: "damaged", label: "Damaged" },
        { id: "surface_rust", label: "Surface Rust" },
        { id: "replaced", label: "Replaced" },
    ];

    const lightOption: DamageOption = { id: "faded", label: "Faded", showInLight: true };

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

    const engineOilLevelDipstickOptionsList: DamageOption[] = [
        { id: "broken", label: "Broken" },
        { id: "engine_oil_leak", label: "Engine Oil Leak" },
    ];

    const airConditionOptionsList: DamageOption[] = [
        { id: "not_working", label: "Not Working" },
    ];

    const electricalInteriorOptionsList: DamageOption[] = [
        { id: "not_working", label: "Not Working" },
    ];

    const electricalManualOptionsList: DamageOption[] = [
        { id: "glass_broken", label: "Glass Broken" },
        { id: "abnormal_sound", label: "Abnormal Sound" },
    ];

    const electricalElectricOptionsList: DamageOption[] = [
        { id: "electric_motor_not_working", label: "Electric motor not working" },
        { id: "glass_broken", label: "Glass Broken" },
        { id: "abnormal_sound", label: "Abnormal Sound" },
    ];

    const getDisplayOptions = () => {
        const options = [...commonOptions];
        if (fieldType === "light") {
            options.push(lightOption);
        }
        return options;
    };

    const isEngineFieldType = fieldType === "engine" || fieldType === "engineSound" || fieldType === "engineMounting" || fieldType === "clutch" || fieldType === "gearShifting" || fieldType === "engineOil" || fieldType === "battery" || fieldType === "coolant" || fieldType === "sump";
    
    const excludedFieldTypes = ["tyre", "steering", "brake", "suspension", "exhaust", "interior", "seats"];
    const shouldShowOptions = !excludedFieldTypes.includes(fieldType);

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
            case "engineOilLevelDipstick":
                return engineOilLevelDipstickOptionsList;
            default:
                return [];
        }
    };

    const getAllAvailableOptions = (): DamageOption[] => {
        if (fieldType === "electrical") {
            if (electricalType === "manual") {
                return electricalManualOptionsList;
            } else if (electricalType === "electric") {
                return electricalElectricOptionsList;
            }
            return [];
        } else if (fieldType === "airCondition") {
            return airConditionOptionsList;
        } else if (fieldType === "electricalInterior") {
            return electricalInteriorOptionsList;
        } else if (fieldType === "engineOilLevelDipstick") {
            return engineOilLevelDipstickOptionsList;
        } else if (isEngineFieldType) {
            return getEngineOptions();
        } else {
            return getDisplayOptions();
        }
    };

    const syncOptionsFromRemarks = (remarksText: string) => {
        if (!shouldShowOptions || damageValue !== "yes" || !setValue) return;

        const availableOptions = getAllAvailableOptions();
        const fullTextToMatch = remarksText.toLowerCase().trim();

        if (isEngineFieldType) {
            availableOptions.forEach((option) => {
                const optionLabel = option.label.toLowerCase();
                const regex = new RegExp(`\\b${optionLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                const isMentioned = regex.test(fullTextToMatch);
                
                const currentValue = (() => {
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
                        "leaking": fieldType === "engineOil" ? watchedEngineOilLeaking : (fieldType === "coolant" ? watchedCoolantLeaking : (fieldType === "sump" ? watchedSumpLeaking : "")),
                        "engine_oil_leak": watchedEngineOilLevelDipstickLeak,
                        "damaged": fieldType === "battery" ? watchedBatteryDamaged : (fieldType === "sump" ? watchedSumpDamaged : ""),
                        "low_charge": watchedBatteryLowCharge,
                        "corroded": watchedBatteryCorroded,
                        "low_level": watchedCoolantLowLevel,
                        "contaminated": watchedCoolantContaminated,
                    };
                    return watchedValuesMap[option.id] || "";
                })();

                const shouldBeSelected = isMentioned;
                const isCurrentlySelected = currentValue === "yes";

                if (shouldBeSelected !== isCurrentlySelected) {
                    setValue(`${name}.${option.id}` as any, shouldBeSelected ? "yes" : "no", { shouldValidate: false });
                }
            });
        } else {
            const newSelectedOptions: Record<string, boolean> = { ...selectedOptions };

            availableOptions.forEach((option) => {
                const optionLabel = option.label.toLowerCase();
                const escapedLabel = optionLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b${escapedLabel}\\b`, 'i');
                const isMentioned = regex.test(fullTextToMatch);
                
                newSelectedOptions[option.id] = isMentioned;
            });

            const hasChanges = availableOptions.some(
                (option) => newSelectedOptions[option.id] !== selectedOptions[option.id]
            );

            if (hasChanges) {
                setSelectedOptions(newSelectedOptions);
            }

            if (fieldType === "orvm" && orvmType === "electrical" && setValue) {
                const foldingMentioned = /\bfolding\s+mirror\s+(not\s+)?working\b/i.test(fullTextToMatch);
                const foldingNotWorking = /\bfolding\s+mirror\s+not\s+working\b/i.test(fullTextToMatch);
                const currentFoldingValue = foldingMirrorValue;
                const shouldBeFoldingNo = foldingNotWorking;
                const shouldBeFoldingYes = foldingMentioned && !foldingNotWorking;
                
                if (shouldBeFoldingNo && currentFoldingValue !== "no") {
                    setValue(`${name}.folding_mirror_working` as any, "no", { shouldValidate: false });
                } else if (shouldBeFoldingYes && currentFoldingValue !== "yes") {
                    setValue(`${name}.folding_mirror_working` as any, "yes", { shouldValidate: false });
                } else if (!foldingMentioned && currentFoldingValue === "no") {
                    setValue(`${name}.folding_mirror_working` as any, "yes", { shouldValidate: false });
                }

                const motorMentioned = /\bmirror\s+adjust\s+motor\s+(not\s+)?working\b/i.test(fullTextToMatch);
                const motorNotWorking = /\bmirror\s+adjust\s+motor\s+not\s+working\b/i.test(fullTextToMatch);
                const currentMotorValue = mirrorMotorValue;
                const shouldBeMotorNo = motorNotWorking;
                const shouldBeMotorYes = motorMentioned && !motorNotWorking;
                
                if (shouldBeMotorNo && currentMotorValue !== "no") {
                    setValue(`${name}.mirror_adjust_motor` as any, "no", { shouldValidate: false });
                } else if (shouldBeMotorYes && currentMotorValue !== "yes") {
                    setValue(`${name}.mirror_adjust_motor` as any, "yes", { shouldValidate: false });
                } else if (!motorMentioned && currentMotorValue === "no") {
                    setValue(`${name}.mirror_adjust_motor` as any, "yes", { shouldValidate: false });
                }
            }
        }
    };

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

    useEffect(() => {
        if (damageValue === "yes") {
            const activeLabels: string[] = [];
            const userRemarksLower = userRemarks.toLowerCase().trim();

            // Helper function to check if label already exists in userRemarks
            const isLabelInUserRemarks = (label: string): boolean => {
                if (!userRemarksLower) return false;
                const labelLower = label.toLowerCase();
                const regex = new RegExp(`\\b${labelLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                return regex.test(userRemarksLower);
            };

            if (shouldShowOptions) {

                if (fieldType === "electrical") {
                    if (electricalType === "manual") {
                        electricalManualOptionsList.forEach((option) => {
                            if (selectedOptions[option.id] && !isLabelInUserRemarks(option.label)) {
                                activeLabels.push(option.label);
                            }
                        });
                    } else if (electricalType === "electric") {
                        electricalElectricOptionsList.forEach((option) => {
                            if (selectedOptions[option.id] && !isLabelInUserRemarks(option.label)) {
                                activeLabels.push(option.label);
                            }
                        });
                    }
                } else if (fieldType === "airCondition") {
                    const selectedAirConditionOptions = airConditionOptionsList.filter((option) => 
                        selectedOptions[option.id] && !isLabelInUserRemarks(option.label)
                    );
                    if (selectedAirConditionOptions.length > 0) {
                        const optionLabels = selectedAirConditionOptions.map((option) => option.label).join(", ");
                        activeLabels.push(`${label} ${optionLabels}`);
                    }
                } else if (fieldType === "electricalInterior") {
                    const selectedElectricalInteriorOptions = electricalInteriorOptionsList.filter((option) => 
                        selectedOptions[option.id] && !isLabelInUserRemarks(option.label)
                    );
                    if (selectedElectricalInteriorOptions.length > 0) {
                        const optionLabels = selectedElectricalInteriorOptions.map((option) => option.label).join(", ");
                        activeLabels.push(`${label} ${optionLabels}`);
                    }
                } else if (fieldType === "engineOilLevelDipstick") {
                    const selectedEngineOilLevelDipstickOptions = engineOilLevelDipstickOptionsList.filter((option) => 
                        selectedOptions[option.id] && !isLabelInUserRemarks(option.label)
                    );
                    if (selectedEngineOilLevelDipstickOptions.length > 0) {
                        const optionLabels = selectedEngineOilLevelDipstickOptions.map((option) => option.label).join(", ");
                        activeLabels.push(optionLabels);
                    }
                } else if (isEngineFieldType) {
                    const engineOptions = getEngineOptions();
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
                        "leaking": fieldType === "engineOil" ? watchedEngineOilLeaking : (fieldType === "coolant" ? watchedCoolantLeaking : (fieldType === "sump" ? watchedSumpLeaking : "")),
                        "engine_oil_leak": watchedEngineOilLevelDipstickLeak,
                        "damaged": fieldType === "battery" ? watchedBatteryDamaged : (fieldType === "sump" ? watchedSumpDamaged : ""),
                        "low_charge": watchedBatteryLowCharge,
                        "corroded": watchedBatteryCorroded,
                        "low_level": watchedCoolantLowLevel,
                        "contaminated": watchedCoolantContaminated,
                    };
                    
                    engineOptions.forEach((option) => {
                        const optionValue = watchedValuesMap[option.id];
                        if (optionValue === "yes" && !isLabelInUserRemarks(option.label)) {
                            activeLabels.push(option.label);
                        }
                    });
                } else {
                    getDisplayOptions().forEach((option) => {
                        if (selectedOptions[option.id] && !isLabelInUserRemarks(option.label)) {
                            activeLabels.push(option.label);
                        }
                    });

                    if (fieldType === "orvm" && orvmType === "electrical") {
                        if (foldingMirrorValue === "no" && !isLabelInUserRemarks("Folding Mirror Not Working")) {
                            activeLabels.push("Folding Mirror Not Working");
                        }
                        if (mirrorMotorValue === "no" && !isLabelInUserRemarks("Mirror Adjust Motor Not Working")) {
                            activeLabels.push("Mirror Adjust Motor Not Working");
                        }
                    }
                }
            }

            const newAutoRemarks = activeLabels.join(", ");
            const prevAutoRemarks = autoRemarks;
            setAutoRemarks(newAutoRemarks);
            
            if (newAutoRemarks !== prevAutoRemarks) {
                const combinedRemarks = newAutoRemarks 
                    ? (userRemarks ? `${newAutoRemarks}. ${userRemarks}` : newAutoRemarks)
                    : userRemarks;
                
                if (combinedRemarks !== remarks) {
                    setRemarks(combinedRemarks);
                    if (setValue) {
                        setValue(`${name}.remarks` as any, combinedRemarks, { shouldValidate: true });
                    }
                }
            }
        } else if (damageValue === "no") {
            setAutoRemarks("");
        }
    }, [selectedOptions, orvmType, electricalType, fieldType, damageValue, name, foldingMirrorValue, mirrorMotorValue, userRemarks, isEngineFieldType, watchedEngineRepaired, watchedEngineLongCranking, watchedEngineElectricalWiring, watchedEngineSoundBlowBy, watchedEngineSound, watchedEngineMountingVibration, watchedEngineMountingAbnormal, watchedClutchHard, watchedGearShiftingNoise, watchedGearShiftingHard, watchedGearShiftingAxle, watchedEngineOilLeaking, watchedEngineOilLevelDipstickLeak, watchedBatteryDamaged, watchedBatteryLowCharge, watchedBatteryCorroded, watchedCoolantLowLevel, watchedCoolantContaminated, watchedCoolantLeaking, watchedSumpDamaged, watchedSumpLeaking, label]);

    const handleImageUpload = (url: string) => {
        setImageUrl(url);
        if (setValue) {
            setValue(`${name}.image` as any, url, { shouldValidate: false });
        }
        if (onImageUpload) {
            onImageUpload(url);
        }
    };

    const handleVideoUpload = (url: string) => {
        setVideoUrl(url);
        if (setValue) {
            setValue(`${name}.image` as any, url, { shouldValidate: false });
        }
        if (onImageUpload) {
            onImageUpload(url);
        }
    };

    const isRemarksRequired = damageValue === "yes";
    const isImageMandatory = type !== undefined && sub_type !== undefined ? isImageRequired(type, sub_type) : false;

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
                        <h3 className="text-[13px] font-semibold text-primary-700 flex items-center gap-1">
                            <span>{label}</span>
                            {isRequired && (
                                <span className="inline-flex items-center rounded font-bold text-red-500 uppercase tracking-wide">
                                    *
                                </span>
                            )}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {(useVideoUpload ? videoUrl : imageUrl) && (
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
                            {useVideoUpload ? (
                                <UploadVideoBox
                                    label={uploadLabel || `Upload ${label} Video`}
                                    category="inspection_video"
                                    existingVideo={videoUrl}
                                    onUploadComplete={handleVideoUpload}
                                    onUploadError={() => {}}
                                    required={isImageMandatory}
                                />
                            ) : (
                                <UploadImageBox
                                    label={uploadLabel || `Upload ${label} Image`}
                                    category="car"
                                    existingImage={imageUrl}
                                    onUploadComplete={handleImageUpload}
                                    onUploadError={() => {}}
                                    required={isImageMandatory}
                                />
                            )}
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
                                name={`${name}.tread_depth`}
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

                    {/* Electrical Type Selection - Only for Electrical */}
                    {fieldType === "electrical" && (
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-slate-700">
                                Type <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name={`${name}.electrical_type`}
                                control={control}
                                rules={{ required: "Please select type" }}
                                render={({ field }) => (
                                    <div className="flex flex-wrap gap-2">
                                        {["manual", "electric"].map((type) => (
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
                                                        setElectricalType(e.target.value as "manual" | "electric");
                                                        // Clear selected options when type changes
                                                        setSelectedOptions({});
                                                        setRemarks("");
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
                                                <span className="text-[12px] font-normal capitalize">{type === "manual" ? "Manual" : "Electric power motor"}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>
                    )}

                    {/* Damage Yes/No - Hide for electrical until type is selected.
                        For interior and seats, damage is optional (not required in UI),
                        but API will always receive is_damage = false from the payload transform.
                    */}
                    {(fieldType !== "electrical" || electricalType) && (
                        <div className="flex items-center justify-between gap-3">
                            <label className="flex items-center gap-1 text-[13px] font-bold text-slate-700 whitespace-nowrap">
                                <AlertTriangle className="h-3.5 w-3.5 text-warning mr-1" />
                                Damage Status
                                {(fieldType !== "interior" && fieldType !== "seats") && (
                                    <span className="text-error">*</span>
                                )}
                            </label>
                            <Controller
                                name={`${name}.damage`}
                                control={control}
                                rules={
                                    fieldType === "interior" || fieldType === "seats"
                                        ? undefined
                                        : { required: "Please select damage status" }
                                }
                                render={({ field }) => (
                                    <YesNoRadio
                                        value={field.value || ""}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            setDamageValue(value);
                                            if (value === "no") {
                                                setSelectedOptions({});
                                                setOrvmSubOptions({});
                                                setOrvmType("");
                                                setRemarks("");
                                            }
                                        }}
                                        name={`${name}.damage`}
                                    />
                                )}
                            />
                        </div>
                    )}

                    {/* Options Section - Only show if damage is yes and fieldType is not excluded */}
                    {damageValue === "yes" && shouldShowOptions && (
                        <div className="space-y-2">
                            {/* Air Condition Options (checkbox style, only "Not Working") */}
                            {fieldType === "airCondition" ? (
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-slate-700">Damage Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {airConditionOptionsList.map((option) => (
                                            <CheckboxButton
                                                key={option.id}
                                                id={option.id}
                                                label={option.label}
                                                checked={selectedOptions[option.id] || false}
                                                onChange={() => {
                                                    setSelectedOptions((prev) => ({
                                                        ...prev,
                                                        [option.id]: !prev[option.id],
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : fieldType === "electricalInterior" ? (
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-slate-700">Damage Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {electricalInteriorOptionsList.map((option) => (
                                            <CheckboxButton
                                                key={option.id}
                                                id={option.id}
                                                label={option.label}
                                                checked={selectedOptions[option.id] || false}
                                                onChange={() => {
                                                    setSelectedOptions((prev) => ({
                                                        ...prev,
                                                        [option.id]: !prev[option.id],
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : fieldType === "electrical" && electricalType ? (
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-slate-700">Damage Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(electricalType === "manual" ? electricalManualOptionsList : electricalElectricOptionsList).map((option) => (
                                            <CheckboxButton
                                                key={option.id}
                                                id={option.id}
                                                label={option.label}
                                                checked={selectedOptions[option.id] || false}
                                                onChange={() => {
                                                    setSelectedOptions((prev) => ({
                                                        ...prev,
                                                        [option.id]: !prev[option.id],
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : fieldType === "engineOilLevelDipstick" ? (
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-slate-700">Damage Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {engineOilLevelDipstickOptionsList.map((option) => (
                                            <CheckboxButton
                                                key={option.id}
                                                id={option.id}
                                                label={option.label}
                                                checked={selectedOptions[option.id] || false}
                                                onChange={() => {
                                                    setSelectedOptions((prev) => ({
                                                        ...prev,
                                                        [option.id]: !prev[option.id],
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : isEngineFieldType ? (
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
                                                    <YesNoRadio
                                                        value={optionField.value || ""}
                                                        onChange={optionField.onChange}
                                                        name={`${name}.${option.id}`}
                                                    />
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : fieldType !== "electrical" ? (
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-slate-700">Damage Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {getDisplayOptions().map((option) => (
                                            <CheckboxButton
                                                key={option.id}
                                                id={option.id}
                                                label={option.label}
                                                checked={selectedOptions[option.id] || false}
                                                onChange={() => {
                                                    setSelectedOptions((prev) => ({
                                                        ...prev,
                                                        [option.id]: !prev[option.id],
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}

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
                                                                <YesNoRadio
                                                                    value={subField.value || ""}
                                                                    onChange={(value) => {
                                                                        subField.onChange(value);
                                                                        setOrvmSubOptions((prev) => ({
                                                                            ...prev,
                                                                            [subOption.id]: value === "yes",
                                                                        }));
                                                                    }}
                                                                    name={`${name}.${subOption.id}`}
                                                                    reversed
                                                                />
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
                            <Notebook className="w-3.5 h-3.5 text-amber-500" />
                            Remarks
                            {isRemarksRequired && <span className="text-red-500">*</span>}
                            {!isRemarksRequired && <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>}
                        </label>
                        <div className="relative">
                            <Controller
                                name={`${name}.remarks`}
                                control={control}
                                rules={isRemarksRequired ? { required: "Remarks are required" } : undefined}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            
                                            if (autoRemarks && newValue.startsWith(autoRemarks)) {
                                                const prefix = `${autoRemarks}. `;
                                                if (newValue.startsWith(prefix)) {
                                                    const userPart = newValue.substring(prefix.length);
                                                    setUserRemarks(userPart);
                                                    syncOptionsFromRemarks(newValue);
                                                } else if (newValue.startsWith(autoRemarks)) {
                                                    const remaining = newValue.substring(autoRemarks.length);
                                                    if (remaining.startsWith(". ")) {
                                                        setUserRemarks(remaining.substring(2));
                                                        syncOptionsFromRemarks(newValue);
                                                    } else if (remaining.startsWith(".")) {
                                                        setUserRemarks(remaining.substring(1));
                                                        syncOptionsFromRemarks(newValue);
                                                    } else {
                                                        setUserRemarks(remaining);
                                                        syncOptionsFromRemarks(newValue);
                                                    }
                                                }
                                            } else if (!autoRemarks) {
                                                setUserRemarks(newValue);
                                                syncOptionsFromRemarks(newValue);
                                            }
                                            
                                            field.onChange(e);
                                        }}
                                        placeholder={
                                            damageValue === "yes"
                                                ? autoRemarks 
                                                    ? `${autoRemarks}. Add additional notes here...`
                                                    : "Selected options will appear here automatically..."
                                                : "Add any additional remarks (optional)"
                                        }
                                        rows={3}
                                        className={`w-full px-3 py-2 text-[13px] border-[1.5px] rounded-lg transition-all duration-200 focus:outline-none placeholder:text-slate-400 text-slate-800 resize-y ${
                                            error
                                                ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                                                : "border-slate-200 bg-slate-50/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:bg-white"
                                        }`}
                                    />
                                )}
                            />
                            {error && (
                                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {error.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Error Display - Show at bottom of field */}
                    {error && (
                        <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-medium">{error.message || "This field has an error"}</span>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
};

export default InspectionField;

