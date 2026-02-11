import axios from 'axios';
import { store } from '../redux/store';
import { setToken, logout } from '../redux/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

// Response interceptor for automatic token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/refresh-token`, {}, {
          withCredentials: true
        });
        
        const newAccessToken = response.data.accessToken;

        store.dispatch(setToken(newAccessToken));
        
        // Retry the original request with new token
        originalRequest.headers['x-access-token'] = newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)  

export default axiosInstance;