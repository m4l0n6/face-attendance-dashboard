import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_CONFIG_API_URL || "https://faceauthen-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    
    // Temporarily disable auto redirect to see actual error
    // if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
    //   console.error("Authentication error, redirecting to login");
    //   localStorage.removeItem("token");
    //   window.location.href = "/login";
    // }
    
    const message = error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
