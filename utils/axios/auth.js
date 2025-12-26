import axiosInstance, { getUpdatedAuthToken } from "./axios";

const postRequest = async (url, payload,) => {
  try {
    console.log("url-----", url);
    console.log("Request Payload-----", JSON.stringify(payload, null, 2));
    const res = await axiosInstance.post(url, payload, {
      withCredentials: true
    });
    console.log("Response Data-----", JSON.stringify(res?.data, null, 2));
    return res?.data;
  } catch (err) {
    console.log("Error Response-----", JSON.stringify(err?.response?.data, null, 2));
    return err?.response?.data;
  }
};

const getRequest = async (url) => {
  try {
    const res = await axiosInstance.get(url, {
      withCredentials: true
    });
    return res?.data;
  } catch (err) {
    console.log("err-----", err);
    console.log("err?.status-----", err?.status);
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
    console.log("res-----", res.data);
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


// Auth APIs
export const sendOtp = (payload) => postRequest('/admin/auth/mobile/send-otp', payload);
export const verifyOtp = (payload) => postRequest('/admin/auth/mobile/verify-otp', payload);

// User Manangement APIs
export const createUser = (payload) => postRequest(`/admin/user-management/create-user`, payload);
export const getInspectorByManager = (managerId) => getRequest(`/admin/user-management/inspectors/${managerId}`);

// Inspection Center APIs
export const getInspectionCentersData = () => getRequest(`/admin/inspection-centre`);
export const putUpdateInspectionCenter = (payload) => putRequest(`/admin/inspection-centre/${payload.id}`, payload);
export const getCitySuggestions = (payload) => getRequest(`/admin/inspection-centre/city-suggestions?q=${payload.q}&page=${payload.page}&limit=${payload.limit}&cityId=${payload.cityId}`);


export const getPreSignedUrlForImage = async (payload) => {
    try {
        return await axiosInstance.post(`/tenant/s3/presigned-upload`, payload).then((res) => {
            console.log("Presigned URL Response:", res?.data);
            return res?.data;

        }).catch((err) => {
            return err?.response?.data;
        });
    } catch (error) {
        return error;
    }

};