import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Main Navbar component - this creates the navigation bar at the top of the page
const Navbar = ({ user, logout }) => {
  // useNavigate helps us redirect users to different pages
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    logout(); // Call the logout function passed from parent
    navigate('/'); // Redirect user to home page after logout
  };

  // Get the first letter of user's name for avatar, or 'U' if no name
  const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Get user's display name, or 'User' if no name
  const displayName = user && user.name ? user.name : 'User';

  // Check if user is logged in
  const isLoggedIn = user !== null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg sticky-top">
      <div className="container">

        {/* Brand/Logo Section */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Icon circle for the logo */}
          <div className="icon-circle me-2" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
            <i className="fas fa-exchange-alt"></i>
          </div>
          {/* Site name */}
          <span className="fw-bold">Skill Exchanger</span>
        </Link>

        {/* Mobile menu toggle button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation menu items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Show these menu items only if user is logged in */}
            {isLoggedIn ? (
              <>
                {/* Dashboard link */}
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/dashboard">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>

                {/* Search users link */}
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/search">
                    <i className="fas fa-search me-2"></i>
                    <span>Search</span>
                  </Link>
                </li>

                {/* Requests link */}
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill position-relative" to="/requests">
                    <i className="fas fa-handshake me-2"></i>
                    <span>Requests</span>
                    {/* Note: You can add a notification badge here if needed */}
                  </Link>
                </li>

                {/* Profile link */}
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/profile">
                    <i className="fas fa-user me-2"></i>
                    <span>Profile</span>
                  </Link>
                </li>

                {/* User dropdown menu */}
                <li className="nav-item mx-1">
                  <div className="dropdown">
                    {/* Dropdown button with user avatar */}
                    <button
                      className="nav-link btn btn-link px-3 py-2 rounded-pill dropdown-toggle d-flex align-items-center"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}
                    >
                      {/* User avatar circle with first letter of name */}
                      <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2"
                        style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}
                      >
                        {userInitial}
                      </div>
                      {/* User name (hidden on small screens) */}
                      <span className="d-none d-lg-inline">{displayName}</span>
                    </button>

                    {/* Dropdown menu items */}
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2">
                      {/* My Profile link */}
                      <li>
                        <Link className="dropdown-item py-2" to="/profile">
                          <i className="fas fa-user me-2"></i>
                          My Profile
                        </Link>
                      </li>

                      {/* Edit Profile link */}
                      <li>
                        <Link className="dropdown-item py-2" to="/edit-profile">
                          <i className="fas fa-edit me-2"></i>
                          Edit Profile
                        </Link>
                      </li>

                      {/* My Ratings link */}
                      <li>
                        <Link className="dropdown-item py-2" to="/ratings">
                          <i className="fas fa-star me-2"></i>
                          My Ratings
                        </Link>
                      </li>

                      {/* Divider line */}
                      <li><hr className="dropdown-divider" /></li>

                      {/* Logout button */}
                      <li>
                        <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </>
            ) : (
              /* Show these menu items only if user is NOT logged in */
              <>
                {/* Login link */}
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/login">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Link>
                </li>

                {/* Register/Join button */}
                <li className="nav-item mx-1">
                  <Link className="btn btn-primary px-4 py-2 rounded-pill" to="/register">
                    <i className="fas fa-user-plus me-2"></i>
                    Join Now
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
