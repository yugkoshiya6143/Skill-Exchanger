import api from './config';

export const sendRequest = (requestData) => {
  return api.post('/requests/send', requestData);
};

export const getIncomingRequests = () => {
  return api.get('/requests/incoming');
};

export const getSentRequests = () => {
  return api.get('/requests/sent');
};

export const updateRequestStatus = (requestId, status) => {
  return api.post('/requests/status', { requestId, status });
};
