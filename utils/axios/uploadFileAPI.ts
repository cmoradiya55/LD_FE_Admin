import axios, { AxiosProgressEvent } from "axios";
import { getPreSignedUrlForImage } from "./auth";

export const uploadFile = (baseUrl: string, file: File) => {
  console.log("Uploading baseUrl:", baseUrl);

  const formData = new FormData();
  formData.append('file', file);
  const token = typeof window !== 'undefined' && localStorage.getItem('token') || null;
  return axios.put(baseUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  });
}

export async function uploadToPresignedUrl(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const presignedUrl = await getPreSignedUrlForImage({
    "fileList": [{ "fileName": file.name }]
  });

  console.log("Presigned URL:", presignedUrl);

  const config = {
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(percent);
      }
    },
  };

  console.log("Uploading to URL:", presignedUrl.data[0].src);

  await axios.put(presignedUrl.data[0].url, file, config);

  return presignedUrl.data[0].src;
}

export interface UploadedFileInfo {
  url: string;
  src: string;
  fileName: string;
}

export async function uploadMultipleFilesToPresignedUrl(
  files: File[], 
  onProgress?: (fileIndex: number, progress: number) => void,
  onFileComplete?: (fileIndex: number, fileInfo: UploadedFileInfo) => void,
  onError?: (fileIndex: number, error: any) => void
): Promise<UploadedFileInfo[]> {
  const fileList = files.map(file => ({ fileName: file.name }));
  
  // Get presigned URLs for all files
  const presignedUrlsResponse = await getPreSignedUrlForImage({
    fileList: fileList
  });

  console.log("Multiple Presigned URLs:", presignedUrlsResponse);

  const uploadPromises = files.map(async (file, index) => {
    try {
      const fileInfo = presignedUrlsResponse.data[index];
      
      const config = {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(index, percent);
          }
        },
      };

      await axios.put(fileInfo.url, file, config);
      
      if (onFileComplete) {
        onFileComplete(index, fileInfo);
      }
      
      return fileInfo;
    } catch (error) {
      if (onError) {
        onError(index, error);
      }
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}