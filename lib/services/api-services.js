import axios from 'axios';

const baseURL = 'http://localhost:3001/api';
const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes('login') && !config.url.includes('countries')){
      return {
          ...config,
          headers:{
              ...config.headers,
              Authorization: 'Bearer '+ storage?.token
          }
      }
  }
    return config;
});
