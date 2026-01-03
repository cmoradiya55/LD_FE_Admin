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
  CheckCircle2,
  Wrench,
  Camera,
  Save,
  ArrowLeft,
  Cog,
} from "lucide-react";
import { toast } from "sonner";
import { saveInspectionProcess } from "@/utils/axios/auth";
import { InspectionImageType, InspectionImageSubType } from "@/lib/data";

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
  // Lights
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
  // ORVM
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
  // Tyres
  lhs_front_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    thread_depth?: string;
  };
  rhs_front_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    thread_depth?: string;
  };
  lhs_rear_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    thread_depth?: string;
  };
  rhs_rear_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    thread_depth?: string;
  };
  spare_tyre?: {
    damage: string;
    remarks: string;
    image?: string;
    thread_depth?: string;
  };
  // Engine & Transmission
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

  const { control, watch, handleSubmit, setValue, formState: { errors } } = useForm<InspectionFormData>({
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
    { id: 2, name: "Engine & Transmission", icon: Cog },
    { id: 3, name: "Mechanical", icon: Wrench },
    { id: 4, name: "Assessment", icon: CheckCircle2 },
  ];

  // Exterior inspection fields configuration with type and sub_type mapping from enums
  const exteriorFields = [
    // Body Parts (order matches enum structure)
    { name: "roof", label: "Roof", fieldType: "pillar" as const, uploadLabel: "Upload Roof Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].ROOF },
    { name: "bonnet_hood", label: "Bonnet/Hood", fieldType: "pillar" as const, uploadLabel: "Upload Bonnet/Hood Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BONNET },
    // Pillars
    { name: "pillar_lhs_a", label: "Pillar LHS A", fieldType: "pillar" as const, uploadLabel: "Upload Pillar LHS A Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_A },
    { name: "pillar_lhs_b", label: "Pillar LHS B", fieldType: "pillar" as const, uploadLabel: "Upload Pillar LHS B Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_B },
    { name: "pillar_lhs_c", label: "Pillar LHS C", fieldType: "pillar" as const, uploadLabel: "Upload Pillar LHS C Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_C },
    { name: "pillar_rhs_a", label: "Pillar RHS A", fieldType: "pillar" as const, uploadLabel: "Upload Pillar RHS A Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_A },
    { name: "pillar_rhs_b", label: "Pillar RHS B", fieldType: "pillar" as const, uploadLabel: "Upload Pillar RHS B Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_B },
    { name: "pillar_rhs_c", label: "Pillar RHS C", fieldType: "pillar" as const, uploadLabel: "Upload Pillar RHS C Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_C },
    // Cross Members & Supports
    { name: "upper_cross_member", label: "Upper Cross Member (Bonnet Patti)", fieldType: "pillar" as const, uploadLabel: "Upload Upper Cross Member Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].UPPER_CROSS_MEMBER },
    { name: "lower_cross_member", label: "Lower Cross Member", fieldType: "pillar" as const, uploadLabel: "Upload Lower Cross Member Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LOWER_CROSS_MEMBER },
    { name: "radiator_support", label: "Radiator Support", fieldType: "pillar" as const, uploadLabel: "Upload Radiator Support Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RADIATOR_SUPPORT },
    { name: "head_light_support", label: "Head Light Support", fieldType: "light" as const, uploadLabel: "Upload Head Light Support Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].HEADLIGHT_SUPPORT },
    { name: "dicky_door_boot_door", label: "Dicky Door/Boot Door", fieldType: "pillar" as const, uploadLabel: "Upload Dicky Door/Boot Door Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BOOT_DOOR },
    // Firewall
    { name: "firewall", label: "Firewall", fieldType: "pillar" as const, uploadLabel: "Upload Firewall Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].FIREWALL },
    // Quarter Panels
    { name: "quarter_panel_lhs", label: "Quarter Panel LHS", fieldType: "pillar" as const, uploadLabel: "Upload Quarter Panel LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_LHS },
    { name: "quarter_panel_rhs", label: "Quarter Panel RHS", fieldType: "pillar" as const, uploadLabel: "Upload Quarter Panel RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_RHS },
    // Fenders
    { name: "fender_lhs", label: "Fender LHS", fieldType: "pillar" as const, uploadLabel: "Upload Fender LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_LHS },
    { name: "fender_rhs", label: "Fender RHS", fieldType: "pillar" as const, uploadLabel: "Upload Fender RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_RHS },
    // Aprons
    { name: "apron_lhs", label: "Apron LHS", fieldType: "pillar" as const, uploadLabel: "Upload Apron LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS },
    { name: "apron_rhs", label: "Apron RHS", fieldType: "pillar" as const, uploadLabel: "Upload Apron RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS },
    { name: "apron_lhs_leg", label: "Apron LHS LEG", fieldType: "pillar" as const, uploadLabel: "Upload Apron LHS LEG Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS_LEG },
    { name: "apron_rhs_leg", label: "Apron RHS LEG", fieldType: "pillar" as const, uploadLabel: "Upload Apron RHS LEG Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS_LEG },
    // Cowl
    { name: "cowl_top", label: "Cowl Top", fieldType: "pillar" as const, uploadLabel: "Upload Cowl Top Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].COWL_TOP },
    // Running Borders
    { name: "running_border_lhs", label: "Running Border LHS", fieldType: "pillar" as const, uploadLabel: "Upload Running Border LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_LHS },
    { name: "running_border_rhs", label: "Running Border RHS", fieldType: "pillar" as const, uploadLabel: "Upload Running Border RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_RHS },
    // Doors
    { name: "door_lhs_front", label: "Door LHS Front", fieldType: "pillar" as const, uploadLabel: "Upload Door LHS Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_FRONT },
    { name: "door_lhs_rear", label: "Door LHS Rear", fieldType: "pillar" as const, uploadLabel: "Upload Door LHS Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_REAR },
    { name: "door_rhs_front", label: "Door RHS Front", fieldType: "pillar" as const, uploadLabel: "Upload Door RHS Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_FRONT },
    { name: "door_rhs_rear", label: "Door RHS Rear", fieldType: "pillar" as const, uploadLabel: "Upload Door RHS Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_REAR },
    // Windshields
    { name: "windshield_front", label: "Windshield Front", fieldType: "pillar" as const, uploadLabel: "Upload Windshield Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_FRONT },
    { name: "windshield_rear", label: "Windshield Rear", fieldType: "pillar" as const, uploadLabel: "Upload Windshield Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_REAR },
    // Lights
    { name: "light_lhs_headlight", label: "Light LHS Headlight", fieldType: "light" as const, uploadLabel: "Upload LHS Headlight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_HEADLIGHT },
    { name: "light_rhs_headlight", label: "Light RHS Headlight", fieldType: "light" as const, uploadLabel: "Upload RHS Headlight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_HEADLIGHT },
    { name: "light_lhs_taillight", label: "Light LHS Taillight", fieldType: "light" as const, uploadLabel: "Upload LHS Taillight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_TAILLIGHT },
    { name: "light_rhs_taillight", label: "Light RHS Taillight", fieldType: "light" as const, uploadLabel: "Upload RHS Taillight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_TAILLIGHT },
    // Bumpers
    { name: "bumper_front", label: "Bumper Front", fieldType: "pillar" as const, uploadLabel: "Upload Bumper Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_FRONT },
    { name: "bumper_rear", label: "Bumper Rear", fieldType: "pillar" as const, uploadLabel: "Upload Bumper Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_REAR },
    // ORVM
    { name: "orvm_lhs", label: "ORVM - Manual / Electrical LHS", fieldType: "orvm" as const, uploadLabel: "Upload ORVM LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_LHS },
    { name: "orvm_rhs", label: "ORVM - Manual / Electrical RHS", fieldType: "orvm" as const, uploadLabel: "Upload ORVM RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_RHS },
    //Tyres
    { name: "lhs_front_tyre", label: "LHS Front Tyre", fieldType: "tyre" as const, uploadLabel: "Upload LHS Front Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].FRONT_LEFT },
    { name: "rhs_front_tyre", label: "RHS Front Tyre", fieldType: "tyre" as const, uploadLabel: "Upload RHS Front Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].FRONT_RIGHT },
    { name: "lhs_rear_tyre", label: "LHS Rear Tyre", fieldType: "tyre" as const, uploadLabel: "Upload LHS Rear Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].REAR_LEFT },
    { name: "rhs_rear_tyre", label: "RHS Rear Tyre", fieldType: "tyre" as const, uploadLabel: "Upload RHS Rear Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].REAR_RIGHT },
    { name: "spare_tyre", label: "Spare Tyre", fieldType: "tyre" as const, uploadLabel: "Upload Spare Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].SPARE_TYRE },
  ];

  const engineAndTransmissionFields = [
    { name: "exhaust_smoke", label: "Exhaust Smoke", fieldType: "exhaust" as const, uploadLabel: "Upload Exhaust Smoke Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].EXHAUST_SMOKE },
    { name: "engine_oil_level_dipstick", label: "Engine Oil Level Dipstick", fieldType: "exhaust" as const, uploadLabel: "Upload Engine Oil Level Dipstick Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL_LEVEL_DIPSTICK },
    { name: "battery", label: "Battery", fieldType: "exhaust" as const, uploadLabel: "Upload Battery Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].BATTERY },
    { name: "coolant", label: "Coolant", fieldType: "exhaust" as const, uploadLabel: "Upload Coolant Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COOLANT },
    { name: "sump", label: "Sump", fieldType: "exhaust" as const, uploadLabel: "Upload Sump Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].SUMP },
    { name: "engine", label: "Engine", fieldType: "engine" as const, uploadLabel: "Upload Engine Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE },
    { name: "engine_sound", label: "Engine Sound", fieldType: "engineSound" as const, uploadLabel: "Upload Engine Sound Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_SOUND },
    { name: "engine_mounting", label: "Engine Mounting", fieldType: "engineMounting" as const, uploadLabel: "Upload Engine Mounting Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_MOUNTING },
    { name: "clutch", label: "Clutch", fieldType: "clutch" as const, uploadLabel: "Upload Clutch Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].CLUTCH },
    { name: "gear_shifting", label: "Gear Shifting", fieldType: "gearShifting" as const, uploadLabel: "Upload Gear Shifting Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].GEAR_SHIFTING },
    { name: "engine_oil", label: "Engine Oil", fieldType: "engineOil" as const, uploadLabel: "Upload Engine Oil Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL },
  ];

  const transformFormDataToPayload = (formValues: InspectionFormData) => {
    const images: Array<{
      type: number;
      sub_type: number;
      image_url: string;
      is_damage: boolean;
      remarks: string;
      tread_depth?: number;
    }> = [];

    const processFields = (fields: typeof exteriorFields | typeof engineAndTransmissionFields) => {
      fields.forEach((field) => {
        const fieldData = formValues[field.name as keyof InspectionFormData] as any;
        if (!fieldData) return;

        const imageUrl = fieldData.image || "";
        const damageValue = fieldData.damage || "no";
        if (!imageUrl && damageValue !== "yes") return;

        const payload: any = {
          type: field.type,
          sub_type: field.sub_type,
          image_url: imageUrl,
          is_damage: damageValue === "yes",
          remarks: fieldData.remarks || "",
        };

        if (field.type === InspectionImageType.TYRES && fieldData.thread_depth) {
          payload.tread_depth = parseInt(fieldData.thread_depth, 10);
        }

        images.push(payload);
      });
    };

    processFields(exteriorFields);
    processFields(engineAndTransmissionFields);

    return {
      images,
      registration_number: formValues.registration_number || "",
      registartion_year: formValues.registartion_year || 0,
      rc_image: rcImage || "",
      insurance_image: insuranceImage || "",
      km_driven: formValues.km_driven || 0,
    };
  };

  const handleNextSection = async () => {
    if (!carId) {
      toast.error("Car ID is missing");
      return;
    }

    setIsSaving(true);
    try {
      const formValues = watch();
      const payload = transformFormDataToPayload(formValues);
      const response = await saveInspectionProcess(carId, payload);

      if (response?.code === 200) {
        toast.success("Draft saved successfully");
        setCurrentSection((prev) => prev + 1);
      } else {
        toast.error(response?.message || "Failed to save draft");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "An error occurred while saving draft");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: InspectionFormData) => {
    if (!carId) {
      toast.error("Car ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = transformFormDataToPayload(data);
      const response = await saveInspectionProcess(carId, payload);

      if (response?.code === 200) {
        toast.success("Inspection form submitted successfully!");
        router.push("/inspector/inspectorDashboard");
      } else {
        toast.error(response?.message || "Failed to submit inspection form");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to submit inspection form. Please try again.");
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
                    onUploadError={() => toast.error("Failed to upload RC image")}
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
                    onUploadError={() => toast.error("Failed to upload Insurance image")}
                  />
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
                  {exteriorFields.map((field) => (
                    <InspectionField
                      key={field.name}
                      name={field.name}
                      control={control}
                      label={field.label}
                      fieldType={field.fieldType}
                      uploadLabel={field.uploadLabel}
                      setValue={setValue}
                    />
                  ))}
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
                  {engineAndTransmissionFields.map((field) => (
                    <InspectionField
                      key={field.name}
                      name={field.name}
                      control={control}
                      label={field.label}
                      fieldType={field.fieldType}
                      uploadLabel={field.uploadLabel}
                      setValue={setValue}
                    />
                  ))}
                </div>
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
                onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
                disabled={currentSection === 0}
                className="flex items-center gap-2"
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