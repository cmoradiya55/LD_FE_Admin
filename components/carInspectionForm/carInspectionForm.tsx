"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import TextInput from "@/components/FormComponent/TextInput";
import { Button } from "@/components/Button/Button";
import UploadBox from "@/components/common/UploadBox";
import InspectionField from "@/components/common/InspectionField";
import {
  Car,
  FileText,
  CheckCircle2,
  Wrench,
  Camera,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { saveInspectionProcess } from "@/utils/axios/auth";

interface InspectionFormData {
  registration_number: string;
  registartion_year: number;
  km_driven: number;
  rc_image: string;
  insurance_image: string;
  // Exterior fields
  pillar_lhs_a?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  pillar_lhs_b?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  light_lhs_headlight?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  light_rhs_headlight?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  orvm_lhs?: {
    damage: string;
    remarks: string;
    image?: string;
    orvm_type?: string;
    folding_mirror_working?: string;
    mirror_adjust_motor?: string;
  };
  orvm_rhs?: {
    damage: string;
    remarks: string;
    image?: string;
    orvm_type?: string;
    folding_mirror_working?: string;
    mirror_adjust_motor?: string;
  };
}

const CarInspectionForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const [rcImage, setRcImage] = useState<string>("");
  const [insuranceImage, setInsuranceImage] = useState<string>("");

  const {control, watch, handleSubmit, setValue, formState: { errors } } = useForm<InspectionFormData>({
    defaultValues: {
      registration_number: "",
      registartion_year: 0,
      km_driven: 0,
      rc_image: "",
      insurance_image: "",
    },
  });

  const sections = [
    { id: 0, name: "Car Details", icon: Car },
    { id: 1, name: "Exterior", icon: Camera },
    { id: 2, name: "Interior", icon: FileText },
    { id: 3, name: "Mechanical", icon: Wrench },
    { id: 4, name: "Assessment", icon: CheckCircle2 },
  ];

  const handleNextSection = async () => {
    if (!carId) {
      toast.error("Car ID is missing");
      return;
    }

    setIsSaving(true);
    try {
      const formValues = watch();
      
      const payload = {
        images: [],
        registration_number: formValues.registration_number || "",
        registartion_year: formValues.registartion_year || 0,
        rc_image: rcImage || "",
        insurance_image: insuranceImage || "",
        km_driven: formValues.km_driven || 0,
      };

      console.log("Saving inspection progress (draft):", payload);
      const response = await saveInspectionProcess(carId, payload);

      if (response?.code === 200) {
        toast.success("Draft saved successfully");
        setCurrentSection((prev) => prev + 1);
      } else {
        console.error("Failed to save inspection progress:", response);
        toast.error(response?.message || "Failed to save draft");
      }
    } catch (error: any) {
      console.error("Error saving inspection progress:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred while saving draft";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: InspectionFormData) => {
    setIsSubmitting(true);
    try {
      const inspectionData = {
        ...data,
        rc_image: rcImage,
        insurance_image: insuranceImage,
      };

      console.log("Inspection Data:", inspectionData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Inspection form submitted successfully!");
      router.push("/inspector/inspectorDashboard");
    } catch (error) {
      toast.error("Failed to submit inspection form. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="self-start text-slate-800 p-2 bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Car Inspection
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="py-4 px-2 rounded-2xl bg-white shadow-lg border border-slate-200">
          <div className="flex items-start w-full">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = currentSection === index;
              const isCompleted = currentSection > index;

              return (
                <React.Fragment key={section.id}>
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    {/* Icon Button */}
                    <button
                      type="button"
                      onClick={() => setCurrentSection(index)}
                      className={`group relative flex items-center justify-center transition-all duration-300 ${isActive
                        ? "scale-105"
                        : "hover:scale-105"
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${isActive
                          ? "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400 ring-offset-2"
                          : isCompleted
                            ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md ring-1 ring-green-400 ring-offset-2"
                            : "bg-slate-100 text-slate-500 border border-slate-300"
                          }`}
                      >
                        <Icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                        {isActive && (
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        )}
                      </div>
                    </button>

                    {/* Step Label */}
                    <div
                      className={`text-[11px] font-semibold text-center leading-tight transition-colors mt-4 ${isActive
                        ? "text-blue-700"
                        : isCompleted
                          ? "text-green-700"
                          : "text-slate-500"
                        }`}
                    >
                      {section.name}
                    </div>
                  </div>

                  {/* Connector Line - Centered with icon button */}
                  {index < sections.length - 1 && (
                    <div className="flex items-center flex-shrink-0" style={{ height: '40px', marginTop: '2px' }}>
                      <div className="h-0.5 w-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isCompleted
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 w-full"
                            : "bg-slate-200 w-full"
                            }`}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 border-2 border-slate-200/60 shadow-lg">

            {/* Section 1: Car Details */}
            {currentSection === 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Car Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <TextInput
                    name="registration_number"
                    control={control}
                    label="Registration Number"
                    placeholder="Enter registration number"
                    required
                    error={errors.registration_number}
                  />
                  <TextInput
                    name="registartion_year"
                    control={control}
                    label="Registration Year"
                    type="number"
                    placeholder="e.g., 2021"
                    required
                    error={errors.registartion_year}
                  />
                  <TextInput
                    name="km_driven"
                    control={control}
                    label="KM Driven"
                    type="number"
                    placeholder="e.g., 95000"
                    required
                    error={errors.km_driven}
                  />
                </div>

                {/* RC Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-3">
                    RC Image {rcImage && <span className="text-green-600">✓</span>}
                  </label>
                  <UploadBox
                    label="Upload RC Image"
                    category="document"
                    existingImage={rcImage}
                    onUploadComplete={(url) => {
                      setRcImage(url);
                      toast.success("RC image uploaded successfully!");
                    }}
                    onUploadError={(error) => {
                      console.error("RC image upload error:", error);
                      toast.error("Failed to upload RC image");
                    }}
                  />
                </div>

                {/* Insurance Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-3">
                    Insurance Image {insuranceImage && <span className="text-green-600">✓</span>}
                  </label>
                  <UploadBox
                    label="Upload Insurance Image"
                    category="document"
                    existingImage={insuranceImage}
                    onUploadComplete={(url) => {
                      setInsuranceImage(url);
                      toast.success("Insurance image uploaded successfully!");
                    }}
                    onUploadError={(error) => {
                      console.error("Insurance image upload error:", error);
                      toast.error("Failed to upload Insurance image");
                    }}
                  />
                </div>
              </div>
            )}

            {/* Section 2: Exterior Condition */}
            {currentSection === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Exterior Condition
                  </h2>
                </div>

                <div className="space-y-6">
                  <InspectionField
                    name="pillar_lhs_a"
                    control={control}
                    label="Pillar LHS A"
                    fieldType="pillar"
                    uploadLabel="Upload Pillar LHS A Image"
                    setValue={setValue}
                  />

                  <InspectionField
                    name="pillar_lhs_b"
                    control={control}
                    label="Pillar LHS B"
                    fieldType="pillar"
                    uploadLabel="Upload Pillar LHS B Image"
                    setValue={setValue}
                  />

                  <InspectionField
                    name="light_lhs_headlight"
                    control={control}
                    label="Light LHS Headlight"
                    fieldType="light"
                    uploadLabel="Upload LHS Headlight Image"
                    setValue={setValue}
                  />

                  <InspectionField
                    name="light_rhs_headlight"
                    control={control}
                    label="Light RHS Headlight"
                    fieldType="light"
                    uploadLabel="Upload RHS Headlight Image"
                    setValue={setValue}
                  />

                  <InspectionField
                    name="orvm_lhs"
                    control={control}
                    label="ORVM - Manual / Electrical LHS"
                    fieldType="orvm"
                    uploadLabel="Upload ORVM LHS Image"
                    setValue={setValue}
                  />

                  <InspectionField
                    name="orvm_rhs"
                    control={control}
                    label="ORVM - Manual / Electrical RHS"
                    fieldType="orvm"
                    uploadLabel="Upload ORVM RHS Image"
                    setValue={setValue}
                  />
                </div>
              </div>
            )}

            {/* Section 3: Interior Condition */}
            {currentSection === 2 && (
              <div className="space-y-5">

              </div>
            )}

            {/* Section 4: Mechanical Condition */}
            {currentSection === 3 && (
              <div className="space-y-5">

              </div>
            )}

            {/* Section 5: Overall Assessment */}
            {currentSection === 4 && (
              <div className="space-y-5">

              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (currentSection > 0) {
                    setCurrentSection(currentSection - 1);
                  }
                }}
                disabled={currentSection === 0}
                className="flex items-center gap-2 mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {currentSection < sections.length - 1 ? (
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleNextSection}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Next Section"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="accept"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Submit Inspection
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CarInspectionForm;