// axiosInstance.js
const axios = require("axios");
const {
  baseUrlStage,
  baseUrl,
} = require("../environment/environment.development");

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if we are in a browser environment
    if (typeof window !== "undefined") {
      // Get token from session storage
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.data.error.includes(
        "Microsoft.IdentityModel.Tokens.SecurityTokenExpiredException"
      )
    ) {
      // Check if we are in a browser environment
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
        window.location.href = "/login"; // Adjust this according to your routing
      }
    }

    return Promise.reject(error);
  }
);

module.exports = axiosInstance;
