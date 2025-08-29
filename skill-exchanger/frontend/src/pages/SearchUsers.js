import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../api/users';
import Loader from '../components/Loader';

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a skill to search for');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const response = await searchUsers(searchTerm.trim());
      setUsers(response.data.users);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to search users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Find Users by Skill</h2>
          
          {/* Search Form */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter a skill (e.g., JavaScript, Guitar, Cooking)"
                      value={searchTerm}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && <Loader message="Searching for users..." />}

          {/* Search Results */}
          {searched && !loading && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Search Results</h4>
                <span className="text-muted">
                  {users.length} user{users.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {users.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-search text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <h5>No users found</h5>
                    <p className="text-muted">
                      No users found with the skill "{searchTerm}". Try searching for a different skill.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {users.map(user => (
                    <div key={user.id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="text-center mb-3">
                            <i className="fas fa-user-circle text-muted" style={{ fontSize: '3rem' }}></i>
                          </div>
                          
                          <h5 className="card-title text-center">{user.name}</h5>
                          
                          {/* Rating */}
                          <div className="text-center mb-3">
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

                          {/* Bio */}
                          {user.bio && (
                            <p className="card-text text-muted small mb-3">
                              {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
                            </p>
                          )}

                          {/* Skills */}
                          <div className="mb-3">
                            <h6 className="small fw-bold">Skills:</h6>
                            <div>
                              {user.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="skill-tag me-1 mb-1">
                                  {skill}
                                </span>
                              ))}
                              {user.skills.length > 3 && (
                                <span className="skill-tag">
                                  +{user.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="text-center">
                            <Link 
                              to={`/user/${user.id}`} 
                              className="btn btn-primary btn-sm"
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!searched && !loading && (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-search text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>Search for Users</h5>
                <p className="text-muted">
                  Enter a skill in the search box above to find users who can teach you that skill.
                </p>
                <div className="mt-4">
                  <h6>Popular Skills:</h6>
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                    {['JavaScript', 'Python', 'Guitar', 'Cooking', 'Photography', 'Spanish'].map(skill => (
                      <button
                        key={skill}
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setSearchTerm(skill);
                          handleSearch({ preventDefault: () => {} });
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
