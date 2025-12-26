"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

export interface UploadBoxProps {
  label: string;
}

const UploadBox: React.FC<UploadBoxProps> = ({ label }) => {
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImage(preview);
  };

  return (
    <>
      {/* Upload Box */}
      <div
        onClick={() => setOpen(true)}
        className="relative h-32 rounded-xl border-2 border-dashed border-gray-300
                   bg-gray-50 flex items-center justify-center
                   text-gray-500 text-sm cursor-pointer
                   hover:border-indigo-400 hover:bg-indigo-50 transition"
      >
        {image ? (
          <Image
            height={400}
            width={400}
            src={image}
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="text-center">
            <p className="font-medium">{label}</p>
            <p className="text-xs mt-1">Camera / Gallery</p>
          </div>
        )}

        {image && (
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
          handleFile(e.target.files?.[0]);
          setOpen(false);
        }}
      />

      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          setOpen(false);
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