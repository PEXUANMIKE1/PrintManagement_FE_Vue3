// src/plugins/axios.js
import axios from "axios";
import store from "@/store";
import router from "@/router";


const apiUrl = "https://localhost:7262/";

const axiosInstance = axios.create({ baseURL: apiUrl });

// Khi gửi request thì thêm token đi kèm nếu cần
axiosInstance.interceptors.request.use(config => {
  const token = store.state.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Xử lý khi token hết hạn
axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {

    store.dispatch('logout'); 
    router.push('/loginform');
  }
  return Promise.reject(error);
});

export default axiosInstance;
