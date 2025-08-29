import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../api/users';
import { sendRequest } from '../api/requests';
import { getUserRatings } from '../api/ratings';
import Loader from '../components/Loader';
import FormInput from '../components/FormInput';

const ViewProfile = ({ currentUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    skillOffered: '',
    skillRequested: '',
    message: ''
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, ratingsRes] = await Promise.all([
          getUserById(userId),
          getUserRatings(userId)
        ]);
        
        setUser(userRes.data.user);
        setRatings(ratingsRes.data.ratings);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, navigate]);

  const handleRequestChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    if (!requestForm.skillOffered || !requestForm.skillRequested) {
      setRequestError('Please fill in all required fields');
      return;
    }

    setRequestLoading(true);
    setRequestError('');
    
    try {
      await sendRequest({
        receiverId: userId,
        skillOffered: requestForm.skillOffered,
        skillRequested: requestForm.skillRequested,
        message: requestForm.message
      });
      
      setRequestSuccess('Request sent successfully!');
      setShowRequestForm(false);
      setRequestForm({ skillOffered: '', skillRequested: '', message: '' });
    } catch (error) {
      setRequestError(error.response?.data?.message || 'Failed to send request');
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">User not found</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          {/* Success Message */}
          {requestSuccess && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {requestSuccess}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setRequestSuccess('')}
              ></button>
            </div>
          )}

          {/* User Profile Card */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">{user.name}'s Profile</h4>
              <button 
                className="btn btn-primary"
                onClick={() => setShowRequestForm(true)}
              >
                <i className="fas fa-handshake me-2"></i>
                Send Request
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-4">
                  <div className="mb-3">
                    <i className="fas fa-user-circle text-muted" style={{ fontSize: '6rem' }}></i>
                  </div>
                  <h5>{user.name}</h5>
                  
                  {/* Rating Display */}
                  <div className="mb-3">
                    <div className="rating-stars mb-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <i 
                          key={star} 
                          className={`fas fa-star ${star <= user.avgRating ? '' : 'text-muted'}`}
                        ></i>
                      ))}
                    </div>
                    <small className="text-muted">
                      {user.avgRating.toFixed(1)} ({user.ratingsCount} reviews)
                    </small>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <div className="mb-4">
                    <h6 className="fw-bold">Bio</h6>
                    <p className="text-muted">
                      {user.bio || 'No bio available.'}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold">Skills</h6>
                    <div>
                      {user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span key={index} className="skill-tag me-1 mb-1">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-muted">No skills listed.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Form Modal */}
          {showRequestForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Send Skill Exchange Request</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSendRequest}>
                  <FormInput
                    label="Skill You Can Offer"
                    type="select"
                    name="skillOffered"
                    value={requestForm.skillOffered}
                    onChange={handleRequestChange}
                    placeholder="Select a skill you can teach"
                    required
                    options={currentUser.skills.map(skill => ({ value: skill, label: skill }))}
                  />

                  <FormInput
                    label="Skill You Want to Learn"
                    type="select"
                    name="skillRequested"
                    value={requestForm.skillRequested}
                    onChange={handleRequestChange}
                    placeholder="Select a skill you want to learn"
                    required
                    options={user.skills.map(skill => ({ value: skill, label: skill }))}
                  />

                  <FormInput
                    label="Message (Optional)"
                    type="textarea"
                    name="message"
                    value={requestForm.message}
                    onChange={handleRequestChange}
                    placeholder="Add a personal message..."
                    rows={3}
                  />

                  {requestError && (
                    <div className="alert alert-danger" role="alert">
                      {requestError}
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={requestLoading}
                    >
                      {requestLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Request'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowRequestForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Recent Ratings */}
          {ratings.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Recent Reviews</h5>
              </div>
              <div className="card-body">
                {ratings.slice(0, 5).map((rating, index) => (
                  <div key={index} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="rating-stars mb-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <i 
                              key={star} 
                              className={`fas fa-star ${star <= rating.stars ? '' : 'text-muted'}`}
                            ></i>
                          ))}
                        </div>
                        <p className="mb-1">{rating.feedback}</p>
                        <small className="text-muted">
                          by {rating.raterId.name} • {new Date(rating.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
