// Import axios for making HTTP requests
import axios from 'axios';

// Backend server URL
const API_BASE_URL = 'http://localhost:5050/api';

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Send JSON data
  },
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    // Get login token from browser storage
    const token = localStorage.getItem('token');
    if (token) {
      // Add token to request headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors automatically
api.interceptors.response.use(
  (response) => {
    // If request is successful, return the response
    return response;
  },
  (error) => {
    // If user is not authorized (token expired/invalid)
    if (error.response?.status === 401) {
      // Remove invalid token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export api instance so other files can use it
export default api;
