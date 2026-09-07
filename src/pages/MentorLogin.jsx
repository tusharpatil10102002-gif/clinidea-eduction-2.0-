import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import AuthLayout from '../components/shared/AuthLayout';

const MentorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = `${BASE_URL}/api/mentor/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid mentor credentials. Please try again.');
      }
      
      localStorage.setItem('mentorToken', data.token);
      navigate('/mentor/dashboard'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Mentor Login | Clinidea Education LMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Faculty & Mentor Sign In" 
        subtitle="Sign in to manage batch schedules, study materials, and assessments" 
        role="mentor"
      >
        {error && (
          <div className="alert alert-danger p-3 rounded-3 text-start small mb-4 d-flex align-items-center gap-2" role="alert">
            <i className="fa fa-exclamation-circle fs-5 flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark small mb-1">Mentor Email Address</label>
            <div className="input-group input-group-modern">
              <span className="input-group-text">
                <i className="fa fa-envelope-o"></i>
              </span>
              <input 
                type="email" 
                name="email"
                className="form-control" 
                placeholder="mentor@clinidea.in"
                value={formData.email}
                onChange={handleChange}
                required 
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark small mb-1">Password</label>
            <div className="input-group input-group-modern">
              <span className="input-group-text">
                <i className="fa fa-lock"></i>
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="form-control" 
                placeholder="Enter mentor password"
                value={formData.password}
                onChange={handleChange}
                required 
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="btn btn-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-modern-submit w-100 mt-3 d-flex align-items-center justify-content-center gap-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating Faculty...</span>
              </>
            ) : (
              <>
                <i className="fa fa-chalkboard-teacher"></i>
                <span>Sign In to Mentor Portal</span>
              </>
            )}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default MentorLogin;
