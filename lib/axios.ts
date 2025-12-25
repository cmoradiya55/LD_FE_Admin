import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { getToken, clearAuthData } from '@/lib/storage';

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  console.log("=== createAxiosInstance called ===");
  console.log("baseURL parameter-----", baseURL);
  console.log("Environment:", typeof window !== 'undefined' ? 'CLIENT' : 'SERVER');
  const instance = axios.create({
    baseURL,
    timeout: 50000,
    headers: {
      'Content-Type': 'application/json',
      'WithCredentials': 'true',
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = getToken();
        if (token && token !== 'null') {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError | any) => {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        const message = data?.message || 'An error occurred';

        switch (status) {
          case 401:
            console.error('Unauthorized! Please log in again.');
            if (typeof window !== 'undefined') {
              // Clear auth data
              // clearAuthData();
              
              // Dispatch custom event to notify AuthProvider
              // window.dispatchEvent(new CustomEvent('auth:logout'));
              
              // Redirect to login if not already there
              // if (window.location.pathname !== '/login') {
              //   window.location.href = '/login';
              // }
            }
            break;

          case 404:
            console.error('Not Found! The requested resource does not exist.');
            break;

          case 400:
            console.error('Bad Request! Please check your input.');
            break;

          case 403:
            console.error(
              'Forbidden! You do not have permission to access this resource.'
            );
            break;

          case 500:
            console.error(
              'Server Error! Something went wrong on the server.'
            );
            break;

          case 503:
            console.error(
              'Service Unavailable! The server is temporarily unavailable.'
            );
            break;

          default:
            console.error(`Unexpected Error (${status}): ${message}`);
        }
      } else if (error.request) {
        console.error(
          'No response received from the server. Please check your network connection.'
        );
        error.message =
          'No response received from the server. Please check your network connection.';
      } else {
        console.error('Request Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const axiosInstance = createAxiosInstance(baseURL || '');

const getUpdatedAuthToken = async () => {
  const res = await axios.post(`${baseURL}/admin/auth/refresh`, {}, {
    withCredentials: true
  });
  console.log("res-----", res);
  return res?.data;
}
export default axiosInstance; 
export { createAxiosInstance, getUpdatedAuthToken };


