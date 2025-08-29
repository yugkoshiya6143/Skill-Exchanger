import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '5rem' }}></i>
          </div>
          <h1 className="display-4 fw-bold mb-3">404</h1>
          <h2 className="mb-3">Page Not Found</h2>
          <p className="lead text-muted mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-2"></i>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
