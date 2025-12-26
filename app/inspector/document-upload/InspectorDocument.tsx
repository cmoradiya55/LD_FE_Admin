"use client";


import Image from "next/image";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "@/components/FormComponent/TextInput";
import UploadBox from "@/components/common/UploadBox";

const InspectorDocument = () => {
  const documentStatus = 1;

  // React Hook Form setup
  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      aadhaar: "",
      pan: "",
    },
  });

  const aadhaar = watch("aadhaar");
  const pan = watch("pan");
  const isAadhaarValid = aadhaar.length === 12;
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const statusConfig: any = {
    1: { label: "Pending Verification", bg: "bg-amber-100", text: "text-amber-700" },
    2: { label: "Verified", bg: "bg-green-100", text: "text-green-700" },
    3: { label: "Rejected", bg: "bg-red-100", text: "text-red-700" },
  };

  const status = statusConfig[documentStatus];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-5 shadow">
        <h1 className="text-white text-xl font-semibold">Inspector Dashboard</h1>
        <p className="text-indigo-100 text-sm">KYC Verification</p>

        <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-10 space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-5 shadow mt-6">
          <h2 className="font-semibold text-gray-800 mb-4">Profile Photo</h2>
          <UploadBox label="Upload Profile Picture" />
        </div>

        {/* Aadhaar */}
        <div className="bg-white rounded-2xl p-5 shadow space-y-4">
          <h2 className="font-semibold text-gray-800">Aadhaar Card</h2>
          <TextInput
            name="aadhaar"
            control={control}
            label="Aadhaar Number"
            placeholder="Enter Aadhaar Number"
            required
            error={errors.aadhaar}
            inputClassName="px-3 py-2 text-sm"
            type="text"
            rules={{
              required: "Aadhaar is required",
              pattern: {
                value: /^\d{12}$/,
                message: "Aadhaar must be 12 digits",
              },
            }}
            // inputMode="numeric"
            // maxLength={12}
          />
          
          {!isAadhaarValid && aadhaar && (
            <p className="text-xs text-red-500">Aadhaar must be 12 digits</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UploadBox label="Front Side" />
            <UploadBox label="Back Side" />
          </div>
        </div>

        {/* PAN */}
        <div className="bg-white rounded-2xl p-5 shadow space-y-4">
          <h2 className="font-semibold text-gray-800">PAN Card</h2>
          <TextInput
            name="pan"
            control={control}
            label="PAN Number"
            placeholder="Enter PAN Number"
            required
            error={errors.pan}
            inputClassName="px-3 py-2 text-sm uppercase"
            type="text"
            rules={{
              required: "PAN is required",
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: "PAN format: ABCDE1234F",
              },
            }}
            // maxLength={10}
          />
          {!isPanValid && pan && (
            <p className="text-xs text-red-500">PAN format: ABCDE1234F</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UploadBox label="Front Side" />
            <UploadBox label="Back Side" />
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-white rounded-2xl p-5 shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              disabled={!isAadhaarValid || !isPanValid}
              className={`flex-1 py-2 rounded-xl font-semibold transition
                ${isAadhaarValid && isPanValid
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {/* Approve */}
              Save
            </button>

            {/* <button className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700">
              Reject
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorDocument;