import axios from "axios";
import { ACCESS_TOKEN } from "./token";

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
  withCredentials: true, // Allow cookies to be sent (for CSRF)
});

// CSRF helper function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Skip authentication for specific requests
    if (config.skipAuthRefresh) {
      return config;
    }

    // Handle Authorization Token
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Handle CSRF Token for unsafe methods
    const csrfSafeMethod = /^(GET|HEAD|OPTIONS|TRACE)$/.test(config.method);
    if (!csrfSafeMethod) {
      const csrftoken = getCookie("csrftoken");
      if (csrftoken) {
        config.headers["X-CSRFToken"] = csrftoken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
