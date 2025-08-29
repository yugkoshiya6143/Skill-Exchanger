import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
              <div className="hero-content">
                <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInUp">
                  Exchange Skills,<br />
                  <span className="text-warning">Grow Together</span>
                </h1>
                <p className="lead mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                  Connect with people in your community to share knowledge, learn new skills,
                  and build meaningful relationships through skill exchange.
                </p>
                <div className="hero-stats mb-4 animate__animated animate__fadeInUp animate__delay-2s">
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="stat-item">
                        <h3 className="fw-bold mb-1">1000+</h3>
                        <small className="text-light">Active Users</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="stat-item">
                        <h3 className="fw-bold mb-1">500+</h3>
                        <small className="text-light">Skills Shared</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="stat-item">
                        <h3 className="fw-bold mb-1">2000+</h3>
                        <small className="text-light">Exchanges</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column flex-sm-row gap-3 animate__animated animate__fadeInUp animate__delay-3s">
                  <Link to="/register" className="btn btn-light btn-lg px-5 hover-lift">
                    <i className="fas fa-rocket me-2"></i>
                    Start Your Journey
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-5 hover-lift">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Welcome Back
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
              <div className="hero-illustration text-center position-relative">
                <div className="floating-elements">
                  <div className="floating-icon" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>
                    <i className="fas fa-code text-warning"></i>
                  </div>
                  <div className="floating-icon" style={{ top: '20%', right: '15%', animationDelay: '1s' }}>
                    <i className="fas fa-paint-brush text-info"></i>
                  </div>
                  <div className="floating-icon" style={{ bottom: '30%', left: '20%', animationDelay: '2s' }}>
                    <i className="fas fa-music text-success"></i>
                  </div>
                  <div className="floating-icon" style={{ bottom: '15%', right: '10%', animationDelay: '3s' }}>
                    <i className="fas fa-camera text-danger"></i>
                  </div>
                </div>
                <div className="main-hero-icon">
                  <i className="fas fa-handshake animate__animated animate__pulse animate__infinite"
                     style={{ fontSize: '200px', opacity: 0.9, color: 'rgba(255,255,255,0.8)' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-pattern">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5" data-aos="fade-up">
              <h2 className="display-5 fw-bold section-title">How It Works</h2>
              <p className="lead text-muted">Simple steps to start your skill exchange journey</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card h-100 border-0 hover-lift text-center position-relative">
                <div className="card-body p-4">
                  <div className="step-number position-absolute top-0 start-50 translate-middle">
                    <span className="badge bg-primary rounded-circle p-3 fs-5">1</span>
                  </div>
                  <div className="icon-circle mx-auto mb-4 mt-3">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Create Your Profile</h5>
                  <p className="card-text text-muted">
                    Sign up and showcase your skills. Tell the community what you can teach
                    and what you're eager to learn.
                  </p>
                  <div className="mt-3">
                    <small className="text-primary fw-semibold">
                      <i className="fas fa-clock me-1"></i>
                      Takes 5 minutes
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 border-0 hover-lift text-center position-relative">
                <div className="card-body p-4">
                  <div className="step-number position-absolute top-0 start-50 translate-middle">
                    <span className="badge bg-primary rounded-circle p-3 fs-5">2</span>
                  </div>
                  <div className="icon-circle mx-auto mb-4 mt-3">
                    <i className="fas fa-search"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Find & Connect</h5>
                  <p className="card-text text-muted">
                    Discover amazing people with skills you want to learn. Send personalized
                    exchange requests and start building connections.
                  </p>
                  <div className="mt-3">
                    <small className="text-primary fw-semibold">
                      <i className="fas fa-users me-1"></i>
                      1000+ active users
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card h-100 border-0 hover-lift text-center position-relative">
                <div className="card-body p-4">
                  <div className="step-number position-absolute top-0 start-50 translate-middle">
                    <span className="badge bg-primary rounded-circle p-3 fs-5">3</span>
                  </div>
                  <div className="icon-circle mx-auto mb-4 mt-3">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Exchange & Grow</h5>
                  <p className="card-text text-muted">
                    Meet up, share knowledge, and learn together. Rate your experiences
                    and help build a trusted community.
                  </p>
                  <div className="mt-3">
                    <small className="text-primary fw-semibold">
                      <i className="fas fa-star me-1"></i>
                      4.9/5 average rating
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Flow Arrows */}
          <div className="row mt-4 d-none d-md-block">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center">
                <div className="process-arrow mx-4">
                  <i className="fas fa-arrow-right text-primary fs-2 opacity-50"></i>
                </div>
                <div className="process-arrow mx-4" style={{ marginLeft: '200px' }}>
                  <i className="fas fa-arrow-right text-primary fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold">Why Choose Skill Exchanger?</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="d-flex">
                <div className="me-3">
                  <i className="fas fa-shield-alt text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h5>Safe & Secure</h5>
                  <p className="text-muted">
                    User verification and rating system ensures safe skill exchanges.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="d-flex">
                <div className="me-3">
                  <i className="fas fa-comments text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h5>Built-in Chat</h5>
                  <p className="text-muted">
                    Communicate directly with other users through our messaging system.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="d-flex">
                <div className="me-3">
                  <i className="fas fa-star text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h5>Rating System</h5>
                  <p className="text-muted">
                    Rate and review your skill exchange experiences to help others.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="d-flex">
                <div className="me-3">
                  <i className="fas fa-globe text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h5>Community Driven</h5>
                  <p className="text-muted">
                    Join a growing community of learners and skill sharers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
