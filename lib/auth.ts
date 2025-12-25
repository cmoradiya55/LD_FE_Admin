import axiosInstance, { getUpdatedAuthToken } from "./axios";

const postRequest = async (url: string, payload: any,) => {
  try {
    alert(`postRequest: ${url}`);
    console.log("url-----", url);
    console.log("Request Payload-----", JSON.stringify(payload, null, 2));
    const res = await axiosInstance.post(url, payload, {
      withCredentials: true
    });
    console.log("Response Data-----", JSON.stringify(res?.data, null, 2));
    alert(`res?.data: ${res}`);
    return res?.data;
  } catch (err: any) {
    console.log("Error Response-----", JSON.stringify(err?.response?.data, null, 2));
    return err?.response?.data;
  }
};

const getRequest = async (url: string) => {
  try {
    const res = await axiosInstance.get(url, {
      withCredentials: true
    });
    return res?.data;
  } catch (err: any) {
    console.log("err-----", err);
    console.log("err?.status-----", err?.status);
    if (err?.status === 401) {
      return getUpdatedAuthToken();
    }
    return err?.response?.data;
  }
};

const putRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.put(url, payload, {
      withCredentials: true
    });
    console.log("res-----", res.data);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const patchRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.patch(url, payload, {
      withCredentials: true
    });
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const deleteRequest = async (url: string, payload?: any) => {
  try {
    const res = await axiosInstance.delete(url, payload);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};


// Auth APIs
export const sendOtp = (payload: any) => postRequest('/admin/auth/mobile/send-otp', payload);
export const verifyOtp = (payload: any) => postRequest('/admin/auth/mobile/verify-otp', payload);

// User Manangement APIs
export const createUser = (payload: any) => postRequest(`/admin/user-management/create-user`, payload);
export const getInspectorByManager = (managerId: string) => getRequest(`/admin/user-management/inspectors/${managerId}`);

// Inspection Center APIs
export const getInspectionCentersData = () => getRequest(`/admin/inspection-centre`);
export const putUpdateInspectionCenter = (payload: any) => putRequest(`/admin/inspection-centre/${payload.id}`, payload);
export const getCitySuggestions = (payload: any) => getRequest(`/admin/inspection-centre/city-suggestions?q=${payload.q}&page=${payload.page}&limit=${payload.limit}&cityId=${payload.cityId}`);
