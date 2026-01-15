import axios from "axios";
import { toast } from "react-toastify"; // make sure you have react-toastify installed

const baseURL =
  process.env.NODE_ENV === "production"
    // ? process.env.REACT_APP_API_BASE_URL
    ? "https://prod.i80tech.net"
    : "https://prod.i80tech.net";

// const instance = axios.create({
//   baseURL,
// });

const instance = axios.create({
  // baseURL: "https://prod.i80tech.net",
  baseURL: "http://localhost:3001/api/",
 
});

// Add request interceptor to attach token automatically
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Add response interceptor to handle expired/invalid token
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // token expired or invalid
      toast.error("Session expired, please log in again."); // show message
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // if you store user info

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
