import api from './config';

export const getProfile = () => {
  return api.get('/profile/me');
};

export const updateProfile = (profileData) => {
  return api.post('/profile/update', profileData);
};
