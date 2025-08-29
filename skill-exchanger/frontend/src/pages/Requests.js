import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIncomingRequests, getSentRequests, updateRequestStatus } from '../api/requests';
import Loader from '../components/Loader';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [incomingRes, sentRes] = await Promise.all([
        getIncomingRequests(),
        getSentRequests()
      ]);
      
      setIncomingRequests(incomingRes.data.requests);
      setSentRequests(sentRes.data.requests);
    } catch (error) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    setActionLoading({ ...actionLoading, [requestId]: true });
    setError('');
    setSuccess('');
    
    try {
      await updateRequestStatus(requestId, status);
      
      // Refresh requests
      await fetchRequests();
      
      const actionText = status === 'Accepted' ? 'accepted' : 
                        status === 'Rejected' ? 'rejected' : 'marked as completed';
      setSuccess(`Request ${actionText} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${status.toLowerCase()} request`);
    } finally {
      setActionLoading({ ...actionLoading, [requestId]: false });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'bg-warning',
      'Accepted': 'bg-success',
      'Rejected': 'bg-danger',
      'Completed': 'bg-info'
    };
    return `badge ${badges[status] || 'bg-secondary'}`;
  };

  const renderRequestCard = (request, isIncoming = true) => {
    const otherUser = isIncoming ? request.senderId : request.receiverId;
    const canChat = request.status === 'Accepted' || request.status === 'Completed';
    
    return (
      <div key={request._id} className="card mb-3">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-user-circle text-muted me-2" style={{ fontSize: '2rem' }}></i>
                <div>
                  <h6 className="mb-0">{otherUser.name}</h6>
                  <small className="text-muted">{otherUser.email}</small>
                </div>
                <span className={`${getStatusBadge(request.status)} ms-auto`}>
                  {request.status}
                </span>
              </div>
              
              <div className="mb-2">
                <strong>Exchange:</strong> {request.skillOffered} ↔ {request.skillRequested}
              </div>
              
              {request.message && (
                <div className="mb-2">
                  <strong>Message:</strong> {request.message}
                </div>
              )}
              
              <small className="text-muted">
                {isIncoming ? 'Received' : 'Sent'} on {new Date(request.createdAt).toLocaleDateString()}
              </small>
            </div>
            
            <div className="col-md-4 text-end">
              {isIncoming && request.status === 'Pending' && (
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleRequestAction(request._id, 'Accepted')}
                    disabled={actionLoading[request._id]}
                  >
                    {actionLoading[request._id] ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <>
                        <i className="fas fa-check me-1"></i>
                        Accept
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRequestAction(request._id, 'Rejected')}
                    disabled={actionLoading[request._id]}
                  >
                    <i className="fas fa-times me-1"></i>
                    Reject
                  </button>
                </div>
              )}
              
              {request.status === 'Accepted' && (
                <div className="d-flex gap-2 justify-content-end">
                  <Link
                    to={`/chat/${request._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="fas fa-comments me-1"></i>
                    Chat
                  </Link>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleRequestAction(request._id, 'Completed')}
                    disabled={actionLoading[request._id]}
                  >
                    <i className="fas fa-check-circle me-1"></i>
                    Complete
                  </button>
                </div>
              )}
              
              {canChat && (
                <div className="mt-2">
                  <Link
                    to={`/user/${otherUser._id}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="fas fa-user me-1"></i>
                    View Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader message="Loading requests..." />;
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Skill Exchange Requests</h2>
          
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
                className={`nav-link ${activeTab === 'incoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('incoming')}
              >
                Incoming Requests
                {incomingRequests.filter(req => req.status === 'Pending').length > 0 && (
                  <span className="badge bg-danger ms-2">
                    {incomingRequests.filter(req => req.status === 'Pending').length}
                  </span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'sent' ? 'active' : ''}`}
                onClick={() => setActiveTab('sent')}
              >
                Sent Requests
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'incoming' && (
              <div>
                {incomingRequests.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="fas fa-inbox text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                      <h5>No Incoming Requests</h5>
                      <p className="text-muted">
                        You haven't received any skill exchange requests yet.
                      </p>
                      <Link to="/search" className="btn btn-primary">
                        <i className="fas fa-search me-2"></i>
                        Find Users to Connect With
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {incomingRequests.map(request => renderRequestCard(request, true))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div>
                {sentRequests.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="fas fa-paper-plane text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                      <h5>No Sent Requests</h5>
                      <p className="text-muted">
                        You haven't sent any skill exchange requests yet.
                      </p>
                      <Link to="/search" className="btn btn-primary">
                        <i className="fas fa-search me-2"></i>
                        Search for Users
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {sentRequests.map(request => renderRequestCard(request, false))}
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

export default Requests;
