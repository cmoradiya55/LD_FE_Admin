"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import TextInput from "@/components/FormComponent/TextInput";
import UploadBox from "@/components/common/UploadBox";
import { getDocumentStatus, setDocumentStatus as saveDocumentStatus } from "@/lib/storage";
import { submitDocumentDetails } from "@/utils/axios/auth";
import { toast } from "sonner";

const statusConfig: any = {
  1: { label: "Pending Verification", bg: "bg-amber-100", text: "text-amber-700" },
  2: { label: "Under Review", bg: "bg-blue-100", text: "text-blue-700" },
  3: { label: "Verified", bg: "bg-green-100", text: "text-green-700" },
  4: { label: "Rejected", bg: "bg-red-100", text: "text-red-700" },
};

const ManagerDocument = () => {
  const router = useRouter();
  const [documentStatus, setDocumentStatus] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { aadhaar: "", pan: "" }
  });

  // State for uploaded file URLs
  const [uploadedFiles, setUploadedFiles] = useState({
    profilePhoto: "",
    aadhaarFront: "",
    aadhaarBack: "",
    panFront: "",
    panBack: "",
  });

  const aadhaar = watch("aadhaar");
  const pan = watch("pan");
  const isAadhaarValid = aadhaar.length === 12;
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan?.toUpperCase() || "");
  const status = statusConfig[documentStatus];

  // Single upload handler function
  const handleFileUpload = (fileUrl: string, field: keyof typeof uploadedFiles) => {
    setUploadedFiles(prev => ({ ...prev, [field]: fileUrl }));
    console.log(`${field} uploaded:`, fileUrl);
  };

  useEffect(() => {
    const storedStatus = getDocumentStatus();
    if (storedStatus !== null) setDocumentStatus(storedStatus);
    if (storedStatus === 3) router.push("/manager/managerDashboard");
  }, [router]);

  const Header = () => (
    <div className="z-10 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-5 shadow">
      <h1 className="text-white text-xl font-semibold">Manager Dashboard</h1>
      <p className="text-indigo-100 text-sm">KYC Verification</p>
      <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
        {status.label}
      </span>
    </div>
  );

  if (documentStatus === 2) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Raised</h2>
            <p className="text-gray-600 mb-6">Your documents are currently under review</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                We have received your KYC documents and they are being reviewed by our verification team.
                You will be notified once the review process is complete.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Please wait while we verify your documents</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleUpload = async () => {
    if (!isAadhaarValid || !isPanValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (!uploadedFiles.profilePhoto || !uploadedFiles.aadhaarFront || !uploadedFiles.aadhaarBack || !uploadedFiles.panFront) {
      toast.error("Please upload all required documents");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        selfieImage: uploadedFiles.profilePhoto,
        aadharCardNo: aadhaar,
        panCardNo: pan.toUpperCase(),
        aadharCardFrontImage: uploadedFiles.aadhaarFront,
        aadharCardBackImage: uploadedFiles.aadhaarBack,
        panCardImage: uploadedFiles.panFront,
      };

      console.log("Submitting document details:", payload);
      const response = await submitDocumentDetails(payload);

      if (response && (response.success || response.code === 200)) {
        toast.success("Documents submitted successfully!");
        setDocumentStatus(2);
        saveDocumentStatus(2);
      } else {
        throw new Error(response?.message || "Failed to submit documents");
      }
    } catch (error: any) {
      console.error("Error submitting documents:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit documents. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 pb-10 space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-5 shadow mt-6">
          <h2 className="font-semibold text-gray-800 mb-4">Profile Photo</h2>
          <UploadBox 
            label="Upload Profile Picture" 
            onUploadComplete={(url) => handleFileUpload(url, "profilePhoto")}
          />
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
              pattern: { value: /^\d{12}$/, message: "Aadhaar must be 12 digits" },
            }}
          />
          {!isAadhaarValid && aadhaar && <p className="text-xs text-red-500">Aadhaar must be 12 digits</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UploadBox 
              onUploadComplete={(url) => handleFileUpload(url, "aadhaarFront")} 
              label="Front Side" 
            />
            <UploadBox 
              onUploadComplete={(url) => handleFileUpload(url, "aadhaarBack")} 
              label="Back Side" 
            />
          </div>
        </div>

        {/* PAN */}
        <div className="bg-white rounded-2xl p-5 shadow space-y-4">
          <h2 className="font-semibold text-gray-800">PAN Card</h2>
          <TextInput
            name="pan"
            control={control}
            label="PAN Number"
            placeholder="Enter PAN Number (e.g., ABCDE1234F)"
            required
            error={errors.pan}
            inputClassName="px-3 py-2 text-sm uppercase"
            type="text"
            rules={{
              required: "PAN is required",
              pattern: { 
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 
                message: "PAN must be in format: ABCDE1234F (5 letters, 4 digits, 1 letter)" 
              },
              maxLength: {
                value: 10,
                message: "PAN must be exactly 10 characters"
              },
              minLength: {
                value: 10,
                message: "PAN must be exactly 10 characters"
              }
            }}
            onChange={(value) => {
              const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
              setValue("pan", upperValue, { shouldValidate: true });
            }}
          />
          {!isPanValid && pan && (
            <p className="text-xs text-red-500">
              PAN must be in format: ABCDE1234F (5 uppercase letters, 4 digits, 1 uppercase letter)
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UploadBox 
              onUploadComplete={(url) => handleFileUpload(url, "panFront")} 
              label="Front Side" 
            />
            <UploadBox 
              onUploadComplete={(url) => handleFileUpload(url, "panBack")} 
              label="Back Side" 
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-2xl p-5 shadow">
          <button
            disabled={!isAadhaarValid || !isPanValid || isSubmitting}
            className={`w-full py-2 rounded-xl font-semibold transition ${isAadhaarValid && isPanValid && !isSubmitting
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            onClick={handleUpload}
          >
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDocument;