"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { getPreSignedUrlForImage } from "@/utils/axios/auth";
import { Camera, ImageIcon, CheckCircle2, Upload, Plus } from "lucide-react";

export interface UploadImageBoxProps {
  label: string;
  category?: string;
  onUploadComplete?: (fileUrl: string) => void;
  onUploadError?: (error: any) => void;
  existingImage?: string | null;
  required?: boolean;
}

const UploadImageBox: React.FC<UploadImageBoxProps> = ({
  label,
  category = "sensitive_document",
  onUploadComplete,
  onUploadError,
  existingImage,
  required = false
}) => {
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(existingImage || null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingImage || null);

  // Sync with existingImage prop changes
  useEffect(() => {
    if (existingImage) {
      setImage(existingImage);
      setUploadedUrl(existingImage);
    }
  }, [existingImage]);

  const handleFile = async (file?: File) => {
    console.log("handleFile called with file:", file);
    if (!file) {
      console.log("No file provided, returning");
      return;
    }

    // Show preview immediately
    const preview = URL.createObjectURL(file);
    setImage(preview);
    setUploading(true);

    try {
      const payload = {
        category: category,
        files: [
          {
            name: file.name,
            type: file.type
          }
        ]
      };

      console.log("Calling getPreSignedUrlForImage with payload:", payload);
      const response = await getPreSignedUrlForImage(payload);
      console.log("getPreSignedUrlForImage response:", response);
      
      if (response && response.data && response.data[0]) {
        const presignedUrlData = response.data[0];
        const uploadConfig = {
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        };
        await axios.put(presignedUrlData.uploadUrl, file, uploadConfig);
        const fileUrl = presignedUrlData.keyWithBaseUrl;
        setUploadedUrl(fileUrl);
        setImage(fileUrl);

        if (onUploadComplete) {
          onUploadComplete(fileUrl);
        }
      } else {
        throw new Error("Invalid response from presigned URL API");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Upload Box */}
      <div
        onClick={() => !uploading && setOpen(true)}
        className={`group relative rounded-xl border transition-all duration-200 overflow-hidden
          ${image
            ? 'h-48 border-slate-200 bg-white shadow-sm hover:shadow-md cursor-pointer'
            : uploading
              ? 'h-40 border-blue-300 bg-blue-50/50 cursor-wait'
              : 'h-40 border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/50 hover:border-blue-400 hover:from-blue-50 hover:to-cyan-50 cursor-pointer'
          }`}
      >
        {image ? (
          <div className="relative w-full h-full group">
            <Image
              height={400}
              width={400}
              src={image}
              alt="preview"
              className="w-full h-full object-contain"
            />

            {/* Upload overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-8 h-8 border-[3px] border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-white text-sm font-medium">Uploading...</p>
                </div>
              </div>
            )}

            {/* Success badge */}
            {!uploading && (
              <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}

            {/* Change overlay */}
            {!uploading && (
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  Click to Change
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="relative mb-5">
              {/* Main icon container */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 bg-white flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all duration-300 group-hover:scale-105">
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-all duration-300" />
              </div>
              {/* Plus badge */}
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            <p className="font-bold text-slate-900 text-center mb-2 group-hover:text-blue-700 transition-colors">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              Camera OR Gallery
            </div>

            {uploading && (
              <div className="mt-4 flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-medium">Uploading...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden Inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          console.log("Camera input onChange triggered, files:", e.target.files);
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
          }
          setOpen(false);
          // Reset input to allow selecting same file again
          e.target.value = '';
        }}
      />

      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          console.log("Gallery input onChange triggered, files:", e.target.files);
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
          }
          setOpen(false);
          // Reset input to allow selecting same file again
          e.target.value = '';
        }}
      />

      {/* Dialog */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full sm:w-80 rounded-2xl p-6 space-y-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center font-semibold text-slate-900 text-lg mb-1">
              Upload Image
            </h3>

            <button
              onClick={() => {
                cameraRef.current?.click();
                setOpen(false);
              }}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Camera className="h-5 w-5" />
              Open Camera
            </button>

            <button
              onClick={() => {
                galleryRef.current?.click();
                setOpen(false);
              }}
              className="w-full py-3.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ImageIcon className="h-5 w-5" />
              Choose from Gallery
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadImageBox;