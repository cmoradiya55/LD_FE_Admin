import axiosInstance, { getUpdatedAuthToken } from "./axios";

const postRequest = async (url, payload,) => {
  try {
    const res = await axiosInstance.post(url, payload, {
      withCredentials: true
    });
    return res?.data;
  } catch (err) {
    console.log("Error Response-----", err);
    return err;
  }
};

const getRequest = async (url) => {
  try {
    const res = await axiosInstance.get(url, {
      withCredentials: true
    });
    return res?.data;
  } catch (err) {
    if (err?.status === 401) {
      return getUpdatedAuthToken();
    }
    return err?.response?.data;
  }
};

const putRequest = async (url, payload) => {
  try {
    const res = await axiosInstance.put(url, payload, {
      withCredentials: true
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data;
  }
};

const patchRequest = async (url, payload) => {
  try {
    const res = await axiosInstance.patch(url, payload, {
      withCredentials: true
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data;
  }
};

const deleteRequest = async (url, payload) => {
  try {
    const res = await axiosInstance.delete(url, payload);
    return res?.data;
  } catch (err) {
    return err?.response?.data;
  }
};


// User Authentication APIs
export const sendOtp = (payload) => postRequest('/admin/auth/mobile/send-otp', payload);
export const verifyOtp = (payload) => postRequest('/admin/auth/mobile/verify-otp', payload);
export const submitDocumentDetails = (payload) => patchRequest('/admin/auth/documents', payload);



// Admin
// User Management APIs
export const createUser = (payload) => postRequest(`/admin/user-management/create-user`, payload);
export const getAllUsers = (roleId) => getRequest(`/admin/user-management/users?roleId=${roleId}`);
export const getInspectorByManager = (managerId) => getRequest(`/admin/user-management/inspectors/${managerId}`);
export const verifyDocumentDetails = (payload) => postRequest(`/admin/user-management/verify-documents`, payload);


// Inspection Center APIs
export const getInspectionCentersData = () => getRequest(`/admin/inspection-centre`);
export const putUpdateInspectionCenter = (payload) => putRequest(`/admin/inspection-centre/${payload.id}`, payload);
export const getCitySuggestions = (payload) => getRequest(`/admin/inspection-centre/city-suggestions?q=${payload.q}&page=${payload.page}&limit=${payload.limit}&cityId=${payload.cityId}`);


// Used Car APIs
export const getAllUsedCars = (query, page, limit) => {
    const prefix = query ? `${query}&` : '';
    return getRequest(`/admin/used-cars?${prefix}page=${page}&limit=${limit}`);
};
export const getUsedCarDetails = (id) => getRequest(`/admin/used-cars/${id}`);
export const patchUpdateStatusOfCar = (id, payload) => patchRequest(`/admin/used-cars/${id}/status`, payload);



// Manager
// User Management APIs
export const getInspectors = () => getRequest(`/manager/user-management/inspectors`);
export const patchToggleInspectorStatus = (inspectorId) => patchRequest(`/manager/user-management/inspectors/${inspectorId}/toggle`);


// Car List APIs
export const getCarListForManager = (page, limit, status) => getRequest(`/manager/used-car?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);
export const assignToInspectorOrSelf = (payload) => postRequest(`/manager/used-car/assign-inspector`, payload);
export const getInspectionReport = (id) => getRequest(`/manager/used-car/${id}/inspection-report`);
export const patchApproveInspectedCar = (id, payload) => patchRequest(`/manager/used-car/${id}/approve`, payload);



// Inspector
// Inspection APIs
export const startInspection = (payload) => postRequest(`/inspector/inspection/start`, payload);
export const saveInspectionProcess = (id, payload) => postRequest(`/inspector/inspection/${id}/progress`, payload);
export const completeInspection = (id) => postRequest(`/inspector/inspection/${id}/complete`);
export const getAssignedCar = () => getRequest(`/inspector/inspection/cars`);
export const getInspectionDetails = (id) => getRequest(`/inspector/inspection/${id}/details`);



// Staff Apis
export const patchAddAdditionalDetails = (id, payload) => patchRequest(`/staff/vehicles/${id}/details`, payload);
export const getCarDetails = (id) => getRequest(`/staff/vehicles/${id}/details`);
export const getAllVehicles = (status) => {
    if (status !== undefined && status !== null) {
        return getRequest(`/staff/vehicles?status=${status}`);
    }
    return getRequest(`/staff/vehicles`);
};



//Common
// Storage Services APIs
export const getPreSignedUrlForImage = (payload) => postRequest('/storage/upload-url', payload);
export const getPreSignedUrlForVideo = (payload) => postRequest('/storage/video-upload-url', payload);


