// Import axios so we can make HTTP requests to our backend.
import axios from "axios";

// Create one axios instance with the backend's base URL, read from
// the Vite environment variable (no hard-coded URL in the code).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Before every request, attach the saved login token (if any) so
// protected routes on the backend accept it.
api.interceptors.request.use((config) => {
  // Read the token we saved in localStorage after login.
  const token = localStorage.getItem("token");

  // If we have a token, add it as an Authorization header.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Export the configured instance so pages can import and use it.
export default api;
