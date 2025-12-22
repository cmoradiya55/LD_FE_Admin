import axiosInstance, { getUpdatedAuthToken } from "./axios";

const postRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.post(url, payload);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const getRequest = async (url: string) => {
  try {
    const res = await axiosInstance.get(url);
    return res?.data;
  } catch (err: any) {
    console.log("err-----", err);
    console.log("err?.status-----", err?.status);
    if(err?.status === 401){
      return getUpdatedAuthToken();
    }
    return err?.response?.data;
  }
};

const putRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.put(url, payload);
    console.log("res-----", res.data);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const patchRequest = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.patch(url, payload);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

const deleteRequest = async (url: string, payload?: any) => {
  try {
    const res = await axiosInstance.delete(url, payload ? { data: payload } : undefined);
    return res?.data;
  } catch (err: any) {
    return err?.response?.data;
  }
};


// Auth APIs
export const sendOtp = (payload: any) => postRequest('/admin/auth/mobile/send-otp', payload);
export const verifyOtp = (payload: any) => postRequest('/admin/auth/mobile/verify-otp', payload);

// User Manangement APIs
export const getCreateUser = (payload: any) => postRequest(`/admin/user-management/create-user`, payload);

// Inspection Center APIs
export const getInspectionCentersData = () => getRequest(`/admin/inspection-centre`);
export const putUpdateInspectionCenter = (payload: any) => putRequest(`/admin/inspection-centre/${payload.id}`, payload);
