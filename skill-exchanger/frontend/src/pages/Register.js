// Import required React components and functions
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { register } from '../api/auth';

const Register = ({ login }) => {
  // State to store form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: ''
  });

  // State to store form validation errors
  const [errors, setErrors] = useState({});

  // State to show loading spinner during registration
  const [loading, setLoading] = useState(false);

  // Hook to navigate to different pages
  const navigate = useNavigate();

  // Function to handle input changes
  const handleChange = (e) => {
    // Update form data with new input value
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear error message when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  // Function to validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Check if name is valid
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Check if email format is valid
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Check if password is long enough
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Check if at least one skill is provided
    if (!formData.skills.trim()) {
      newErrors.skills = 'Please enter at least one skill';
    }

    // Update errors state and return true if no errors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Validate form before submitting
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setLoading(true); // Show loading spinner

    try {
      // Convert skills string to array (split by comma)
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim()) // Remove extra spaces
        .filter(skill => skill); // Remove empty skills

      // Send registration request to backend
      const response = await register({
        ...formData,
        skills: skillsArray
      });

      // If successful, log user in and go to dashboard
      login(response.data.user, response.data.token);
      navigate('/dashboard');

    } catch (error) {
      // If registration fails, show error message
      setErrors({
        submit: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join our skill exchange community</p>
              </div>

              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  error={errors.name}
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  error={errors.email}
                />

                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  error={errors.password}
                />

                <FormInput
                  label="Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, Guitar, Cooking (comma-separated)"
                  required
                  error={errors.skills}
                />

                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    {errors.submit}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? 
                    <Link to="/login" className="text-decoration-none ms-1">
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
