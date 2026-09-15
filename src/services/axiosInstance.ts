import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return accessToken;
  }

  // Temporary while other portals are still being migrated
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("seeker-token") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("admin-token") ||
    localStorage.getItem("staff_token") ||
    localStorage.getItem("staff-token")
  );
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
