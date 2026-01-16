"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import TextInput from "@/components/FormComponent/TextInput";
import UploadBox from "@/components/common/UploadImageBox";
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
  const searchParams = useSearchParams();
  const [documentStatus, setDocumentStatus] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remarks, setRemarks] = useState<string>("");
  
  const { control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { aadhaar: "", pan: "" }
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    profilePhoto: "",
    aadhaarFront: "",
    aadhaarBack: "",
    panFront: "",
  });

  const aadhaar = watch("aadhaar");
  const pan = watch("pan");
  const isAadhaarValid = aadhaar.length === 12;
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan?.toUpperCase() || "");
  const status = statusConfig[documentStatus];

  const handleFileUpload = (fileUrl: string, field: keyof typeof uploadedFiles) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: fileUrl }));
  };

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      const status = parseInt(statusParam, 10);
      setDocumentStatus(status);
      if (status === 3) {
        router.push("/manager/managerDashboard");
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (documentStatus !== 4) return;
    
    try {
      const authData = localStorage.getItem("adminpro-auth");
      if (!authData) return;
      
      const { user } = JSON.parse(authData);
      if (!user) return;
      
      if (user.aadharNumber) {
        setValue("aadhaar", user.aadharNumber);
      }
      if (user.panNumber) {
        setValue("pan", user.panNumber);
      }
      
      setUploadedFiles({
        profilePhoto: user.selfieImage || "",
        aadhaarFront: user.aadharFrontImage || "",
        aadhaarBack: user.aadharBackImage || "",
        panFront: user.panImage || "",
      });
      
      if (user.remarks || user.rejectionRemarks) {
        setRemarks(user.remarks || user.rejectionRemarks);
      }
    } catch (error) {
      console.error("Error loading user document data:", error);
    }
  }, [documentStatus, setValue]);


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

  if (documentStatus !== 1 && documentStatus !== 4) return null;

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

      const response = await submitDocumentDetails(payload);

      if (response && (response.success || response.code === 200)) {
        toast.success("Documents submitted successfully!");
        setDocumentStatus(2);
        router.push("/manager/document-upload?status=2");
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
        {/* Rejection Remarks - Show only when status is 4 */}
        {documentStatus === 4 && remarks && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-5 shadow mt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">Documents Rejected</h3>
                <p className="text-sm text-red-700 leading-relaxed">{remarks}</p>
                <p className="text-xs text-red-600 mt-2">Please review the feedback above and resubmit your documents with the necessary corrections.</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile */}
        <div className="bg-white rounded-2xl p-5 shadow mt-6">
          <h2 className="font-semibold text-gray-800 mb-4">Profile Photo</h2>
          <UploadBox 
            label="Upload Profile Picture" 
            onUploadComplete={(url) => handleFileUpload(url, "profilePhoto")}
            existingImage={uploadedFiles.profilePhoto}
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
            error={errors.aadhaar as any}
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
              existingImage={uploadedFiles.aadhaarFront}
            />
            <UploadBox 
              onUploadComplete={(url) => handleFileUpload(url, "aadhaarBack")} 
              label="Back Side"
              existingImage={uploadedFiles.aadhaarBack}
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
            error={errors.pan as any}
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
          <UploadBox 
            onUploadComplete={(url) => handleFileUpload(url, "panFront")} 
            label="PAN Card Photo"
            existingImage={uploadedFiles.panFront}
          />
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