import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
