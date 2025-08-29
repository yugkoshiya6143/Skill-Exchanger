import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessages, sendMessage } from '../api/messages';
import { updateRequestStatus } from '../api/requests';
import Loader from '../components/Loader';

const Chat = ({ currentUser }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (requestId) {
      fetchMessages();
      // Poll for new messages every 5 seconds
      pollIntervalRef.current = setInterval(fetchMessages, 5000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await getMessages(requestId);
      setMessages(response.data.messages);
      
      // Set other user info from first message
      if (response.data.messages.length > 0 && !otherUser) {
        const firstMessage = response.data.messages[0];
        const other = firstMessage.senderId._id === currentUser.id 
          ? firstMessage.receiverId 
          : firstMessage.senderId;
        setOtherUser(other);
      }
    } catch (error) {
      setError('Failed to load messages');
      if (error.response?.status === 404 || error.response?.status === 403) {
        navigate('/requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');
    
    try {
      await sendMessage({
        requestId,
        message: newMessage.trim()
      });
      
      setNewMessage('');
      // Immediately fetch messages to show the new one
      await fetchMessages();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleCompleteRequest = async () => {
    if (window.confirm('Are you sure you want to mark this exchange as completed?')) {
      try {
        await updateRequestStatus(requestId, 'Completed');
        navigate('/requests');
      } catch (error) {
        setError('Failed to complete request');
      }
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (loading) {
    return <Loader message="Loading chat..." />;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Chat Header */}
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary btn-sm me-3"
                  onClick={() => navigate('/requests')}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <div>
                  <h5 className="mb-0">
                    {otherUser ? `Chat with ${otherUser.name}` : 'Chat'}
                  </h5>
                  <small className="text-muted">Skill Exchange Chat</small>
                </div>
              </div>
              <button 
                className="btn btn-success btn-sm"
                onClick={handleCompleteRequest}
              >
                <i className="fas fa-check-circle me-1"></i>
                Mark Complete
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Chat Messages */}
          <div className="card mb-3">
            <div className="chat-container">
              {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-comments fa-3x mb-3"></i>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div>
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId._id === currentUser.id;
                    return (
                      <div
                        key={message._id}
                        className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            {!isCurrentUser && (
                              <small className="fw-bold d-block mb-1">
                                {message.senderId.name}
                              </small>
                            )}
                            <p className="mb-1">{message.message}</p>
                          </div>
                        </div>
                        <small className={`d-block mt-1 ${isCurrentUser ? 'text-end' : ''}`}>
                          {formatMessageTime(message.createdAt)}
                        </small>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    maxLength={500}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </button>
                </div>
                <small className="text-muted">
                  {newMessage.length}/500 characters
                </small>
              </form>
            </div>
          </div>

          {/* Chat Info */}
          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Messages are updated every 5 seconds. Be respectful and professional.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
