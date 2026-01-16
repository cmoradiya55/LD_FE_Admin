"use client";

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { getPreSignedUrlForVideo } from "@/utils/axios/auth";
import { Camera, Video, CheckCircle2, Upload, Plus, Play } from "lucide-react";

export interface UploadVideoBoxProps {
  label: string;
  category?: string;
  onUploadComplete?: (fileUrl: string) => void;
  onUploadError?: (error: any) => void;
  existingVideo?: string | null;
  required?: boolean;
}

// Helper function to get video duration
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error("Failed to load video metadata"));
    };

    video.src = URL.createObjectURL(file);
  });
};

const sanitizeFileName = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';

  const sanitizedName = name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');

  const finalName = sanitizedName || 'video';

  return finalName + extension;
};

const UploadVideoBox: React.FC<UploadVideoBoxProps> = ({
  label,
  category = "inspection_video",
  onUploadComplete,
  onUploadError,
  existingVideo,
  required = false
}) => {
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideo || null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingVideo || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync with existingVideo prop changes
  useEffect(() => {
    if (existingVideo) {
      setVideoUrl(existingVideo);
      setUploadedUrl(existingVideo);
    }
  }, [existingVideo]);

  const handleFile = async (file?: File) => {
    console.log("handleFile called with file:", file);
    if (!file) {
      console.log("No file provided, returning");
      return;
    }

    const preview = URL.createObjectURL(file);
    setVideoUrl(preview);
    setUploading(true);

    try {
      let duration = 0;
      try {
        duration = await getVideoDuration(file);
      } catch (error) {
        console.warn("Could not get video duration:", error);
      }

      const sanitizedName = sanitizeFileName(file.name);

      const payload = {
        category: category,
        files: [
          {
            name: sanitizedName,
            type: file.type,
            size: file.size,
            duration: Math.round(duration)
          }
        ]
      };

      console.log("Calling getPreSignedUrlForVideo with payload:", payload);
      const response = await getPreSignedUrlForVideo(payload);
      console.log("getPreSignedUrlForVideo response:", response);

      if (response && response.data && response.data[0]) {
        const presignedUrlData = response.data[0];
        const uploadConfig = {
          headers: {
            'Content-Type': file.type || 'video/mp4',
          },
        };
        await axios.put(presignedUrlData.uploadUrl, file, uploadConfig);
        const fileUrl = presignedUrlData.keyWithBaseUrl;
        setUploadedUrl(fileUrl);
        setVideoUrl(fileUrl);

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
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
      }
    } finally {
      setUploading(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <>
      {/* Upload Box */}
      <div
        onClick={() => !uploading && setOpen(true)}
        className={`group relative rounded-xl border transition-all duration-200 overflow-hidden
          ${videoUrl
            ? 'min-h-64 border-slate-200 bg-slate-900 shadow-sm hover:shadow-md cursor-pointer'
            : uploading
              ? 'h-40 border-blue-300 bg-blue-50/50 cursor-wait'
              : 'h-40 border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/50 hover:border-blue-400 hover:from-blue-50 hover:to-cyan-50 cursor-pointer'
          }`}
      >
        {videoUrl ? (
          <div className="relative w-full h-full group">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain bg-slate-900"
              controls
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error("Video error:", e);
              }}
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

            {/* Play/Pause button */}
            {!uploading && (
              <div
                className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
              >
                <button className="text-white bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all">
                  {isPlaying ? (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-4 border-l-2 border-r-2 border-white"></div>
                    </div>
                  ) : (
                    <Play className="h-6 w-6 ml-1" fill="white" />
                  )}
                </button>
              </div>
            )}

            {/* Change overlay */}
            {!uploading && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <span className="text-white text-xs font-medium">Click to Change Video</span>
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
        accept="video/*"
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
        accept="video/*"
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
              Upload Video
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
              <Video className="h-5 w-5" />
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

export default UploadVideoBox;

