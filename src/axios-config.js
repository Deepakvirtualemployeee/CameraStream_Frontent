import axios from "axios";
import { toast } from "react-toastify"; // make sure you have react-toastify installed
import { getTenantId } from "./utils/tenant";

const baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/apicamera";

const instance = axios.create({
  baseURL,
});

// Add request interceptor to attach the freshest token automatically
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const tenantId = getTenantId();
    config.headers = config.headers || {};

    if (
      config.url &&
      !/^https?:\/\//i.test(config.url) &&
      !config.url.startsWith("/auth") &&
      !config.url.startsWith("/video") &&
      !config.url.startsWith("/webvss/api")
    ) {
      config.url = `/webvss/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers["x-tenant-id"] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle expired/invalid token
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // token expired or invalid
      toast.error("Session expired, please log in again."); // show message
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // if you store user info
      localStorage.removeItem("admin_user");

      // Redirect to login page
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default instance;
