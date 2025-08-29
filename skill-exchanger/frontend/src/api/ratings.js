import api from './config';

// Function to submit a rating for another user
// ratingData should contain: requestId, rateeId, stars, feedback
export const giveRating = (ratingData) => {
  // Send POST request to backend to save the rating
  return api.post('/ratings/give', ratingData);
};

// Function to get all ratings for a specific user
// userId is the ID of the user whose ratings we want to see
export const getUserRatings = (userId) => {
  // Send GET request to backend to fetch user's ratings
  return api.get(`/ratings/user/${userId}`);
};

// Function to get all ratings given by a specific user
// userId is the ID of the user whose given ratings we want to see
export const getRatingsGivenByUser = (userId) => {
  // Send GET request to backend to fetch ratings given by user
  return api.get(`/ratings/given/${userId}`);
};
