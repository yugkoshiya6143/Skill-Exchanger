import api from './config';

export const searchUsers = (skill) => {
  return api.get(`/users/search?skill=${encodeURIComponent(skill)}`);
};

export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};
