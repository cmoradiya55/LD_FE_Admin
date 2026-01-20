"use client";

import React, { useState, useEffect } from "react";
import { useForm, FieldError } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TextInput from "@/components/FormComponent/TextInput";
import { Button } from "@/components/Button/Button";
import UploadBox from "@/components/common/UploadImageBox";
import InspectionField from "@/components/common/InspectionField";
import {
  Car,
  CheckCircle2,
  Wrench,
  Camera,
  Save,
  ArrowLeft,
  Cog,
  AirVent,
  ShipWheel,
  Plug,
  SquareStack,
  RockingChair,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { saveInspectionProcess, getInspectionDetails, completeInspection } from "@/utils/axios/auth";
import { InspectionImageType, TreadDepthEnum, IMAGE_SUBTYPE_NAMES, ExteriorFields, AirConditioningFields, EngineAndTransmissionFields, SteeringSuspensionAndBrakesFields, InteriorFields, ElectricalFields, SeatsFields } from "@/lib/data";
import InspectionSummary from "../InspectionReport/InspectionSummary";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface InspectionFormData {
  registration_number: string;
  registartion_year: number;
  km_driven: number;
  rc_image: string;
  insurance_image: string;
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
  pillar_lhs_c?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  pillar_rhs_a?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  pillar_rhs_b?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  pillar_rhs_c?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  upper_cross_member?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  lower_cross_member?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  radiator_support?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  head_light_support?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  roof?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  bonnet_hood?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  dicky_door_boot_door?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  boot_floor?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  quarter_panel_lhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  quarter_panel_rhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  fender_lhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  fender_rhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  apron_lhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  apron_rhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  apron_lhs_leg?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  apron_rhs_leg?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  firewall?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  cowl_top?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  running_border_lhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  running_border_rhs?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  door_lhs_front?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  door_lhs_rear?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  door_rhs_front?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  door_rhs_rear?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  windshield_front?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  windshield_rear?: {
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
  light_lhs_taillight?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  light_rhs_taillight?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  bumper_front?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  bumper_rear?: {
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
  lhs_front_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    tread_depth?: string;
  };
  rhs_front_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    tread_depth?: string;
  };
  lhs_rear_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    tread_depth?: string;
  };
  rhs_rear_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    tread_depth?: string;
  };
  spare_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    tread_depth?: string;
  };
  exhaust_smoke?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  engine?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  engine_sound?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  engine_mounting?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  clutch?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  gear_shifting?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  engine_oil_level_dipstick?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  engine_oil?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  battery?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  coolant?: {
    damage: string;
    remarks: string;
    image?: string;
  };
  sump?: {
    damage: string;
    remarks: string;
    image?: string;
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
  const [validationErrors, setValidationErrors] = useState<Array<{ type: number; subtype: number; name: string }>>([]);
  const [section1Errors, setSection1Errors] = useState<{ [key: string]: string }>({});

  const { control, watch, handleSubmit, setValue, formState: { errors } } = useForm<InspectionFormData>({
    defaultValues: {
      registration_number: "",
      registartion_year: 0,
      km_driven: 0,
      rc_image: "",
      insurance_image: "",
    },
  });

  const { data: inspectionData, isLoading: isLoadingInspection, isError: isInspectionError } = useQuery({
    queryKey: ['GET_INSPECTION_DETAILS', carId],
    queryFn: async () => {
      if (!carId) return null;
      const response = await getInspectionDetails(carId);
      if (response?.code === 200 && response?.data) {
        const data = response.data;
        if (data.inspectionImages && Array.isArray(data.inspectionImages)) {
          data.inspectionImages = data.inspectionImages.map((imageData: any) => {
            if (imageData.isDamage !== undefined || imageData.is_damage !== undefined) {
              const isDamage = imageData.isDamage !== undefined ? imageData.isDamage : imageData.is_damage;
              return {
                ...imageData,
                isDamage: isDamage ? "yes" : "no",
                is_damage: isDamage ? "yes" : "no",
              };
            }
            return imageData;
          });
        }
        // Also check inspection_images (snake_case variant)
        if (data.inspection_images && Array.isArray(data.inspection_images)) {
          data.inspection_images = data.inspection_images.map((imageData: any) => {
            if (imageData.isDamage !== undefined || imageData.is_damage !== undefined) {
              const isDamage = imageData.isDamage !== undefined ? imageData.isDamage : imageData.is_damage;
              return {
                ...imageData,
                isDamage: isDamage ? "yes" : "no",
                is_damage: isDamage ? "yes" : "no",
              };
            }
            return imageData;
          });
        }
        return data;
      }
      return null;
    },
    enabled: !!carId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const sections = [
    { id: 0, name: "Car Details", icon: Car },
    { id: 1, name: "Exterior", icon: Camera },
    { id: 2, name: "Engine & Transmission", icon: Cog },
    { id: 3, name: "Mechanical", icon: Wrench },
    { id: 4, name: "Assessment", icon: CheckCircle2 },
  ];


  useEffect(() => {
    if (inspectionData) {
      if (inspectionData.car?.registrationNumber || inspectionData.car?.registration_number) {
        setValue("registration_number", inspectionData.car.registrationNumber || inspectionData.car.registration_number || "");
      }
      if (inspectionData.car?.registrationYear || inspectionData.car?.registartion_year) {
        setValue("registartion_year", inspectionData.car.registrationYear || inspectionData.car.registartion_year || 0);
      }
      if (inspectionData.km_driven || inspectionData.inspection?.kmDriven || inspectionData.inspection?.km_driven) {
        setValue("km_driven", inspectionData.km_driven || inspectionData.inspection?.kmDriven || inspectionData.inspection?.km_driven || 0);
      }
      if (inspectionData.rc_image || inspectionData.rcImage) {
        const rcImg = inspectionData.rc_image || inspectionData.rcImage || "";
        setRcImage(rcImg);
        setValue("rc_image", rcImg);
      }
      if (inspectionData.insurance_image || inspectionData.insuranceImage) {
        const insImg = inspectionData.insurance_image || inspectionData.insuranceImage || "";
        setInsuranceImage(insImg);
        setValue("insurance_image", insImg);
      }

      const inspectionImages = inspectionData.inspectionImages || inspectionData.inspection_images || [];
      if (Array.isArray(inspectionImages) && inspectionImages.length > 0) {
        const allFields = [
          ...ExteriorFields,
          ...EngineAndTransmissionFields,
          ...SteeringSuspensionAndBrakesFields,
          ...AirConditioningFields,
          ...ElectricalFields,
          ...InteriorFields,
          ...SeatsFields,
        ];

        inspectionImages.forEach((imageData: any) => {
          const subType = imageData.subType || imageData.sub_type;
          const matchingField = allFields.find(
            (field) => field.type === imageData.type && field.sub_type === subType
          );

          if (matchingField) {
            // isDamage is now "yes"/"no" string from API response
            const isDamage = imageData.isDamage !== undefined ? imageData.isDamage :
              (imageData.is_damage !== undefined ? imageData.is_damage : "no");
            const imageUrl = imageData.imageUrl || imageData.image_url || "";
            const remarks = imageData.remarks || "";

            const fieldValue: any = {
              damage: typeof isDamage === "boolean" ? (isDamage ? "yes" : "no") : isDamage,
              remarks: remarks,
              image: imageUrl,
            };

            if (matchingField.fieldType === "tyre") {
              const treadDepth = imageData.treadDepth || imageData.tread_depth;
              if (treadDepth !== undefined && treadDepth !== null) {
                fieldValue.tread_depth = treadDepth.toString();
              }
            }

            if (matchingField.fieldType === "orvm") {
              const orvmType = imageData.orvmType || imageData.orvm_type;
              if (orvmType) fieldValue.orvm_type = orvmType;

              const foldingMirror = imageData.foldingMirrorWorking !== undefined ? imageData.foldingMirrorWorking :
                (imageData.folding_mirror_working !== undefined ? imageData.folding_mirror_working : undefined);
              if (foldingMirror !== undefined) {
                fieldValue.folding_mirror_working = foldingMirror ? "yes" : "no";
              }

              const mirrorMotor = imageData.mirrorAdjustMotor !== undefined ? imageData.mirrorAdjustMotor :
                (imageData.mirror_adjust_motor !== undefined ? imageData.mirror_adjust_motor : undefined);
              if (mirrorMotor !== undefined) {
                fieldValue.mirror_adjust_motor = mirrorMotor ? "yes" : "no";
              }
            }

            if (matchingField.fieldType === "electrical") {
              const isPower = imageData.isPower !== undefined ? imageData.isPower :
                (imageData.is_power !== undefined ? imageData.is_power : undefined);
              if (isPower !== undefined) {
                fieldValue.electrical_type = isPower ? "electric" : "manual";
              }
            }

            setValue(matchingField.name as keyof InspectionFormData, fieldValue);
          }
        });
      }
    }
  }, [inspectionData, setValue]);

  const transformFormDataToPayload = (formValues: InspectionFormData) => {
    const images: Array<{
      type: number;
      sub_type: number;
      image_url?: string;
      is_damage: boolean;
      remarks: string;
      tread_depth?: number;
      is_power?: boolean;
    }> = [];

    const processFields = (fields: Array<{ name: string; type: number; sub_type: number; fieldType?: string }>) => {
      fields.forEach((field) => {
        const fieldData = formValues[field.name as keyof InspectionFormData] as any;
        const isInteriorOrSeat = field.type === InspectionImageType.INTERIOR || field.type === InspectionImageType.SEATS;
        const hasRemarks = fieldData?.remarks && fieldData.remarks.trim() !== "";
        const hasImage = fieldData?.image && fieldData.image.trim() !== "";
        const hasDamageValue = fieldData?.damage !== undefined && fieldData.damage !== "";

        // Only send data if:
        // 1. For Interior/Seats: has remarks or image (damage not required)
        // 2. For other types: has image (API requires image_url even for draft saves)
        if (!fieldData) {
          return;
        }
        
        if (isInteriorOrSeat) {
          // For interior/seats, send if there's any data
          if (!hasRemarks && !hasImage) {
            return;
          }
        } else {
          // For other types, only send if image is present to avoid API validation errors
          if (!hasImage) {
            return;
          }
        }

        const payload: any = {
          type: field.type,
          sub_type: field.sub_type,
          is_damage: isInteriorOrSeat ? false : fieldData.damage === "yes",
          remarks: fieldData.remarks || "",
        };

        if (fieldData.image) {
          payload.image_url = fieldData.image;
        }

        if (field.type === InspectionImageType.TYRES) {
          if (fieldData.tread_depth !== undefined && fieldData.tread_depth !== null && fieldData.tread_depth !== "") {
            const depth = parseInt(String(fieldData.tread_depth), 10);
            const validDepths = [
              TreadDepthEnum.LESS_THAN_3MM,
              TreadDepthEnum.BETWEEN_3MM_AND_4MM,
              TreadDepthEnum.BETWEEN_4MM_AND_5MM,
              TreadDepthEnum.BETWEEN_5MM_AND_6MM,
              TreadDepthEnum.BETWEEN_6MM_AND_7MM,
              TreadDepthEnum.BETWEEN_7MM_AND_8MM,
              TreadDepthEnum.BETWEEN_8MM_AND_9MM,
              TreadDepthEnum.BETWEEN_9MM_AND_MM,
            ];
            if (!Number.isNaN(depth) && validDepths.includes(depth)) {
              payload.tread_depth = depth;
            }
          }
        }

        if (field.type === InspectionImageType.ELECTRICAL) {
          payload.is_power = fieldData.electrical_type === "electric";
        }

        images.push(payload);
      });
    };

    processFields(ExteriorFields);
    processFields(EngineAndTransmissionFields);
    processFields(SteeringSuspensionAndBrakesFields);
    processFields(AirConditioningFields);
    processFields(ElectricalFields);
    processFields(InteriorFields);
    processFields(SeatsFields);

    return {
      images,
      registration_number: formValues.registration_number || "",
      registartion_year: formValues.registartion_year || 0,
      rc_image: rcImage || "",
      insurance_image: insuranceImage || "",
      km_driven: formValues.km_driven || 0,
    };
  };

  const handleSave = async (formValues: InspectionFormData) => {
    if (!carId) {
      toast.error("Car ID is missing");
      return false;
    }

    try {
      const payload = transformFormDataToPayload(formValues);
      const response = await saveInspectionProcess(carId, payload);

      if (response?.code === 200 || response?.success) {
        setSection1Errors({});
        return true;
      }
      
      // Parse error response for field-level errors
      const errorData = response?.response?.data || response;
      const fieldErrors: { [key: string]: string } = {};
      
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err: any) => {
          if (err.field) {
            fieldErrors[err.field] = err.message || "Invalid value";
          }
        });
      }
      
      if (Object.keys(fieldErrors).length > 0) {
        setSection1Errors(fieldErrors);
      }
      
      toast.error(errorData?.message || response?.message || "Operation failed");
      return false;
    } catch (error: any) {
      const errorData = error?.response?.data;
      const fieldErrors: { [key: string]: string } = {};
      
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err: any) => {
          if (err.field) {
            fieldErrors[err.field] = err.message || "Invalid value";
          }
        });
      }
      
      if (Object.keys(fieldErrors).length > 0) {
        setSection1Errors(fieldErrors);
      }
      
      toast.error(errorData?.message || error?.message || "An error occurred");
      return false;
    }
  };

  const handleNextSection = async () => {
    setIsSaving(true);
    try {
      const formValues = watch();
      const success = await handleSave(formValues);
      if (success) {
        toast.success("Draft saved successfully");
        setCurrentSection((prev) => prev + 1);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const findFieldByTypeSubtype = (type: number, subtype: number) => {
    const allFields = [
      ...ExteriorFields,
      ...EngineAndTransmissionFields,
      ...SteeringSuspensionAndBrakesFields,
      ...AirConditioningFields,
      ...ElectricalFields,
      ...InteriorFields,
      ...SeatsFields,
    ];
    return allFields.find(field => field.type === type && field.sub_type === subtype);
  };

  const getSectionForType = (type: number): number => {
    if (type === 1) return 1;
    if (type === 3) return 2;
    if ([4, 5, 6, 7, 8].includes(type)) return 3;
    return 1;
  };

  const getErrorsForType = (type: number) => {
    return validationErrors.filter(err => err.type === type);
  };

  const getFieldError = (type: number, subtype: number) => {
    return validationErrors.find(err => err.type === type && err.subtype === subtype);
  };

  const getFieldLabelForError = (type: number, subtype: number, errorName?: string): string => {
    const field = findFieldByTypeSubtype(type, subtype);
    if (field?.label) {
      return field.label;
    }

    const typeNames = IMAGE_SUBTYPE_NAMES[type as keyof typeof IMAGE_SUBTYPE_NAMES];
    if (typeNames && subtype in typeNames) {
      return typeNames[subtype as keyof typeof typeNames];
    }

    if (errorName && errorName !== `Unknown (${subtype})`) {
      return errorName;
    }

    return `Type ${type}, Subtype ${subtype}`;
  };

  const handleError = (errorResponse: any) => {
    const errors = errorResponse?.errors;
    if (errors && Array.isArray(errors)) {
      const missingImagesError = errors.find(
        (err: any) => err.code === "MISSING_REQUIRED_IMAGES" && err.details?.missing
      );
      if (missingImagesError?.details?.missing) {
        const missingImages = missingImagesError.details.missing.map((img: any) => ({
          type: img.type,
          subtype: img.subtype,
          name: img.name || `Type ${img.type}, Subtype ${img.subtype}`
        }));
        setValidationErrors(missingImages);
        toast.error(`Missing ${missingImagesError.details.count} required image(s). Please check the sections below.`);
        const firstError = missingImagesError.details.missing[0];
        if (firstError) {
          const sectionIndex = getSectionForType(firstError.type);
          setCurrentSection(sectionIndex);
        }
        return;
      }
    }
    toast.error(errorResponse?.message || "Failed to complete inspection");
  };

  const onSubmit = async (data: InspectionFormData) => {
    if (!carId) {
      toast.error("Car ID is missing");
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const success = await handleSave(data);
      if (!success) {
        setIsSubmitting(false);
        return;
      }

      const response = await completeInspection(carId);
      const errorData = response?.response?.data || (response?.code && response.code !== 200 ? response : null) || (response?.errors && Array.isArray(response.errors) ? response : null);

      if (response?.code === 200 && !errorData) {
        toast.success("Inspection completed successfully!");
        router.push("/inspector/inspectorDashboard");
        return;
      }

      if (errorData) {
        handleError(errorData);
      } else {
        toast.error("Failed to complete inspection");
      }
    } catch (error: any) {
      handleError(error?.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInspection && carId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-slate-600">Loading inspection details...</p>
        </div>
      </div>
    );
  }

  if (isInspectionError && carId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600">Failed to load inspection details</p>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="p-2">
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
          <div className="p-2">

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

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <TextInput
                      name="registration_number"
                      control={control}
                      label="Registration Number"
                      placeholder="GJ-05-HV-1234"
                      required
                      error={errors.registration_number}
                      rules={{
                        required: "Registration number is required",
                        pattern: {
                          value: /^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}$/i,
                          message: "Please enter a valid registration number (e.g., GJ-05-HV-1234)"
                        }
                      }}
                      onChange={(value) => {
                        const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
                        const letters = cleaned.match(/[A-Z]/g) || [];
                        const digits = cleaned.match(/[0-9]/g) || [];

                        const parts = [
                          letters.slice(0, 2).join(''),
                          digits.slice(0, 2).join(''),
                          letters.slice(2, 4).join(''),
                          digits.slice(2, 6).join('')
                        ];

                        let formatted = parts[0];
                        if (parts[1]) formatted += '-' + parts[1];
                        if (parts[2]) formatted += '-' + parts[2];
                        if (parts[3]) formatted += '-' + parts[3];

                        setValue("registration_number", formatted);
                      }}
                    />
                    {section1Errors.registration_number && (
                      <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-medium">{section1Errors.registration_number}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <TextInput
                      name="registartion_year"
                      control={control}
                      label="Registration Year"
                      type="number"
                      placeholder="e.g., 2021"
                      required
                      error={errors.registartion_year}
                    />
                    {section1Errors.registartion_year && (
                      <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-medium">{section1Errors.registartion_year}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <TextInput
                      name="km_driven"
                      control={control}
                      label="KM Driven"
                      type="number"
                      placeholder="e.g., 95000"
                      required
                      error={errors.km_driven}
                    />
                    {section1Errors.km_driven && (
                      <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-medium">{section1Errors.km_driven}</span>
                      </div>
                    )}
                  </div>
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
                    onUploadError={() => toast.error("Failed to upload RC image")}
                  />
                  {section1Errors.rc_image && (
                    <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-medium">{section1Errors.rc_image}</span>
                    </div>
                  )}
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
                    onUploadError={() => toast.error("Failed to upload Insurance image")}
                  />
                  {section1Errors.insurance_image && (
                    <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-medium">{section1Errors.insurance_image}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: Exterior Condition */}
            {currentSection === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-primary-700">
                    Exterior Condition
                  </h2>
                </div>

                <div className="space-y-6">
                  {ExteriorFields.map((field) => {
                    const fieldValidationError = getFieldError(field.type, field.sub_type);
                    return (
                      <div key={field.name}>
                        <InspectionField
                          name={field.name}
                          control={control}
                          label={field.label}
                          fieldType={field.fieldType}
                          uploadLabel={field.uploadLabel}
                          setValue={setValue}
                          type={field.type}
                          sub_type={field.sub_type}
                          error={errors[field.name as keyof typeof errors] as FieldError}
                          isRequired={field.isRequired}
                        />
                        {fieldValidationError && (
                          <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-medium">Missing required image: {getFieldLabelForError(fieldValidationError.type, fieldValidationError.subtype)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 3: Interior Condition */}
            {currentSection === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <Cog className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-primary-700">
                    Engine & Transmission
                  </h2>
                </div>

                <div className="space-y-6">
                  {EngineAndTransmissionFields.map((field) => {
                    const fieldValidationError = getFieldError(field.type, field.sub_type);
                    return (
                      <div key={field.name}>
                        <InspectionField
                          name={field.name}
                          control={control}
                          label={field.label}
                          fieldType={field.fieldType}
                          uploadLabel={field.uploadLabel}
                          setValue={setValue}
                          type={field.type}
                          sub_type={field.sub_type}
                          error={errors[field.name as keyof typeof errors] as FieldError}
                          isRequired={field.isRequired}
                        />
                        {fieldValidationError && (
                          <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-medium">Missing required image: {getFieldLabelForError(fieldValidationError.type, fieldValidationError.subtype)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 4: Mechanical Condition */}
            {currentSection === 3 && (
              <div className="space-y-5">

                {/* Steering, Suspension and Brakes */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <ShipWheel className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-primary-700">
                      Steering, Suspension and Brakes
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {SteeringSuspensionAndBrakesFields.map((field) => {
                      const fieldValidationError = getFieldError(field.type, field.sub_type);
                      return (
                        <div key={field.name}>
                          <InspectionField
                            name={field.name}
                            control={control}
                            label={field.label}
                            fieldType={field.fieldType}
                            uploadLabel={field.uploadLabel}
                            setValue={setValue}
                            type={field.type}
                            sub_type={field.sub_type}
                            error={errors[field.name as keyof typeof errors] as FieldError}
                            isRequired={field.isRequired}
                          />
                          {fieldValidationError && (
                            <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="font-medium">Missing required image: {getFieldLabelForError(fieldValidationError.type, fieldValidationError.subtype, fieldValidationError.name)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Air Conditioning */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <AirVent className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-primary-700">
                      Air Conditioning
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {AirConditioningFields.map((field) => {
                      const fieldValidationError = getFieldError(field.type, field.sub_type);
                      return (
                        <div key={field.name}>
                          <InspectionField
                            name={field.name}
                            control={control}
                            label={field.label}
                            fieldType={field.fieldType}
                            uploadLabel={field.uploadLabel}
                            setValue={setValue}
                            type={field.type}
                            sub_type={field.sub_type}
                            error={errors[field.name as keyof typeof errors] as FieldError}
                            isRequired={field.isRequired}
                          />
                          {fieldValidationError && (
                            <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="font-medium">Missing required image: {getFieldLabelForError(fieldValidationError.type, fieldValidationError.subtype, fieldValidationError.name)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Electrical */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <Plug className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-primary-700">
                      Electrical
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {ElectricalFields.map((field) => {
                      const fieldValidationError = getFieldError(field.type, field.sub_type);
                      return (
                        <div key={field.name}>
                          <InspectionField
                            name={field.name}
                            control={control}
                            label={field.label}
                            fieldType={field.fieldType}
                            uploadLabel={field.uploadLabel}
                            setValue={setValue}
                            type={field.type}
                            sub_type={field.sub_type}
                            error={errors[field.name as keyof typeof errors] as FieldError}
                            isRequired={field.isRequired}
                          />
                          {fieldValidationError && (
                            <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="font-medium">Missing required image: {getFieldLabelForError(fieldValidationError.type, fieldValidationError.subtype, fieldValidationError.name)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interior */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <SquareStack className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-primary-700">
                      Interior
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {InteriorFields.map((field) => {
                      const fieldValidationError = getFieldError(field.type, field.sub_type);
                      return (
                        <div key={field.name}>
                          <InspectionField
                            name={field.name}
                            control={control}
                            label={field.label}
                            fieldType={field.fieldType}
                            uploadLabel={field.uploadLabel}
                            setValue={setValue}
                            type={field.type}
                            sub_type={field.sub_type}
                            error={errors[field.name as keyof typeof errors] as FieldError}
                            isRequired={field.isRequired}
                          />
                          {fieldValidationError && (
                            <div className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="font-medium">Missing required image: {getFieldLabelForError(fieldValidationError.type, fieldValidationError.subtype, fieldValidationError.name)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <RockingChair className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-primary-700">
                      Seats
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {SeatsFields.map((field) => (
                      <InspectionField
                        key={field.name}
                        name={field.name}
                        control={control}
                        label={field.label}
                        fieldType={field.fieldType}
                        uploadLabel={field.uploadLabel}
                        setValue={setValue}
                        type={field.type}
                        sub_type={field.sub_type}
                        error={errors[field.name as keyof typeof errors] as FieldError}
                        isRequired={field.isRequired}
                      />
                    ))}
                  </div>

                  {/* Error Messages for Seats */}
                  {getErrorsForType(8).length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <h3 className="text-sm font-semibold text-red-900">Missing Required Images</h3>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {getErrorsForType(8).map((error, idx) => (
                          <li key={idx}>{getFieldLabelForError(error.type, error.subtype, error.name)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Section 5: Overall Assessment */}
            {currentSection === 4 && (
              <div className="space-y-5">
                <InspectionSummary
                  formValues={watch()}
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
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
                disabled={currentSection === 0}
                className="flex items-center gap-2 mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

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
        </form>
      </div>
    </div>
  );
};

export default CarInspectionForm;