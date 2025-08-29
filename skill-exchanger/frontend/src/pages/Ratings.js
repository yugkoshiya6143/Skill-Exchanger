import React, { useState, useEffect } from 'react';
import { getUserRatings, giveRating, getRatingsGivenByUser } from '../api/ratings';
import { getSentRequests, getIncomingRequests } from '../api/requests';
import Loader from '../components/Loader';
import FormInput from '../components/FormInput';

// Main Ratings component - shows ratings received and allows giving ratings
const Ratings = ({ currentUser }) => {
  // State variables to store component data
  const [activeTab, setActiveTab] = useState('received'); // Which tab is active
  const [receivedRatings, setReceivedRatings] = useState([]); // Ratings user received
  const [completedRequests, setCompletedRequests] = useState([]); // Completed skill exchanges
  const [loading, setLoading] = useState(true); // Loading state
  const [showRatingForm, setShowRatingForm] = useState(null); // Which rating form to show
  const [ratingLoading, setRatingLoading] = useState(false); // Loading state for rating submission
  const [error, setError] = useState(''); // Error messages
  const [success, setSuccess] = useState(''); // Success messages

  // Form data for giving a rating
  const [ratingForm, setRatingForm] = useState({
    stars: 5,        // Default 5 stars
    feedback: ''     // Optional feedback text
  });

  // Load data when component starts
  useEffect(() => {
    loadAllData();
  }, []);

  // Function to load all ratings and requests data
  const loadAllData = async () => {
    try {
      // Step 1: Get user's ratings, sent requests, and incoming requests at the same time
      const ratingsResponse = await getUserRatings(currentUser.id);
      const sentRequestsResponse = await getSentRequests();
      const incomingRequestsResponse = await getIncomingRequests();

      // Step 2: Set the ratings user received
      setReceivedRatings(ratingsResponse.data.ratings);

      // Step 3: Combine all requests and find completed ones
      const allRequestsCombined = [
        ...sentRequestsResponse.data.requests,
        ...incomingRequestsResponse.data.requests
      ];

      // Step 4: Filter to only show completed skill exchanges that haven't been rated yet
      const completedExchanges = [];

      // Get all ratings given by current user to avoid showing already rated requests
      const ratingsGivenResponse = await getRatingsGivenByUser(currentUser.id);

      let alreadyRatedRequestIds = [];
      if (ratingsGivenResponse.data) {
        alreadyRatedRequestIds = ratingsGivenResponse.data.ratings.map(rating => rating.requestId);
      }

      for (let i = 0; i < allRequestsCombined.length; i++) {
        const request = allRequestsCombined[i];

        // Check if request is completed and not already rated by current user
        if (request.status === 'Completed' && !alreadyRatedRequestIds.includes(request._id)) {
          completedExchanges.push(request);
        }
      }

      setCompletedRequests(completedExchanges);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load ratings data');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle changes in rating form (stars and feedback)
  const handleRatingChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    // Update the rating form with new value
    setRatingForm({
      ...ratingForm,
      [fieldName]: fieldValue
    });
  };

  // Function to submit a rating for a completed skill exchange
  const handleSubmitRating = async (e, request) => {
    e.preventDefault(); // Prevent page refresh

    // Step 1: Set loading state and clear messages
    setRatingLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 2: Find out who the other person is in this skill exchange
      let otherPersonId;
      
      // Handle both possible ID field names (_id or id) and convert to strings for comparison
      const senderId = String(request.senderId._id || request.senderId.id || request.senderId);
      const receiverId = String(request.receiverId._id || request.receiverId.id || request.receiverId);
      const currentUserId = String(currentUser.id || currentUser._id);
      
      if (senderId === currentUserId) {
        // Current user sent the request, so rate the receiver
        otherPersonId = receiverId;
      } else if (receiverId === currentUserId) {
        // Current user received the request, so rate the sender
        otherPersonId = senderId;
      } else {
        throw new Error(`User is not part of this skill exchange. Sender: ${senderId}, Receiver: ${receiverId}, Current User: ${currentUserId}`);
      }

      // Step 3: Prepare rating data
      const ratingData = {
        requestId: request._id,
        rateeId: otherPersonId,
        stars: parseInt(ratingForm.stars), // Convert to number
        feedback: ratingForm.feedback || ''
      };

      // Step 4: Send rating data to server
      await giveRating(ratingData);

      // Step 5: Show success message and reset form
      setSuccess('Rating submitted successfully!');
      setShowRatingForm(null); // Hide the rating form
      setRatingForm({ stars: 5, feedback: '' }); // Reset form to defaults

      // Step 6: Reload all data to show updated ratings
      await loadAllData();

      // Step 7: Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      // Step 8: Show error message if something went wrong
      console.error('Rating submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit rating';
      setError(errorMessage);
    } finally {
      // Step 9: Stop loading state
      setRatingLoading(false);
    }
  };

  // Function to display star ratings (both clickable and display-only)
  const renderStars = (rating, isClickable, onStarClick) => {
    // Create array of 5 stars
    const stars = [1, 2, 3, 4, 5];

    return (
      <div className="rating-stars">
        {stars.map(starNumber => {
          // Check if this star should be filled (golden) or empty (gray)
          const isStarFilled = starNumber <= rating;
          const starClass = isStarFilled ? 'fas fa-star' : 'fas fa-star text-muted';

          return (
            <i
              key={starNumber}
              className={starClass}
              style={isClickable ? { cursor: 'pointer', fontSize: '1.5rem' } : {}}
              onClick={isClickable ? () => onStarClick(starNumber) : undefined}
            ></i>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <Loader message="Loading ratings..." />;
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Ratings & Reviews</h2>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccess('')}
              ></button>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'received' ? 'active' : ''}`}
                onClick={() => setActiveTab('received')}
              >
                Received Ratings ({receivedRatings.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'give' ? 'active' : ''}`}
                onClick={() => setActiveTab('give')}
              >
                Give Ratings
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Received Ratings Tab */}
            {activeTab === 'received' && (
              <div>
                {receivedRatings.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="fas fa-star text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                      <h5>No Ratings Yet</h5>
                      <p className="text-muted">
                        Complete some skill exchanges to receive ratings from other users.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Overall Rating Summary */}
                    <div className="card mb-4">
                      <div className="card-body text-center">
                        <h3 className="mb-2">{currentUser.avgRating.toFixed(1)}</h3>
                        <div className="rating-stars mb-2" style={{ fontSize: '1.5rem' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <i 
                              key={star} 
                              className={`fas fa-star ${star <= currentUser.avgRating ? '' : 'text-muted'}`}
                            ></i>
                          ))}
                        </div>
                        <p className="text-muted">
                          Based on {currentUser.ratingsCount} review{currentUser.ratingsCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Individual Ratings */}
                    {receivedRatings.map((rating, index) => (
                      <div key={rating._id} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center">
                              <i className="fas fa-user-circle text-muted me-2" style={{ fontSize: '2rem' }}></i>
                              <div>
                                <h6 className="mb-0">{rating.raterId.name}</h6>
                                <small className="text-muted">
                                  {new Date(rating.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                            <div className="rating-stars">
                              {[1, 2, 3, 4, 5].map(star => (
                                <i 
                                  key={star} 
                                  className={`fas fa-star ${star <= rating.stars ? '' : 'text-muted'}`}
                                ></i>
                              ))}
                            </div>
                          </div>
                          
                          {rating.feedback && (
                            <p className="mb-2">{rating.feedback}</p>
                          )}
                          
                          {rating.requestId && (
                            <small className="text-muted">
                              <i className="fas fa-handshake me-1"></i>
                              Skills: {rating.requestId.skillOffered} ↔ {rating.requestId.skillRequested}
                            </small>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Give Ratings Tab */}
            {activeTab === 'give' && (
              <div>
                {completedRequests.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="fas fa-handshake text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                      <h5>No Completed Exchanges</h5>
                      <p className="text-muted">
                        Complete some skill exchanges to be able to rate other users.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {completedRequests.map((request, index) => {
                      // Figure out who the other person is in this skill exchange
                      let otherUser;
                      
                      // Handle both possible ID field names (_id or id) and convert to strings for comparison
                      const senderId = String(request.senderId._id || request.senderId.id || request.senderId);
                      const receiverId = String(request.receiverId._id || request.receiverId.id || request.receiverId);
                      const currentUserId = String(currentUser.id || currentUser._id);
                      
                      if (senderId === currentUserId) {
                        // Current user sent the request, so other person is the receiver
                        otherUser = request.receiverId;
                      } else if (receiverId === currentUserId) {
                        // Current user received the request, so other person is the sender
                        otherUser = request.senderId;
                      } else {
                        // Fallback - this shouldn't happen but just in case
                        console.warn('Could not determine other user for request:', request._id);
                        otherUser = request.receiverId;
                      }

                      return (
                        <div key={request._id} className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="d-flex align-items-center">
                                <i className="fas fa-user-circle text-muted me-2" style={{ fontSize: '2rem' }}></i>
                                <div>
                                  <h6 className="mb-0">{otherUser.name || 'Unknown User'}</h6>
                                  <small className="text-muted">
                                    Exchange: {request.skillOffered} ↔ {request.skillRequested}
                                  </small>
                                </div>
                              </div>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowRatingForm(request._id)}
                              >
                                <i className="fas fa-star me-1"></i>
                                Rate User
                              </button>
                            </div>

                            {/* Rating Form - only show if this request's form is open */}
                            {showRatingForm === request._id && (
                              <form onSubmit={(e) => handleSubmitRating(e, request)}>
                                <hr />
                                <div className="mb-3">
                                  <label className="form-label">Rating</label>
                                  <div className="d-flex align-items-center">
                                    {renderStars(ratingForm.stars, true, (selectedStars) => {
                                      // Update rating form when user clicks on stars
                                      setRatingForm({ ...ratingForm, stars: selectedStars });
                                    })}
                                    <span className="ms-2">
                                      ({ratingForm.stars} star{ratingForm.stars !== 1 ? 's' : ''})
                                    </span>
                                  </div>
                                </div>

                                <FormInput
                                  label="Feedback (Optional)"
                                  type="textarea"
                                  name="feedback"
                                  value={ratingForm.feedback}
                                  onChange={handleRatingChange}
                                  placeholder="Share your experience with this user..."
                                  rows={3}
                                />

                                <div className="d-flex gap-2">
                                  <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={ratingLoading}
                                  >
                                    {ratingLoading ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Submitting...
                                      </>
                                    ) : (
                                      'Submit Rating'
                                    )}
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowRatingForm(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings;
