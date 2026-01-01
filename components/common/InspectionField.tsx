"use client";

import React, { useState, useEffect } from "react";
import { Control, Controller, FieldError, useWatch, useFormContext, UseFormSetValue } from "react-hook-form";
import UploadBox from "@/components/common/UploadBox";
import TextArea from "@/components/FormComponent/TextArea";
import { AlertCircle, CheckCircle2, Sparkles, AlertTriangle, Check } from "lucide-react";

export type FieldType = "pillar" | "light" | "orvm";

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

  // Get setValue from useFormContext or use the prop
  const formContext = useFormContext();
  const setValue = setValueProp || formContext?.setValue;
  
  if (!setValue) {
    console.error("setValue is required for InspectionField");
  }
  
  const [damageValue, setDamageValue] = useState<string>(damageFieldValue || "");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [orvmType, setOrvmType] = useState<"manual" | "electrical" | "">("");
  const [orvmSubOptions, setOrvmSubOptions] = useState<Record<string, boolean>>({});
  const [remarks, setRemarks] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>(existingImage || "");

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

  // Get options to display based on field type
  const getDisplayOptions = () => {
    const options = [...commonOptions];
    if (fieldType === "light") {
      options.push(lightOption);
    }
    return options;
  };

  // Update remarks when options change
  useEffect(() => {
    if (damageValue === "yes") {
      const activeLabels: string[] = [];
      
      // Add common and light-specific options
      getDisplayOptions().forEach((option) => {
        if (selectedOptions[option.id]) {
          activeLabels.push(option.label);
        }
      });

      // Add ORVM sub-options if electrical (only add if yes)
      if (fieldType === "orvm" && orvmType === "electrical") {
        if (foldingMirrorValue === "yes") {
          activeLabels.push("Folding Mirror Working");
        }
        if (mirrorMotorValue === "yes") {
          activeLabels.push("Mirror Adjust Motor");
        }
      }

      const newRemarks = activeLabels.join(", ");
      setRemarks(newRemarks);
      if (setValue) {
        setValue(`${name}.remarks` as any, newRemarks, { shouldValidate: true });
      }
    } else if (damageValue === "no") {
      setRemarks("");
      if (setValue) {
        setValue(`${name}.remarks` as any, "", { shouldValidate: true });
      }
    }
  }, [selectedOptions, orvmType, fieldType, damageValue, name, setValue, foldingMirrorValue, mirrorMotorValue]);

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
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* Decorative gradient header */}
      <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 py-2.5 border-b border-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <h3 className="text-base font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {label}
            </h3>
          </div>
          {imageUrl && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-200">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              <span className="text-[10px] font-semibold text-green-700">Uploaded</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Upload Box */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
          <div className="relative">
            <UploadBox
              label={uploadLabel || `Upload ${label} Image`}
              category="car_inspection"
              existingImage={imageUrl}
              onUploadComplete={handleImageUpload}
              onUploadError={(error) => {
                console.error("Image upload error:", error);
              }}
            />
          </div>
        </div>

        {/* Damage Yes/No */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            Damage Status
            <span className="text-red-500">*</span>
          </label>
          <Controller
            name={`${name}.damage`}
            control={control}
            rules={{ required: "Please select damage status" }}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {["yes", "no"].map((value) => (
                  <label
                    key={value}
                    className={`group relative flex items-center justify-center gap-2 cursor-pointer px-3 py-2 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                      field.value === value
                        ? value === "yes"
                          ? "border-red-300 bg-gradient-to-br from-red-50 to-red-100/50 text-red-700 shadow-md shadow-red-100"
                          : "border-green-300 bg-gradient-to-br from-green-50 to-green-100/50 text-green-700 shadow-md shadow-green-100"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/50"
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
                      className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        field.value === value
                          ? value === "yes"
                            ? "border-red-500 bg-red-500 shadow-lg shadow-red-300/50"
                            : "border-green-500 bg-green-500 shadow-lg shadow-green-300/50"
                          : "border-slate-400 bg-white"
                      }`}
                    >
                      {field.value === value && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                          <Check className="w-2.5 h-2.5 text-white relative z-10" />
                        </>
                      )}
                    </div>
                    <span className="font-semibold capitalize text-xs">{value === "yes" ? "Yes, Damaged" : "No Damage"}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Options Section - Only show if damage is yes */}
        {damageValue === "yes" && (
          <div className="space-y-3 p-3 rounded-lg bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 border border-slate-200/60 shadow-inner">
            {/* Common and Light-specific Options */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-800 tracking-wide">
                  Select Damage Types
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                    className={`group relative flex items-center gap-1.5 px-2.5 py-2 rounded-md border-2 transition-all duration-300 overflow-hidden ${
                      selectedOptions[option.id]
                        ? "border-blue-400 bg-gradient-to-br from-blue-50 via-primary-50 to-primary-100 text-blue-700 shadow-md shadow-blue-200/50"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30"
                    }`}
                  >
                    {selectedOptions[option.id] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                    <div
                      className={`relative w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedOptions[option.id]
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {selectedOptions[option.id] && (
                        <Check className="w-3.5 h-3.5 text-semibold text-white" />
                      )}
                    </div>
                    <span className={`text-xs font-normal relative z-10 ${selectedOptions[option.id] ? "text-blue-700" : "text-slate-600"}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ORVM Type Selection - Only for ORVM */}
            {fieldType === "orvm" && (
              <div className="space-y-2 pt-2 border-t border-slate-300/60">
                <div className="flex items-center gap-1.5">
                  <div className="w-0.5 h-4 rounded-full bg-gradient-to-b from-purple-500 to-pink-600"></div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    ORVM Type <span className="text-red-500">*</span>
                  </label>
                </div>
                <Controller
                  name={`${name}.orvm_type`}
                  control={control}
                  rules={{ required: "Please select ORVM type" }}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {["manual", "electrical"].map((type) => (
                        <label
                          key={type}
                          className={`group relative flex items-center justify-center gap-2 cursor-pointer px-3 py-2 rounded-lg border-2 transition-all duration-300 capitalize overflow-hidden ${
                            field.value === type
                              ? "border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-700 shadow-md shadow-purple-100"
                              : "border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:bg-purple-50/30"
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
                            className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              field.value === type
                                ? "border-purple-500 bg-purple-500 shadow-lg shadow-purple-300/50"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {field.value === type && (
                              <>
                                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                                <Check className="w-2.5 h-2.5 text-white relative z-10" />
                              </>
                            )}
                          </div>
                          <span className="font-semibold text-xs">{type === "manual" ? "Manual" : "Electrical"}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />

                {/* ORVM Sub-options - Always show labels when electrical, yes/no for each */}
                {orvmType === "electrical" && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-0.5 h-3.5 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600"></div>
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                        Electrical Features <span className="text-slate-500 text-[10px] font-normal normal-case">(Required)</span>
                      </label>
                    </div>
                    <div className="space-y-2 pl-2">
                      {orvmSubOptionsList.map((subOption) => (
                        <div key={subOption.id} className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            {subOption.label}
                          </label>
                          <Controller
                            name={`${name}.${subOption.id}`}
                            control={control}
                            rules={{ required: `Please select status for ${subOption.label}` }}
                            render={({ field: subField }) => (
                              <div className="grid grid-cols-2 gap-2">
                                {["yes", "no"].map((value) => (
                                  <label
                                    key={value}
                                    className={`group relative flex items-center justify-center gap-1.5 cursor-pointer px-2.5 py-2 rounded-md border-2 transition-all duration-300 overflow-hidden ${
                                      subField.value === value
                                        ? value === "yes"
                                          ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-md shadow-green-100"
                                          : "border-red-400 bg-gradient-to-br from-red-50 to-rose-50 text-red-700 shadow-md shadow-red-100"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
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
                                      className={`relative w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                        subField.value === value
                                          ? value === "yes"
                                            ? "border-green-500 bg-green-500 shadow-lg shadow-green-300/50"
                                            : "border-red-500 bg-red-500 shadow-lg shadow-red-300/50"
                                          : "border-slate-400 bg-white"
                                      }`}
                                    >
                                      {subField.value === value && (
                                        <>
                                          <div className={`absolute inset-0 rounded-full ${value === "yes" ? "bg-white/30" : "bg-white/30"} animate-ping`}></div>
                                          <Check className="w-2 h-2 text-white relative z-10" />
                                        </>
                                      )}
                                    </div>
                                    <span className="text-xs font-semibold capitalize">{value}</span>
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
            <div className="w-0.5 h-3.5 rounded-full bg-gradient-to-b from-amber-500 to-orange-600"></div>
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
              inputClassName="px-3 py-2 text-sm border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              error={error}
            />
            {damageValue === "yes" && remarks && (
              <div className="absolute top-1.5 right-1.5">
                <div className="px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                  <span className="text-[10px] font-medium text-blue-700">Auto-filled</span>
                </div>
              </div>
            )}
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
    </div>
  );
};

export default InspectionField;

