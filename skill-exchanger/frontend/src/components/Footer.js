import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="text-center">
              <div className="footer-brand mb-4">
                <h4 className="fw-bold d-flex align-items-center justify-content-center">
                  <div className="icon-circle me-3" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                    <i className="fas fa-exchange-alt"></i>
                  </div>
                  Skill Exchanger
                </h4>
                <p className="mb-4">
                  Connect, learn, and grow by exchanging skills with others in your community.
                </p>
              </div>

              {/* Contact Information */}
              <div className="contact-info mb-4">
                <h6 className="fw-bold mb-3">Contact Us</h6>
                <div className="row justify-content-center">
                  <div className="col-md-6 mb-3">
                    <div className="contact-item">
                      <div className="contact-icon mb-2">
                        <i className="fas fa-envelope text-primary fs-4"></i>
                      </div>
                      <h6 className="mb-1">Email</h6>
                      <a href="mailto:info@skillexchanger.com" className="contact-link">
                        info@skillexchanger.com
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="contact-item">
                      <div className="contact-icon mb-2">
                        <i className="fas fa-phone text-primary fs-4"></i>
                      </div>
                      <h6 className="mb-1">Phone</h6>
                      <a href="tel:+9016295514" className="contact-link">
                        9016295514
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 opacity-25" />

        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 small">
              &copy; {currentYear} Skill Exchanger. All rights reserved.
            </p>
            <small className="text-muted mt-2 d-block">
              Made with me
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
