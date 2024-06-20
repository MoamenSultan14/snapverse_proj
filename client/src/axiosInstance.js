// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://snapverse-proj-api.onrender.com/api'
});

export default axiosInstance;
