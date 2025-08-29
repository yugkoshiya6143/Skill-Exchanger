import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIncomingRequests, getSentRequests } from '../api/requests';
import Loader from '../components/Loader';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    incomingRequests: 0,
    sentRequests: 0,
    acceptedRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [incomingRes, sentRes] = await Promise.all([
          getIncomingRequests(),
          getSentRequests()
        ]);

        const incomingRequests = incomingRes.data.requests;
        const sentRequests = sentRes.data.requests;

        setStats({
          incomingRequests: incomingRequests.filter(req => req.status === 'Pending').length,
          sentRequests: sentRequests.length,
          acceptedRequests: [...incomingRequests, ...sentRequests].filter(req => req.status === 'Accepted').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div className="container py-5">
      {/* Welcome Header */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="welcome-header p-4 rounded-3 position-relative overflow-hidden"
               style={{ background: 'var(--primary-gradient)' }}>
            <div className="position-relative z-2">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="text-white mb-3 mb-md-0">
                  <h1 className="display-6 fw-bold mb-2">
                    Welcome back, {user.name}! 👋
                  </h1>
                  <p className="lead mb-0 opacity-90">
                    Ready to continue your skill exchange journey?
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/edit-profile" className="btn btn-light hover-lift">
                    <i className="fas fa-edit me-2"></i>
                    Edit Profile
                  </Link>
                  <Link to="/search" className="btn btn-outline-light hover-lift">
                    <i className="fas fa-search me-2"></i>
                    Find Skills
                  </Link>
                </div>
              </div>
            </div>
            <div className="position-absolute top-0 end-0 opacity-10">
              <i className="fas fa-graduation-cap" style={{ fontSize: '150px' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="row mb-5 g-4">
        <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
          <div className="stats-card card border-0 h-100 hover-lift">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stats-icon">
                  <div className="icon-circle bg-warning">
                    <i className="fas fa-inbox text-white"></i>
                  </div>
                </div>
                <div className="stats-badge">
                  <span className="badge bg-warning-subtle text-warning">New</span>
                </div>
              </div>
              <h3 className="fw-bold text-primary mb-1">{stats.incomingRequests}</h3>
              <h6 className="card-title text-muted mb-2">Pending Requests</h6>
              <p className="small text-muted mb-0">
                <i className="fas fa-arrow-up text-success me-1"></i>
                Requests waiting for your response
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
          <div className="stats-card card border-0 h-100 hover-lift">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stats-icon">
                  <div className="icon-circle bg-success">
                    <i className="fas fa-handshake text-white"></i>
                  </div>
                </div>
                <div className="stats-badge">
                  <span className="badge bg-success-subtle text-success">Active</span>
                </div>
              </div>
              <h3 className="fw-bold text-primary mb-1">{stats.acceptedRequests}</h3>
              <h6 className="card-title text-muted mb-2">Active Exchanges</h6>
              <p className="small text-muted mb-0">
                <i className="fas fa-chart-line text-success me-1"></i>
                Ongoing skill exchanges
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
          <div className="stats-card card border-0 h-100 hover-lift">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stats-icon">
                  <div className="icon-circle bg-info">
                    <i className="fas fa-paper-plane text-white"></i>
                  </div>
                </div>
                <div className="stats-badge">
                  <span className="badge bg-info-subtle text-info">Sent</span>
                </div>
              </div>
              <h3 className="fw-bold text-primary mb-1">{stats.sentRequests}</h3>
              <h6 className="card-title text-muted mb-2">Sent Requests</h6>
              <p className="small text-muted mb-0">
                <i className="fas fa-clock text-info me-1"></i>
                Requests you've sent out
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="h4 mb-3">Quick Actions</h3>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/search" className="card text-decoration-none h-100">
            <div className="card-body text-center">
              <i className="fas fa-search text-primary fa-3x mb-3"></i>
              <h5 className="card-title">Find Users</h5>
              <p className="card-text text-muted">Search for people with skills you want to learn</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/requests" className="card text-decoration-none h-100">
            <div className="card-body text-center">
              <i className="fas fa-handshake text-success fa-3x mb-3"></i>
              <h5 className="card-title">Manage Requests</h5>
              <p className="card-text text-muted">View and respond to skill exchange requests</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/profile" className="card text-decoration-none h-100">
            <div className="card-body text-center">
              <i className="fas fa-user text-info fa-3x mb-3"></i>
              <h5 className="card-title">My Profile</h5>
              <p className="card-text text-muted">View your profile and ratings</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/ratings" className="card text-decoration-none h-100">
            <div className="card-body text-center">
              <i className="fas fa-star text-warning fa-3x mb-3"></i>
              <h5 className="card-title">Ratings</h5>
              <p className="card-text text-muted">View ratings and give feedback</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Your Profile Summary</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Your Skills:</h6>
                  <div className="mb-3">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-tag me-1 mb-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <h6>Rating:</h6>
                  <div className="d-flex align-items-center">
                    <div className="rating-stars me-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <i 
                          key={star} 
                          className={`fas fa-star ${star <= user.avgRating ? '' : 'text-muted'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-muted">
                      {user.avgRating.toFixed(1)} ({user.ratingsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
