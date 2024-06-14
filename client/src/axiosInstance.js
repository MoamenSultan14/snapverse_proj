// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://snapverse-proj-api.vercel.app/api', // Replace with your server's base URL
//   timeout: 10000, // Optional: Set a timeout for requests
//   headers: {
//     'Content-Type': 'application/json',
//     // Add other default headers here if needed
//   },
});



// Optional: Add a response interceptor
// axiosInstance.interceptors.response.use(
//   response => {
//     // Handle successful responses here
//     return response;
//   },
//   error => {
//     // Handle errors here
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized errors (e.g., redirect to login)
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
