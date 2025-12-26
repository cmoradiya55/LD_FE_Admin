"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { getPreSignedUrlForImage } from "@/utils/axios/auth";

export interface UploadBoxProps {
  label: string;
  category?: string;
  onUploadComplete?: (fileUrl: string) => void;
  onUploadError?: (error: any) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({
  label,
  category = "sensitive_document",
  onUploadComplete,
  onUploadError
}) => {
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

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
        className={`relative h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm transition 
          ${uploading ? 'cursor-wait opacity-60' : 'cursor-pointer hover:border-indigo-400 hover:bg-indigo-50'}
          `}
      >
        {image ? (
          <>
            <Image
              height={400}
              width={400}
              src={image}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                <div className="text-white text-sm">Uploading...</div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="font-medium">{label}</p>
            <p className="text-xs mt-1">Camera / Gallery</p>
          </div>
        )}

        {image && !uploading && (
          <span className="absolute bottom-1 right-1 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
            Change
          </span>
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-80 rounded-t-2xl sm:rounded-2xl p-5 space-y-4">
            <h3 className="text-center font-semibold text-gray-800">
              Upload Image
            </h3>

            <button
              onClick={() => cameraRef.current?.click()}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              Open Camera
            </button>

            <button
              onClick={() => galleryRef.current?.click()}
              className="w-full py-3 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
            >
              Choose from Gallery
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadBox;