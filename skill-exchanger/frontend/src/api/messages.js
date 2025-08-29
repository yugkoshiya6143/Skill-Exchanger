import api from './config';

export const sendMessage = (messageData) => {
  return api.post('/messages/send', messageData);
};

export const getMessages = (requestId) => {
  return api.get(`/messages/list?requestId=${requestId}`);
};
