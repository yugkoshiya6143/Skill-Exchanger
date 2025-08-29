// Import our configured API instance
import api from './config';

// Register a new user account
export const register = (userData) => {
  return api.post('/auth/register', userData);
};

// Login with email and password
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

// Get current logged-in user's information
export const getCurrentUser = () => {
  return api.get('/auth/me');
};
