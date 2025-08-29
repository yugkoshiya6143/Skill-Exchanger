import React from 'react';
import { Link } from 'react-router-dom';

const Profile = ({ user }) => {
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">My Profile</h4>
              <Link to="/edit-profile" className="btn btn-primary">
                <i className="fas fa-edit me-2"></i>
                Edit Profile
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-4">
                  <div className="mb-3">
                    <i className="fas fa-user-circle text-muted" style={{ fontSize: '8rem' }}></i>
                  </div>
                  <h5>{user.name}</h5>
                  <p className="text-muted">{user.email}</p>
                  
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
                      {user.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
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
                        <p className="text-muted">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold">Member Since</h6>
                    <p className="text-muted">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <Link to="/search" className="card text-decoration-none h-100">
                <div className="card-body text-center">
                  <i className="fas fa-search text-primary fa-2x mb-2"></i>
                  <h6>Find Users</h6>
                  <small className="text-muted">Search for people to exchange skills with</small>
                </div>
              </Link>
            </div>
            <div className="col-md-6 mb-3">
              <Link to="/ratings" className="card text-decoration-none h-100">
                <div className="card-body text-center">
                  <i className="fas fa-star text-warning fa-2x mb-2"></i>
                  <h6>View Ratings</h6>
                  <small className="text-muted">See ratings and feedback from others</small>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
