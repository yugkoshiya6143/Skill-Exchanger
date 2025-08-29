// Import React and required components
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import all page components
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import SearchUsers from './pages/SearchUsers';
import ViewProfile from './pages/ViewProfile';
import Requests from './pages/Requests';
import Chat from './pages/Chat';
import Ratings from './pages/Ratings';
import NotFound from './pages/NotFound';

// Import API function
import { getCurrentUser } from './api/auth';

function App() {
  // State to store current logged-in user
  const [user, setUser] = useState(null);
  // State to show loading while checking if user is logged in
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, get user information
      getCurrentUser()
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // If token is invalid, remove it
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // No token found, user is not logged in
      setLoading(false);
    }
  }, []);

  // Function to handle user login
  const login = (userData, token) => {
    localStorage.setItem('token', token); // Save token to browser
    setUser(userData); // Set user data in state
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from browser
    setUser(null); // Clear user data from state
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar user={user} logout={logout} />
      <main>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register login={login} />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login login={login} />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/edit-profile" element={
            <ProtectedRoute user={user}>
              <EditProfile user={user} setUser={setUser} />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute user={user}>
              <SearchUsers />
            </ProtectedRoute>
          } />
          
          <Route path="/user/:userId" element={
            <ProtectedRoute user={user}>
              <ViewProfile currentUser={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/requests" element={
            <ProtectedRoute user={user}>
              <Requests />
            </ProtectedRoute>
          } />
          
          <Route path="/chat/:requestId" element={
            <ProtectedRoute user={user}>
              <Chat currentUser={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/ratings" element={
            <ProtectedRoute user={user}>
              <Ratings currentUser={user} />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
